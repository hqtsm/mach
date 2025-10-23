import {
	type ArrayBufferReal,
	type BufferPointer,
	type BufferView,
	type Const,
	dataView,
	Ptr,
} from '@hqtsm/struct';
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
	declare public readonly ['constructor']: Omit<
		typeof RequirementMaker,
		'new'
	>;

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
	 * @param kind Kind.
	 */
	constructor(kind: number) {
		const buffer = new ArrayBuffer(1024);
		const r = new Requirement(buffer);
		r.initialize2();
		r.kind = kind;
		this.mBuffer = buffer;
		this.mPC = r.byteLength;
	}

	/**
	 * Allocate bytes at end of buffer and return a view of that.
	 *
	 * @param size Size in bytes.
	 * @returns View of allocated bytes.
	 */
	public alloc(size: number): InstanceType<typeof Uint8Array> {
		const usedSize = alignUp(size, Requirement.baseAlignment);
		this.require(usedSize);
		const a = new Uint8Array(this.mBuffer, this.mPC, size);
		this.mPC += usedSize;
		return a;
	}

	/**
	 * Put data without length.
	 *
	 * @param data Data or uint32.
	 */
	public put(data: ArrayBufferReal | BufferView | number): void {
		if (typeof data === 'number') {
			const a = this.alloc(4);
			dataView(a.buffer).setUint32(a.byteOffset, data);
		} else {
			const d = 'buffer' in data
				? new Uint8Array(
					data.buffer,
					data.byteOffset,
					data.byteLength,
				)
				: new Uint8Array(data);
			this.alloc(d.byteLength).set(d);
		}
	}

	/**
	 * Put data with length.
	 *
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public putData(data: BufferPointer, length: number): void;

	/**
	 * Put data with length.
	 *
	 * @param data Data.
	 */
	public putData(data: ArrayBufferReal | BufferView): void;

	/**
	 * Put data with length.
	 *
	 * @param data Data or buffer pointer.
	 * @param length Length in bytes.
	 */
	public putData(
		data: ArrayBufferReal | BufferPointer | BufferView,
		length?: number,
	): void {
		const d = 'buffer' in data
			? new Uint8Array(
				data.buffer,
				data.byteOffset,
				length ?? (data as BufferView).byteLength,
			)
			: new Uint8Array(data);
		this.put(d.byteLength);
		this.put(d);
	}

	/**
	 * Anchor Apple.
	 */
	public anchor(): void {
		this.put(opAppleAnchor);
	}

	/**
	 * Anchor Apple generic.
	 */
	public anchorGeneric(): void {
		this.put(opAppleGenericAnchor);
	}

	/**
	 * Anchor hash.
	 *
	 * @param slot Slot index.
	 * @param digest SHA1 digest.
	 */
	public anchorDigest(slot: number, digest: BufferPointer): void {
		this.put(opAnchorHash);
		this.put(slot);
		// SHA1 digest length:
		this.putData(digest, 20);
	}

	/**
	 * Trusted anchor.
	 *
	 * @param slot Slot index or null.
	 */
	public trustedAnchor(slot: number | null = null): void {
		if (slot === null) {
			this.put(opTrustedCerts);
		} else {
			this.put(opTrustedCert);
			this.put(slot);
		}
	}

	/**
	 * Put info key value.
	 *
	 * @param key Key string.
	 * @param value Value string.
	 */
	public infoKey(
		key: ArrayBufferReal | BufferView,
		value: ArrayBufferReal | BufferView,
	): void {
		this.put(opInfoKeyValue);
		this.putData(key);
		this.putData(value);
	}

	/**
	 * Put identifier.
	 *
	 * @param identifier Identifier string.
	 */
	public ident(identifier: ArrayBufferReal | BufferView): void {
		this.put(opIdent);
		this.putData(identifier);
	}

	/**
	 * Put code directory hash.
	 *
	 * @param digest Hash digest.
	 */
	public cdhash(digest: ArrayBufferReal | BufferView): void {
		this.put(opCDHash);
		this.putData(digest);
	}

	/**
	 * Put platform identifier.
	 *
	 * @param platformIdentifier Platform identifier.
	 */
	public platform(platformIdentifier: number): void {
		this.put(opPlatform);
		this.put(platformIdentifier);
	}

	/**
	 * Copy data.
	 *
	 * @param data Buffer pointer.
	 * @param length Length in bytes.
	 */
	public copy(data: BufferPointer, length: number): void;

	/**
	 * Copy requirement (embed).
	 *
	 * @param req Requirement.
	 */
	public copy(req: Const<Requirement>): void;

	/**
	 * Copy data or requirement.
	 *
	 * @param data Buffer pointer or requirement.
	 * @param length Undefined for requirement.
	 */
	public copy(
		data: BufferPointer | Const<Requirement>,
		length?: number,
	): void {
		if (length === undefined) {
			const req = data as Const<Requirement>;
			const { constructor: Requirement, kind } = req;
			if (kind !== Requirement.exprForm) {
				throw new RangeError(`Unsupported requirement kind: ${kind}`);
			}
			const { BYTE_LENGTH } = Requirement;
			this.copy(req.at(Ptr, BYTE_LENGTH), req.length() - BYTE_LENGTH);
		} else {
			const d = new Uint8Array(data.buffer, data.byteOffset, length);
			this.alloc(d.byteLength).set(d);
		}
	}

	/**
	 * Insert data.
	 *
	 * @param label Label instance.
	 * @param length Byte length.
	 * @returns Pointer to source data.
	 */
	public insert(label: Const<RequirementMakerLabel>, length = 4): Ptr {
		const { pos } = label;
		const req = new Requirement(this.mBuffer);
		this.require(length);
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
		new Requirement(this.mBuffer).kind = kind;
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
}
