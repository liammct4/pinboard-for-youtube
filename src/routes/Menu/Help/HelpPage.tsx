import { useOutletContext } from "react-router-dom";

export function HelpPage(): React.ReactNode {
	const setTitle: (title: string) => void = useOutletContext();
	setTitle("Help");

	return (
		<>
			<p>The help page...</p>
		</>
	);
}

export default HelpPage;
