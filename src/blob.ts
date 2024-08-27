import {BufferView} from './types.ts';

/**
 * Blob class.
 */
export abstract class Blob {
	/**
	 * Magic number.
	 */
	public abstract magic(): number;

	/**
	 * Blob length.
	 */
	public abstract length(): number;

	/**
	 * Write blob to buffer.
	 *
	 * @param buffer Buffer view.
	 * @param offset Byte offset into buffer.
	 * @returns Blob length.
	 */
	public abstract write(buffer: BufferView, offset?: number): number;
}
