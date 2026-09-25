import type { AudioFrame, RequestContext } from './common.ts';

export interface STTRequest extends RequestContext {
  readonly audio: AsyncIterable<AudioFrame>;
}

export type TranscriptEvent =
  | { readonly kind: 'partial'; readonly text: string }
  | { readonly kind: 'final'; readonly text: string };

/** Accepts progressive microphone frames and yields partial/final text. */
export interface STTProvider {
  transcribe(request: STTRequest): AsyncIterable<TranscriptEvent>;
}
