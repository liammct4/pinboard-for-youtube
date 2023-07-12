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
