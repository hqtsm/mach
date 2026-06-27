import type { PLData } from '@hqtsm/plist';

/**
 * CF data.
 *
 * @template T Buffer type.
 */
export type CFDataRef<T extends ArrayBufferLike = ArrayBuffer> = PLData<T>;

/**
 * CF mutable data.
 */
export type CFMutableDataRef = PLData;
