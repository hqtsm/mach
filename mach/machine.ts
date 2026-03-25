// deno-lint-ignore-file camelcase

// CPU states:

/**
 * CPU state max.
 */
export const CPU_STATE_MAX = 4;

/**
 * CPU state: user.
 */
export const CPU_STATE_USER = 0;

/**
 * CPU state: system.
 */
export const CPU_STATE_SYSTEM = 1;

/**
 * CPU state: idle.
 */
export const CPU_STATE_IDLE = 2;

/**
 * CPU state: nice.
 */
export const CPU_STATE_NICE = 3;

// CPU architecture compatibility bits:

/**
 * CPU architecture mask.
 */
export const CPU_ARCH_MASK = 0xff000000;

/**
 * CPU architecture 64-bit ABI.
 */
export const CPU_ARCH_ABI64 = 0x01000000;

/**
 * CPU architecture 64-bit ABI with 32-bit types (LP32).
 */
export const CPU_ARCH_ABI64_32 = 0x02000000;

// CPU types:

/**
 * CPU type: any.
 */
export const CPU_TYPE_ANY = -1;

/**
 * CPU type: VAX.
 */
export const CPU_TYPE_VAX = 1;

/**
 * CPU type: MC680x0.
 */
export const CPU_TYPE_MC680x0 = 6;

/**
 * CPU type: X86.
 */
export const CPU_TYPE_X86 = 7;

/**
 * CPU type: I386.
 */
export const CPU_TYPE_I386 = CPU_TYPE_X86;

/**
 * CPU type: X86_64.
 *
 * `CPU_TYPE_X86 | CPU_ARCH_ABI64`
 */
export const CPU_TYPE_X86_64 = 0x1000007;

/**
 * CPU type: MC98000.
 */
export const CPU_TYPE_MC98000 = 10;

/**
 * CPU type: HPPA.
 */
export const CPU_TYPE_HPPA = 11;

/**
 * CPU type: ARM.
 */
export const CPU_TYPE_ARM = 12;

/**
 * CPU type: ARM64.
 *
 * `CPU_TYPE_ARM | CPU_ARCH_ABI64`
 */
export const CPU_TYPE_ARM64 = 0x100000c;

/**
 * CPU type: ARM64_32.
 *
 * `CPU_TYPE_ARM | CPU_ARCH_ABI64_32`
 */
export const CPU_TYPE_ARM64_32 = 0x200000c;

/**
 * CPU type: MC88000.
 */
export const CPU_TYPE_MC88000 = 13;

/**
 * CPU type: SPARC.
 */
export const CPU_TYPE_SPARC = 14;

/**
 * CPU type: I860.
 */
export const CPU_TYPE_I860 = 15;

/**
 * CPU type: PowerPC.
 */
export const CPU_TYPE_POWERPC = 18;

/**
 * CPU type: PowerPC64.
 *
 * `CPU_TYPE_POWERPC | CPU_ARCH_ABI64`
 */
export const CPU_TYPE_POWERPC64 = 0x1000012;

// CPU subtypes:

/**
 * CPU subtype mask.
 */
export const CPU_SUBTYPE_MASK = 0xff000000;

/**
 * CPU subtype 64-bit libraries.
 */
export const CPU_SUBTYPE_LIB64 = 0x80000000;

/**
 * CPU subtype pointer authentication with versioned ABI.
 */
export const CPU_SUBTYPE_PTRAUTH_ABI = 0x80000000;

/**
 * CPU subtype: any.
 */
export const CPU_SUBTYPE_ANY = -1;

/**
 * CPU subtype: multiple.
 */
export const CPU_SUBTYPE_MULTIPLE = -1;

/**
 * CPU subtype: little endian.
 */
export const CPU_SUBTYPE_LITTLE_ENDIAN = 0;

/**
 * CPU subtype: big endian.
 */
export const CPU_SUBTYPE_BIG_ENDIAN = 1;

/**
 * CPU thread type: none.
 */
export const CPU_THREADTYPE_NONE = 0;

// CPU subtype for VAX:

/**
 * CPU subtype: VAX all.
 */
export const CPU_SUBTYPE_VAX_ALL = 0;

/**
 * CPU subtype: VAX 780.
 */
export const CPU_SUBTYPE_VAX780 = 1;

/**
 * CPU subtype: VAX 785.
 */
export const CPU_SUBTYPE_VAX785 = 2;

/**
 * CPU subtype: VAX 750.
 */
