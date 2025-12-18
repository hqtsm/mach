import { type Class, toStringTag } from '@hqtsm/class';
import { dataView } from '@hqtsm/struct';
import { RequirementMaker } from './requirementmaker.ts';
import { RequirementMakerLabel } from './requirementmakerlabel.ts';

/**
 * RequirementMaker chain.
 */
export class RequirementMakerChain extends RequirementMakerLabel {
	declare public readonly ['constructor']: Class<
		typeof RequirementMakerChain
	>;

	/**
	 * Maker reference.
	 */
	public maker: RequirementMaker;

	/**
	 * Joiner opcode.
	 */
	private readonly mJoiner: number;

	/**
	 * Number of elements in the chain.
	 */
	private mCount: number;

	/**
	 * Chain constructor.
	 *
	 * @param maker Maker reference.
	 * @param op Joiner opcode.
	 */
	constructor(maker: RequirementMaker, op: number) {
		super(maker);
		this.maker = maker;
		this.mJoiner = op;
		this.mCount = 0;
	}

	/**
	 * Add an element to the chain.
	 *
	 * @param _this This.
	 */
	public static add(_this: RequirementMakerChain): void {
		if (_this.mCount++) {
			const p = RequirementMaker.insert(_this.maker, _this);
			dataView(p.buffer).setUint32(p.byteOffset, _this.mJoiner);
		}
	}

	/**
	 * Check if the chain has no elements.
	 *
	 * @param _this This.
	 * @returns Is empty.
	 */
	public static empty(_this: RequirementMakerChain): boolean {
		return _this.mCount === 0;
	}

	static {
		toStringTag(this, 'RequirementMakerChain');
	}
}
