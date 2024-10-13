/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Fat header.
 */
export class FatHeader extends Struct {
	public declare readonly ['constructor']: typeof FatHeader;

	/**
	 * Fat magic.
	 */
	public declare magic: number;

	/**
	 * Number of fat architectures that follow.
	 */
	public declare nfatArch: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'magic');
		o += structU32(this, o, 'nfatArch');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Fat header, big endian.
 */
export class FatHeaderBE extends FatHeader {
	public declare readonly ['constructor']: typeof FatHeaderBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Fat header, little endian.
 */
export class FatHeaderLE extends FatHeader {
	public declare readonly ['constructor']: typeof FatHeaderLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
