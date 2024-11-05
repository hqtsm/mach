import { Struct, structU32 } from '../struct.ts';

/**
 * Dylib info command.
 */
export class DylibInfoCommand extends Struct {
	declare public readonly ['constructor']: typeof DylibInfoCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of rebase info.
	 */
	declare public rebaseOff: number;

	/**
	 * Size of rebase info.
	 */
	declare public rebaseSize: number;

	/**
	 * File offset of binding info.
	 */
	declare public bindOff: number;

	/**
	 * Size of binding info.
	 */
	declare public bindSize: number;

	/**
	 * File offset of weak binding info.
	 */
	declare public weakBindOff: number;

	/**
	 * Size of weak binding info.
	 */
	declare public weakBindSize: number;

	/**
	 * File offset of lazy binding info.
	 */
	declare public lazyBindOff: number;

	/**
	 * Size of lazy binding info.
	 */
	declare public lazyBindSize: number;

	/**
	 * File offset of export info.
	 */
	declare public exportOff: number;

	/**
	 * Size of export info.
	 */
	declare public exportSize: number;

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
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
	declare public readonly ['constructor']: typeof DylibInfoCommandBE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = false;
}

/**
 * Dylib info command, little endian.
 */
export class DylibInfoCommandLE extends DylibInfoCommand {
	declare public readonly ['constructor']: typeof DylibInfoCommandLE;

	/**
	 * @inheritdoc
	 */
	public static override readonly LITTLE_ENDIAN = true;
}
