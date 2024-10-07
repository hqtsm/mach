import type {KeyofType, ReadonlyKeyofType} from './type.ts';
import type {Struct} from './struct.ts';

/**
 * Member int8.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @returns Byte length.
 */
export function memberI8<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], number>
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getInt8(offset);
		},
		set(this: T['prototype'], value: number) {
			this.dataView.setInt8(offset, value);
		}
	});
	return 1;
}

/**
 * Member uint8.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @returns Byte length.
 */
export function memberU8<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], number>
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getUint8(offset);
		},
		set(this: T['prototype'], value: number) {
			this.dataView.setUint8(offset, value);
		}
	});
	return 1;
}

/**
 * Member int16.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI16<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getInt16(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number) {
			this.dataView.setInt16(offset, value, le ?? this.littleEndian);
		}
	});
	return 2;
}

/**
 * Member uint16.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU16<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getUint16(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number) {
			this.dataView.setUint16(offset, value, le ?? this.littleEndian);
		}
	});
	return 2;
}

/**
 * Member int32.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI32<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getInt32(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number) {
			this.dataView.setInt32(offset, value, le ?? this.littleEndian);
		}
	});
	return 4;
}

/**
 * Member uint32.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU32<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getUint32(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number) {
			this.dataView.setUint32(offset, value, le ?? this.littleEndian);
		}
	});
	return 4;
}

/**
 * Member int64.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberI64<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], bigint>,
	le: boolean | null = null
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getBigInt64(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: bigint) {
			this.dataView.setBigInt64(offset, value, le ?? this.littleEndian);
		}
	});
	return 4;
}

/**
 * Member uint64.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function memberU64<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: KeyofType<T['prototype'], bigint>,
	le: boolean | null = null
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return this.dataView.getBigUint64(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: bigint) {
			this.dataView.setBigUint64(offset, value, le ?? this.littleEndian);
		}
	});
	return 8;
}

/**
 * Member int8 array.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param count Array length.
 * @returns Byte length.
 */
export function memberI8A<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: ReadonlyKeyofType<T['prototype'], Int8Array>,
	count: number
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return new Int8Array(this.buffer, this.byteOffset + offset, count);
		}
	});
	return count;
}

/**
 * Member uint8 array.
 *
 * @param _Struct Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param count Array length.
 * @returns Byte length.
 */
export function memberU8A<T extends typeof Struct>(
	_Struct: T,
	offset: number,
	field: ReadonlyKeyofType<T['prototype'], Uint8Array>,
	count: number
) {
	Object.defineProperty(_Struct.prototype, field, {
		get(this: T['prototype']) {
			return new Uint8Array(this.buffer, this.byteOffset + offset, count);
		}
	});
	return count;
}
