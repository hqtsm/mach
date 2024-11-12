import { Struct, structU32 } from '../struct.ts';

/**
 * Ident command.
 */
export class IdentCommand extends Struct {
	declare public readonly ['constructor']: typeof IdentCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		return o;
	})(super.BYTE_LENGTH);
}
