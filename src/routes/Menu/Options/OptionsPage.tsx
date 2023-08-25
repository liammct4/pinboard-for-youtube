import { useEffect } from "react";
import { useOutletContext } from "react-router-dom"
import { IErrorFieldValues, useValidatedForm } from "../../../components/forms/validated-form";
import { FormField } from "../../../components/forms/FormField/FormField";
import { InputMethodType } from "../../../lib/config/configurationOption";

export interface IOptionsConfigForm extends IErrorFieldValues {
	valueStr: string;
	valueNum: number;
	valueColour: string;
}

export function OptionsPage(): React.ReactNode {
	const setTitle: (title: string) => void = useOutletContext();
	const { register, handleSubmit, handler, submit } = useValidatedForm<IOptionsConfigForm>((data: IOptionsConfigForm) => {
		console.log(data);
	});
	
	useEffect(() => setTitle("Options"), []);
	
	return (
		<>
			{/* Just a test form. */}
			<form style={{display: "flex", flexDirection: "column", gap: "var(--pfy-spacing-standard-compact)" }} id="test-options-form" onSubmit={handleSubmit(handler)}>
				<FormField<IOptionsConfigForm>
					label="String:"
					name="valueStr"
					register={register}
					selector={(data: IOptionsConfigForm) => data.valueStr}
					size="max"
					submitEvent={submit.current}
					inputType={InputMethodType.Text}
					/>
				<FormField<IOptionsConfigForm>
					label="Number:"
					name="valueNum"
					register={register}
					selector={(data: IOptionsConfigForm) => data.valueStr}
					size="max"
					submitEvent={submit.current}
					inputType={InputMethodType.Numeric}
					/>
				<FormField<IOptionsConfigForm>
					label="Colour:"
					name="valueColour"
					register={register}
					selector={(data: IOptionsConfigForm) => data.valueStr}
					size="max"
					submitEvent={submit.current}
					inputType={InputMethodType.Colour}
					/>
			</form>
			<input type="submit" value="Submit Changes" form="test-options-form" className="button-small"/>
		</>
	)
}

export default OptionsPage;
