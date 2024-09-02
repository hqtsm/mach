/* eslint-disable max-classes-per-file */

import {Blob} from '../blob.ts';
import {BufferView, ByteLength, ByteWrite} from '../type.ts';
import {
	kSecCodeMagicCodeDirectory,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
	kSecCodeSignatureNoHash
} from '../const.ts';
import {sparseSet, stringToBytes, subview} from '../util.ts';

/**
 * CodeDirectory class.
 */
export class CodeDirectory extends Blob {
	/**
	 * Earliest supported version.
	 */
	public static readonly earliestVersion = 0x20001;

	/**
	 * First version to support scatter.
	 */
	public static readonly supportsScatter = 0x20100;

	/**
	 * First version to support team ID.
	 */
	public static readonly supportsTeamID = 0x20200;

	/**
	 * First version to support codeLimit64.
	 */
	public static readonly supportsCodeLimit64 = 0x20300;

	/**
	 * First version to support exec base and limit.
	 */
	public static readonly supportsExecSegment = 0x20400;

	/**
	 * First version to support pre-encrypt hashes and runtime version.
	 */
	public static readonly supportsPreEncrypt = 0x20500;

	/**
	 * Scatter structure.
	 */
	public static readonly Scatter = class Scatter
		implements ByteLength, ByteWrite
	{
		/**
		 * @inheritdoc
		 */
		public get byteLength() {
			return 24;
		}

		/**
		 * Number of pages; zero for sentinel (only).
		 */
		public count = 0;

		/**
		 * First page number.
		 */
		public base = 0;

		/**
		 * Byte offset in target.
		 */
		public targetOffset = 0n;

		/**
		 * @inheritdoc
		 */
		public byteWrite(buffer: BufferView, offset = 0) {
			const {byteLength} = this;
			const d = subview(DataView, buffer, offset, byteLength);
			d.setUint32(0, this.count);
			d.setUint32(4, this.base);
			d.setBigUint64(8, this.targetOffset);
			// Reserved: spare (must be zero).
			d.setBigUint64(16, 0n);
			return byteLength;
		}
	};

	/**
	 * @inheritdoc
	 */
	public get magic() {
		return kSecCodeMagicCodeDirectory;
	}

	/**
	 * @inheritdoc
	 */
	public get length() {
		return this.hashOffset + this.codeSlotsSize;
	}

	/**
	 * Compatibility version.
	 */
	public version = 0;

	/**
	 * Setup and mode flags.
	 */
	public flags = 0;

	/**
	 * Offset of hash slot element at index zero.
	 *
	 * @returns Byte offset.
	 */
	public get hashOffset() {
		const {preEncryptOffset} = this;
		let o = 0;
		if (preEncryptOffset) {
			o = preEncryptOffset + this.preEncryptSize;
		} else {
			const {teamIDOffset} = this;
			o = teamIDOffset
				? teamIDOffset + this.teamIDSize
				: this.identOffset + this.identSize;
		}
		// Special slots negative indexed from code hash slots.
		return o + this.specialSlotsSize;
	}

	/**
	 * Signature identifier.
	 */
	public identifier = '';

	/**
	 * Offset of ident string.
	 *
	 * @returns Byte offset.
	 */
	public get identOffset() {
		const Self = this.constructor as typeof CodeDirectory;
		const {scatterOffset} = this;
		return scatterOffset
			? scatterOffset + this.scatterSize
			: Self.fixedSize(this.version);
	}

	/**
	 * Size of ident string, including the null byte.
	 *
	 * @returns Byte size.
	 */
	public get identSize() {
		return stringToBytes(this.identifier).length + 1;
	}

	/**
	 * The special hash slots.
	 */
	readonly #specialSlots: (Readonly<Uint8Array> | undefined)[] = [];

	/**
	 * Number of special hash slots.
	 *
	 * @returns Number of slots.
	 */
	public get nSpecialSlots() {
		return this.#specialSlots.length;
	}

	/**
	 * Size of special hash slots.
	 *
	 * @returns Byte size.
	 */
	public get specialSlotsSize() {
		return this.nSpecialSlots * this.hashSize;
	}

	/**
	 * The ordinary (code) hash slots.
	 */
	readonly #codeSlots: (Readonly<Uint8Array> | undefined)[] = [];

	/**
	 * Number of ordinary (code) hash slots.
	 *
	 * @returns Number of slots.
	 */
	public get nCodeSlots() {
		return this.#codeSlots.length;
	}

