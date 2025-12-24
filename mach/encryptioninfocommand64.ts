import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Encryption info command, 64-bit.
 */
export class EncryptionInfoCommand64 extends Struct {
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

	static {
		toStringTag(this, 'EncryptionInfoCommand64');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'cryptoff');
		uint32(this, 'cryptsize');
		uint32(this, 'cryptid');
		uint32(this, 'pad');
		constant(this, 'BYTE_LENGTH');
	}
}
