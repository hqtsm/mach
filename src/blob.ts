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
	 * @param data Blob data view or null to create new.
	 */
	constructor(data: BufferView | number | null = null) {
		let d;
		if (typeof data === 'number') {
			d = viewDataW(new Uint8Array(data));
		} else if (data) {
			d = viewDataW(data);
		} else {
			d = viewDataW(new Uint8Array(this.constructor.sizeof));
		}
		this.#data = d;
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
	 */
	public initialize(size = 0) {
		this.magic = this.constructor.typeMagic;
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
	public static blobify(content: Readonly<BufferView>) {
		const view = viewUint8R(content);
		const size = 8 + view.byteLength;
		const data = new Uint8Array(size);
		const blob = new this(size);
		blob.initialize(size);
		data.subarray(8).set(view);
		return blob;
	}
}
