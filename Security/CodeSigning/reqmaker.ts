import { toStringTag } from '@hqtsm/class';
import { type ArrayBufferPointer, dataView, Ptr } from '@hqtsm/struct';
import { ENOMEM } from '../../libc/errno.ts';
import { realloc } from '../../libc/stdlib.ts';
import type { SubtleCryptoDigest } from '../../util/crypto.ts';
import {
	alignUp,
	type ArrayBufferLikeData,
	asUint8Array,
} from '../../util/memory.ts';
import { errSecCSReqUnsupported } from '../CSCommon.ts';
import { MacOSError, UnixError } from '../errors.ts';
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
	Requirement,
} from './requirement.ts';

/**
 * RequirementMaker label.
 */
export class RequirementMakerLabel {
	/**
	 * Label position.
	 */
	public pos: number;

	/**
	 * Label constructor.
	 *
	 * @param maker Maker reference.
	 */
	constructor(maker: RequirementMaker) {
		this.pos = RequirementMaker.size(maker);
	}

	static {
		toStringTag(this, 'RequirementMakerLabel');
	}
}

/**
 * RequirementMaker chain.
 */
export class RequirementMakerChain extends RequirementMakerLabel {
	/**
	 * Chain constructor.
	 *
	 * @param maker Maker reference.
	 * @param op Joiner opcode.
	 */
	constructor(maker: RequirementMaker, op: number) {
		super(maker);
		this.maker = maker;
		this.mJoiner = op;
		this.mCount = 0;
	}

	/**
	 * Add an element to the chain.
	 *
	 * @param _this This.
	 */
	public static add(_this: RequirementMakerChain): void {
		if (_this.mCount++) {
			const p = RequirementMaker.insert(_this.maker, _this);
			dataView(p.buffer).setUint32(p.byteOffset, _this.mJoiner);
		}
	}

	/**
	 * Maker reference.
	 */
	public maker: RequirementMaker;

	/**
	 * Check if the chain has no elements.
	 *
	 * @param _this This.
	 * @returns Is empty.
	 */
	public static empty(_this: RequirementMakerChain): boolean {
		return _this.mCount === 0;
	}

	/**
	 * Joiner opcode.
	 */
	private readonly mJoiner: number;

	/**
	 * Number of elements in the chain.
	 */
	private mCount: number;

	static {
		toStringTag(this, 'RequirementMakerChain');
	}
}

/**
 * For creating a new Requirement blob.
 */
export class RequirementMaker {
	/**
	 * Maker constructor.
	 *
	 * @param k Kind.
	 */
	constructor(k: number) {
		const buffer = new ArrayBuffer(1024);
		const r = new Requirement(buffer);
		Requirement.initializeSize(r);
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
		const a = new Uint8Array(_this.mBuffer!, _this.mPC, size);
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
		data: ArrayBufferLikeData | number,
	): void {
		if (typeof data === 'number') {
			const a = RequirementMaker.alloc(_this, 4);
			dataView(a.buffer).setUint32(a.byteOffset, data);
		} else {
			const d = asUint8Array(data);
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
		data: ArrayBufferLikeData,
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
		data: ArrayBufferLikeData | ArrayBufferPointer,
		length?: number,
	): void {
		asUint8Array(data, length ?? (data as ArrayBufferView).byteLength);
		const d = asUint8Array(
			data,
			length ?? (data as ArrayBufferView).byteLength,
		);
		RequirementMaker.put(_this, d.byteLength);
		RequirementMaker.put(_this, d);
	}

	/**
	 * Anchor Apple.
	 *
	 * @param _this This.
	 */
	public static anchor(_this: RequirementMaker): void;

	/**
	 * Anchor digest.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @param digest SHA1 digest.
	 */
	public static anchor(
		_this: RequirementMaker,
		slot: number,
		digest: ArrayBufferPointer<ArrayBuffer>,
	): void;

	/**
	 * Anchor certificate.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @param cert Certificate.
	 * @param length Length in bytes.
	 * @param crypto Digest algorithm.
	 */
	public static anchor(
		_this: RequirementMaker,
		slot: number,
		cert: ArrayBufferPointer<ArrayBuffer>,
		length: number,
		subtle?: SubtleCryptoDigest,
	): Promise<void>;

	/**
	 * Anchor Apple.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @param cert Certificate or SHA1 digest.
	 * @param length Length in bytes.
	 * @param crypto Digest algorithm.
	 * @returns Promise or void.
	 */
	public static anchor(
		_this: RequirementMaker,
		slot?: number,
		cert?: ArrayBufferPointer<ArrayBuffer>,
		length?: number,
		subtle?: SubtleCryptoDigest,
	): Promise<void> | void {
		if (length !== undefined) {
			const c = asUint8Array(cert!, length);
			return (subtle || crypto.subtle).digest('SHA-1', c).then((d) => {
				RequirementMaker.anchor(_this, slot!, new Uint8Array(d));
			});
		} else if (cert) {
			RequirementMaker.put(_this, opAnchorHash);
			RequirementMaker.put(_this, slot!);
			RequirementMaker.putData(_this, cert, 20);
		} else {
			RequirementMaker.put(_this, opAppleAnchor);
		}
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
		key: ArrayBufferLikeData,
		value: ArrayBufferLikeData,
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
		identifier: ArrayBufferLikeData,
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
		digest: ArrayBufferLikeData,
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
			const kind = Requirement.kind(req);
			if (kind !== Requirement.exprForm) {
				MacOSError.throwMe(errSecCSReqUnsupported);
			}
			const { BYTE_LENGTH } = Requirement;
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
		const req = new Requirement(_this.mBuffer!);
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
		Requirement.kind(new Requirement(_this.mBuffer!), kind);
	}

	/**
	 * Length of Requirement currently defined.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static size(_this: RequirementMaker): number {
		return _this.mPC;
	}

	/**
	 * Make requirement.
	 *
	 * @param _this This.
	 * @returns Requirement instance.
	 */
	public static make(_this: RequirementMaker): Requirement {
		const r = new Requirement(_this.mBuffer!);
		Requirement.size(r, _this.mPC);
		_this.mBuffer = null;
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
		let mSize = mBuffer!.byteLength;
		if (end > mSize) {
			mSize *= 2;
			if (end > mSize) {
				mSize = end;
			}
			if (!(_this.mBuffer = realloc(mBuffer!, mSize))) {
				UnixError.throwMe(ENOMEM);
			}
		}
	}

	/**
	 * Buffer of allocated bytes.
	 */
	private mBuffer: ArrayBuffer | null;

	/**
	 * Current position in buffer.
	 */
	private mPC: number;

	static {
		toStringTag(this, 'RequirementMaker');
	}
}
