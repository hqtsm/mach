/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/naming-convention */

// Highest number value before approximation, 2^53-1.
export const INT_LIMIT = 0x1fffffffffffff;

// A very large but still compatible upper block size limit.
export const BLK_LIMIT = 0x100000000;

// Detect the host endianness.
export const HOST_BE = !new Uint8Array(new Uint16Array([1]).buffer)[0];
export const HOST_LE = !HOST_BE;

export const UINT32_MAX = 0xffffffff;

// FAT mach magic numbers:
export const FAT_MAGIC = 0xcafebabe;
export const FAT_CIGAM = 0xbebafeca;
export const FAT_MAGIC_64 = 0xcafebabf;
export const FAT_CIGAM_64 = 0xbfbafeca;

// Mach header magic numbers:
export const MH_MAGIC = 0xfeedface;
export const MH_CIGAM = 0xcefaedfe;
export const MH_MAGIC_64 = 0xfeedfacf;
export const MH_CIGAM_64 = 0xcffaedfe;

// CPU types:
export const CPU_ARCH_MASK = 0xff000000;
export const CPU_ARCH_ABI64 = 0x01000000;
export const CPU_ARCH_ABI64_32 = 0x02000000;

export const CPU_TYPE_ANY = -1;
export const CPU_TYPE_VAX = 1;
export const CPU_TYPE_MC680x0 = 6;
export const CPU_TYPE_X86 = 7;
export const CPU_TYPE_I386 = CPU_TYPE_X86;
export const CPU_TYPE_X86_64 = CPU_TYPE_X86 | CPU_ARCH_ABI64;
export const CPU_TYPE_MC98000 = 10;
export const CPU_TYPE_HPPA = 11;
export const CPU_TYPE_ARM = 12;
export const CPU_TYPE_ARM64 = CPU_TYPE_ARM | CPU_ARCH_ABI64;
export const CPU_TYPE_ARM64_32 = CPU_TYPE_ARM | CPU_ARCH_ABI64_32;
export const CPU_TYPE_MC88000 = 13;
export const CPU_TYPE_SPARC = 14;
export const CPU_TYPE_I860 = 15;
export const CPU_TYPE_POWERPC = 18;
export const CPU_TYPE_POWERPC64 = CPU_TYPE_POWERPC | CPU_ARCH_ABI64;

// CPU subtypes:
export const CPU_SUBTYPE_MASK = 0xff000000;
export const CPU_SUBTYPE_LIB64 = 0x80000000;
export const CPU_SUBTYPE_PTRAUTH_ABI = 0x80000000;

export const CPU_SUBTYPE_ANY = -1;
export const CPU_SUBTYPE_MULTIPLE = -1;
export const CPU_SUBTYPE_LITTLE_ENDIAN = 0;
export const CPU_SUBTYPE_BIG_ENDIAN = 1;

export const CPU_SUBTYPE_VAX_ALL = 0;
export const CPU_SUBTYPE_VAX780 = 1;
export const CPU_SUBTYPE_VAX785 = 2;
export const CPU_SUBTYPE_VAX750 = 3;
export const CPU_SUBTYPE_VAX730 = 4;
export const CPU_SUBTYPE_UVAXI = 5;
export const CPU_SUBTYPE_UVAXII = 6;
export const CPU_SUBTYPE_VAX8200 = 7;
export const CPU_SUBTYPE_VAX8500 = 8;
export const CPU_SUBTYPE_VAX8600 = 9;
export const CPU_SUBTYPE_VAX8650 = 10;
export const CPU_SUBTYPE_VAX8800 = 11;
export const CPU_SUBTYPE_UVAXIII = 12;

export const CPU_SUBTYPE_MC680x0_ALL = 1;
export const CPU_SUBTYPE_MC68030 = 1;
export const CPU_SUBTYPE_MC68040 = 2;
export const CPU_SUBTYPE_MC68030_ONLY = 3;

