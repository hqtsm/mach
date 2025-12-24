import { constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Dylib info command.
 */
export class DylibInfoCommand extends Struct {
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

	static {
		toStringTag(this, 'DylibInfoCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'rebaseOff');
		uint32(this, 'rebaseSize');
		uint32(this, 'bindOff');
		uint32(this, 'bindSize');
		uint32(this, 'weakBindOff');
		uint32(this, 'weakBindSize');
		uint32(this, 'lazyBindOff');
		uint32(this, 'lazyBindSize');
		uint32(this, 'exportOff');
		uint32(this, 'exportSize');
		constant(this, 'BYTE_LENGTH');
	}
}
