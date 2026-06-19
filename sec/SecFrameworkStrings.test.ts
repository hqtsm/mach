import { assertEquals } from '@std/assert';
import { SecCopyCertString, SecCopyCKString } from './SecFrameworkStrings.ts';

Deno.test('SecCopyCertString', () => {
	assertEquals(SecCopyCertString('key'), 'key');
});

Deno.test('SecCopyCKString', () => {
	assertEquals(SecCopyCKString('key'), 'key');
});
