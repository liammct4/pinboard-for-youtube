import { useNavigate, useSearchParams } from "react-router-dom";
import { ActionMessageDialog } from "../../../../components/dialogs/ActionDialogMessage";
import { useNotificationMessage } from "../../../../components/features/notifications/useNotificationMessage";
import { ButtonPanel } from "../../../../components/interactive/ButtonPanel/ButtonPanel";
import { SmallButton, SmallInputButton } from "../../../../components/interactive/buttons/SmallButton/SmallButton";
import { SplitHeading } from "../../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { MediumButton } from "../../../../components/interactive/buttons/MediumButton/MediumButton";
import styles from "./DataPage.module.css"
import { useEffect, useState } from "react";
import { SwitchInputPrimitive } from "../../../../components/input/SwitchInput/SwitchInput";
import { useDispatch } from "react-redux";
import { cacheActions } from "../../../../features/cache/cacheSlice";
import { TextBox } from "../../../../components/interactive/TextBox/TextBox";
import { ValidatedForm } from "../../../../components/forms/ValidatedForm";

const resetText =
"Are you sure you want to wipe all your data? " +
"This will completely reset the extension and all videos, timestamps and themes will be deleted. " +
"This action cannot be undone, consider backing up your data first " +
"with the \"Copy data, then reset\" button."

type ResetDialog = "Copy data, then reset" | "Reset data" | "Cancel";

type SaveChangesForm = {
	editorText: string;
}

type SaveChangesFormFields = "editorText";

