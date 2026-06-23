import { assertEquals } from '@std/assert';
import { pointerBytes } from '../../helpers/memory.ts';
import {
	SecCertificateCreateOidDataFromString,
} from '../../sec/SecCertificate.ts';
import * as C from './drmaker.ts';

const entries = <T extends Record<string, unknown>>(obj: T) =>
	Object.entries(obj) as [keyof T, T[keyof T]][];

const oids = {
	Security_CodeSigning_adcSdkMarkerOID: '1.2.840.113635.100.6.2.1',
	Security_CodeSigning_devIdSdkMarkerOID: '1.2.840.113635.100.6.2.6',
	Security_CodeSigning_devIdLeafMarkerOID: '1.2.840.113635.100.6.1.13',
};

Deno.test('Security_CodeSigning: OIDs', () => {
	// Check OIDs against their expected values.
	for (const [K, V] of entries(oids)) {
		const cssmd = C[K];
		assertEquals(
			pointerBytes(cssmd.Data!.buffer, cssmd.Length),
			SecCertificateCreateOidDataFromString(V),
			K,
		);
	}
});
