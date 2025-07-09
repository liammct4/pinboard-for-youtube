/// <reference types="vite-plugin-svgr/client" />

import * as YTUtil from "../../../../lib/util/youtube/youtubeUtil.ts" 
import { setCurrentVideoTime } from "../../../../lib/browser/youtube.ts";
import { getSecondsFromTimestamp, getTimestampFromSeconds } from "../../../../lib/util/generic/timeUtil.ts"
import { Timestamp } from "../../../../lib/video/video.ts";
import { FormDialog } from "../../../dialogs/FormDialog.tsx";
import BinIcon from "./../../../../../assets/icons/bin.svg?react"
import AutoplayIcon from "./../../../../../assets/icons/autoplay.svg?react"
import JumpVideoIcon from "./../../../../../assets/icons/jump_icon.svg?react"
import { IconContainer } from "../../../images/svgAsset.tsx";
import "src/styling/dialog.css"
import "./VideoTimestamp.css"
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store.ts";
import { TextInput } from "../../../input/TextInput/TextInput.tsx";
import { SmallButton } from "../../../interactive/buttons/SmallButton/SmallButton.tsx";
import { ButtonPanel } from "../../../interactive/ButtonPanel/ButtonPanel.tsx";
import { ValidatorResult } from "../../../forms/ValidatedForm.tsx";
import { SwitchInput } from "../../../input/SwitchInput/SwitchInput.tsx";
import { LinkText } from "../../../interactive/LinkText/LinkText.tsx";

type EditTimestampFormNames = "time" | "message" | "isAutoplay";
type EditTimestampForm = {
	time: string;
	message: string;
	isAutoplay: boolean;
}

export interface IVideoTimestampProperties {
	className?: string;
	videoID: string;
	timestamp: Timestamp;
	isAutoplay: boolean;
	onAutoplayClick: (value: boolean) => void;
	allowControls: boolean;
	onChange: (oldTimestamp: Timestamp, newTimestamp: Timestamp | null, autoplay: boolean) => void;
}

function validateTimestamp(value: string): ValidatorResult<EditTimestampFormNames> {
	if (value.length == 0) {
		return {
			error: true,
			details: {
				name: "time",
				message: "This value is required."
			}
		};
	}

	try {
		getSecondsFromTimestamp(value);
	}
	catch {
		return {
			error: true,
			details: {
				name: "time",
				message: "Invalid value provided."
			}
		};
	}

	return { error: false };
}

/* "time" is in seconds, not a timestamp. So 1032 seconds total instead of 17:12 for example. */
export function VideoTimestamp({ className, videoID, timestamp, isAutoplay, onAutoplayClick, onChange, allowControls }: IVideoTimestampProperties): React.ReactNode {
	const activeVideoID = useSelector((state: RootState) => state.video.activeVideoID);
	const { autoplayTimestamp } = useSelector((state: RootState) => state.video.videos[videoID]!);
	const { timestampStyle } = useSelector((state: RootState) => state.tempState.layout);
	const onDelete: () => void = () => {
		onChange(timestamp, null, false);
	}

	const onSave = (data: EditTimestampForm) => {
		onChange(timestamp, {
			...timestamp,
			message: data.message,
			time: getSecondsFromTimestamp(data.time)
		}, data.isAutoplay);
	}
	
	const onJumpToTimestamp: () => void = () => {
		setCurrentVideoTime(timestamp.time);
	}

	let isActiveId = activeVideoID == videoID;
	let stringTime: string = getTimestampFromSeconds(timestamp.time);
	let timeLink: string = YTUtil.getTimestampVideoLinkFromSeconds(videoID, timestamp.time);

	return (
		<li className={`${className} timestamp-inner`} data-style={timestampStyle}>
			{timestampStyle == "FULL" ?
				<SmallButton square type="button" onClick={onJumpToTimestamp} disabled={!isActiveId} aria-label="Set current video position to timestamp button.">
					<IconContainer className="" asset={JumpVideoIcon} manual-fill={isActiveId ? "--pfy-content-shade-standard" : "--pfy-content-shade-faded"}/>
				</SmallButton>
				: <></>
			}
			<LinkText className="timestamp-text" href={timeLink}>{stringTime}</LinkText>
			<div>
				<span className="message-text" title={`${stringTime}: ${timestamp.message}`}>{timestamp.message}</span>
			</div>
			{
				timestampStyle == "FULL" && allowControls ?
					<ButtonPanel>
						<SmallButton
							onClick={() => onAutoplayClick(!isAutoplay)}
							circle
							title="Set this timestamp to be an automatically update as the video progresses (Auto timestamp)."
							data-active-toggle={isAutoplay}>
							<IconContainer
								className="autoplay-icon icon-colour-standard"
								asset={AutoplayIcon}
								use-fill
								use-stroke
								data-active-toggle={isAutoplay}/>
						</SmallButton>
						<SmallButton square onClick={onDelete} aria-label="Delete the current timestamp.">
							<IconContainer
								className="bin-icon icon-colour-standard"
								asset={BinIcon}
								use-stroke/>
						</SmallButton>
						{/* Edit dialog */}
						<FormDialog<EditTimestampForm, EditTimestampFormNames>
							name="edit-timestamp-form"
							title="Edit timestamp"
							submitText="Save"
							labelSize="medium"
							trigger={<SmallButton className="edit-button">Edit</SmallButton>}
							onSuccess={onSave}
							fieldData={[
								{
									name: "time",
									validator: validateTimestamp
								}
							]}>
								<TextInput<EditTimestampFormNames>
									label="Time:"
									title="The timestamp in the format HH:MM:SS."
									name="time"
									fieldSize="small"
									startValue={stringTime}/>
								<TextInput<EditTimestampFormNames>
									label="Message:"
									title="The message associated with this timestamp, will show up in the timeline if enabled."
									name="message"
									fieldSize="large"
									startValue={timestamp.message}/>
								<SwitchInput<EditTimestampFormNames>
									label="Will autoplay:"
									title="Determines whether this timestamp will automatically follow along as the video progresses."
									name="isAutoplay"
									fieldSize="very small"
									startValue={String(autoplayTimestamp == timestamp.id)}/>
						</FormDialog>
					</ButtonPanel>
					:
					<></>
			}
		</li>
	);
}
