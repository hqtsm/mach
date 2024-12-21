import {
	type ArrayBufferReal,
	constant,
	Struct,
	uint32BE,
} from '@hqtsm/struct';

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
	public get magic(): number {
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
	public get length(): number {
		return this.mLength;
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @param value Blob length.
	 */
	public set length(value: number) {
		this.mLength = value;
	}

	/**
	 * Blob data.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 *
	 * @returns View starting from blob data start.
	 */
	public get data(): DataView {
		return new DataView(this.buffer, this.byteOffset);
	}

	/**
	 * Initialize blob with type and length.
	 *
	 * @param magic Magic number.
	 * @param length Length.
	 */
	public initialize(magic: number, length = 0): void {
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
	): T;

	/**
	 * Get view of data at offset, with endian.
	 *
	 * @param Type Constructor function.
	 * @param offset Byte offset.
	 * @param littleEndian Host endian, little endian, big endian.
	 * @returns Data view.
	 */
	public at<T>(
		Type: new (
			buffer: ArrayBufferReal,
			byteOffset?: number,
			littleEndian?: boolean | null,
		) => T,
		offset: number,
		littleEndian?: boolean | null,
	): T;

	/**
	 * Get view of data at offset, with endian.
	 *
	 * @param Type Constructor function.
	 * @param offset Byte offset.
	 * @param littleEndian Host endian, little endian, big endian.
	 * @returns Data view.
	 */
	public at<T>(
		Type: new (
			buffer: ArrayBufferReal,
			byteOffset?: number,
			littleEndian?: boolean | null,
		) => T,
		offset: number,
		littleEndian?: boolean | null,
	): T {
		return littleEndian === undefined
			? new Type(this.buffer, this.byteOffset + offset)
			: new Type(this.buffer, this.byteOffset + offset, littleEndian);
	}

	static {
		uint32BE(this, 'mMagic' as never);
		uint32BE(this, 'mLength' as never);
		constant(this, 'BYTE_LENGTH');
	}
}
