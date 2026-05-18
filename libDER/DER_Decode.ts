import { toStringTag } from '@hqtsm/class';
import { type Ptr, Uint8Ptr } from '@hqtsm/struct';
import type { _const } from '../libc/c.ts';
import { DERItem } from './DERItem.ts';
import type { DERByte, DERTag } from './libDER_config.ts';
import { type DERReturn, DR_Success } from './libDER.ts';

/**
 * DER decoded info.
 */
export class DERDecodedInfo {
	/**
	 * Tag.
	 */
	public tag: DERTag;

	/**
	 * Content.
	 */
	public content: DERItem;

	/**
	 * Constructor.
	 *
	 * @param tag Tag.
	 * @param content Content.
	 */
	constructor(tag: DERTag = 0n, content: DERItem = new DERItem()) {
		this.tag = tag;
		this.content = content;
	}

	static {
		toStringTag(this, 'DERDecodedInfo');
	}
}

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
