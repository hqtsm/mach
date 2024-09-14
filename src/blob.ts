import {BufferView, ByteLength, ByteRead, ByteWrite} from './type.ts';

/**
 * Blob class.
 */
export abstract class Blob implements ByteLength, ByteRead, ByteWrite {
	public declare readonly ['constructor']: typeof Blob;

	/**
	 * Magic number.
	 */
	public abstract get magic(): number;

	/**
	 * Blob length (the byteLength).
	 */
	public abstract get length(): number;

	/**
	 * @inheritdoc
	 */
	public get byteLength() {
		return this.length;
	}

	/**
	 * @inheritdoc
	 */
	public abstract byteRead(
		buffer: Readonly<BufferView>,
		offset?: number
	): number;

	/**
	 * @inheritdoc
	 */
	public abstract byteWrite(buffer: BufferView, offset?: number): number;
}
