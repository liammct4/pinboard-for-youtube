import { createRoot } from "react-dom/client"
import { TimelineApp } from "./TimelineApp";

let container = document.createElement("div");
let root = createRoot(container);

function timelineSetup() {
	// React entry point.
	let progressBar = document.querySelector(".ytp-chrome-bottom");
	progressBar?.insertBefore(container, progressBar.childNodes[0]);

	root.render(<TimelineApp/>);
}

// TODO: Mutation observer.
setTimeout(timelineSetup, 100);
