/* eslint-disable max-classes-per-file */
import {Struct, structI8A, structU32, structU64} from '../struct.ts';

/**
 * Note command.
 */
export class NoteCommand extends Struct {
	public declare readonly ['constructor']: typeof NoteCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Owner name.
	 */
	public declare readonly data_owner: Int8Array;

	/**
	 * File offset.
	 */
	public declare offset: bigint;

	/**
	 * Byte length.
	 */
	public declare size: bigint;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structI8A(this, o, 'data_owner', 16);
		o += structU64(this, o, 'offset');
		o += structU64(this, o, 'size');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Note command, big endian.
 */
export class NoteCommandBE extends NoteCommand {
	public declare readonly ['constructor']: typeof NoteCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Note command, little endian.
 */
export class NoteCommandLE extends NoteCommand {
	public declare readonly ['constructor']: typeof NoteCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
