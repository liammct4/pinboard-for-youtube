/// <reference types="vite-plugin-svgr/client" />

import { createContext, useContext } from "react";
import BlankSVG from "./../../../../assets/blankSVG.svg?react"
import ErrorIcon from "./../../../../assets/icons/status/error.svg?react"
import InfoIcon from "./../../../../assets/icons/status/info.svg?react"
import TickIcon from "./../../../../assets/icons/status/tick.svg?react"
import WarningIcon from "./../../../../assets/icons/status/warning.svg?react"
import InternetGlobeIcon from "./../../../../assets/icons/status/internet.svg?react"
import { Asset } from "../../images/svgAsset";

export type ColourType = "Blank" | "Success" | "Warning" | "Info" | "Error";
export type ImageName = "None" | "Tick" | "Warning" | "Error" | "Info" | "InternetGlobe";
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
	cancelCurrentNotification: () => void;
}

/**
 * Displays a global notification message at the bottom of the page.
 * @returns A function to activate the message.
 */
export function useNotificationMessage() {
	const { setGlobalNotification, cancelCurrentNotification } = useContext(GlobalNotificationContext);

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

		let newNotification: IGlobalNotification = { title, message, colour, image, endDate, animation };
		setGlobalNotification(newNotification);
	}

	return { activateMessage, cancelCurrentNotification }
}

/*
 * Displays a generic error notification.
 */
export function useGenericErrorMessage() {
	const { activateMessage } = useNotificationMessage();

	const activateError = () => {
		activateMessage(
			"Something went wrong",
			"Something went wrong when trying to contact the server. Please try again later.",
			"Error",
			"Error",
			7000
		);
	}

	return { activateError }
}

export function useMappedAssetIcon(image: ImageName): Asset {
	switch (image) {
		case "None":
			return BlankSVG;
		case "Error":
			return ErrorIcon;
		case "Info":
			return InfoIcon;
		case "Tick":
			return TickIcon;
		case "Warning":
			return WarningIcon;
		case "InternetGlobe":
			return InternetGlobeIcon;
	}
}

export const GlobalNotificationContext = createContext<IGlobalNotificationContext>({
	currentNotification: undefined,
	setGlobalNotification: () => null,
	cancelCurrentNotification: () => null
});
