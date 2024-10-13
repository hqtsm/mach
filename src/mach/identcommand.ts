/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Ident command.
 */
export class IdentCommand extends Struct {
	public declare readonly ['constructor']: typeof IdentCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Ident command, big endian.
 */
export class IdentCommandBE extends IdentCommand {
	public declare readonly ['constructor']: typeof IdentCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Ident command, little endian.
 */
export class IdentCommandLE extends IdentCommand {
	public declare readonly ['constructor']: typeof IdentCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
