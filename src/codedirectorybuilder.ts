import {CodeDirectory} from './codedirectory.ts';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
	UINT32_MAX
} from './const.ts';
import {BufferView} from './type.ts';
import {sparseSet, viewUint8R} from './util.ts';

/**
 * CodeDirectoryBuilder class.
 */
export class CodeDirectoryBuilder {
	public declare readonly ['constructor']: typeof CodeDirectoryBuilder;

	/**
	 * Special slots.
	 */
	readonly #special: (Uint8Array | undefined)[] = [];

	/**
	 * Executable length.
	 */
	public execLength = 0;

	/**
	 * Page size, must be a power of 2, or zero for infinite.
	 */
	public pageSize = 0;

	/**
	 * Flags.
	 */
	public flags = 0;

	/**
	 * Hash algorithm.
	 */
	readonly #hashType: number;

	/**
	 * Platform.
	 */
	public platform = 0;

	/**
	 * Hash digest length.
	 */
	readonly #digestLength: number;

	/**
	 * Identifier.
	 */
	public identifier = new Uint8Array();

	/**
	 * Team ID.
	 */
	public teamID = new Uint8Array();

	/**
	 * Code slots.
	 */
	readonly #code: (Uint8Array | undefined)[] = [];

	/**
	 * Scatter vector.
	 */
	public scatter:
		| this['constructor']['CodeDirectory']['Scatter']['prototype'][]
		| null = null;

	/**
	 * Exec segment offset.
	 */
	public execSegOffset = 0n;

	/**
	 * Exec segment limit.
	 */
	public execSegLimit = 0n;

	/**
	 * Exec segment flags.
	 */
	public execSegFlags = 0n;

	/**
	 * Generate pre-encrypt hashes.
	 */
	public generatePreEncryptHashes = false;

	/**
	 * Runtime version.
	 */
	public runtimeVersion = 0;

	/**
	 * CodeDirectoryBuilder constructor.
	 *
	 * @param digestAlgorithm Hash algorithm (kSecCodeSignatureHash* constants).
	 */
	constructor(digestAlgorithm: number) {
		const Static = this.constructor;
		this.#hashType = digestAlgorithm;
		this.#digestLength = Static.digestLength(digestAlgorithm);
	}

	/**
	 * Get the hash type.
	 *
	 * @returns Hash type.
	 */
	public get hashType() {
		return this.#hashType;
	}

	/**
	 * Get hash digest length.
	 *
	 * @returns Byte length.
	 */
	public get digestLength() {
		return this.#digestLength;
	}

	/**
	 * Get special slots count.
	 *
	 * @returns Total used.
	 */
	public get specialSlots() {
		return this.#special.length;
	}

	/**
	 * Get number of code slots.
	 * Based on execLength and pageSize.
	 *
	 * @returns The number of slots.
	 */
	public get codeSlots() {
		const {execLength} = this;
		if (execLength <= 0) {
			return 0;
		}
		const {pageSize} = this;
		if (pageSize === 0) {
			return 1;
		}
		const o = execLength % pageSize;
		return o ? (execLength - o) / pageSize + 1 : execLength / pageSize;
	}

	/**
	 * Set exec segment.
	 *
	 * @param base Base offset.
	 * @param limit Limit.
	 * @param flags Flags.
	 */
	public execSeg(base: bigint, limit: bigint, flags: bigint) {
		this.execSegOffset = base;
		this.execSegLimit = limit;
		this.execSegFlags = flags;
	}

	/**
	 * Add exec segment flags.
	 *
	 * @param flags Flags.
	 */
	public addExecSegFlags(flags: bigint) {
		// eslint-disable-next-line no-bitwise
		this.execSegFlags |= flags;
	}

	/**
	 * Get special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @returns Hash data, or null.
	 */
	public getSpecialSlot(slot: number) {
		return this.#special[slot - 1] || null;
	}

