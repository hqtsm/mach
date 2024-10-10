import {Struct, structU32, structU64} from '../struct.ts';

/**
 * CodeDirectory scatter vector element.
 */
export class CodeDirectoryScatter extends Struct {
	public declare readonly ['constructor']: typeof CodeDirectoryScatter;

	/**
	 * Page count; zero for sentinel (only).
	 */
	public declare count: number;

	/**
	 * First page number.
	 */
	public declare base: number;

	/**
	 * Byte offset in target.
	 */
	public declare targetOffset: bigint;

	/**
	 * Reserved, must be zero.
	 */
	public declare spare: bigint;

	/**
	 * @inheritdoc
	 */
	public static BYTE_LENGTH = (o => {
		o += structU32(this, o, 'count', false);
		o += structU32(this, o, 'base', false);
		o += structU64(this, o, 'targetOffset', false);
		o += structU64(this, o, 'spare', false);
		return o;
	})(super.BYTE_LENGTH);
}
