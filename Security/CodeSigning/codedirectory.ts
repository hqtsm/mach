import { constant, toStringTag } from '@hqtsm/class';
import {
	type ArrayBufferPointer,
	type ArrayBufferType,
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
import type { _const, bool, char, int, uchar, uint } from '../../libc/c.ts';
import type { big_size_t, size_t } from '../../libc/stddef.ts';
import type { uint32_t, uint64_t, uint8_t } from '../../libc/stdint.ts';
import { PAGE_SIZE_ARM64 as PAGE_SIZE } from '../../mach/vm_param.ts';
import type { SubtleCryptoDigest } from '../../util/crypto.ts';
import {
	sizeAsyncIterators,
	type SizeIteratorNext,
} from '../../util/iterator.ts';
import { bufferBytes, pointerBytes } from '../../util/memory.ts';
import type { Reader } from '../../util/reader.ts';
import { Blob } from '../blob.ts';
import {
	errSecCSSignatureUnsupported,
	errSecCSUnsupportedDigestAlgorithm,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureNoHash,
} from '../CSCommon.ts';
import {
	kSecCodeCDHashLength,
	kSecCodeMagicCodeDirectory,
} from '../CSCommonPriv.ts';
import { MacOSError } from '../errors.ts';
import type { Endian } from '../endian.ts';
import { CCHashInstance, type DynamicHash } from '../hashing.ts';
import { hashFileData } from './csutilities.ts';

const max = (values: number[]) => Math.max(...values);

const hashPriorities = [
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureNoHash,
];

// String names for code signature components:

/**
 * Code directory.
 */
export const kSecCS_CODEDIRECTORYFILE = 'CodeDirectory';

/**
 * CMS signature.
 */
export const kSecCS_SIGNATUREFILE = 'CodeSignature';

/**
 * Internal requirements.
 */
export const kSecCS_REQUIREMENTSFILE = 'CodeRequirements';

/**
 * Resource directory.
 */
export const kSecCS_RESOURCEDIRFILE = 'CodeResources';

/**
 * Entitlement configuration.
 */
export const kSecCS_ENTITLEMENTFILE = 'CodeEntitlements';

/**
 * DiskRep-specific data.
 */
export const kSecCS_REPSPECIFICFILE = 'CodeRepSpecific';

/**
 * Top-level directory list.
 */
export const kSecCS_TOPDIRECTORYFILE = 'CodeTopDirectory';

/**
 * Entitlement DER.
 */
export const kSecCS_ENTITLEMENTDERFILE = 'CodeEntitlementDER';

/**
 * Launch constraints on self.
 */
export const kSecCS_LAUNCHCONSTRAINTSELFFILE = 'LaunchConstraintSelf';

/**
 * Launch constraints on parent.
 */
export const kSecCS_LAUNCHCONSTRAINTPARENTFILE = 'LaunchConstraintParent';

/**
 * Launch constraints on responsible.
 */
export const kSecCS_LAUNCHCONSTRAINTRESPONSIBLEFILE =
	'LaunchConstraintResponsible';

/**
 * Library constraints.
 */
export const kSecCS_LIBRARYCONSTRAINTFILE = 'LibraryConstraint';

// Special hash slot values:
// enum {

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

// }

// Special hash slot flags:
// enum {

/**
 * Slot values differs for each architecture.
 */
export const cdComponentPerArchitecture = 1;

/**
 * Slot value is Blob.
 */
export const cdComponentIsBlob = 2;

// }

/**
 * Platform identifier.
 */
export type PlatformIdentifier = uint8_t;

/**
 * No platform.
 */
export const noPlatform = 0;

/**
 * Maximum platform.
 */
export const maxPlatform = 255;

/**
 * Hash algorithm.
 */
export type CodeDirectoryHashAlgorithm = uint32_t;

/**
 * Set of hash algorithms.
 */
export type CodeDirectoryHashAlgorithms = Set<CodeDirectoryHashAlgorithm>;

/**
 * Slot index.
 */
export type CodeDirectorySlot = int;

/**
 * Special slot.
 */
export type CodeDirectorySpecialSlot = uint;

/**
 * CodeDirectory scatter vector element.
 *
 * @template TArrayBuffer Buffer type.
 */
export class CodeDirectory_Scatter<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer> {
	/**
	 * Page count; zero for sentinel (only).
	 */
	declare public count: Endian<uint32_t>;

	/**
	 * First page number.
	 */
	declare public base: Endian<uint32_t>;

	/**
	 * Byte offset in target.
	 */
	declare public targetOffset: Endian<uint64_t>;

	/**
	 * Reserved, must be zero.
	 */
	declare public spare: Endian<uint64_t>;

	static {
		toStringTag(this, 'CodeDirectory_Scatter');
		uint32BE(this, 'count');
		uint32BE(this, 'base');
		uint64BE(this, 'targetOffset');
		uint64BE(this, 'spare');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Describes secured pieces of a program.
 *
 * @template TArrayBuffer Buffer type.
 */
export class CodeDirectory<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicCodeDirectory;

	/**
	 * Compatibility version.
	 */
	declare public version: Endian<uint32_t>;

	/**
	 * Setup and mode flags (SecCodeSignatureFlags kSecCodeSignature*).
	 */
	declare public flags: Endian<uint32_t>;

	/**
	 * Offset of hash slot element at index zero.
	 */
	declare public hashOffset: Endian<uint32_t>;

	/**
	 * Offset of identifier string.
	 */
	declare public identOffset: Endian<uint32_t>;

	/**
	 * Number of special hash slots.
	 */
	declare public nSpecialSlots: Endian<uint32_t>;

	/**
	 * Number of ordinary (code) hash slots.
	 */
	declare public nCodeSlots: Endian<uint32_t>;

	/**
	 * Limit to main image signature range, 32 bits.
	 */
	declare public codeLimit: Endian<uint32_t>;

	/**
	 * Size of each hash in bytes.
	 */
	declare public hashSize: Endian<uint8_t>;

	/**
	 * Hash type (SecCSDigestAlgorithm kSecCodeSignatureHash*).
	 */
	declare public hashType: Endian<uint8_t>;

	/**
	 * Platform identifier, zero if not platform binary.
	 */
	declare public platform: Endian<uint8_t>;

	/**
	 * The page size, log2(page size in bytes), 0 => infinite.
	 */
	declare public pageSize: Endian<uint8_t>;

	/**
	 * Unused, must be zero.
	 */
	declare public spare2: Endian<uint32_t>;

	/**
	 * Offset of scatter vector or 0 for none.
	 * Assumes supportsScatter.
	 */
	declare public scatterOffset: Endian<uint32_t>;

	/**
	 * Offset of team identifier or 0 for none.
	 * Assumes supportsTeamID.
	 */
	declare public teamIDOffset: Endian<uint32_t>;

	/**
	 * Unused, must be zero.
	 */
	declare public spare3: Endian<uint32_t>;

	/**
	 * Limit to main image signature range, 64 bits.
	 * Assumes supportsCodeLimit64.
	 */
	declare public codeLimit64: Endian<uint64_t>;

	/**
	 * Offset of executable segment (TEXT segment file offset),
	 * Assumes supportsExecSegment.
	 */
	declare public execSegBase: Endian<uint64_t>;

	/**
	 * Limit of executable segment (TEXT segment file size).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegLimit: Endian<uint64_t>;

	/**
	 * The exec segment flags (SecCodeExecSegFlags kSecCodeExecSeg*).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegFlags: Endian<uint64_t>;

	/**
	 * Runtime version encoded as an unsigned integer.
	 * Assumes supportsPreEncrypt.
	 */
	declare public runtime: Endian<uint32_t>;

	/**
	 * Offset of pre-encrypt hash slots.
	 * Assumes supportsPreEncrypt.
	 */
	declare public preEncryptOffset: Endian<uint32_t>;

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
	 * Pointer to identifier string.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @returns Char pointer.
	 */
	public static identifier<T extends CodeDirectory>(
		_this: T,
	): Ptr<char, ArrayBufferType<T>> {
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
	public static signingLimit(_this: CodeDirectory): big_size_t {
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
	public static maxSpecialSlot(
		_this: CodeDirectory,
	): CodeDirectorySpecialSlot {
		const slot = _this.nSpecialSlots;
		return slot > cdSlotMax ? cdSlotMax : slot;
	}

	/**
	 * Get slot data view, for writing.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public static getSlotMutable<T extends CodeDirectory>(
		_this: T,
		slot: CodeDirectorySlot,
		preEncrypt: bool,
	): Ptr<uchar, ArrayBufferType<T>> | null {
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
	 * @template T Code directory type.
	 * @param _this This.
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public static getSlot<T extends CodeDirectory>(
		_this: T,
		slot: CodeDirectorySlot,
		preEncrypt: bool,
	): _const<Ptr<uchar, ArrayBufferType<T>>> | null {
		return CodeDirectory.getSlotMutable(_this, slot, preEncrypt);
	}

	/**
	 * Pointer to scatter vector.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @returns Scatter pointer, or null.
	 */
	public static scatterVector<T extends CodeDirectory>(
		_this: T,
	): Ptr<CodeDirectory_Scatter<ArrayBufferType<T>>> | null {
		if (_this.version >= CodeDirectory.supportsScatter) {
			const { scatterOffset } = _this;
			if (scatterOffset) {
				return new (pointer(CodeDirectory_Scatter))(
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
	 * @template T This type.
	 * @param _this This.
	 * @returns Char pointer, or null.
	 */
	public static teamID<T extends CodeDirectory>(
		_this: T,
	): Ptr<char, ArrayBufferType<T>> | null {
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
	public static execSegmentBase(_this: CodeDirectory): uint64_t {
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
	public static execSegmentLimit(_this: CodeDirectory): uint64_t {
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
	public static execSegmentFlags(_this: CodeDirectory): uint64_t {
		return _this.version >= CodeDirectory.supportsExecSegment
			? _this.execSegFlags
			: 0n;
	}

	/**
	 * Pointer to pre-encrypt hashes.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @returns Hash pointer, or null.
	 */
	public static preEncryptHashes<T extends CodeDirectory>(
		_this: T,
	): _const<Ptr<uchar, ArrayBufferType<T>>> | null {
		return CodeDirectory.getSlot(_this, 0, true);
	}

	/**
	 * Runtime version.
	 *
	 * @param _this This.
	 * @returns Version, zero if not supported.
	 */
	public static runtimeVersion(_this: CodeDirectory): uint32_t {
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
	 * @param subtle Hash crypto.
	 * @returns True if valid.
	 */
	public static async validateSlot(
		_this: CodeDirectory,
		source: ArrayBufferLike | ArrayBufferPointer | Reader,
		size: size_t,
		slot: CodeDirectorySlot,
		preEncrypted: bool,
		subtle: SubtleCryptoDigest | null = null,
	): Promise<bool> {
		const hash = CodeDirectory.getHash(_this);
		hash.subtle = subtle;
		const l = hash.digestLength();
		const digest = new Uint8Array(l);
		await (
			'arrayBuffer' in source
				? CodeDirectory.generateHash(hash, source, digest, size)
				: CodeDirectory.generateHash(
					hash,
					'buffer' in source
						? bufferBytes(source.buffer, source.byteOffset, size)
						: bufferBytes(source, 0, size),
					size,
					digest,
				)
		);
		const slotDigest = CodeDirectory.getSlot(_this, slot, preEncrypted)!;
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
	public static slotIsPresent(
		_this: CodeDirectory,
		slot: CodeDirectorySlot,
	): bool {
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
	 * Get hasher instance for hash type.
	 *
	 * @param hashType Hash type.
	 * @returns Hasher instance.
	 */
	public static hashFor(hashType: CodeDirectoryHashAlgorithm): DynamicHash {
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
		MacOSError.throwMe(errSecCSSignatureUnsupported);
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
	 * @param subtle Hash crypto.
	 * @returns Hash digest.
	 */
	public static async cdhash(
		_this: CodeDirectory,
		truncate = false,
		subtle: SubtleCryptoDigest | null = null,
	): Promise<ArrayBuffer> {
		const hash = CodeDirectory.getHash(_this);
		hash.subtle = subtle;
		await hash.update(
			bufferBytes(
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

	/**
	 * Hash file data with multiple hashers.
	 *
	 * @param reader Reader.
	 * @param limit Limit.
	 * @param types Types.
	 * @param action Callback for each hash.
	 * @param subtle Hash crypto.
	 */
	public static async multipleHashFileData(
		reader: Reader,
		limit: size_t,
		types: CodeDirectoryHashAlgorithms,
		action: (
			type: CodeDirectoryHashAlgorithm,
			hasher: DynamicHash,
		) => Promise<void>,
		subtle: SubtleCryptoDigest | null = null,
	): Promise<void> {
		const total = limit ? Math.min(limit, reader.size) : reader.size;
		const hashes: [CodeDirectoryHashAlgorithm, DynamicHash][] = [];
		for (const type of types) {
			const hash = CodeDirectory.hashFor(type);
			hash.subtle = subtle;
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
								Math.min(i + Math.max(size, PAGE_SIZE), total),
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
	 * Check if hash type is viable.
	 *
	 * @param type Hash type.
	 * @returns True if viable.
	 */
	public static viableHash(type: CodeDirectoryHashAlgorithm): bool {
		for (
			let i = 0, t;
			(t = hashPriorities[i]) !== kSecCodeSignatureNoHash;
			i++
		) {
			if (t === type) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Find best hash type.
	 *
	 * @param types Type set.
	 * @returns Hash type.
	 */
	public static bestHashOf(
		types: CodeDirectoryHashAlgorithms,
	): CodeDirectoryHashAlgorithm {
		for (
			let i = 0, type;
			(type = hashPriorities[i]) !== kSecCodeSignatureNoHash;
			i++
		) {
			if (types.has(type)) {
				return type;
			}
		}
		MacOSError.throwMe(errSecCSUnsupportedDigestAlgorithm);
	}

	/**
	 * Hex encode hash buffer.
	 *
	 * @param _this This.
	 * @param hash Hash buffer.
	 * @returns Hex hash.
	 */
	public static hexHash(
		_this: CodeDirectory,
		hash: ArrayBufferLike | ArrayBufferPointer,
	): Uint8Array<ArrayBuffer> {
		const size = _this.hashSize;
		const h = pointerBytes(hash, size);
		const result = new Uint8Array(size * 2);
		for (let i = 0, j = 0, c, b; i < size; i++) {
			b = h[i];
			result[j++] = (c = b >> 4) < 10 ? c + 48 : c + 87;
			result[j++] = (c = b & 15) < 10 ? c + 48 : c + 87;
		}
		return result;
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
		limit?: size_t,
	): Promise<size_t>;

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
		length: size_t,
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<size_t>;

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
		digest: ArrayBufferLike | ArrayBufferPointer | size_t,
		limit?: size_t | ArrayBufferLike | ArrayBufferPointer,
	): Promise<size_t> {
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
			limit as size_t | undefined,
		);
		await hasher.finish(digest);
		return size;
	}

	/**
	 * Get canonical slot name.
	 *
	 * @param slot Slot index.
	 * @returns Slot name, or null.
	 */
	public static canonicalSlotName(
		slot: CodeDirectorySpecialSlot,
	): string | null {
		switch (slot) {
			case cdRequirementsSlot:
				return kSecCS_REQUIREMENTSFILE;
			case cdAlternateCodeDirectorySlots:
				return `${kSecCS_REQUIREMENTSFILE}-1`;
			case cdAlternateCodeDirectorySlots + 1:
				return `${kSecCS_REQUIREMENTSFILE}-2`;
			case cdAlternateCodeDirectorySlots + 2:
				return `${kSecCS_REQUIREMENTSFILE}-3`;
			case cdAlternateCodeDirectorySlots + 3:
				return `${kSecCS_REQUIREMENTSFILE}-4`;
			case cdAlternateCodeDirectorySlots + 4:
				return `${kSecCS_REQUIREMENTSFILE}-5`;
			case cdResourceDirSlot:
				return kSecCS_RESOURCEDIRFILE;
			case cdCodeDirectorySlot:
				return kSecCS_CODEDIRECTORYFILE;
			case cdSignatureSlot:
				return kSecCS_SIGNATUREFILE;
			case cdTopDirectorySlot:
				return kSecCS_TOPDIRECTORYFILE;
			case cdEntitlementSlot:
				return kSecCS_ENTITLEMENTFILE;
			case cdEntitlementDERSlot:
				return kSecCS_ENTITLEMENTDERFILE;
			case cdRepSpecificSlot:
				return kSecCS_REPSPECIFICFILE;
			case cdLaunchConstraintSelf:
				return kSecCS_LAUNCHCONSTRAINTSELFFILE;
			case cdLaunchConstraintParent:
				return kSecCS_LAUNCHCONSTRAINTPARENTFILE;
			case cdLaunchConstraintResponsible:
				return kSecCS_LAUNCHCONSTRAINTRESPONSIBLEFILE;
			case cdLibraryConstraint:
				return kSecCS_LIBRARYCONSTRAINTFILE;
		}
		return null;
	}

	/**
	 * Get canonical slot attributes.
	 *
	 * @param slot Slot index.
	 * @returns Slot attributes.
	 */
	public static slotAttributes(slot: CodeDirectorySpecialSlot): uint {
		switch (slot) {
			case cdRequirementsSlot:
				return cdComponentIsBlob;
			case cdCodeDirectorySlot:
			case cdAlternateCodeDirectorySlots:
			case cdAlternateCodeDirectorySlots + 1:
			case cdAlternateCodeDirectorySlots + 2:
			case cdAlternateCodeDirectorySlots + 3:
			case cdAlternateCodeDirectorySlots + 4:
				return cdComponentPerArchitecture | cdComponentIsBlob;
			case cdSignatureSlot:
				return cdComponentPerArchitecture;
			case cdLaunchConstraintSelf:
			case cdLaunchConstraintParent:
			case cdLaunchConstraintResponsible:
			case cdLibraryConstraint:
			case cdEntitlementSlot:
			case cdEntitlementDERSlot:
				return cdComponentIsBlob;
			case cdIdentificationSlot:
				return cdComponentPerArchitecture;
		}
		return 0;
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
