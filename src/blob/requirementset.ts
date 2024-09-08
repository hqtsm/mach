import {Blob} from '../blob.ts';
import {BufferView} from '../type.ts';
import {kSecCodeMagicRequirementSet} from '../const.ts';
import {sparseSet, subview} from '../util.ts';
import {Requirement} from './requirement.ts';

/**
 * RequirementSet class.
 */
export class RequirementSet extends Blob {
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
	readonly #requirements: (Requirement | undefined)[] = [];

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
	public setType(type: number, requirement: Requirement | null) {
		// eslint-disable-next-line no-undefined
		sparseSet(this.#requirements, type, requirement || undefined);
	}

	/**
	 * @inheritdoc
	 */
	public byteWrite(buffer: BufferView, offset = 0) {
		const {length, count} = this;
		const d = subview(DataView, buffer, offset, length);
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
