import { createHash } from 'node:crypto';

export const MAX_WAV_BYTES = 12 * 1024 * 1024;
export const sha256 = (bytes: Uint8Array | string): string => createHash('sha256').update(bytes).digest('hex');

/** Strict PCM16 reader: checks boundaries, padding, format and non-empty audio. */
export function inspectWav(bytes: Buffer) {
  if (bytes.length < 44 || bytes.length > MAX_WAV_BYTES) throw new Error('WAV_SIZE');
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('WAV_CONTAINER');
  }
  if (bytes.readUInt32LE(4) + 8 !== bytes.length) throw new Error('WAV_TRUNCATED_OR_TRAILING');
  let format: Buffer | undefined;
  let data: Buffer | undefined;
  let offset = 12;
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) throw new Error('WAV_CHUNK_HEADER');
    const id = bytes.toString('ascii', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    const end = start + size;
    const next = end + (size % 2);
    if (next > bytes.length) throw new Error('WAV_CHUNK_TRUNCATED');
    if (id === 'fmt ') {
      if (format) throw new Error('WAV_DUPLICATE_FORMAT');
      format = bytes.subarray(start, end);
    }
    if (id === 'data') {
      if (data) throw new Error('WAV_DUPLICATE_DATA');
      data = bytes.subarray(start, end);
    }
    offset = next;
  }
  if (!format || format.length < 16 || !data || data.length === 0) throw new Error('WAV_MISSING_AUDIO');
  const codec = format.readUInt16LE(0);
  const channels = format.readUInt16LE(2);
  const sampleRateHz = format.readUInt32LE(4);
  const byteRate = format.readUInt32LE(8);
  const blockAlign = format.readUInt16LE(12);
  const bits = format.readUInt16LE(14);
  if (codec !== 1 || channels !== 1 || bits !== 16 || ![16000, 44100].includes(sampleRateHz)) {
    throw new Error('WAV_EXPECTED_PCM16_MONO_16000_OR_44100');
  }
  if (blockAlign !== 2 || byteRate !== sampleRateHz * 2 || data.length % 2) throw new Error('WAV_ALIGNMENT');
  const durationMs = data.length / byteRate * 1000;
  if (durationMs < 100 || durationMs > 120000) throw new Error('WAV_DURATION');
  let peak = 0;
  let squared = 0;
  let clipped = 0;
  for (let i = 0; i < data.length; i += 2) {
    const sample = Math.abs(data.readInt16LE(i));
    peak = Math.max(peak, sample);
    squared += sample * sample;
    if (sample >= 32767) clipped++;
  }
  if (peak === 0) throw new Error('WAV_DIGITAL_SILENCE');
  return {
    sha256: sha256(bytes), bytes: bytes.length, sampleRateHz, channels, bits, durationMs,
    peak, rms: Math.sqrt(squared / (data.length / 2)), clippedSamples: clipped,
    humanListeningRequired: true as const
  };
}
