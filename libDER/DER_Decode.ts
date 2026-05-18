import { toStringTag } from '@hqtsm/class';
import { type Ptr, Uint8Ptr } from '@hqtsm/struct';
import type { _const } from '../libc/c.ts';
import type { DERItem } from './DERItem.ts';
import type { DERByte } from './libDER_config.ts';
import { type DERReturn, DR_Success } from './libDER.ts';

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

/**
 * Initialize sequence content.
 *
 * @param content Content.
 * @param derSeq Sequence.
 * @returns Return code.
 */
export function DERDecodeSeqContentInit(
	content: _const<DERItem>,
	derSeq: DERSequence,
): DERReturn {
	const data = content.data!;
	derSeq.nextItem = data;
	derSeq.end = new Uint8Ptr(data.buffer, data.byteOffset + content.length);
	return DR_Success;
}
