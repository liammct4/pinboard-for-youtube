import { createRoot } from "react-dom/client";
import * as React from "react";
import { TimelineApp } from "./TimelineApp";

let container = document.createElement("div");

container.id = "pfy-timeline-root";

let lastLink = "";

function timelineSetup() {
	if (window.location.href == lastLink) {
		setTimeout(timelineSetup, 200);
		return;
	}

	lastLink = window.location.href;
	let timeline = document.querySelector(".ytp-chrome-bottom");

	if (timeline == null) {
		setTimeout(timelineSetup, 200);
		return;
	}

	timeline.insertBefore(container, timeline.childNodes[0]);
	let root = createRoot(container);
	root.render(<TimelineApp/>);
}

timelineSetup();
