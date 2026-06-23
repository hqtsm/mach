import { assertRejects, assertStrictEquals, assertThrows } from '@std/assert';
import {
	Security_CFError,
	Security_MacOSError,
	Security_UnixError,
} from '../Security/errors.ts';

const cfMessage = 'CoreFoundation error';

export async function assertRejectsUnixError(
	f: () => Promise<unknown>,
	code: number,
	msg?: string,
): Promise<Security_UnixError> {
	const e: Security_UnixError = await assertRejects(
		f,
		Security_UnixError as never,
		Security_UnixError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export function assertThrowsUnixError(
	f: () => unknown,
	code: number,
	msg?: string,
): Security_UnixError {
	const e: Security_UnixError = assertThrows(
		f,
		Security_UnixError as never,
		Security_UnixError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export async function assertRejectsMacOSError(
	f: () => Promise<unknown>,
	code: number,
	msg?: string,
): Promise<Security_MacOSError> {
	const e: Security_MacOSError = await assertRejects(
		f,
		Security_MacOSError as never,
		Security_MacOSError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export function assertThrowsMacOSError(
	f: () => unknown,
	code: number,
	msg?: string,
): Security_MacOSError {
	const e: Security_MacOSError = assertThrows(
		f,
		Security_MacOSError as never,
		Security_MacOSError.make(code).message,
		msg,
	);
	assertStrictEquals(e.error, code, msg);
	return e;
}

export async function assertRejectsCFError(
	f: () => Promise<unknown>,
): Promise<Security_CFError> {
	return await assertRejects(f, Security_CFError as never, cfMessage);
}

export function assertThrowsCFError(f: () => unknown): Security_CFError {
	return assertThrows(
		f,
		Security_CFError as never,
		cfMessage,
	) as Security_CFError;
}
