import { assertEquals } from '@std/assert';
import { unhex } from '../spec/hex.ts';
import {
	SecIsAppleTrustAnchor,
	SecIsAppleTrustAnchorData,
} from './SecAppleAnchor.ts';
import { __SecCertificate } from '../sec/SecCertificate.ts';

const AppleRootCAHash =
	'b0b1730ecbc7ff4505142c49f1295e6eda6bcaed7e2c68c5be91b5a11001f024';

Deno.test('SecIsAppleTrustAnchorData', () => {
	assertEquals(SecIsAppleTrustAnchorData(new ArrayBuffer(), 0), false);
	assertEquals(SecIsAppleTrustAnchorData(new ArrayBuffer(32), 0), false);
	assertEquals(SecIsAppleTrustAnchorData(unhex(AppleRootCAHash), 0), true);
});

Deno.test('SecIsAppleTrustAnchor', async () => {
	assertEquals(await SecIsAppleTrustAnchor(new __SecCertificate(), 0), false);
	assertEquals(
		await SecIsAppleTrustAnchor(
			Object.assign(new __SecCertificate(), {
				_der: new ArrayBuffer(100),
			}),
			0,
			{
				/**
				 * Return specific hash.
				 *
				 * @returns Promise.
				 */
				digest(): Promise<ArrayBuffer> {
					return Promise.resolve(unhex(AppleRootCAHash).buffer);
				},
			},
		),
		true,
	);
});
