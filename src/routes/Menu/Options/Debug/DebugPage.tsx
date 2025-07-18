import { useEffect, useState } from "react";
import { SwitchInputPrimitive } from "../../../../components/input/SwitchInput/SwitchInput";
import { accessStorage, BLANK_STORAGE_TEMPLATE } from "../../../../lib/storage/storage";
import { useNotificationMessage } from "../../../../components/features/notifications/useNotificationMessage";
import "./DebugPage.css";
import { SmallButton } from "../../../../components/interactive/buttons/SmallButton/SmallButton";
import { ButtonPanel } from "../../../../components/interactive/ButtonPanel/ButtonPanel";

export function DebugPage(): React.ReactNode {
	const { activateMessage } = useNotificationMessage();
	const [ toolsActivated, setToolsActivated ] = useState<boolean>(false);
	const [ crash, setCrash ] = useState<boolean>(false);

	useEffect(() => {
		activateMessage(
			"This page is for development only",
			"This page is intended only for development use and debugging and can cause errors/corruption if improperly used, if you've stumbled upon this page by accident, please go back.",
			"Warning",
			"Warning",
			-1
		);
	}, []);

	if (crash) {
		throw new Error("Crashed the application.");
	}

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
				<ButtonPanel className="debug-tools" direction="Vertical">
					{/* Print storage */}
					<SmallButton onClick={async () => {
						console.log("Printing storage:")
						let storage = await accessStorage();
						console.log(storage);
						
						activateMessage(undefined, "Sent to console.", "Success", "Tick", -1);
					}}>Storage to console</SmallButton>
					<SmallButton onClick={async () => {
						let storage = await accessStorage();
						navigator.clipboard.writeText(JSON.stringify(storage, null, 4));

						activateMessage(undefined, "Copied to clipboard.", "Success", "Tick", -1);
					}}>Copy storage to clipboard</SmallButton>
					{/* Wipe storage. */}
					<SmallButton onClick={async () => {
						await chrome.storage.local.set(BLANK_STORAGE_TEMPLATE);
					}}>Wipe storage</SmallButton>
					<SmallButton onClick={() => setCrash(true)}>Crash</SmallButton>
				</ButtonPanel>
			: <></>}
		</>
	);
}
