import type { BufferView } from '@hqtsm/struct';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
	UINT32_MAX,
} from '../const.ts';
import { CodeDirectory } from './codedirectory.ts';
import { CodeDirectoryScatter } from './codedirectoryscatter.ts';

/**
 * Builder for building CodeDirectories from pieces.
 */
export class CodeDirectoryBuilder {
	declare public readonly ['constructor']: Omit<
		typeof CodeDirectoryBuilder,
		'new'
	>;

	/**
	 * Special slots.
	 */
	readonly #special = new Map<number, Uint8Array>();

	/**
	 * Highest special slot index.
	 */
	#specialSlots = 0;

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
	public identifier: BufferView = new Int8Array();

	/**
	 * Team ID.
	 */
	public teamID: BufferView = new Int8Array();

	/**
	 * Code slots.
	 */
	readonly #code: (Uint8Array | undefined)[] = [];

	/**
	 * Scatter vector.
	 */
	public scatter: CodeDirectoryScatter[] | null = null;

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
	 * Hash type.
	 */
	public get hashType(): number {
		return this.#hashType;
	}

	/**
	 * Hash digest length.
	 */
	public get digestLength(): number {
		return this.#digestLength;
	}

	/**
	 * Special slots count.
	 */
	public get specialSlots(): number {
		return this.#specialSlots;
	}

	/**
	 * Number of code slots.
	 * Based on execLength and pageSize.
	 */
	public get codeSlots(): number {
		const { execLength } = this;
		if (execLength <= 0) {
			return 0;
		}
		const { pageSize } = this;
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
	public execSeg(base: bigint, limit: bigint, flags: bigint): void {
		this.execSegOffset = base;
		this.execSegLimit = limit;
		this.execSegFlags = flags;
	}

	/**
	 * Add exec segment flags.
	 *
	 * @param flags Flags.
	 */
	public addExecSegFlags(flags: bigint): void {
		this.execSegFlags |= flags;
	}

	/**
	 * Get special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @returns Hash data, or null.
	 */
	public getSpecialSlot(slot: number): Uint8Array | null {
		slot = slot - (slot % 1) || 0;
		if (slot < 1) {
			throw new Error(`Invalid slot index: ${slot}`);
		}
		return this.#special.get(slot) || null;
	}

	/**
	 * Set special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @param hash Hash data.
	 */
	public setSpecialSlot(slot: number, hash: BufferView): void {
		slot = slot - (slot % 1) || 0;
		if (slot < 1) {
			throw new Error(`Invalid slot index: ${slot}`);
		}
		const slots = this.#special;
		const { digestLength } = this;
		const { byteLength } = hash;
		if (byteLength !== digestLength) {
			throw new Error(`Invalid hash size: ${byteLength}`);
		}
		const digest = slots.get(slot) || new Uint8Array(digestLength);
		digest.set(new Uint8Array(hash.buffer, hash.byteOffset, byteLength));
		slots.set(slot, digest);
		if (slot >= this.#specialSlots) {
			this.#specialSlots = slot;
		}
	}

	/**
	 * Get code slot.
	 *
	 * @param slot Slot index, 0 indexed.
	 * @returns Hash data, or null.
	 */
	public getCodeSlot(slot: number): Uint8Array | null {
		slot = slot - (slot % 1) || 0;
		const { codeSlots } = this;
		if (slot < 0 || slot >= codeSlots) {
			throw new Error(`Invalid slot: ${slot}`);
		}
		const slots = this.#code;
		slots.length = this.codeSlots;
		return slots[slot] || null;
	}

	/**
	 * Set code slot.
	 *
	 * @param slot Slot index, 0 indexed.
	 * @param hash Hash data.
	 */
	public setCodeSlot(slot: number, hash: BufferView): void {
		slot = slot - (slot % 1) || 0;
		const { codeSlots } = this;
		if (slot < 0 || slot >= codeSlots) {
			throw new Error(`Invalid slot: ${slot}`);
		}
		const slots = this.#code;
		slots.length = codeSlots;
		const { digestLength } = this;
		const digest = slots[slot] || new Uint8Array(digestLength);
		const { byteLength } = hash;
		if (byteLength !== digestLength) {
			throw new Error(`Invalid hash size: ${byteLength}`);
		}
		digest.set(new Uint8Array(hash.buffer, hash.byteOffset, byteLength));
		slots[slot] = digest;
	}

	/**
	 * Create a scatter vector with count slots, plus sentinel.
	 *
	 * @param count Number of slots, excluding sentinel.
	 * @returns Scatter vector.
	 */
	public createScatter(count: number): CodeDirectoryScatter[] {
		count = count - (count % 1) || 0;
		const { BYTE_LENGTH } = CodeDirectoryScatter;
		const vector: typeof this.scatter = [];
		const total = count + 1;
		for (let i = 0; i < total; i++) {
			vector.push(new CodeDirectoryScatter(new ArrayBuffer(BYTE_LENGTH)));
		}
		this.scatter = vector;
		return vector;
	}

	/**
	 * Size of scatter vector.
	 */
	public get scatterSize(): number {
		let size = 0;
		const { scatter } = this;
		if (scatter) {
			for (const s of scatter) {
				size += s.byteLength;
			}
		}
		return size;
	}

	/**
	 * Compatibility version of described CodeDirectory.
	 */
	public get version(): number {
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
	public size(version: number | null = null): number {
		version ??= this.version;
		const {
			constructor: Static,
			identifier,
			teamID,
			codeSlots,
			specialSlots,
			digestLength,
			generatePreEncryptHashes,
		} = this;
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
	public build(version: number | null = null): CodeDirectory {
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
			generatePreEncryptHashes,
		} = this;
		const size = this.size(version);
		const buffer = new ArrayBuffer(size);
		const data = new Uint8Array(buffer);
		const dir = new CodeDirectory(buffer);
		dir.initialize2(size);
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
				const { byteLength } = s;
				data.set(
					new Uint8Array(s.buffer, s.byteOffset, byteLength),
					offset,
				);
				offset += byteLength;
			}
		}
		dir.identOffset = offset;
		data.set(
			new Uint8Array(
				identifier.buffer,
				identifier.byteOffset,
				identifier.byteLength,
			),
			offset,
		);
		offset += identifier.byteLength + 1;
		if (teamID.byteLength && !(version < CodeDirectory.supportsTeamID)) {
			data.set(
				new Uint8Array(
					teamID.buffer,
					teamID.byteOffset,
					teamID.byteLength,
				),
				offset,
			);
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
				dir.getSlot(-i, false)!.set(hash);
			}
		}
		for (let i = 0; i < codeSlots; i++) {
			const hash = this.getCodeSlot(i);
			if (hash) {
				dir.getSlot(i, false)!.set(hash);
				if (gpec) {
					dir.getSlot(i, true)!.set(hash);
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
	public static fixedSize(version: number): number {
		let size = CodeDirectory.BYTE_LENGTH;
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
	public static digestLength(hashType: number): number {
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
}
