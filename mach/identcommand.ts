/* eslint-disable max-classes-per-file */
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
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Ident command, big endian.
 */
export class IdentCommandBE extends IdentCommand {
	declare public readonly ['constructor']: typeof IdentCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Ident command, little endian.
 */
export class IdentCommandLE extends IdentCommand {
	declare public readonly ['constructor']: typeof IdentCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
