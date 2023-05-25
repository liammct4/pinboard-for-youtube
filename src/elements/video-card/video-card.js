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
		this.init = false;
		this.update()
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// Skip first call as the shadow DOM hasn't been created yet.
		if (this.init) {
			return;
		}	

		switch (name) {
			case "videoid":
				this.update();
				break;
		}
	}

	update() {
		let thumb = this.shadowRoot.getElementById('video-card-thumb');
		let urlLink = this.shadowRoot.getElementById('video-card-url');
		let title = this.shadowRoot.getElementById('video-card-title');

		let url = this.getUrl();
		let videoId = this.getAttribute("videoid");
		thumb.setAttribute("src", `https://img.youtube.com/vi/${videoId}/default.jpg`);

		let info = JSON.parse(Get(`https://noembed.com/embed?url=${url}`))
		title.innerHTML = info["title"];
		urlLink.setAttribute("href", url);
		urlLink.innerHTML = url;
	}

	getUrl() {
		return `https://www.youtube.com/watch?v=${this.getAttribute("videoid")}`;
	}

	static get observedAttributes() {
		return ["videoid"]
	}
}

customElements.define("video-card", VideoCard);
