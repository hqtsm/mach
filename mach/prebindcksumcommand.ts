import { constant, Struct, uint32 } from '@hqtsm/struct';

/**
 * Prebind checksum command.
 */
export class PrebindCksumCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof PrebindCksumCommand,
		'new'
	>;

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

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'cksum');
		constant(this, 'BYTE_LENGTH');
	}
}
