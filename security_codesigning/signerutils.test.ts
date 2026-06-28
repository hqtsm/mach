import { assertEquals, assertInstanceOf } from '@std/assert';
import { Uint8Ptr } from '@hqtsm/struct';
import { __SecCertificate } from '../Security/SecCertificate.ts';
import { unhex } from '../spec/mod.ts';
import {
	Security_CodeSigning_Requirement_Context,
	Security_CodeSigning_Requirements,
	Security_CodeSigning_Requirements_Maker,
} from './requirement.ts';
import { Security_CodeSigning_InternalRequirements } from './signerutils.ts';

function nonACert(): __SecCertificate {
	const cert = new __SecCertificate();
	const subject = unhex(
		'31 0E 30 0C 06 03 55 04 0A 13 05 41 6C 70 68 61',
	);
	cert._subject.data = new Uint8Ptr(subject.buffer);
	cert._subject.length = subject.byteLength;
	cert._der.data = new Uint8Ptr(new ArrayBuffer(0));
	return cert;
}

Deno.test('Security_CodeSigning_InternalRequirements', async () => {
	const ir = new Security_CodeSigning_InternalRequirements();
	assertEquals(Security_CodeSigning_InternalRequirements.getReqs(ir), null);

	const given = Security_CodeSigning_Requirements_Maker.make(
		new Security_CodeSigning_Requirements_Maker(),
	);
	const defaulted = Security_CodeSigning_Requirements_Maker.make(
		new Security_CodeSigning_Requirements_Maker(),
	);
	const ctx = new Security_CodeSigning_Requirement_Context();
	ctx.certs = [
		nonACert(),
	];

	await Security_CodeSigning_InternalRequirements.makeReqs(
		ir,
		given,
		defaulted,
		ctx,
	);
	assertInstanceOf(
		Security_CodeSigning_InternalRequirements.getReqs(ir),
		Security_CodeSigning_Requirements,
	);
});
