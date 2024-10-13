/* eslint-disable max-classes-per-file */
import {Struct, structU24, structU8} from '../struct.ts';

/**
 * Reference symbol table entry.
 */
export class DylibReference extends Struct {
	public declare readonly ['constructor']: typeof DylibReference;

	/**
	 * Index in symbol table.
	 */
	public declare isym: number;

	/**
	 * Flags for reference type.
	 */
	public declare flags: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU24(this, o, 'isym');
		o += structU8(this, o, 'flags');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Reference symbol table entry, big endian.
 */
export class DylibReferenceBE extends DylibReference {
	public declare readonly ['constructor']: typeof DylibReferenceBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Reference symbol table entry, little endian.
 */
export class DylibReferenceLE extends DylibReference {
	public declare readonly ['constructor']: typeof DylibReferenceLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
