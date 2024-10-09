import {memberU32, memberU64} from '../member.ts';
import {Struct} from '../struct.ts';
import {constant} from '../util.ts';

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

	static {
		let {BYTE_LENGTH: o} = this;
		o += memberU32(this, o, 'count', false);
		o += memberU32(this, o, 'base', false);
		o += memberU64(this, o, 'targetOffset', false);
		o += memberU64(this, o, 'spare', false);
		constant(this, 'BYTE_LENGTH', o);
	}
}
