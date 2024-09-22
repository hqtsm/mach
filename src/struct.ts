import {BufferView, ByteRead, ByteWrite, ByteLength} from './type.ts';

/**
 * Struct class.
 */
export class Struct implements BufferView, ByteRead, ByteWrite, ByteLength {
	public declare readonly ['constructor']: typeof Struct;

	/**
	 * Byte data.
	 */
	#buffer: ArrayBuffer;

	/**
	 * Byte offset.
	 */
	#byteOffset: number;

	/**
	 * Blob constructor.
	 *
	 * @param data Blob data view, size of new blob, or null.
	 */
	constructor(data: BufferView | number | null = null) {
		if (data === null) {
			this.#buffer = new ArrayBuffer(this.constructor.sizeof);
			this.#byteOffset = 0;
		} else if (typeof data === 'number') {
			this.#buffer = new ArrayBuffer(data);
			this.#byteOffset = 0;
		} else {
			this.#buffer = data.buffer;
			this.#byteOffset = data.byteOffset;
		}
	}

	/**
	 * @inheritdoc
	 */
	public get buffer() {
		return this.#buffer;
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
		return this.#byteOffset;
	}

	/**
	 * @inheritdoc
	 */
	public byteRead(buffer: Readonly<BufferView>, offset = 0) {
		const byteLength = this.constructor.byteLength(buffer, offset);
		const b = new ArrayBuffer(byteLength);
		new Uint8Array(b, 0, byteLength).set(
			new Uint8Array(
				buffer.buffer,
				buffer.byteOffset + offset,
				byteLength
			)
		);
		this.#buffer = b;
		this.#byteOffset = 0;
		return byteLength;
	}

	/**
	 * @inheritdoc
	 */
	public byteWrite(buffer: BufferView, offset = 0) {
		const {byteLength} = this;
		new Uint8Array(
			buffer.buffer,
			buffer.byteOffset + offset,
			byteLength
		).set(new Uint8Array(this.buffer, this.byteOffset, byteLength));
		return byteLength;
	}

	/**
	 * Get the size of new instance for a given buffer.
	 *
	 * @param buffer Buffer view.
	 * @param offset Byte offset into buffer.
	 * @returns Byte length.
	 */
	public static byteLength(buffer: Readonly<BufferView>, offset = 0) {
		return this.sizeof;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 0;
}
