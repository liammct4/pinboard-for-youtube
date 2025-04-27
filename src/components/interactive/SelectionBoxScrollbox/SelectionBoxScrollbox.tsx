import { useEffect, useMemo, useRef, useState } from "react";
import "./SelectionBoxScrollbox.css";
import { Coordinates, Rect } from "../../../lib/util/objects/types";
import { useGlobalMousePosition } from "../../features/events/useGlobalMousePosition";
import { useGlobalEvent } from "../../features/events/useGlobalEvent";
import { DragListItemData } from "../../../lib/dragList/DragList";

export interface ISelectionBoxScrollboxProperties {
	frameClassName?: string;
	boxClassName?: string;
	onSelectBegin?: (startingPoint: Coordinates) => void;
	onSelectMove?: (box: Rect) => void;
	onSelectEnd?: (box: Rect) => void;
	onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
	startingScrollPosition?: number; 
	children: JSX.Element | JSX.Element[];
}

export function SelectionBoxScrollbox({
		frameClassName, 
		boxClassName,
		onSelectBegin,
		onSelectMove,
		onSelectEnd,
		onScroll,
		startingScrollPosition,
		children
	}: ISelectionBoxScrollboxProperties) {
	const frameRef = useRef<HTMLDivElement>(null!);
	const [ selectionAnchor, setSelectionAnchor ] = useState<Coordinates | null>(null);
	const mouse = useGlobalMousePosition(true);
	const frameBounds = useMemo<Rect>(() => {
		if (frameRef.current == null) {
			return {
				position: {
					x: 0,
					y: 0
				},
				size: {
					width: 0,
					height: 0
				}
			};
		}

		let bounds = frameRef.current.getBoundingClientRect();

		return {
			position: {
				x: bounds.x,
				y: bounds.y
			},
			size: {
				width: bounds.right - bounds.left,
				height: bounds.bottom - bounds.top
			}
		};
	}, [frameRef.current, selectionAnchor]);
	const relativeToScrollboxMouse = useMemo<Coordinates>(() => {
		if (frameRef.current == null) {
			return { 
				x: 0,
				y: 0
			};
		}

		return {
			x: (mouse.x - frameBounds.position.x) + frameRef.current.scrollLeft,
			y: (mouse.y - frameBounds.position.y) + frameRef.current.scrollTop
		};
	}, [mouse, frameBounds]);
	const selectionBox = useMemo<Rect | null>(() => {
		if (selectionAnchor == null) {
			return null;
		}

		return {
			position: {
				x: Math.min(selectionAnchor.x, relativeToScrollboxMouse.x),
				y: Math.min(selectionAnchor.y, relativeToScrollboxMouse.y)
			},
			size: {
				width: Math.abs(relativeToScrollboxMouse.x - selectionAnchor.x),
				height: Math.abs(relativeToScrollboxMouse.y - selectionAnchor.y)
			}
		};
	}, [mouse, selectionAnchor]);
	useGlobalEvent({
		event: "MOUSE_UP",
		handler: () => {
			if (selectionBox == null) {
				return;
			}

			onSelectEnd?.(selectionBox);
			setSelectionAnchor(null);
		}
	});
	useEffect(() => {
		if (selectionAnchor != null && selectionBox != null) {
			onSelectMove?.(selectionBox);
		}
	}, [selectionBox]);

	useEffect(() => {
		frameRef.current.scrollTo({ top: startingScrollPosition, behavior: "instant" });
	}, [startingScrollPosition]);

	return (
		<div
			className={`${frameClassName} selection-box-frame`}
			onMouseDown={(e) => {
				let bounds = frameRef.current.getBoundingClientRect();

				let anchor: Coordinates = {
					x: (e.clientX - bounds.left) + frameRef.current.scrollLeft,
					y: (e.clientY - bounds.top) + frameRef.current.scrollTop
				};

				setSelectionAnchor(anchor);
				onSelectBegin?.(anchor);
			}}
			onScroll={onScroll}
			ref={frameRef}>
				{ selectionAnchor != null ?
					<div
						style={{
							left: selectionBox?.position.x,
							top: selectionBox?.position.y,
							width: selectionBox?.size.width,
							height: selectionBox?.size.height
						}}
						className={`selection-box ${boxClassName}`}
						/>
					: <></>
				}
				{children}
		</div>
	);
}
