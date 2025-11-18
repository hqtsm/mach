import { type Class, constant } from '@hqtsm/class';
import { member, Struct, uint32 } from '@hqtsm/struct';
import { LcStr } from './lcstr.ts';

/**
 * Dynamically linked shared library.
 */
export class Dylib extends Struct {
	declare public readonly ['constructor']: Class<typeof Dylib>;

	/**
	 * Pathname.
	 */
	declare public name: LcStr;

	/**
	 * Build timestamp.
	 */
	declare public timestamp: number;

	/**
	 * Current version.
	 */
	declare public currentVersion: number;

	/**
	 * Compatibility version.
	 */
	declare public compatibilityVersion: number;

	static {
		member(LcStr, this, 'name');
		uint32(this, 'timestamp');
		uint32(this, 'currentVersion');
		uint32(this, 'compatibilityVersion');
		constant(this, 'BYTE_LENGTH');
	}
}
