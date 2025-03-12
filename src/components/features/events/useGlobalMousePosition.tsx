import { useRef, useState } from "react";
import { useGlobalEvent } from "./useGlobalEvent";
import { Coordinates } from "../../../lib/util/objects/types";

export function useGlobalMousePosition(track: boolean): Coordinates {
	const [ mouseCoordinates, setMouseCoordinates ] = useState<Coordinates>({ x: 0, y: 0 });

	useGlobalEvent({
		event: "MOUSE_MOVE",
		handler: (e) => {
			if (!track) {
				return;
			}

			setMouseCoordinates({ x: e.clientX, y: e.clientY });
		}
	});

	return mouseCoordinates;
}
