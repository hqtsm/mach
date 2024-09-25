import {Requirement} from './requirement.ts';
import {alignUp} from './util.ts';

/**
 * RequirementMaker class.
 */
export class RequirementMaker {
	public declare readonly ['constructor']: typeof RequirementMaker;

	/**
	 * Buffer of allocated bytes.
	 */
	#data: Uint8Array;

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
		const {Requirement} = this.constructor;
		const buffer = new ArrayBuffer(1024);
		const r = new Requirement(buffer);
		r.magic = Requirement.typeMagic;
		r.kind = kind;
		this.#data = new Uint8Array(buffer);
		this.#pc = Requirement.sizeof;
	}

	/**
	 * Allocate bytes at end of buffer and return a view of that.
	 *
	 * @param size Size in bytes.
	 * @returns View of allocated bytes (size rounded up to baseAlignment).
	 */
	public alloc(size: number) {
		const {Requirement} = this.constructor;
		const data = this.#data;
		const usedSize = alignUp(size, Requirement.baseAlignment);
		this.require(usedSize);
		const pc = this.#pc;
		const a = data.subarray(pc, pc + usedSize);
		this.#pc += usedSize;
		return a;
	}

	/**
	 * Make requirement.
	 *
	 * @returns Requirement instance.
	 */
	public make() {
		const {Requirement} = this.constructor;
		const data = this.#data;
		const r = new Requirement(data.buffer, data.byteOffset);
		r.length = this.#pc;
		return r;
	}

	/**
	 * Require bytes.
	 *
	 * @param size Number of bytes required.
	 */
	protected require(size: number) {
		const data = this.#data;
		const pc = this.#pc;
		let total = data.byteLength;
		if (pc + size > total) {
			total *= 2;
			if (pc + size > total) {
				total = pc + size;
			}
			const d = new Uint8Array(total);
			d.set(data);
			this.#data = d;
		}
	}

	/**
	 * Requirement class.
	 */
	public static readonly Requirement = Requirement;
}
