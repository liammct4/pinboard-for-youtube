import { useContext, useMemo, useRef } from "react";
import { DragListContext, IDragListContext } from "./DragList";

export interface IDragListItemProperties {
	className?: string;
	id: string;
	children: JSX.Element | JSX.Element[];
}

export function DragListItem({ className, id, children }: IDragListItemProperties) {
	const bounds = useRef<HTMLDivElement>(null);
	const { dragging, dragListName, startDragFromItem, scrollY, baseY } = useContext<IDragListContext>(DragListContext);
	const { itemY, itemHeight }  = useMemo(() => {
		let boundCurrent = bounds?.current?.getBoundingClientRect();

		let neutral = boundCurrent?.y! - baseY;
		let withScrollConsidered = neutral + (scrollY * 1);

		return { itemY: withScrollConsidered, itemHeight: boundCurrent?.height }
	}, [scrollY, baseY, dragging]);

	return (
		<div
			className={`${className} drag-list-item`}
			ref={bounds}
			onMouseDown={(e) => startDragFromItem(id, { x: e.clientX, y: e.clientY })}
			data-box-id={id}
			data-y-box-position={Number.isNaN(itemY) ? 0 : itemY}
			data-box-height={itemHeight}
			data-drag-list-name={dragListName}>
			<>
				{children}
			</>
		</div>
	);
}
