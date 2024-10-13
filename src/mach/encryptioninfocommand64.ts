/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Encryption info command, 64-bit.
 */
export class EncryptionInfoCommand64 extends Struct {
	public declare readonly ['constructor']: typeof EncryptionInfoCommand64;

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
	 * Padding to align to 8 bytes.
	 */
	public declare pad: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'cryptoff');
		o += structU32(this, o, 'cryptsize');
		o += structU32(this, o, 'cryptid');
		o += structU32(this, o, 'pad');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Encryption info command, 64-bit, big endian.
 */
export class EncryptionInfoCommand64BE extends EncryptionInfoCommand64 {
	public declare readonly ['constructor']: typeof EncryptionInfoCommand64BE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Encryption info command, 64-bit, little endian.
 */
export class EncryptionInfoCommand64LE extends EncryptionInfoCommand64 {
	public declare readonly ['constructor']: typeof EncryptionInfoCommand64LE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
