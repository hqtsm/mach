/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Linkedit data command.
 */
export class LinkeditDataCommand extends Struct {
	public declare readonly ['constructor']: typeof LinkeditDataCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * File offset of data in __LINKEDIT segment.
	 */
	public declare dataoff: number;

	/**
	 * File size of data in __LINKEDIT segment.
	 */
	public declare datasize: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'dataoff');
		o += structU32(this, o, 'datasize');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Linkedit data command, big endian.
 */
export class LinkeditDataCommandBE extends LinkeditDataCommand {
	public declare readonly ['constructor']: typeof LinkeditDataCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Linkedit data command, little endian.
 */
export class LinkeditDataCommandLE extends LinkeditDataCommand {
	public declare readonly ['constructor']: typeof LinkeditDataCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
