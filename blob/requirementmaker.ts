import { type Class, toStringTag } from '@hqtsm/class';
import { type ArrayBufferPointer, dataView, Ptr } from '@hqtsm/struct';
import {
	opAnchorHash,
	opAppleAnchor,
	opAppleGenericAnchor,
	opCDHash,
	opIdent,
	opInfoKeyValue,
	opPlatform,
	opTrustedCert,
	opTrustedCerts,
} from '../const.ts';
import { alignUp } from '../util/memory.ts';
import { Requirement } from './requirement.ts';
import type { RequirementMakerLabel } from './requirementmakerlabel.ts';

/**
 * For creating a new Requirement blob.
 */
export class RequirementMaker {
	declare public readonly ['constructor']: Class<typeof RequirementMaker>;

	/**
	 * Buffer of allocated bytes.
	 */
	private mBuffer: ArrayBuffer;

	/**
	 * Current position in buffer.
	 */
	private mPC: number;

	/**
	 * Maker constructor.
	 *
	 * @param k Kind.
	 */
	constructor(k: number) {
		const buffer = new ArrayBuffer(1024);
		const r = new Requirement(buffer);
		r.initializeLength();
		r.kind(k);
		this.mBuffer = buffer;
		this.mPC = r.byteLength;
	}

	/**
	 * Allocate bytes at end of buffer and return a view of that.
	 *
	 * @param size Size in bytes.
	 * @returns View of allocated bytes.
	 */
	public alloc(size: number): Uint8Array<ArrayBuffer> {
		const usedSize = alignUp(size, Requirement.baseAlignment);
		RequirementMaker.prototype.require.call(this, usedSize);
		const a = new Uint8Array(this.mBuffer, this.mPC, size);
		this.mPC += usedSize;
		return a;
	}

	/**
	 * Put data without length.
	 *
	 * @param data Data or uint32.
	 */
	public put(data: ArrayBufferLike | ArrayBufferView | number): void {
		if (typeof data === 'number') {
			const a = RequirementMaker.prototype.alloc.call(this, 4);
			dataView(a.buffer).setUint32(a.byteOffset, data);
		} else {
			const d = 'buffer' in data
				? new Uint8Array(
					data.buffer,
					data.byteOffset,
					data.byteLength,
				)
				: new Uint8Array(data);
			RequirementMaker.prototype.alloc.call(this, d.byteLength).set(d);
		}
	}

	/**
	 * Put data with length.
	 *
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public putData(data: ArrayBufferPointer, length: number): void;

	/**
	 * Put data with length.
	 *
	 * @param data Data.
	 */
	public putData(data: ArrayBufferLike | ArrayBufferView): void;

	/**
	 * Put data with length.
	 *
	 * @param data Data or buffer pointer.
	 * @param length Length in bytes.
	 */
	public putData(
		data: ArrayBufferLike | ArrayBufferPointer | ArrayBufferView,
		length?: number,
	): void {
		const d = 'buffer' in data
			? new Uint8Array(
				data.buffer,
				data.byteOffset,
				length ?? (data as ArrayBufferView).byteLength,
			)
			: new Uint8Array(data);
		RequirementMaker.prototype.put.call(this, d.byteLength);
		RequirementMaker.prototype.put.call(this, d);
	}

	/**
	 * Anchor Apple.
	 */
	public anchor(): void {
		RequirementMaker.prototype.put.call(this, opAppleAnchor);
	}

	/**
	 * Anchor Apple generic.
	 */
	public anchorGeneric(): void {
		RequirementMaker.prototype.put.call(this, opAppleGenericAnchor);
	}

	/**
	 * Anchor hash.
	 *
	 * @param slot Slot index.
	 * @param digest SHA1 digest.
	 */
	public anchorDigest(slot: number, digest: ArrayBufferPointer): void {
		RequirementMaker.prototype.put.call(this, opAnchorHash);
		RequirementMaker.prototype.put.call(this, slot);
		// SHA1 digest length:
		RequirementMaker.prototype.putData.call<
			RequirementMaker,
			[ArrayBufferPointer, number],
			void
		>(this, digest, 20);
	}

	/**
	 * Trusted anchor.
	 *
	 * @param slot Slot index or null.
	 */
	public trustedAnchor(slot: number | null = null): void {
		if (slot === null) {
			RequirementMaker.prototype.put.call(this, opTrustedCerts);
		} else {
			RequirementMaker.prototype.put.call(this, opTrustedCert);
			RequirementMaker.prototype.put.call(this, slot);
		}
	}

