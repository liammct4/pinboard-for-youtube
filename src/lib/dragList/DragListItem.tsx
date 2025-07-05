import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DragListContext, IDragListContext } from "./DragList";

export interface IDragListItemProperties {
	className?: string;
	id: string;
	children: JSX.Element | JSX.Element[];
}

export function DragListItem({ className, id, children }: IDragListItemProperties) {
	const bounds = useRef<HTMLDivElement>(null);
	const { dragListName, setStartDragID, scrollY, baseY } = useContext<IDragListContext>(DragListContext);
	const [ counter, setCounter ] = useState<number>(0);
	const { itemY, itemHeight }  = useMemo(() => {
		let boundCurrent = bounds?.current?.getBoundingClientRect();

		let neutral = boundCurrent?.y! - baseY;
		let withScrollConsidered = neutral + (scrollY * 1);

		return { itemY: withScrollConsidered, itemHeight: boundCurrent?.height }
	}, [scrollY, baseY, counter]);

	// TODO: Replace with MutationObserver
	useEffect(() => {
		setTimeout(() => {
			setCounter(Math.random());
		}, 100);
	}, [counter])
	
	return (
		<div
			className={`${className} drag-list-item`}
			ref={bounds}
			onMouseDown={(e) => setStartDragID(id, { x: e.clientX, y: e.clientY })}
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