export const CPU_SUBTYPE_VAX750 = 3;

/**
 * CPU subtype: VAX 730.
 */
export const CPU_SUBTYPE_VAX730 = 4;

/**
 * CPU subtype: UVAXI.
 */
export const CPU_SUBTYPE_UVAXI = 5;

/**
 * CPU subtype: UVAXII.
 */
export const CPU_SUBTYPE_UVAXII = 6;

/**
 * CPU subtype: VAX 8200.
 */
export const CPU_SUBTYPE_VAX8200 = 7;

/**
 * CPU subtype: VAX 8500.
 */
export const CPU_SUBTYPE_VAX8500 = 8;

/**
 * CPU subtype: VAX 8600.
 */
export const CPU_SUBTYPE_VAX8600 = 9;

/**
 * CPU subtype: VAX 8650.
 */
export const CPU_SUBTYPE_VAX8650 = 10;

/**
 * CPU subtype: VAX 8800.
 */
export const CPU_SUBTYPE_VAX8800 = 11;

/**
 * CPU subtype: UVAXIII.
 */
export const CPU_SUBTYPE_UVAXIII = 12;

// CPU subtype for 680x0:

/**
 * CPU subtype: MC680x0 all.
 */
export const CPU_SUBTYPE_MC680x0_ALL = 1;

/**
 * CPU subtype: MC68030.
 */
export const CPU_SUBTYPE_MC68030 = 1;

/**
 * CPU subtype: MC68040.
 */
export const CPU_SUBTYPE_MC68040 = 2;

/**
 * CPU subtype: MC68060.
 */
export const CPU_SUBTYPE_MC68030_ONLY = 3;

// CPU subtype for I386:

/**
 * CPU subtype Intel calculator.
 *
 * @param f Family.
 * @param m Model.
 * @returns CPU subtype.
 */
export const CPU_SUBTYPE_INTEL = (f: number, m: number): number =>
	(f + (m << 4)) >>> 0;

/**
 * CPU subtype: Intel all.
 *
 * `CPU_SUBTYPE_INTEL(3, 0)`
 */
export const CPU_SUBTYPE_I386_ALL = 3;

/**
 * CPU subtype: Intel 386.
 *
 * `CPU_SUBTYPE_INTEL(3, 0)`
 */
export const CPU_SUBTYPE_386 = 3;

/**
 * CPU subtype: Intel 486.
 *
 * `CPU_SUBTYPE_INTEL(4, 0)`
 */
export const CPU_SUBTYPE_486 = 4;

/**
 * CPU subtype: Intel 486SX.
 *
 * `CPU_SUBTYPE_INTEL(4, 8)`
 */
export const CPU_SUBTYPE_486SX = 132;

/**
 * CPU subtype: Intel 586.
 *
 * `CPU_SUBTYPE_INTEL(5, 0)`
 */
export const CPU_SUBTYPE_586 = 5;

/**
 * CPU subtype: Intel Pentium.
 *
 * `CPU_SUBTYPE_INTEL(5, 0)`
 */
export const CPU_SUBTYPE_PENT = 5;

/**
 * CPU subtype: Intel Pentium Pro.
 *
 * `CPU_SUBTYPE_INTEL(6, 1)`
 */
export const CPU_SUBTYPE_PENTPRO = 22;
/**
 * CPU subtype: Intel Pentium II M3.
 *
 * `CPU_SUBTYPE_INTEL(6, 3)`
 */
export const CPU_SUBTYPE_PENTII_M3 = 54;

/**
 * CPU subtype: Intel Pentium II M5.
 *
 * `CPU_SUBTYPE_INTEL(6, 5)`
 */
export const CPU_SUBTYPE_PENTII_M5 = 86;

/**
 * CPU subtype: Intel Celeron.
 *
 * `CPU_SUBTYPE_INTEL(7, 6)`
 */
export const CPU_SUBTYPE_CELERON = 103;

/**
 * CPU subtype: Intel Celeron Mobile.
 *
 * `CPU_SUBTYPE_INTEL(7, 7)`
 */
export const CPU_SUBTYPE_CELERON_MOBILE = 119;

/**
 * CPU subtype: Intel Pentium 3.
 *
 * `CPU_SUBTYPE_INTEL(8, 0)`
 */
export const CPU_SUBTYPE_PENTIUM_3 = 8;

/**
 * CPU subtype: Intel Pentium 3 M.
 *
 * `CPU_SUBTYPE_INTEL(8, 1)`
 */
