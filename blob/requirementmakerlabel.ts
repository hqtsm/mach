import { type Class, toStringTag } from '@hqtsm/class';
import type { Const } from '@hqtsm/struct';
import { RequirementMaker } from './requirementmaker.ts';

/**
 * RequirementMaker label.
 */
export class RequirementMakerLabel {
	declare public readonly ['constructor']: Class<
		typeof RequirementMakerLabel
	>;

	/**
	 * Label position.
	 */
	public pos: number;

	/**
	 * Label constructor.
	 *
	 * @param maker Maker reference.
	 */
	constructor(maker: Const<RequirementMaker>) {
		this.pos = RequirementMaker.prototype.length.call(maker);
	}

	static {
		toStringTag(this, 'RequirementMakerLabel');
	}
}
