import { type Class, toStringTag } from '@hqtsm/class';
import { CPU_SUBTYPE_MASK, CPU_SUBTYPE_MULTIPLE } from '../const.ts';
import type { FatArch } from '../mach/fatarch.ts';
import type { FatArch64 } from '../mach/fatarch64.ts';

/**
 * Architecture specification.
 */
export class Architecture {
	declare public readonly ['constructor']: Class<typeof Architecture>;

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
	constructor(archInFile: FatArch | FatArch64);

	/**
	 * Create architecture with CPU type and subtype.
	 *
	 * @param type CPU type or fat architecture.
	 * @param sub CPU subtype.
	 */
	constructor(
		type?: number | FatArch | FatArch64,
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
	 * @param _this This.
	 * @returns Type ID.
	 */
	public static cpuType(_this: Architecture): number {
		return _this.first;
	}

	/**
	 * CPU subtype.
	 *
	 * @param _this This.
	 * @returns Masked subtype ID.
	 */
	public static cpuSubtype(_this: Architecture): number {
		return _this.second & ~CPU_SUBTYPE_MASK;
	}

	/**
	 * Full CPU subtype.
	 *
	 * @param _this This.
	 * @returns Full subtype ID.
	 */
	public static cpuSubtypeFull(_this: Architecture): number {
		return _this.second;
	}

	/**
	 * Is architecture valid.
	 *
	 * @param _this This.
	 * @returns Is valid.
	 */
	public static bool(_this: Architecture): boolean {
		return !!_this.first;
	}

	/**
	 * If architectures are equal.
	 *
	 * @param a1 Architecture A.
	 * @param a2 Architecture B.
	 * @returns Is equal.
	 */
	public static equals(a1: Architecture, a2: Architecture): boolean {
		return a1.first === a2.first && a1.second === a2.second;
	}

	/**
	 * If architecture is less than another.
	 *
	 * @param a1 Architecture A.
	 * @param a2 Architecture B.
	 * @returns Is less than.
	 */
	public static lessThan(a1: Architecture, a2: Architecture): boolean {
		const x = a1.first;
		const y = a2.first;
		return x < y || (!(y < x) && a1.second < a2.second);
	}

	/**
	 * Check is architecture matches template, asymmetric comparison.
	 *
	 * @param _this This.
	 * @param templ Template architecture.
	 * @returns Matches template.
	 */
	public static matches(_this: Architecture, templ: Architecture): boolean {
		if (_this.first !== templ.first) {
			return false;
		}
		if (templ.second === CPU_SUBTYPE_MULTIPLE) {
			return true;
		}
		return !((_this.second ^ templ.second) & ~CPU_SUBTYPE_MASK);
	}

	static {
		toStringTag(this, 'Architecture');
	}
}
