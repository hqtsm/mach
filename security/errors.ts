import { isToStringTag, toStringTag } from '@hqtsm/class';
import { type Arr, array, type Const, Int8Ptr } from '@hqtsm/struct';
import { errSecErrnoBase, errSecErrnoLimit, errSecSuccess } from '../const.ts';

const whatBufferSize = 128;

/**
 * Common error.
 */
export class CommonError extends Error {
	/**
	 * Error tag.
	 */
	declare public [Symbol.toStringTag]: string;

	/**
	 * Error message.
	 */
	public readonly whatBuffer: Arr<number>;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.whatBuffer = new (array(Int8Ptr, whatBufferSize))(
			new ArrayBuffer(whatBufferSize),
		);
	}

	/**
	 * Error message buffer size.
	 */
	public get whatBufferSize(): number {
		return whatBufferSize;
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
	public osStatus(): number {
		return 0;
	}

	/**
	 * Unix error.
	 *
	 * @returns Error code.
	 */
	public unixError(): number {
		return 0;
	}

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
