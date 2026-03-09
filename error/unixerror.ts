import { toStringTag } from '@hqtsm/class';
import type { Const, Int8Ptr } from '@hqtsm/struct';
import { errSecErrnoBase } from '../const.ts';
import { CommonError } from './commonerror.ts';

/**
 * Unix error.
 */
export class UnixError extends CommonError {
	/**
	 * Error code.
	 */
	public readonly error: number;

	/**
	 * Constructor.
	 *
	 * @param err Error code.
	 * @param suppresslogging Suppress logging.
	 */
	constructor(err: number, suppresslogging: boolean);

	/**
	 * Constructor.
	 *
	 * @param context Context.
	 */
	constructor(context: { errno: number });

	/**
	 * Constructor.
	 *
	 * @param err Error code or context.
	 */
	constructor(err: number | { errno: number }, suppresslogging?: boolean) {
		super();
		let message;
		if (typeof err === 'number') {
			if (!suppresslogging) {
				message = `UNIX error exception: ${err}`;
			}
		} else {
			err = err.errno;
			message = `UNIX errno exception: ${err}`;
		}
		this.error = err;
		if (message) {
			const { whatBuffer } = this;
			for (let i = message.length; i--;) {
				whatBuffer[i] = message.charCodeAt(i);
			}
		}
	}

	public override osStatus(): number {
		return this.error + errSecErrnoBase;
	}

	public override unixError(): number {
		return this.error;
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
	 * Check is result should throw UnixError.
	 *
	 * @param result Result.
	 * @param context Context.
	 */
	public static check(result: number, context: { errno: number }): void {
		if (result === -1) {
			UnixError.throwMe(context);
		}
	}

	/**
	 * Throw UnixError.
	 *
	 * @param err Error code or context.
	 */
	public static throwMe(err: number | { errno: number }): never {
		throw new UnixError(typeof err === 'number' ? err : err.errno, false);
	}

	/**
	 * Throw UnixError without logging.
	 *
	 * @param err Error code or context.
	 */
	public static throwMeNoLogging(err: number | { errno: number }): never {
		throw new UnixError(typeof err === 'number' ? err : err.errno, true);
	}

	/**
	 * Is value a UnixError.
	 *
	 * @param value Value.
	 * @returns Is UnixError.
	 */
	public static isUnixError(value: unknown): value is UnixError {
		return Error.isError(value) && value.name === 'UnixError';
	}

	static {
		toStringTag(this, 'UnixError');
		Object.defineProperty(this.prototype, 'name', {
			value: 'UnixError',
			configurable: true,
			enumerable: false,
			writable: true,
		});
	}
}
