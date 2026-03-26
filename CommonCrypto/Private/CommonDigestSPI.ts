// deno-lint-ignore-file camelcase

import type { uint32_t } from '../../libc/stdint.ts';

// CCDigestAlgorithm:
// enum {

/**
 * CommonCrypto digest algorithm: none.
 */
export const kCCDigestNone = 0;

/**
 * CommonCrypto digest algorithm: MD2.
 */
export const kCCDigestMD2 = 1;

/**
 * CommonCrypto digest algorithm: MD4.
 */
export const kCCDigestMD4 = 2;

/**
 * CommonCrypto digest algorithm: MD5.
 */
export const kCCDigestMD5 = 3;

/**
 * CommonCrypto digest algorithm: RIPEMD-160.
 */
export const kCCDigestRMD160 = 5;

/**
 * CommonCrypto digest algorithm: SHA-1.
 */
export const kCCDigestSHA1 = 8;

/**
 * CommonCrypto digest algorithm: SHA-224.
 */
export const kCCDigestSHA224 = 9;

/**
 * CommonCrypto digest algorithm: SHA-256.
 */
export const kCCDigestSHA256 = 10;

/**
 * CommonCrypto digest algorithm: SHA-384.
 */
export const kCCDigestSHA384 = 11;

/**
 * CommonCrypto digest algorithm: SHA-512.
 */
export const kCCDigestSHA512 = 12;

/**
 * CommonCrypto digest algorithm: SHA3-224.
 */
export const kCCDigestSHA3_224 = 13;

/**
 * CommonCrypto digest algorithm: SHA3-256.
 */
export const kCCDigestSHA3_256 = 14;

/**
 * CommonCrypto digest algorithm: SHA3-384.
 */
export const kCCDigestSHA3_384 = 15;

/**
 * CommonCrypto digest algorithm: SHA3-512.
 */
export const kCCDigestSHA3_512 = 16;

/**
 * CommonCrypto digest algorithm: maximum.
 */
export const kCCDigestMax = 17;

// }

/**
 * CommonCrypto digest algorithm.
 */
export type CCDigestAlgorithm = uint32_t;

/**
 * CommonCrypto digest algorithm.
 */
export type CCDigestAlg = CCDigestAlgorithm;
