import type { _const, bool } from '../libc/mod.ts';
import type { DERItem } from './DERItem.ts';
import { DERMemcmp } from './libDER_config.ts';

/**
 * Compare two DER OIDs.
 *
 * @param oid1 OID 1.
 * @param oid2 OID 2.
 * @returns True if equal, else false.
 */
export function DEROidCompare(
	oid1: _const<DERItem> | null,
	oid2: _const<DERItem> | null,
): bool {
	if (!oid1 || !oid2) {
		return false;
	}
	if (oid1.length !== oid2.length) {
		return false;
	}
	return !DERMemcmp(oid1.data!, oid2.data!, oid1.length);
}
