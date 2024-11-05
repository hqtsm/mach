import { Struct, structU32 } from '../struct.ts';

/**
 * Linker option command.
 */
export class LinkerOptionCommand extends Struct {
	declare public readonly ['constructor']: typeof LinkerOptionCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Number of following strings.
	 */
	declare public count: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
	declare public readonly ['constructor']: typeof LinkerOptionCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Linker option, little endian.
 */
export class LinkerOptionCommandLE extends LinkerOptionCommand {
	declare public readonly ['constructor']: typeof LinkerOptionCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
