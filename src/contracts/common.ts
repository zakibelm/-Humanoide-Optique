/** Provider-neutral identities; the runtime will assign values in a later milestone. */
export interface RequestContext {
  readonly traceId: string;
  readonly sessionId: string;
  readonly requestId: string;
  readonly locale: string;
  readonly signal?: AbortSignal;
}

export interface ProviderError extends Error {
  readonly code: string;
  readonly retryable: boolean;
}

/** Frames are encoded bytes; codec, channel count and rate must travel with them. */
export interface AudioFrame {
  readonly data: Uint8Array;
  readonly mimeType: string;
  readonly sampleRateHz: number;
  readonly channels: number;
}
