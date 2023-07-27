/**
 * Gets the url of the tab which is currently open in the browser.
 * @returns A string or undefined which is the url of the active tab. 
 */
export async function getActiveTabURL(): Promise<string | undefined> {
	let tab = await getActiveTab();

	return tab.url;
}

/**
 * Gets the tab which is currently open in the browser.
 * @returns A chrome Tab object.
 */
export async function getActiveTab(): Promise<any> {
	return new Promise((resolve, _) => chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
		resolve(currentTab);
	}));
}

/**
 * Runs the initialization code for each content script for
 * things like caching of DOM elements.
 * @param scripts An array containing the name of each script. (Needs to be included in the manifest.json file.)
 */
export function initializeContentScripts(scripts: Array<string>): void {
	chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
		for (let script of scripts) {
			chrome.tabs.sendMessage(currentTab.id!, { type: `pfy_${script}_check_init` }, (response: boolean) => {
				// If true, the script has already been initialized.
				if (response == true) {
					return;
				}

				chrome.tabs.sendMessage(currentTab.id!, { type: `pfy_${script}_init` });
			});
		}
	});
}
