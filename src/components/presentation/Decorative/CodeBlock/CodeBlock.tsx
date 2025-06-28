import { useState } from "react";
import { IconContainer } from "../../../images/svgAsset";
import CopyIcon from "./../../../../../assets/icons/copy.svg?react"
import { MediumButton } from "../../../interactive/buttons/MediumButton/MediumButton";
import { useNotificationMessage } from "../../../features/notifications/useNotificationMessage";
import "./CodeBlock.css"

export interface ICodeBlockProperties extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {

}

export function CodeBlock(props: ICodeBlockProperties) {
	const [ hover, setHover ] = useState<boolean>(false);
	const { activateMessage } = useNotificationMessage();

	const actualProps = { ...props };
	delete actualProps.className;

	const onCopyClick = async () => {
		try {
			await window.navigator.clipboard.writeText(props.children as string);

			activateMessage("Copied to clipboard", "Your text has been copied to the clipboard.", "Info", "Info", 6000);
		}
		catch (error) {
			if (!(error instanceof DOMException)) {
				return;
			}

			activateMessage("Couldn't copy to clipboard", `Unable to copy the text to the clipboard: ${(error as Error).message}`, "Error", "Error", undefined, "Shake");
		}
	}

	return (
		<div
			className={`${props.className} code-block scrollbar-small`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}>
				<code {...actualProps}/>
				<div data-hover={hover}>
					<MediumButton onClick={onCopyClick} square>
						<IconContainer asset={CopyIcon} className="copy-icon icon-colour-standard" use-stroke/>
					</MediumButton>
				</div>
		</div>
	);
}
