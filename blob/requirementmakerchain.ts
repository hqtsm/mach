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
	maker: RequirementMaker;

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
	 */
	public add(): void {
		if (this.mCount++) {
			const p = RequirementMaker.prototype.insert.call(this.maker, this);
			dataView(p.buffer).setUint32(p.byteOffset, this.mJoiner);
		}
	}

	/**
	 * Check if the chain has no elements.
	 *
	 * @returns Is empty.
	 */
	public empty(): boolean {
		return this.mCount === 0;
	}

	static {
		toStringTag(this, 'RequirementMakerChain');
	}
}
