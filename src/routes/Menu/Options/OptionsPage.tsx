import { useOutletContext } from "react-router-dom"

export function OptionsPage(): React.ReactNode {
	const setTitle: (title: string) => void = useOutletContext();
	setTitle("Options");
	
	return (
		<>
			<p>The options page...</p>
		</>
	)
}

export default OptionsPage;
