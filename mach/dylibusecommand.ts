import { Struct, structU32 } from '../struct.ts';

/**
 * Dynamically linked shared library use command.
 */
export class DylibUseCommand extends Struct {
	declare public readonly ['constructor']: typeof DylibUseCommand;

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

	/**
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH: number = ((o) => {
		o += structU32(this, o, 'cmd');
		o += structU32(this, o, 'cmdsize');
		o += structU32(this, o, 'nameoff');
		o += structU32(this, o, 'marker');
		o += structU32(this, o, 'currentVersion');
		o += structU32(this, o, 'compatVersion');
		o += structU32(this, o, 'flags');
		return o;
	})(super.BYTE_LENGTH);
}
