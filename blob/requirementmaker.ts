import {
	type BufferPointer,
	type BufferView,
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
import { alignUp } from '../util.ts';
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
	#buffer: ArrayBuffer;

	/**
	 * Current position in buffer.
	 */
	#pc = 0;

	/**
	 * Maker constructor.
	 *
	 * @param kind Kind.
	 */
	constructor(kind: number) {
		const { BYTE_LENGTH } = Requirement;
		const buffer = new ArrayBuffer(Math.max(BYTE_LENGTH, 1024));
		const r = new Requirement(buffer);
		r.initialize2();
		r.kind = kind;
		this.#buffer = buffer;
		this.#pc = BYTE_LENGTH;
	}

	/**
	 * Allocate bytes at end of buffer and return a view of that.
	 *
	 * @param size Size in bytes.
	 * @returns View of allocated bytes.
	 */
	public alloc(size: number): Uint8Array {
		const usedSize = alignUp(size, Requirement.baseAlignment);
		this.require(usedSize);
		const a = new Uint8Array(this.#buffer, this.#pc, size);
		this.#pc += usedSize;
		return a;
	}

	/**
	 * Put data without length.
	 *
	 * @param data Buffer view, or uint32.
	 */
	public put(data: BufferView | number): void {
		if (typeof data === 'number') {
			const a = this.alloc(4);
			dataView(a.buffer).setUint32(a.byteOffset, data);
		} else {
			const d = new Uint8Array(
				data.buffer,
				data.byteOffset,
				data.byteLength,
			);
			this.alloc(d.byteLength).set(d);
		}
	}

	/**
	 * Put data with length.
	 *
	 * @param data Buffer pointer.
	 * @param length Length in bytes, null for view byte length.
	 */
	public putData(data: BufferPointer, length: number): void;

	/**
	 * Put data with length.
	 *
	 * @param data Buffer view.
	 */
	public putData(data: BufferView): void;

	public putData(data: BufferPointer | BufferView, length?: number): void {
		const a = new Uint8Array(
			data.buffer,
			data.byteOffset,
			length ?? (data as BufferView).byteLength,
		);
		this.put(a.byteLength);
		this.put(a);
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
	public infoKey(key: BufferView, value: BufferView): void {
		this.put(opInfoKeyValue);
		this.putData(key);
		this.putData(value);
	}

	/**
	 * Put identifier.
	 *
	 * @param identifier Identifier string.
	 */
	public ident(identifier: BufferView): void {
		this.put(opIdent);
		this.putData(identifier);
	}

	/**
	 * Put code directory hash.
	 *
	 * @param digest Hash digest.
	 */
	public cdhash(digest: BufferView): void {
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
	 * Copy data.
	 *
	 * @param data Buffer view.
	 */
	public copy(data: BufferView): void;

	public copy(data: BufferPointer | BufferView, length?: number): void {
		const d = new Uint8Array(
			data.buffer,
			data.byteOffset,
			length ?? (data as BufferView).byteLength,
		);
		this.alloc(d.byteLength).set(d);
	}

	/**
	 * Copy requirement (embed).
	 *
	 * @param req Requirement.
	 */
	public copyRequirement(req: Requirement): void {
		const { constructor: Requirement, kind } = req;
		if (kind !== Requirement.exprForm) {
			throw new Error(`Unsupported requirement kind: ${kind}`);
		}
		const { BYTE_LENGTH } = Requirement;
		this.copy(req.at(Ptr, BYTE_LENGTH), req.length - BYTE_LENGTH);
	}

	/**
	 * Insert data.
	 *
	 * @param label Label instance.
	 * @param length Byte length.
	 * @returns View of source data.
	 */
	public insert(label: Readonly<RequirementMakerLabel>, length = 4): Ptr {
		const { pos } = label;
		const req = new Requirement(this.#buffer);
		this.require(length);
		const len = this.#pc - pos;
		const reqDest = req.at(Ptr, pos + length);
		const reqSrc = req.at(Ptr, pos);
		new Uint8Array(reqDest.buffer, reqDest.byteOffset, len).set(
			new Uint8Array(reqSrc.buffer, reqSrc.byteOffset, len),
		);
		this.#pc += length;
		return reqSrc;
	}

	/**
	 * Set kind.
	 *
	 * @param kind Requirement kind.
	 */
	public kind(kind: number): void {
		new Requirement(this.#buffer).kind = kind;
	}

	/**
	 * Get length of Requirement currently defined.
	 *
	 * @returns Byte length.
	 */
	public get length(): number {
		return this.#pc;
	}

	/**
	 * Make requirement.
	 *
	 * @returns Requirement instance.
	 */
	public make(): Requirement {
		const r = new Requirement(this.#buffer);
		r.length = this.#pc;
		return r;
	}

	/**
	 * Require bytes.
	 *
	 * @param size Number of bytes required.
	 */
	protected require(size: number): void {
		const data = this.#buffer;
		const pc = this.#pc;
		let total = data.byteLength;
		if (pc + size > total) {
			total *= 2;
			if (pc + size > total) {
				total = pc + size;
			}
			const d = new ArrayBuffer(total);
			new Uint8Array(d).set(new Uint8Array(data));
			this.#buffer = d;
		}
	}
}
