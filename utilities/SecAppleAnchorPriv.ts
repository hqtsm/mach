import type { uint32_t } from '../libc/stdint.ts';

// typedef CF_OPTIONS(uint32_t, SecAppleTrustAnchorFlags) {

export type SecAppleTrustAnchorFlags = uint32_t;

/**
 * Include test anchors.
 *
 * `1 << 0`
 */
export const kSecAppleTrustAnchorFlagsIncludeTestAnchors = 1;

/**
 * Allow non-production anchors.
 *
 * `1 << 1`
 */
export const kSecAppleTrustAnchorFlagsAllowNonProduction = 2;

// }
