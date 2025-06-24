/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import { IconContainer } from "../../../images/svgAsset";
import WarningIcon from "./../../../../../assets/icons/status/warning.svg?react"
import CrossIcon from "./../../../../../assets/symbols/cross.svg?react"
import "./ErrorBubble.css"
import { SmallButton } from "../../../interactive/buttons/SmallButton/SmallButton";

export interface IErrorBubbleProperties {
	onClose?: () => void;
	children: string;
}

export function ErrorBubble({ onClose, children: message }: IErrorBubbleProperties) {
	return (
		<div className="error-message">
			<IconContainer
				className="icon-colour-standard warning-image"
				asset={WarningIcon}
				use-fill/>
			<p className="error-text">{message}</p>
			<SmallButton circle className="close-button" type="button" onClick={onClose}>
				<IconContainer
					className="icon-colour-standard"
					asset={CrossIcon}
					use-stroke/>
			</SmallButton>
		</div>
	);
}
