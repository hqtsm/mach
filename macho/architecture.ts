import type { Const } from '@hqtsm/struct';
import { CPU_SUBTYPE_MASK, CPU_SUBTYPE_MULTIPLE } from '../const.ts';
import type { FatArch } from '../mach/fatarch.ts';
import type { FatArch64 } from '../mach/fatarch64.ts';

/**
 * Architecture specification.
 */
export class Architecture {
	declare public readonly ['constructor']: Omit<typeof Architecture, 'new'>;

	/**
	 * CPU type.
	 */
	public first: number;

	/**
	 * CPU subtype.
	 */
	public second: number;

	/**
	 * Create architecture.
	 */
	constructor();

	/**
	 * Create architecture with CPU type and subtype.
	 *
	 * @param type CPU type.
	 * @param sub CPU subtype, defaults to `CPU_SUBTYPE_MULTIPLE`.
	 */
	constructor(type: number, sub?: number | null);

	/**
	 * Create architecture from fat architecture struct.
	 *
	 * @param archInFile FatArch|FatArch64 struct.
	 */
	constructor(archInFile: Const<FatArch | FatArch64>);

	constructor(
		type?: number | Const<FatArch | FatArch64>,
		sub?: number,
	) {
		switch (typeof type) {
			case 'undefined': {
				this.first = 0;
				this.second = 0;
				break;
			}
			case 'number': {
				this.first = type;
				this.second = sub ?? CPU_SUBTYPE_MULTIPLE;
				break;
			}
			default: {
				this.first = type.cputype;
				this.second = type.cpusubtype;
			}
		}
	}

	/**
	 * CPU type.
	 *
	 * @returns Type ID.
	 */
	public cpuType(): number {
		return this.first;
	}

	/**
	 * CPU subtype.
	 *
	 * @returns Masked subtype ID.
	 */
	public cpuSubtype(): number {
		return this.second & ~CPU_SUBTYPE_MASK;
	}

	/**
	 * Full CPU subtype.
	 *
	 * @returns Full subtype ID.
	 */
	public cpuSubtypeFull(): number {
		return this.second;
	}

	/**
	 * Is architecture valid.
	 *
	 * @returns Is valid.
	 */
	public bool(): boolean {
		return !!this.first;
	}

	/**
	 * If architectures are equal.
	 *
	 * @param arch Architecture to compare.
	 * @returns Is equal.
	 */
	public equals(arch: Const<Architecture>): boolean {
		return this.first === arch.first && this.second === arch.second;
	}

	/**
	 * If architecture is less than another.
	 *
	 * @param arch Architecture to compare.
	 * @returns Is less than.
	 */
	public lessThan(arch: Const<Architecture>): boolean {
		const x = this.first;
		const y = arch.first;
		return x < y || (!(y < x) && this.second < arch.second);
	}

	/**
	 * Check is architecture matches template, asymmetric comparison.
	 *
	 * @param templ Template architecture.
	 * @returns Matches template.
	 */
	public matches(templ: Const<Architecture>): boolean {
		if (this.first !== templ.first) {
			return false;
		}
		if (templ.second === CPU_SUBTYPE_MULTIPLE) {
			return true;
		}
		return !((this.second ^ templ.second) & ~CPU_SUBTYPE_MASK);
	}
}
