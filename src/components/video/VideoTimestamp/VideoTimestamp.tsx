import { useCallback, useContext } from "react"
import { VideoListContext } from "../../../context/video.ts";
import * as YTUtil from "./../../../lib/util/youtube/youtubeUtil.ts" 
import { setCurrentVideoTime } from "../../../lib/browser/youtube.ts";
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "./../.../../../../lib/util/generic/timeUtil.ts"
import { Timestamp, cloneModifyTimestamp } from "../../../lib/video/video.ts";
import { IErrorFieldValues, useValidatedForm } from "../../forms/validated-form.ts";
import { FormField } from "../../forms/FormField/FormField.tsx";
import { Reorder } from "framer-motion";
import { FormDialog } from "../../dialogs/FormDialog.tsx";
import Bin from "src/../assets/icons/bin.svg"
import JumpVideoIcon from "./../../../../assets/icons/jump_icon.svg"
import JumpVideoIconOff from "./../../../../assets/icons/jump_icon_off.svg"
import "src/styling/dialog.css"
import "./VideoTimestamp.css"

interface IEditTimestampForm extends IErrorFieldValues {
	time: string
	message: string
}

export interface IVideoTimestampProperties {
	videoID: string;
	timestamp: Timestamp;
	onChange: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => void;
}

function validateTimestamp(value: string): string | null {
	if (value.length == 0) {
		return "This value is required.";
	}

	try {
		getSecondsFromTimestamp(value);
	}
	catch {
		return "Invalid value provided.";
	}

	return null;
}

/* "time" is in seconds, not a timestamp. So 1032 seconds total instead of 17:12 for example. */
export function VideoTimestamp({ videoID, timestamp, onChange }: IVideoTimestampProperties): React.ReactNode {
	const { activeVideoID } = useContext(VideoListContext);
	
	let onSave = useCallback((data: IEditTimestampForm) => {
		let inputTime: number = getSecondsFromTimestamp(data.time);

		onChange(timestamp, cloneModifyTimestamp(timestamp, inputTime, data.message));
	}, []);

	const onDelete: () => void = () => {
		onChange(timestamp, null);
	}
	
	const onJumpToTimestamp: () => void = () => {
		setCurrentVideoTime(timestamp.time);
	}
	let { register, handleSubmit, handler, submit } = useValidatedForm<IEditTimestampForm>(onSave);

	let isActiveId = activeVideoID == videoID;
	let stringTime: string = getTimestampFromSeconds(timestamp.time);
	let timeLink: string = YTUtil.getTimestampVideoLinkFromSeconds(videoID, timestamp.time);

	return (
		<Reorder.Item value={timestamp} id={timestamp.id}>
			<div className="timestamp-inner">
				<button className="square-button button-small" type="button" onClick={onJumpToTimestamp} disabled={!isActiveId} aria-label="Set current video position to timestamp button.">
					<img src={isActiveId ? JumpVideoIcon : JumpVideoIconOff} alt="Play button icon."></img>
				</button>
				<a className="timestamp-text" href={timeLink}>{stringTime}</a>
				<p className="message-text">{timestamp.message}</p>
				<div style={{ flexGrow: "1" }}></div>
				<button className="square-button button-small delete-timestamp-button" onClick={onDelete} aria-label="Delete the current timestamp.">
					<img className="bin-icon" src={Bin} alt="Delete icon."/>
				</button>
				{/* Edit dialog */}
				<FormDialog
					formID="edit-timestamp-form"
					formTitle="Edit timestamp"
					submitText="Save"
					trigger={<button className="edit-button button-small">Edit</button>}
					handleSubmit={handleSubmit(handler)}>
						{/* Time */}
						<FormField<IEditTimestampForm> register={register} registerOptions={null}
							label="Time:"
							name="time"
							size="small"
							selector={(data) => data.time}
							submitEvent={submit.current}
							validationMethod={validateTimestamp}
							defaultValue={stringTime}/>
						{/* Message */}
						<FormField<IEditTimestampForm> register={register} registerOptions={null}
							label="Message:"
							name="message"
							size="large"
							selector={(data) => data.message}
							submitEvent={submit.current}
							defaultValue={timestamp.message}/>
				</FormDialog>
			</div>
		</Reorder.Item>
	);
}

export default VideoTimestamp;
