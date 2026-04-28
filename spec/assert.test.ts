import { CFError, MacOSError, UnixError } from '../Security/errors.ts';
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
		UnixError.throwMe(42);
	}, 42);
});

Deno.test('assertThrowsUnixError', () => {
	assertThrowsUnixError(() => {
		UnixError.throwMe(42);
	}, 42);
});

Deno.test('assertRejectsMacOSError', async () => {
	// deno-lint-ignore require-await
	await assertRejectsMacOSError(async () => {
		MacOSError.throwMe(42);
	}, 42);
});

Deno.test('assertThrowsMacOSError', () => {
	assertThrowsMacOSError(() => {
		MacOSError.throwMe(42);
	}, 42);
});

Deno.test('assertRejectsCFError', async () => {
	// deno-lint-ignore require-await
	await assertRejectsCFError(async () => {
		CFError.throwMe();
	});
});

Deno.test('assertThrowsCFError', () => {
	assertThrowsCFError(() => {
		CFError.throwMe();
	});
});
