import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { SplitHeading } from "../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { ActionMessageDialog } from "../../components/dialogs/ActionDialogMessage";
import { accessMainStorage, BLANK_MAIN_STORAGE_TEMPLATE, modifyStorage } from "../../lib/storage/storage";
import { ButtonPanel } from "../../components/interactive/ButtonPanel/ButtonPanel";
import { CodeBlock } from "../../components/presentation/Decorative/CodeBlock/CodeBlock";
import { MediumButton } from "../../components/interactive/buttons/MediumButton/MediumButton";
import { useNotificationMessage } from "../../components/features/notifications/useNotificationMessage";
import "./ErrorPage.css"

export function ErrorPage(): React.ReactNode {
	const { activateMessage } = useNotificationMessage();
	const navigate = useNavigate();
	const error = useRouteError() as Error;

	useEffect(() => {
		activateMessage(
			"An error occurred",
			"An unexpected error has occurred while using the application.",
			"Error",
			"Error",
			undefined,
			"Shake"
		);
	}, []);

	const onConfirm = async (result: string) => {
		if (result == "Wipe local data") {
			await chrome.storage.sync.set(BLANK_MAIN_STORAGE_TEMPLATE);
		}
	}

	const onCopyToClipboard = async () => {
		accessMainStorage()
			.then((storage) => window.navigator.clipboard.writeText(JSON.stringify(storage, null, 4)));
		
		activateMessage("Copied to clipboard", "Your data has been copied to the clipboard, please keep it in case you need to recover your data.", "Info", "Info", 6000);
	}

	return (
		<section className="error-page">
			<SplitHeading text="An error occurred"/>
			<p className="main-error-text">An unknown error has occurred.</p>
			<ButtonPanel className="toolbar" direction="Horizontal">
				<MediumButton onClick={() => navigate("/app")}>Home page</MediumButton>
				<MediumButton onClick={onCopyToClipboard}>Copy data to clipboard</MediumButton>
				<ActionMessageDialog
					title="Wipe data"
					body="Are you sure that you want to wipe your data? You cannot undo this action."
					buttons={["Wipe local data", "Cancel"]}
					defaultMessage="Cancel"
					defaultFocusedButton="Cancel"
					onButtonPressed={onConfirm}>
						<MediumButton>Wipe data</MediumButton>
				</ActionMessageDialog>		
			</ButtonPanel>
			<SplitHeading text="Technical Details"/>
			<p className="detailed-error-text">
				An unexpected error has occurred. If this error persists,
				and the extension no longer works, you can either copy or wipe your data.
				Otherwise you can go back to the home page.
				<br/><br/>
				You can report issues with the extension on the GitHub page,
				please include the error details in the box below
				and if possible, the exact steps to reproduce the error.
				<br/><br/>
				Visit the issues page by clicking <a href="https://github.com/liammct4/pinboard-for-youtube/issues">here</a>. Or visit the "Help" page.
				Please do check that the issue has not already been reported if you
				are making a report.
			</p>
			<CodeBlock className="error-block">{error.stack}</CodeBlock>
		</section>
	);
}
