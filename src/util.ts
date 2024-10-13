/**
 * Align a number up.
 *
 * @param value Number.
 * @param alignment Alignment.
 * @returns Aligned number.
 */
export function alignUp(value: number, alignment: number) {
	const over = value % alignment;
	return over ? value + alignment - over : value;
}

/**
 * Assert integer in range.
 *
 * @param i Integer value.
 * @param l Lower limit.
 * @param h Higher limit.
 */
export function ranged(i: number, l: number, h: number) {
	if (!(i >= l && i <= h)) {
		throw new RangeError(`Value ${i} out of range ${l}-${h}`);
	}
}

/**
 * Get 24-bit signed integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param littleEndian Little endian.
 * @returns Integer value.
 */
export function getInt24(
	dataView: DataView,
	offset: number,
	littleEndian: boolean
) {
	// eslint-disable-next-line no-bitwise
	return (getUint24(dataView, offset, littleEndian) << 8) >> 8;
}

/**
 * Get 24-bit unsigned integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param littleEndian Little endian.
 * @returns Integer value.
 */
export function getUint24(
	dataView: DataView,
	offset: number,
	littleEndian: boolean
) {
	const c = dataView.getUint8(offset + 2);
	const b = dataView.getUint8(offset + 1);
	const a = dataView.getUint8(offset);
	// eslint-disable-next-line no-bitwise
	return littleEndian ? a | (b << 8) | (c << 16) : (a << 16) | (b << 8) | c;
}

/**
 * Set 24-bit signed integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param value Integer value.
 * @param littleEndian Little endian.
 */
export function setInt24(
	dataView: DataView,
	offset: number,
	value: number,
	littleEndian: boolean
) {
	setUint24(dataView, offset, value, littleEndian);
}

/**
 * Set 24-bit unsigned integer.
 *
 * @param dataView Data view.
 * @param offset Byte offset.
 * @param value Integer value.
 * @param littleEndian Little endian.
 */
export function setUint24(
	dataView: DataView,
	offset: number,
	value: number,
	littleEndian: boolean
) {
	let c;
	let b;
	let a;
	if (littleEndian) {
		// eslint-disable-next-line no-bitwise
		c = (value >>> 16) & 0xff;
		// eslint-disable-next-line no-bitwise
		b = (value >>> 8) & 0xff;
		// eslint-disable-next-line no-bitwise
		a = (value >>> 0) & 0xff;
	} else {
		// eslint-disable-next-line no-bitwise
		c = (value >>> 0) & 0xff;
		// eslint-disable-next-line no-bitwise
		b = (value >>> 8) & 0xff;
		// eslint-disable-next-line no-bitwise
		a = (value >>> 16) & 0xff;
	}
	if (offset <= -1) {
		// Trigger native OOB exception.
		dataView.setUint8(offset, a);
	}
	dataView.setUint8(offset + 2, c);
	dataView.setUint8(offset + 1, b);
	dataView.setUint8(offset, a);
}
