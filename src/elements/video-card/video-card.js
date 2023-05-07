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

		let url = this.getAttribute("url");
		let videoId = getVideoIdFromYoutubeLink(url);

		// Thumbnail
		const thumb = document.createElement("img");
		thumb.setAttribute("src", `https://img.youtube.com/vi/${videoId}/default.jpg`);
		thumb.setAttribute("alt", "Current video thumbnail.");
		thumb.classList.add("video-card-thumb");
		innerWrapper.appendChild(thumb);

		let info = JSON.parse(Get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`))

		// Title
		const title = document.createElement("h2");
		title.innerHTML = info["title"];
		title.classList.add("video-card-title");
		innerWrapper.appendChild(title);

		// URL
		const urlLink = document.createElement("a");
		urlLink.setAttribute("href", url);
		urlLink.innerHTML = url;
		urlLink.classList.add("video-card-url");
		innerWrapper.appendChild(urlLink);

		const style = document.createElement("style");
		style.innerHTML = "@import url(elements/video-card/video-card.css);"

		this.shadowRoot.append(style, innerWrapper);
	}
}

customElements.define("video-card", VideoCard);
