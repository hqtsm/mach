import { Struct, structU32 } from '../struct.ts';
import type { ArrayBufferReal } from '../type.ts';

/**
 * Polymorphic memory blobs with magics numbers.
 */
export class BlobCore extends Struct {
	declare public readonly ['constructor']: typeof BlobCore;

	/**
	 * Magic number.
	 */
	declare protected mMagic: number;

	/**
	 * Blob length.
	 */
	declare protected mLength: number;

	/**
	 * Magic number.
	 *
	 * @returns Magic number.
	 */
	public get magic() {
		return this.mMagic;
	}

	/**
	 * Magic number.
	 *
	 * @param value Magic number.
	 */
	public set magic(value: number) {
		this.mMagic = value;
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @returns Blob length.
	 */
	public get length() {
		return this.mLength;
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param value Blob length.
	 */
	public set length(value) {
		this.mLength = value;
	}

	/**
	 * Blob data.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @returns View starting from blob data start.
	 */
	public get data() {
		return new DataView(this.buffer, this.byteOffset);
	}

	/**
	 * Initialize blob with type and length.
	 *
	 * @param magic Magic number.
	 * @param length Length.
	 */
	public initialize(magic: number, length = 0) {
		this.magic = magic;
		this.length = length;
	}

	/**
	 * Get view of data at offset.
	 *
	 * @param Type Constructor function.
	 * @param offset Byte offset.
	 * @returns Data view.
	 */
	public at<T>(
		Type: new (buffer: ArrayBufferReal, byteOffset?: number) => T,
		offset: number,
	) {
		return new Type(this.buffer, this.byteOffset + offset);
	}

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'mMagic' as never, false);
		o += structU32(this, o, 'mLength' as never, false);
		return o;
	})(super.BYTE_LENGTH);
}
