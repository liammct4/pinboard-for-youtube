function buttonPress(e) {
	let source = e.srcElement.getRootNode().host

	source.buttonPress();
}

class SubtleExpander extends HTMLElement {
	constructor() {
		super();
		this.init = true;
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });

		this.expanded = Boolean(this.getAttribute("expanded"));

		const innerWrapper = document.createElement("div");
		innerWrapper.setAttribute("id", "subtle-expander-inner");

		// Import styling.
		const styleLink = document.createElement("link");
		styleLink.setAttribute("link", "stylesheet");
		styleLink.setAttribute("href", "elements/subtle-expander/subtle-expander.css");
		innerWrapper.appendChild(styleLink);

		// Expander button
		let button = document.createElement("button");
		button.setAttribute("id", "subtle-expander-button");
		button.addEventListener("click", () => this.buttonPress());  //button.setAttribute("onclick", "buttonPress(event)");
		innerWrapper.appendChild(button);

		// Expander button symbol
		let symbol = document.createElement("img");
		symbol.setAttribute("id", "subtle-expander-symbol");
		symbol.setAttribute("src", "../assets/symbols/arrow.svg");
		button.appendChild(symbol);

		// Text
		let text = document.createElement("h3");
		text.setAttribute("id", "subtle-expander-text");
		innerWrapper.appendChild(text);

		// Content wrapper
		let contentWrapper = document.createElement("div");
		contentWrapper.setAttribute("id", "subtle-expander-content");
		innerWrapper.appendChild(contentWrapper);

		const style = document.createElement("style");
		style.innerHTML = "@import url(elements/subtle-expander/subtle-expander.css);"

		this.shadowRoot.append(style, innerWrapper);
		this.init = false;
		this.update()
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "expanded":
				// Skip first call as the shadow DOM hasn't been created yet.
				if (this.init) {
					this.init = false;
					return;
				}

				this.update();
				break;
		}
	}

	buttonPress(e) {
		if (this.expanded) {
			this.setAttribute("expanded", false);
		} else {
			this.setAttribute("expanded", true);
		}
	}

	update() {
		let text = this.shadowRoot.getElementById("subtle-expander-text");
		let contentWrapper = this.shadowRoot.getElementById("subtle-expander-content");
		let wrapper = this.shadowRoot.getElementById("subtle-expander-inner");
		let arrow = this.shadowRoot.getElementById("subtle-expander-symbol");

		if (contentWrapper.innerHTML != this.innerHTML) {
			contentWrapper.innerHTML = this.innerHTML;
		}

		if (this.expanded) {
			text.innerHTML = this.getAttribute("open");
			contentWrapper.style["visibility"] = "visible";
			wrapper.style["grid-template-rows"] = "auto auto";
			arrow.style["transform"] = "rotate(180deg)";
			arrow.style["margin-bottom"] = "2px";
		}
		else {
			text.innerHTML = this.getAttribute("close");
			contentWrapper.style["visibility"] = "collapse";
			wrapper.style["grid-template-rows"] = "auto 0";
			arrow.style["transform"] = "rotate(0deg)";
			arrow.style["margin-bottom"] = "1.5px";
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// Skip first call as the shadow DOM hasn't been created yet.
		if (this.init) {
			return;
		}
		let text = this.shadowRoot.getElementById("subtle-expander-text");

		switch (name) {
			case "expanded":
				if (newValue == "true") {
					this.expanded = true;
				}
				else if (newValue == "false") {
					this.expanded = false;
				}

				this.update();
				break;
			case "open":
				if (this.expanded) {
					text.innerHTML = newValue;
				}
				break;
			case "close":
				if (!this.expanded) {
					text.innerHTML = newValue;
				}
				break;
		}
	}

	static get observedAttributes() {
		return ["expanded", "open", "close"]
	}
}

customElements.define("subtle-expander", SubtleExpander);
