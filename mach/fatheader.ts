import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Fat header.
 */
export class FatHeader extends Struct {
	declare public readonly ['constructor']: typeof FatHeader;

	/**
	 * Fat magic.
	 */
	declare public magic: number;

	/**
	 * Number of fat architectures that follow.
	 */
	declare public nfatArch: number;

	static {
		uint32(this, 'magic');
		uint32(this, 'nfatArch');
	}
}
