import { dataView } from '@hqtsm/struct';
import type { RequirementMaker } from './requirementmaker.ts';
import { RequirementMakerLabel } from './requirementmakerlabel.ts';

/**
 * RequirementMaker chain.
 */
export class RequirementMakerChain extends RequirementMakerLabel {
	declare public readonly ['constructor']: Omit<
		typeof RequirementMakerChain,
		'new'
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
			const p = this.maker.insert(this);
			dataView(p.buffer).setUint32(p.byteOffset, this.mJoiner);
		}
	}

	/**
	 * Check if the chain has no elements.
	 */
	public get empty(): boolean {
		return this.mCount === 0;
	}
}
