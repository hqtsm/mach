import type {RequirementMaker} from './requirementmaker.ts';

/**
 * RequirementMaker label.
 */
export class RequirementMakerLabel {
	public declare readonly ['constructor']: Omit<
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
		this.pos = maker.length;
	}
}
