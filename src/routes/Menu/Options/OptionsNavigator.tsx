import { useNavigate } from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook'
import "./OptionsNavigator.css"

interface IOptionProperties {
	name: string;
	path: string;
}

function Option({ name, path }: IOptionProperties): React.ReactNode {
	const navigate = useNavigate();

	return (
		<li className="option-item">
			<button
				className="button-subtle"
				onClick={() => navigate(path)}>{name}</button>
			<hr className="regular-separator"></hr>
		</li>
	)
}

export function OptionsNavigator(): React.ReactNode {
	const navigate = useNavigate();
	// Keep the debug menu hidden from the user.
	useHotkeys('shift+d', () => navigate("debug"))
	
	return (
		<ul className="options-list">
			<Option name="General" path="general"/>
			<Option name="Data" path="data"/>
			<Option name="Accounts" path="accounts"/>
			<Option name="Appearance & Themes" path="appearance"/>
		</ul>
	);
}
