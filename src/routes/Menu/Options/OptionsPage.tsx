import { Outlet, useOutletContext } from "react-router-dom"

export function OptionsPage(): React.ReactNode {
	const setTitle: (title: string) => void = useOutletContext();
		
	return (
		<>
			<Outlet context={setTitle}/>
		</>
	)
}
