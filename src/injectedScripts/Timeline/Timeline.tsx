import { createRoot } from "react-dom/client"
import { TimelineApp } from "./TimelineApp";

let container = document.createElement("div");
container.id = "pfy-timeline-root";
let root = createRoot(container);

function timelineSetup() {
	// React entry point.
	if (document.querySelector("#pfy-timeline-root") == null) {
		let progressBar = document.querySelector(".ytp-chrome-bottom");
		progressBar?.insertBefore(container, progressBar.childNodes[0]);
	
		root.render(<TimelineApp/>);
		return;
	}
}

window.addEventListener("navigate", () => {
	setTimeout(timelineSetup, 100);
});

timelineSetup();
