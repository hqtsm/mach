import {
	assertEquals,
	assertGreater,
	assertInstanceOf,
	assertThrows,
} from '@std/assert';
import { CommonError } from './commonerror.ts';

Deno.test('instanceof', () => {
	assertInstanceOf(new CommonError(), Error);
});

Deno.test('message', () => {
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

Deno.test('osStatus', () => {
	const err = new CommonError();
	assertEquals(err.osStatus(), 0);
});

Deno.test('unixError', () => {
	const err = new CommonError();
	assertEquals(err.unixError(), 0);
});

Deno.test('isCommonError', () => {
	assertEquals(CommonError.isCommonError(new CommonError()), true);
	assertEquals(CommonError.isCommonError(new Error()), false);
	assertEquals(CommonError.isCommonError({}), false);
	assertEquals(CommonError.isCommonError(null), false);
	assertEquals(CommonError.isCommonError(undefined), false);
	assertEquals(CommonError.isCommonError(0), false);
});

Deno.test('throw', () => {
	assertThrows(
		() => {
			throw new CommonError();
		},
		CommonError,
		'',
	);
});
