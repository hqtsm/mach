import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Fat header.
 */
export class FatHeader extends Struct {
	/**
	 * Fat magic.
	 */
	declare public magic: number;

	/**
	 * Number of fat architectures that follow.
	 */
	declare public nfatArch: number;

	static {
		toStringTag(this, 'FatHeader');
		uint32(this, 'magic');
		uint32(this, 'nfatArch');
		constant(this, 'BYTE_LENGTH');
	}
}
