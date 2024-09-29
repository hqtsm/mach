import type {RequirementMaker} from './requirementmaker.ts';
import {RequirementMakerLabel} from './requirementmakerlabel.ts';

/**
 * RequirementMaker chain.
 */
export class RequirementMakerChain extends RequirementMakerLabel {
	public declare readonly ['constructor']: typeof RequirementMakerChain;

	/**
	 * Maker reference.
	 */
	#maker: RequirementMaker | null = null;

	/**
	 * Get maker.
	 *
	 * @returns Maker reference.
	 */
	public get maker() {
		return this.#maker;
	}

	/**
	 * Joiner code.
	 *
	 * @returns Joiner code.
	 */
	get #joiner() {
		return this.dataView.getUint32(16);
	}

	/**
	 * Set joiner code.
	 *
	 * @param value Joiner code.
	 */
	set #joiner(value: number) {
		this.dataView.setUint32(16, value);
	}

	/**
	 * Number of elements in operator chain.
	 *
	 * @returns Element count.
	 */
	get #count() {
		return this.dataView.getUint32(20);
	}

	/**
	 * Number of elements in operator chain.
	 *
	 * @param value Element count.
	 */
	set #count(value: number) {
		this.dataView.setUint32(20, value);
	}

	/**
	 * RequirementMakerChain constructor.
	 *
	 * @param maker RequirementMaker instance.
	 * @param op ExprOp code.
	 * @returns This.
	 */
	public RequirementMakerChain(maker: RequirementMaker, op: number) {
		// eslint-disable-next-line new-cap
		this.RequirementMakerLabel(maker);
		this.#maker = maker;
		this.#joiner = op;
		this.#count = 0;
		return this;
	}

	/**
	 * Add an element to the chain.
	 */
	public add() {
		if (this.#count++) {
			this.maker!.insert(this).setUint32(0, this.#joiner);
		}
	}

	/**
	 * Check if the chain has no elements.
	 *
	 * @returns True if empty.
	 */
	public get empty() {
		return this.#count === 0;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 24;
}
