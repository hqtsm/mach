import { Struct, structU32 } from '../struct.ts';

/**
 * Symbol table command.
 */
export class SymsegCommand extends Struct {
	declare public readonly ['constructor']: typeof SymsegCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Segment offset.
	 */
	declare public offset: number;

	/**
	 * Segment size.
	 */
	declare public size: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'size');
		return o;
	})(super.BYTE_LENGTH);
}
