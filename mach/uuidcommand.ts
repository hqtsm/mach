import { Struct, structU32, structU8A } from '../struct.ts';

/**
 * UUID command.
 */
export class UuidCommand extends Struct {
	declare public readonly ['constructor']: typeof UuidCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * 128-bit UUID.
	 */
	declare public readonly uuid: Uint8Array;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU8A(this, o, 'uuid', 16);
		return o;
	})(super.BYTE_LENGTH);
}
