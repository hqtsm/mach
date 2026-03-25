import { isToStringTag, toStringTag } from '@hqtsm/class';
import { type Arr, array, type Const, Int8Ptr, type Ptr } from '@hqtsm/struct';
import type { bool, char, int } from '../libc/c.ts';
import type { size_t } from '../libc/stddef.ts';
import type { OSStatus } from '../MacOSX/MacTypes.ts';
import { errSecSuccess } from './SecBase.ts';

/**
 * Security error code base.
 */
export const errSecErrnoBase = 100000;

/**
 * Security error code limit.
 */
export const errSecErrnoLimit = 100255;

const whatBufferSize = 128;

/**
 * Common error.
 */
export class CommonError extends Error {
	/**
	 * Constructor.
	 */
	protected constructor() {
		super();
		this.whatBuffer = new (array(Int8Ptr, whatBufferSize))(
			new ArrayBuffer(whatBufferSize),
		);
	}

	/**
	 * Get error message.
	 *
	 * @returns Error message.
	 */
	public override get message(): string {
		const { whatBuffer } = this;
		let message = '';
		for (let i = 0, c; i < whatBufferSize && (c = whatBuffer[i]); i++) {
			message += String.fromCharCode(c & 0xff);
		}
		return message;
	}

	/**
	 * OS status.
	 *
	 * @returns Status code.
	 */
	public osStatus(): OSStatus {
		return 0;
	}

	/**
	 * Unix error.
	 *
	 * @returns Error code.
	 */
	public unixError(): int {
		return 0;
	}

	/**
	 * Error message.
	 */
	public readonly whatBuffer: Arr<char>;

	/**
	 * Error message buffer size.
	 */
	public get whatBufferSize(): size_t {
		return whatBufferSize;
	}

	/**
	 * Error tag.
	 */
	declare public [Symbol.toStringTag]: string;

	/**
	 * Is value a CommonError.
	 *
	 * @param arg Value.
	 * @returns Is CommonError.
	 */
	public static isCommonError(arg: unknown): arg is CommonError {
		return isToStringTag(CommonError, arg);
	}

	static {
		toStringTag(this, 'CommonError');
		Object.defineProperty(this.prototype, 'name', {
			value: 'CommonError',
			configurable: true,
			enumerable: false,
			writable: true,
		});
	}
}

/**
 * Unix error.
 */
export class UnixError extends CommonError {
	/**
	 * Constructor.
	 *
	 * @param err Error code.
	 * @param suppresslogging Suppress logging.
	 */
	protected constructor(err: int, suppresslogging: bool);

	/**
	 * Constructor.
	 *
	 * @param context Context.
	 */
	protected constructor(context: { errno: int });

	/**
	 * Constructor.
	 *
	 * @param err Error code or context.
	 */
	protected constructor(
		err: int | { errno: int },
		suppresslogging?: bool,
	) {
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

	/**
	 * Error code.
	 */
	public readonly error: int;

	public override osStatus(): OSStatus {
		return this.error + errSecErrnoBase;
	}

	public override unixError(): int {
		return this.error;
	}

	/**
	 * Get error message buffer.
	 *
	 * @returns Error message buffer.
	 */
	public what(): Const<Ptr<char>> {
		return this.whatBuffer;
	}

	/**
	 * Check is result should throw UnixError.
	 *
	 * @param result Result.
	 * @param context Context.
	 */
	public static check(result: int, context: { errno: int }): void {
		if (result === -1) {
			UnixError.throwMe(context);
		}
	}

	/**
	 * Throw UnixError.
	 *
	 * @param err Error code or context.
	 */
	public static throwMe(err: int | { errno: int }): never {
		throw new UnixError(typeof err === 'number' ? err : err.errno, false);
	}

	/**
	 * Throw UnixError without logging.
	 *
	 * @param err Error code or context.
	 */
	public static throwMeNoLogging(err: int | { errno: int }): never {
		throw new UnixError(typeof err === 'number' ? err : err.errno, true);
	}

	/**
	 * Make UnixError.
	 *
	 * @param err Error code or context.
	 * @returns UnixError.
	 */
	public static make(err: int | { errno: int }): UnixError {
		return new UnixError(typeof err === 'number' ? err : err.errno, false);
	}

	/**
	 * Is value a UnixError.
	 *
	 * @param arg Value.
	 * @returns Is UnixError.
	 */
	public static isUnixError(arg: unknown): arg is UnixError {
		return isToStringTag(UnixError, arg);
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

/**
 * MacOS error.
 */
export class MacOSError extends CommonError {
	/**
	 * Constructor.
	 *
	 * @param err Error code.
	 */
	protected constructor(err: int) {
		super();
		this.error = err;
		const message = `MacOS error: ${err}`;
		const { whatBuffer } = this;
		for (let i = message.length; i--;) {
			whatBuffer[i] = message.charCodeAt(i);
		}
	}

	/**
	 * Error code.
	 */
	public readonly error: int;

	public override osStatus(): OSStatus {
		return this.error;
	}

	public override unixError(): int {
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
	public what(): Const<Ptr<char>> {
		return this.whatBuffer;
	}

	/**
	 * Check is status should throw MacOSError.
	 *
	 * @param status Status.
	 */
	public static check(status: OSStatus): void {
		if (status !== errSecSuccess) {
			MacOSError.throwMe(status);
		}
	}

	/**
	 * Throw MacOSError.
	 *
	 * @param err Error code.
	 */
	public static throwMe(err: int): never {
		throw new MacOSError(err);
	}

	/**
	 * Make MacOSError.
	 *
	 * @param err Error code.
	 * @returns MacOSError.
	 */
	public static make(err: int): MacOSError {
		return new MacOSError(err);
	}

	/**
	 * Is value a MacOSError.
	 *
	 * @param arg Value.
	 * @returns Is MacOSError.
	 */
	public static isMacOSError(arg: unknown): arg is MacOSError {
		return isToStringTag(MacOSError, arg);
	}

	static {
		toStringTag(this, 'MacOSError');
		Object.defineProperty(this.prototype, 'name', {
			value: 'MacOSError',
			configurable: true,
			enumerable: false,
			writable: true,
		});
	}
}
