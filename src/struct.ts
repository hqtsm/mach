import type {BufferView, ByteLength} from './type.ts';

/**
 * Struct class.
 */
export class Struct implements BufferView, ByteLength {
	public declare readonly ['constructor']: typeof Struct;

	/**
	 * Data view of buffer.
	 */
	readonly #data: DataView;

	/**
	 * Blob constructor.
	 *
	 * @param data Blob data view, size of new blob, or null.
	 */
	constructor(data: BufferView | number | null = null) {
		let b;
		let o = 0;
		if (data === null) {
			b = new ArrayBuffer(this.constructor.sizeof);
		} else if (typeof data === 'number') {
			b = new ArrayBuffer(data);
		} else {
			b = data.buffer;
			o = data.byteOffset;
		}
		this.#data = new DataView(b, o);
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
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 0;
}
