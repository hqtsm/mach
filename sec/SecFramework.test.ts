import { assertEquals } from '@std/assert';
import {
	SecFrameworkCopyLocalizedString,
	SecString,
	SecStringFromTable,
	SecStringWithDefaultValue,
} from './SecFramework.ts';

Deno.test('SecString', () => {
	assertEquals(SecString('key', 'comment'), 'key');
});

Deno.test('SecStringFromTable', () => {
	assertEquals(SecStringFromTable('key', 'table', 'comment'), 'key');
});

Deno.test('SecStringWithDefaultValue', () => {
	assertEquals(
		SecStringWithDefaultValue('key', 'table', 0, 'value', 'comment'),
		'key',
	);
});

Deno.test('SecFrameworkCopyLocalizedString', () => {
	assertEquals(SecFrameworkCopyLocalizedString('key', 'table'), 'key');
});
