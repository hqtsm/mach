import { constant, toStringTag } from '@hqtsm/class';
import {
	type ArrayBufferPointer,
	type Const,
	Int8Ptr,
	pointer,
	type Ptr,
	Struct,
	uint32BE,
	uint64BE,
	uint8,
	Uint8Ptr,
} from '@hqtsm/struct';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
} from '../../CommonCrypto/Private/CommonDigestSPI.ts';
import { PAGE_SIZE_ARM64 } from '../../mach/vm_param.ts';
import {
	sizeAsyncIterators,
	type SizeIteratorNext,
} from '../../util/iterator.ts';
import { toUint8ArrayArrayBuffer } from '../../util/memory.ts';
import type { Reader } from '../../util/reader.ts';
import { Blob } from '../blob.ts';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
} from '../CSCommon.ts';
import {
	kSecCodeCDHashLength,
	kSecCodeMagicCodeDirectory,
} from '../CSCommonPriv.ts';
import {
	CCHashInstance,
	type DynamicHash,
	type DynamicHashCrypto,
} from '../hashing.ts';
import { hashFileData } from './csutilities.ts';

const max = (values: number[]) => Math.max(...values);

// Special hash slot values:

// Primary slots:

/**
 * Code directory Info.plist slot.
 */
export const cdInfoSlot = 1;

/**
 * Code directory internal requirements slot.
 */
export const cdRequirementsSlot = 2;

/**
 * Code directory resource directory slot.
 */
export const cdResourceDirSlot = 3;

/**
 * Code directory top directory slot.
 */
export const cdTopDirectorySlot = 4;

/**
 * Code directory embedded entitlement slot.
 */
export const cdEntitlementSlot = 5;

/**
 * Code directory disk rep slot.
 */
export const cdRepSpecificSlot = 6;

/**
 * Code directory entitlement DER slot.
 */
export const cdEntitlementDERSlot = 7;

/**
 * Code directory launch constraint self slot.
 */
export const cdLaunchConstraintSelf = 8;

/**
 * Code directory launch constraint parent slot.
 */
export const cdLaunchConstraintParent = 9;

/**
 * Code directory launch constraint responsible slot.
 */
export const cdLaunchConstraintResponsible = 10;

/**
 * Code directory library constraint slot.
 */
export const cdLibraryConstraint = 11;

/**
 * Code directory slot count.
 */
export const cdSlotCount = 12;

/**
 * Code directoty maximum slot.
 */
export const cdSlotMax = 11;

// Virtual slots:

/**
 * Code directory code directory slot.
 */
export const cdCodeDirectorySlot = 0;

/**
 * Code directory alternate code directory array slots.
 */
export const cdAlternateCodeDirectorySlots = 0x1000;

/**
 * Code directory alternate code directory array limit.
 */
export const cdAlternateCodeDirectoryLimit = 0x1005;

/**
 * Code directory CMS signature slot.
 */
export const cdSignatureSlot = 0x10000;

/**
 * Code directory identification blob slot.
 */
export const cdIdentificationSlot = 0x10001;

/**
 * Code directory ticket slot.
 */
export const cdTicketSlot = 0x10002;

// Special hash slot flags:

/**
 * Slot values differs for each architecture.
 */
export const cdComponentPerArchitecture = 1;

/**
 * Slot value is Blob.
 */
export const cdComponentIsBlob = 2;

// Platform values:

/**
 * No platform.
 */
export const noPlatform = 0;

/**
 * Maximum platform.
 */
export const maxPlatform = 255;

/**
 * CodeDirectory scatter vector element.
 */
export class CodeDirectoryScatter extends Struct {
	/**
	 * Page count; zero for sentinel (only).
	 */
	declare public count: number;

	/**
	 * First page number.
	 */
	declare public base: number;

	/**
	 * Byte offset in target.
	 */
	declare public targetOffset: bigint;

	/**
	 * Reserved, must be zero.
	 */
	declare public spare: bigint;

