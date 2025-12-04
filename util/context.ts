import { toStringTag } from '@hqtsm/class';

/**
 * Context.
 */
export class Context {
	/**
	 * Error code.
	 */
	public errno = 0;

	static {
		toStringTag(this, 'Context');
	}
}
