// TODO: Put in own modules
const YOUTUBE_EXTRACT_VIDEO_ID_REGEX = /.*\?v=(?<VideoID>[\w\d\-]*)/

function getVideoIdFromYoutubeLink(url) {
	const { groups: { VideoID } } = YOUTUBE_EXTRACT_VIDEO_ID_REGEX.exec(url);

	return VideoID;
}

function Get(url){
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET", url, false);
	Httpreq.send(null);

	return Httpreq.responseText;          
}

class VideoCard extends HTMLElement {
	constructor() {
		super();
		this.init = true;
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });

		const innerWrapper = document.createElement("div");
		innerWrapper.setAttribute("class", "video-card-inner");

		// Import styling.
		const styleLink = document.createElement("link");
		styleLink.setAttribute("link", "stylesheet");
		styleLink.setAttribute("href", "elements/video-card/video-card.css");
		innerWrapper.appendChild(styleLink);

		// Thumbnail
		let thumb = document.createElement("img");
		thumb.setAttribute("alt", "Current video thumbnail.");
		thumb.setAttribute("id", "video-card-thumb");
		innerWrapper.appendChild(thumb);

		// Title
		let title = document.createElement("h2");
		title.setAttribute("id", "video-card-title");
		innerWrapper.appendChild(title);

		// URL
		let urlLink = document.createElement("a");
		urlLink.setAttribute("id", "video-card-url");
		innerWrapper.appendChild(urlLink);

		const style = document.createElement("style");
		style.innerHTML = "@import url(elements/video-card/video-card.css);"

		this.shadowRoot.append(style, innerWrapper);
		this.update()
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "url":
				// Skip first call as the shadow DOM hasn't been created yet.
				if (this.init) {
					this.init = false;
					return;
				}

				this.update();
				break;
		}
	}

	update() {
		let thumb = this.shadowRoot.getElementById('video-card-thumb');
		let urlLink = this.shadowRoot.getElementById('video-card-url');
		let title = this.shadowRoot.getElementById('video-card-title');

		let url = this.getAttribute("url");
		let videoId = getVideoIdFromYoutubeLink(url);
		thumb.setAttribute("src", `https://img.youtube.com/vi/${videoId}/default.jpg`);

		let info = JSON.parse(Get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`))
		title.innerHTML = info["title"];
		urlLink.setAttribute("href", url);
		urlLink.innerHTML = url;
	}

	static get observedAttributes() {
		return ["url"]
	}
}

customElements.define("video-card", VideoCard);
