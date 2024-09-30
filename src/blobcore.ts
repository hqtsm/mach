import {Struct} from './struct.ts';

/**
 * Polymorphic memory blobs with magics numbers.
 */
export class BlobCore extends Struct {
	public declare readonly ['constructor']: typeof BlobCore;

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
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @returns Blob length.
	 */
	public get length() {
		return this.dataView.getUint32(4);
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
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
	 * @param offset Byte offset.
	 * @returns Data view.
	 */
	public at(offset: number) {
		return new DataView(this.buffer, this.byteOffset + offset);
	}

	/**
	 * @inheritdoc
	 */
	public static readonly sizeof: number = 8;
}
