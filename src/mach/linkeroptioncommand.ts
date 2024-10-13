/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Linker option command.
 */
export class LinkerOptionCommand extends Struct {
	public declare readonly ['constructor']: typeof LinkerOptionCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Number of following strings.
	 */
	public declare count: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'count');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Linker option, big endian.
 */
export class LinkerOptionCommandBE extends LinkerOptionCommand {
	public declare readonly ['constructor']: typeof LinkerOptionCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Linker option, little endian.
 */
export class LinkerOptionCommandLE extends LinkerOptionCommand {
	public declare readonly ['constructor']: typeof LinkerOptionCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
