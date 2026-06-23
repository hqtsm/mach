import {
	assertEquals,
	assertGreater,
	assertInstanceOf,
	assertThrows,
} from '@std/assert';
import {
	errSecErrnoBase,
	errSecErrnoLimit,
	Security_CFError,
	Security_CommonError,
	Security_MacOSError,
	Security_UnixError,
} from './errors.ts';
import {
	errSecCoreFoundationUnknown,
	errSecSuccess,
	errSecUnimplemented,
} from './SecBase.ts';
import { EFAULT } from '../libc/errno.ts';

class MyCommonError extends Security_CommonError {
	constructor() {
		super();
	}
}

const cfError = (): Security_CFError => {
	let r: Security_CFError;
	try {
		Security_CFError.throwMe();
	} catch (e) {
		r = e as Security_CFError;
	}
	return r;
};

Deno.test('Security_CommonError: instanceof', () => {
	assertInstanceOf(new MyCommonError(), Error);
});

Deno.test('Security_CommonError: message', () => {
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

Deno.test('Security_CommonError: osStatus', () => {
	const err = new MyCommonError();
	assertEquals(err.osStatus(), 0);
});

Deno.test('Security_CommonError: unixError', () => {
	const err = new MyCommonError();
	assertEquals(err.unixError(), 0);
});

Deno.test('Security_CommonError: isCommonError', () => {
	assertEquals(Security_CommonError.isCommonError(new MyCommonError()), true);
	assertEquals(Security_CommonError.isCommonError(new Error()), false);
	assertEquals(Security_CommonError.isCommonError({}), false);
	assertEquals(Security_CommonError.isCommonError(null), false);
	assertEquals(Security_CommonError.isCommonError(undefined), false);
	assertEquals(Security_CommonError.isCommonError(0), false);
});

Deno.test('Security_CommonError: throw', () => {
	assertThrows(
		() => {
			throw new MyCommonError();
		},
		MyCommonError,
		'',
	);
});

Deno.test('Security_UnixError: instanceof', () => {
	assertInstanceOf(Security_UnixError.make(42), Error);
	assertInstanceOf(
		Security_UnixError.make(42),
		Security_CommonError as never,
	);
});

Deno.test('Security_UnixError: message', () => {
	assertEquals(
		(
			assertThrows(
				() => Security_UnixError.throwMeNoLogging(42),
			) as Security_UnixError
		).message,
		'',
	);
	assertEquals(
		(
			assertThrows(
				() => Security_UnixError.throwMe(42),
			) as Security_UnixError
		).message,
		'UNIX error exception: 42',
	);
	assertEquals(
		Reflect.construct(Security_UnixError, [{ errno: 42 }]).message,
		'UNIX errno exception: 42',
	);
});

Deno.test('Security_UnixError: osStatus', () => {
	assertEquals(Security_UnixError.make(0).osStatus(), errSecErrnoBase);
	assertEquals(Security_UnixError.make(1).osStatus(), errSecErrnoBase + 1);
});

Deno.test('Security_UnixError: unixError', () => {
	assertEquals(Security_UnixError.make(0).unixError(), 0);
	assertEquals(Security_UnixError.make(1).unixError(), 1);
});

Deno.test('Security_UnixError: what', () => {
	const err = Security_UnixError.make(42);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('Security_UnixError: check', () => {
	Security_UnixError.check(1, { errno: 42 });
	Security_UnixError.check(0, { errno: 42 });
	assertThrows(
		() => Security_UnixError.check(-1, { errno: 42 }),
		Security_UnixError as never,
		'UNIX error exception: 42',
	);
	Security_UnixError.check(-2, { errno: 42 });
});

Deno.test('Security_UnixError: throwMe + throwMeNoLogging', () => {
	assertThrows(
		() => Security_UnixError.throwMe(42),
		Security_UnixError as never,
		'UNIX error exception: 42',
	);
	assertThrows(
		() => Security_UnixError.throwMe({ errno: 42 }),
		Security_UnixError as never,
		'UNIX error exception: 42',
	);
});

Deno.test('Security_UnixError: throwMeNoLogging', () => {
	assertThrows(
		() => Security_UnixError.throwMeNoLogging(42),
		Security_UnixError as never,
		'',
	);
	assertThrows(
		() => Security_UnixError.throwMeNoLogging({ errno: 42 }),
		Security_UnixError as never,
		'',
	);
});

Deno.test('Security_UnixError: make', () => {
	assertEquals(Security_UnixError.make(42).error, 42);
	assertEquals(Security_UnixError.make({ errno: 42 }).error, 42);
});

Deno.test('Security_UnixError: isUnixError', () => {
	assertEquals(
		Security_UnixError.isUnixError(Security_UnixError.make(42)),
		true,
	);
	assertEquals(Security_UnixError.isUnixError(new MyCommonError()), false);
	assertEquals(Security_UnixError.isUnixError(new Error()), false);
	assertEquals(Security_UnixError.isUnixError({}), false);
	assertEquals(Security_UnixError.isUnixError(null), false);
	assertEquals(Security_UnixError.isUnixError(undefined), false);
	assertEquals(Security_UnixError.isUnixError(0), false);
	assertEquals(
		Security_CommonError.isCommonError(Security_UnixError.make(42)),
		true,
	);
	assertEquals(
		Security_UnixError.isCommonError(Security_UnixError.make(42)),
		true,
	);
});

Deno.test('Security_MacOSError: instanceof', () => {
	assertInstanceOf(Security_MacOSError.make(42), Error);
	assertInstanceOf(
		Security_MacOSError.make(42),
		Security_CommonError as never,
	);
});

Deno.test('Security_MacOSError: message', () => {
	const err = Security_MacOSError.make(42);
	assertEquals(err.message, 'MacOS error: 42');
});

Deno.test('Security_MacOSError: osStatus', () => {
	assertEquals(Security_MacOSError.make(0).osStatus(), 0);
	assertEquals(Security_MacOSError.make(1).osStatus(), 1);
	assertEquals(
		Security_MacOSError.make(errSecErrnoBase - 1).osStatus(),
		errSecErrnoBase - 1,
	);
	assertEquals(
		Security_MacOSError.make(errSecErrnoBase).osStatus(),
		errSecErrnoBase,
	);
	assertEquals(
		Security_MacOSError.make(errSecErrnoLimit).osStatus(),
		errSecErrnoLimit,
	);
	assertEquals(
		Security_MacOSError.make(errSecErrnoLimit + 1).osStatus(),
		errSecErrnoLimit + 1,
	);
});

Deno.test('Security_MacOSError: unixError', () => {
	assertEquals(Security_MacOSError.make(0).unixError(), -1);
	assertEquals(Security_MacOSError.make(1).unixError(), -1);
	assertEquals(Security_MacOSError.make(errSecErrnoBase - 1).unixError(), -1);
	assertEquals(Security_MacOSError.make(errSecErrnoBase).unixError(), 0);
	assertEquals(
		Security_MacOSError.make(errSecErrnoLimit).unixError(),
		errSecErrnoLimit - errSecErrnoBase,
	);
	assertEquals(
		Security_MacOSError.make(errSecErrnoLimit + 1).unixError(),
		-1,
	);
});

Deno.test('Security_MacOSError: what', () => {
	const err = Security_MacOSError.make(42);
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('Security_MacOSError: check', () => {
	Security_MacOSError.check(errSecSuccess);
	assertThrows(
		() => Security_MacOSError.check(errSecUnimplemented),
		Security_MacOSError as never,
		`MacOS error: ${errSecUnimplemented}`,
	);
});

Deno.test('Security_MacOSError: throwMe', () => {
	assertThrows(
		() => Security_MacOSError.throwMe(42),
		Security_MacOSError as never,
		`MacOS error: 42`,
	);
});

Deno.test('Security_MacOSError: make', () => {
	assertEquals(Security_MacOSError.make(42).error, 42);
});

Deno.test('Security_MacOSError: isMacOSError', () => {
	assertEquals(
		Security_MacOSError.isMacOSError(Security_MacOSError.make(42)),
		true,
	);
	assertEquals(Security_MacOSError.isMacOSError(new MyCommonError()), false);
	assertEquals(Security_MacOSError.isMacOSError(new Error()), false);
	assertEquals(Security_MacOSError.isMacOSError({}), false);
	assertEquals(Security_MacOSError.isMacOSError(null), false);
	assertEquals(Security_MacOSError.isMacOSError(undefined), false);
	assertEquals(Security_MacOSError.isMacOSError(0), false);
	assertEquals(
		Security_CommonError.isCommonError(Security_MacOSError.make(42)),
		true,
	);
	assertEquals(
		Security_MacOSError.isCommonError(Security_MacOSError.make(42)),
		true,
	);
});

Deno.test('Security_CFError: instanceof', () => {
	assertInstanceOf(cfError(), Error);
	assertInstanceOf(cfError(), Security_CommonError as never);
});

Deno.test('Security_CFError: message', () => {
	assertEquals(cfError().message, 'CoreFoundation error');
});

Deno.test('Security_CFError: osStatus', () => {
	assertEquals(cfError().osStatus(), errSecCoreFoundationUnknown);
});

Deno.test('Security_CFError: unixError', () => {
	assertEquals(cfError().unixError(), EFAULT);
});

Deno.test('Security_CFError: what', () => {
	const err = cfError();
	assertEquals(err.what(), err.whatBuffer);
});

Deno.test('Security_CFError: check', () => {
	Security_CFError.check(1);
	assertThrows(
		() => Security_CFError.check(null),
		Security_CFError as never,
		'CoreFoundation error',
	);
});

Deno.test('Security_CFError: isCFError', () => {
	assertEquals(Security_CFError.isCFError(cfError()), true);
	assertEquals(Security_CFError.isCFError(new MyCommonError()), false);
	assertEquals(Security_CFError.isCFError(new Error()), false);
	assertEquals(Security_CFError.isCFError({}), false);
	assertEquals(Security_CFError.isCFError(null), false);
	assertEquals(Security_CFError.isCFError(undefined), false);
	assertEquals(Security_CFError.isCFError(0), false);
	assertEquals(Security_CommonError.isCommonError(cfError()), true);
	assertEquals(Security_CFError.isCommonError(cfError()), true);
});
