import type { BufferView } from '@hqtsm/struct';
import { UINT32_MAX } from '../const.ts';
import type { DynamicHash } from '../hash/dynamichash.ts';
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
	private readonly mSpecial = new Map<number, Uint8Array>();

	/**
	 * Highest special slot index.
	 */
	private mSpecialSlots = 0;

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
	private mFlags = 0;

	/**
	 * Hash algorithm.
	 */
	private readonly mHashType: number;

	/**
	 * Platform.
	 */
	private mPlatform = 0;

	/**
	 * Hash digest length.
	 */
	private readonly mDigestLength: number;

	/**
	 * Identifier.
	 */
	private mIdentifier: BufferView = new Int8Array();

	/**
	 * Team ID.
	 */
	private mTeamID: BufferView = new Int8Array();

	/**
	 * Code slots.
	 */
	private readonly mCodeSlots: (Uint8Array | undefined)[] = [];

	/**
	 * Scatter vector.
	 */
	private mScatter: CodeDirectoryScatter[] | null = null;

	/**
	 * Scatter vector byte size, include sentinel.
	 */
	private mScatterSize = 0;

	/**
	 * Exec segment offset.
	 */
	private mExecSegOffset = 0n;

	/**
	 * Exec segment limit.
	 */
	private mExecSegLimit = 0n;

	/**
	 * Exec segment flags.
	 */
	private mExecSegFlags = 0n;

	/**
	 * Generate pre-encrypt hashes.
	 */
	private mGeneratePreEncryptHashes = false;

	/**
	 * Runtime version.
	 */
	private mRuntimeVersion = 0;

	/**
	 * CodeDirectoryBuilder constructor.
	 *
	 * @param digestAlgorithm Hash algorithm (kSecCodeSignatureHash* constants).
	 */
	constructor(digestAlgorithm: number) {
		this.mHashType = digestAlgorithm;
		this.mDigestLength = this.getHash().digestLength();
	}

	/**
	 * Hash digest length.
	 */
	public get digestLength(): number {
		return this.mDigestLength;
	}

	/**
	 * Special slots count.
	 */
	public get specialSlots(): number {
		return this.mSpecialSlots;
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
	 * Set identifier.
	 *
	 * @param code Identifier.
	 */
	public identifier(code: BufferView): void {
		this.mIdentifier = code;
	}

	/**
	 * Set team ID.
	 *
	 * @param team Team ID.
	 */
	public teamID(team: BufferView): void {
		this.mTeamID = team;
	}

	/**
	 * Set flags.
	 *
	 * @param flags Flags.
	 */
	public flags(flags: number): void {
		this.mFlags = flags;
	}

	/**
	 * Set platform.
	 *
	 * @param platform Platform.
	 */
	public platform(platform: number): void {
		this.mPlatform = platform;
	}

	/**
	 * Create a scatter vector with count slots, plus sentinel.
	 *
	 * @param count Number of slots, excluding sentinel.
	 * @returns Scatter vector.
	 */
	public scatter(count: number): CodeDirectoryScatter[];

	/**
	 * Get existing scatter vector.
	 *
	 * @returns Scatter vector.
	 */
	public scatter(): CodeDirectoryScatter[] | null;

	public scatter(count?: number): CodeDirectoryScatter[] | null {
		if (count !== undefined) {
			count = (+count || 0) - (count % 1 || 0);
			const { BYTE_LENGTH } = CodeDirectoryScatter;
			const vector: typeof this.mScatter = [];
			const total = count + 1;
			for (let i = 0; i < total; i++) {
				vector.push(
					new CodeDirectoryScatter(new ArrayBuffer(BYTE_LENGTH)),
				);
			}
			this.mScatterSize = total * BYTE_LENGTH;
			return this.mScatter = vector;
		}
		return this.mScatter;
	}

	/**
	 * Set exec segment.
	 *
	 * @param base Base offset.
	 * @param limit Limit.
	 * @param flags Flags.
	 */
	public execSeg(base: bigint, limit: bigint, flags: bigint): void {
		this.mExecSegOffset = base;
		this.mExecSegLimit = limit;
		this.mExecSegFlags = flags;
	}

	/**
	 * Add exec segment flags.
	 *
	 * @param flags Flags.
	 */
	public addExecSegFlags(flags: bigint): void {
		this.mExecSegFlags |= flags;
	}

	/**
	 * Set generate pre-encrypt hashes.
	 *
	 * @param pre Generate pre-encrypt hashes.
	 */
	public generatePreEncryptHashes(pre: boolean): void {
		this.mGeneratePreEncryptHashes = pre;
	}

	/**
	 * Set the runtime version.
	 *
	 * @param runtime Runtime version.
	 */
	public runTimeVersion(runtime: number): void {
		this.mRuntimeVersion = runtime;
	}

	/**
	 * Get special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @returns Hash data, or null.
	 */
	public getSpecialSlot(slot: number): Uint8Array | null {
		slot = (+slot || 0) - (slot % 1 || 0);
		if (slot < 1) {
			throw new Error(`Invalid slot index: ${slot}`);
		}
		return this.mSpecial.get(slot) || null;
	}

	/**
	 * Set special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @param hash Hash data.
	 */
	public setSpecialSlot(slot: number, hash: BufferView): void {
		slot = (+slot || 0) - (slot % 1 || 0);
		if (slot < 1) {
			throw new Error(`Invalid slot index: ${slot}`);
		}
		const slots = this.mSpecial;
		const { digestLength } = this;
		const { byteLength } = hash;
		if (byteLength !== digestLength) {
			throw new Error(`Invalid hash size: ${byteLength}`);
		}
		const digest = slots.get(slot) || new Uint8Array(digestLength);
		digest.set(new Uint8Array(hash.buffer, hash.byteOffset, byteLength));
		slots.set(slot, digest);
		if (slot >= this.mSpecialSlots) {
			this.mSpecialSlots = slot;
		}
	}

	/**
	 * Get code slot.
	 *
	 * @param slot Slot index, 0 indexed.
	 * @returns Hash data, or null.
	 */
	public getCodeSlot(slot: number): Uint8Array | null {
		slot = (+slot || 0) - (slot % 1 || 0);
		const { codeSlots, mCodeSlots } = this;
		if (slot < 0 || slot >= codeSlots) {
			throw new Error(`Invalid slot: ${slot}`);
		}
		mCodeSlots.length = this.codeSlots;
		return mCodeSlots[slot] || null;
	}

	/**
	 * Set code slot.
	 *
	 * @param slot Slot index, 0 indexed.
	 * @param hash Hash data.
	 */
	public setCodeSlot(slot: number, hash: BufferView): void {
		slot = (+slot || 0) - (slot % 1 || 0);
		const { codeSlots, mCodeSlots } = this;
		if (slot < 0 || slot >= codeSlots) {
			throw new Error(`Invalid slot: ${slot}`);
		}
		mCodeSlots.length = codeSlots;
		const { digestLength } = this;
		const digest = mCodeSlots[slot] || new Uint8Array(digestLength);
		const { byteLength } = hash;
		if (byteLength !== digestLength) {
			throw new Error(`Invalid hash size: ${byteLength}`);
		}
		digest.set(new Uint8Array(hash.buffer, hash.byteOffset, byteLength));
		mCodeSlots[slot] = digest;
	}

	/**
	 * Caculate size for CodeDirectory currently described.
	 *
	 * @param version Compatibility version or null for minimum.
	 * @returns Byte size.
	 */
	public size(version: number | null = null): number {
		version ??= this.minVersion();
		const {
			mIdentifier,
			mTeamID,
			codeSlots,
			specialSlots,
			digestLength,
			mGeneratePreEncryptHashes,
		} = this;
		let size = this.fixedSize(version);
		if (!(version < CodeDirectory.supportsScatter)) {
			size += this.mScatterSize;
		}
		size += mIdentifier.byteLength + 1;
		if (!(version < CodeDirectory.supportsTeamID) && mTeamID.byteLength) {
			size += mTeamID.byteLength + 1;
		}
		size += (codeSlots + specialSlots) * digestLength;
		if (
			!(version < CodeDirectory.supportsPreEncrypt) &&
			mGeneratePreEncryptHashes
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
		version ??= this.minVersion();
		const {
			specialSlots,
			codeSlots,
			execLength,
			digestLength,
			pageSize,
			mScatter,
			mIdentifier,
			mTeamID,
			mGeneratePreEncryptHashes,
		} = this;
		const size = this.size(version);
		const buffer = new ArrayBuffer(size);
		const data = new Uint8Array(buffer);
		const dir = new CodeDirectory(buffer);
		dir.initialize2(size);
		dir.version = version;
		dir.flags = this.mFlags;
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
		dir.hashType = this.mHashType;
		dir.platform = this.mPlatform;
		dir.hashSize = digestLength;
		dir.pageSize = pageSize ? Math.log2(pageSize) : 0;
		if (!(version < CodeDirectory.supportsExecSegment)) {
			dir.execSegBase = this.mExecSegOffset;
			dir.execSegLimit = this.mExecSegLimit;
			dir.execSegFlags = this.mExecSegFlags;
		}
		if (!(version < CodeDirectory.supportsPreEncrypt)) {
			dir.runtime = this.mRuntimeVersion;
		}
		let offset = this.fixedSize(version);
		if (mScatter && !(version < CodeDirectory.supportsScatter)) {
			dir.scatterOffset = offset;
			for (const s of mScatter) {
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
				mIdentifier.buffer,
				mIdentifier.byteOffset,
				mIdentifier.byteLength,
			),
			offset,
		);
		offset += mIdentifier.byteLength + 1;
		if (mTeamID.byteLength && !(version < CodeDirectory.supportsTeamID)) {
			dir.teamIDOffset = offset;
			data.set(
				new Uint8Array(
					mTeamID.buffer,
					mTeamID.byteOffset,
					mTeamID.byteLength,
				),
				offset,
			);
			offset += mTeamID.byteLength + 1;
		}
		const spe = !(version < CodeDirectory.supportsPreEncrypt);
		const gpec = spe && mGeneratePreEncryptHashes;
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
	 * Hash type.
	 *
	 * @returns Hash type.
	 */
	public hashType(): number {
		return this.mHashType;
	}

	/**
	 * Get fixed size for compatibility version.
	 *
	 * @param version Compatibility version.
	 * @returns Byte size.
	 */
	public fixedSize(version: number): number {
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
	 * Get hash creation instance.
	 *
	 * @returns Hash instance.
	 */
	public getHash(): DynamicHash {
		return CodeDirectory.hashFor(this.mHashType);
	}

	/**
	 * Minimum compatibility version of described CodeDirectory.
	 */
	public minVersion(): number {
		if (this.mGeneratePreEncryptHashes || this.mRuntimeVersion) {
			return CodeDirectory.supportsPreEncrypt;
		}
		if (this.mExecSegLimit > 0) {
			return CodeDirectory.supportsExecSegment;
		}
		if (this.execLength > UINT32_MAX) {
			return CodeDirectory.supportsCodeLimit64;
		}
		if (this.mTeamID.byteLength) {
			return CodeDirectory.supportsTeamID;
		}
		if (this.mScatterSize) {
			return CodeDirectory.supportsScatter;
		}
		return CodeDirectory.earliestVersion;
	}
}
