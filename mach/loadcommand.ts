import { Struct, structU32 } from '../struct.ts';

/**
 * Load command.
 */
export class LoadCommand extends Struct {
	declare public readonly ['constructor']: typeof LoadCommand;

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

/**
 * Load command, big endian.
 */
export class LoadCommandBE extends LoadCommand {
	declare public readonly ['constructor']: typeof LoadCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Load command, little endian.
 */
export class LoadCommandLE extends LoadCommand {
	declare public readonly ['constructor']: typeof LoadCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
