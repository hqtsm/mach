import {Struct} from './struct.ts';

/**
 * CodeDirectory scatter vector element.
 */
export class CodeDirectoryScatter extends Struct {
	public declare readonly ['constructor']: typeof CodeDirectoryScatter;

	/**
	 * Number of pages.
	 *
	 * @returns Page count; zero for sentinel (only).
	 */
	public get count() {
		return this.dataView.getUint32(0);
	}

	/**
	 * Number of pages.
	 *
	 * @param value Page count; zero for sentinel (only).
	 */
	public set count(value: number) {
		this.dataView.setUint32(0, value);
	}

	/**
	 * First page number.
	 *
	 * @returns Page number.
	 */
	public get base() {
		return this.dataView.getUint32(4);
	}

	/**
	 * First page number.
	 *
	 * @param value Page number.
	 */
	public set base(value: number) {
		this.dataView.setUint32(4, value);
	}

	/**
	 * Byte offset in target.
	 *
	 * @returns Byte offset.
	 */
	public get targetOffset() {
		return this.dataView.getBigUint64(8);
	}

	/**
	 * Byte offset in target.
	 *
	 * @param value Byte offset.
	 */
	public set targetOffset(value: bigint) {
		this.dataView.setBigUint64(8, value);
	}
}
