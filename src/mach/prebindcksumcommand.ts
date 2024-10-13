/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Prebind checksum command.
 */
export class PrebindCksumCommand extends Struct {
	public declare readonly ['constructor']: typeof PrebindCksumCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Checksum or zero.
	 */
	public declare cksum: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'cksum');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Prebind checksum command, big endian.
 */
export class PrebindCksumCommandBE extends PrebindCksumCommand {
	public declare readonly ['constructor']: typeof PrebindCksumCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Prebind checksum command, little endian.
 */
export class PrebindCksumCommandLE extends PrebindCksumCommand {
	public declare readonly ['constructor']: typeof PrebindCksumCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
