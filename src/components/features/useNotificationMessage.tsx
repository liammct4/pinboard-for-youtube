import { createContext, useContext } from "react";

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

export const GlobalNotificationContext = createContext<IGlobalNotificationContext>({
	currentNotification: undefined,
	setGlobalNotification: () => null,
	cancelNotification: () => null
});