	static {
		toStringTag(this, 'CodeDirectoryScatter');
		uint32BE(this, 'count');
		uint32BE(this, 'base');
		uint64BE(this, 'targetOffset');
		uint64BE(this, 'spare');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Describes secured pieces of a program.
 */
export class CodeDirectory extends Blob {
	/**
	 * Compatibility version.
	 */
	declare public version: number;

	/**
	 * Setup and mode flags (SecCodeSignatureFlags kSecCodeSignature*).
	 */
	declare public flags: number;

	/**
	 * Offset of hash slot element at index zero.
	 */
	declare public hashOffset: number;

	/**
	 * Offset of identifier string.
	 */
	declare public identOffset: number;

	/**
	 * Number of special hash slots.
	 */
	declare public nSpecialSlots: number;

	/**
	 * Number of ordinary (code) hash slots.
	 */
	declare public nCodeSlots: number;

	/**
	 * Limit to main image signature range, 32 bits.
	 */
	declare public codeLimit: number;

	/**
	 * Size of each hash in bytes.
	 */
	declare public hashSize: number;

	/**
	 * Hash type (SecCSDigestAlgorithm kSecCodeSignatureHash*).
	 */
	declare public hashType: number;

	/**
	 * Platform identifier, zero if not platform binary.
	 */
	declare public platform: number;

	/**
	 * The page size, log2(page size in bytes), 0 => infinite.
	 */
	declare public pageSize: number;

	/**
	 * Unused, must be zero.
	 */
	declare public spare2: number;

	/**
	 * Offset of scatter vector or 0 for none.
	 * Assumes supportsScatter.
	 */
	declare public scatterOffset: number;

	/**
	 * Offset of team identifier or 0 for none.
	 * Assumes supportsTeamID.
	 */
	declare public teamIDOffset: number;

	/**
	 * Unused, must be zero.
	 */
	declare public spare3: number;

	/**
	 * Limit to main image signature range, 64 bits.
	 * Assumes supportsCodeLimit64.
	 */
	declare public codeLimit64: bigint;

	/**
	 * Offset of executable segment (TEXT segment file offset),
	 * Assumes supportsExecSegment.
	 */
	declare public execSegBase: bigint;

	/**
	 * Limit of executable segment (TEXT segment file size).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegLimit: bigint;

	/**
	 * The exec segment flags (SecCodeExecSegFlags kSecCodeExecSeg*).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegFlags: bigint;

	/**
	 * Runtime version encoded as an unsigned integer.
	 * Assumes supportsPreEncrypt.
	 */
	declare public runtime: number;

	/**
	 * Offset of pre-encrypt hash slots.
	 * Assumes supportsPreEncrypt.
	 */
	declare public preEncryptOffset: number;

	/**
	 * Pointer to identifier string.
	 *
	 * @param _this This.
	 * @returns Char pointer.
	 */
	public static identifier(_this: CodeDirectory): Int8Ptr {
		return new Int8Ptr(
			_this.buffer,
			_this.byteOffset + _this.identOffset,
			_this.littleEndian,
		);
	}

	/**
	 * Signed code limit, from codeLimit64 or codeLimit.
	 *
	 * @param _this This.
	 * @returns Code limit.
	 */
	public static signingLimit(_this: CodeDirectory): bigint {
		if (_this.version >= CodeDirectory.supportsCodeLimit64) {
			const { codeLimit64 } = _this;
			if (codeLimit64) {
				return codeLimit64;
			}
		}
		return BigInt(_this.codeLimit);
	}

	/**
	 * Get maximum special slot index.
	 *
	 * @param _this This.
	 * @returns Slot index.
	 */
	public static maxSpecialSlot(_this: CodeDirectory): number {
		const slot = _this.nSpecialSlots;
		return slot > cdSlotMax ? cdSlotMax : slot;
	}

	/**
	 * Get slot data view, for writing.
	 *
	 * @param _this This.
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public static getSlotMutable(
		_this: CodeDirectory,
		slot: number,
		preEncrypt: boolean,
	): Uint8Ptr | null {
		slot = (+slot || 0) - (slot % 1 || 0);
		let offset;
		if (preEncrypt) {
			if (
				_this.version < CodeDirectory.supportsPreEncrypt ||
				!(offset = _this.preEncryptOffset)
			) {
				return null;
			}
		} else {
			offset = _this.hashOffset;
		}
		return new Uint8Ptr(
			_this.buffer,
			_this.byteOffset + offset + _this.hashSize * slot,
			_this.littleEndian,
		);
	}

	/**
	 * Get slot data view, for reading.
	 *
	 * @param _this This.
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public static getSlot(
		_this: CodeDirectory,
		slot: number,
		preEncrypt: boolean,
	): Const<Uint8Ptr> | null {
		return CodeDirectory.getSlotMutable(_this, slot, preEncrypt);
	}

	/**
	 * Pointer to scatter vector.
	 *
	 * @param _this This.
	 * @returns Scatter pointer, or null.
	 */
	public static scatterVector(
		_this: CodeDirectory,
	): Ptr<CodeDirectoryScatter> | null {
		if (_this.version >= CodeDirectory.supportsScatter) {
			const { scatterOffset } = _this;
			if (scatterOffset) {
				return new (pointer(CodeDirectoryScatter))(
					_this.buffer,
					_this.byteOffset + scatterOffset,
					_this.littleEndian,
				);
			}
		}
		return null;
	}

	/**
	 * Pointer to team identifier string.
	 *
	 * @param _this This.
	 * @returns Char pointer, or null.
	 */
	public static teamID(_this: CodeDirectory): Int8Ptr | null {
		if (_this.version >= CodeDirectory.supportsTeamID) {
			const { teamIDOffset } = _this;
			if (teamIDOffset) {
				return new Int8Ptr(
					_this.buffer,
					_this.byteOffset + teamIDOffset,
					_this.littleEndian,
				);
			}
		}
		return null;
	}

	/**
	 * Executable segment base.
	 *
	 * @param _this This.
	 * @returns Byte offset, zero if not supported.
	 */
	public static execSegmentBase(_this: CodeDirectory): bigint {
		return _this.version >= CodeDirectory.supportsExecSegment
			? _this.execSegBase
			: 0n;
	}

	/**
	 * Executable segment limit.
	 *
	 * @param _this This.
	 * @returns Byte length, zero if not supported.
	 */
	public static execSegmentLimit(_this: CodeDirectory): bigint {
		return _this.version >= CodeDirectory.supportsExecSegment
			? _this.execSegLimit
			: 0n;
	}

	/**
	 * Executable segment flags.
	 *
	 * @param _this This.
	 * @returns Flags, zero if not supported.
	 */
	public static execSegmentFlags(_this: CodeDirectory): bigint {
		return _this.version >= CodeDirectory.supportsExecSegment
			? _this.execSegFlags
			: 0n;
	}

	/**
	 * Pointer to pre-encrypt hashes.
	 *
	 * @param _this This.
	 * @returns Hash pointer, or null.
	 */
	public static preEncryptHashes(
		_this: CodeDirectory,
	): Const<Uint8Ptr> | null {
		return CodeDirectory.getSlot(_this, 0, true);
	}

	/**
	 * Runtime version.
	 *
	 * @param _this This.
	 * @returns Version, zero if not supported.
	 */
	public static runtimeVersion(_this: CodeDirectory): number {
		return _this.version >= CodeDirectory.supportsPreEncrypt
			? _this.runtime
			: 0;
	}

	/**
	 * Validate slot against source.
	 *
	 * @param _this This.
	 * @param source Source data.
	 * @param size Source size.
	 * @param slot Slot index.
	 * @param preEncrypted Pre-encrypt version.
	 * @param crypto Hash crypto.
	 * @returns True if valid.
	 */
	public static async validateSlot(
		_this: CodeDirectory,
		source: ArrayBufferLike | ArrayBufferPointer | Reader,
		size: number,
		slot: number,
		preEncrypted: boolean,
		crypto: DynamicHashCrypto | null = null,
	): Promise<boolean> {
		const hash = CodeDirectory.getHash(_this);
		hash.crypto = crypto;
		const l = hash.digestLength();
		const digest = new Uint8Array(l);
		await (
			'arrayBuffer' in source
				? CodeDirectory.generateHash(hash, source, digest, size)
				: CodeDirectory.generateHash(
					hash,
					'buffer' in source
						? toUint8ArrayArrayBuffer(
							source.buffer,
							source.byteOffset,
							size,
						)
						: toUint8ArrayArrayBuffer(source, 0, size),
					size,
					digest,
				)
		);
		const slotDigest = CodeDirectory.getSlot(_this, slot, preEncrypted);
		if (!slotDigest) {
			throw new RangeError('Invalid slot');
		}
		for (let i = 0; i < l; i++) {
			if (digest[i] !== slotDigest[i]) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Check if slot is present and non-zero filled.
	 *
	 * @param _this This.
	 * @param slot Slot index.
	 * @returns True if present.
	 */
	public static slotIsPresent(_this: CodeDirectory, slot: number): boolean {
		if (slot >= -_this.nSpecialSlots && slot < _this.nCodeSlots) {
			const digest = CodeDirectory.getSlot(_this, slot, false);
			if (digest) {
				for (let i = 0, l = _this.hashSize; i < l; i++) {
					if (digest[i]) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * Get hash for current hash type.
	 *
	 * @param _this This.
	 * @returns Hash instance.
	 */
	public static getHash(_this: CodeDirectory): DynamicHash {
		return CodeDirectory.hashFor(_this.hashType);
	}

	/**
	 * Create code directory hash.
	 *
	 * @param _this This.
	 * @param truncate Truncate to kSecCodeCDHashLength.
	 * @param crypto Dynamic hash crypto.
	 * @returns Hash digest.
	 */
	public static async cdhash(
		_this: CodeDirectory,
		truncate = false,
		crypto: DynamicHashCrypto | null = null,
	): Promise<ArrayBuffer> {
		const hash = CodeDirectory.getHash(_this);
		hash.crypto = crypto;
		await hash.update(
			toUint8ArrayArrayBuffer(
				_this.buffer,
				_this.byteOffset,
				CodeDirectory.size(_this),
			),
		);
		const l = hash.digestLength();
		const digest = new ArrayBuffer(l);
		await hash.finish(digest);
		return truncate
			? digest.slice(0, Math.min(l, kSecCodeCDHashLength))
			: digest;
	}

	public static override readonly typeMagic = kSecCodeMagicCodeDirectory;

	/**
	 * Current version, subject to change.
	 */
	public static readonly currentVersion = 0x20500;

	/**
	 * Compatibility limit, subject to change.
	 */
	public static readonly compatibilityLimit = 0x2F000;

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
	 * Get hasher instance for hash type.
	 *
	 * @param hashType Hash type.
	 * @returns Hasher instance.
	 */
	public static hashFor(hashType: number): DynamicHash {
		switch (hashType) {
			case kSecCodeSignatureHashSHA1: {
				return new CCHashInstance(kCCDigestSHA1);
			}
			case kSecCodeSignatureHashSHA256: {
				return new CCHashInstance(kCCDigestSHA256);
			}
			case kSecCodeSignatureHashSHA384: {
				return new CCHashInstance(kCCDigestSHA384);
			}
			case kSecCodeSignatureHashSHA256Truncated: {
				return new CCHashInstance(kCCDigestSHA256, 20);
			}
		}
		throw new RangeError(`Unsupported hash type: ${hashType}`);
	}

	/**
	 * Hash file data with multiple hashers.
	 *
	 * @param reader Reader.
	 * @param limit Limit.
	 * @param types Types.
	 * @param action Callback for each hash.
	 * @param crypto Hash crypto.
	 */
	public static async multipleHashFileData(
		reader: Reader,
		limit: number,
		types: Set<number>,
		action: (type: number, hasher: DynamicHash) => Promise<void>,
		crypto: DynamicHashCrypto | null = null,
	): Promise<void> {
		const total = limit ? Math.min(limit, reader.size) : reader.size;
		const hashes: [number, DynamicHash][] = [];
		for (const type of types) {
			const hash = CodeDirectory.hashFor(type);
			hash.crypto = crypto;
			hashes.push([type, hash]);
		}
		let i = 0;
		let q: Promise<SizeIteratorNext<ArrayBuffer>>;
		const tee = sizeAsyncIterators(
			{
				next(size = 0): Promise<SizeIteratorNext<ArrayBuffer>> {
					return q = (q || Promise.resolve()).then(() => (
						i < total
							? reader.slice(
								i,
								Math.min(
									i + Math.max(size, PAGE_SIZE_ARM64),
									total,
								),
							).arrayBuffer().then((value) => {
								i += value.byteLength;
								return { done: false, value } as const;
							})
							: { done: true }
					));
				},
			},
			max,
			hashes.length,
		);
		await Promise.all(hashes.map(([, h], i) => h.update(tee[i], total)));
		await Promise.all(hashes.map(([t, h]) => action(t, h)));
	}

	/**
	 * Generate hash of reader.
	 *
	 * @param hasher Hasher instance.
	 * @param reader Reader.
	 * @param digest Digest.
	 * @param limit Limit.
	 * @returns Size.
	 */
	protected static async generateHash(
		hasher: DynamicHash,
		reader: Reader,
		digest: ArrayBufferLike | ArrayBufferPointer,
		limit?: number,
	): Promise<number>;

	/**
	 * Gernerate hash of data.
	 *
	 * @param hasher Hasher instance.
	 * @param data Data.
	 * @param length Data length.
	 * @param digest Digest.
	 * @returns Size.
	 */
	protected static async generateHash(
		hasher: DynamicHash,
		data: ArrayBufferPointer<ArrayBuffer>,
		length: number,
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<number>;

	/**
	 * Generate hash.
	 *
	 * @param hasher Hasher instance.
	 * @param reader Reader or data.
	 * @param digest Digest or data length.
	 * @param limit Limit ot digest.
	 * @returns Size.
	 */
	protected static async generateHash(
		hasher: DynamicHash,
		reader: Reader | ArrayBufferPointer<ArrayBuffer>,
		digest: ArrayBufferLike | ArrayBufferPointer | number,
		limit?: number | ArrayBufferLike | ArrayBufferPointer,
	): Promise<number> {
		if (typeof digest === 'number') {
			await hasher.update(
				reader as ArrayBufferPointer<ArrayBuffer>,
				digest,
			);
			await hasher.finish(limit as ArrayBufferPointer<ArrayBuffer>);
			return digest;
		}
		const size = await hashFileData(
			reader as Reader,
			hasher,
			limit as number | undefined,
		);
		await hasher.finish(digest);
		return size;
	}

	static {
		toStringTag(this, 'CodeDirectory');
		uint32BE(this, 'version');
		uint32BE(this, 'flags');
		uint32BE(this, 'hashOffset');
		uint32BE(this, 'identOffset');
		uint32BE(this, 'nSpecialSlots');
		uint32BE(this, 'nCodeSlots');
		uint32BE(this, 'codeLimit');
		uint8(this, 'hashSize');
		uint8(this, 'hashType');
		uint8(this, 'platform');
		uint8(this, 'pageSize');
		uint32BE(this, 'spare2');
		uint32BE(this, 'scatterOffset');
		uint32BE(this, 'teamIDOffset');
		uint32BE(this, 'spare3');
		uint64BE(this, 'codeLimit64');
		uint64BE(this, 'execSegBase');
		uint64BE(this, 'execSegLimit');
		uint64BE(this, 'execSegFlags');
		uint32BE(this, 'runtime');
		uint32BE(this, 'preEncryptOffset');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
		constant(this, 'currentVersion');
		constant(this, 'compatibilityLimit');
		constant(this, 'earliestVersion');
		constant(this, 'supportsScatter');
		constant(this, 'supportsTeamID');
		constant(this, 'supportsCodeLimit64');
		constant(this, 'supportsExecSegment');
		constant(this, 'supportsPreEncrypt');
	}
}
