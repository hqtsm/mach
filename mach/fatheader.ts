import { Struct, structU32 } from '../struct.ts';

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'magic');
		o += structU32(this, o, 'nfatArch');
		return o;
	})(super.BYTE_LENGTH);
}
