import { Struct, uint32 } from '@hqtsm/struct';

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

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'cryptoff');
		uint32(this, 'cryptsize');
		uint32(this, 'cryptid');
	}
}
