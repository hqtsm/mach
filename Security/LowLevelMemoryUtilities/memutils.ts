/**
 * System alignment.
 */
export const systemAlignment = 4;

/**
 * Align a number up.
 *
 * @param value Number.
 * @param alignment Alignment.
 * @returns Aligned number.
 */
export function alignUp(value: number, alignment = systemAlignment): number {
	const over = value % alignment;
	return over ? value + alignment - over : value;
}
