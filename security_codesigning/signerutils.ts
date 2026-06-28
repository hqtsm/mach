import { toStringTag } from '@hqtsm/class';
import type { _const } from '../libc/mod.ts';
import { kSecDesignatedRequirementType } from '../Security/mod.ts';
import { Security_CodeSigning_DRMaker } from './drmaker.ts';
import {
	type Security_CodeSigning_Requirement_Context,
	type Security_CodeSigning_Requirements,
	Security_CodeSigning_Requirements_Maker,
} from './requirement.ts';

/**
 * Internal requirements.
 */
export class Security_CodeSigning_InternalRequirements
	extends Security_CodeSigning_Requirements_Maker {
	/**
	 * Call to make requirements.
	 *
	 * @param _this This.
	 * @param given Given requirements.
	 * @param defaulted Defaulted requirements.
	 * @param context Interpretation context.
	 */
	public static async makeReqs(
		_this: Security_CodeSigning_InternalRequirements,
		given: _const<Security_CodeSigning_Requirements> | null,
		defaulted: _const<Security_CodeSigning_Requirements> | null,
		context: _const<Security_CodeSigning_Requirement_Context>,
	): Promise<void> {
		if (defaulted) {
			Security_CodeSigning_InternalRequirements.add(_this, defaulted);
		}

		if (given) {
			Security_CodeSigning_InternalRequirements.add(_this, given);
		}

		if (
			!Security_CodeSigning_InternalRequirements.contains(
				_this,
				kSecDesignatedRequirementType,
			)
		) {
			const maker = new Security_CodeSigning_DRMaker(context);
			const dr = await Security_CodeSigning_DRMaker.make(maker);
			if (dr) {
				Security_CodeSigning_InternalRequirements.add(
					_this,
					kSecDesignatedRequirementType,
					dr,
				);
			}
		}

		_this.mReqs = Security_CodeSigning_InternalRequirements.make(_this);
	}

	/**
	 * Get requirements after making.
	 *
	 * @returns Requirements.
	 */
	public static getReqs(
		_this: Security_CodeSigning_InternalRequirements,
	): _const<Security_CodeSigning_Requirements> | null {
		return _this.mReqs;
	}

	/**
	 * Built requirements.
	 */
	private mReqs: _const<Security_CodeSigning_Requirements> | null = null;

	static {
		toStringTag(this, 'Security_CodeSigning_InternalRequirements');
	}
}
