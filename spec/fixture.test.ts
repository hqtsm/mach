import { fixtureMacho } from './fixture.ts';

Deno.test('fixtureMacho', async () => {
	await fixtureMacho('app', 'arm64', [
		'u/Sample.app/Contents/Info.plist',
		'u/Sample.app/Contents/Frameworks/Sample.framework/Versions/Current',
	]);
});
