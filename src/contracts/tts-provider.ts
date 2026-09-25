import type { AudioFrame, RequestContext } from './common.ts';

export interface TTSRequest extends RequestContext {
  readonly text: AsyncIterable<string>;
  readonly voiceId: string;
}

/** Yields encoded audio progressively. Playback timing belongs to a later runtime. */
export interface TTSProvider {
  synthesize(request: TTSRequest): AsyncIterable<AudioFrame>;
}