const CPU_SUBTYPE_INTEL = (f: number, m: number) => f + (m << 4);
export const CPU_SUBTYPE_I386_ALL = CPU_SUBTYPE_INTEL(3, 0);
export const CPU_SUBTYPE_386 = CPU_SUBTYPE_INTEL(3, 0);
export const CPU_SUBTYPE_486 = CPU_SUBTYPE_INTEL(4, 0);
export const CPU_SUBTYPE_486SX = CPU_SUBTYPE_INTEL(4, 8);
export const CPU_SUBTYPE_586 = CPU_SUBTYPE_INTEL(5, 0);
export const CPU_SUBTYPE_PENT = CPU_SUBTYPE_INTEL(5, 0);
export const CPU_SUBTYPE_PENTPRO = CPU_SUBTYPE_INTEL(6, 1);
export const CPU_SUBTYPE_PENTII_M3 = CPU_SUBTYPE_INTEL(6, 3);
export const CPU_SUBTYPE_PENTII_M5 = CPU_SUBTYPE_INTEL(6, 5);
export const CPU_SUBTYPE_CELERON = CPU_SUBTYPE_INTEL(7, 6);
export const CPU_SUBTYPE_CELERON_MOBILE = CPU_SUBTYPE_INTEL(7, 7);
export const CPU_SUBTYPE_PENTIUM_3 = CPU_SUBTYPE_INTEL(8, 0);
export const CPU_SUBTYPE_PENTIUM_3_M = CPU_SUBTYPE_INTEL(8, 1);
export const CPU_SUBTYPE_PENTIUM_3_XEON = CPU_SUBTYPE_INTEL(8, 2);
export const CPU_SUBTYPE_PENTIUM_M = CPU_SUBTYPE_INTEL(9, 0);
export const CPU_SUBTYPE_PENTIUM_4 = CPU_SUBTYPE_INTEL(10, 0);
export const CPU_SUBTYPE_PENTIUM_4_M = CPU_SUBTYPE_INTEL(10, 1);
export const CPU_SUBTYPE_ITANIUM = CPU_SUBTYPE_INTEL(11, 0);
export const CPU_SUBTYPE_ITANIUM_2 = CPU_SUBTYPE_INTEL(11, 1);
export const CPU_SUBTYPE_XEON = CPU_SUBTYPE_INTEL(12, 0);
export const CPU_SUBTYPE_XEON_MP = CPU_SUBTYPE_INTEL(12, 1);

export const CPU_SUBTYPE_X86_ALL = 3;
export const CPU_SUBTYPE_X86_64_ALL = 3;
export const CPU_SUBTYPE_X86_ARCH1 = 4;
export const CPU_SUBTYPE_X86_64_H = 8;

export const CPU_SUBTYPE_MIPS_ALL = 0;
export const CPU_SUBTYPE_MIPS_R2300 = 1;
export const CPU_SUBTYPE_MIPS_R2600 = 2;
export const CPU_SUBTYPE_MIPS_R2800 = 3;
export const CPU_SUBTYPE_MIPS_R2000a = 4;
export const CPU_SUBTYPE_MIPS_R2000 = 5;
export const CPU_SUBTYPE_MIPS_R3000a = 6;
export const CPU_SUBTYPE_MIPS_R3000 = 7;

export const CPU_SUBTYPE_MC98000_ALL = 0;
export const CPU_SUBTYPE_MC98601 = 1;

export const CPU_SUBTYPE_HPPA_ALL = 0;
export const CPU_SUBTYPE_HPPA_7100 = 0;
export const CPU_SUBTYPE_HPPA_7100LC = 1;

export const CPU_SUBTYPE_MC88000_ALL = 0;
export const CPU_SUBTYPE_MC88100 = 1;
export const CPU_SUBTYPE_MC88110 = 2;

export const CPU_SUBTYPE_SPARC_ALL = 0;

export const CPU_SUBTYPE_I860_ALL = 0;
export const CPU_SUBTYPE_I860_860 = 1;

export const CPU_SUBTYPE_POWERPC_ALL = 0;
export const CPU_SUBTYPE_POWERPC_601 = 1;
export const CPU_SUBTYPE_POWERPC_602 = 2;
export const CPU_SUBTYPE_POWERPC_603 = 3;
export const CPU_SUBTYPE_POWERPC_603e = 4;
export const CPU_SUBTYPE_POWERPC_603ev = 5;
export const CPU_SUBTYPE_POWERPC_604 = 6;
export const CPU_SUBTYPE_POWERPC_604e = 7;
export const CPU_SUBTYPE_POWERPC_620 = 8;
export const CPU_SUBTYPE_POWERPC_750 = 9;
export const CPU_SUBTYPE_POWERPC_7400 = 10;
export const CPU_SUBTYPE_POWERPC_7450 = 11;
export const CPU_SUBTYPE_POWERPC_970 = 100;

