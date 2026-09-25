import test from 'node:test';
import assert from 'node:assert/strict';
import type { AudioFrame, RequestContext } from '../src/contracts/common.ts';
import type { ModelEvent, ModelGateway, ModelRequest } from '../src/contracts/model-gateway.ts';
import type { STTProvider, STTRequest, TranscriptEvent } from '../src/contracts/stt-provider.ts';
import type { TTSProvider, TTSRequest } from '../src/contracts/tts-provider.ts';

const context: RequestContext = {
  traceId: 'trace-1', sessionId: 'session-1', requestId: 'request-1', locale: 'fr-CA'
};
const frame: AudioFrame = {
  data: Uint8Array.from([1, 2]), mimeType: 'audio/pcm', sampleRateHz: 16000, channels: 1
};
async function* oneFrame(): AsyncIterable<AudioFrame> { yield frame; }
async function* oneText(): AsyncIterable<string> { yield 'Bonjour'; }

function modelDouble(text: string): ModelGateway {
  return {
    async *generate(request: ModelRequest): AsyncIterable<ModelEvent> {
      assert.equal(request.modelId, 'configured-model');
      assert.equal(request.locale, 'fr-CA');
      if (request.signal?.aborted) throw request.signal.reason;
      yield { kind: 'text_delta', text };
      yield { kind: 'completed', finishReason: 'stop' };
    }
  };
}
function sttDouble(text: string): STTProvider {
  return {
    async *transcribe(request: STTRequest): AsyncIterable<TranscriptEvent> {
      for await (const input of request.audio) assert.deepEqual(input, frame);
      if (request.signal?.aborted) throw request.signal.reason;
      yield { kind: 'partial', text: text.slice(0, 3) };
      yield { kind: 'final', text };
    }
  };
}
function ttsDouble(byte: number): TTSProvider {
  return {
    async *synthesize(request: TTSRequest): AsyncIterable<AudioFrame> {
      assert.equal(request.voiceId, 'configured-voice');
      assert.deepEqual(await Array.fromAsync(request.text), ['Bonjour']);
      if (request.signal?.aborted) throw request.signal.reason;
      yield { ...frame, data: Uint8Array.from([byte]) };
    }
  };
}

test('two model doubles satisfy one streaming consumer without changing its core call', async () => {
  async function consume(provider: ModelGateway) {
    return Array.fromAsync(provider.generate({ ...context, messages: [{ role: 'user', content: 'Bonjour' }], taskType: 'technical_test', requiredCapabilities: [], modelId: 'configured-model' }));
  }
  for (const provider of [modelDouble('A'), modelDouble('B')]) {
    const events = await consume(provider);
    assert.deepEqual(events.map(e => e.kind), ['text_delta', 'completed']);
  }
});

test('two STT doubles consume progressive frames and emit partial then final', async () => {
  for (const provider of [sttDouble('Bonjour'), sttDouble('Bonsoir')]) {
    const events = await Array.fromAsync(provider.transcribe({ ...context, audio: oneFrame() }));
    assert.deepEqual(events.map(e => e.kind), ['partial', 'final']);
    assert.ok(events[1].text.length > events[0].text.length);
  }
});

test('two TTS doubles consume streaming text and emit codec-described audio', async () => {
  for (const provider of [ttsDouble(3), ttsDouble(4)]) {
    const chunks = await Array.fromAsync(provider.synthesize({ ...context, text: oneText(), voiceId: 'configured-voice' }));
    assert.equal(chunks.length, 1);
    assert.equal(chunks[0].mimeType, 'audio/pcm');
    assert.equal(chunks[0].sampleRateHz, 16000);
  }
});

test('cancellation propagates through each of the three contracts', async () => {
  const controller = new AbortController();
  controller.abort(new Error('cancelled'));
  await assert.rejects(Array.fromAsync(modelDouble('A').generate({ ...context, signal: controller.signal, messages: [], taskType: 'test', requiredCapabilities: [], modelId: 'configured-model' })), /cancelled/);
  await assert.rejects(Array.fromAsync(sttDouble('Bonjour').transcribe({ ...context, signal: controller.signal, audio: oneFrame() })), /cancelled/);
  await assert.rejects(Array.fromAsync(ttsDouble(3).synthesize({ ...context, signal: controller.signal, text: oneText(), voiceId: 'configured-voice' })), /cancelled/);
});
