import { useState, useRef, useEffect, MutableRefObject, useCallback } from "react"
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "./../../../lib/util/time-util.js"
import * as YTUtil from "./../../../lib/youtube-util.js" 
import * as Dialog from "@radix-ui/react-dialog";
import { Timestamp } from "./../../../lib/user/user-data.ts"
import { useForm, SubmitHandler } from "react-hook-form"
import Bin from "src/../assets/icons/bin.svg"
import { FormField } from "../../forms/FormField/FormField.tsx";
import { IErrorFieldValues, useValidatedForm } from "../../forms/validated-form.ts";
import "src/styles/dialog.css"
import "./VideoTimestamp.css"

interface IEditTimestampForm extends IErrorFieldValues {
	time: string
	message: string
}

export interface IVideoTimestampProperties {
	videoID: string,
	timestamp: Timestamp,
	onChange: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => void
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
	let onSave = useCallback((data: IEditTimestampForm) => {
		let inputTime: number = getSecondsFromTimestamp(data.time);

		onChange(timestamp, { "time": inputTime, "message": data.message });
	}, []);
	let { register, handleSubmit, handler, submit } = useValidatedForm<IEditTimestampForm>(onSave);

	const onDelete: () => void = () => {
		onChange(timestamp, null);
	}
	
	let stringTime: string = getTimestampFromSeconds(timestamp.time);
	let timeLink: string = YTUtil.getTimestampVideoLinkFromSeconds(videoID, timestamp.time);

	return (
		<div className="video-timestamp-inner">
			<a className="video-timestamp-time" href={timeLink}>{stringTime}</a>
			<p className="video-timestamp-message">{timestamp.message}</p>
			<div className="video-timestamp-filler"></div>
			<button className="button-small delete-timestamp-button" onClick={onDelete}>
				<img className="delete-timestamp-icon" src={Bin}/>
			</button>
			{/* Edit dialog */}
			<Dialog.Root>
				<Dialog.Trigger asChild>
					<button className="button-small" style={{ marginRight: "1px" }}>Edit</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="dialog-overlay" />
					<Dialog.Content className="dialog-body">
						<Dialog.Title className="dialog-header">Edit timestamp</Dialog.Title>
						<div className="dialog-content">
							<form className="dialog-form timestamp-form" id="edit-form" onSubmit={handleSubmit(handler)}>
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
								<Dialog.Close asChild>
									<button type="button" className="circle-button close-button" aria-label="Close">&times;</button>
								</Dialog.Close>
							</form>
						</div>
						<div className="dialog-footer">
							<input type="submit" value="Save" form="edit-form" className="button-small"></input>
							<Dialog.Close asChild>
								<button type="button" className="button-small">Close</button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}

export default VideoTimestamp;
