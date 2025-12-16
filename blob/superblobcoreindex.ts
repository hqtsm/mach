import { type Class, constant, toStringTag } from '@hqtsm/class';
import { Struct, uint32BE } from '@hqtsm/struct';

/**
 * Super blob index entry.
 */
export class SuperBlobCoreIndex extends Struct {
	declare public readonly ['constructor']: Class<typeof SuperBlobCoreIndex>;

	/**
	 * Blob type.
	 */
	declare public type: number;

	/**
	 * Blob offset.
	 */
	declare public offset: number;

	static {
		toStringTag(this, 'SuperBlobCoreIndex');
		uint32BE(this, 'type');
		uint32BE(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}
