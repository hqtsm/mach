import {Struct} from './struct.ts';
import type {BufferView} from './type.ts';
import {viewUint8R} from './util.ts';

/**
 * Blob class.
 */
export class Blob extends Struct {
	public declare readonly ['constructor']: typeof Blob;

	/**
	 * Blob data.
	 */
	readonly #data: DataView;

	/**
	 * Blob constructor.
	 *
	 * @param data Blob data view or size of new blob.
	 */
	constructor(data: BufferView | number | null = null) {
		super(data);
		this.#data = new DataView(this.buffer, this.byteOffset);
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
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller subview.
	 *
	 * @returns Blob length.
	 */
	public get length() {
		return this.#data.getUint32(4);
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller subview.
	 *
	 * @param value Blob length.
	 */
	public set length(value) {
		this.#data.setUint32(4, value);
	}

	/**
	 * @inheritdoc
	 */
	public get byteLength() {
		return this.#data.getUint32(4);
	}

	/**
	 * Data view of blob array buffer, potentially extending beyond end.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller subview.
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
	 * @param magic Magic number, or null for default.
	 */
	public initialize(size = 0, magic: number | null = null) {
		this.magic = magic ?? this.constructor.typeMagic;
		this.length = size;
	}

	/**
	 * @inheritdoc
	 */
	public static byteLength(buffer: Readonly<BufferView>, offset = 0) {
		const byteLength = new DataView(
			buffer.buffer,
			buffer.byteOffset + offset,
			8
		).getUint32(4);
		if (byteLength < 8) {
			throw new Error(`Invalid length: ${byteLength}`);
		}
		return byteLength;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly sizeof: number = 8;

	/**
	 * Type magic number for new instance.
	 */
	public static readonly typeMagic: number = 0;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of bytes.
	 * @returns Blob.
	 */
	public static blobify<T extends typeof Blob>(
		this: T,
		content: Readonly<BufferView> | number = 0
	): T['prototype'] {
		let view;
		let size = 8;
		if (typeof content === 'number') {
			size += content;
		} else {
			view = viewUint8R(content);
			size += view.byteLength;
		}
		const data = new Uint8Array(size);
		const blob = new this(data);
		blob.initialize(size);
		if (view) {
			data.subarray(8).set(view);
		}
		return blob;
	}
}
