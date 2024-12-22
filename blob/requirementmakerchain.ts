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
	readonly #maker: RequirementMaker;

	/**
	 * Joiner opcode.
	 */
	readonly #joiner: number;

	/**
	 * Number of elements in the chain.
	 */
	#count: number;

	/**
	 * Chain constructor.
	 *
	 * @param maker Maker reference.
	 * @param op Joiner opcode.
	 */
	constructor(maker: RequirementMaker, op: number) {
		super(maker);
		this.#maker = maker;
		this.#joiner = op;
		this.#count = 0;
	}

	/**
	 * Maker reference.
	 */
	public get maker(): RequirementMaker {
		return this.#maker;
	}

	/**
	 * Add an element to the chain.
	 */
	public add(): void {
		if (this.#count++) {
			const p = this.maker.insert(this);
			dataView(p.buffer).setUint32(p.byteOffset, this.#joiner);
		}
	}

	/**
	 * Check if the chain has no elements.
	 */
	public get empty(): boolean {
		return this.#count === 0;
	}
}
