import { toStringTag } from '@hqtsm/class';
import type { Const, Int8Ptr } from '@hqtsm/struct';
import { errSecErrnoBase, errSecSuccess } from '../const.ts';
import { CommonError } from './commonerror.ts';
import { errSecErrnoLimit } from '@hqtsm/mach';

const NAME = 'MacOSError';

/**
 * Unix error.
 */
export class MacOSError extends CommonError {
	/**
	 * Error code.
	 */
	public readonly error: number;

	/**
	 * Constructor.
	 *
	 * @param err Error code.
	 */
	constructor(err: number) {
		super();
		this.error = err;
		const message = `MacOS error: ${err}`;
		const { whatBuffer } = this;
		for (let i = message.length; i--;) {
			whatBuffer[i] = message.charCodeAt(i);
		}
	}

	public override osStatus(): number {
		return this.error;
	}

	public override unixError(): number {
		const { error } = this;
		return (error >= errSecErrnoBase && error <= errSecErrnoLimit)
			? error - errSecErrnoBase
			: -1;
	}

	/**
	 * Get error message buffer.
	 *
	 * @returns Error message buffer.
	 */
	public what(): Const<Int8Ptr> {
		return this.whatBuffer;
	}

	/**
	 * Check is status should throw MacOSError.
	 *
	 * @param status Status.
	 */
	public static check(status: number): void {
		if (status !== errSecSuccess) {
			MacOSError.throwMe(status);
		}
	}

	/**
	 * Throw MacOSError.
	 *
	 * @param err Error code.
	 */
	public static throwMe(err: number): never {
		throw new MacOSError(err);
	}

	/**
	 * Is value a MacOSError.
	 *
	 * @param arg Value.
	 * @returns Is MacOSError.
	 */
	public static isMacOSError(arg: unknown): arg is MacOSError {
		for (; arg; arg = Object.getPrototypeOf(arg)) {
			if ((arg as MacOSError | null)?.[Symbol.toStringTag] === NAME) {
				return true;
			}
		}
		return false;
	}

	static {
		toStringTag(this, NAME);
		Object.defineProperty(this.prototype, 'name', {
			value: NAME,
			configurable: true,
			enumerable: false,
			writable: true,
		});
	}
}
