import { createRoot } from "react-dom/client";
import { TimelineApp } from "./TimelineApp";
import { IPrimaryStorage } from "../../lib/storage/storage";

let container = document.createElement("div");
container.id = "pfy-timeline-root";

/**
 * @returns True if the timeline was injected, otherwise false. 
 */
export async function timelineSetup(): Promise<boolean> {
	let timeline = document.querySelector(".ytp-chrome-bottom");

	if (timeline == null) {
		return false;
	}

	timeline.insertBefore(container, timeline.childNodes[0]);
	let root = createRoot(container);
	root.render(<TimelineApp/>);

	return true;
}
