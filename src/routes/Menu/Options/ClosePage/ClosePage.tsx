import { IconContainer } from "../../../../components/images/svgAsset";
import { Header } from "../../../../components/presentation/extension/Header/Header";
import "./ClosePage.css"

export function ClosePage() {
	return ( 
		<>
			<div className="outer-close">
				<Header/>
				<p className="close-text">Please close the extension.</p>
			</div>
		</>	
	);
}
