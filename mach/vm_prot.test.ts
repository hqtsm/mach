import { assertEquals } from '@std/assert';
import {
	VM_PROT_ALL,
	VM_PROT_ALLEXEC_X86_64,
	VM_PROT_DEFAULT,
	VM_PROT_EXECUTE,
	VM_PROT_EXECUTE_ONLY,
	VM_PROT_READ,
	VM_PROT_STRIP_READ,
	VM_PROT_UEXEC,
	VM_PROT_WRITE,
} from './vm_prot.ts';

Deno.test('constant expressions', () => {
	assertEquals(VM_PROT_DEFAULT, VM_PROT_READ | VM_PROT_WRITE);
	assertEquals(VM_PROT_ALL, VM_PROT_READ | VM_PROT_WRITE | VM_PROT_EXECUTE);
	assertEquals(VM_PROT_EXECUTE_ONLY, VM_PROT_EXECUTE | VM_PROT_STRIP_READ);
	assertEquals(VM_PROT_ALLEXEC_X86_64, VM_PROT_EXECUTE | VM_PROT_UEXEC);
});
