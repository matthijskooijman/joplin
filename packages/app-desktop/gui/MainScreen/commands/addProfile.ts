import { CommandRuntime, CommandDeclaration, CommandContext } from '@joplin/lib/services/CommandService';
import { _ } from '@joplin/lib/locale';
import { createNewProfile, saveProfileConfig } from '@joplin/lib/services/profileConfig';
import Setting from '@joplin/lib/models/Setting';
import bridge from '../../../services/bridge';

export const declaration: CommandDeclaration = {
	name: 'addProfile',
};

export const runtime = (comp: any): CommandRuntime => {
	return {
		execute: async (context: CommandContext) => {
			comp.setState({
				promptOptions: {
					label: _('Profile name:'),
					buttons: ['create', 'cancel'],
					value: '',
					onClose: async (answer: string, buttonType: string) => {
						if (buttonType === 'create') {
							const newConfig = await createNewProfile(context.state.profileConfig, answer);
							newConfig.currentProfile = newConfig.profiles.length - 1;
							await saveProfileConfig(`${Setting.value('rootProfileDir')}/profiles.json`, newConfig);
							bridge().restart();
						}

						comp.setState({ promptOptions: null });
					},
				},
			});
		},
	};
};
