import { useEffect, useState } from "react";
import { useNotificationMessage } from "../../../../components/features/useNotificationMessage";
import { SwitchInputPrimtive } from "../../../../components/input/SwitchInput/SwitchInputPrimitive";
import { IStorage } from "../../../../lib/storage/storage";
import "./DebugPage.css";

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
			<p>This page is intended solely for development and debugging, using this with your saved data can cause corruption or data loss!</p>
			<SwitchInputPrimtive
				label="I understand the risks, and want to continue"
				labelSize="medium"
				reversed={false}
				value={toolsActivated}
				onChange={setToolsActivated}/>
				{toolsActivated ?
					<div className="debug-tools">
						<button className="button-small button-base" onClick={async () => {
							const storage: IStorage = await chrome.storage.local.get() as IStorage;

							navigator.clipboard.writeText(JSON.stringify(storage, null, 4));

							console.log("Printing storage:")
							console.log(storage);
							
							activateMessage(undefined, "Copied to clipboard and console.", "Success", "Tick", -1);
						}}>Get storage</button>
					</div>
				: <></>}
		</>
	);
}
