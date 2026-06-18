import type { PLNull, PLString } from '@hqtsm/plist';
import type { size_t } from '../libc/stddef.ts';

/**
 * CF index.
 */
export type CFIndex = size_t;

/**
 * CF string.
 */
export type CFStringRef = PLString;

/**
 * CF mutable string.
 */
export type CFMutableStringRef = PLString;

/**
 * CF null.
 */
export type CFNullRef = PLNull;