	/**
	 * Set special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @param hash Hash data, or null.
	 */
	public setSpecialSlot(slot: number, hash: Readonly<BufferView> | null) {
		const i = slot - 1;
		const slots = this.#special;
		let digest;
		if (hash) {
			const {digestLength} = this;
			digest = slots[i] || new Uint8Array(digestLength);
			const view = viewUint8R(hash);
			if (view.byteLength !== digestLength) {
				throw new Error(`Invalid hash size: ${view.byteLength}`);
			}
			digest.set(view);
		}
		sparseSet(slots, i, digest);
	}

	/**
	 * Get code slot.
	 *
	 * @param slot Slot index, 0 indexed.
	 * @returns Hash data, or null.
	 */
	public getCodeSlot(slot: number) {
		const slots = this.#code;
		slots.length = this.codeSlots;
		return slots[slot] || null;
	}

	/**
	 * Set code slot.
	 *
	 * @param slot Slot index, 0 indexed.
	 * @param hash Hash data, or null.
	 */
	public setCodeSlot(slot: number, hash: Readonly<BufferView> | null) {
		const slots = this.#code;
		const {codeSlots} = this;
		if (!(slot < codeSlots)) {
			throw new Error(`Invalid slot: ${slot}`);
		}
		slots.length = codeSlots;
		let digest;
		if (hash) {
			const {digestLength} = this;
			digest = slots[slot] || new Uint8Array(digestLength);
			const view = viewUint8R(hash);
			if (view.byteLength !== digestLength) {
				throw new Error(`Invalid hash size: ${view.byteLength}`);
			}
			digest.set(view);
		}
		slots[slot] = digest;
	}

	/**
	 * Create a scatter vector with count slots, plus sentinel.
	 *
	 * @param count Number of slots, excluding sentinel.
	 * @returns Scatter vector.
	 */
	public createScatter(count: number) {
		const {Scatter} = this.constructor.CodeDirectory;
		const vector: typeof this.scatter = [];
		const total = count + 1;
		for (let i = 0; i < total; i++) {
			vector.push(new Scatter());
		}
		this.scatter = vector;
		return vector;
	}

	/**
	 * Size of scatter vector.
	 *
	 * @returns Byte size.
	 */
	public get scatterSize() {
		let size = 0;
		const {scatter} = this;
		if (scatter) {
			for (const s of scatter) {
				size += s.byteLength;
			}
		}
		return size;
	}

	/**
	 * Get compatibility version of described CodeDirectory.
	 *
	 * @returns Compatibility version.
	 */
	public get version() {
		const {CodeDirectory} = this.constructor;
		if (this.generatePreEncryptHashes || this.runtimeVersion) {
			return CodeDirectory.supportsPreEncrypt;
		}
		if (this.execSegLimit > 0) {
			return CodeDirectory.supportsExecSegment;
		}
		if (this.execLength > UINT32_MAX) {
			return CodeDirectory.supportsCodeLimit64;
		}
		if (this.teamID.byteLength) {
			return CodeDirectory.supportsTeamID;
		}
		if (this.scatterSize) {
			return CodeDirectory.supportsScatter;
		}
		return CodeDirectory.earliestVersion;
	}

	/**
	 * Caculate size for CodeDirectory currently described.
	 *
	 * @param version Compatibility version or null for minimum.
	 * @returns Byte size.
	 */
	public size(version: number | null = null) {
		version ??= this.version;
		const {
			constructor: Static,
			identifier,
			teamID,
			codeSlots,
			specialSlots,
			digestLength,
			generatePreEncryptHashes
		} = this;
		const {CodeDirectory} = Static;
		let size = Static.fixedSize(version);
		if (!(version < CodeDirectory.supportsScatter)) {
			size += this.scatterSize;
		}
		size += identifier.byteLength + 1;
		if (!(version < CodeDirectory.supportsTeamID) && teamID.byteLength) {
			size += teamID.byteLength + 1;
		}
		size += (codeSlots + specialSlots) * digestLength;
		if (
			!(version < CodeDirectory.supportsPreEncrypt) &&
			generatePreEncryptHashes
		) {
			size += codeSlots * digestLength;
		}
		return size;
	}