	/**
	 * Size of ordinary (code) hash slots.
	 *
	 * @returns Byte size.
	 */
	public get codeSlotsSize() {
		return this.nCodeSlots * this.hashSize;
	}

	/**
	 * Limit to main image signature range, 32 bits.
	 */
	public codeLimit = 0;

	/**
	 * Get bytes of each hash digest for hashType.
	 *
	 * @returns Size of each hash digest (bytes).
	 */
	public get hashSize(): number {
		switch (this.hashType) {
			case kSecCodeSignatureNoHash: {
				return 0;
			}
			case kSecCodeSignatureHashSHA1:
			case kSecCodeSignatureHashSHA256Truncated: {
				return 20;
			}
			case kSecCodeSignatureHashSHA256: {
				return 32;
			}
			case kSecCodeSignatureHashSHA384: {
				return 48;
			}
			case kSecCodeSignatureHashSHA512: {
				return 64;
			}
			default: {
				// Do nothing.
			}
		}
		throw new Error(`Unknown hash type: ${this.hashType}`);
	}

	/**
	 * Type of hash (kSecCodeSignatureHash* constants).
	 */
	public hashType = kSecCodeSignatureNoHash;

	/**
	 * Platform identifier, zero if not platform binary.
	 */
	public platform = 0;

	/**
	 * The log2(page size in bytes), 0 => infinite.
	 */
	public pageSize = 0;

	/**
	 * Scatter vector.
	 */
	public scatterVector: InstanceType<typeof CodeDirectory.Scatter>[] = [];

	/**
	 * Offset of scatter vector.
	 *
	 * @returns Byte offset, or 0 for none.
	 */
	public get scatterOffset() {
		const Self = this.constructor as typeof CodeDirectory;
		const {version} = this;
		return version >= Self.supportsScatter && this.scatterVector
			? Self.fixedSize(version)
			: 0;
	}

	/**
	 * Number of bytes in scatter vector, including sentinel.
	 *
	 * @returns Byte count, or 0 for none.
	 */
	public get scatterSize() {
		// Additional 1 for sentinel.
		return this.scatterOffset ? (this.scatterVector.length + 1) * 24 : 0;
	}

	/**
	 * Optional team ID string.
	 */
	public teamID = '';

	/**
	 * Offset of optional team ID string.
	 *
	 * @returns Byte offset, or 0 for none.
	 */
	public get teamIDOffset() {
		const Self = this.constructor as typeof CodeDirectory;
		const {version} = this;
		return version >= Self.supportsTeamID && this.teamID
			? this.identOffset + this.identSize
			: 0;
	}

	/**
	 * Size of optional team ID string, including the null byte.
	 *
	 * @returns Byte count, or 0 for none.
	 */
	public get teamIDSize() {
		return this.teamIDOffset ? stringToBytes(this.teamID).length + 1 : 0;
	}

	/**
	 * Limit to main image signature range, 64 bits.
	 */
	public codeLimit64 = 0n;

	/**
	 * Offset of executable segment (TEXT segment file offset).
	 */
	public execSegBase = 0n;

	/**
	 * Limit of executable segment (TEXT segment file size).
	 */
	public execSegLimit = 0n;

	/**
	 * The exec segment flags (kSecCodeExecSeg* constants).
	 */
	public execSegFlags = 0n;

	/**
	 * Runtime version encoded as an unsigned integer.
	 */
	public runtime = 0;

	/**
	 * Pre-encrypt hash slots.
	 */
	readonly #preEncryptSlots: (Readonly<Uint8Array> | undefined)[] = [];

	/**
	 * Offset of pre-encrypt hash slots.
	 *
	 * @returns Byte offset, or 0 for none.
	 */
	public get preEncryptOffset() {
		const Self = this.constructor as typeof CodeDirectory;
		const {version} = this;
		if (
			version >= Self.supportsPreEncrypt &&
			this.#preEncryptSlots.length
		) {
			const {teamIDOffset} = this;
			return teamIDOffset
				? teamIDOffset + this.teamIDSize
				: this.identOffset + this.identSize;
		}
		return 0;
	}

	/**
	 * Size of pre-encrypt hash slots.
	 *
	 * @returns Byte offset, or 0 for none.
	 */
	public get preEncryptSize() {
		const {preEncryptOffset} = this;
		return preEncryptOffset ? this.codeSlotsSize : 0;
	}

