import { useContext, useEffect, useState } from "react";
import { ValidatedFormErrorContext } from "../../ValidatedForm";
import { ErrorBubble } from "../ErrorBubble/ErrorBubble";
import "./FieldErrorContainer.css"

export interface IFieldErrorContainerProperties {
	name: string;
	children: JSX.Element;
}

export function FieldErrorContainer({ name, children }: IFieldErrorContainerProperties) {
	const { errorList, submitCounter } = useContext(ValidatedFormErrorContext);
	const [ overrideClose, setOverrideClose ] = useState<boolean>(false);
	useEffect(() => {
		setOverrideClose(false);
	}, [submitCounter]);
	const error = errorList.find(e => e.name == name);

	return (
		<div className="error-container">
			{children}
			{
				error != null && !overrideClose ?
					<ErrorBubble onClose={() => setOverrideClose(true)}>{error.message}</ErrorBubble> :
					<></>
			}
		</div>
	)
}
