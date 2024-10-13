/* eslint-disable max-classes-per-file */
import {Struct, structU32} from '../struct.ts';

/**
 * Dynamically linked shared library use command.
 */
export class DylibUseCommand extends Struct {
	public declare readonly ['constructor']: typeof DylibUseCommand;

	/**
	 * Command type.
	 */
	public declare cmd: number;

	/**
	 * Command size.
	 */
	public declare cmdsize: number;

	/**
	 * Path offset.
	 */
	public declare nameoff: number;

	/**
	 * Use marker.
	 */
	public declare marker: number;

	/**
	 * Current version.
	 */
	public declare currentVersion: number;

	/**
	 * Compatibility version.
	 */
	public declare compatVersion: number;

	/**
	 * Flags.
	 */
	public declare flags: number;

	/**
	 * @inheritdoc
	 */
	public static readonly BYTE_LENGTH = (o => {
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

/**
 * Dynamically linked shared library use command, big endian.
 */
export class DylibUseCommandBE extends DylibUseCommand {
	public declare readonly ['constructor']: typeof DylibUseCommandBE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = false;
}

/**
 * Dynamically linked shared library use command, little endian.
 */
export class DylibUseCommandLE extends DylibUseCommand {
	public declare readonly ['constructor']: typeof DylibUseCommandLE;

	/**
	 * @inheritdoc
	 */
	public static readonly LITTLE_ENDIAN = true;
}
