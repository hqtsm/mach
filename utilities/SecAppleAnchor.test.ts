import { assertEquals } from '@std/assert';
import { unhex } from '../spec/hex.ts';
import { SecIsAppleTrustAnchorData } from './SecAppleAnchor.ts';

const AppleRootCAHash =
	'b0b1730ecbc7ff4505142c49f1295e6eda6bcaed7e2c68c5be91b5a11001f024';

Deno.test('SecIsAppleTrustAnchorData', () => {
	assertEquals(SecIsAppleTrustAnchorData(new ArrayBuffer(), 0), false);
	assertEquals(SecIsAppleTrustAnchorData(new ArrayBuffer(32), 0), false);
	assertEquals(SecIsAppleTrustAnchorData(unhex(AppleRootCAHash), 0), true);
});
