import { HOST_LE } from './const.ts';
import type {
	ArrayBufferReal,
	BufferView,
	KeyofType,
	ReadonlyKeyofType,
} from './type.ts';
import { getInt24, getUint24, setInt24, setUint24 } from './util.ts';

/**
 * Binary structure buffer view.
 */
export class Struct implements BufferView {
	declare public readonly ['constructor']: typeof Struct;

	/**
	 * Data view of buffer.
	 */
	readonly #data: DataView;

	/**
	 * Little endian, or not.
	 */
	readonly #littleEndian: boolean;

	/**
	 * Blob constructor.
	 *
	 * @param buffer Buffer data.
	 * @param byteOffset Byte offset into buffer.
	 * @param littleEndian Host endian, little endian, big endian.
	 */
	constructor(
		buffer: ArrayBufferReal,
		byteOffset = 0,
		littleEndian: boolean | null = null,
	) {
		this.#data = new DataView(buffer, byteOffset);
		this.#littleEndian = littleEndian ?? HOST_LE;
	}

	/**
	 * @inheritdoc
	 */
	public get buffer(): ArrayBuffer {
		return this.#data.buffer;
	}

	/**
	 * @inheritdoc
	 */
	public get byteLength(): number {
		return this.constructor.BYTE_LENGTH;
	}

	/**
	 * @inheritdoc
	 */
	public get byteOffset(): number {
		return this.#data.byteOffset;
	}

	/**
	 * Data view.
	 *
	 * @returns Data view of buffer.
	 */
	public get dataView(): DataView {
		return this.#data;
	}

	/**
	 * Using little endian or big endian for host-defined endian fields.
	 * Defaults to match the host architecture.
	 *
	 * @returns True for little endian, false for big endian.
	 */
	public get littleEndian(): boolean {
		return this.#littleEndian;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly BYTE_LENGTH: number = 0;
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
	field: KeyofType<T['prototype'], number>,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return this.dataView.getInt8(offset);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setInt8(offset, value);
		},
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
	field: KeyofType<T['prototype'], number>,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return this.dataView.getUint8(offset);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setUint8(offset, value);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return this.dataView.getInt16(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setInt16(offset, value, le ?? this.littleEndian);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return this.dataView.getUint16(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setUint16(offset, value, le ?? this.littleEndian);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return getInt24(this.dataView, offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number): void {
			setInt24(this.dataView, offset, value, le ?? this.littleEndian);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return getUint24(this.dataView, offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number): void {
			setUint24(this.dataView, offset, value, le ?? this.littleEndian);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return this.dataView.getInt32(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setInt32(offset, value, le ?? this.littleEndian);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): number {
			return this.dataView.getUint32(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: number): void {
			this.dataView.setUint32(offset, value, le ?? this.littleEndian);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): bigint {
			return this.dataView.getBigInt64(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: bigint): void {
			this.dataView.setBigInt64(offset, value, le ?? this.littleEndian);
		},
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
	le: boolean | null = null,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): bigint {
			return this.dataView.getBigUint64(offset, le ?? this.littleEndian);
		},
		set(this: T['prototype'], value: bigint): void {
			this.dataView.setBigUint64(offset, value, le ?? this.littleEndian);
		},
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
	count: number,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): Int8Array {
			return new Int8Array(this.buffer, this.byteOffset + offset, count);
		},
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
	count: number,
): number {
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): Uint8Array {
			return new Uint8Array(this.buffer, this.byteOffset + offset, count);
		},
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
	U extends ReadonlyKeyofType<T, typeof Struct>,
>(
	StructT: T,
	offset: number,
	field: ReadonlyKeyofType<
		T['prototype'],
		T[U] extends typeof Struct ? T[U]['prototype'] : never
	>,
	Type: U,
): number {
	const StructC = StructT[Type] as typeof Struct;
	Object.defineProperty(StructT.prototype, field, {
		get(this: T['prototype']): T['prototype'] {
			return new StructC(
				this.buffer,
				this.byteOffset + offset,
				this.littleEndian,
			);
		},
	});
	return StructC.BYTE_LENGTH;
}
