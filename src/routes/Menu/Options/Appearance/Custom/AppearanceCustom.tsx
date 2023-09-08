import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ThemeContext } from "../../../../../context/theme";

export function AppearanceCustom(): React.ReactNode {
	const { themes } = useContext(ThemeContext);
	const { id } = useParams();
	
	return (
		<div>
			<p>AppearanceCustom {id}</p>
		</div>
	);
}
