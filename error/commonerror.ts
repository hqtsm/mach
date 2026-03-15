import { toStringTag } from '@hqtsm/class';
import { type Arr, array, Int8Ptr } from '@hqtsm/struct';

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
		for (
			let tag;
			(tag = (arg as CommonError | null)?.[Symbol.toStringTag]);
			arg = Object.getPrototypeOf(arg)
		) {
			if (tag === 'CommonError') {
				return true;
			}
		}
		return false;
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
