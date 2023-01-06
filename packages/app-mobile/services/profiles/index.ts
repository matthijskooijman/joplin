// Helper functions to reduce the boiler plate of loading and saving profiles on
// mobile

import { Profile, ProfileConfig } from '@joplin/lib/services/profileConfig/types';
import { loadProfileConfig as libLoadProfileConfig, saveProfileConfig as libSaveProfileConfig } from '@joplin/lib/services/profileConfig/index';
import RNFetchBlob from 'rn-fetch-blob';

export const getProfilesRootDir = () => {
	return RNFetchBlob.fs.dirs.DocumentDir;
};

export const getProfilesConfigPath = () => {
	return `${getProfilesRootDir()}/profiles.json`;
};

export const getResourceDir = (profile: Profile, isSubProfile: boolean) => {
	if (!isSubProfile) return getProfilesRootDir();
	return `${getProfilesRootDir()}/resources-${profile.id}`;
};

export const getDatabaseName = (profile: Profile, isSubProfile: boolean) => {
	if (!isSubProfile) return 'joplin.sqlite';
	return `joplin-${profile.id}.sqlite`;
};

export const loadProfileConfig = async () => {
	return libLoadProfileConfig(getProfilesConfigPath());
};

export const saveProfileConfig = async (profileConfig: ProfileConfig) => {
	return libSaveProfileConfig(getProfilesConfigPath(), profileConfig);
};
