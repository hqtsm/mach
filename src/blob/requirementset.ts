import {Blob} from '../blob.ts';
import {BufferView, StaticI} from '../type.ts';
import {kSecCodeMagicRequirementSet} from '../const.ts';
import {sparseSet, viewDataR, viewDataW} from '../util.ts';
import {Requirement} from './requirement.ts';

/**
 * RequirementSet Blob.
 */
export class RequirementSet extends Blob {
	/**
	 * Requirement reference.
	 */
	public static readonly Requirement = Requirement;

	public declare readonly ['constructor']: typeof RequirementSet;

	/**
	 * @inheritdoc
	 */
	public get magic() {
		return kSecCodeMagicRequirementSet;
	}

	/**
	 * @inheritdoc
	 */
	public get length() {
		let l = 12;
		for (const type of this.types()) {
			const r = this.getType(type)!;
			l += 8 + r.length;
		}
		return l;
	}

	/**
	 * Number of requirements in the set.
	 *
	 * @returns The number of requirements.
	 */
	public get count() {
		let c = 0;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const _ of this.types()) {
			c++;
		}
		return c;
	}

	/**
	 * Types itterator.
	 *
	 * @yields Types in the set.
	 */
	public *types() {
		const rs = this.#requirements;
		const l = rs.length;
		for (let type = 0; type < l; type++) {
			if (rs[type]) {
				yield type;
			}
		}
	}

	/**
	 * Requirement set.
	 */
	readonly #requirements: (StaticI<this, 'Requirement'> | undefined)[] = [];

	/**
	 * Get type by SecRequirementType.
	 *
	 * @param type SecRequirementType.
	 * @returns Requirement or null.
	 */
	public getType(type: number) {
		return this.#requirements[type] || null;
	}

	/**
	 * Set type by SecRequirementType.
	 *
	 * @param type SecRequirementType.
	 * @param requirement Requirement or null.
	 */
	public setType(
		type: number,
		requirement: StaticI<this, 'Requirement'> | null
	) {
		// eslint-disable-next-line no-undefined
		sparseSet(this.#requirements, type, requirement || undefined);
	}

	/**
	 * Clear all requirement types.
	 */
	public clearTypes() {
		this.#requirements.length = 0;
	}

	/**
	 * @inheritdoc
	 */
	public byteRead(buffer: Readonly<BufferView>, offset = 0): number {
		const {constructor: Requirement} = this;
		let d = viewDataR(buffer, offset);
		const magic = d.getUint32(0);
		if (magic !== this.magic) {
			throw new Error(`Invalid magic: ${magic}`);
		}
		const length = d.getUint32(4);
		if (length < 8) {
			throw new Error(`Invalid length: ${length}`);
		}
		d = viewDataR(d, 0, length);
		const count = d.getUint32(8);
		let o1 = 12;
		const types = new Map<number, StaticI<this, 'Requirement'>>();
		for (let i = 0; i < count; i++) {
			const type = d.getUint32(o1);
			o1 += 4;
			const o2 = d.getUint32(o1);
			o1 += 4;
			const r = new Requirement() as StaticI<this, 'Requirement'>;
			r.byteRead(buffer, o2);
			types.set(type, r);
		}
		this.clearTypes();
		for (const [type, r] of types) {
			this.setType(type, r);
		}
		return length;
	}

	/**
	 * @inheritdoc
	 */
	public byteWrite(buffer: BufferView, offset = 0) {
		const {length, count} = this;
		const d = viewDataW(buffer, offset, length);
		d.setUint32(0, this.magic);
		d.setUint32(4, length);
		d.setUint32(8, count);
		let o1 = 12;
		let o2 = o1 + count * 8;
		for (const type of this.types()) {
			const r = this.getType(type)!;
			d.setUint32(o1, type);
			o1 += 4;
			d.setUint32(o1, o2);
			o1 += 4;
			o2 += r.byteWrite(d, o2);
		}
		return length;
	}
}
