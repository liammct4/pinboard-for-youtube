import { createContext, useEffect, useMemo, useRef, useState } from "react"

export type DragEvent = {
	startDragID: string;
	inbetweenStartID: string | null;
	inbetweenEndID: string | null;
	overlappingID: string | null;
}

export interface IDragListProperties {
	className?: string;
	children: JSX.Element | JSX.Element[];
	dragListName: string;
	onDrag?: (e: DragEvent) => void;
	onDragEnd?: (e: DragEvent) => void;
}

export type InbetweenIDEventType = -1 | string | 1;

export function DragList({ className, dragListName, children, onDrag, onDragEnd }: IDragListProperties) {
	const listBox = useRef<HTMLDivElement>(null);
	const [ startDragID, setStartDragID ] = useState<string | null>(null);
	const [ yMousePosition, setYMousePosition ] = useState<number>(0);
	const [ yScroll, setYScroll ] = useState<number>(0);
	const [ yBasePosition, setYBasePosition ] = useState<number>(0);
	const dragInfo = useMemo<DragEvent | null>(() => {
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
				let overlappingID = children[i].getAttribute("data-box-id");

				let diffBetweenStart = Math.abs(yMousePosition - boxYPosition);
				let diffBetweenEnd = Math.abs(yMousePosition - bottomOfBoxItem);

				let startID: string | null;
				let endID: string | null;

				if (diffBetweenStart <= diffBetweenEnd) {
					startID = children[i - 1]?.getAttribute("data-box-id");
					endID = overlappingID;
				}
				else {
					startID = overlappingID;
					endID = children[i + 1]?.getAttribute("data-box-id");
				}

				return {
					startDragID: startDragID!,
					inbetweenStartID: startID,
					inbetweenEndID: endID,
					overlappingID: overlappingID
				}
			}
		}

		return null;
	}, [yMousePosition]);
	useEffect(() => {
		if (onDrag != undefined && dragInfo != null) {
			onDrag(dragInfo);
		}
	}, [dragInfo]);

	const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (startDragID != null) {
			let y = listBox.current?.getBoundingClientRect().y!;
			let listBoxPosition = e.clientY - y;
			let listBoxPositionWithScroll = listBoxPosition + listBox?.current?.scrollTop!;

			setYBasePosition(y);
			setYScroll(listBox?.current?.scrollTop!);
			setYMousePosition(listBoxPositionWithScroll);
		}
	};
	
	useEffect(() => {
		window.addEventListener("mouseup", () => {
			setStartDragID(null);

			if (onDragEnd != null) {
				onDragEnd(dragInfo!);
			}
		});
	}, [listBox.current]);
	
	return (
		<DragListContext.Provider
			value={{
				dragListName,
				startDragID,
				overlappingID: dragInfo?.overlappingID ?? null,
				inbetweenStartID: dragInfo?.inbetweenStartID ?? null,
				inbetweenEndID: dragInfo?.inbetweenEndID ?? null,
				setStartDragID: setStartDragID,
				baseY: yBasePosition,
				scrollY: yScroll
			}}>
			<div className={className} ref={listBox} onMouseMove={onMouseMove}>
				{children}
			</div>
		</DragListContext.Provider>
	)
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