	/**
	 * Put info key value.
	 *
	 * @param key Key string.
	 * @param value Value string.
	 */
	public infoKey(
		key: ArrayBufferLike | ArrayBufferView,
		value: ArrayBufferLike | ArrayBufferView,
	): void {
		RequirementMaker.prototype.put.call(this, opInfoKeyValue);
		RequirementMaker.prototype.putData.call(this, key);
		RequirementMaker.prototype.putData.call(this, value);
	}

	/**
	 * Put identifier.
	 *
	 * @param identifier Identifier string.
	 */
	public ident(identifier: ArrayBufferLike | ArrayBufferView): void {
		RequirementMaker.prototype.put.call(this, opIdent);
		RequirementMaker.prototype.putData.call(this, identifier);
	}

	/**
	 * Put code directory hash.
	 *
	 * @param digest Hash digest.
	 */
	public cdhash(digest: ArrayBufferLike | ArrayBufferView): void {
		RequirementMaker.prototype.put.call(this, opCDHash);
		RequirementMaker.prototype.putData.call(this, digest);
	}

	/**
	 * Put platform identifier.
	 *
	 * @param platformIdentifier Platform identifier.
	 */
	public platform(platformIdentifier: number): void {
		RequirementMaker.prototype.put.call(this, opPlatform);
		RequirementMaker.prototype.put.call(this, platformIdentifier);
	}

	/**
	 * Copy data.
	 *
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public copy(data: ArrayBufferPointer, length: number): void;

	/**
	 * Copy requirement (embed).
	 *
	 * @param req Requirement.
	 */
	public copy(req: Requirement): void;

	/**
	 * Copy data or requirement.
	 *
	 * @param data Buffer pointer or requirement.
	 * @param length Undefined for requirement.
	 */
	public copy(
		data: ArrayBufferPointer | Requirement,
		length?: number,
	): void {
		if (length === undefined) {
			const req = data as Requirement;
			const Req = req.constructor;
			const kind = Requirement.prototype.kind.call<
				Requirement,
				[],
				number
			>(req);
			if (kind !== Req.exprForm) {
				throw new RangeError(`Unsupported requirement kind: ${kind}`);
			}
			const { BYTE_LENGTH } = Req;
			RequirementMaker.prototype.copy.call<
				RequirementMaker,
				[ArrayBufferPointer, number],
				void
			>(
				this,
				(Requirement.prototype.at<Ptr>).call(req, Ptr, BYTE_LENGTH),
				Requirement.prototype.length.call<
					Requirement,
					[],
					number
				>(
					req,
				) - BYTE_LENGTH,
			);
		} else {
			const d = new Uint8Array(data.buffer, data.byteOffset, length);
			RequirementMaker.prototype.alloc.call(this, d.byteLength).set(d);
		}
	}

	/**
	 * Insert data.
	 *
	 * @param label Label instance.
	 * @param length Byte length.
	 * @returns Pointer to source data.
	 */
	public insert(label: RequirementMakerLabel, length = 4): Ptr {
		const { pos } = label;
		const req = new Requirement(this.mBuffer);
		RequirementMaker.prototype.require.call(this, length);
		const len = this.mPC - pos;
		const reqDest = req.at(Ptr, pos + length);
		const reqSrc = req.at(Ptr, pos);
		new Uint8Array(reqDest.buffer, reqDest.byteOffset, len).set(
			new Uint8Array(reqSrc.buffer, reqSrc.byteOffset, len),
		);
		this.mPC += length;
		return reqSrc;
	}

	/**
	 * Set kind.
	 *
	 * @param kind Requirement kind.
	 */
	public kind(kind: number): void {
		new Requirement(this.mBuffer).kind(kind);
	}

	/**
	 * Length of Requirement currently defined.
	 *
	 * @returns Byte length.
	 */
	public length(): number {
		return this.mPC;
	}

	/**
	 * Make requirement.
	 *
	 * @returns Requirement instance.
	 */
	public make(): Requirement {
		const r = new Requirement(this.mBuffer);
		r.length(this.mPC);
		return r;
	}

	/**
	 * Require bytes.
	 *
	 * @param size Number of bytes required.
	 */
	protected require(size: number): void {
		const { mBuffer } = this;
		const end = this.mPC + size;
		let mSize = mBuffer.byteLength;
		if (end > mSize) {
			mSize *= 2;
			if (end > mSize) {
				mSize = end;
			}
			const d = new ArrayBuffer(mSize);
			new Uint8Array(d).set(new Uint8Array(mBuffer));
			this.mBuffer = d;
		}
	}

	static {
		toStringTag(this, 'RequirementMaker');
	}
}
