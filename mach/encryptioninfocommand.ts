import { Struct, structU32 } from '../struct.ts';

/**
 * Encryption info command, 32-bit.
 */
export class EncryptionInfoCommand extends Struct {
	declare public readonly ['constructor']: typeof EncryptionInfoCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of encrypted range.
	 */
	declare public cryptoff: number;

	/**
	 * File size of encrypted range.
	 */
	declare public cryptsize: number;

	/**
	 * Encryption system ID, 0 for not encrypted yet.
	 */
	declare public cryptid: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'cryptoff');
		o += structU32(this, o, 'cryptsize');
		o += structU32(this, o, 'cryptid');
		return o;
	})(super.BYTE_LENGTH);
}
