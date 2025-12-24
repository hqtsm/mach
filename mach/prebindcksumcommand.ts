import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Prebind checksum command.
 */
export class PrebindCksumCommand extends Struct {
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
		toStringTag(this, 'PrebindCksumCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'cksum');
		constant(this, 'BYTE_LENGTH');
	}
}
