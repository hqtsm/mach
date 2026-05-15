import { assertEquals } from '@std/assert';
import { Uint8Ptr } from '@hqtsm/struct';
import { unhex } from '../spec/hex.ts';
import {
	SecIsAppleTrustAnchor,
	SecIsAppleTrustAnchorData,
} from './SecAppleAnchor.ts';
import { __SecCertificate } from '../sec/SecCertificate.ts';

const AppleRootCAHash =
	'b0b1730ecbc7ff4505142c49f1295e6eda6bcaed7e2c68c5be91b5a11001f024';

Deno.test('SecIsAppleTrustAnchor', async () => {
	const sc = new __SecCertificate();
	assertEquals(await SecIsAppleTrustAnchor(sc, 0), false);

	sc._der.data = new Uint8Ptr(new ArrayBuffer(100));
	sc._der.length = 100;
	assertEquals(
		await SecIsAppleTrustAnchor(sc, 0, {
			/**
			 * Return specific hash.
			 *
			 * @returns Promise.
			 */
			digest(): Promise<ArrayBuffer> {
				return Promise.resolve(unhex(AppleRootCAHash).buffer);
			},
		}),
		true,
	);
});

Deno.test('SecIsAppleTrustAnchorData', () => {
	assertEquals(SecIsAppleTrustAnchorData(new ArrayBuffer(), 0), false);
	assertEquals(SecIsAppleTrustAnchorData(new ArrayBuffer(32), 0), false);
	assertEquals(SecIsAppleTrustAnchorData(unhex(AppleRootCAHash), 0), true);
});
