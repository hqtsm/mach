/**
 * Align a number up.
 *
 * @param value Number.
 * @param alignment Alignment.
 * @returns Aligned number.
 */
export function alignUp(value: number, alignment: number): number {
	const over = value % alignment;
	return over ? value + alignment - over : value;
}
