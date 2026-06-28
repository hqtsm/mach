import { toStringTag } from '@hqtsm/class';
import { type ArrayBufferPointer, dataView, Ptr } from '@hqtsm/struct';
import {
	type ArrayBufferLikeData,
	bufferToBytes,
	pointerBytes,
	type SubtleCryptoDigest,
	viewBytes,
} from '../helpers/mod.ts';
import {
	type bool,
	ENOMEM,
	type int,
	memcpy,
	realloc,
	type size_t,
	strlen,
	type uint,
	type uint32_t,
} from '../libc/mod.ts';
import { errSecCSReqUnsupported } from '../Security/mod.ts';
import {
	type Security_BlobCore_Offset,
	Security_LowLevelMemoryUtilities_alignUp,
	Security_MacOSError,
	Security_SHA1,
	Security_UnixError,
} from '../security_utilities/mod.ts';
import {
	type Security_CodeSigning_ExprOp,
	type Security_CodeSigning_MatchOperation,
	Security_CodeSigning_opAnchorHash,
	Security_CodeSigning_opAppleAnchor,
	Security_CodeSigning_opAppleGenericAnchor,
	Security_CodeSigning_opCDHash,
	Security_CodeSigning_opIdent,
	Security_CodeSigning_opInfoKeyValue,
	Security_CodeSigning_opPlatform,
	Security_CodeSigning_opTrustedCert,
	Security_CodeSigning_opTrustedCerts,
	Security_CodeSigning_Requirement,
	type Security_CodeSigning_RequirementKind,
} from './requirement.ts';

/**
 * Requirement Maker Label.
 */
export class Security_CodeSigning_Requirement_Maker_Label {
	/**
	 * Label position.
	 */
	public pos: Security_BlobCore_Offset;

	/**
	 * Label constructor.
	 *
	 * @param maker Maker reference.
	 */
	constructor(maker: Security_CodeSigning_Requirement_Maker) {
		this.pos = Security_CodeSigning_Requirement_Maker.size(maker);
	}

	static {
		toStringTag(this, 'Security_CodeSigning_Requirement_Maker_Label');
	}
}

/**
 * Requirement Maker Chain.
 */
