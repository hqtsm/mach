import { Struct, structU24, structU8 } from '../struct.ts';

/**
 * Reference symbol table entry.
 */
export class DylibReference extends Struct {
	declare public readonly ['constructor']: typeof DylibReference;

	/**
	 * Index in symbol table.
	 */
	declare public isym: number;

	/**
	 * Flags for reference type.
	 */
	declare public flags: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU24(this, o, 'isym');
		o += structU8(this, o, 'flags');
		return o;
	})(super.BYTE_LENGTH);
}
