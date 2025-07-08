import { useEffect, useState } from "react";
import { SwitchInputPrimitive } from "../../../../components/input/SwitchInput/SwitchInput";
import { accessMainStorage, BLANK_MAIN_STORAGE_TEMPLATE } from "../../../../lib/storage/storage";
import { useNotificationMessage } from "../../../../components/features/notifications/useNotificationMessage";
import "./DebugPage.css";
import { SmallButton } from "../../../../components/interactive/buttons/SmallButton/SmallButton";

export function DebugPage(): React.ReactNode {
	const { activateMessage } = useNotificationMessage();
	const [ toolsActivated, setToolsActivated ] = useState<boolean>(false);

	useEffect(() => {
		activateMessage(
			"This page is for development only",
			"This page is intended only for development use and debugging and can cause errors/corruption if improperly used, if you've stumbled upon this page by accident, please go back.",
			"Warning",
			"Warning",
			-1
		);
	}, []);

	return (
		<>
			<h1 className="debug-title">Debug page</h1>
			<p>
				You probably didn't mean to open this page, this page is intended solely for development and
				debugging, using this with your saved data can cause corruption or data loss!
			</p>
			<SwitchInputPrimitive
				label="I understand the risks, and want to continue"
				labelSize="medium"
				reversed={false}
				value={toolsActivated}
				onChange={setToolsActivated}/>
			{toolsActivated ?
				<div className="debug-tools">
					{/* Print storage */}
					<SmallButton onClick={async () => {
						console.log("Printing storage:")
						let storage = await accessMainStorage();
						console.log(storage);
						
						activateMessage(undefined, "Sent to console.", "Success", "Tick", -1);
					}}>Storage to console</SmallButton>
					<SmallButton onClick={async () => {
						let storage = await accessMainStorage();
						navigator.clipboard.writeText(JSON.stringify(storage, null, 4));

						activateMessage(undefined, "Copied to clipboard.", "Success", "Tick", -1);
					}}>Copy storage to clipboard</SmallButton>
					{/* Wipe storage. */}
					<SmallButton onClick={async () => {
						await chrome.storage.sync.set(BLANK_MAIN_STORAGE_TEMPLATE);
					}}>Wipe storage</SmallButton>
				</div>
			: <></>}
		</>
	);
}
