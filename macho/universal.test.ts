import { fixtureMacho, fixtureMachos } from '../spec/fixture.ts';
import { Universal } from './universal.ts';

const fixtures = fixtureMachos();

for (const { kind, arch, file } of fixtures) {
	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const blob = new Blob([macho]);
		const uni = new Universal();

		await uni.open(blob);
	});
}
