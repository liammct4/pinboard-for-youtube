import { useContext } from "react";
import { AnimationName, ColourType, GlobalNotificationContext, IGlobalNotificationContext, ImageName } from "../features/useNotificationMessage";
import { IconContainer } from "../images/svgAsset";
import { ReactComponent as CloseIcon } from "./../../../assets/symbols/cross.svg" 
import * as Toast from "@radix-ui/react-toast";
import "./NotificationToast.css"

export interface INotificationToastProperties {
	isOpen: boolean;
	title: string;
	message: string;
	image: ImageName;
	colour: ColourType;
	animationType: AnimationName;
}

export function NotificationToast({ isOpen, title, message, colour, image, animationType = "Slide" }: INotificationToastProperties): React.ReactNode {
	const { cancelNotification } = useContext<IGlobalNotificationContext>(GlobalNotificationContext);

	return (
		<>
			<Toast.Root className="notification-root" open={isOpen} data-colour={colour} data-animation={animationType}>
				<hr className="notification-separator"/>
				<div className="notification-interior">
					{/* TODO: <img/> */}
					<Toast.Title className="toast-title">{title}</Toast.Title>
					<Toast.Description asChild>
						<p className="toast-message">{message}</p>
					</Toast.Description>
					<Toast.Action className="close-button" asChild altText="Close">
						<button
							className="button-small circle-button"
							onClick={() => cancelNotification()}>
							<IconContainer
								asset={CloseIcon}
								className="icon-colour-standard"
								use-stroke/>
						</button>
					</Toast.Action>
				</div>
			</Toast.Root>
			<Toast.Viewport className="toast-viewport" />
		</>
	);
}
