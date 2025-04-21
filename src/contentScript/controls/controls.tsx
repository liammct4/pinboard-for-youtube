import { createRoot } from "react-dom/client";
import { ControlsApp } from "./ControlsApp";

let container = document.createElement("div");
container.id = "pfy-controls-root";

/**
 * @returns True if the controls root was injected, otherwise false. 
 */
export function controlsSetup(): boolean {
	const check = () => {
		let controlBar = document.querySelector("#above-the-fold > #top-row ytd-menu-renderer");

		if (controlBar == null) {
			setTimeout(check, 50);
			return;
		}

		controlBar.insertBefore(container, controlBar.childNodes[0]);
		let root = createRoot(container);
		root.render(<ControlsApp/>);
	}

	check();

	return true;
}
