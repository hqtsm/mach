import { Struct, structU32 } from '../struct.ts';

/**
 * Linkedit data command.
 */
export class LinkeditDataCommand extends Struct {
	declare public readonly ['constructor']: typeof LinkeditDataCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of data in __LINKEDIT segment.
	 */
	declare public dataoff: number;

	/**
	 * File size of data in __LINKEDIT segment.
	 */
	declare public datasize: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'dataoff');
		o += structU32(this, o, 'datasize');
		return o;
	})(super.BYTE_LENGTH);
}
