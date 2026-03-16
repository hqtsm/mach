export const PAGE_SIZE = 0x4000;

// SecCSDigestAlgorithm:
export const kSecCodeSignatureNoHash = 0;
export const kSecCodeSignatureHashSHA1 = 1;
export const kSecCodeSignatureHashSHA256 = 2;
export const kSecCodeSignatureHashSHA256Truncated = 3;
export const kSecCodeSignatureHashSHA384 = 4;
export const kSecCodeSignatureHashSHA512 = 5;

// SecCodeSignatureFlags:
export const kSecCodeSignatureHost = 0x0001;
export const kSecCodeSignatureAdhoc = 0x0002;
export const kSecCodeSignatureForceHard = 0x0100;
export const kSecCodeSignatureForceKill = 0x0200;
export const kSecCodeSignatureForceExpiration = 0x0400;
export const kSecCodeSignatureRestrict = 0x0800;
export const kSecCodeSignatureEnforcement = 0x1000;
export const kSecCodeSignatureLibraryValidation = 0x2000;
export const kSecCodeSignatureRuntime = 0x10000;
export const kSecCodeSignatureLinkerSigned = 0x20000;

// SecRequirementType:
export const kSecHostRequirementType = 1;
export const kSecGuestRequirementType = 2;
export const kSecDesignatedRequirementType = 3;
export const kSecLibraryRequirementType = 4;
export const kSecPluginRequirementType = 5;

// Special hash slot values:
export const cdInfoSlot = 1;
export const cdRequirementsSlot = 2;
export const cdResourceDirSlot = 3;
export const cdTopDirectorySlot = 4;
export const cdEntitlementSlot = 5;
export const cdRepSpecificSlot = 6;
export const cdEntitlementDERSlot = 7;
export const cdLaunchConstraintSelf = 8;
export const cdLaunchConstraintParent = 9;
export const cdLaunchConstraintResponsible = 10;
export const cdLibraryConstraint = 11;
export const cdSlotCount = 12; // Subject to change.
export const cdSlotMax = 11; // Subject to change.

// Virtual slots:
export const cdCodeDirectorySlot = 0;
export const cdAlternateCodeDirectorySlots = 0x1000;
export const cdAlternateCodeDirectoryLimit = 0x1005;
export const cdSignatureSlot = 0x10000;
export const cdIdentificationSlot = 0x10001;
export const cdTicketSlot = 0x10002;

// Special hash slot flags:
export const cdComponentPerArchitecture = 1;
export const cdComponentIsBlob = 2;

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
