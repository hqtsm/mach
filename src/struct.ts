import type {BufferView} from './type.ts';

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
	constructor(
		buffer: ConstructorParameters<typeof DataView>[0],
		byteOffset = 0
	) {
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
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 0;
}
