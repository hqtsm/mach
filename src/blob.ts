import {BufferView, ByteLength, ByteRead, ByteWrite} from './type.ts';
import {viewDataR, viewDataW, viewUint8R, viewUint8W} from './util.ts';

/**
 * Blob class.
 */
export class Blob implements ByteLength, ByteRead, ByteWrite, BufferView {
	public declare readonly ['constructor']: typeof Blob;

	/**
	 * Blob data.
	 */
	#data: DataView;

	/**
	 * Blob constructor.
	 *
	 * @param data Blob data view or size of new blob.
	 */
	constructor(data: BufferView | number = this.constructor.sizeof) {
		this.#data = viewDataW(
			typeof data === 'number' ? new Uint8Array(data) : data
		);
	}

	/**
	 * Magic number.
	 *
	 * @returns Magic number.
	 */
	public get magic() {
		return this.#data.getUint32(0);
	}

	/**
	 * Magic number.
	 *
	 * @param value Magic number.
	 */
	public set magic(value: number) {
		this.#data.setUint32(0, value);
	}

	/**
	 * Blob length.
	 *
	 * @returns Blob length.
	 */
	public get length() {
		return this.#data.getUint32(4);
	}

	/**
	 * Blob length.
	 *
	 * @param value Blob length.
	 */
	public set length(value) {
		this.#data.setUint32(4, value);
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
		return this.#data.getUint32(4);
	}

	/**
	 * @inheritdoc
	 */
	public get byteOffset() {
		return this.#data.byteOffset;
	}

	/**
	 * Get the blob data.
	 *
	 * @returns View of blob data.
	 */
	public get data() {
		return this.#data;
	}

	/**
	 * Initialize blob with type and length.
	 *
	 * @param size Length.
	 * @param magic Magic number.
	 */
	public initialize(size = 0, magic: number = this.constructor.typeMagic) {
		this.magic = magic;
		this.length = size;
	}

	/**
	 * @inheritdoc
	 */
	public byteRead(buffer: Readonly<BufferView>, offset = 0) {
		const v = viewDataR(buffer, offset);
		const length = v.getUint32(4);
		if (length < 8) {
			throw new Error(`Invalid length: ${length}`);
		}
		this.#data = viewDataW(viewUint8R(v, 0, length).slice());
		return length;
	}

	/**
	 * @inheritdoc
	 */
	public byteWrite(buffer: BufferView, offset = 0) {
		const length = this.#data.getUint32(4);
		viewUint8W(buffer, offset, length).set(
			viewUint8R(this.#data, 0, length)
		);
		return length;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 8;

	/**
	 * Type magic number for new instance.
	 */
	public static readonly typeMagic: number = 0;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap.
	 * @returns Blob.
	 */
	public static blobify<T extends typeof Blob>(
		this: T,
		content: Readonly<BufferView> | number = this.sizeof
	): T['prototype'] {
		const view = typeof content === 'number' ? null : viewUint8R(content);
		const size = 8 + (view ? view.byteLength : (content as number));
		const data = new Uint8Array(size);
		const blob = new this(data);
		blob.initialize(size);
		if (view) {
			data.subarray(8).set(view);
		}
		return blob;
	}
}
