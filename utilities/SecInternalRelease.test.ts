import { assertEquals } from '@std/assert';
import {
	SecAreQARootCertificatesEnabled,
	SecIsInternalRelease,
} from './SecInternalRelease.ts';

Deno.test('SecIsInternalRelease', () => {
	assertEquals(SecIsInternalRelease(), false);
});

Deno.test('SecAreQARootCertificatesEnabled', () => {
	assertEquals(SecAreQARootCertificatesEnabled(), false);
});
