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
import type { SubtleCryptoDigest } from '../../helpers/crypto.ts';
import {
	sizeAsyncIterators,
	type SizeIteratorNext,
} from '../../helpers/iterator.ts';
import { bufferBytes, pointerBytes } from '../../helpers/memory.ts';
import type { Reader } from '../../helpers/reader.ts';
import type { _const, bool, char, int, uchar, uint } from '../../libc/c.ts';
import type { big_size_t, size_t } from '../../libc/stddef.ts';
import type { uint32_t, uint64_t, uint8_t } from '../../libc/stdint.ts';
import { PAGE_SIZE_ARM64 as PAGE_SIZE } from '../../mach/vm_param.ts';
import { Security_Blob } from '../blob.ts';
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
import { Security_MacOSError } from '../errors.ts';
import type { Security_Endian } from '../endian.ts';
import {
	Security_CCHashInstance,
	type Security_DynamicHash,
} from '../hashing.ts';
import { Security_CodeSigning_hashFileData } from './csutilities.ts';

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
export const Security_CodeSigning_cdInfoSlot = 1;

/**
 * Code directory internal requirements slot.
 */
export const Security_CodeSigning_cdRequirementsSlot = 2;

/**
 * Code directory resource directory slot.
 */
export const Security_CodeSigning_cdResourceDirSlot = 3;

/**
 * Code directory top directory slot.
 */
export const Security_CodeSigning_cdTopDirectorySlot = 4;

/**
 * Code directory embedded entitlement slot.
 */
export const Security_CodeSigning_cdEntitlementSlot = 5;

/**
 * Code directory disk rep slot.
 */
export const Security_CodeSigning_cdRepSpecificSlot = 6;

/**
 * Code directory entitlement DER slot.
 */
export const Security_CodeSigning_cdEntitlementDERSlot = 7;

/**
 * Code directory launch constraint self slot.
 */
export const Security_CodeSigning_cdLaunchConstraintSelf = 8;

/**
 * Code directory launch constraint parent slot.
 */
export const Security_CodeSigning_cdLaunchConstraintParent = 9;

/**
 * Code directory launch constraint responsible slot.
 */
export const Security_CodeSigning_cdLaunchConstraintResponsible = 10;

/**
 * Code directory library constraint slot.
 */
export const Security_CodeSigning_cdLibraryConstraint = 11;

/**
 * Code directory slot count.
 */
export const Security_CodeSigning_cdSlotCount = 12;

/**
 * Code directoty maximum slot.
 */
export const Security_CodeSigning_cdSlotMax = 11;

// Virtual slots:

/**
 * Code directory code directory slot.
 */
export const Security_CodeSigning_cdCodeDirectorySlot = 0;

/**
 * Code directory alternate code directory array slots.
 */
export const Security_CodeSigning_cdAlternateCodeDirectorySlots = 0x1000;

/**
 * Code directory alternate code directory array limit.
 */
export const Security_CodeSigning_cdAlternateCodeDirectoryLimit = 0x1005;

/**
 * Code directory CMS signature slot.
 */
export const Security_CodeSigning_cdSignatureSlot = 0x10000;

/**
 * Code directory identification blob slot.
 */
export const Security_CodeSigning_cdIdentificationSlot = 0x10001;

/**
 * Code directory ticket slot.
 */
export const Security_CodeSigning_cdTicketSlot = 0x10002;

// }

// Special hash slot flags:
// enum {

/**
 * Slot values differs for each architecture.
 */
export const Security_CodeSigning_cdComponentPerArchitecture = 1;

/**
 * Slot value is Blob.
 */
export const Security_CodeSigning_cdComponentIsBlob = 2;

// }

/**
 * Platform identifier.
 */
export type Security_CodeSigning_PlatformIdentifier = uint8_t;

/**
 * No platform.
 */
export const Security_CodeSigning_noPlatform = 0;

/**
 * Maximum platform.
 */
export const Security_CodeSigning_maxPlatform = 255;

/**
 * Hash algorithm.
 */
export type Security_CodeSigning_CodeDirectory_HashAlgorithm = uint32_t;

