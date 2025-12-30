import { constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Target triple command.
 */
export class TargetTripleCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Target triple string.
	 */
	declare public triple: LcStr;

	static {
		toStringTag(this, 'TargetTripleCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(LcStr, this, 'triple');
		constant(this, 'BYTE_LENGTH');
	}
}
