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
	public first = 0;

	/**
	 * CPU subtype.
	 */
	public second = 0;

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
	constructor(archInFile: Readonly<FatArch | FatArch64>);

	/**
	 * Create architecture from types or fat architecture struct.
	 *
	 * @param type CPU type or FatArch|FatArch64 struct.
	 * @param sub CPU subtype if type is number.
	 */
	constructor(
		type?: number | Readonly<FatArch | FatArch64>,
		sub?: number,
	) {
		switch (typeof type) {
			case 'undefined': {
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
	 * Get CPU type.
	 */
	public get cpuType(): number {
		return this.first;
	}

	/**
	 * Get CPU subtype.
	 */
	public get cpuSubType(): number {
		return this.second & ~CPU_SUBTYPE_MASK;
	}

	/**
	 * Get full CPU subtype.
	 */
	public get cpuSubtypeFull(): number {
		return this.second;
	}
}
