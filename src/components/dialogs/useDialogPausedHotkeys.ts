import { HotkeyCallback, Keys, useHotkeys } from "react-hotkeys-hook";

/*
Wrapper around useHotkeys which freezes key press events
if a dialog box is currently open. (To prevent unintended side effects from key presses).
*/
export function useDialogPausedHotkeys(keys: Keys, hotkeyCallback: HotkeyCallback) {
	useHotkeys(keys, (keyboardEvent, hotkeysEvent) => {
		let dialog =
			document.querySelector(`div[role="dialog"]`) ??
			document.querySelector(`div[role="alertdialog"]`);

		if (dialog == null) {
			hotkeyCallback(keyboardEvent, hotkeysEvent);
		}
	});
}