export const CPU_SUBTYPE_PENTIUM_3_M = 24;

/**
 * CPU subtype: Intel Pentium 3 Xeon.
 *
 * `CPU_SUBTYPE_INTEL(8, 2)`
 */
export const CPU_SUBTYPE_PENTIUM_3_XEON = 40;

/**
 * CPU subtype: Intel Pentium M.
 *
 * `CPU_SUBTYPE_INTEL(9, 0)`
 */
export const CPU_SUBTYPE_PENTIUM_M = 9;

/**
 * CPU subtype: Intel Pentium 4.
 *
 * `CPU_SUBTYPE_INTEL(10, 0)`
 */
export const CPU_SUBTYPE_PENTIUM_4 = 10;

/**
 * CPU subtype: Intel Pentium 4 M.
 *
 * `CPU_SUBTYPE_INTEL(10, 1)`
 */
export const CPU_SUBTYPE_PENTIUM_4_M = 26;

/**
 * CPU subtype: Intel Itanium.
 *
 * `CPU_SUBTYPE_INTEL(11, 0)`
 */
export const CPU_SUBTYPE_ITANIUM = 11;

/**
 * CPU subtype: Intel Itanium 2.
 *
 * `CPU_SUBTYPE_INTEL(11, 1)`
 */
export const CPU_SUBTYPE_ITANIUM_2 = 27;

/**
 * CPU subtype: Intel Xeon.
 *
 * `CPU_SUBTYPE_INTEL(12, 0)`
 */
export const CPU_SUBTYPE_XEON = 12;

/**
 * CPU subtype: Intel Xeon MP.
 *
 * `CPU_SUBTYPE_INTEL(12, 1)`
 */
export const CPU_SUBTYPE_XEON_MP = 28;

/**
 * Get Intel family from CPU subtype.
 *
 * @param x CPU subtype.
 * @returns Family.
 */
export const CPU_SUBTYPE_INTEL_FAMILY = (x: number): number => (x & 15);

/**
 * Maximum Intel family.
 */
export const CPU_SUBTYPE_INTEL_FAMILY_MAX = 15;

/**
 * Get Intel model from CPU subtype.
 *
 * @param x CPU subtype.
 * @returns Model.
 */
export const CPU_SUBTYPE_INTEL_MODEL = (x: number): number => (x >>> 4);

/**
 * Maximum Intel model.
 */
export const CPU_SUBTYPE_INTEL_MODEL_MAX = 15;

// CPU subtype for X86:

/**
 * CPU subtype: X86 all.
 */
export const CPU_SUBTYPE_X86_ALL = 3;

/**
 * CPU subtype: X86-64 all.
 */
export const CPU_SUBTYPE_X86_64_ALL = 3;

/**
 * CPU subtype: X86 Arch1.
 */
export const CPU_SUBTYPE_X86_ARCH1 = 4;

/**
 * CPU subtype: X86-64 H.
 */
export const CPU_SUBTYPE_X86_64_H = 8;

// CPU subtype for Mips:

/**
 * CPU subtype: Mips all.
 */
export const CPU_SUBTYPE_MIPS_ALL = 0;

/**
 * CPU subtype: Mips R2300.
 */
export const CPU_SUBTYPE_MIPS_R2300 = 1;

/**
 * CPU subtype: Mips R2600.
 */
export const CPU_SUBTYPE_MIPS_R2600 = 2;

/**
 * CPU subtype: Mips R2800.
 */
export const CPU_SUBTYPE_MIPS_R2800 = 3;

/**
 * CPU subtype: Mips R2000a.
 */
export const CPU_SUBTYPE_MIPS_R2000a = 4;

/**
 * CPU subtype: Mips R2000.
 */
export const CPU_SUBTYPE_MIPS_R2000 = 5;

/**
 * CPU subtype: Mips R3000a.
 */
export const CPU_SUBTYPE_MIPS_R3000a = 6;

/**
 * CPU subtype: Mips R3000.
 */
export const CPU_SUBTYPE_MIPS_R3000 = 7;

// CPU subtype for MC98000 (PowerPC):

/**
 * CPU subtype: MC98000 all.
 */
export const CPU_SUBTYPE_MC98000_ALL = 0;

/**
 * CPU subtype: MC98601.
 */
export const CPU_SUBTYPE_MC98601 = 1;

// CPU subtype for HPPA:

/**
 * CPU subtype: HPPA all.
 */
export const CPU_SUBTYPE_HPPA_ALL = 0;

