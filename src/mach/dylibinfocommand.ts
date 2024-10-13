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
	public declare rebaseOff: number;

	/**
	 * Size of rebase info.
	 */
	public declare rebaseSize: number;

	/**
	 * File offset of binding info.
	 */
	public declare bindOff: number;

	/**
	 * Size of binding info.
	 */
	public declare bindSize: number;

	/**
	 * File offset of weak binding info.
	 */
	public declare weakBindOff: number;

	/**
	 * Size of weak binding info.
	 */
	public declare weakBindSize: number;

	/**
	 * File offset of lazy binding info.
	 */
	public declare lazyBindOff: number;

	/**
	 * Size of lazy binding info.
	 */
	public declare lazyBindSize: number;

	/**
	 * File offset of export info.
	 */
	public declare exportOff: number;

	/**
	 * Size of export info.
	 */
	public declare exportSize: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'rebaseOff');
		o += structU32(this, o, 'rebaseSize');
		o += structU32(this, o, 'bindOff');
		o += structU32(this, o, 'bindSize');
		o += structU32(this, o, 'weakBindOff');
		o += structU32(this, o, 'weakBindSize');
		o += structU32(this, o, 'lazyBindOff');
		o += structU32(this, o, 'lazyBindSize');
		o += structU32(this, o, 'exportOff');
		o += structU32(this, o, 'exportSize');
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
