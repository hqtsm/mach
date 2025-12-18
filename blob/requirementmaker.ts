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
		Requirement.initializeLength(r);
		Requirement.kind(r, k);
		this.mBuffer = buffer;
		this.mPC = r.byteLength;
	}

	/**
	 * Allocate bytes at end of buffer and return a view of that.
	 *
	 * @param self This.
	 * @param size Size in bytes.
	 * @returns View of allocated bytes.
	 */
	public static alloc(
		self: RequirementMaker,
		size: number,
	): Uint8Array<ArrayBuffer> {
		const usedSize = alignUp(size, Requirement.baseAlignment);
		RequirementMaker.require(self, usedSize);
		const a = new Uint8Array(self.mBuffer, self.mPC, size);
		self.mPC += usedSize;
		return a;
	}

	/**
	 * Put data without length.
	 *
	 * @param self This.
	 * @param data Data or uint32.
	 */
	public static put(
		self: RequirementMaker,
		data: ArrayBufferLike | ArrayBufferView | number,
	): void {
		if (typeof data === 'number') {
			const a = RequirementMaker.alloc(self, 4);
			dataView(a.buffer).setUint32(a.byteOffset, data);
		} else {
			const d = 'buffer' in data
				? new Uint8Array(
					data.buffer,
					data.byteOffset,
					data.byteLength,
				)
				: new Uint8Array(data);
			RequirementMaker.alloc(self, d.byteLength).set(d);
		}
	}

	/**
	 * Put data with length.
	 *
	 * @param self This.
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public static putData(
		self: RequirementMaker,
		data: ArrayBufferPointer,
		length: number,
	): void;

	/**
	 * Put data with length.
	 *
	 * @param self This.
	 * @param data Data.
	 */
	public static putData(
		self: RequirementMaker,
		data: ArrayBufferLike | ArrayBufferView,
	): void;

	/**
	 * Put data with length.
	 *
	 * @param self This.
	 * @param data Data or buffer pointer.
	 * @param length Length in bytes.
	 */
	public static putData(
		self: RequirementMaker,
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
		RequirementMaker.put(self, d.byteLength);
		RequirementMaker.put(self, d);
	}

	/**
	 * Anchor Apple.
	 *
	 * @param self This.
	 */
	public static anchor(self: RequirementMaker): void {
		RequirementMaker.put(self, opAppleAnchor);
	}

	/**
	 * Anchor Apple generic.
	 *
	 * @param self This.
	 */
	public static anchorGeneric(self: RequirementMaker): void {
		RequirementMaker.put(self, opAppleGenericAnchor);
	}

	/**
	 * Anchor hash.
	 *
	 * @param self This.
	 * @param slot Slot index.
	 * @param digest SHA1 digest.
	 */
	public static anchorDigest(
		self: RequirementMaker,
		slot: number,
		digest: ArrayBufferPointer,
	): void {
		RequirementMaker.put(self, opAnchorHash);
		RequirementMaker.put(self, slot);
		// SHA1 digest length:
		RequirementMaker.putData(self, digest, 20);
	}

	/**
	 * Trusted anchor.
	 *
	 * @param self This.
	 * @param slot Slot index or null.
	 */
	public static trustedAnchor(
		self: RequirementMaker,
		slot: number | null = null,
	): void {
		if (slot === null) {
			RequirementMaker.put(self, opTrustedCerts);
		} else {
			RequirementMaker.put(self, opTrustedCert);
			RequirementMaker.put(self, slot);
		}
	}

	/**
	 * Put info key value.
	 *
	 * @param self This.
	 * @param key Key string.
	 * @param value Value string.
	 */
	public static infoKey(
		self: RequirementMaker,
		key: ArrayBufferLike | ArrayBufferView,
		value: ArrayBufferLike | ArrayBufferView,
	): void {
		RequirementMaker.put(self, opInfoKeyValue);
		RequirementMaker.putData(self, key);
		RequirementMaker.putData(self, value);
	}

	/**
	 * Put identifier.
	 *
	 * @param self This.
	 * @param identifier Identifier string.
	 */
	public static ident(
		self: RequirementMaker,
		identifier: ArrayBufferLike | ArrayBufferView,
	): void {
		RequirementMaker.put(self, opIdent);
		RequirementMaker.putData(self, identifier);
	}

	/**
	 * Put code directory hash.
	 *
	 * @param self This.
	 * @param digest Hash digest.
	 */
	public static cdhash(
		self: RequirementMaker,
		digest: ArrayBufferLike | ArrayBufferView,
	): void {
		RequirementMaker.put(self, opCDHash);
		RequirementMaker.putData(self, digest);
	}

	/**
	 * Put platform identifier.
	 *
	 * @param self This.
	 * @param platformIdentifier Platform identifier.
	 */
	public static platform(
		self: RequirementMaker,
		platformIdentifier: number,
	): void {
		RequirementMaker.put(self, opPlatform);
		RequirementMaker.put(self, platformIdentifier);
	}

	/**
	 * Copy data.
	 *
	 * @param self This.
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public static copy(
		self: RequirementMaker,
		data: ArrayBufferPointer,
		length: number,
	): void;

	/**
	 * Copy requirement (embed).
	 *
	 * @param self This.
	 * @param req Requirement.
	 */
	public static copy(self: RequirementMaker, req: Requirement): void;

	/**
	 * Copy data or requirement.
	 *
	 * @param self This.
	 * @param data Buffer pointer or requirement.
	 * @param length Undefined for requirement.
	 */
	public static copy(
		self: RequirementMaker,
		data: ArrayBufferPointer | Requirement,
		length?: number,
	): void {
		if (length === undefined) {
			const req = data as Requirement;
			const Req = req.constructor;
			const kind = Requirement.kind(req);
			if (kind !== Req.exprForm) {
				throw new RangeError(`Unsupported requirement kind: ${kind}`);
			}
			const { BYTE_LENGTH } = Req;
			RequirementMaker.copy(
				self,
				Requirement.at(req, Ptr, BYTE_LENGTH),
				Requirement.size(req) - BYTE_LENGTH,
			);
		} else {
			const d = new Uint8Array(data.buffer, data.byteOffset, length);
			RequirementMaker.alloc(self, d.byteLength).set(d);
		}
	}

	/**
	 * Insert data.
	 *
	 * @param self This.
	 * @param label Label instance.
	 * @param length Byte length.
	 * @returns Pointer to source data.
	 */
	public static insert(
		self: RequirementMaker,
		label: RequirementMakerLabel,
		length = 4,
	): Ptr {
		const { pos } = label;
		const req = new Requirement(self.mBuffer);
		RequirementMaker.require(self, length);
		const len = self.mPC - pos;
		const reqDest = Requirement.at(req, Ptr, pos + length);
		const reqSrc = Requirement.at(req, Ptr, pos);
		new Uint8Array(reqDest.buffer, reqDest.byteOffset, len).set(
			new Uint8Array(reqSrc.buffer, reqSrc.byteOffset, len),
		);
		self.mPC += length;
		return reqSrc;
	}

	/**
	 * Set kind.
	 *
	 * @param self This.
	 * @param kind Requirement kind.
	 */
	public static kind(self: RequirementMaker, kind: number): void {
		Requirement.kind(new Requirement(self.mBuffer), kind);
	}

	/**
	 * Length of Requirement currently defined.
	 *
	 * @param self This.
	 * @returns Byte length.
	 */
	public static length(self: RequirementMaker): number {
		return self.mPC;
	}

	/**
	 * Make requirement.
	 *
	 * @param self This.
	 * @returns Requirement instance.
	 */
	public static make(self: RequirementMaker): Requirement {
		const r = new Requirement(self.mBuffer);
		Requirement.size(r, self.mPC);
		return r;
	}

	/**
	 * Require bytes.
	 *
	 * @param self This.
	 * @param size Number of bytes required.
	 */
	protected static require(self: RequirementMaker, size: number): void {
		const { mBuffer } = self;
		const end = self.mPC + size;
		let mSize = mBuffer.byteLength;
		if (end > mSize) {
			mSize *= 2;
			if (end > mSize) {
				mSize = end;
			}
			const d = new ArrayBuffer(mSize);
			new Uint8Array(d).set(new Uint8Array(mBuffer));
			self.mBuffer = d;
		}
	}

	static {
		toStringTag(this, 'RequirementMaker');
	}
}
