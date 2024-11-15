import { Struct, structU32, structU64 } from '../struct.ts';

/**
 * Source version command.
 */
export class SourceVersionCommand extends Struct {
	declare public readonly ['constructor']: typeof SourceVersionCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * A.B.C.D.E packed as a24.b10.c10.d10.e10.
	 */
	declare public version: bigint;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU64(this, o, 'version');
		return o;
	})(super.BYTE_LENGTH);
}
