/* eslint-disable max-classes-per-file */
import {Struct} from './struct.ts';

/**
 * Load command.
 */
export class LoadCommand extends Struct {
	public declare readonly ['constructor']: typeof LoadCommand;

	/**
	 * Command type.
	 *
	 * @returns Type ID.
	 */
	public get cmd() {
		return this.dataView.getUint32(0, this.littleEndian);
	}

	/**
	 * Command type.
	 *
	 * @param value Type ID.
	 */
	public set cmd(value: number) {
		this.dataView.setUint32(0, value, this.littleEndian);
	}

	/**
	 * Command size.
	 *
	 * @returns Byte length.
	 */
	public get cmdsize() {
		return this.dataView.getUint32(4, this.littleEndian);
	}

	/**
	 * Command size.
	 *
	 * @param value Byte length.
	 */
	public set cmdsize(value: number) {
		this.dataView.setUint32(4, value, this.littleEndian);
	}

	/**
	 * @inheritdoc
	 */
	public static readonly sizeof: number = 28;
}

/**
 * Load command, big endian.
 */
export class LoadCommandBE extends LoadCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = false;
}

/**
 * Load command, little endian.
 */
export class LoadCommandLE extends LoadCommand {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = true;
}
