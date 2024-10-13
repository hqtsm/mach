/* eslint-disable max-classes-per-file */
import {Struct, structU32, structU64} from '../struct.ts';

/**
 * Source version command.
 */
export class SourceVersionCommand extends Struct {
	public declare readonly ['constructor']: typeof SourceVersionCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * A.B.C.D.E packed as a24.b10.c10.d10.e10.
	 */
	public declare version: bigint;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU64(this, o, 'version');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Source version command, big endian.
 */
export class SourceVersionCommandBE extends SourceVersionCommand {
	public declare readonly ['constructor']: typeof SourceVersionCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Source version command, little endian.
 */
export class SourceVersionCommandLE extends SourceVersionCommand {
	public declare readonly ['constructor']: typeof SourceVersionCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
