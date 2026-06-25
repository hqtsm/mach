import {
	Security_CFError,
	Security_MacOSError,
	Security_UnixError,
} from '../security_utilities/errors.ts';
import {
	assertRejectsCFError,
	assertRejectsMacOSError,
	assertRejectsUnixError,
	assertThrowsCFError,
	assertThrowsMacOSError,
	assertThrowsUnixError,
} from './assert.ts';

Deno.test('assertRejectsUnixError', async () => {
	// deno-lint-ignore require-await
	await assertRejectsUnixError(async () => {
		Security_UnixError.throwMe(42);
	}, 42);
});

Deno.test('assertThrowsUnixError', () => {
	assertThrowsUnixError(() => {
		Security_UnixError.throwMe(42);
	}, 42);
});

Deno.test('assertRejectsMacOSError', async () => {
	// deno-lint-ignore require-await
	await assertRejectsMacOSError(async () => {
		Security_MacOSError.throwMe(42);
	}, 42);
});

Deno.test('assertThrowsMacOSError', () => {
	assertThrowsMacOSError(() => {
		Security_MacOSError.throwMe(42);
	}, 42);
});

Deno.test('assertRejectsCFError', async () => {
	// deno-lint-ignore require-await
	await assertRejectsCFError(async () => {
		Security_CFError.throwMe();
	});
});

Deno.test('assertThrowsCFError', () => {
	assertThrowsCFError(() => {
		Security_CFError.throwMe();
	});
});
