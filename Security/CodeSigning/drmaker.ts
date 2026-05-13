import { toStringTag } from '@hqtsm/class';
import type { _const, bool } from '../../libc/c.ts';
import { Requirement_Maker } from './reqmaker.ts';
import type { Requirement, Requirement_Context } from './requirement.ts';

/**
 * Designated Requirements maker.
 */
export class DRMaker extends Requirement_Maker {
	/**
	 * Constructor.
	 *
	 * @param context Interpretation context.
	 */
	constructor(context: _const<Requirement_Context>) {
		super();
		this.ctx = context;
	}

	/**
	 * Interpretation context.
	 */
	public ctx: _const<Requirement_Context>;

	/**
	 * Make requirement.
	 *
	 * @param _this This.
	 * @returns Requirement instance.
	 */
	public static override make(_this: DRMaker): Requirement {
		throw new Error('TODO');
	}

	/**
	 * Add Apple anchor.
	 *
	 * @param _this This.
	 */
	private static appleAnchor(_this: DRMaker): void {
		throw new Error('TODO');
	}

	/**
	 * Add non-Apple anchor.
	 *
	 * @param _this This.
	 */
	private static nonAppleAnchor(_this: DRMaker): void {
		throw new Error('TODO');
	}

	/**
	 * Is iOS signature.
	 *
	 * @param _this This.
	 */
	private static isIOSSignature(_this: DRMaker): bool {
		throw new Error('TODO');
	}

	/**
	 * Is developer ID signature.
	 *
	 * @param _this This.
	 */
	private static isDeveloperIDSignature(_this: DRMaker): bool {
		throw new Error('TODO');
	}

	static {
		toStringTag(this, 'DRMaker');
	}
}
