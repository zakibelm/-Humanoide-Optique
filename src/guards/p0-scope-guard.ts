export const P0_BLOCK_RESPONSE =
  'Cette version est actuellement un prototype technique de conversation et ne traite pas encore les questions professionnelles ou cliniques.';

export type P0AllowedIntent =
  | 'GREETING'
  | 'MICROPHONE_TEST'
  | 'AUDIO_TEST'
  | 'LANGUAGE_SELECTION'
  | 'REPEAT_REQUEST'
  | 'UNDERSTANDING_CONFIRMATION'
  | 'NEUTRAL_CONVERSATION';

export type P0ScopeResult =
  | { readonly decision: 'ALLOW'; readonly intent: P0AllowedIntent }
  | {
      readonly decision: 'BLOCK';
      readonly classification: 'OUT_OF_SCOPE' | 'UNKNOWN';
      readonly response: typeof P0_BLOCK_RESPONSE;
    };

const ALLOWLIST: readonly [P0AllowedIntent, RegExp][] = [
  ['GREETING', /^(bonjour|bonsoir|salut|allo|hello|hi)[!.? ]*$/u],
  [
    'MICROPHONE_TEST',
    /^(test(?:ons)? (?:le |du |mon )?micro(?:phone)?|(?:est-ce que )?(?:le |mon )?micro(?:phone)? (?:fonctionne|marche)|(?:peux-tu|pouvez-vous|tu peux) m'entendre)[!.? ]*$/u
  ],
  [
    'AUDIO_TEST',
    /^(test(?:ons)? (?:l'|le |du )?audio|test(?:ons)? (?:le |du )?son|(?:est-ce que )?(?:l'audio|le son) (?:fonctionne|marche))[!.? ]*$/u
  ],
  [
    'LANGUAGE_SELECTION',
    /^(?:(?:change|changer|mets|mettre|passe|passer) (?:la langue )?(?:en |à )?(?:français|anglais|arabe)|(?:parle|parler) (?:en )?(?:français|anglais|arabe))[!.? ]*$/u
  ],
  [
    'REPEAT_REQUEST',
    /^(?:répète|répétez|peux-tu répéter|pouvez-vous répéter|dis-le encore|dites-le encore)[!.? ]*$/u
  ],
  [
    'UNDERSTANDING_CONFIRMATION',
    /^(?:as-tu compris|avez-vous compris|tu comprends|vous comprenez|est-ce que tu comprends|est-ce que vous comprenez)[!.? ]*$/u
  ],
  [
    'NEUTRAL_CONVERSATION',
    /^(?:comment vas-tu|comment allez-vous|ça va|ca va|merci|au revoir|à bientôt)[!.? ]*$/u
  ]
];

const OUT_OF_SCOPE_PATTERNS: readonly RegExp[] = [
  /\b(?:diagnostic|diagnostiquer|maladie|maladies|traitement|thérapie|therapie|prescription)\b/u,
  /\b(?:ordonnance|correction|corriger|verres? progressifs?|lentilles?)\b/u,
  /\b(?:myopie|hypermetropie|hypermétropie|astigmatisme|presbytie|glaucome|cataracte)\b/u,
  /\b(?:opticien|optométriste|optometriste|ophtalmologiste|clinique|médical|medical)\b/u
];

function normalize(input: string): string {
  return input
    .normalize('NFC')
    .toLocaleLowerCase('fr-CA')
    .trim()
    .replace(/\s+/gu, ' ');
}

/**
 * Deterministic, server-side P0 boundary. Only explicit allowlist matches pass.
 * Denylist matches improve audit classification; they never grant access.
 * Every unmatched or malformed input is UNKNOWN -> BLOCK.
 */
export function evaluateP0Scope(input: string): P0ScopeResult {
  const normalized = normalize(input);

  if (normalized.length === 0 || normalized.length > 500) {
    return { decision: 'BLOCK', classification: 'UNKNOWN', response: P0_BLOCK_RESPONSE };
  }

  for (const [intent, pattern] of ALLOWLIST) {
    if (pattern.test(normalized)) return { decision: 'ALLOW', intent };
  }

  if (OUT_OF_SCOPE_PATTERNS.some(pattern => pattern.test(normalized))) {
    return { decision: 'BLOCK', classification: 'OUT_OF_SCOPE', response: P0_BLOCK_RESPONSE };
  }

  return { decision: 'BLOCK', classification: 'UNKNOWN', response: P0_BLOCK_RESPONSE };
}

/**
 * Mandatory pre-model call site. onAllow represents the future LLM boundary,
 * but M2 connects no provider and makes no model call itself.
 */
export async function runAfterP0ScopeGuard<T>(
  input: string,
  onAllow: () => Promise<T>
): Promise<{ readonly scope: P0ScopeResult; readonly value?: T }> {
  const scope = evaluateP0Scope(input);
  if (scope.decision === 'BLOCK') return { scope };
  return { scope, value: await onAllow() };
}
