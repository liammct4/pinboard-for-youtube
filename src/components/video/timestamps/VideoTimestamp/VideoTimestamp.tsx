/// <reference types="vite-plugin-svgr/client" />

import { useCallback } from "react"
import * as YTUtil from "../../../../lib/util/youtube/youtubeUtil.ts" 
import { setCurrentVideoTime } from "../../../../lib/browser/youtube.ts";
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "../../../../lib/util/generic/timeUtil.ts"
import { Timestamp, cloneModifyTimestamp } from "../../../../lib/video/video.ts";
import { IErrorFieldValues, useValidatedForm } from "../../../forms/validated-form.ts";
import { FormField } from "../../../forms/FormField/FormField.tsx";
import { FormDialog } from "../../../dialogs/FormDialog.tsx";
import BinIcon from "./../../../../../assets/icons/bin.svg?react"
import JumpVideoIcon from "./../../../../../assets/icons/jump_icon.svg?react"
import { IconContainer } from "../../../images/svgAsset.tsx";
import "src/styling/dialog.css"
import "./VideoTimestamp.css"

interface IEditTimestampForm extends IErrorFieldValues {
	time: string
	message: string
}

export interface IVideoTimestampProperties {
	className?: string;
	videoID: string;
	timestamp: Timestamp;
	allowControls: boolean;
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
export function VideoTimestamp({ className, videoID, timestamp, onChange, allowControls }: IVideoTimestampProperties): React.ReactNode {
	const activeVideoID = "";
	
	const onSave = useCallback((data: IEditTimestampForm) => {
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
		<li className={`${className} timestamp-inner`}>
			<button className="square-button button-base button-small" type="button" onClick={onJumpToTimestamp} disabled={!isActiveId} aria-label="Set current video position to timestamp button.">
				<IconContainer className="" asset={JumpVideoIcon} manual-fill={isActiveId ? "--pfy-content-shade-standard" : "--pfy-content-shade-faded"}/>
			</button>
			<a className="link-text timestamp-text" href={timeLink}>{stringTime}</a>
			<div>
				<span className="message-text">{timestamp.message}</span>
			</div>
			{
				allowControls ?
					<>
						<button className="square-button button-base button-small delete-timestamp-button" onClick={onDelete} aria-label="Delete the current timestamp.">
							<IconContainer
								className="bin-icon icon-colour-standard"
								asset={BinIcon}
								use-stroke/>
						</button>
						{/* Edit dialog */}
						<FormDialog
							formID="edit-timestamp-form"
							formTitle="Edit timestamp"
							submitText="Save"
							labelSize="small"
							trigger={<button className="edit-button button-base button-small">Edit</button>}
							handleSubmit={handleSubmit(handler)}>
								{/* Time */}
								<FormField<IEditTimestampForm> register={register} registerOptions={null}
									label="Time:"
									name="time"
									fieldSize="small"
									selector={(data) => data.time}
									submitEvent={submit.current}
									validationMethod={validateTimestamp}
									defaultValue={stringTime}/>
								{/* Message */}
								<FormField<IEditTimestampForm> register={register} registerOptions={null}
									label="Message:"
									name="message"
									fieldSize="large"
									selector={(data) => data.message}
									submitEvent={submit.current}
									defaultValue={timestamp.message}/>
						</FormDialog>
					</>
					:
					<></>
			}
		</li>
	);
}
