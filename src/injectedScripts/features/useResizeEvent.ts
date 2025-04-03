import { useEffect, useState } from "react";
import { Size } from "../../lib/util/objects/types";

export function useResizeEvent<T extends HTMLElement>(elem: React.RefObject<T>) {
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
		}, 100);
	}, [elem.current]);

	return { size };
}
