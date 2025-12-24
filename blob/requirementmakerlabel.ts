import { toStringTag } from '@hqtsm/class';
import { RequirementMaker } from './requirementmaker.ts';

/**
 * RequirementMaker label.
 */
export class RequirementMakerLabel {
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
