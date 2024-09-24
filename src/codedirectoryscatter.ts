import {Struct} from './struct.ts';
import type {BufferView} from './type.ts';

/**
 * CodeDirectoryScatter class.
 */
export class CodeDirectoryScatter extends Struct {
	public declare readonly ['constructor']: typeof CodeDirectoryScatter;

	/**
	 * Blob data.
	 */
	readonly #data: DataView;

	/**
	 * @inheritdoc
	 */
	constructor(data: BufferView | number | null = null) {
		super(data);
		this.#data = new DataView(this.buffer, this.byteOffset);
	}

	/**
	 * Number of pages.
	 *
	 * @returns Page count; zero for sentinel (only).
	 */
	public get count() {
		return this.#data.getUint32(0);
	}

	/**
	 * Number of pages.
	 *
	 * @param value Page count; zero for sentinel (only).
	 */
	public set count(value: number) {
		this.#data.setUint32(0, value);
	}

	/**
	 * First page number.
	 *
	 * @returns Page number.
	 */
	public get base() {
		return this.#data.getUint32(4);
	}

	/**
	 * First page number.
	 *
	 * @param value Page number.
	 */
	public set base(value: number) {
		this.#data.setUint32(4, value);
	}

	/**
	 * Byte offset in target.
	 *
	 * @returns Byte offset.
	 */
	public get targetOffset() {
		return this.#data.getBigUint64(8);
	}

	/**
	 * Byte offset in target.
	 *
	 * @param value Byte offset.
	 */
	public set targetOffset(value: bigint) {
		this.#data.setBigUint64(8, value);
	}
}
