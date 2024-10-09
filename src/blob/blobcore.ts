import {memberU32} from '../member.ts';
import {Struct} from '../struct.ts';
import type {Cast} from '../type.ts';
import {constant} from '../util.ts';

/**
 * Polymorphic memory blobs with magics numbers.
 */
export class BlobCore extends Struct {
	public declare readonly ['constructor']: typeof BlobCore;

	/**
	 * Magic number.
	 */
	protected declare mMagic: number;

	/**
	 * Blob length.
	 */
	protected declare mLength: number;

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
	public at<T>(Type: Cast<T>, offset: number) {
		return new Type(this.buffer, this.byteOffset + offset);
	}

	static {
		let {BYTE_LENGTH: o} = this;
		o += memberU32(this, o, 'mMagic' as never, false);
		o += memberU32(this, o, 'mLength' as never, false);
		constant(this, 'BYTE_LENGTH', o);
	}
}
