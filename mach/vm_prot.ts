// VM protection flags:

/**
 * VM protection: none.
 */
export const VM_PROT_NONE = 0x0;

/**
 * VM protection: read.
 */
export const VM_PROT_READ = 0x1;

/**
 * VM protection: write.
 */
export const VM_PROT_WRITE = 0x2;

/**
 * VM protection: execute.
 */
export const VM_PROT_EXECUTE = 0x4;

/**
 * VM protection: default.
 *
 * `VM_PROT_READ | VM_PROT_WRITE`
 */
export const VM_PROT_DEFAULT = 0x3;

/**
 * VM protection: all.
 *
 * `VM_PROT_READ | VM_PROT_WRITE | VM_PROT_EXECUTE`
 */
export const VM_PROT_ALL = 0x7;

/**
 * VM protection: no change legacy.
 */
export const VM_PROT_NO_CHANGE_LEGACY = 0x8;

/**
 * VM protection: no change.
 */
export const VM_PROT_NO_CHANGE = 0x01000000;

/**
 * VM protection: copy.
 */
export const VM_PROT_COPY = 0x10;

/**
 * VM protection: wants copy.
 */
export const VM_PROT_WANTS_COPY = 0x10;

/**
 * VM protection: is mask.
 */
export const VM_PROT_IS_MASK = 0x40;

/**
 * VM protection: strip read.
 */
export const VM_PROT_STRIP_READ = 0x80;

/**
 * VM protection: execute only.
 *
 * `VM_PROT_EXECUTE | VM_PROT_STRIP_READ`
 */
export const VM_PROT_EXECUTE_ONLY = 0x84;

/**
 * VM protection: TPRO.
 */
export const VM_PROT_TPRO = 0x200;

/**
 * VM protection: UEXEC.
 */
export const VM_PROT_UEXEC = 0x8;

/**
 * VM protection: all exec.
 */
export const VM_PROT_ALLEXEC = VM_PROT_EXECUTE;

/**
 * VM protection: all exec: x86_64.
 *
 * `VM_PROT_EXECUTE | VM_PROT_UEXEC`
 */
export const VM_PROT_ALLEXEC_X86_64 = 0xc;
