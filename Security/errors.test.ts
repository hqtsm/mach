import {
	assertEquals,
	assertGreater,
	assertInstanceOf,
	assertThrows,
} from '@std/assert';
import {
	CFError,
	CommonError,
	errSecErrnoBase,
	errSecErrnoLimit,
	MacOSError,
	UnixError,
} from './errors.ts';
import {
	errSecCoreFoundationUnknown,
	errSecSuccess,
	errSecUnimplemented,
} from './SecBase.ts';
import { EFAULT } from '../libc/errno.ts';

class MyCommonError extends CommonError {
	constructor() {
		super();
	}
}

const cfError = (): CFError => {
	let r: CFError;
	try {
		CFError.throwMe();
	} catch (e) {
		r = e as CFError;
	}
	return r;
};

Deno.test('CommonError: instanceof', () => {
	assertInstanceOf(new MyCommonError(), Error);
});

Deno.test('CommonError: message', () => {
	const err = new MyCommonError();
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
	const err = new MyCommonError();
	assertEquals(err.osStatus(), 0);
});

Deno.test('CommonError: unixError', () => {
	const err = new MyCommonError();
	assertEquals(err.unixError(), 0);
});

Deno.test('CommonError: isCommonError', () => {
	assertEquals(CommonError.isCommonError(new MyCommonError()), true);
	assertEquals(CommonError.isCommonError(new Error()), false);
	assertEquals(CommonError.isCommonError({}), false);
	assertEquals(CommonError.isCommonError(null), false);
	assertEquals(CommonError.isCommonError(undefined), false);
	assertEquals(CommonError.isCommonError(0), false);
});

Deno.test('CommonError: throw', () => {
	assertThrows(
		() => {
			throw new MyCommonError();
		},
		MyCommonError,
		'',
	);
});

Deno.test('UnixError: instanceof', () => {
	assertInstanceOf(UnixError.make(42), Error);
	assertInstanceOf(UnixError.make(42), CommonError as never);
});

Deno.test('UnixError: message', () => {
	assertEquals(
		(
			assertThrows(
				() => UnixError.throwMeNoLogging(42),
			) as UnixError
		).message,
		'',
	);
	assertEquals(
		(
			assertThrows(
				() => UnixError.throwMe(42),
			) as UnixError
		).message,
		'UNIX error exception: 42',
	);
	assertEquals(
		Reflect.construct(UnixError, [{ errno: 42 }]).message,
		'UNIX errno exception: 42',
	);
});

Deno.test('UnixError: osStatus', () => {
	assertEquals(UnixError.make(0).osStatus(), errSecErrnoBase);
	assertEquals(UnixError.make(1).osStatus(), errSecErrnoBase + 1);
});

Deno.test('UnixError: unixError', () => {
	assertEquals(UnixError.make(0).unixError(), 0);
	assertEquals(UnixError.make(1).unixError(), 1);
});

