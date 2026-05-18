import { toStringTag } from '@hqtsm/class';
import { type Ptr, Uint8Ptr } from '@hqtsm/struct';
import type { _const, _ptr, bool } from '../libc/c.ts';
import { DERItem } from './DERItem.ts';
import {
	DER_TAG_SIZE,
	type DERByte,
	type DERSize,
	type DERTag,
} from './libDER_config.ts';
import { type DERReturn, DR_DecodeError, DR_Success } from './libDER.ts';

const DER_TAG_MASK = (1n << BigInt(DER_TAG_SIZE) * 8n) - 1n;

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
 * Decode item from partial buffer.
 *
 * @param der DER item.
 * @param decoded Decoded info.
 * @returns Return code.
 */
export function DERDecodeItem(
	der: _const<DERItem>,
	decoded: DERDecodedInfo,
): DERReturn {
	return DERDecodeItemPartialBufferGetLength(der, decoded, null);
}

/**
 * Decode item from partial buffer.
 *
 * @param der DER item.
 * @param decoded Decoded info.
 * @param allowPartialBuffer Encoded length.
 * @returns Return code.
 */
export function DERDecodeItemPartialBuffer(
	der: _const<DERItem>,
	decoded: DERDecodedInfo,
	allowPartialBuffer: bool,
): DERReturn {
	let tagNumber: DERTag;
	const derPtr = der.data!;
	let derPtrI = 0;
	let derLen = der.length;

	if (derLen < 2) {
		return DR_DecodeError;
	}

	const tag1 = derPtr[derPtrI++];
	derLen--;
	tagNumber = BigInt(tag1 & 0x1F);
	if (tagNumber === 0x1Fn) {
		const overflowMask: DERTag = (
			0x7Fn << BigInt(DER_TAG_SIZE * 8 - 7)
		) & DER_TAG_MASK;
		let tagByte;
		tagNumber = 0n;
		const b = derPtr[derPtrI];
		if (b === 0x80 || b < 0x1F) {
			return DR_DecodeError;
		}
		do {
			if (derLen < 2 || (tagNumber & overflowMask)) {
				return DR_DecodeError;
			}
			tagByte = derPtr[derPtrI++];
			derLen--;
			tagNumber = (
				(tagNumber << 7n) | BigInt(tagByte & 0x7F)
			) & DER_TAG_MASK;
		} while ((tagByte & 0x80));

		// Check for top 3 reserved bits.
		if ((tagNumber & (overflowMask << 4n))) {
			return DR_DecodeError;
		}
	}

	// Top 3 bits are class/method.
	decoded.tag = (BigInt(tag1 & 0xE0) << BigInt((DER_TAG_SIZE - 1) * 8)) |
		tagNumber;

	let len1 = derPtr[derPtrI++];
	derLen--;
	if (len1 & 0x80) {
		// Long form.
		let longLen = 0n;
		len1 &= 0x7f;
		if (len1 > 6 || (len1 > derLen) || !len1 || !derPtr[derPtrI]) {
			return DR_DecodeError;
		}
		for (let dex = 0; dex < len1; dex++) {
			longLen <<= 8n;
			longLen |= BigInt(derPtr[derPtrI++]);
			derLen--;
		}
		if (longLen > derLen && !allowPartialBuffer) {
			return DR_DecodeError;
		}
		len1 = Number(longLen);
	} else {
		// Short form.
		if (len1 > derLen && !allowPartialBuffer) {
			return DR_DecodeError;
		}
	}
	decoded.content.data = new Uint8Ptr(
		derPtr.buffer,
		derPtr.byteOffset + derPtrI,
		derPtr.littleEndian,
	);
	decoded.content.length = len1;
	return DR_Success;
}

/**
 * Decode item from partial buffer and get length.
 *
 * @param der DER item.
 * @param decoded Decoded info.
 * @param encodedLength Encoded length.
 * @returns Return code.
 */
export function DERDecodeItemPartialBufferGetLength(
	der: _const<DERItem>,
	decoded: DERDecodedInfo,
	encodedLength: _ptr<DERSize> | null,
): DERReturn {
	let tagNumber: DERTag;
	const derPtr = der.data!;
	let derPtrI = 0;
	let derLen = der.length;

	if (derLen < 2) {
		return DR_DecodeError;
	}

	const tag1 = derPtr[derPtrI++];
	derLen--;
	tagNumber = BigInt(tag1 & 0x1F);
	if (tagNumber === 0x1Fn) {
		const overflowMask: DERTag = (
			0x7Fn << BigInt(DER_TAG_SIZE * 8 - 7)
		) & DER_TAG_MASK;
		let tagByte;
		tagNumber = 0n;
		const b = derPtr[derPtrI];
		if (b === 0x80 || b < 0x1F) {
			return DR_DecodeError;
		}
		do {
			if (derLen < 2 || (tagNumber & overflowMask)) {
				return DR_DecodeError;
			}
			tagByte = derPtr[derPtrI++];
			derLen--;
			tagNumber = (
				(tagNumber << 7n) | BigInt(tagByte & 0x7F)
			) & DER_TAG_MASK;
		} while ((tagByte & 0x80));

		// Check for top 3 reserved bits.
		if ((tagNumber & (overflowMask << 4n))) {
			return DR_DecodeError;
		}
	}

	// Top 3 bits are class/method.
	decoded.tag = (BigInt(tag1 & 0xE0) << BigInt((DER_TAG_SIZE - 1) * 8)) |
		tagNumber;

	let len1 = derPtr[derPtrI++];
	derLen--;
	if (len1 & 0x80) {
		// Long form.
		let longLen = 0n;
		len1 &= 0x7f;
		if (len1 > 6 || (len1 > derLen) || !len1 || !derPtr[derPtrI]) {
			return DR_DecodeError;
		}
		for (let dex = 0; dex < len1; dex++) {
			longLen <<= 8n;
			longLen |= BigInt(derPtr[derPtrI++]);
			derLen--;
		}
		if (longLen > derLen && !encodedLength) {
			return DR_DecodeError;
		}
		if (longLen < derLen) {
			derLen = Number(longLen);
		}
		len1 = Number(longLen);
	} else {
		// Short form.
		if (len1 > derLen && !encodedLength) {
			return DR_DecodeError;
		}
		if (len1 < derLen) {
			derLen = len1;
		}
	}
	decoded.content.data = new Uint8Ptr(
		derPtr.buffer,
		derPtr.byteOffset + derPtrI,
		derPtr.littleEndian,
	);
	decoded.content.length = derLen;
	if (encodedLength) {
		encodedLength[0] = len1;
	}
	return DR_Success;
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
