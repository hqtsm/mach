import { Struct, structU32 } from '../struct.ts';

/**
 * Encryption info command, 64-bit.
 */
export class EncryptionInfoCommand64 extends Struct {
	declare public readonly ['constructor']: typeof EncryptionInfoCommand64;

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
	 * Padding to align to 8 bytes.
	 */
	declare public pad: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'cryptoff');
		o += structU32(this, o, 'cryptsize');
		o += structU32(this, o, 'cryptid');
		o += structU32(this, o, 'pad');
		return o;
	})(super.BYTE_LENGTH);
}
