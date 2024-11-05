import { Struct, structU24, structU8 } from '../struct.ts';

/**
 * Two-level namespace lookup hints table entry.
 */
export class TwolevelHint extends Struct {
	declare public readonly ['constructor']: typeof TwolevelHint;

	/**
	 * Index in symbol table.
	 */
	declare public isubImage: number;

	/**
	 * Flags for reference type.
	 */
	declare public itoc: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU8(this, o, 'isubImage');
		o += structU24(this, o, 'itoc');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Two-level namespace lookup hints table entry, big endian.
 */
export class TwolevelHintBE extends TwolevelHint {
	declare public readonly ['constructor']: typeof TwolevelHintBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Two-level namespace lookup hints table entry, little endian.
 */
export class TwolevelHintLE extends TwolevelHint {
	declare public readonly ['constructor']: typeof TwolevelHintLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