export function DataPage({}) {
	const { activateMessage } = useNotificationMessage();
	const navigate = useNavigate();
	const [ encoded, setEncoded ] = useState<boolean>(true);
	const [ storageText, setStorageText ] = useState<string>("");
	const [ showEditorDialog, setShowEditorDialog ] = useState<boolean>(false);
	const [ params, setSearchParams] = useSearchParams();
	const dispatch = useDispatch();

	const showEditor = params.get("showEditor") == "true";

	useEffect(() => {
		chrome.storage.local.get().then(s => setStorageText(JSON.stringify(s, null, 4)));
	}, []);

	const onDeleteCache = () => {
		dispatch(cacheActions.clearCache());
		activateMessage(undefined, "Successfully cleared the cache.", "Success", "Tick", 6000);
	}

	const onReset = async (button: ResetDialog) => {
		if (button == "Cancel") {
			return;
		}

		if (button == "Copy data, then reset") {
			let storage = await chrome.storage.local.get();
			let data = btoa(JSON.stringify(storage));

			try {
				navigator.clipboard.writeText(data);
			}
			catch (e) {
				// Prevent wiping when the data could not be copied.
				activateMessage(
					"Unknown error",
					"While attempting to reset your data, access was denied to the clipboard. Your data has not been wiped.",
					"Error",
					"Error",
					10000
				);
				return;
			}
		}

		await chrome.storage.local.clear();

		activateMessage("Successfully wiped your data.", "You can now close the extension.", "Success", "Tick", 8000);
		navigate("/close");
	}

	const onCopyData = async () => {
		let storage = JSON.stringify(await chrome.storage.local.get());
		let string = encoded ? btoa(storage) : storage;

		try {
			navigator.clipboard.writeText(string);
		}
		catch (e) {
			activateMessage(
				"Could not copy data.",
				"Unable to copy your data, access to the clipboard has been denied.",
				"Error",
				"Error",
				6000
			);
			return;
		}

		activateMessage(
			"Copied data.",
			"Your data has been copied to the clipboard.",
			"Info",
			"Info",
			6000
		);
	}

	const onReplaceData = async (data: string) => {
		let isJson = data.charAt(0) == "{";
		let decoded = isJson ? data : atob(data);

		let parsed;

		try {
			parsed = JSON.parse(decoded);
		}
		catch {
			activateMessage("Could not load", "The provided text in the clipboard was invalid.", "Error", "Error", undefined, "Shake");
			return;
		}

		chrome.storage.local.clear();
		chrome.storage.local.set(parsed);

		activateMessage(
			undefined,
			"Successfully replaced your data. Please close the extension.",
			"Info",
			"Info",
			8000
		);
	}

	const onEditorSaveChanges = async (data: SaveChangesForm) => {
		let parsed;

		try {
			parsed = JSON.parse(data.editorText);
		}
		catch (e) {
			activateMessage(
				"Invalid data",
				"The data provided was invalid, please check for any errors.",
				"Error",
				"Error",
				12000,
				"Shake"
			);
			return;
		}

		chrome.storage.local.clear();
		chrome.storage.local.set(parsed);

		navigate("/close");

		activateMessage(
			undefined,
			"Successfully replaced your data. Please close the extension.",
			"Info",
			"Info",
			8000
		);
	}

	return (
		<div className={styles.dataPage}>
			<SplitHeading className={styles.heading} text="Actions"/>
			<ButtonPanel className={styles.optionsPanel} direction="Vertical">
				<MediumButton onClick={onDeleteCache}>Delete Cache</MediumButton>
			</ButtonPanel>
			<SplitHeading className={styles.heading} text="Your Data"/>
			<SwitchInputPrimitive
				label="Encode Data"
				labelSize="medium"
				onChange={setEncoded}
				value={encoded}/>
			<ButtonPanel className={styles.optionsPanel} direction="Vertical">
				<ActionMessageDialog<ResetDialog>
					title="Reset Extension"
					body={resetText}
					buttons={[ "Copy data, then reset", "Reset data", "Cancel" ]}
					defaultFocusedButton="Cancel"
					defaultMessage="Cancel"
					onButtonPressed={onReset}>
						<MediumButton title="Reset the extension and remove all personal data.">Reset Extension</MediumButton>
				</ActionMessageDialog>
				<MediumButton onClick={onCopyData} title={encoded ? "Copies the data encoded in Base64." : "Copies the raw JSON data."}>Copy Data</MediumButton>
			</ButtonPanel>
			<ActionMessageDialog
				title="Manually modify data"
				body="This section is for manually modifying your user data, this is done without any checks unlike when the extension is used normally. This comes with a high risk of corruption if you manually modify your data incorrectly.&#13;&#10;&#13;&#10;This section is moreso intended for recovery and debugging purposes than something you should use normally.&#13;&#10;&#13;&#10;Are you sure you want to proceed?"
				buttons={[ "Yes, I understand", "Cancel" ]}
				defaultFocusedButton="Yes, I understand"
				defaultMessage="Cancel"
				overrideOpen={showEditorDialog}
				onButtonPressed={(result) => {
					if (result == "Yes, I understand") {
						params.set("showEditor", "true");
						setSearchParams(params);
					}

					setShowEditorDialog(false);
				}}>

			</ActionMessageDialog>
			<SwitchInputPrimitive
				label="Manually modify data"
				labelSize="medium"
				onChange={(value) => {
					if (value) {
						setShowEditorDialog(true);
					}
					else {
						params.set("showEditor", String(value));
						setSearchParams(params);
					}
				}}
				value={showEditor}>
			</SwitchInputPrimitive>
			{showEditor ?
				<>
					<ValidatedForm<SaveChangesForm, SaveChangesFormFields>
						className={styles.updateStorageForm}
						name="update-storage-form"
						onSuccess={onEditorSaveChanges}>
							<TextBox
								name="editorText"
								className={styles.replaceTextbox}
								defaultValue={storageText}
								monospace
								spellCheck="false"/>
							<ButtonPanel direction="Horizontal">
								<ActionMessageDialog
									title="Save changes"
									body="Are you sure you want to replace your data with the content in the text box? This action cannot be undone and you risk corrupting your data."
									buttons={["Yes", "Cancel"]}
									defaultFocusedButton="Cancel"
									defaultMessage="Cancel"
									onButtonPressed={(button) => {
										if (button == "Yes") {
											let button = document.querySelector(".hidden-submit") as HTMLButtonElement;
											button.click();
										}
									}}>
										<SmallButton>Save Changes</SmallButton>
								</ActionMessageDialog>
								<ActionMessageDialog
									title="Load data from clipboard"
									body="This action will replace the user data in the extension with data from the clipboard. Are you sure you want to continue?"
									buttons={["Yes", "Cancel"]}
									defaultFocusedButton="Cancel"
									defaultMessage="Cancel"
									onButtonPressed={onReplaceData}>
										<SmallButton>Load data from clipboard</SmallButton>
								</ActionMessageDialog>
							</ButtonPanel>
							<SmallInputButton tabIndex={-1} className="hidden-submit" type="submit" style={{ position: "absolute", visibility: "collapse" }}/>
					</ValidatedForm>				
				</>
				: <></>
			}
		</div>
	)
}
