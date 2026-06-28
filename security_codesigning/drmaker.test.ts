import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals } from '@std/assert';
import { pointerBytes } from '../helpers/mod.ts';
import { SecCertificateCreateOidDataFromString } from '../Security/mod.ts';
import {
	__SecCertificate,
	SecCertificateExtension,
} from '../Security/SecCertificate.ts';
import { fixtureCert, unhex } from '../spec/mod.ts';
import { Security_CodeSigning_DRMaker } from './drmaker.ts';
import * as C from './drmaker.ts';
import { Security_CodeSigning_Requirement_Context } from './requirement.ts';

const entries = <T extends Record<string, unknown>>(obj: T) =>
	Object.entries(obj) as [keyof T, T[keyof T]][];

const oids = {
	Security_CodeSigning_adcSdkMarkerOID: '1.2.840.113635.100.6.2.1',
	Security_CodeSigning_devIdSdkMarkerOID: '1.2.840.113635.100.6.2.6',
	Security_CodeSigning_devIdLeafMarkerOID: '1.2.840.113635.100.6.1.13',
};

async function appleCA(): Promise<__SecCertificate> {
	const data = await fixtureCert('AppleIncRootCertificate.cer');
	const cert = new __SecCertificate();
	cert._der.data = new Uint8Ptr(data.buffer, data.byteOffset);
	cert._der.length = data.byteLength;
	return cert;
}

function iOSCert(): __SecCertificate {
	const cert = new __SecCertificate();
	const exts = [];
	{
		const ext = new SecCertificateExtension();
		const extnID = unhex('2A 86 48 86 F7 63 64 06 02 01');
		ext.extnID.data = new Uint8Ptr(extnID.buffer);
		ext.extnID.length = extnID.byteLength;
		const extnValue = new Uint8Array();
		ext.extnValue.data = new Uint8Ptr(extnValue.buffer);
		ext.extnValue.length = extnValue.byteLength;
		exts.push(ext);
	}
	cert._extensions = exts;
	cert._extensionCount = exts.length;
	return cert;
}

function devCert(): __SecCertificate {
	const cert = new __SecCertificate();
	const exts = [];
	{
		const ext = new SecCertificateExtension();
		const extnID = unhex('2A 86 48 86 F7 63 64 06 02 06');
		ext.extnID.data = new Uint8Ptr(extnID.buffer);
		ext.extnID.length = extnID.byteLength;
		const extnValue = new Uint8Array();
		ext.extnValue.data = new Uint8Ptr(extnValue.buffer);
		ext.extnValue.length = extnValue.byteLength;
		exts.push(ext);
	}
	cert._extensions = exts;
	cert._extensionCount = exts.length;
	return cert;
}

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

Deno.test('Security_CodeSigning: isIOSSignature', async () => {
	const ctx = new Security_CodeSigning_Requirement_Context();
	ctx.certs = [
		new __SecCertificate(),
		iOSCert(),
		await appleCA(),
	];
	assertEquals(
		Security_CodeSigning_DRMaker['isIOSSignature'](
			new Security_CodeSigning_DRMaker(ctx),
		),
		true,
	);
	ctx.certs[1] = devCert();
	assertEquals(
		Security_CodeSigning_DRMaker['isIOSSignature'](
			new Security_CodeSigning_DRMaker(ctx),
		),
		false,
	);
});

Deno.test('Security_CodeSigning: isDeveloperIDSignature', async () => {
	const ctx = new Security_CodeSigning_Requirement_Context();
	ctx.certs = [
		new __SecCertificate(),
		devCert(),
		await appleCA(),
	];
	assertEquals(
		Security_CodeSigning_DRMaker['isDeveloperIDSignature'](
			new Security_CodeSigning_DRMaker(ctx),
		),
		true,
	);
	ctx.certs[1] = iOSCert();
	assertEquals(
		Security_CodeSigning_DRMaker['isDeveloperIDSignature'](
			new Security_CodeSigning_DRMaker(ctx),
		),
		false,
	);
});

Deno.test('Security_CodeSigning: make: null', async () => {
	const ctx = new Security_CodeSigning_Requirement_Context();
	const maker = new Security_CodeSigning_DRMaker(ctx);
	const dr = await Security_CodeSigning_DRMaker.make(maker);
	assertEquals(dr, null);
});
