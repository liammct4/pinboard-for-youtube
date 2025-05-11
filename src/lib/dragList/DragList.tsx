import { createContext, useEffect, useMemo, useRef, useState } from "react"
import { useGlobalEvent } from "../../components/features/events/useGlobalEvent";
import { Coordinates, Rect } from "../util/objects/types";
import { useGlobalMousePosition } from "../../components/features/events/useGlobalMousePosition";

export type DragEvent<T extends string> = {
	startDragID: T;
	inbetweenStartID: T | null;
	inbetweenEndID: T | null;
	overlappingID: T | null;
} | "NOT_IN_BOUNDS";

export interface IDragListProperties<T extends string> {
	className?: string;
	children: JSX.Element | JSX.Element[];
	dragListName: string;
	onDragStart?: (startingID: T) => void;
	onDrag?: (e: DragEvent<T>) => void;
	onDragEnd?: (e: DragEvent<T>) => void;
}

export type InbetweenIDEventType = -1 | string | 1;

export function DragList<T extends string>({ className, dragListName, children, onDragStart, onDrag, onDragEnd }: IDragListProperties<T>) {
	const listBox = useRef<HTMLUListElement>(null);
	const [ startDragID, setStartDragID ] = useState<T | null>(null);
	const [ startDragPosition, setStartDragPosition ] = useState<Coordinates | null>(null);
	const [ yMousePosition, setYMousePosition ] = useState<number>(0);
	const [ yScroll, setYScroll ] = useState<number>(0);
	const [ yBasePosition, setYBasePosition ] = useState<number>(0);
	const dragInfo = useMemo<DragEvent<T> | null>(() => {
		let children = listBox?.current?.querySelectorAll(`.drag-list-item[data-drag-list-name=${dragListName}]`);
		
		if (children == undefined) {
			return null;
		}

		for (let i = 0; i < children.length; i++) {
			let boxYPosition = Number(children[i].getAttribute("data-y-box-position"));
			let boxYHeight = Number(children[i].getAttribute("data-box-height"));

			let bottomOfBoxItem = boxYPosition + boxYHeight;

			if (
				yMousePosition > boxYPosition &&
				yMousePosition < bottomOfBoxItem
			) {
				let overlappingID = children[i].getAttribute("data-box-id") as T;

				let diffBetweenStart = Math.abs(yMousePosition - boxYPosition);
				let diffBetweenEnd = Math.abs(yMousePosition - bottomOfBoxItem);

				let startID: T | null;
				let endID: T | null;

				if (diffBetweenStart <= diffBetweenEnd) {
					startID = children[i - 1]?.getAttribute("data-box-id") as T;
					endID = overlappingID as T;
				}
				else {
					startID = overlappingID as T;
					endID = children[i + 1]?.getAttribute("data-box-id") as T;
				}

				return {
					startDragID: startDragID as T,
					inbetweenStartID: startID,
					inbetweenEndID: endID,
					overlappingID: overlappingID
				}
			}
		}

		return "NOT_IN_BOUNDS";
	}, [yMousePosition]);
	const mouse = useGlobalMousePosition(dragInfo != null);
	const outOfBounds = useMemo(() => {
		if (startDragPosition == null) {
			return true;
		}

		let boundsX = Math.abs(mouse.x - startDragPosition.x);
		let boundsY = Math.abs(mouse.y - startDragPosition.y);
	
		return boundsX > 10 || boundsY > 10;
	}, [mouse.x, mouse.y, startDragPosition?.x, startDragPosition?.y, ]);
	useEffect(() => {
		if (onDrag != undefined && dragInfo && outOfBounds) {
			onDrag(dragInfo);
		}
	}, [dragInfo]);
	useGlobalEvent({
		event: "MOUSE_UP",
		handler: () => {
			setStartDragID(null);

			if (onDragEnd != null) {
				onDragEnd(dragInfo!);
				setStartDragPosition(null);
			}
		}
	});
	useGlobalEvent({
		event: "MOUSE_MOVE",
		handler: (e: React.MouseEvent<HTMLElement>) => {
			if (startDragID != null) {
				let y = listBox.current?.getBoundingClientRect().y!;
				let listBoxPosition = e.clientY - y;
				let listBoxPositionWithScroll = listBoxPosition + listBox?.current?.scrollTop!;
	
				setYBasePosition(y);
				setYScroll(listBox?.current?.scrollTop!);
				setYMousePosition(listBoxPositionWithScroll);

				if (startDragPosition == null) {
					setStartDragPosition({ x: e.clientX, y: e.clientY });
				}
			}
		}
	})
	
	return (
		<DragListContext.Provider
			value={{
				dragListName,
				startDragID,
				overlappingID: dragInfo != "NOT_IN_BOUNDS" ? dragInfo?.overlappingID ?? null : null,
				inbetweenStartID: dragInfo != "NOT_IN_BOUNDS" ? dragInfo?.inbetweenStartID ?? null : null,
				inbetweenEndID: dragInfo != "NOT_IN_BOUNDS" ? dragInfo?.inbetweenEndID ?? null : null,
				setStartDragID: (e) => {
					onDragStart?.(e as T);
					setStartDragID(e as T);
				},
				baseY: yBasePosition,
				scrollY: yScroll
			}}>
			<ul
				className={className}
				ref={listBox}>
				{children}
			</ul>
		</DragListContext.Provider>
	)
}

export type DragListItemData = {
	id: string;
	bounds: Rect;
}

export interface IDragListContext {
	dragListName: string;
	startDragID: string | null;
	overlappingID: string | null;
	inbetweenStartID: string | null;
	inbetweenEndID: string | null;
	setStartDragID: (id: string) => void;
	baseY: number;
	scrollY: number;
}

export const DragListContext = createContext<IDragListContext>(null!);
