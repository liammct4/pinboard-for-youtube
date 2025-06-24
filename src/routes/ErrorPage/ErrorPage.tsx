import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SplitHeading } from "../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { ActionMessageDialog } from "../../components/dialogs/ActionDialogMessage";
import { LabeledArrowExpander } from "../../components/presentation/LabeledArrowExpander/LabeledArrowExpander";
import "./ErrorPage.css"
import { accessStorage, BLANK_STORAGE_TEMPLATE, modifyStorage } from "../../lib/storage/storage";
import { SmallButton } from "../../components/interactive/buttons/SmallButton/SmallButton";
import { ButtonPanel } from "../../components/interactive/ButtonPanel/ButtonPanel";

export function ErrorPage(): React.ReactNode {
	// useRouteError() doesn't work, returns undefined always.
	const navigate = useNavigate();
	const [ detailsExpanded, setDetailsExpanded ] = useState<boolean>(false);

	const onConfirm = async (result: string) => {
		if (result == "Wipe local data") {
			await chrome.storage.sync.set(BLANK_STORAGE_TEMPLATE);
		}
	}

	const onCopyToClipboard = async () => {
		accessStorage()
			.then((storage) => window.navigator.clipboard.writeText(JSON.stringify(storage, null, 4)));
	}

	return (
		<section className="error-page">
			<SplitHeading text="An error occurred"/>
			<p className="main-error-text">An unknown error has occurred.</p>
			<ButtonPanel className="toolbar" direction="Vertical">
				<SmallButton onClick={() => navigate("/app")}>Home page</SmallButton>
				<SmallButton onClick={onCopyToClipboard}>Copy data to clipboard</SmallButton>
				<ActionMessageDialog
					title="Wipe data"
					body="Are you sure that you want to wipe your data? You cannot undo this action."
					buttons={["Wipe local data", "Cancel"]}
					defaultFocusedButton="Cancel"
					onButtonPressed={onConfirm}>
						<SmallButton>Wipe data</SmallButton>
				</ActionMessageDialog>		
			</ButtonPanel>
			<LabeledArrowExpander
				expanded={detailsExpanded}
				onExpanded={setDetailsExpanded}
				openMessage="Close details"
				closeMessage="View more details on how to resolve this">
				<p className="more-error-text">
					An error has occurred, and the cause of the error cannot
					be determined. If this error persists,
					and the extension no longer works, you can wipe your data.
					Otherwise you can go back to the home page.
					<br/><br/><b>NOTE: </b> You will be signed out if you are logged in if you
					do decide to delete your data.
					<br/><br/>
					You can report issues with the extension on the GitHub page,
					please include the exact steps to reproduce errors.
					<br/><br/>
					Visit the issues page by clicking <a href="https://github.com/liammct4/pinboard-for-youtube/issues">here</a>. Or visit the "Help" page.
					Please do check that the issue has not already been reported if you
					are making a report.
				</p>
			</LabeledArrowExpander>
		</section>
	);
}
