import {BufferView, Length, Write} from './type.ts';

/**
 * Blob class.
 */
export abstract class Blob implements Length, Write {
	/**
	 * Magic number.
	 */
	public abstract get magic(): number;

	/**
	 * @inheritDoc
	 */
	public abstract get length(): number;

	/**
	 * @inheritDoc
	 */
	public abstract write(buffer: BufferView, offset?: number): number;
}
