import { assertEquals, assertInstanceOf, assertThrows } from '@std/assert';
import {
	errSecErrnoBase,
	errSecErrnoLimit,
	errSecSuccess,
	errSecUnimplemented,
} from '../const.ts';
import { CommonError } from './commonerror.ts';
import { MacOSError } from './macoserror.ts';

Deno.test('message', () => {
	const err = new MacOSError(42);
	assertEquals(err.message, 'MacOS error: 42');
});

Deno.test('osStatus', () => {
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

Deno.test('unixError', () => {
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

Deno.test('what', () => {
	const err = new MacOSError(42);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('isMacOSError', () => {
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

Deno.test('check', () => {
	MacOSError.check(errSecSuccess);
	assertThrows(
		() => MacOSError.check(errSecUnimplemented),
		MacOSError,
		`MacOS error: ${errSecUnimplemented}`,
	);
});

Deno.test('throw', () => {
	assertInstanceOf(new MacOSError(42), Error);
	assertInstanceOf(new MacOSError(42), CommonError);
	try {
		MacOSError.throwMe(42);
	} catch (e) {
		assertInstanceOf(e, MacOSError);
	}
});
