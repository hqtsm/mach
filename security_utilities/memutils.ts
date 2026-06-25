import type { size_t } from '../libc/stddef.ts';

/**
 * System alignment.
 */
export const Security_LowLevelMemoryUtilities_systemAlignment = 4;

/**
 * Align a size up.
 *
 * @param size Size.
 * @param alignment Alignment.
 * @returns Aligned size.
 */
export function Security_LowLevelMemoryUtilities_alignUp(
	size: size_t,
	alignment: size_t = Security_LowLevelMemoryUtilities_systemAlignment,
): size_t {
	const over = size % alignment;
	return over ? size + alignment - over : size;
}
