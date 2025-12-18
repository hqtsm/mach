import { type Class, toStringTag } from '@hqtsm/class';
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
	constructor(maker: RequirementMaker) {
		this.pos = RequirementMaker.length(maker);
	}

	static {
		toStringTag(this, 'RequirementMakerLabel');
	}
}
