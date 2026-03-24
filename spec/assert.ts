import { assertRejects, assertStrictEquals, assertThrows } from '@std/assert';
import { MacOSError, UnixError } from '../Security/errors.ts';

export async function assertRejectsUnixError(
	f: () => Promise<unknown>,
	code: number,
	msg?: string,
): Promise<UnixError> {
	const e = await assertRejects(
		f,
		UnixError,
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
	const e = assertThrows(f, UnixError, UnixError.make(code).message, msg);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export async function assertRejectsMacOSError(
	f: () => Promise<unknown>,
	code: number,
	msg?: string,
): Promise<MacOSError> {
	const e = await assertRejects(
		f,
		MacOSError,
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
	const e = assertThrows(f, MacOSError, MacOSError.make(code).message, msg);
	assertStrictEquals(e.error, code, msg);
	return e;
}
