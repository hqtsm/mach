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
	 * @param _this This.
	 * @param size Size in bytes.
	 * @returns View of allocated bytes.
	 */
	public static alloc(
		_this: RequirementMaker,
		size: number,
	): Uint8Array<ArrayBuffer> {
		const usedSize = alignUp(size, Requirement.baseAlignment);
		RequirementMaker.require(_this, usedSize);
		const a = new Uint8Array(_this.mBuffer, _this.mPC, size);
		_this.mPC += usedSize;
		return a;
	}

	/**
	 * Put data without length.
	 *
	 * @param _this This.
	 * @param data Data or uint32.
	 */
	public static put(
		_this: RequirementMaker,
		data: ArrayBufferLike | ArrayBufferView | number,
	): void {
		if (typeof data === 'number') {
			const a = RequirementMaker.alloc(_this, 4);
			dataView(a.buffer).setUint32(a.byteOffset, data);
		} else {
			const d = 'buffer' in data
				? new Uint8Array(
					data.buffer,
					data.byteOffset,
					data.byteLength,
				)
				: new Uint8Array(data);
			RequirementMaker.alloc(_this, d.byteLength).set(d);
		}
	}

	/**
	 * Put data with length.
	 *
	 * @param _this This.
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public static putData(
		_this: RequirementMaker,
		data: ArrayBufferPointer,
		length: number,
	): void;

	/**
	 * Put data with length.
	 *
	 * @param _this This.
	 * @param data Data.
	 */
	public static putData(
		_this: RequirementMaker,
		data: ArrayBufferLike | ArrayBufferView,
	): void;

	/**
	 * Put data with length.
	 *
	 * @param _this This.
	 * @param data Data or buffer pointer.
	 * @param length Length in bytes.
	 */
	public static putData(
		_this: RequirementMaker,
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
		RequirementMaker.put(_this, d.byteLength);
		RequirementMaker.put(_this, d);
	}

	/**
	 * Anchor Apple.
	 *
	 * @param _this This.
	 */
	public static anchor(_this: RequirementMaker): void {
		RequirementMaker.put(_this, opAppleAnchor);
	}

	/**
	 * Anchor Apple generic.
	 *
	 * @param _this This.
	 */
	public static anchorGeneric(_this: RequirementMaker): void {
		RequirementMaker.put(_this, opAppleGenericAnchor);
	}

	/**
	 * Anchor hash.
	 *
	 * @param _this This.
	 * @param slot Slot index.
	 * @param digest SHA1 digest.
	 */
	public static anchorDigest(
		_this: RequirementMaker,
		slot: number,
		digest: ArrayBufferPointer,
	): void {
		RequirementMaker.put(_this, opAnchorHash);
		RequirementMaker.put(_this, slot);
		// SHA1 digest length:
		RequirementMaker.putData(_this, digest, 20);
	}

	/**
	 * Trusted anchor.
	 *
	 * @param _this This.
	 * @param slot Slot index or null.
	 */
	public static trustedAnchor(
		_this: RequirementMaker,
		slot: number | null = null,
	): void {
		if (slot === null) {
			RequirementMaker.put(_this, opTrustedCerts);
		} else {
			RequirementMaker.put(_this, opTrustedCert);
			RequirementMaker.put(_this, slot);
		}
	}

	/**
	 * Put info key value.
	 *
	 * @param _this This.
	 * @param key Key string.
	 * @param value Value string.
	 */
	public static infoKey(
		_this: RequirementMaker,
		key: ArrayBufferLike | ArrayBufferView,
		value: ArrayBufferLike | ArrayBufferView,
	): void {
		RequirementMaker.put(_this, opInfoKeyValue);
		RequirementMaker.putData(_this, key);
		RequirementMaker.putData(_this, value);
	}

	/**
	 * Put identifier.
	 *
	 * @param _this This.
	 * @param identifier Identifier string.
	 */
	public static ident(
		_this: RequirementMaker,
		identifier: ArrayBufferLike | ArrayBufferView,
	): void {
		RequirementMaker.put(_this, opIdent);
		RequirementMaker.putData(_this, identifier);
	}

	/**
	 * Put code directory hash.
	 *
	 * @param _this This.
	 * @param digest Hash digest.
	 */
	public static cdhash(
		_this: RequirementMaker,
		digest: ArrayBufferLike | ArrayBufferView,
	): void {
		RequirementMaker.put(_this, opCDHash);
		RequirementMaker.putData(_this, digest);
	}

	/**
	 * Put platform identifier.
	 *
	 * @param _this This.
	 * @param platformIdentifier Platform identifier.
	 */
	public static platform(
		_this: RequirementMaker,
		platformIdentifier: number,
	): void {
		RequirementMaker.put(_this, opPlatform);
		RequirementMaker.put(_this, platformIdentifier);
	}

	/**
	 * Copy data.
	 *
	 * @param _this This.
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public static copy(
		_this: RequirementMaker,
		data: ArrayBufferPointer,
		length: number,
	): void;

	/**
	 * Copy requirement (embed).
	 *
	 * @param _this This.
	 * @param req Requirement.
	 */
	public static copy(_this: RequirementMaker, req: Requirement): void;

	/**
	 * Copy data or requirement.
	 *
	 * @param _this This.
	 * @param data Buffer pointer or requirement.
	 * @param length Undefined for requirement.
	 */
	public static copy(
		_this: RequirementMaker,
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
				_this,
				Requirement.at(req, Ptr, BYTE_LENGTH),
				Requirement.size(req) - BYTE_LENGTH,
			);
		} else {
			const d = new Uint8Array(data.buffer, data.byteOffset, length);
			RequirementMaker.alloc(_this, d.byteLength).set(d);
		}
	}

	/**
	 * Insert data.
	 *
	 * @param _this This.
	 * @param label Label instance.
	 * @param length Byte length.
	 * @returns Pointer to source data.
	 */
	public static insert(
		_this: RequirementMaker,
		label: RequirementMakerLabel,
		length = 4,
	): Ptr {
		const { pos } = label;
		const req = new Requirement(_this.mBuffer);
		RequirementMaker.require(_this, length);
		const len = _this.mPC - pos;
		const reqDest = Requirement.at(req, Ptr, pos + length);
		const reqSrc = Requirement.at(req, Ptr, pos);
		new Uint8Array(reqDest.buffer, reqDest.byteOffset, len).set(
			new Uint8Array(reqSrc.buffer, reqSrc.byteOffset, len),
		);
		_this.mPC += length;
		return reqSrc;
	}

	/**
	 * Set kind.
	 *
	 * @param _this This.
	 * @param kind Requirement kind.
	 */
	public static kind(_this: RequirementMaker, kind: number): void {
		Requirement.kind(new Requirement(_this.mBuffer), kind);
	}

	/**
	 * Length of Requirement currently defined.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static length(_this: RequirementMaker): number {
		return _this.mPC;
	}

	/**
	 * Make requirement.
	 *
	 * @param _this This.
	 * @returns Requirement instance.
	 */
	public static make(_this: RequirementMaker): Requirement {
		const r = new Requirement(_this.mBuffer);
		Requirement.size(r, _this.mPC);
		return r;
	}

	/**
	 * Require bytes.
	 *
	 * @param _this This.
	 * @param size Number of bytes required.
	 */
	protected static require(_this: RequirementMaker, size: number): void {
		const { mBuffer } = _this;
		const end = _this.mPC + size;
		let mSize = mBuffer.byteLength;
		if (end > mSize) {
			mSize *= 2;
			if (end > mSize) {
				mSize = end;
			}
			const d = new ArrayBuffer(mSize);
			new Uint8Array(d).set(new Uint8Array(mBuffer));
			_this.mBuffer = d;
		}
	}

	static {
		toStringTag(this, 'RequirementMaker');
	}
}
