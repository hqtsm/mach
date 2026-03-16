import { assertEquals } from '@std/assert';
import {
	kSecCSApplyEmbeddedPolicy,
	kSecCSCheckTrustedAnchors,
	kSecCSConsiderExpiration,
	kSecCSEnforceRevocationChecks,
	kSecCSMatchGuestRequirementInKernel,
	kSecCSNoNetworkAccess,
	kSecCSQuickCheck,
	kSecCSReportProgress,
	kSecCSStripDisallowedXattrs,
} from './CSCommon.ts';

Deno.test('constant expressions', () => {
	assertEquals(kSecCSConsiderExpiration, (1 << 31) >>> 0);
	assertEquals(kSecCSEnforceRevocationChecks, 1 << 30);
	assertEquals(kSecCSNoNetworkAccess, 1 << 29);
	assertEquals(kSecCSReportProgress, 1 << 28);
	assertEquals(kSecCSCheckTrustedAnchors, 1 << 27);
	assertEquals(kSecCSQuickCheck, 1 << 26);
	assertEquals(kSecCSApplyEmbeddedPolicy, 1 << 25);
	assertEquals(kSecCSStripDisallowedXattrs, 1 << 24);
	assertEquals(kSecCSMatchGuestRequirementInKernel, 1 << 23);
});
