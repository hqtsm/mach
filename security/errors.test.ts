import {
	assertEquals,
	assertGreater,
	assertInstanceOf,
	assertThrows,
} from '@std/assert';
import {
	CommonError,
	errSecErrnoBase,
	errSecErrnoLimit,
	MacOSError,
	UnixError,
} from './errors.ts';
import { errSecSuccess, errSecUnimplemented } from './SecBase.ts';

Deno.test('CommonError: instanceof', () => {
	assertInstanceOf(new CommonError(), Error);
});

Deno.test('CommonError: message', () => {
	const err = new CommonError();
	assertGreater(err.whatBufferSize, 0);
	assertEquals(err.whatBuffer.length, err.whatBufferSize);
	assertEquals(err.message, '');
	err.whatBuffer[0] = 'A'.charCodeAt(0);
	err.whatBuffer[1] = 'B'.charCodeAt(0);
	err.whatBuffer[2] = 'C'.charCodeAt(0);
	err.whatBuffer[4] = '!'.charCodeAt(0);
	assertEquals(err.message, 'ABC');
});

Deno.test('CommonError: osStatus', () => {
	const err = new CommonError();
	assertEquals(err.osStatus(), 0);
});

Deno.test('CommonError: unixError', () => {
	const err = new CommonError();
	assertEquals(err.unixError(), 0);
});

Deno.test('CommonError: isCommonError', () => {
	assertEquals(CommonError.isCommonError(new CommonError()), true);
	assertEquals(CommonError.isCommonError(new Error()), false);
	assertEquals(CommonError.isCommonError({}), false);
	assertEquals(CommonError.isCommonError(null), false);
	assertEquals(CommonError.isCommonError(undefined), false);
	assertEquals(CommonError.isCommonError(0), false);
});

Deno.test('CommonError: throw', () => {
	assertThrows(
		() => {
			throw new CommonError();
		},
		CommonError,
		'',
	);
});

Deno.test('UnixError: instanceof', () => {
	assertInstanceOf(new UnixError(42, false), Error);
	assertInstanceOf(new UnixError(42, false), CommonError);
});

Deno.test('UnixError: message', () => {
	assertEquals(
		new UnixError(42, true).message,
		'',
	);
	assertEquals(
		new UnixError(42, false).message,
		'UNIX error exception: 42',
	);
	assertEquals(
		new UnixError({ errno: 42 }).message,
		'UNIX errno exception: 42',
	);
});

Deno.test('UnixError: osStatus', () => {
	assertEquals(new UnixError(0, false).osStatus(), errSecErrnoBase);
	assertEquals(new UnixError(1, false).osStatus(), errSecErrnoBase + 1);
});

Deno.test('UnixError: unixError', () => {
	assertEquals(new UnixError(0, false).unixError(), 0);
	assertEquals(new UnixError(1, false).unixError(), 1);
});

Deno.test('UnixError: what', () => {
	const err = new UnixError(42, false);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('UnixError: check', () => {
	UnixError.check(1, { errno: 42 });
	UnixError.check(0, { errno: 42 });
	assertThrows(
		() => UnixError.check(-1, { errno: 42 }),
		UnixError,
		'UNIX error exception: 42',
	);
	UnixError.check(-2, { errno: 42 });
});

Deno.test('UnixError: throwMe + throwMeNoLogging', () => {
	assertThrows(
		() => UnixError.throwMe(42),
		UnixError,
		'UNIX error exception: 42',
	);
	assertThrows(
		() => UnixError.throwMe({ errno: 42 }),
		UnixError,
		'UNIX error exception: 42',
	);
});

Deno.test('UnixError: throwMeNoLogging', () => {
	assertThrows(
		() => UnixError.throwMeNoLogging(42),
		UnixError,
		'',
	);
	assertThrows(
		() => UnixError.throwMeNoLogging({ errno: 42 }),
		UnixError,
		'',
	);
});

Deno.test('UnixError: isUnixError', () => {
	assertEquals(UnixError.isUnixError(new UnixError(42, false)), true);
	assertEquals(UnixError.isUnixError(new CommonError()), false);
	assertEquals(UnixError.isUnixError(new Error()), false);
	assertEquals(UnixError.isUnixError({}), false);
	assertEquals(UnixError.isUnixError(null), false);
	assertEquals(UnixError.isUnixError(undefined), false);
	assertEquals(UnixError.isUnixError(0), false);
	assertEquals(CommonError.isCommonError(new UnixError(42, false)), true);
	assertEquals(UnixError.isCommonError(new UnixError(42, false)), true);
});

Deno.test('MacOSError: instanceof', () => {
	assertInstanceOf(new MacOSError(42), Error);
	assertInstanceOf(new MacOSError(42), CommonError);
});

Deno.test('MacOSError: message', () => {
	const err = new MacOSError(42);
	assertEquals(err.message, 'MacOS error: 42');
});

Deno.test('MacOSError: osStatus', () => {
	assertEquals(new MacOSError(0).osStatus(), 0);
	assertEquals(new MacOSError(1).osStatus(), 1);
	assertEquals(
		new MacOSError(errSecErrnoBase - 1).osStatus(),
		errSecErrnoBase - 1,
	);
	assertEquals(new MacOSError(errSecErrnoBase).osStatus(), errSecErrnoBase);
	assertEquals(new MacOSError(errSecErrnoLimit).osStatus(), errSecErrnoLimit);
	assertEquals(
		new MacOSError(errSecErrnoLimit + 1).osStatus(),
		errSecErrnoLimit + 1,
	);
});

Deno.test('MacOSError: unixError', () => {
	assertEquals(new MacOSError(0).unixError(), -1);
	assertEquals(new MacOSError(1).unixError(), -1);
	assertEquals(new MacOSError(errSecErrnoBase - 1).unixError(), -1);
	assertEquals(new MacOSError(errSecErrnoBase).unixError(), 0);
	assertEquals(
		new MacOSError(errSecErrnoLimit).unixError(),
		errSecErrnoLimit - errSecErrnoBase,
	);
	assertEquals(new MacOSError(errSecErrnoLimit + 1).unixError(), -1);
});

Deno.test('MacOSError: what', () => {
	const err = new MacOSError(42);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('MacOSError: check', () => {
	MacOSError.check(errSecSuccess);
	assertThrows(
		() => MacOSError.check(errSecUnimplemented),
		MacOSError,
		`MacOS error: ${errSecUnimplemented}`,
	);
});

Deno.test('MacOSError: throwMe', () => {
	assertThrows(() => MacOSError.throwMe(42), MacOSError, `MacOS error: 42`);
});

Deno.test('MacOSError: isMacOSError', () => {
	assertEquals(MacOSError.isMacOSError(new MacOSError(42)), true);
	assertEquals(MacOSError.isMacOSError(new CommonError()), false);
	assertEquals(MacOSError.isMacOSError(new Error()), false);
	assertEquals(MacOSError.isMacOSError({}), false);
	assertEquals(MacOSError.isMacOSError(null), false);
	assertEquals(MacOSError.isMacOSError(undefined), false);
	assertEquals(MacOSError.isMacOSError(0), false);
	assertEquals(CommonError.isCommonError(new MacOSError(42)), true);
	assertEquals(MacOSError.isCommonError(new MacOSError(42)), true);
});
