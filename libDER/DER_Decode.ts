import { toStringTag } from '@hqtsm/class';
import type { Ptr } from '@hqtsm/struct';
import type { DERByte } from './libDER_config.ts';

/**
 * DER sequence.
 */
export class DERSequence {
	/**
	 * Next item.
	 */
	public nextItem: Ptr<DERByte> | null;

	/**
	 * End.
	 */
	public end: Ptr<DERByte> | null;

	/**
	 * Constructor.
	 *
	 * @param nextItem Next item.
	 * @param end End.
	 */
	constructor(
		nextItem: Ptr<DERByte> | null = null,
		end: Ptr<DERByte> | null = null,
	) {
		this.nextItem = nextItem;
		this.end = end;
	}

	static {
		toStringTag(this, 'DERSequence');
	}
}
