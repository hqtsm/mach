import { Struct, uint32BE, uint64BE } from '@hqtsm/struct';

/**
 * CodeDirectory scatter vector element.
 */
export class CodeDirectoryScatter extends Struct {
	declare public readonly ['constructor']: typeof CodeDirectoryScatter;

	/**
	 * Page count; zero for sentinel (only).
	 */
	declare public count: number;

	/**
	 * First page number.
	 */
	declare public base: number;

	/**
	 * Byte offset in target.
	 */
	declare public targetOffset: bigint;

	/**
	 * Reserved, must be zero.
	 */
	declare public spare: bigint;

	static {
		uint32BE(this, 'count');
		uint32BE(this, 'base');
		uint64BE(this, 'targetOffset');
		uint64BE(this, 'spare');
	}
}
