import { createContext, useReducer, useRef } from "react"
import { useGlobalEvent } from "../../components/features/events/useGlobalEvent";
import { Coordinates, Rect } from "../util/objects/types";
import { areObjectsEqual } from "../util/objects/objects";

export type DragListEvent<T extends string> = {
	startDragID: T;
	inbetweenStartID: T | null;
	inbetweenEndID: T | null;
	overlappingID: T | null;
	notInBounds: boolean;
};

export interface IDragListProperties<T extends string> {
	className?: string;
	children: JSX.Element | JSX.Element[];
	dragListName: string;
	onDragStart?: (startingID: T) => void;
	onDragChanged?: (e: DragListEvent<T>) => void;
	onDragEnd?: (e: DragListEvent<T>) => void;
}

export type InbetweenIDEventType = -1 | string | 1;

let defaultState: DragListState = {
	dragging: false
}

interface IDragListStateDragging {
	dragging: true;
	event: {
		info: DragListEvent<string>;
	}
	yBasePosition: number;
	scroll: number;
	startDragPosition: Coordinates;
	nodeElements: HTMLElement[];
}

type DragListState = IDragListStateDragging | { dragging: false };

type DragListAction = 
	{ type: "START_DRAG", startID: string, listBox: HTMLElement, dragListName: string, startDragPosition: Coordinates } |
	{ type: "CHANGED_DRAG", info: DragListEvent<string> } |
	{ type: "DRAG_ELEMENT_UPDATE", yPosition: number, scroll: number } |
	{ type: "END_DRAG" }

function reducer(state: DragListState, action: DragListAction): DragListState {
	switch (action.type) {
		case "START_DRAG":
			return {
				dragging: true,
				event: {
					info: {
						startDragID: action.startID,
						inbetweenEndID: null,
						inbetweenStartID: null,
						overlappingID: null,
						notInBounds: false
					}
				},
				startDragPosition: action.startDragPosition,
				nodeElements: Array.from(action.listBox.querySelectorAll(`.drag-list-item[data-drag-list-name=${action.dragListName}]`)),
				yBasePosition: action.listBox.getBoundingClientRect().y!,
				scroll: action.listBox.scrollTop
			}
		case "CHANGED_DRAG":
			if (!state.dragging) {
				return { ...state };
			}

			return {
				...state,
				event: {
					info: action.info
				}
			};
		case "DRAG_ELEMENT_UPDATE":
			if (!state.dragging) {
				return { ...state };
			}

			return {
				...state,
				yBasePosition: action.yPosition,
				scroll: action.scroll
			}
		case "END_DRAG":			
			return { dragging: false };
	}
}

export function DragList<T extends string>({ className, dragListName, children, onDragStart, onDragChanged, onDragEnd }: IDragListProperties<T>) {
	const listBox = useRef<HTMLUListElement>(null);
	const [ state, dispatch ] = useReducer(reducer, defaultState);

	useGlobalEvent({
		event: "MOUSE_MOVE",
		handler: (e) => {
			if (!state.dragging) {
				return;
			}
			
			let listBoxPosition = e.clientY - state.yBasePosition;
			let listBoxPositionWithScroll = listBoxPosition + listBox?.current?.scrollTop!;
			
			let info = calculateDragInfo(e.clientX, listBoxPositionWithScroll);

			if (!areObjectsEqual(info, state.event.info)) {
				dispatch({ type: "CHANGED_DRAG", info });
				onDragChanged?.(info as DragListEvent<T>);
			}
		}
	})
	useGlobalEvent({
		event: "MOUSE_UP",
		handler: () => {
			if (!state.dragging) {
				return;
			}

			onDragEnd?.(state.event.info as DragListEvent<T>);
			dispatch({ type: "END_DRAG" });
		}
	});

	const calculateOutOfBounds = (mouseX: number, mouseY: number) => {
		if (!state.dragging) {
			return false;
		}

		let boundsX = Math.abs(mouseX - state.startDragPosition.x);
		let boundsY = Math.abs(mouseY - state.startDragPosition.y);

		return boundsX < 10 && boundsY < 10;
	}

	const calculateDragInfo = (mouseX: number, mouseY: number): DragListEvent<T> => {
		if (!state.dragging) {
			throw Error("Called calculateDragInfo when not dragging.");
		}

		if (calculateOutOfBounds(mouseX, mouseY)) {
			let outOfBounds: DragListEvent<T> = {
				startDragID: state.event.info.startDragID as T,
				inbetweenEndID: null,
				inbetweenStartID: null,
				overlappingID: null,
				notInBounds: true
			}

			return outOfBounds;
		}

		for (let i = 0; i < state.nodeElements.length; i++) {
			let boxYPosition = Number(state.nodeElements[i].getAttribute("data-y-box-position"));
			let boxYHeight = Number(state.nodeElements[i].getAttribute("data-box-height"));

			let bottomOfBoxItem = boxYPosition + boxYHeight;
			let maxBound = bottomOfBoxItem;
			
			let nextNode = state.nodeElements[i + 1];

			if (nextNode != undefined) {
				maxBound = Number(nextNode.getAttribute("data-y-box-position"));
			}

			if (
				mouseY > boxYPosition &&
				mouseY < maxBound
			) {
				let overlappingID = state.nodeElements[i].getAttribute("data-box-id") as T;

				let diffBetweenStart = Math.abs(mouseY - boxYPosition);
				let diffBetweenEnd = Math.abs(mouseY - bottomOfBoxItem);

				let startID: T | null;
				let endID: T | null;

				if (diffBetweenStart <= diffBetweenEnd) {
					startID = state.nodeElements[i - 1]?.getAttribute("data-box-id") as T;
					endID = overlappingID as T;
				}
				else {
					startID = overlappingID as T;
					endID = state.nodeElements[i + 1]?.getAttribute("data-box-id") as T;
				}

				return {
					startDragID: state.event.info.startDragID as T,
					inbetweenStartID: startID,
					inbetweenEndID: endID,
					overlappingID: overlappingID,
					notInBounds: false
				}
			}
		}

		let info: DragListEvent<T> = {
			startDragID: state.event.info.startDragID as T,
			inbetweenStartID: null,
			inbetweenEndID: null,
			overlappingID: null,
			notInBounds: true
		};

		return info;
	}
	
	return (
		<DragListContext.Provider
			value={{
				dragListName,
				startDragID: state.dragging ? state.event.info.startDragID : null,
				overlappingID: state.dragging && !state.event.info.notInBounds ? state.event.info.overlappingID : null,
				inbetweenStartID: state.dragging && !state.event.info.notInBounds ? state.event.info.inbetweenStartID: null,
				inbetweenEndID: state.dragging && !state.event.info.notInBounds ? state.event.info.inbetweenEndID : null,
				startDragFromItem: (e, position) => {
					dispatch({
						type: "START_DRAG",
						startID: e,
						listBox: listBox.current as HTMLElement,
						startDragPosition: position,
						dragListName: dragListName
					});
					onDragStart?.(e as T);
				},
				baseY: state.dragging ? state.yBasePosition : 0,
				scrollY: state.dragging ? state.scroll : 0
			}}>
			<ul
				className={className}
				ref={listBox}
				onScroll={(e) => {
					if (state.dragging) {
						dispatch({ type: "DRAG_ELEMENT_UPDATE", yPosition: e.currentTarget.getBoundingClientRect().y, scroll: e.currentTarget.scrollTop! });
					}
				}}>
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
	startDragFromItem: (id: string, position: Coordinates) => void;
	baseY: number;
	scrollY: number;
}

export const DragListContext = createContext<IDragListContext>(null!);
