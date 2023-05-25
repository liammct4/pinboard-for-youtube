// TODO: Put in own modules
const YOUTUBE_EXTRACT_VIDEO_ID_REGEX = /.*\?v=(?<VideoID>[\w\d\-\_]*)/

function getVideoIdFromYoutubeLink(url) {
	try {
		const { groups: { VideoID } } = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(url);
		return VideoID;
	}
	catch {

		return null;
	}
}

class VideoTimestampList extends HTMLElement {
	constructor() {
		super();
		this.init = true;
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });

		const innerWrapper = document.createElement("div");
		innerWrapper.setAttribute("id", "video-timestamp-list");

		// Import styling.
		const styleLink = document.createElement("link");
		styleLink.setAttribute("link", "stylesheet");
		styleLink.setAttribute("href", "elements/video-timestamp-list/video-timestamp-list.css");
		innerWrapper.appendChild(styleLink);

		// Video card.
		let videoCard = document.createElement("video-card");
		videoCard.setAttribute("id", "video-timestamp-list-card");
		videoCard.setAttribute("videoid", getVideoIdFromYoutubeLink(this.getAttribute("url")));
		innerWrapper.appendChild(videoCard);

		// Separator.
		let separator = document.createElement("div");
		separator.setAttribute("id", "video-timestamp-list-separator");
		innerWrapper.appendChild(separator);

		// Expander.
		let expander = document.createElement("subtle-expander");
		innerWrapper.appendChild(expander);
		expander.setAttribute("open", "Close timestamps");
		expander.setAttribute("close", "Expand timestamps");
		expander.setAttribute("expanded", "true");

		// Timestamp list wrapper.
		let timestampListWrapper = document.createElement("div");
		timestampListWrapper.setAttribute("id", "video-timestamp-list-wrapper");
		timestampListWrapper.style["margin-left"] = "15px";
		timestampListWrapper.style["gap"] = "2px";
		timestampListWrapper.style["display"] = "flex";
		timestampListWrapper.style["flex-direction"] = "column";

		let a = document.createElement("video-timestamp");
		let b = document.createElement("video-timestamp");

		a.setAttribute("message", "Time one");
		a.setAttribute("time", "15:30");
		a.setAttribute("videoid", getVideoIdFromYoutubeLink(this.getAttribute("url")));
		b.setAttribute("message", "Time two");
		b.setAttribute("time", "16:40");
		b.setAttribute("videoid", getVideoIdFromYoutubeLink(this.getAttribute("url")));

		timestampListWrapper.appendChild(a);
		timestampListWrapper.appendChild(b);

		expander.innerHTML = timestampListWrapper.outerHTML;

		// End separator.
		let endSeparator = document.createElement("div");
		endSeparator.setAttribute("id", "video-timestamp-list-end-separator");
		innerWrapper.appendChild(endSeparator);

		const style = document.createElement("style");
		style.innerHTML = "@import url(elements/video-timestamp-list/video-timestamp-list.css);"

		this.shadowRoot.append(style, innerWrapper);
		this.init = false;
		this.update()
	}

	update() {
		
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// Skip first call as the shadow DOM hasn't been created yet.
		if (this.init) {
			return;
		}

		let videoCard = this.shadowRoot.getElementById("video-timestamp-list-card");

		switch (name) {
			case "url":
				videoCard.setAttribute("url", newValue);
				
				break;
		}
	}

	static get observedAttributes() {
		return ["url"]
	}
}

customElements.define("video-timestamp-list", VideoTimestampList);
