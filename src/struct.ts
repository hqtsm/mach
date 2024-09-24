import type {BufferView, ByteLength} from './type.ts';

/**
 * Struct class.
 */
export class Struct implements BufferView, ByteLength {
	public declare readonly ['constructor']: typeof Struct;

	/**
	 * Byte data.
	 */
	readonly #buffer: ArrayBuffer;

	/**
	 * Byte offset.
	 */
	readonly #byteOffset: number;

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
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 0;
}