	/**
	 * Get hash slot value.
	 *
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public getSlot(slot: number, preEncrypt: boolean) {
		let a;
		if (preEncrypt) {
			a = this.#preEncryptSlots;
		} else if (slot < 0) {
			a = this.#specialSlots;
			slot = 1 - slot;
		} else {
			a = this.#codeSlots;
		}
		return a[slot] || null;
	}

	/**
	 * Set hash slot value.
	 *
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @param value Hash value, or null.
	 */
	public setSlot(
		slot: number,
		preEncrypt: boolean,
		value: Readonly<Uint8Array> | null
	) {
		let a;
		if (preEncrypt) {
			a = this.#preEncryptSlots;
		} else if (slot < 0) {
			a = this.#specialSlots;
			slot = 1 - slot;
		} else {
			a = this.#codeSlots;
		}
		// eslint-disable-next-line no-undefined
		sparseSet(a, slot, value || undefined);
	}

	/**
	 * @inheritdoc
	 */
	public byteWrite(buffer: BufferView, offset = 0) {
		const Self = this.constructor as typeof CodeDirectory;
		const {
			length,
			version,
			scatterOffset,
			identOffset,
			teamIDOffset,
			hashOffset,
			hashSize,
			preEncryptOffset,
			nSpecialSlots,
			nCodeSlots
		} = this;
		const d = subview(DataView, buffer, offset, length);
		let o = 0;
		d.setUint32(o, this.magic);
		o += 4;
		d.setUint32(o, length);
		o += 4;
		d.setUint32(o, version);
		o += 4;
		d.setUint32(o, this.flags);
		o += 4;
		d.setUint32(o, hashOffset);
		o += 4;
		d.setUint32(o, identOffset);
		o += 4;
		d.setUint32(o, nSpecialSlots);
		o += 4;
		d.setUint32(o, nCodeSlots);
		o += 4;
		d.setUint32(o, this.codeLimit);
		o += 4;
		d.setUint8(o++, hashSize);
		d.setUint8(o++, this.hashType);
		d.setUint8(o++, this.platform);
		d.setUint8(o++, this.pageSize);
		// Reserved: spare2 (must be zero).
		d.setUint32(o, 0);
		o += 4;
		d.setUint32(o, scatterOffset);
		o += 4;

		if (version >= Self.supportsTeamID) {
			d.setUint32(o, teamIDOffset);
			o += 4;
		}

		if (version >= Self.supportsCodeLimit64) {
			// Reserved: spare3 (must be zero).
			d.setUint32(o, 0);
			o += 4;
			d.setBigUint64(o, this.codeLimit64);
			o += 8;
		}

		if (version >= Self.supportsExecSegment) {
			d.setBigUint64(o, this.execSegBase);
			o += 8;
			d.setBigUint64(o, this.execSegLimit);
			o += 8;
			d.setBigUint64(o, this.execSegFlags);
			o += 8;
		}

		if (version >= Self.supportsPreEncrypt) {
			d.setUint32(o, this.runtime);
			o += 4;
			d.setUint32(o, preEncryptOffset);
			o += 4;
		}

		if ((o = scatterOffset)) {
			const sentinel = new Self.Scatter();
			for (const scatter of this.scatterVector) {
				o += scatter.byteWrite(d, o);
			}
			sentinel.byteWrite(d, o);
		}

		subview(Uint8Array, d, identOffset).set(
			stringToBytes(`${this.identifier}\0`)
		);

		if (teamIDOffset) {
			subview(Uint8Array, d, teamIDOffset).set(
				stringToBytes(`${this.teamID}\0`)
			);
		}

		if ((o = preEncryptOffset)) {
			for (let i = 0; i < nCodeSlots; i++) {
				const v = subview(Uint8Array, d, o, hashSize);
				const h = this.getSlot(i, true);
				if (h) {
					if (h.length !== hashSize) {
						throw new Error(`Invalid hash size: ${h.length}`);
					}
					v.set(h);
				} else {
					v.fill(0);
				}
				o += hashSize;
			}
		}

		// TODO

		return length;
	}

	/**
	 * Get fixed size for compatibility version.
	 *
	 * @param version Compatibility version.
	 * @returns Byte size.
	 */
	public static fixedSize(version: number) {
		let l = 48;
		if (version >= this.supportsTeamID) {
			l += 4;
		}
		if (version >= this.supportsCodeLimit64) {
			l += 12;
		}
		if (version >= this.supportsExecSegment) {
			l += 24;
		}
		if (version >= this.supportsPreEncrypt) {
			l += 8;
		}
		return l;
	}
}