/**
 * Set of hash algorithms.
 */
export type Security_CodeSigning_CodeDirectory_HashAlgorithms = Set<
	Security_CodeSigning_CodeDirectory_HashAlgorithm
>;

/**
 * Slot index.
 */
export type Security_CodeSigning_CodeDirectory_Slot = int;

/**
 * Special slot.
 */
export type Security_CodeSigning_CodeDirectory_SpecialSlot = uint;

/**
 * CodeDirectory scatter vector element.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_CodeDirectory_Scatter<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer> {
	/**
	 * Page count; zero for sentinel (only).
	 */
	declare public count: Security_Endian<uint32_t>;

	/**
	 * First page number.
	 */
	declare public base: Security_Endian<uint32_t>;

	/**
	 * Byte offset in target.
	 */
	declare public targetOffset: Security_Endian<uint64_t>;

	/**
	 * Reserved, must be zero.
	 */
	declare public spare: Security_Endian<uint64_t>;

	static {
		toStringTag(this, 'Security_CodeSigning_CodeDirectory_Scatter');
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
export class Security_CodeSigning_CodeDirectory<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicCodeDirectory;

	/**
	 * Compatibility version.
	 */
	declare public version: Security_Endian<uint32_t>;

	/**
	 * Setup and mode flags (SecCodeSignatureFlags kSecCodeSignature*).
	 */
	declare public flags: Security_Endian<uint32_t>;

	/**
	 * Offset of hash slot element at index zero.
	 */
	declare public hashOffset: Security_Endian<uint32_t>;

	/**
	 * Offset of identifier string.
	 */
	declare public identOffset: Security_Endian<uint32_t>;

	/**
	 * Number of special hash slots.
	 */
	declare public nSpecialSlots: Security_Endian<uint32_t>;

	/**
	 * Number of ordinary (code) hash slots.
	 */
	declare public nCodeSlots: Security_Endian<uint32_t>;

	/**
	 * Limit to main image signature range, 32 bits.
	 */
	declare public codeLimit: Security_Endian<uint32_t>;

	/**
	 * Size of each hash in bytes.
	 */
	declare public hashSize: Security_Endian<uint8_t>;

	/**
	 * Hash type (SecCSDigestAlgorithm kSecCodeSignatureHash*).
	 */
	declare public hashType: Security_Endian<uint8_t>;

	/**
	 * Platform identifier, zero if not platform binary.
	 */
	declare public platform: Security_Endian<uint8_t>;

	/**
	 * The page size, log2(page size in bytes), 0 => infinite.
	 */
	declare public pageSize: Security_Endian<uint8_t>;

	/**
	 * Unused, must be zero.
	 */
	declare public spare2: Security_Endian<uint32_t>;

	/**
	 * Offset of scatter vector or 0 for none.
	 * Assumes supportsScatter.
	 */
	declare public scatterOffset: Security_Endian<uint32_t>;

	/**
	 * Offset of team identifier or 0 for none.
	 * Assumes supportsTeamID.
	 */
	declare public teamIDOffset: Security_Endian<uint32_t>;

	/**
	 * Unused, must be zero.
	 */
	declare public spare3: Security_Endian<uint32_t>;

	/**
	 * Limit to main image signature range, 64 bits.
	 * Assumes supportsCodeLimit64.
	 */
	declare public codeLimit64: Security_Endian<uint64_t>;

	/**
	 * Offset of executable segment (TEXT segment file offset),
	 * Assumes supportsExecSegment.
	 */
	declare public execSegBase: Security_Endian<uint64_t>;

	/**
	 * Limit of executable segment (TEXT segment file size).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegLimit: Security_Endian<uint64_t>;

	/**
	 * The exec segment flags (SecCodeExecSegFlags kSecCodeExecSeg*).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegFlags: Security_Endian<uint64_t>;

	/**
	 * Runtime version encoded as an unsigned integer.
	 * Assumes supportsPreEncrypt.
	 */
	declare public runtime: Security_Endian<uint32_t>;

	/**
	 * Offset of pre-encrypt hash slots.
	 * Assumes supportsPreEncrypt.
	 */
	declare public preEncryptOffset: Security_Endian<uint32_t>;

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
	public static identifier<T extends Security_CodeSigning_CodeDirectory>(
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
	public static signingLimit(
		_this: Security_CodeSigning_CodeDirectory,
	): big_size_t {
		if (
			_this.version >=
				Security_CodeSigning_CodeDirectory.supportsCodeLimit64
		) {
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
		_this: Security_CodeSigning_CodeDirectory,
	): Security_CodeSigning_CodeDirectory_SpecialSlot {
		const slot = _this.nSpecialSlots;
		return slot > Security_CodeSigning_cdSlotMax
			? Security_CodeSigning_cdSlotMax
			: slot;
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
	public static getSlotMutable<T extends Security_CodeSigning_CodeDirectory>(
		_this: T,
		slot: Security_CodeSigning_CodeDirectory_Slot,
		preEncrypt: bool,
	): Ptr<uchar, ArrayBufferType<T>> | null {
		let offset;
		if (preEncrypt) {
			if (
				_this.version <
					Security_CodeSigning_CodeDirectory.supportsPreEncrypt ||
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
	public static getSlot<T extends Security_CodeSigning_CodeDirectory>(
		_this: T,
		slot: Security_CodeSigning_CodeDirectory_Slot,
		preEncrypt: bool,
	): _const<Ptr<uchar, ArrayBufferType<T>>> | null {
		return Security_CodeSigning_CodeDirectory.getSlotMutable(
			_this,
			slot,
			preEncrypt,
		);
	}

	/**
	 * Pointer to scatter vector.
	 *
	 * @template T This type.
	 * @param _this This.
	 * @returns Scatter pointer, or null.
	 */
	public static scatterVector<T extends Security_CodeSigning_CodeDirectory>(
		_this: T,
	):
		| Ptr<Security_CodeSigning_CodeDirectory_Scatter<ArrayBufferType<T>>>
		| null {
		if (
			_this.version >= Security_CodeSigning_CodeDirectory.supportsScatter
		) {
			const { scatterOffset } = _this;
			if (scatterOffset) {
				return new (pointer(
					Security_CodeSigning_CodeDirectory_Scatter,
				))(
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
	public static teamID<T extends Security_CodeSigning_CodeDirectory>(
		_this: T,
	): Ptr<char, ArrayBufferType<T>> | null {
		if (
			_this.version >= Security_CodeSigning_CodeDirectory.supportsTeamID
		) {
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
	public static execSegmentBase(
		_this: Security_CodeSigning_CodeDirectory,
	): uint64_t {
		return _this.version >=
				Security_CodeSigning_CodeDirectory.supportsExecSegment
			? _this.execSegBase
			: 0n;
	}

	/**
	 * Executable segment limit.
	 *
	 * @param _this This.
	 * @returns Byte length, zero if not supported.
	 */
	public static execSegmentLimit(
		_this: Security_CodeSigning_CodeDirectory,
	): uint64_t {
		return _this.version >=
				Security_CodeSigning_CodeDirectory.supportsExecSegment
			? _this.execSegLimit
			: 0n;
	}

	/**
	 * Executable segment flags.
	 *
	 * @param _this This.
	 * @returns Flags, zero if not supported.
	 */
	public static execSegmentFlags(
		_this: Security_CodeSigning_CodeDirectory,
	): uint64_t {
		return _this.version >=
				Security_CodeSigning_CodeDirectory.supportsExecSegment
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
	public static preEncryptHashes<
		T extends Security_CodeSigning_CodeDirectory,
	>(
		_this: T,
	): _const<Ptr<uchar, ArrayBufferType<T>>> | null {
		return Security_CodeSigning_CodeDirectory.getSlot(_this, 0, true);
	}

	/**
	 * Runtime version.
	 *
	 * @param _this This.
	 * @returns Version, zero if not supported.
	 */
	public static runtimeVersion(
		_this: Security_CodeSigning_CodeDirectory,
	): uint32_t {
		return _this.version >=
				Security_CodeSigning_CodeDirectory.supportsPreEncrypt
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
		_this: Security_CodeSigning_CodeDirectory,
		source: ArrayBufferLike | ArrayBufferPointer | Reader,
		size: size_t,
		slot: Security_CodeSigning_CodeDirectory_Slot,
		preEncrypted: bool,
		subtle: SubtleCryptoDigest | null = null,
	): Promise<bool> {
		const hash = Security_CodeSigning_CodeDirectory.getHash(_this);
		hash.subtle = subtle;
		const l = hash.digestLength();
		const digest = new Uint8Array(l);
		await (
			'arrayBuffer' in source
				? Security_CodeSigning_CodeDirectory.generateHash(
					hash,
					source,
					digest,
					size,
				)
				: Security_CodeSigning_CodeDirectory.generateHash(
					hash,
					'buffer' in source
						? bufferBytes(source.buffer, source.byteOffset, size)
						: bufferBytes(source, 0, size),
					size,
					digest,
				)
		);
		const slotDigest = Security_CodeSigning_CodeDirectory.getSlot(
			_this,
			slot,
			preEncrypted,
		)!;
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
		_this: Security_CodeSigning_CodeDirectory,
		slot: Security_CodeSigning_CodeDirectory_Slot,
	): bool {
		if (slot >= -_this.nSpecialSlots && slot < _this.nCodeSlots) {
			const digest = Security_CodeSigning_CodeDirectory.getSlot(
				_this,
				slot,
				false,
			);
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
	public static hashFor(
		hashType: Security_CodeSigning_CodeDirectory_HashAlgorithm,
	): Security_DynamicHash {
		switch (hashType) {
			case kSecCodeSignatureHashSHA1: {
				return new Security_CCHashInstance(kCCDigestSHA1);
			}
			case kSecCodeSignatureHashSHA256: {
				return new Security_CCHashInstance(kCCDigestSHA256);
			}
			case kSecCodeSignatureHashSHA384: {
				return new Security_CCHashInstance(kCCDigestSHA384);
			}
			case kSecCodeSignatureHashSHA256Truncated: {
				return new Security_CCHashInstance(kCCDigestSHA256, 20);
			}
		}
		Security_MacOSError.throwMe(errSecCSSignatureUnsupported);
	}

	/**
	 * Get hash for current hash type.
	 *
	 * @param _this This.
	 * @returns Hash instance.
	 */
	public static getHash(
		_this: Security_CodeSigning_CodeDirectory,
	): Security_DynamicHash {
		return Security_CodeSigning_CodeDirectory.hashFor(_this.hashType);
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
		_this: Security_CodeSigning_CodeDirectory,
		truncate = false,
		subtle: SubtleCryptoDigest | null = null,
	): Promise<ArrayBuffer> {
		const hash = Security_CodeSigning_CodeDirectory.getHash(_this);
		hash.subtle = subtle;
		await hash.update(
			bufferBytes(
				_this.buffer,
				_this.byteOffset,
				Security_CodeSigning_CodeDirectory.size(_this),
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
		types: Security_CodeSigning_CodeDirectory_HashAlgorithms,
		action: (
			type: Security_CodeSigning_CodeDirectory_HashAlgorithm,
			hasher: Security_DynamicHash,
		) => Promise<void>,
		subtle: SubtleCryptoDigest | null = null,
	): Promise<void> {
		const total = limit ? Math.min(limit, reader.size) : reader.size;
		const hashes: [
			Security_CodeSigning_CodeDirectory_HashAlgorithm,
			Security_DynamicHash,
		][] = [];
		for (const type of types) {
			const hash = Security_CodeSigning_CodeDirectory.hashFor(type);
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
	public static viableHash(
		type: Security_CodeSigning_CodeDirectory_HashAlgorithm,
	): bool {
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
		types: Security_CodeSigning_CodeDirectory_HashAlgorithms,
	): Security_CodeSigning_CodeDirectory_HashAlgorithm {
		for (
			let i = 0, type;
			(type = hashPriorities[i]) !== kSecCodeSignatureNoHash;
			i++
		) {
			if (types.has(type)) {
				return type;
			}
		}
		Security_MacOSError.throwMe(errSecCSUnsupportedDigestAlgorithm);
	}

	/**
	 * Hex encode hash buffer.
	 *
	 * @param _this This.
	 * @param hash Hash buffer.
	 * @returns Hex hash.
	 */
	public static hexHash(
		_this: Security_CodeSigning_CodeDirectory,
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
		hasher: Security_DynamicHash,
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
		hasher: Security_DynamicHash,
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
		hasher: Security_DynamicHash,
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
		const size = await Security_CodeSigning_hashFileData(
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
		slot: Security_CodeSigning_CodeDirectory_SpecialSlot,
	): string | null {
		switch (slot) {
			case Security_CodeSigning_cdRequirementsSlot:
				return kSecCS_REQUIREMENTSFILE;
			case Security_CodeSigning_cdAlternateCodeDirectorySlots:
				return `${kSecCS_REQUIREMENTSFILE}-1`;
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 1:
				return `${kSecCS_REQUIREMENTSFILE}-2`;
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 2:
				return `${kSecCS_REQUIREMENTSFILE}-3`;
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 3:
				return `${kSecCS_REQUIREMENTSFILE}-4`;
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 4:
				return `${kSecCS_REQUIREMENTSFILE}-5`;
			case Security_CodeSigning_cdResourceDirSlot:
				return kSecCS_RESOURCEDIRFILE;
			case Security_CodeSigning_cdCodeDirectorySlot:
				return kSecCS_CODEDIRECTORYFILE;
			case Security_CodeSigning_cdSignatureSlot:
				return kSecCS_SIGNATUREFILE;
			case Security_CodeSigning_cdTopDirectorySlot:
				return kSecCS_TOPDIRECTORYFILE;
			case Security_CodeSigning_cdEntitlementSlot:
				return kSecCS_ENTITLEMENTFILE;
			case Security_CodeSigning_cdEntitlementDERSlot:
				return kSecCS_ENTITLEMENTDERFILE;
			case Security_CodeSigning_cdRepSpecificSlot:
				return kSecCS_REPSPECIFICFILE;
			case Security_CodeSigning_cdLaunchConstraintSelf:
				return kSecCS_LAUNCHCONSTRAINTSELFFILE;
			case Security_CodeSigning_cdLaunchConstraintParent:
				return kSecCS_LAUNCHCONSTRAINTPARENTFILE;
			case Security_CodeSigning_cdLaunchConstraintResponsible:
				return kSecCS_LAUNCHCONSTRAINTRESPONSIBLEFILE;
			case Security_CodeSigning_cdLibraryConstraint:
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
	public static slotAttributes(
		slot: Security_CodeSigning_CodeDirectory_SpecialSlot,
	): uint {
		switch (slot) {
			case Security_CodeSigning_cdRequirementsSlot:
				return Security_CodeSigning_cdComponentIsBlob;
			case Security_CodeSigning_cdCodeDirectorySlot:
			case Security_CodeSigning_cdAlternateCodeDirectorySlots:
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 1:
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 2:
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 3:
			case Security_CodeSigning_cdAlternateCodeDirectorySlots + 4:
				return Security_CodeSigning_cdComponentPerArchitecture |
					Security_CodeSigning_cdComponentIsBlob;
			case Security_CodeSigning_cdSignatureSlot:
				return Security_CodeSigning_cdComponentPerArchitecture;
			case Security_CodeSigning_cdLaunchConstraintSelf:
			case Security_CodeSigning_cdLaunchConstraintParent:
			case Security_CodeSigning_cdLaunchConstraintResponsible:
			case Security_CodeSigning_cdLibraryConstraint:
			case Security_CodeSigning_cdEntitlementSlot:
			case Security_CodeSigning_cdEntitlementDERSlot:
				return Security_CodeSigning_cdComponentIsBlob;
			case Security_CodeSigning_cdIdentificationSlot:
				return Security_CodeSigning_cdComponentPerArchitecture;
		}
		return 0;
	}

	static {
		toStringTag(this, 'Security_CodeSigning_CodeDirectory');
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
