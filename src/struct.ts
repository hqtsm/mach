import {HOST_LE} from './const.ts';
import type {
	BufferView,
	ArrayBufferReal,
	ReadonlyKeyofType,
	KeyofType
} from './type.ts';
import {getInt24, getUint24, setInt24, setUint24} from './util.ts';

/**
 * Binary structure buffer view.
 */
export class Struct implements BufferView {
	public declare readonly ['constructor']: typeof Struct;

	/**
	 * Data view of buffer.
	 */
	readonly #data: DataView;

	/**
	 * Blob constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 */
	constructor(buffer: ArrayBufferReal, byteOffset = 0) {
		this.#data = new DataView(buffer, byteOffset);
	}

	/**
	 * @inheritdoc
	 */
	public get buffer() {
		return this.#data.buffer;
	}

	/**
	 * @inheritdoc
	 */
	public get byteLength() {
		return this.constructor.BYTE_LENGTH;
	}

	/**
	 * @inheritdoc
	 */
	public get byteOffset() {
		return this.#data.byteOffset;
	}

	/**
	 * Data view.
	 *
	 * @returns Data view of buffer.
	 */
	public get dataView() {
		return this.#data;
	}

	/**
	 * Use little endian or big endian for host-defined endian fields.
	 * Defaults to match the host architecture.
	 *
	 * @returns True for little endian, false for big endian.
	 */
	public get littleEndian(): this['constructor']['LITTLE_ENDIAN'] {
		return this.constructor.LITTLE_ENDIAN;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly BYTE_LENGTH: number = 0;

	/**
	 * Use little endian or big endian for host-defined endian fields.
	 * Defaults to match the host architecture.
	 */
	public static readonly LITTLE_ENDIAN = HOST_LE;
}

/**
 * Member int8.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @returns Byte length.
 */
export function structI8<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @returns Byte length.
 */
export function structU8<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structI16<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structU16<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * Member int24.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structI24<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']) {
			return getInt24(this.dataView, offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number) {
			setInt24(this.dataView, offset, value, le ?? this.littleEndian);
		}
	});
	return 3;
}

/**
 * Member uint24.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structU24<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']) {
			return getUint24(this.dataView, offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number) {
			setUint24(this.dataView, offset, value, le ?? this.littleEndian);
		}
	});
	return 3;
}

/**
 * Member int32.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structI32<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structU32<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], number>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structI64<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], bigint>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param le Little endian, big endian, or default.
 * @returns Byte length.
 */
export function structU64<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: KeyofType<T['prototype'], bigint>,
	le: boolean | null = null
) {
	Object.defineProperty(StructT.prototype, field, {
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
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param count Array length.
 * @returns Byte length.
 */
export function structI8A<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: ReadonlyKeyofType<T['prototype'], Int8Array>,
	count: number
) {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']) {
			return new Int8Array(this.buffer, this.byteOffset + offset, count);
		}
	});
	return count;
}

/**
 * Member uint8 array.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param count Array length.
 * @returns Byte length.
 */
export function structU8A<T extends typeof Struct>(
	StructT: T,
	offset: number,
	field: ReadonlyKeyofType<T['prototype'], Uint8Array>,
	count: number
) {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']) {
			return new Uint8Array(this.buffer, this.byteOffset + offset, count);
		}
	});
	return count;
}

/**
 * Member struct.
 *
 * @param StructT Struct constructor.
 * @param offset Byte offset.
 * @param field Field name.
 * @param Type Struct type.
 * @returns Byte length.
 */
export function structT<
	T extends typeof Struct,
	U extends ReadonlyKeyofType<T, typeof Struct>
>(
	StructT: T,
	offset: number,
	field: ReadonlyKeyofType<
		T['prototype'],
		T[U] extends typeof Struct ? T[U]['prototype'] : never
	>,
	Type: U
) {
	const StructC = StructT[Type] as typeof Struct;
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']) {
			return new StructC(this.buffer, this.byteOffset + offset);
		}
	});
	return StructC.BYTE_LENGTH;
}