	/**
	 * Build CodeDirectory.
	 *
	 * @param version Compatibility version or null for minimum.
	 * @returns CodeDirectory instance.
	 */
	public build(version: number | null = null) {
		version ??= this.version;
		const {
			constructor: Static,
			specialSlots,
			codeSlots,
			execLength,
			digestLength,
			pageSize,
			scatter,
			identifier,
			teamID,
			generatePreEncryptHashes
		} = this;
		const {CodeDirectory} = Static;
		const size = this.size(version);
		const data = new Uint8Array(size);
		const dir = new CodeDirectory(data);
		dir.initialize(size);
		dir.version = version;
		dir.flags = this.flags;
		dir.nSpecialSlots = specialSlots;
		dir.nCodeSlots = codeSlots;
		if (
			execLength > UINT32_MAX &&
			!(version < CodeDirectory.supportsCodeLimit64)
		) {
			dir.codeLimit = UINT32_MAX;
			dir.codeLimit64 = BigInt(execLength);
		} else {
			dir.codeLimit = execLength;
		}
		dir.hashType = this.hashType;
		dir.platform = this.platform;
		dir.hashSize = digestLength;
		dir.pageSize = pageSize ? Math.log2(pageSize) : 0;
		if (!(version < CodeDirectory.supportsExecSegment)) {
			dir.execSegBase = this.execSegOffset;
			dir.execSegLimit = this.execSegLimit;
			dir.execSegFlags = this.execSegFlags;
		}
		if (!(version < CodeDirectory.supportsPreEncrypt)) {
			dir.runtime = this.runtimeVersion;
		}
		let offset = Static.fixedSize(version);
		if (scatter && !(version < CodeDirectory.supportsScatter)) {
			for (const s of scatter) {
				offset += s.byteWrite(data, offset);
			}
		}
		dir.identOffset = offset;
		data.set(identifier, offset);
		offset += identifier.byteLength + 1;
		if (teamID.byteLength && !(version < CodeDirectory.supportsTeamID)) {
			data.set(teamID, offset);
			offset += teamID.byteLength + 1;
		}
		const spe = !(version < CodeDirectory.supportsPreEncrypt);
		const gpec = spe && generatePreEncryptHashes;
		if (gpec) {
			dir.preEncryptOffset = offset;
			offset += codeSlots * digestLength;
		}
		dir.hashOffset = offset + specialSlots * digestLength;
		for (let i = 1; i <= specialSlots; i++) {
			const hash = this.getSpecialSlot(i);
			if (hash) {
				dir.getSlotMutable(-i, false)!.set(hash);
			}
		}
		for (let i = 0; i < codeSlots; i++) {
			const hash = this.getCodeSlot(i);
			if (hash) {
				dir.getSlotMutable(i, false)!.set(hash);
				if (gpec) {
					dir.getSlotMutable(i, true)!.set(hash);
				}
			}
		}
		return dir;
	}

	/**
	 * Get fixed size for compatibility version.
	 *
	 * @param version Compatibility version.
	 * @returns Byte size.
	 */
	public static fixedSize<T extends typeof CodeDirectoryBuilder>(
		this: T,
		version: number
	) {
		const {CodeDirectory} = this;
		let size = CodeDirectory.sizeof;
		if (version < CodeDirectory.supportsPreEncrypt) {
			size -= 8;
		}
		if (version < CodeDirectory.supportsExecSegment) {
			size -= 24;
		}
		if (version < CodeDirectory.supportsCodeLimit64) {
			size -= 12;
		}
		if (version < CodeDirectory.supportsTeamID) {
			size -= 4;
		}
		if (version < CodeDirectory.supportsScatter) {
			size -= 4;
		}
		return size;
	}

	/**
	 * Get digest length for hash algorithm.
	 *
	 * @param hashType Hash algorithm (kSecCodeSignatureHash* constants).
	 * @returns Digest size.
	 */
	public static digestLength(hashType: number) {
		switch (hashType) {
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
		throw new Error(`Unknown hash type: ${hashType}`);
	}

	/**
	 * CodeDirectory class.
	 */
	public static readonly CodeDirectory = CodeDirectory;
}