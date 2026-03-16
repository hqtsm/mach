export const PAGE_SIZE = 0x4000;

// Opcodes exprForm:
export const opFlagMask = 0xff000000;
export const opGenericFalse = 0x80000000;
export const opGenericSkip = 0x40000000;

// ExprOp:
export const opFalse = 0;
export const opTrue = 1;
export const opIdent = 2;
export const opAppleAnchor = 3;
export const opAnchorHash = 4;
export const opInfoKeyValue = 5;
export const opAnd = 6;
export const opOr = 7;
export const opCDHash = 8;
export const opNot = 9;
export const opInfoKeyField = 10;
export const opCertField = 11;
export const opTrustedCert = 12;
export const opTrustedCerts = 13;
export const opCertGeneric = 14;
export const opAppleGenericAnchor = 15;
export const opEntitlementField = 16;
export const opCertPolicy = 17;
export const opNamedAnchor = 18;
export const opNamedCode = 19;
export const opPlatform = 20;
export const opNotarized = 21;
export const opCertFieldDate = 22;
export const opLegacyDevID = 23;
export const exprOpCount = 24;

// MatchOperation:
export const matchExists = 0;
export const matchEqual = 1;
export const matchContains = 2;
export const matchBeginsWith = 3;
export const matchEndsWith = 4;
export const matchLessThan = 5;
export const matchGreaterThan = 6;
export const matchLessEqual = 7;
export const matchGreaterEqual = 8;
export const matchOn = 9;
export const matchBefore = 10;
export const matchAfter = 11;
export const matchOnOrBefore = 12;
export const matchOnOrAfter = 13;
export const matchAbsent = 14;

/**
 * Maximum number of architectures fat binaries can have.
 */
export const MAX_ARCH_COUNT = 100;

/**
 * Maximum power of 2 a Mach-O can have.
 */
export const MAX_ALIGN = 30;
