import { Struct, structI8A, structU32, structU64 } from '../struct.ts';

/**
 * Note command.
 */
export class NoteCommand extends Struct {
	declare public readonly ['constructor']: typeof NoteCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Owner name.
	 */
	declare public readonly dataOwner: Int8Array;

	/**
	 * File offset.
	 */
	declare public offset: bigint;

	/**
	 * Byte length.
	 */
	declare public size: bigint;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structI8A(this, o, 'dataOwner', 16);
		o += structU64(this, o, 'offset');
		o += structU64(this, o, 'size');
		return o;
	})(super.BYTE_LENGTH);
}
