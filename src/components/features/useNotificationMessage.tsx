import { createContext, useContext } from "react";
import { ReactComponent as ErrorIcon } from "./../../../assets/icons/status/error.svg"
import { ReactComponent as InfoIcon } from "./../../../assets/icons/status/info.svg"
import { ReactComponent as TickIcon } from "./../../../assets/icons/status/tick.svg"
import { ReactComponent as WarningIcon } from "./../../../assets/icons/status/warning.svg"
import { Asset } from "../images/svgAsset";

export type ColourType = "Success" | "Warning" | "Info" | "Error";
export type ImageName = "Tick" | "Warning" | "Error" | "Info";
export type AnimationName = "Slide" | "Shake";

export interface IGlobalNotification {
	title: string | undefined;
	message: string;
	colour: ColourType;
	image: ImageName;
	// Undefined means that the message never expires.
	endDate: Date | undefined;
	animation: AnimationName;
}

export interface IGlobalNotificationContext {
	currentNotification: IGlobalNotification | undefined,
	setGlobalNotification: (notification: IGlobalNotification) => void;
	cancelNotification: () => void;
}

/**
 * Displays a global notification message at the bottom of the page.
 * @returns A function to activate the message.
 */
export function useNotificationMessage() {
	const { setGlobalNotification, cancelNotification } = useContext(GlobalNotificationContext);

	const activateMessage = (
		title: string | undefined,
		message: string,
		colour: ColourType,
		image: ImageName,
		duration: number | undefined | -1,
		animation: AnimationName = "Slide"
	) => {
		let endDate = undefined;

		if (duration != undefined && duration != -1) {
			endDate = new Date(Date.now() + duration)
		}

		setGlobalNotification({ title, message, colour, image, endDate, animation });
	}

	return { activateMessage, cancelMessage: cancelNotification }
}

/*
 * Displays a generic error notification.
 */
export function useGenericErrorMessage() {
	const { activateMessage, cancelMessage } = useNotificationMessage();

	const activateError = () => {
		activateMessage(
			"Something went wrong",
			"Something went wrong when trying to contact the server. Please try again later.",
			"Error",
			"Error",
			7000
		);
	}

	return { activateError, cancelMessage }
}

export function useMappedAssetIcon(image: ImageName): Asset {
	switch (image) {
		case "Error":
			return ErrorIcon;
		case "Info":
			return InfoIcon;
		case "Tick":
			return TickIcon;
		case "Warning":
			return WarningIcon;
	}
}

export const GlobalNotificationContext = createContext<IGlobalNotificationContext>({
	currentNotification: undefined,
	setGlobalNotification: () => null,
	cancelNotification: () => null
});
