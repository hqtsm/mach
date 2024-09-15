/* eslint-disable new-cap */
/* eslint-disable no-bitwise */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/naming-convention */

// Highest number value before approximation, 2^53-1.
export const INT_LIMIT = 0x1fffffffffffff;

// A very large but still compatible upper block size limit.
export const BLK_LIMIT = 0x100000000;

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

export const MH_MAGIC = 0xfeedface;
export const MH_CIGAM = 0xcefaedfe;
export const MH_MAGIC_64 = 0xfeedfacf;
export const MH_CIGAM_64 = 0xcffaedfe;

export const FAT_MAGIC = 0xcafebabe;
export const FAT_CIGAM = 0xbebafeca;
export const FAT_MAGIC_64 = 0xcafebabf;
export const FAT_CIGAM_64 = 0xbfbafeca;

// Magic numbers used by code signing:
export const CSMAGIC_REQUIREMENT = 0xfade0c00;
export const CSMAGIC_REQUIREMENTS = 0xfade0c01;
export const CSMAGIC_CODEDIRECTORY = 0xfade0c02;
export const CSMAGIC_EMBEDDED_SIGNATURE = 0xfade0cc0;
export const CSMAGIC_EMBEDDED_SIGNATURE_OLD = 0xfade0b02;
export const CSMAGIC_EMBEDDED_ENTITLEMENTS = 0xfade7171;
export const CSMAGIC_DETACHED_SIGNATURE = 0xfade0cc1;
export const CSMAGIC_BLOBWRAPPER = 0xfade0b01;

// Blob types used for code signing:
export const kSecCodeMagicRequirement = 0xfade0c00;
export const kSecCodeMagicRequirementSet = 0xfade0c01;
export const kSecCodeMagicCodeDirectory = 0xfade0c02;
export const kSecCodeMagicEmbeddedSignature = 0xfade0cc0;
export const kSecCodeMagicDetachedSignature = 0xfade0cc1;
export const kSecCodeMagicEntitlement = 0xfade7171;
export const kSecCodeMagicEntitlementDER = 0xfade7172;
export const kSecCodeMagicLaunchConstraint = 0xfade8181;
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
