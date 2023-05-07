class SplitHeading extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });

		console.log(document);

		const innerWrapper = document.createElement("div");
		innerWrapper.setAttribute("class", "split-heading");

		// Import styling.
		const styleLink = document.createElement("link");
		styleLink.setAttribute("link", "stylesheet");
		styleLink.setAttribute("href", "elements/split-heading.css");
		innerWrapper.appendChild(styleLink);

		// Create element inner elements.
		const leftHighlight = document.createElement("div");

		leftHighlight.classList.add("split-heading-left-highlight");
		innerWrapper.appendChild(leftHighlight);

		const text = document.createElement("h2");
		text.setAttribute("class", "split-heading-text");
		text.innerHTML = this.getAttribute("header")
		innerWrapper.appendChild(text);

		const style = document.createElement("style");
		style.innerHTML = "@import url(elements/split-heading.css);"

		this.shadowRoot.append(style, innerWrapper);
	}
}

customElements.define("split-heading", SplitHeading);
