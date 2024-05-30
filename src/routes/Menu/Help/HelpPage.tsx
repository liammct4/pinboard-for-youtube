import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"

export function HelpPage(): React.ReactNode {
	const setTitle: (title: string) => void = useOutletContext();
	
	useEffect(() => setTitle("Help"), []);

	return (
		<>
			<p>The help page...</p>
		</>
	);
}
