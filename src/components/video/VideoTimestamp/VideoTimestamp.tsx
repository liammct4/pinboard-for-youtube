import { useState, useRef, useEffect, MutableRefObject } from "react"
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "./../../../lib/util/time-util.js"
import * as YTUtil from "./../../../lib/youtube-util.js" 
import * as Dialog from "@radix-ui/react-dialog";
import { Timestamp } from "./../../../lib/user/user-data.ts"
import { useForm, SubmitHandler } from "react-hook-form"
import Bin from "src/../assets/icons/bin.svg"
import "src/styles/dialog.css"
import "./VideoTimestamp.css"

type EditTimestampForm = {
	time: string
	message: string
}

export interface IVideoTimestampProperties {
	videoID: string,
	timestamp: Timestamp,
	onChange: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null) => void
}

function validateTimestamp(value: string): boolean {
	try {
		getSecondsFromTimestamp(value);
		return true;
	}
	catch {
		return false;
	}
}

/* "time" is in seconds, not a timestamp. So 1032 seconds total instead of 17:12 for example. */
export function VideoTimestamp({ videoID, timestamp, onChange }: IVideoTimestampProperties): React.ReactNode {
	let { register, handleSubmit } = useForm<EditTimestampForm>();

	const onSave: SubmitHandler<EditTimestampForm> = (data: EditTimestampForm) => {
		let inputTime: number = getSecondsFromTimestamp(data.time);

		onChange(timestamp, { "time": inputTime, "message": data.message });
	}

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
							<form className="dialog-form timestamp-form" id="edit-form" onSubmit={handleSubmit(onSave)}>
								{/* Name */}
								<label>Time:</label>
								<input {...register("time", { validate: value => validateTimestamp(value) })} defaultValue={stringTime}></input>
								{/* Message */}
								<label>Message:</label>
								<input {...register("message")} defaultValue={timestamp.message}></input>
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
