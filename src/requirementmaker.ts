import {Requirement} from './requirement.ts';
import {alignUp} from './util.ts';

/**
 * For creating a new Requirement blob.
 */
export class RequirementMaker {
	public declare readonly ['constructor']: typeof RequirementMaker;

	/**
	 * Buffer of allocated bytes.
	 */
	#data: ArrayBuffer;

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
		this.#data = buffer;
		this.#pc = Requirement.sizeof;
	}

	/**
	 * Allocate bytes at end of buffer and return a view of that.
	 *
	 * @param size Size in bytes.
	 * @returns View of allocated bytes.
	 */
	public alloc(size: number) {
		const usedSize = alignUp(
			size,
			this.constructor.Requirement.baseAlignment
		);
		this.require(usedSize);
		const a = new Uint8Array(this.#data, this.#pc, size);
		this.#pc += usedSize;
		return a;
	}

	/**
	 * Make requirement.
	 *
	 * @returns Requirement instance.
	 */
	public make() {
		const r = new this.constructor.Requirement(this.#data);
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
			const d = new ArrayBuffer(total);
			new Uint8Array(d).set(new Uint8Array(data));
			this.#data = d;
		}
	}

	/**
	 * Requirement reference.
	 */
	public static readonly Requirement = Requirement;
}
