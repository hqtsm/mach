import type { size_t } from '../../libc/stddef.ts';

/**
 * System alignment.
 */
export const systemAlignment = 4;

/**
 * Align a size up.
 *
 * @param size Size.
 * @param alignment Alignment.
 * @returns Aligned size.
 */
export function alignUp(
	size: size_t,
	alignment: size_t = systemAlignment,
): size_t {
	const over = size % alignment;
	return over ? size + alignment - over : size;
}
