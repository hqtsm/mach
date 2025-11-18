import { constant } from '@hqtsm/class';
import { Struct, uint32 } from '@hqtsm/struct';

/**
 * Dynamically linked shared library use command.
 */
export class DylibUseCommand extends Struct {
	declare public readonly ['constructor']: Omit<
		typeof DylibUseCommand,
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
	 * Path offset.
	 */
	declare public nameoff: number;

	/**
	 * Use marker.
	 */
	declare public marker: number;

	/**
	 * Current version.
	 */
	declare public currentVersion: number;

	/**
	 * Compatibility version.
	 */
	declare public compatVersion: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'nameoff');
		uint32(this, 'marker');
		uint32(this, 'currentVersion');
		uint32(this, 'compatVersion');
		uint32(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}