export class Security_CodeSigning_Requirement_Maker_Chain
	extends Security_CodeSigning_Requirement_Maker_Label {
	/**
	 * Chain constructor.
	 *
	 * @param maker Maker reference.
	 * @param op Joiner opcode.
	 */
	constructor(
		maker: Security_CodeSigning_Requirement_Maker,
		op: Security_CodeSigning_ExprOp,
	) {
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
	public static add(
		_this: Security_CodeSigning_Requirement_Maker_Chain,
	): void {
		if (_this.mCount++) {
			const p = Security_CodeSigning_Requirement_Maker.insert(
				_this.maker,
				_this,
			);
			dataView(p.buffer).setUint32(p.byteOffset, _this.mJoiner);
		}
	}

	/**
	 * Maker reference.
	 */
	public maker: Security_CodeSigning_Requirement_Maker;

	/**
	 * Check if the chain has no elements.
	 *
	 * @param _this This.
	 * @returns Is empty.
	 */
	public static empty(
		_this: Security_CodeSigning_Requirement_Maker_Chain,
	): bool {
		return !_this.mCount;
	}

	/**
	 * Joiner opcode.
	 */
	private readonly mJoiner: Security_CodeSigning_ExprOp;

	/**
	 * Number of elements in the chain.
	 */
	private mCount: uint;

	static {
		toStringTag(this, 'Security_CodeSigning_Requirement_Maker_Chain');
	}
}

/**
 * For creating a new Requirement blob.
 */
export class Security_CodeSigning_Requirement_Maker {
	/**
	 * Maker constructor.
	 *
	 * @param k Kind.
	 */
	constructor(
		k: Security_CodeSigning_RequirementKind =
			Security_CodeSigning_Requirement.exprForm,
	) {
		const buffer = new ArrayBuffer(1024);
		const r = new Security_CodeSigning_Requirement(buffer);
		Security_CodeSigning_Requirement.initializeSize(r);
		Security_CodeSigning_Requirement.kind(r, k);
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
		_this: Security_CodeSigning_Requirement_Maker,
		size: size_t,
	): Uint8Array<ArrayBuffer> {
		const usedSize = Security_LowLevelMemoryUtilities_alignUp(
			size,
			Security_CodeSigning_Requirement.baseAlignment,
		);
		Security_CodeSigning_Requirement_Maker.require(_this, usedSize);
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
		_this: Security_CodeSigning_Requirement_Maker,
		data:
			| uint32_t
			| Security_CodeSigning_ExprOp
			| Security_CodeSigning_MatchOperation
			| ArrayBufferLikeData
			| ArrayBufferPointer,
	): void {
		if (typeof data === 'number') {
			const d = Security_CodeSigning_Requirement_Maker.alloc(_this, 4);
			dataView(d.buffer).setUint32(d.byteOffset, data);
		} else {
			const l = 'byteLength' in data ? data.byteLength : strlen(data);
			const d = pointerBytes(data, l);
			Security_CodeSigning_Requirement_Maker.alloc(_this, l).set(d);
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
		_this: Security_CodeSigning_Requirement_Maker,
		data: ArrayBufferPointer,
		length: size_t,
	): void;

	/**
	 * Put data with length.
	 *
	 * @param _this This.
	 * @param data Data.
	 */
	public static putData(
		_this: Security_CodeSigning_Requirement_Maker,
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
		_this: Security_CodeSigning_Requirement_Maker,
		data: ArrayBufferLikeData | ArrayBufferPointer,
		length?: size_t,
	): void {
		const d = length === undefined
			? viewBytes(data as ArrayBufferLikeData)
			: pointerBytes(data, length);
		const l = d.byteLength;
		Security_CodeSigning_Requirement_Maker.put(_this, l);
		memcpy(Security_CodeSigning_Requirement_Maker.alloc(_this, l), d, l);
	}

	/**
	 * Anchor Apple.
	 *
	 * @param _this This.
	 */
	public static anchor(_this: Security_CodeSigning_Requirement_Maker): void;

	/**
	 * Anchor digest.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @param digest SHA1 digest.
	 */
	public static anchor(
		_this: Security_CodeSigning_Requirement_Maker,
		slot: int,
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
		_this: Security_CodeSigning_Requirement_Maker,
		slot: int,
		cert: ArrayBufferPointer,
		length: size_t,
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
		_this: Security_CodeSigning_Requirement_Maker,
		slot?: int,
		cert?: ArrayBufferPointer,
		length?: size_t,
		subtle: SubtleCryptoDigest | null = null,
	): Promise<void> | void {
		if (length !== undefined) {
			const digest = Security_SHA1.Digest();
			const sha1 = new Security_SHA1();
			sha1.subtle = subtle;
			return sha1
				.update(bufferToBytes(cert!.buffer, cert!.byteOffset, length))
				.then(() => sha1.finish(digest))
				.then(() =>
					Security_CodeSigning_Requirement_Maker.anchor(
						_this,
						slot!,
						digest,
					)
				);
		} else if (cert) {
			Security_CodeSigning_Requirement_Maker.put(
				_this,
				Security_CodeSigning_opAnchorHash,
			);
			Security_CodeSigning_Requirement_Maker.put(_this, slot!);
			Security_CodeSigning_Requirement_Maker.putData(
				_this,
				cert,
				Security_SHA1.digestLength,
			);
		} else {
			Security_CodeSigning_Requirement_Maker.put(
				_this,
				Security_CodeSigning_opAppleAnchor,
			);
		}
	}

	/**
	 * Anchor Apple generic.
	 *
	 * @param _this This.
	 */
	public static anchorGeneric(
		_this: Security_CodeSigning_Requirement_Maker,
	): void {
		Security_CodeSigning_Requirement_Maker.put(
			_this,
			Security_CodeSigning_opAppleGenericAnchor,
		);
	}

	/**
	 * Trusted anchor.
	 *
	 * @param _this This.
	 * @param slot Slot index or null.
	 */
	public static trustedAnchor(
		_this: Security_CodeSigning_Requirement_Maker,
		slot?: int,
	): void {
		if (slot === undefined) {
			Security_CodeSigning_Requirement_Maker.put(
				_this,
				Security_CodeSigning_opTrustedCerts,
			);
		} else {
			Security_CodeSigning_Requirement_Maker.put(
				_this,
				Security_CodeSigning_opTrustedCert,
			);
			Security_CodeSigning_Requirement_Maker.put(_this, slot);
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
		_this: Security_CodeSigning_Requirement_Maker,
		key: ArrayBufferLikeData,
		value: ArrayBufferLikeData,
	): void {
		Security_CodeSigning_Requirement_Maker.put(
			_this,
			Security_CodeSigning_opInfoKeyValue,
		);
		Security_CodeSigning_Requirement_Maker.putData(_this, key);
		Security_CodeSigning_Requirement_Maker.putData(_this, value);
	}

	/**
	 * Put identifier.
	 *
	 * @param _this This.
	 * @param identifier Identifier string.
	 */
	public static ident(
		_this: Security_CodeSigning_Requirement_Maker,
		identifier: ArrayBufferLikeData,
	): void {
		Security_CodeSigning_Requirement_Maker.put(
			_this,
			Security_CodeSigning_opIdent,
		);
		Security_CodeSigning_Requirement_Maker.putData(_this, identifier);
	}

	/**
	 * Put code directory hash.
	 *
	 * @param _this This.
	 * @param digest Hash digest.
	 */
	public static cdhash(
		_this: Security_CodeSigning_Requirement_Maker,
		digest: ArrayBufferLikeData,
	): void {
		Security_CodeSigning_Requirement_Maker.put(
			_this,
			Security_CodeSigning_opCDHash,
		);
		Security_CodeSigning_Requirement_Maker.putData(_this, digest);
	}

	/**
	 * Put platform identifier.
	 *
	 * @param _this This.
	 * @param platformIdentifier Platform identifier.
	 */
	public static platform(
		_this: Security_CodeSigning_Requirement_Maker,
		platformIdentifier: int,
	): void {
		Security_CodeSigning_Requirement_Maker.put(
			_this,
			Security_CodeSigning_opPlatform,
		);
		Security_CodeSigning_Requirement_Maker.put(_this, platformIdentifier);
	}

	/**
	 * Copy data.
	 *
	 * @param _this This.
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public static copy(
		_this: Security_CodeSigning_Requirement_Maker,
		data: ArrayBufferPointer,
		length: size_t,
	): void;

	/**
	 * Copy requirement (embed).
	 *
	 * @param _this This.
	 * @param req Requirement.
	 */
	public static copy(
		_this: Security_CodeSigning_Requirement_Maker,
		req: Security_CodeSigning_Requirement,
	): void;

	/**
	 * Copy data or requirement.
	 *
	 * @param _this This.
	 * @param data Buffer pointer or requirement.
	 * @param length Undefined for requirement.
	 */
	public static copy(
		_this: Security_CodeSigning_Requirement_Maker,
		data: ArrayBufferPointer | Security_CodeSigning_Requirement,
		length?: size_t,
	): void {
		if (length === undefined) {
			const req = data as Security_CodeSigning_Requirement;
			const kind = Security_CodeSigning_Requirement.kind(req);
			if (kind !== Security_CodeSigning_Requirement.exprForm) {
				Security_MacOSError.throwMe(errSecCSReqUnsupported);
			}
			const { BYTE_LENGTH } = Security_CodeSigning_Requirement;
			Security_CodeSigning_Requirement_Maker.copy(
				_this,
				Security_CodeSigning_Requirement.at(req, Ptr, BYTE_LENGTH),
				Security_CodeSigning_Requirement.size(req) - BYTE_LENGTH,
			);
		} else {
			const d = new Uint8Array(data.buffer, data.byteOffset, length);
			Security_CodeSigning_Requirement_Maker.alloc(_this, d.byteLength)
				.set(d);
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
		_this: Security_CodeSigning_Requirement_Maker,
		label: Security_CodeSigning_Requirement_Maker_Label,
		length: size_t = 4,
	): Ptr {
		const { pos } = label;
		const req = new Security_CodeSigning_Requirement(_this.mBuffer!);
		Security_CodeSigning_Requirement_Maker.require(_this, length);
		const len = _this.mPC - pos;
		const reqDest = Security_CodeSigning_Requirement.at(
			req,
			Ptr,
			pos + length,
		);
		const reqSrc = Security_CodeSigning_Requirement.at(req, Ptr, pos);
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
	public static kind(
		_this: Security_CodeSigning_Requirement_Maker,
		kind: Security_CodeSigning_RequirementKind,
	): void {
		Security_CodeSigning_Requirement.kind(
			new Security_CodeSigning_Requirement(_this.mBuffer!),
			kind,
		);
	}

	/**
	 * Length of Requirement currently defined.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static size(_this: Security_CodeSigning_Requirement_Maker): size_t {
		return _this.mPC;
	}

	/**
	 * Make requirement.
	 *
	 * @param _this This.
	 * @returns Requirement instance.
	 */
	public static make(
		_this: Security_CodeSigning_Requirement_Maker,
	): Security_CodeSigning_Requirement {
		const r = new Security_CodeSigning_Requirement(_this.mBuffer!);
		Security_CodeSigning_Requirement.size(r, _this.mPC);
		_this.mBuffer = null;
		return r;
	}

	/**
	 * Require bytes.
	 *
	 * @param _this This.
	 * @param size Number of bytes required.
	 */
	protected static require(
		_this: Security_CodeSigning_Requirement_Maker,
		size: size_t,
	): void {
		const { mBuffer } = _this;
		const end = _this.mPC + size;
		let mSize = mBuffer!.byteLength;
		if (end > mSize) {
			mSize *= 2;
			if (end > mSize) {
				mSize = end;
			}
			if (!(_this.mBuffer = realloc(mBuffer!, mSize))) {
				Security_UnixError.throwMe(ENOMEM);
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
	private mPC: Security_BlobCore_Offset;

	static {
		toStringTag(this, 'Security_CodeSigning_Requirement_Maker');
	}
}
