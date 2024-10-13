/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Dylib info command.
 */
export class DylibInfoCommand extends Struct {
	public declare readonly ['constructor']: typeof DylibInfoCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * File offset of rebase info.
	 */
	public declare rebase_off: number;

	/**
	 * Size of rebase info.
	 */
	public declare rebase_size: number;

	/**
	 * File offset of binding info.
	 */
	public declare bind_off: number;

	/**
	 * Size of binding info.
	 */
	public declare bind_size: number;

	/**
	 * File offset of weak binding info.
	 */
	public declare weak_bind_off: number;

	/**
	 * Size of weak binding info.
	 */
	public declare weak_bind_size: number;

	/**
	 * File offset of lazy binding info.
	 */
	public declare lazy_bind_off: number;

	/**
	 * Size of lazy binding info.
	 */
	public declare lazy_bind_size: number;

	/**
	 * File offset of export info.
	 */
	public declare export_off: number;

	/**
	 * Size of export info.
	 */
	public declare export_size: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'rebase_off');
		o += structU32(this, o, 'rebase_size');
		o += structU32(this, o, 'bind_off');
		o += structU32(this, o, 'bind_size');
		o += structU32(this, o, 'weak_bind_off');
		o += structU32(this, o, 'weak_bind_size');
		o += structU32(this, o, 'lazy_bind_off');
		o += structU32(this, o, 'lazy_bind_size');
		o += structU32(this, o, 'export_off');
		o += structU32(this, o, 'export_size');
		return o;
	})(super.BYTE_LENGTH);
}

/**
 * Dylib info command, big endian.
 */
export class DylibInfoCommandBE extends DylibInfoCommand {
	public declare readonly ['constructor']: typeof DylibInfoCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Dylib info command, little endian.
 */
export class DylibInfoCommandLE extends DylibInfoCommand {
	public declare readonly ['constructor']: typeof DylibInfoCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
