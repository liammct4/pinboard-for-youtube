import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./SelectionBoxScrollbox.css";
import { Coordinates, Rect } from "../../../lib/util/objects/types";
import { useGlobalEvent } from "../../features/events/useGlobalEvent";
import { DragListControllerContext } from "../dragList/DragListController";

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
	const { active } = useContext(DragListControllerContext);
	const frameRef = useRef<HTMLDivElement>(null!);
	const [ selectionAnchor, setSelectionAnchor ] = useState<Coordinates | null>(null);
	const selectionBoxRef = useRef<HTMLDivElement | null>(null);
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
	useGlobalEvent({
		event: "MOUSE_UP",
		handler: (e) => {
			let frame = document.querySelector(".selection-box-frame");
			
			if (frame == null) {
				return;
			}
			
			let selectionBox = calculateSelectionBox(e.clientX, e.clientY, frame.scrollLeft, frame.scrollTop);

			if (selectionBox == null) {
				return;
			}

			onSelectEnd?.(selectionBox);
			setSelectionAnchor(null);
		}
	});

	const calculateSelectionBox = (mouseX: number, mouseY: number, scrollLeft?: number, scrollTop?: number) => {
		let scrollLeftValue = scrollLeft ?? frameRef.current.scrollLeft;
		let scrollTopValue = scrollTop ?? frameRef.current.scrollTop;

		let relativeToScrollboxMouse = {
			x: (mouseX - frameBounds.position.x) + scrollLeftValue,
			y: (mouseY - frameBounds.position.y) + scrollTopValue
		};

		if (selectionAnchor == null) {
			return null;
		}

		let x = Math.min(selectionAnchor.x, relativeToScrollboxMouse.x);
		let y = Math.min(selectionAnchor.y, relativeToScrollboxMouse.y);

		let remainingWidth = Math.floor((frameBounds.size.width + frameRef.current.scrollLeft) - x)
		let remainingHeight = Math.floor((frameBounds.size.height + frameRef.current.scrollTop) - y);

		let selectionBox: Rect = {
			position: { x, y },
			size: {
				width: Math.min(Math.abs(relativeToScrollboxMouse.x - selectionAnchor.x), remainingWidth - 1) - 1,
				height: Math.min(Math.abs(relativeToScrollboxMouse.y - selectionAnchor.y), remainingHeight - 1) - 1
			}
		};

		return selectionBox;
	}

	const selectionBoxMouseHandler = (e: React.MouseEvent<HTMLElement>) => {
		if (!active || selectionAnchor == null || selectionBoxRef.current == null) {
			return;
		}

		let selectionBox = calculateSelectionBox(e.clientX, e.clientY);

		if (selectionAnchor != null && selectionBox != null) {
			onSelectMove?.(selectionBox);
		}

		selectionBoxRef.current.style.left = `${selectionBox?.position.x}px`;
		selectionBoxRef.current.style.top = `${selectionBox?.position.y}px`;
		selectionBoxRef.current.style.width = `${selectionBox?.size.width}px`;
		selectionBoxRef.current.style.height = `${selectionBox?.size.height}px`;
	};
	
	useGlobalEvent({ event: "MOUSE_MOVE", handler: selectionBoxMouseHandler });

	useEffect(() => {
		frameRef.current.scrollTo({ top: startingScrollPosition, behavior: "instant" });
	}, [startingScrollPosition]);

	return (
		<div
			tabIndex={0}
			className={`${frameClassName} selection-box-frame`}
			onMouseDown={(e) => {
				if (!active) {
					return;
				}

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
						className={`selection-box ${boxClassName}`}
						ref={selectionBoxRef}/>
					: <></>
				}
				{children}
		</div>
	);
}
