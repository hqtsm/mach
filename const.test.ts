import { assertEquals } from '@std/assert';
import * as C from './const.ts';

Deno.test('constants expressions', () => {
	assertEquals(C.VM_PROT_DEFAULT, C.VM_PROT_READ | C.VM_PROT_WRITE);
	assertEquals(
		C.VM_PROT_ALL,
		C.VM_PROT_READ | C.VM_PROT_WRITE | C.VM_PROT_EXECUTE,
	);
	assertEquals(
		C.VM_PROT_EXECUTE_ONLY,
		C.VM_PROT_EXECUTE | C.VM_PROT_STRIP_READ,
	);
	assertEquals(C.VM_PROT_ALLEXEC_X86_64, C.VM_PROT_EXECUTE | C.VM_PROT_UEXEC);

	assertEquals(
		C.CSSLOT_ALTERNATE_CODEDIRECTORY_LIMIT,
		C.CSSLOT_ALTERNATE_CODEDIRECTORIES +
			C.CSSLOT_ALTERNATE_CODEDIRECTORY_MAX,
	);
});