export const CPU_SUBTYPE_ARM_ALL = 0;
export const CPU_SUBTYPE_ARM_V4T = 5;
export const CPU_SUBTYPE_ARM_V6 = 6;
export const CPU_SUBTYPE_ARM_V5TEJ = 7;
export const CPU_SUBTYPE_ARM_XSCALE = 8;
export const CPU_SUBTYPE_ARM_V7 = 9;
export const CPU_SUBTYPE_ARM_V7F = 10;
export const CPU_SUBTYPE_ARM_V7S = 11;
export const CPU_SUBTYPE_ARM_V7K = 12;
export const CPU_SUBTYPE_ARM_V8 = 13;
export const CPU_SUBTYPE_ARM_V6M = 14;
export const CPU_SUBTYPE_ARM_V7M = 15;
export const CPU_SUBTYPE_ARM_V7EM = 16;
export const CPU_SUBTYPE_ARM_V8M = 17;

export const CPU_SUBTYPE_ARM64_ALL = 0;
export const CPU_SUBTYPE_ARM64_V8 = 1;
export const CPU_SUBTYPE_ARM64E = 2;

export const CPU_SUBTYPE_ARM64_32_ALL = 0;
export const CPU_SUBTYPE_ARM64_32_V8 = 1;

// Executable segment flags:
export const CS_EXECSEG_MAIN_BINARY = 0x1;
export const CS_EXECSEG_ALLOW_UNSIGNED = 0x10;
export const CS_EXECSEG_DEBUGGER = 0x20;
export const CS_EXECSEG_JIT = 0x40;
export const CS_EXECSEG_SKIP_LV = 0x80;
export const CS_EXECSEG_CAN_LOAD_CDHASH = 0x100;
export const CS_EXECSEG_CAN_EXEC_CDHASH = 0x200;

// Magic numbers used by code signing:
export const CSMAGIC_REQUIREMENT = 0xfade0c00;
export const CSMAGIC_REQUIREMENTS = 0xfade0c01;
export const CSMAGIC_CODEDIRECTORY = 0xfade0c02;
export const CSMAGIC_EMBEDDED_SIGNATURE = 0xfade0cc0;
export const CSMAGIC_EMBEDDED_SIGNATURE_OLD = 0xfade0b02;
export const CSMAGIC_EMBEDDED_ENTITLEMENTS = 0xfade7171;
export const CSMAGIC_EMBEDDED_DER_ENTITLEMENTS = 0xfade7172;
export const CSMAGIC_DETACHED_SIGNATURE = 0xfade0cc1;
export const CSMAGIC_BLOBWRAPPER = 0xfade0b01;
export const CSMAGIC_EMBEDDED_LAUNCH_CONSTRAINT = 0xfade8181;

export const CS_SUPPORTSSCATTER = 0x20100;
export const CS_SUPPORTSTEAMID = 0x20200;
export const CS_SUPPORTSCODELIMIT64 = 0x20300;
export const CS_SUPPORTSEXECSEG = 0x20400;
export const CS_SUPPORTSRUNTIME = 0x20500;
export const CS_SUPPORTSLINKAGE = 0x20600;

export const CSSLOT_CODEDIRECTORY = 0;
export const CSSLOT_INFOSLOT = 1;
export const CSSLOT_REQUIREMENTS = 2;
export const CSSLOT_RESOURCEDIR = 3;
export const CSSLOT_APPLICATION = 4;
export const CSSLOT_ENTITLEMENTS = 5;
export const CSSLOT_DER_ENTITLEMENTS = 7;
export const CSSLOT_LAUNCH_CONSTRAINT_SELF = 8;
export const CSSLOT_LAUNCH_CONSTRAINT_PARENT = 9;
export const CSSLOT_LAUNCH_CONSTRAINT_RESPONSIBLE = 10;
export const CSSLOT_LIBRARY_CONSTRAINT = 11;

export const CSSLOT_ALTERNATE_CODEDIRECTORIES = 0x1000;
export const CSSLOT_ALTERNATE_CODEDIRECTORY_MAX = 5;
export const CSSLOT_ALTERNATE_CODEDIRECTORY_LIMIT =
	CSSLOT_ALTERNATE_CODEDIRECTORIES + CSSLOT_ALTERNATE_CODEDIRECTORY_MAX;

export const CSSLOT_SIGNATURESLOT = 0x10000;
export const CSSLOT_IDENTIFICATIONSLOT = 0x10001;
export const CSSLOT_TICKETSLOT = 0x10002;

export const CSTYPE_INDEX_REQUIREMENTS = 0x00000002;
export const CSTYPE_INDEX_ENTITLEMENTS = 0x00000005;

