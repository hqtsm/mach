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
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'cksum');
		return o;
	})(super.BYTE_LENGTH);
}
