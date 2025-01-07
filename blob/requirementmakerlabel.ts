import type { RequirementMaker } from './requirementmaker.ts';

/**
 * RequirementMaker label.
 */
export class RequirementMakerLabel {
	declare public readonly ['constructor']: Omit<
		typeof RequirementMakerLabel,
		'new'
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
	constructor(maker: Readonly<RequirementMaker>) {
		this.pos = maker.length();
	}
}
