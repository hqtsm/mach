import { Uint8Ptr } from '@hqtsm/struct';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { pointerBytes } from '../helpers/mod.ts';
import { SecCertificateCreateOidDataFromString } from '../Security/mod.ts';
import {
	__SecCertificate,
	SecCertificateExtension,
} from '../Security/SecCertificate.ts';
import { fixtureCert, unhex } from '../spec/mod.ts';
import { Security_CodeSigning_DRMaker } from './drmaker.ts';
import * as C from './drmaker.ts';
import {
	Security_CodeSigning_Requirement,
	Security_CodeSigning_Requirement_Context,
} from './requirement.ts';

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

function aCert(): __SecCertificate {
	const cert = new __SecCertificate();
	cert._extensions = [];
	cert._extensionCount = 0;
	return cert;
}

function aIOSCert(): __SecCertificate {
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

function aDevCert(): __SecCertificate {
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

function commonCert(): __SecCertificate {
	const cert = new __SecCertificate();
	const subject = unhex(
		'30 10 31 0E 30 0C 06 03 55 04 03 13 05 41 6C 70 68 61',
	);
	cert._subject.data = new Uint8Ptr(subject.buffer);
	cert._subject.length = subject.byteLength;
	return cert;
}

function orgCert(): __SecCertificate {
	const cert = new __SecCertificate();
	const subject = unhex(
		'30 0E 31 0C 30 0A 06 03 55 04 0B 13 03 42 65 74 61',
	);
	cert._subject.data = new Uint8Ptr(subject.buffer);
	cert._subject.length = subject.byteLength;
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
		aIOSCert(),
		await appleCA(),
	];
	assertEquals(
		Security_CodeSigning_DRMaker['isIOSSignature'](
			new Security_CodeSigning_DRMaker(ctx),
		),
		true,
	);
	ctx.certs[1] = aDevCert();
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
		aDevCert(),
		await appleCA(),
	];
	assertEquals(
		Security_CodeSigning_DRMaker['isDeveloperIDSignature'](
			new Security_CodeSigning_DRMaker(ctx),
		),
		true,
	);
	ctx.certs[1] = aIOSCert();
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

Deno.test('Security_CodeSigning: make: Apple: IOS', async () => {
	const ctx = new Security_CodeSigning_Requirement_Context();
	ctx.certs = [
		commonCert(),
		aIOSCert(),
		await appleCA(),
	];

	const maker = new Security_CodeSigning_DRMaker(ctx);
	const dr = await Security_CodeSigning_DRMaker.make(maker);
	assertInstanceOf(dr, Security_CodeSigning_Requirement);
});

Deno.test('Security_CodeSigning: make: Apple: DID', async () => {
	const ctx = new Security_CodeSigning_Requirement_Context();
	ctx.certs = [
		orgCert(),
		aDevCert(),
		await appleCA(),
	];

	const maker = new Security_CodeSigning_DRMaker(ctx);
	const dr = await Security_CodeSigning_DRMaker.make(maker);
	assertInstanceOf(dr, Security_CodeSigning_Requirement);
});

Deno.test('Security_CodeSigning: make: Apple: Other', async () => {
	const ctx = new Security_CodeSigning_Requirement_Context();
	ctx.certs = [
		orgCert(),
		aCert(),
		await appleCA(),
	];

	const maker = new Security_CodeSigning_DRMaker(ctx);
	const dr = await Security_CodeSigning_DRMaker.make(maker);
	assertInstanceOf(dr, Security_CodeSigning_Requirement);
});
