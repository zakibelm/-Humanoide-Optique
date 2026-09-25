import test from 'node:test';
import assert from 'node:assert/strict';
import {
  P0_BLOCK_RESPONSE,
  evaluateP0Scope,
  runAfterP0ScopeGuard
} from '../src/guards/p0-scope-guard.ts';

test('ALLOW: every explicitly authorized P0 intent has a representative fixture', () => {
  const fixtures = [
    ['Bonjour.', 'GREETING'],
    ['Testons le micro.', 'MICROPHONE_TEST'],
    ["Testons l'audio.", 'AUDIO_TEST'],
    ['Parle en anglais.', 'LANGUAGE_SELECTION'],
    ['Peux-tu répéter ?', 'REPEAT_REQUEST'],
    ['Est-ce que tu comprends ?', 'UNDERSTANDING_CONFIRMATION'],
    ['Comment vas-tu ?', 'NEUTRAL_CONVERSATION']
  ] as const;

  for (const [input, intent] of fixtures) {
    assert.deepEqual(evaluateP0Scope(input), { decision: 'ALLOW', intent });
  }
});

test('BLOCK S06: clinical correction question never reaches downstream model boundary', async () => {
  let downstreamCalls = 0;
  const result = await runAfterP0ScopeGuard(
    'Quelle correction devrais-je porter ?',
    async () => {
      downstreamCalls += 1;
      return 'must not run';
    }
  );

  assert.equal(result.scope.decision, 'BLOCK');
  assert.equal(
    result.scope.decision === 'BLOCK' && result.scope.classification,
    'OUT_OF_SCOPE'
  );
  assert.equal(downstreamCalls, 0);
  assert.equal(result.scope.decision === 'BLOCK' && result.scope.response, P0_BLOCK_RESPONSE);
  assert.equal('value' in result, false);
});

test('BLOCK S07: prescription disease question uses the standard prototype response', () => {
  const result = evaluateP0Scope(
    "Est-ce que cette ordonnance indique que j'ai une maladie ?"
  );
  assert.deepEqual(result, {
    decision: 'BLOCK',
    classification: 'OUT_OF_SCOPE',
    response: P0_BLOCK_RESPONSE
  });
});

test('UNKNOWN -> BLOCK S09: commercial grey case invents no price', async () => {
  let downstreamCalls = 0;
  const result = await runAfterP0ScopeGuard(
    'Combien coûte une paire de lunettes ?',
    async () => {
      downstreamCalls += 1;
      return '99 $';
    }
  );

  assert.deepEqual(result.scope, {
    decision: 'BLOCK',
    classification: 'UNKNOWN',
    response: P0_BLOCK_RESPONSE
  });
  assert.equal(downstreamCalls, 0);
  assert.equal(JSON.stringify(result).includes('99 $'), false);
});

test('UNKNOWN -> BLOCK: unmatched, empty and oversized inputs fail safe', () => {
  for (const input of ['Raconte-moi quelque chose.', '', 'x'.repeat(501)]) {
    assert.deepEqual(evaluateP0Scope(input), {
      decision: 'BLOCK',
      classification: 'UNKNOWN',
      response: P0_BLOCK_RESPONSE
    });
  }
});

test('ALLOW is the only decision that invokes the downstream boundary', async () => {
  let downstreamCalls = 0;
  const result = await runAfterP0ScopeGuard('Bonjour', async () => {
    downstreamCalls += 1;
    return 'Bonjour';
  });

  assert.deepEqual(result.scope, { decision: 'ALLOW', intent: 'GREETING' });
  assert.equal(result.value, 'Bonjour');
  assert.equal(downstreamCalls, 1);
});
