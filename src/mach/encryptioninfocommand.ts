/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Encryption info command, 32-bit.
 */
export class EncryptionInfoCommand extends Struct {
	public declare readonly ['constructor']: typeof EncryptionInfoCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * File offset of encrypted range.
	 */
	public declare cryptoff: number;

	/**
	 * File size of encrypted range.
	 */
	public declare cryptsize: number;

	/**
	 * Encryption system ID, 0 for not encrypted yet.
	 */
	public declare cryptid: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'cryptoff');
		o += structU32(this, o, 'cryptsize');
		o += structU32(this, o, 'cryptid');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Encryption info command, 32-bit, big endian.
 */
export class EncryptionInfoCommandBE extends EncryptionInfoCommand {
	public declare readonly ['constructor']: typeof EncryptionInfoCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Encryption info command, 32-bit, little endian.
 */
export class EncryptionInfoCommandLE extends EncryptionInfoCommand {
	public declare readonly ['constructor']: typeof EncryptionInfoCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