/**
 * CPU subtype: HPPA 7100.
 */
export const CPU_SUBTYPE_HPPA_7100 = 0;

/**
 * CPU subtype: HPPA 7100LC.
 */
export const CPU_SUBTYPE_HPPA_7100LC = 1;

// CPU subtype for MC88000:

/**
 * CPU subtype: MC88000 all.
 */
export const CPU_SUBTYPE_MC88000_ALL = 0;

/**
 * CPU subtype: MC88100.
 */
export const CPU_SUBTYPE_MC88100 = 1;

/**
 * CPU subtype: MC88110.
 */
export const CPU_SUBTYPE_MC88110 = 2;

// CPU subtype for SPARC:

/**
 * CPU subtype: SPARC all.
 */
export const CPU_SUBTYPE_SPARC_ALL = 0;

// CPU subtype for I860:

/**
 * CPU subtype: I860 all.
 */
export const CPU_SUBTYPE_I860_ALL = 0;

/**
 * CPU subtype: I860 860.
 */
export const CPU_SUBTYPE_I860_860 = 1;

// CPU subtype for PowerPC:

/**
 * CPU subtype: PowerPC all.
 */
export const CPU_SUBTYPE_POWERPC_ALL = 0;

/**
 * CPU subtype: PowerPC 601.
 */
export const CPU_SUBTYPE_POWERPC_601 = 1;

/**
 * CPU subtype: PowerPC 602.
 */
export const CPU_SUBTYPE_POWERPC_602 = 2;

/**
 * CPU subtype: PowerPC 603.
 */
export const CPU_SUBTYPE_POWERPC_603 = 3;

/**
 * CPU subtype: PowerPC 603e.
 */
export const CPU_SUBTYPE_POWERPC_603e = 4;

/**
 * CPU subtype: PowerPC 603ev.
 */
export const CPU_SUBTYPE_POWERPC_603ev = 5;

/**
 * CPU subtype: PowerPC 604.
 */
export const CPU_SUBTYPE_POWERPC_604 = 6;

/**
 * CPU subtype: PowerPC 604e.
 */
export const CPU_SUBTYPE_POWERPC_604e = 7;

/**
 * CPU subtype: PowerPC 620.
 */
export const CPU_SUBTYPE_POWERPC_620 = 8;

/**
 * CPU subtype: PowerPC 750.
 */
export const CPU_SUBTYPE_POWERPC_750 = 9;

/**
 * CPU subtype: PowerPC 7400.
 */
export const CPU_SUBTYPE_POWERPC_7400 = 10;

/**
 * CPU subtype: PowerPC 7450.
 */
export const CPU_SUBTYPE_POWERPC_7450 = 11;

/**
 * CPU subtype: PowerPC 970.
 */
export const CPU_SUBTYPE_POWERPC_970 = 100;

// CPU subtype for ARM:

/**
 * CPU subtype: ARM all.
 */
export const CPU_SUBTYPE_ARM_ALL = 0;

/**
 * CPU subtype: ARM v4t.
 */
export const CPU_SUBTYPE_ARM_V4T = 5;

/**
 * CPU subtype: ARM v6.
 */
export const CPU_SUBTYPE_ARM_V6 = 6;

/**
 * CPU subtype: ARM v5tej.
 */
export const CPU_SUBTYPE_ARM_V5TEJ = 7;

/**
 * CPU subtype: ARM XScale.
 */
export const CPU_SUBTYPE_ARM_XSCALE = 8;

/**
 * CPU subtype: ARM v7.
 */
export const CPU_SUBTYPE_ARM_V7 = 9;

/**
 * CPU subtype: ARM v7F.
 */
export const CPU_SUBTYPE_ARM_V7F = 10;

/**
 * CPU subtype: ARM v7S.
 */
export const CPU_SUBTYPE_ARM_V7S = 11;

/**
 * CPU subtype: ARM v7K.
 */
export const CPU_SUBTYPE_ARM_V7K = 12;

/**
 * CPU subtype: ARM v8.
 */
export const CPU_SUBTYPE_ARM_V8 = 13;

/**
 * CPU subtype: ARM v6M.
 */
export const CPU_SUBTYPE_ARM_V6M = 14;

/**
 * CPU subtype: ARM v7M.
 */
export const CPU_SUBTYPE_ARM_V7M = 15;

/**
 * CPU subtype: ARM v7EM.
 */
export const CPU_SUBTYPE_ARM_V7EM = 16;

