import { Struct, structU32, structU64 } from '../struct.ts';

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'count', false);
		o += structU32(this, o, 'base', false);
		o += structU64(this, o, 'targetOffset', false);
		o += structU64(this, o, 'spare', false);
		return o;
	})(super.BYTE_LENGTH);
}
