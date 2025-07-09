import { useNavigate } from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook'
import styles from "./OptionsNavigator.module.css"
import { SubtleButton } from "../../../components/interactive/buttons/SubtleButton/SubtleButton";
import { ButtonPanel } from "../../../components/interactive/ButtonPanel/ButtonPanel";

interface IOptionProperties {
	name: string;
	path: string;
}

function Option({ name, path }: IOptionProperties): React.ReactNode {
	const navigate = useNavigate();

	return (
		<li className={styles.optionItem}>
			<SubtleButton className={styles.optionButton} onClick={() => navigate(path)}>{name}</SubtleButton>
			<hr className={`${styles.regularSeparator} regular-separator`}></hr>
		</li>
	)
}

export function OptionsNavigator(): React.ReactNode {
	const navigate = useNavigate();
	// Keep the debug menu hidden from the user.
	useHotkeys('shift+d', () => navigate("debug"))
	
	return (
		<ButtonPanel direction="Vertical">
			<ul className={styles.optionsList}>
				<Option name="About & Help" path="help"/>
				<Option name="General" path="general"/>
				<Option name="Data" path="data"/>
				<Option name="Accounts" path="accounts"/>
				<Option name="Appearance & Themes" path="appearance"/>
			</ul>
		</ButtonPanel>
	);
}
