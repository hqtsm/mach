/* eslint-disable max-classes-per-file */
import {Struct} from './struct.ts';

/**
 * Mach-O header, 64-bit.
 */
export class MachHeader64 extends Struct {
	public declare readonly ['constructor']: typeof MachHeader64;

	/**
	 * Mach magic.
	 *
	 * @returns Magic number.
	 */
	public get magic() {
		return this.dataView.getUint32(0, this.littleEndian);
	}

	/**
	 * Mach magic.
	 *
	 * @param value Magic number.
	 */
	public set magic(value: number) {
		this.dataView.setUint32(0, value, this.littleEndian);
	}

	/**
	 * CPU type.
	 *
	 * @returns Type ID.
	 */
	public get cputype() {
		return this.dataView.getInt32(4, this.littleEndian);
	}

	/**
	 * CPU type.
	 *
	 * @param value Type ID.
	 */
	public set cputype(value: number) {
		this.dataView.setInt32(4, value, this.littleEndian);
	}

	/**
	 * Machine type.
	 *
	 * @returns Type ID.
	 */
	public get cpusubtype() {
		return this.dataView.getInt32(8, this.littleEndian);
	}

	/**
	 * Machine type.
	 *
	 * @param value Type ID.
	 */
	public set cpusubtype(value: number) {
		this.dataView.setInt32(8, value, this.littleEndian);
	}

	/**
	 * File type.
	 *
	 * @returns Type ID.
	 */
	public get filetype() {
		return this.dataView.getUint32(12, this.littleEndian);
	}

	/**
	 * File type.
	 *
	 * @param value Type ID.
	 */
	public set filetype(value: number) {
		this.dataView.setUint32(12, value, this.littleEndian);
	}

	/**
	 * Number of load commands.
	 *
	 * @returns Command count.
	 */
	public get ncmds() {
		return this.dataView.getUint32(16, this.littleEndian);
	}

	/**
	 * Number of load commands.
	 *
	 * @param value Command count.
	 */
	public set ncmds(value: number) {
		this.dataView.setUint32(16, value, this.littleEndian);
	}

	/**
	 * Size of load commands.
	 *
	 * @returns Commands size.
	 */
	public get sizeofcmds() {
		return this.dataView.getUint32(20, this.littleEndian);
	}

	/**
	 * Size of load commands.
	 *
	 * @param value Commands size.
	 */
	public set sizeofcmds(value: number) {
		this.dataView.setUint32(20, value, this.littleEndian);
	}

	/**
	 * Flags.
	 *
	 * @returns Flags.
	 */
	public get flags() {
		return this.dataView.getUint32(24, this.littleEndian);
	}

	/**
	 * Flags.
	 *
	 * @param value Flags.
	 */
	public set flags(value: number) {
		this.dataView.setUint32(24, value, this.littleEndian);
	}

	/**
	 * Reserved.
	 *
	 * @returns Reserved.
	 */
	public get reserved() {
		return this.dataView.getUint32(28, this.littleEndian);
	}

	/**
	 * Reserved.
	 *
	 * @param value Reserved.
	 */
	public set reserved(value: number) {
		this.dataView.setUint32(28, value, this.littleEndian);
	}

	/**
	 * @inheritdoc
	 */
	public static readonly sizeof: number = 32;
}

/**
 * Mach-O header, 64-bit, big endian.
 */
export class MachHeader64BE extends MachHeader64 {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = false;
}

/**
 * Mach-O header, 64-bit, little endian.
 */
export class MachHeader64LE extends MachHeader64 {
	/**
	 * @inheritdoc
	 */
	public static readonly littleEndian = true;
}
