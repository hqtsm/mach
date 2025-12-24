import { constant, toStringTag } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Fixed virtual memory shared library.
 */
export class Fvmlib extends Struct {
	/**
	 * Target pathname.
	 */
	declare public name: LcStr;

	/**
	 * Minor version.
	 */
	declare public minorVersion: number;

	/**
	 * Header address.
	 */
	declare public headerAddr: number;

	static {
		toStringTag(this, 'Fvmlib');
		member(LcStr, this, 'name');
		uint32(this, 'minorVersion');
		uint32(this, 'headerAddr');
		constant(this, 'BYTE_LENGTH');
	}
}
