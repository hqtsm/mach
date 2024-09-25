import {Struct} from './struct.ts';
import type {BufferView, ReadonlyUint8Array} from './type.ts';
import {subview} from './util.ts';

/**
 * Blob class.
 */
export class Blob extends Struct {
	public declare readonly ['constructor']: typeof Blob;

	/**
	 * Magic number.
	 *
	 * @returns Magic number.
	 */
	public get magic() {
		return this.dataView.getUint32(0);
	}

	/**
	 * Magic number.
	 *
	 * @param value Magic number.
	 */
	public set magic(value: number) {
		this.dataView.setUint32(0, value);
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller subview.
	 *
	 * @returns Blob length.
	 */
	public get length() {
		return this.dataView.getUint32(4);
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller subview.
	 *
	 * @param value Blob length.
	 */
	public set length(value) {
		this.dataView.setUint32(4, value);
	}

	/**
	 * @inheritdoc
	 */
	public get byteLength() {
		return this.dataView.getUint32(4);
	}

	/**
	 * Data view of blob array buffer, limited to blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller subview.
	 *
	 * @returns View of blob data.
	 */
	public get data() {
		return subview(DataView, this, 0, this.length);
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
		let view: ReadonlyUint8Array | undefined;
		let size = 8;
		if (typeof content === 'number') {
			size += content;
		} else {
			view = new Uint8Array(
				content.buffer,
				content.byteOffset,
				content.byteLength
			);
			size += view.byteLength;
		}
		const buffer = new ArrayBuffer(size);
		const blob = new this(buffer);
		blob.initialize(size);
		if (view) {
			new Uint8Array(buffer).subarray(8).set(view);
		}
		return blob;
	}
}
