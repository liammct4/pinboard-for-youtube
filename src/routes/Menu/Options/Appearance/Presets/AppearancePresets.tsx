import { useContext } from "react"
import { useNavigate } from "react-router-dom";
import { AppTheme } from "../../../../../lib/config/theming/colourTheme";
import { ThemeContext } from "../../../../../context/theme";
import "./AppearancePresets.css"

interface IThemePresetProperties {
	theme: AppTheme;
} 

function ThemePreset({ theme }: IThemePresetProperties): React.ReactNode {
	const { currentTheme, setCurrentTheme } = useContext(ThemeContext);

	return (
		<button data-selected={currentTheme.name == theme.name ? "" : null} className="theme-row" onClick={() => setCurrentTheme(theme)}>
			<h3 className="name">{theme.name}</h3>
			<div className="preview-grid">
				<div style={{ background: theme.palette["primary-common"] }}/>
				<div style={{ background: theme.palette["primary-ultradark"] }}/>
				<div style={{ background: theme.palette["empty-02-raised"] }}/>
				<div style={{ background: theme.palette["empty-01-normal"] }}/>
			</div>
		</button>
	);
}

export function AppearancePresets(): React.ReactNode {
	const navigate = useNavigate();
	const { themes } = useContext(ThemeContext);

	return (
		<>
			<ul className="preset-list">
				{themes.map(x => <li key={x.name}><ThemePreset theme={x}/></li>)}
			</ul>
			<button onClick={() => navigate("custom")}>Go to custom themes</button>
		</>
	);
}
