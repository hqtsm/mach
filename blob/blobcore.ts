import {
	type ArrayBufferReal,
	constant,
	Ptr,
	Struct,
	uint32BE,
} from '@hqtsm/struct';

/**
 * Polymorphic memory blobs with magics numbers.
 */
export class BlobCore extends Struct {
	declare public readonly ['constructor']: Omit<typeof BlobCore, 'new'>;

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
	 */
	public magic(): number {
		return this.mMagic;
	}

	/**
	 * Blob length.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 */
	public get length(): number {
		return this.mLength;
	}

	public set length(value: number) {
		this.mLength = value;
	}

	/**
	 * Blob data.
	 * By default includes magic and length.
	 * Child classes may redefine this to be a smaller area.
	 */
	public get data(): Ptr {
		return new Ptr(this.buffer, this.byteOffset, this.littleEndian);
	}

	/**
	 * Initialize blob with type and length.
	 *
	 * @param magic Magic number.
	 * @param length Length.
	 */
	public initialize(magic: number, length = 0): void {
		this.mMagic = magic;
		this.mLength = length;
	}

	/**
	 * Get view of data at offset, with endian.
	 *
	 * @param Type Constructor function.
	 * @param offset Byte offset.
	 * @param littleEndian Little endian, big endian, or inherit.
	 * @returns Data view.
	 */
	public at<T>(
		Type: new (
			buffer: ArrayBufferReal,
			byteOffset?: number,
			littleEndian?: boolean | null,
		) => T,
		offset: number,
		littleEndian: boolean | null = null,
	): T {
		return new Type(
			this.buffer,
			this.byteOffset + offset,
			littleEndian ?? this.littleEndian,
		);
	}

	static {
		uint32BE(this, 'mMagic' as never);
		uint32BE(this, 'mLength' as never);
		constant(this, 'BYTE_LENGTH');
	}
}
