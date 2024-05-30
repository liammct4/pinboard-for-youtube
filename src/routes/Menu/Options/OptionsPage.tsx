import { Outlet, useOutletContext } from "react-router-dom"
import { IErrorFieldValues } from "../../../components/forms/validated-form";

export interface IOptionsConfigForm extends IErrorFieldValues {
	valueStr: string;
	valueNum: number;
	valueColour: string;
}

export function OptionsPage(): React.ReactNode {
	const setTitle: (title: string) => void = useOutletContext();
		
	return (
		<>
			<Outlet context={setTitle}/>
		</>
	)
}
