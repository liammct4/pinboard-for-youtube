import { useEffect, useState } from "react";
import { Coordinates, Rect, Size } from "../../lib/util/objects/types";

export function useBoundsChangeEvent<T extends HTMLElement>(elem: React.RefObject<T>): Rect {
	const [ position, setPosition ] = useState<Coordinates>({ x: 0, y: 0 });
	const [ size, setSize ] = useState<Size>({ width: 0, height: 0 });
	useEffect(() => {
		setTimeout(() => {
			if (elem.current == null) {
				return;
			}
	
			const update = () => {
				if (elem.current == null) {
					return;
				}
		
				let bounds = elem.current.getBoundingClientRect();
	
				setSize({
					width: bounds.width,
					height: bounds.height
				});
			}
			
			new ResizeObserver(update).observe(elem.current);
			update();

			// Position changes, only way is to constantly check via recursion.
			const checkPosition = () => {
				let bounds = elem.current?.getBoundingClientRect();

				if (bounds == undefined) {
					setTimeout(checkPosition, 200);
					return;
				}

				let actualCoordinates: Coordinates = {
					x: bounds.x,
					y: bounds.y
				}
				
				if (actualCoordinates.x != position.x || actualCoordinates.y != position.y) {
					setPosition(actualCoordinates);
				}

				setTimeout(checkPosition, 200);
			}

			setTimeout(checkPosition, 100);
		}, 100);
	}, [elem.current]);

	return {
		position: position,
		size: size
	};
}
