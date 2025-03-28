/// <reference types="vite-plugin-svgr/client" />

import { IconContainer } from "../../../images/svgAsset";
import SpinnerIcon from "./../../../../../assets/symbols/spinner.svg?react"
import "./Spinner.css"

export interface ISpinnerProperties {
	className: string;
	baseAssetClass?: string;
	text?: string;
}

/**
 * A decorative spinner with an optional text label.
 */
export function Spinner({
		className,
		baseAssetClass = "icon-colour-standard",
		text
	}: ISpinnerProperties): React.ReactNode {
	return (
		<div className={`internal-spinner-style ${className}`}>
			{text != undefined ? <p className="spinner-text">{text}</p> : <></>}
			<IconContainer
				className={`internal-spinner-style ${baseAssetClass}`}
				asset={SpinnerIcon}
				use-fill/>
		</div>
	);
}
