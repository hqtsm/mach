import { assertEquals, assertInstanceOf, assertThrows } from '@std/assert';
import { errSecErrnoBase } from '../const.ts';
import { CommonError } from './commonerror.ts';
import { UnixError } from './unixerror.ts';

Deno.test('instanceof', () => {
	assertInstanceOf(new UnixError(42, false), Error);
	assertInstanceOf(new UnixError(42, false), CommonError);
});

Deno.test('message', () => {
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

Deno.test('osStatus', () => {
	assertEquals(new UnixError(0, false).osStatus(), errSecErrnoBase);
	assertEquals(new UnixError(1, false).osStatus(), errSecErrnoBase + 1);
});

Deno.test('unixError', () => {
	assertEquals(new UnixError(0, false).unixError(), 0);
	assertEquals(new UnixError(1, false).unixError(), 1);
});

Deno.test('what', () => {
	const err = new UnixError(42, false);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('check', () => {
	UnixError.check(1, { errno: 42 });
	UnixError.check(0, { errno: 42 });
	assertThrows(
		() => UnixError.check(-1, { errno: 42 }),
		UnixError,
		'UNIX error exception: 42',
	);
	UnixError.check(-2, { errno: 42 });
});

Deno.test('throwMe + throwMeNoLogging', () => {
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

Deno.test('throwMeNoLogging', () => {
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

Deno.test('isUnixError', () => {
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
