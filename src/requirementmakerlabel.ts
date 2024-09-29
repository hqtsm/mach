import type {RequirementMaker} from './requirementmaker.ts';
import {Struct} from './struct.ts';

/**
 * RequirementMakerLabel Label.
 */
export class RequirementMakerLabel extends Struct {
	public declare readonly ['constructor']: typeof RequirementMakerLabel;

	/**
	 * Get position.
	 *
	 * @returns Byte offset.
	 */
	public get pos() {
		return this.dataView.getUint32(0);
	}

	/**
	 * Set position.
	 *
	 * @param value Byte offset.
	 */
	public set pos(value: number) {
		this.dataView.setUint32(0, value);
	}

	/**
	 * RequirementMakerLabel constructor.
	 *
	 * @param maker RequirementMaker instance.
	 * @returns This.
	 */
	public RequirementMakerLabel(maker: Readonly<RequirementMaker>) {
		this.pos = maker.length;
		return this;
	}

	/**
	 * Size of new instance.
	 */
	public static readonly sizeof: number = 4;
}
