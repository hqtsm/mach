import {HOST_LE} from './const.ts';
import type {BufferView, ArrayBufferReal} from './type.ts';
import {constant} from './util.ts';

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
		return this.constructor.sizeof;
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
	public get littleEndian(): this['constructor']['littleEndian'] {
		return this.constructor.littleEndian;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 0;

	/**
	 * Use little endian or big endian for host-defined endian fields.
	 * Defaults to match the host architecture.
	 */
	public static readonly littleEndian = HOST_LE;

	static {
		constant(this, 'sizeof');
		constant(this, 'littleEndian');
	}
}
