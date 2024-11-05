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

/**
 * Fat header, big endian.
 */
export class FatHeaderBE extends FatHeader {
	declare public readonly ['constructor']: typeof FatHeaderBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Fat header, little endian.
 */
export class FatHeaderLE extends FatHeader {
	declare public readonly ['constructor']: typeof FatHeaderLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
