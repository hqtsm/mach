import { constant } from '@hqtsm/struct';
import { kSecCodeMagicRequirementSet } from '../const.ts';
import {
	type SuperBlobCoreConstructor,
	templateSuperBlobCore,
} from './superblobcore.ts';

const SuperBlobCore: SuperBlobCoreConstructor<
	Requirements,
	typeof kSecCodeMagicRequirementSet
> = templateSuperBlobCore(
	() => Requirements,
	kSecCodeMagicRequirementSet,
);

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlobCore {
	declare public readonly ['constructor']: Omit<typeof Requirements, 'new'>;

	static {
		constant(this, 'typeMagic');
	}
}
