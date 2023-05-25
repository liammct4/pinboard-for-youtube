function getSecondsFromTimestamp(time) {
	parts = time.split(":").reverse();

	let total = 0;
	let mult = [1, 60, 3600, 86400];
	
	for (let i = 0; i < parts.length; i++) {
		let num = Number(parts[i]);

		total = total + (num * mult[i]);
	}

	return total;
}

class VideoTimestamp extends HTMLElement {
	constructor() {
		super();
		this.init = true;
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });

		const innerWrapper = document.createElement("div");
		innerWrapper.setAttribute("id", "video-timestamp-inner");

		// Import styling.
		const styleLink = document.createElement("link");
		styleLink.setAttribute("link", "stylesheet");
		styleLink.setAttribute("href", "elements/video-timestamp/video-timestamp.css");
		innerWrapper.appendChild(styleLink);

		const commonStyle = document.createElement("link");
		commonStyle.setAttribute("link", "stylesheet");
		commonStyle.setAttribute("href", "common-definitions.css");
		innerWrapper.appendChild(commonStyle);

		// Timestamp
		let timeStamp = document.createElement("a");
		timeStamp.setAttribute("id", "video-timestamp-time");
		timeStamp.setAttribute("href", "url");
		innerWrapper.appendChild(timeStamp);

		// Separator
		let separator = document.createElement("div");
		separator.setAttribute("id", "video-timestamp-separator");
		innerWrapper.appendChild(separator);

		let text = document.createElement("p");
		text.setAttribute("id", "video-timestamp-message");
		innerWrapper.appendChild(text);

		// Filler (to expand).
		let filler = document.createElement("div");
		filler.setAttribute("id", "video-timestamp-filler");
		innerWrapper.appendChild(filler);

		// Button
		let editButton = document.createElement("button");
		editButton.setAttribute("id", "video-timestamp-button");
		editButton.classList.add("button-small");
		editButton.innerHTML = "Edit";
		innerWrapper.appendChild(editButton);

		const style = document.createElement("style");
		style.innerHTML =
			"@import url(elements/video-timestamp/video-timestamp.css);\n" +
			"@import url(common-definitions.css);"

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
			case "message":
			case "url":
			case "time":
				this.update();
				break;	
		}
	}

	update() {
		let text = this.shadowRoot.getElementById("video-timestamp-message");
		let timestamp = this.shadowRoot.getElementById("video-timestamp-time");

		let videoid = this.getAttribute("videoid");
		text.innerHTML = this.getAttribute("message");
		timestamp.innerHTML = this.getAttribute("time");

		let time = getSecondsFromTimestamp(this.getAttribute("time"));

		timestamp.setAttribute("href", `https:youtu.be/${videoid}?t=${time}`);
	}

	static get observedAttributes() {
		return ["videoid", "message", "time"]
	}
}

customElements.define("video-timestamp", VideoTimestamp);
