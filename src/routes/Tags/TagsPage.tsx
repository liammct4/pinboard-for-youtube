import { useNavigate } from "react-router-dom";
import { IconContainer } from "../../components/images/svgAsset";
import { ReactComponent as ArrowIcon } from "./../../../assets/symbols/arrow.svg"
import "./TagsPage.css"

export function TagsPage(): React.ReactNode {
	const navigate = useNavigate();

	return (
		<>
			<div className="button-row">
				<button className="circle-button" onClick={() => navigate("./videos/")}>
					<IconContainer className="icon-colour-standard go-back-arrow" asset={ArrowIcon} use-stroke/>
				</button>
				<span className="go-back-text">Go Back</span>
			</div>
			<hr className="bold-separator"/>
			<p>Tags Page</p>
		</>
	);
}
