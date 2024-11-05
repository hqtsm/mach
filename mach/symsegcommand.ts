/* eslint-disable max-classes-per-file */
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
	public static override readonly BYTE_LENGTH = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'offset');
		o += structU32(this, o, 'size');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Symbol table, big endian.
 */
export class SymsegCommandBE extends SymsegCommand {
	declare public readonly ['constructor']: typeof SymsegCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Symbol table, little endian.
 */
export class SymsegCommandLE extends SymsegCommand {
	declare public readonly ['constructor']: typeof SymsegCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
