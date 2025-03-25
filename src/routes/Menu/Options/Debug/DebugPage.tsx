import { useEffect, useState } from "react";
import { SwitchInputPrimitive } from "../../../../components/input/SwitchInput/SwitchInput";
import { IStorage } from "../../../../lib/storage/storage";
import "./DebugPage.css";
import { useNotificationMessage } from "../../../../components/features/notifications/useNotificationMessage";

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
					<button className="button-small button-base" onClick={async () => {
						const storage: IStorage = await chrome.storage.local.get() as IStorage;

						console.log("Printing storage:")
						console.log(storage);
						
						activateMessage(undefined, "Sent to console.", "Success", "Tick", -1);
					}}>Storage to console</button>
					<button className="button-small button-base" onClick={async () => {
						const storage: IStorage = await chrome.storage.local.get() as IStorage;

						navigator.clipboard.writeText(JSON.stringify(storage, null, 4));

						activateMessage(undefined, "Copied to clipboard.", "Success", "Tick", -1);
					}}>Copy storage to clipboard</button>
					{/* Wipe storage. */}
					<button className="button-small button-base" onClick={async () => {
						await chrome.storage.local.clear();
					}}>Wipe storage</button>
				</div>
			: <></>}
		</>
	);
}
