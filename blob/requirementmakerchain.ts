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
	 * @param self This.
	 */
	public static add(self: RequirementMakerChain): void {
		if (self.mCount++) {
			const p = RequirementMaker.prototype.insert.call(self.maker, self);
			dataView(p.buffer).setUint32(p.byteOffset, self.mJoiner);
		}
	}

	/**
	 * Check if the chain has no elements.
	 *
	 * @param self This.
	 * @returns Is empty.
	 */
	public static empty(self: RequirementMakerChain): boolean {
		return self.mCount === 0;
	}

	static {
		toStringTag(this, 'RequirementMakerChain');
	}
}
