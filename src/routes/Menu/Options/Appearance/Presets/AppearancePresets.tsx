import { useNavigate } from "react-router-dom";

export function AppearancePresets(): React.ReactNode {
	const navigate = useNavigate();

	return (
		<div>
			<p>List of presets...</p>
			<button onClick={() => navigate("custom")}>Go to custom themes</button>
		</div>
	);
}
