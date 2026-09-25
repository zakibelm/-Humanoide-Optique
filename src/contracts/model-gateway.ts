import type { RequestContext } from './common.ts';

export interface ModelMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export interface ModelRequest extends RequestContext {
  readonly messages: readonly ModelMessage[];
  readonly taskType: string;
  readonly requiredCapabilities: readonly string[];
  /** Configured outside core; never hardcode a provider model in business logic. */
  readonly modelId: string;
}

export type ModelEvent =
  | { readonly kind: 'text_delta'; readonly text: string }
  | { readonly kind: 'completed'; readonly finishReason: 'stop' | 'length' | 'other' };

/** The caller consumes events progressively; an adapter owns its SDK. */
export interface ModelGateway {
  generate(request: ModelRequest): AsyncIterable<ModelEvent>;
}
