import {BufferView, ByteLength, ByteWrite} from './type.ts';

/**
 * Blob class.
 */
export abstract class Blob implements ByteLength, ByteWrite {
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
	public abstract byteWrite(buffer: BufferView, offset?: number): number;
}