Deno.test('UnixError: what', () => {
	const err = UnixError.make(42);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('UnixError: check', () => {
	UnixError.check(1, { errno: 42 });
	UnixError.check(0, { errno: 42 });
	assertThrows(
		() => UnixError.check(-1, { errno: 42 }),
		UnixError as never,
		'UNIX error exception: 42',
	);
	UnixError.check(-2, { errno: 42 });
});

Deno.test('UnixError: throwMe + throwMeNoLogging', () => {
	assertThrows(
		() => UnixError.throwMe(42),
		UnixError as never,
		'UNIX error exception: 42',
	);
	assertThrows(
		() => UnixError.throwMe({ errno: 42 }),
		UnixError as never,
		'UNIX error exception: 42',
	);
});

Deno.test('UnixError: throwMeNoLogging', () => {
	assertThrows(
		() => UnixError.throwMeNoLogging(42),
		UnixError as never,
		'',
	);
	assertThrows(
		() => UnixError.throwMeNoLogging({ errno: 42 }),
		UnixError as never,
		'',
	);
});

Deno.test('UnixError: make', () => {
	assertEquals(UnixError.make(42).error, 42);
	assertEquals(UnixError.make({ errno: 42 }).error, 42);
});

Deno.test('UnixError: isUnixError', () => {
	assertEquals(UnixError.isUnixError(UnixError.make(42)), true);
	assertEquals(UnixError.isUnixError(new MyCommonError()), false);
	assertEquals(UnixError.isUnixError(new Error()), false);
	assertEquals(UnixError.isUnixError({}), false);
	assertEquals(UnixError.isUnixError(null), false);
	assertEquals(UnixError.isUnixError(undefined), false);
	assertEquals(UnixError.isUnixError(0), false);
	assertEquals(CommonError.isCommonError(UnixError.make(42)), true);
	assertEquals(UnixError.isCommonError(UnixError.make(42)), true);
});

Deno.test('MacOSError: instanceof', () => {
	assertInstanceOf(MacOSError.make(42), Error);
	assertInstanceOf(MacOSError.make(42), CommonError as never);
});

Deno.test('MacOSError: message', () => {
	const err = MacOSError.make(42);
	assertEquals(err.message, 'MacOS error: 42');
});

Deno.test('MacOSError: osStatus', () => {
	assertEquals(MacOSError.make(0).osStatus(), 0);
	assertEquals(MacOSError.make(1).osStatus(), 1);
	assertEquals(
		MacOSError.make(errSecErrnoBase - 1).osStatus(),
		errSecErrnoBase - 1,
	);
	assertEquals(
		MacOSError.make(errSecErrnoBase).osStatus(),
		errSecErrnoBase,
	);
	assertEquals(
		MacOSError.make(errSecErrnoLimit).osStatus(),
		errSecErrnoLimit,
	);
	assertEquals(
		MacOSError.make(errSecErrnoLimit + 1).osStatus(),
		errSecErrnoLimit + 1,
	);
});

Deno.test('MacOSError: unixError', () => {
	assertEquals(MacOSError.make(0).unixError(), -1);
	assertEquals(MacOSError.make(1).unixError(), -1);
	assertEquals(MacOSError.make(errSecErrnoBase - 1).unixError(), -1);
	assertEquals(MacOSError.make(errSecErrnoBase).unixError(), 0);
	assertEquals(
		MacOSError.make(errSecErrnoLimit).unixError(),
		errSecErrnoLimit - errSecErrnoBase,
	);
	assertEquals(MacOSError.make(errSecErrnoLimit + 1).unixError(), -1);
});

Deno.test('MacOSError: what', () => {
	const err = MacOSError.make(42);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('MacOSError: check', () => {
	MacOSError.check(errSecSuccess);
	assertThrows(
		() => MacOSError.check(errSecUnimplemented),
		MacOSError as never,
		`MacOS error: ${errSecUnimplemented}`,
	);
});

Deno.test('MacOSError: throwMe', () => {
	assertThrows(
		() => MacOSError.throwMe(42),
		MacOSError as never,
		`MacOS error: 42`,
	);
});

Deno.test('MacOSError: make', () => {
	assertEquals(MacOSError.make(42).error, 42);
});

Deno.test('MacOSError: isMacOSError', () => {
	assertEquals(MacOSError.isMacOSError(MacOSError.make(42)), true);
	assertEquals(MacOSError.isMacOSError(new MyCommonError()), false);
	assertEquals(MacOSError.isMacOSError(new Error()), false);
	assertEquals(MacOSError.isMacOSError({}), false);
	assertEquals(MacOSError.isMacOSError(null), false);
	assertEquals(MacOSError.isMacOSError(undefined), false);
	assertEquals(MacOSError.isMacOSError(0), false);
	assertEquals(CommonError.isCommonError(MacOSError.make(42)), true);
	assertEquals(MacOSError.isCommonError(MacOSError.make(42)), true);
});

Deno.test('CFError: instanceof', () => {
	assertInstanceOf(cfError(), Error);
	assertInstanceOf(cfError(), CommonError as never);
});

Deno.test('CFError: message', () => {
	assertEquals(cfError().message, 'CoreFoundation error');
});

Deno.test('CFError: osStatus', () => {
	assertEquals(cfError().osStatus(), errSecCoreFoundationUnknown);
});

Deno.test('CFError: unixError', () => {
	assertEquals(cfError().unixError(), EFAULT);
});

Deno.test('CFError: what', () => {
	const err = cfError();
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('CFError: check', () => {
	CFError.check(1);
	assertThrows(
		() => CFError.check(null),
		CFError as never,
		'CoreFoundation error',
	);
});

Deno.test('CFError: isCFError', () => {
	assertEquals(CFError.isCFError(cfError()), true);
	assertEquals(CFError.isCFError(new MyCommonError()), false);
	assertEquals(CFError.isCFError(new Error()), false);
	assertEquals(CFError.isCFError({}), false);
	assertEquals(CFError.isCFError(null), false);
	assertEquals(CFError.isCFError(undefined), false);
	assertEquals(CFError.isCFError(0), false);
	assertEquals(CommonError.isCommonError(cfError()), true);
	assertEquals(CFError.isCommonError(cfError()), true);
});