/**
 * CPU subtype: ARM v8M.
 */
export const CPU_SUBTYPE_ARM_V8M = 17;

// CPU subtype for ARM64:

/**
 * CPU subtype: ARM64 all.
 */
export const CPU_SUBTYPE_ARM64_ALL = 0;

/**
 * CPU subtype: ARM64 v8.
 */
export const CPU_SUBTYPE_ARM64_V8 = 1;

/**
 * CPU subtype: ARM64e.
 */
export const CPU_SUBTYPE_ARM64E = 2;

// CPU subtype for ptrauth on arm64e:

/**
 * CPU subtype: ARM64e ptrauth mask.
 */
export const CPU_SUBTYPE_ARM64_PTR_AUTH_MASK = 0x0f000000;

/**
 * Get ARM64e ptrauth version from CPU subtype.
 *
 * @param x CPU subtype.
 * @returns Version.
 */
export const CPU_SUBTYPE_ARM64_PTR_AUTH_VERSION = (x: number): number =>
	(x & CPU_SUBTYPE_ARM64_PTR_AUTH_MASK) >>> 24;

// CPU subtype for ARM64_32:

/**
 * CPU subtype: ARM64_32 all.
 */
export const CPU_SUBTYPE_ARM64_32_ALL = 0;

/**
 * CPU subtype: ARM64_32 v8.
 */
export const CPU_SUBTYPE_ARM64_32_V8 = 1;

// CPU families:

/**
 * CPU family: Unknown.
 */
export const CPUFAMILY_UNKNOWN = 0;

/**
 * CPU family: PowerPC G3.
 */
export const CPUFAMILY_POWERPC_G3 = 0xcee41549;

/**
 * CPU family: PowerPC G4.
 */
export const CPUFAMILY_POWERPC_G4 = 0x77c184ae;

/**
 * CPU family: PowerPC G5.
 */
export const CPUFAMILY_POWERPC_G5 = 0xed76d8aa;

/**
 * CPU family: Intel 6.13.
 */
export const CPUFAMILY_INTEL_6_13 = 0xaa33392b;

/**
 * CPU family: Intel Penryn.
 */
export const CPUFAMILY_INTEL_PENRYN = 0x78ea4fbc;

/**
 * CPU family: Intel Nehalem.
 */
export const CPUFAMILY_INTEL_NEHALEM = 0x6b5a4cd2;

/**
 * CPU family: Intel Westmere.
 */
export const CPUFAMILY_INTEL_WESTMERE = 0x573b5eec;

/**
 * CPU family: Intel Sandy Bridge.
 */
export const CPUFAMILY_INTEL_SANDYBRIDGE = 0x5490b78c;

/**
 * CPU family: Intel Ivy Bridge.
 */
export const CPUFAMILY_INTEL_IVYBRIDGE = 0x1f65e835;

/**
 * CPU family: Intel Haswell.
 */
export const CPUFAMILY_INTEL_HASWELL = 0x10b282dc;

/**
 * CPU family: Intel Broadwell.
 */
export const CPUFAMILY_INTEL_BROADWELL = 0x582ed09c;

/**
 * CPU family: Intel Skylake.
 */
export const CPUFAMILY_INTEL_SKYLAKE = 0x37fc219f;

/**
 * CPU family: Intel Kaby Lake.
 */
export const CPUFAMILY_INTEL_KABYLAKE = 0x0f817246;

/**
 * CPU family: Intel Ice Lake.
 */
export const CPUFAMILY_INTEL_ICELAKE = 0x38435547;

/**
 * CPU family: Intel Comet Lake.
 */
export const CPUFAMILY_INTEL_COMETLAKE = 0x1cf8a03e;

/**
 * CPU family: ARM 9.
 */
export const CPUFAMILY_ARM_9 = 0xe73283ae;

/**
 * CPU family: ARM 11.
 */
export const CPUFAMILY_ARM_11 = 0x8ff620d8;

/**
 * CPU family: ARM XScale.
 */
export const CPUFAMILY_ARM_XSCALE = 0x53b005f5;

/**
 * CPU family: ARM 12.
 */
export const CPUFAMILY_ARM_12 = 0xbd1b0ae9;

/**
 * CPU family: ARM 13.
 */
export const CPUFAMILY_ARM_13 = 0x0cc90e64;

/**
 * CPU family: ARM 14.
 */
export const CPUFAMILY_ARM_14 = 0x96077ef1;

/**
 * CPU family: ARM 15.
 */
