/* eslint-disable max-classes-per-file */
import {Struct, structU32, structU8A} from '../struct.ts';

/**
 * UUID command.
 */
export class UuidCommand extends Struct {
	public declare readonly ['constructor']: typeof UuidCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * 128-bit UUID.
	 */
	public declare readonly uuid: Uint8Array;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU8A(this, o, 'uuid', 16);
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * UUID command, big endian.
 */
export class UuidCommandBE extends UuidCommand {
	public declare readonly ['constructor']: typeof UuidCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * UUID command, little endian.
 */
export class UuidCommandLE extends UuidCommand {
	public declare readonly ['constructor']: typeof UuidCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
