/* eslint-disable max-classes-per-file */
import { Struct, structU32 } from '../struct.ts';

/**
 * Prebind checksum command.
 */
export class PrebindCksumCommand extends Struct {
	declare public readonly ['constructor']: typeof PrebindCksumCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Checksum or zero.
	 */
	declare public cksum: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
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
	declare public readonly ['constructor']: typeof PrebindCksumCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Prebind checksum command, little endian.
 */
export class PrebindCksumCommandLE extends PrebindCksumCommand {
	declare public readonly ['constructor']: typeof PrebindCksumCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
