import type { bool } from '../libc/c.ts';

/**
 * Are QARoot certificates enabled.
 *
 * @returns Always false.
 */
export function SecAreQARootCertificatesEnabled(): bool {
	return false;
}

/**
 * Is an internal release.
 *
 * @returns Always false.
 */
export function SecIsInternalRelease(): bool {
	return false;
}