export const CPUFAMILY_ARM_15 = 0xa8511bca;

/**
 * CPU family: ARM Swift.
 */
export const CPUFAMILY_ARM_SWIFT = 0x1e2d6381;

/**
 * CPU family: ARM Cyclone.
 */
export const CPUFAMILY_ARM_CYCLONE = 0x37a09642;

/**
 * CPU family: ARM Typhoon.
 */
export const CPUFAMILY_ARM_TYPHOON = 0x2c91a47e;

/**
 * CPU family: ARM Twister.
 */
export const CPUFAMILY_ARM_TWISTER = 0x92fb37c8;

/**
 * CPU family: ARM Hurricane.
 */
export const CPUFAMILY_ARM_HURRICANE = 0x67ceee93;

/**
 * CPU family: ARM Monsoon Mistral.
 */
export const CPUFAMILY_ARM_MONSOON_MISTRAL = 0xe81e7ef6;

/**
 * CPU family: ARM Vortex Tempest.
 */
export const CPUFAMILY_ARM_VORTEX_TEMPEST = 0x07d34b9f;

/**
 * CPU family: ARM Lightning Thunder.
 */
export const CPUFAMILY_ARM_LIGHTNING_THUNDER = 0x462504d2;

/**
 * CPU family: ARM Firestorm Icestorm.
 */
export const CPUFAMILY_ARM_FIRESTORM_ICESTORM = 0x1b588bb3;

/**
 * CPU family: ARM Blizzard Avalanche.
 */
export const CPUFAMILY_ARM_BLIZZARD_AVALANCHE = 0xda33d83d;

/**
 * CPU family: ARM Everest Sawtooth.
 */
export const CPUFAMILY_ARM_EVEREST_SAWTOOTH = 0x8765edea;

/**
 * CPU family: ARM Ibiza.
 */
export const CPUFAMILY_ARM_IBIZA = 0xfa33415e;

/**
 * CPU family: ARM Palma.
 */
export const CPUFAMILY_ARM_PALMA = 0x72015832;

/**
 * CPU family: ARM Coll
 */
export const CPUFAMILY_ARM_COLL = 0x2876f5b5;

/**
 * CPU family: ARM Lobos.
 */
export const CPUFAMILY_ARM_LOBOS = 0x5f4dea93;

/**
 * CPU family: ARM Donan.
 */
export const CPUFAMILY_ARM_DONAN = 0x6f5129ac;

/**
 * CPU family: ARM Bravo.
 */
export const CPUFAMILY_ARM_BRAVA = 0x17d5b93a;

/**
 * CPU family: ARM Tahiti.
 */
export const CPUFAMILY_ARM_TAHITI = 0x75d4acb9;

/**
 * CPU family: ARM Tupai.
 */
export const CPUFAMILY_ARM_TUPAI = 0x204526d0;

/**
 * CPU family: ARM Hidra.
 */
export const CPUFAMILY_ARM_HIDRA = 0x1d5a87e8;

/**
 * CPU family: ARM Thera.
 */
export const CPUFAMILY_ARM_THERA = 0xab345f09;

/**
 * CPU family: ARM Tilos.
 */
export const CPUFAMILY_ARM_TILOS = 0x01d7a72b;

// CPU subfamilies:

/**
 * CPU subfamily: Unknown.
 */
export const CPUSUBFAMILY_UNKNOWN = 0;

/**
 * CPU subfamily: ARM HP.
 */
export const CPUSUBFAMILY_ARM_HP = 1;

/**
 * CPU subfamily: ARM HG.
 */
export const CPUSUBFAMILY_ARM_HG = 2;

/**
 * CPU subfamily: ARM M.
 */
export const CPUSUBFAMILY_ARM_M = 3;

/**
 * CPU subfamily: ARM HS.
 */
export const CPUSUBFAMILY_ARM_HS = 4;

/**
 * CPU subfamily: ARM HC HD.
 */
export const CPUSUBFAMILY_ARM_HC_HD = 5;

/**
 * CPU subfamily: ARM HA.
 */
export const CPUSUBFAMILY_ARM_HA = 6;

// Deprecated synonyms:

/**
 * CPU family: Intel 6.23.
 */
export const CPUFAMILY_INTEL_6_23 = CPUFAMILY_INTEL_PENRYN;

/**
 * CPU family: Intel 6.26.
 */
export const CPUFAMILY_INTEL_6_26 = CPUFAMILY_INTEL_NEHALEM;
