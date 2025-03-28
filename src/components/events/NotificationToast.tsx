/// <reference types="vite-plugin-svgr/client" />

import { useContext } from "react";
import { AnimationName, ColourType, GlobalNotificationContext, IGlobalNotificationContext, ImageName, useMappedAssetIcon } from "../features/notifications/useNotificationMessage";
import { Asset, IconContainer } from "../images/svgAsset";
import CloseIcon from "./../../../assets/symbols/cross.svg?react"
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
	const icon: Asset = useMappedAssetIcon(image);
	const { cancelCurrentNotification } = useContext<IGlobalNotificationContext>(GlobalNotificationContext);

	return (
		<>
			<Toast.Root className="notification-root" open={isOpen} data-colour={colour} data-animation={animationType}>
				<hr className="notification-separator"/>
				<div className="notification-interior" data-image-name={image}>
					<IconContainer
						asset={icon}
						className="notification-icon"
						use-stroke/>
					<Toast.Title className="toast-title">{title}</Toast.Title>
					<Toast.Description asChild>
						<p className="toast-message">{message}</p>
					</Toast.Description>
					<Toast.Action className="close-button" asChild altText="Close">
						<button
							className="button-small circle-button"
							onClick={() => cancelCurrentNotification()}>
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
