import { constant, Struct, uint32, uint64 } from '@hqtsm/struct';

/**
 * Source version command.
 */
export class SourceVersionCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof SourceVersionCommand,
		'new'
	>;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * A.B.C.D.E packed as a24.b10.c10.d10.e10.
	 */
	declare public version: bigint;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'version');
		constant(this, 'BYTE_LENGTH');
	}
}
