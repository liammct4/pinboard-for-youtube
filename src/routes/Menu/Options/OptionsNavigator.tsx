import { useNavigate } from "react-router-dom";
import styles from "./OptionsNavigator.module.css"
import { SubtleButton } from "../../../components/interactive/buttons/SubtleButton/SubtleButton";
import { ButtonPanel } from "../../../components/interactive/ButtonPanel/ButtonPanel";
import { useDialogPausedHotkeys } from "../../../components/dialogs/useDialogPausedHotkeys";

interface IOptionProperties {
	name: string;
	path: string;
	autoFocus?: boolean;
}

function Option({ name, path, autoFocus }: IOptionProperties): React.ReactNode {
	const navigate = useNavigate();

	return (
		<li className={styles.optionItem}>
			<SubtleButton autoFocus={autoFocus} className={styles.optionButton} onClick={() => navigate(path)}>{name}</SubtleButton>
			<hr className={`${styles.regularSeparator} regular-separator`}></hr>
		</li>
	)
}

export function OptionsNavigator(): React.ReactNode {
	const navigate = useNavigate();
	// Keep the debug menu hidden from the user.
	useDialogPausedHotkeys('shift+d', () => navigate("debug"))
	
	return (
		<ButtonPanel direction="Vertical">
			<ul className={styles.optionsList}>
				<Option name="About & Help" path="help" autoFocus/>
				<Option name="General" path="general"/>
				<Option name="Data" path="data"/>
				<Option name="Accounts" path="accounts"/>
				<Option name="Appearance & Themes" path="appearance"/>
			</ul>
		</ButtonPanel>
	);
}