export const CS_HASHTYPE_SHA1 = 1;
export const CS_HASHTYPE_SHA256 = 2;
export const CS_HASHTYPE_SHA256_TRUNCATED = 3;
export const CS_HASHTYPE_SHA384 = 4;

export const CS_SHA1_LEN = 20;
export const CS_SHA256_LEN = 32;
export const CS_SHA256_TRUNCATED_LEN = 20;

export const CS_CDHASH_LEN = 20;
export const CS_HASH_MAX_SIZE = 48;

export const CS_SIGNER_TYPE_UNKNOWN = 0;
export const CS_SIGNER_TYPE_LEGACYVPN = 5;
export const CS_SIGNER_TYPE_MAC_APP_STORE = 6;

export const CS_SUPPL_SIGNER_TYPE_UNKNOWN = 0;
export const CS_SUPPL_SIGNER_TYPE_TRUSTCACHE = 7;
export const CS_SUPPL_SIGNER_TYPE_LOCAL = 8;

export const CS_SIGNER_TYPE_OOPJIT = 9;

export const CS_VALIDATION_CATEGORY_INVALID = 0;
export const CS_VALIDATION_CATEGORY_PLATFORM = 1;
export const CS_VALIDATION_CATEGORY_TESTFLIGHT = 2;
export const CS_VALIDATION_CATEGORY_DEVELOPMENT = 3;
export const CS_VALIDATION_CATEGORY_APP_STORE = 4;
export const CS_VALIDATION_CATEGORY_ENTERPRISE = 5;
export const CS_VALIDATION_CATEGORY_DEVELOPER_ID = 6;
export const CS_VALIDATION_CATEGORY_LOCAL_SIGNING = 7;
export const CS_VALIDATION_CATEGORY_ROSETTA = 8;
export const CS_VALIDATION_CATEGORY_OOPJIT = 9;
export const CS_VALIDATION_CATEGORY_NONE = 10;

// Set of application types to support linkage signatures:
export const CS_LINKAGE_APPLICATION_INVALID = 0;
export const CS_LINKAGE_APPLICATION_ROSETTA = 1;
export const CS_LINKAGE_APPLICATION_XOJIT = 2;
export const CS_LINKAGE_APPLICATION_OOPJIT = 2;

// Set of application subtypes to support linkage signatures:
export const CS_LINKAGE_APPLICATION_ROSETTA_AOT = 0;
export const CS_LINKAGE_APPLICATION_XOJIT_PREVIEWS = 1;
export const CS_LINKAGE_APPLICATION_OOPJIT_INVALID = 0;
export const CS_LINKAGE_APPLICATION_OOPJIT_PREVIEWS = 1;
export const CS_LINKAGE_APPLICATION_OOPJIT_MLCOMPILER = 2;
export const CS_LINKAGE_APPLICATION_OOPJIT_TOTAL = 3;

// Blob types used for code signing:
export const kSecCodeMagicRequirement = 0xfade0c00;
export const kSecCodeMagicRequirementSet = 0xfade0c01;
export const kSecCodeMagicCodeDirectory = 0xfade0c02;
export const kSecCodeMagicEmbeddedSignature = 0xfade0cc0;
export const kSecCodeMagicDetachedSignature = 0xfade0cc1;
export const kSecCodeMagicEntitlement = 0xfade7171;
export const kSecCodeMagicEntitlementDER = 0xfade7172;
export const kSecCodeMagicLaunchConstraint = 0xfade8181;
export const kSecCodeMagicDRList = 0xfade0c05;
export const kSecCodeMagicByte = 0xfa;

// SecCodeExecSegFlags:
export const kSecCodeExecSegMainBinary = 0x0001;
export const kSecCodeExecSegAllowUnsigned = 0x0010;
export const kSecCodeExecSegDebugger = 0x0020;
export const kSecCodeExecSegJit = 0x0040;
export const kSecCodeExecSegSkipLibraryVal = 0x0080;
export const kSecCodeExecSegCanLoadCdHash = 0x0100;
export const kSecCodeExecSegCanExecCdHash = 0x0200;

// Current (fixed) cdhash size:
export const kSecCodeCDHashLength = 20;

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

export const cdCodeDirectorySlot = 0;
export const cdAlternateCodeDirectorySlots = 0x1000;
export const cdAlternateCodeDirectoryLimit = 0x1005;
export const cdSignatureSlot = 0x10000;
export const cdIdentificationSlot = 0x10001;
export const cdTicketSlot = 0x10002;

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
