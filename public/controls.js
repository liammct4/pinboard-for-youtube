// ----------------------------------
// 'controls.js' content script for injecting controls (e.g. save video button) on the page.
// ----------------------------------

function getVideoIDFromLink(videoURL) {
	let extractIDRegex = /watch\?v=(?<videoID>.{11})/;

	let result = extractIDRegex.exec(videoURL);

	return result.groups.videoID;
}

function attemptSetup() {
	// When YouTube first loads, the control buttons and options (e.g. like button) aren't on first load.
	// so waiting is needed before initializing the custom controls.
	let controlBar = document.querySelector("#above-the-fold > #top-row ytd-menu-renderer");

	if (controlBar == undefined) {
		setTimeout(() => attemptSetup(), 200);
		return;
	}

	if (document.querySelector(".pfy-control-outer-container") != undefined) {
		return;
	}

	let logoUrl = chrome.runtime.getURL("/assets/logo/logo.svg");

	controlContainerOuter = document.createElement("div");
	controlContainerOuter.classList.add("pfy-style-context");
	controlContainerOuter.classList.add("pfy-control-outer-container")
	controlContainerOuter.innerHTML =
	`
		<style src="common-definitions.css"></style>
		<style src="globals.css"></style>
		<style>
			:root {
				--pfy-control-size: 38px;
			}
		
			.pfy-save-video-button {
				width: var(--pfy-control-size);
				height: var(--pfy-control-size);
				border-radius: var(--pfy-control-size);
				margin-right: var(--pfy-spacing-large);
				box-shadow: none !important;
				padding: 0px;

				& img {
					--pfy-image-size: calc(var(--pfy-control-size) - var(--pfy-spacing-large));

					width: var(--pfy-image-size);
					height: var(--pfy-image-size);
				}
			}
		</style>
		<button class="pfy-save-video-button button-base">
			<img src="${logoUrl}">
		</button>
	`;
	
	controlBar.insertBefore(controlContainerOuter, controlBar.firstChild);

	let saveVideoButton = controlContainerOuter.querySelector(".pfy-save-video-button");
	
	saveVideoButton.addEventListener("click", async () => {
		let storage = await chrome.storage.local.get();
		let videoID = getVideoIDFromLink(window.location.href);

		// Push to extension local storage.
		let index = storage.user_data.videos.findIndex(x => x.videoID == videoID);

		let newTimestamp = {
			id: crypto.randomUUID(), 
			time: Math.round(document.querySelector("video").currentTime),
			message: "Saved timestamp.",
		}

		if (index == -1) {	
			storage.user_data.videos.push({
				videoID: videoID,
				timestamps: [ newTimestamp ],
				appliedTags: []
			});
		}
		else {
			storage.user_data.videos[index].timestamps.push(newTimestamp);
		}
			
		if (storage.auth.currentUser != undefined) {
			// Make sure to upload to account if the user is logged in.
			storage.account.mutationQueues.videoPendingQueue.push({
				dataID: videoID,
				timestamp: Date.now(),
				position: index
			});
		}

		await chrome.storage.local.set(storage);
	});
}

async function initialize() {
	let storage = await chrome.storage.local.get();

	// Means that the extension hasn't been opened yet.
	if (storage.user_data == undefined) {
		return;
	}

	// Handle if the button has been disabled.
	chrome.storage.local.onChanged.addListener(async () => {
		let storage = await chrome.storage.local.get();

		let button = document.querySelector(".pfy-save-video-button");

		// If it is null, that means that storage hasn't been initialized, or the settings.
		if (storage?.user_data?.config?.userSettings.find(x => x.settingName == "saveVideoTimestampButtonEnabled").value ?? true) {
			button.style.display = "initial";
		}
		else {
			button.style.display = "none";
		}
	});

	window.navigation.addEventListener("navigate", (event) => {
		const check = () => {
			if (document.querySelector("#above-the-fold > #top-row ytd-menu-renderer") != undefined) {
				setTimeout(attemptSetup, 50);
			}
			else {
				setTimeout(check, 200);
			}
		}

		if (/watch\?v=(?<videoID>.{11})/.test(event.destination.url)) {	
			check();
		}
	});
	attemptSetup();
}

initialize();
