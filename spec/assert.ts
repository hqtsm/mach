import { assertRejects, assertStrictEquals, assertThrows } from '@std/assert';
import { CFError, MacOSError, UnixError } from '../Security/errors.ts';

const cfMessage = 'CoreFoundation error';

export async function assertRejectsUnixError(
	f: () => Promise<unknown>,
	code: number,
	msg?: string,
): Promise<UnixError> {
	const e: UnixError = await assertRejects(
		f,
		UnixError as never,
		UnixError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export function assertThrowsUnixError(
	f: () => unknown,
	code: number,
	msg?: string,
): UnixError {
	const e: UnixError = assertThrows(
		f,
		UnixError as never,
		UnixError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export async function assertRejectsMacOSError(
	f: () => Promise<unknown>,
	code: number,
	msg?: string,
): Promise<MacOSError> {
	const e: MacOSError = await assertRejects(
		f,
		MacOSError as never,
		MacOSError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export function assertThrowsMacOSError(
	f: () => unknown,
	code: number,
	msg?: string,
): MacOSError {
	const e: MacOSError = assertThrows(
		f,
		MacOSError as never,
		MacOSError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export async function assertRejectsCFError(
	f: () => Promise<unknown>,
): Promise<CFError> {
	return await assertRejects(f, CFError as never, cfMessage);
}

export function assertThrowsCFError(f: () => unknown): CFError {
	return assertThrows(f, CFError as never, cfMessage) as CFError;
}
