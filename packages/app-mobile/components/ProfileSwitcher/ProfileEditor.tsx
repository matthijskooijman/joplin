const React = require('react');
import { useCallback, useEffect, useMemo, useState } from 'react';
const { View, StyleSheet } = require('react-native');
import createRootStyle from '../../utils/createRootStyle';
import ScreenHeader from '../ScreenHeader';
import { _ } from '@joplin/lib/locale';
import { loadProfileConfig, saveProfileConfig } from '../../services/profiles';
import { createNewProfile } from '@joplin/lib/services/profileConfig';
import useProfileConfig from './useProfileConfig';
const { TextInput } = require('react-native-paper');

interface NavigationState {
	profileId: string;
}

interface Navigation {
	state: NavigationState;
}

interface Props {
	themeId: number;
	dispatch: Function;
	navigation: Navigation;
}

const useStyle = (themeId: number) => {
	return useMemo(() => {
		return StyleSheet.create({
			...createRootStyle(themeId),
		});
	}, [themeId]);
};

export default (props: Props) => {
	const profileId = props.navigation.state?.profileId;
	const isNew = !profileId;
	const profileConfig = useProfileConfig(Date.now());

	const style = useStyle(props.themeId);
	const [name, setName] = useState('');

	const profile = !isNew && profileConfig ? profileConfig.profiles.find(p => p.id === profileId) : null;

	useEffect(() => {
		if (!profile) return;
		setName(profile.name);
	}, [profile]);

	const onSaveButtonPress = useCallback(async () => {
		if (isNew) {
			const profileConfig = await loadProfileConfig();
			const result = createNewProfile(profileConfig, name);
			await saveProfileConfig(result.newConfig);
		} else {
			profile.name = name;
			await saveProfileConfig(profileConfig);
		}

		props.dispatch({
			type: 'NAV_BACK',
		});
	}, [name, isNew, profileConfig, profile, props.dispatch]);

	return (
		<View style={style.root}>
			<ScreenHeader title={isNew ? _('Create new profile...') : _('Edit profile')} onSaveButtonPress={onSaveButtonPress} showSaveButton={true} showSideMenuButton={false} showSearchButton={false} />
			<View style={{}}>
				<TextInput label={_('Profile name')}
					value={name}
					onChangeText={(text: string) => setName(text)}
				/>
			</View>
		</View>
	);
};
