import {memberU32, memberU64} from './member.ts';
import {Struct} from './struct.ts';
import {constant} from './util.ts';

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
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'count', false);
		sizeof += memberU32(this, sizeof, 'base', false);
		sizeof += memberU64(this, sizeof, 'targetOffset', false);
		sizeof += memberU64(this, sizeof, 'spare', false);
		constant(this, 'sizeof', sizeof);
	}
}
