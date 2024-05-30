import { useParams } from "react-router-dom";
import { SplitHeading } from "../../../components/presentation/SplitHeading/SplitHeading";
import { IErrorFieldValues, useValidatedForm } from "../../../components/forms/validated-form";
import { FormField } from "../../../components/forms/FormField/FormField";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { FormStyleContext } from "../../../components/input/formStyleContext";
import { addTagDefinition } from "../../../features/videos/videoSlice";
import { TagDefinition } from "../../../lib/video/video";
import "./EditTagPage.css"

interface IModifyTagForm extends IErrorFieldValues {
	name: string;
}

export function EditTagPage(): React.ReactNode {
	const { tagId } = useParams();
	const tags = useSelector((state: RootState) => state.video.tagDefinitions);
	const tagDefinition = tags.find(x => x.id == tagId)!;
	const dispatch = useDispatch();
	const modifySubmitHandler = (data: IModifyTagForm) => {
		let updatedTag: TagDefinition = {
			...tagDefinition,
			name: data.name
		}

		dispatch(addTagDefinition(updatedTag));
	};
	const { register, handleSubmit, handler, submit } = useValidatedForm<IModifyTagForm>(modifySubmitHandler);

	return (
		<>
			<SplitHeading text="Modify Tag"/>
			<form className="modify-tag-form" id="modify-tag-form" onSubmit={handleSubmit(handler)}>
				<FormStyleContext.Provider value={{ labelSize: "medium" }}>
					<FormField<IModifyTagForm>
						label="Name"
						name="name"
						register={register}
						selector={(data: IModifyTagForm) => data.name}
						inputType="Text"
						submitEvent={submit.current}
						fieldSize="large"
						defaultValue={tagDefinition?.name}
						validationMethod={(value: string) => {
							if (tags.find(x => x.name == value && x.id != tagId) != null) {
								return "That tag already exists.";
							}

							return null;
						}}/>
				</FormStyleContext.Provider>
			</form>
			<input className="button-base button-small" type="submit" form="modify-tag-form" value="Save Changes"/>
		</>
	);
}
