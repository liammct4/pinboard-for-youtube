import { useMemo, useRef, useState } from "react";
import { DragListItemData } from "../../../lib/dragList/DragList";
import { SelectionBoxScrollbox } from "../SelectionBoxScrollbox/SelectionBoxScrollbox";
import { Rect } from "../../../lib/util/objects/types";
import { rectIntersects } from "../../../lib/util/generic/miscUtil";
import "./SelectionDragList.css"

export interface ISelectionDragListProperties<T extends string> {
	className?: string;
	boxClassName?: string;
	itemIDName: string;
	allowSelection?: boolean;
	setSelectedItems: (items: T[]) => void;
	onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
	startingScrollPosition?: number;
	onClickCapture?: (e: React.MouseEvent<HTMLDivElement>) => void;
	ref: React.MutableRefObject<HTMLDivElement>;
	children: JSX.Element | JSX.Element[];
}

export function SelectionList<T extends string>({
		itemIDName,
		className,
		boxClassName,
		setSelectedItems,
		allowSelection,
		onScroll,
		startingScrollPosition,
		ref: outerListBox,
		onClickCapture,
		children,
	}: ISelectionDragListProperties<T>) {
	const [ elementItems, setElementItems] = useState<Element[]>([]);
	const dataItems = useMemo<DragListItemData[]>(() => {
		if (elementItems.length == 0) {
			return [];
		}

		let listBounds = outerListBox.current.getBoundingClientRect();

		return elementItems.map<DragListItemData>(element => {
			let elementBounds = element.getBoundingClientRect();
			
			return {
				id: element.getAttribute("data-box-id") as T,
				bounds: {
					position: {
						x: elementBounds.left - listBounds.left,
						y: elementBounds.top - listBounds.top
					},
					size: {
						width: elementBounds.width,
						height: elementBounds.height
					}
				}
			};
		});
	}, [elementItems]);

	const onSelectMove = (selectionBox: Rect) => {
		if (!allowSelection) {
			return;
		}

		setSelectedItems(dataItems
			.filter(x => rectIntersects(x.bounds, selectionBox))
			.map(x => x.id as T)
		);
	};

	return (
		<SelectionBoxScrollbox
			frameClassName={className}
			boxClassName={allowSelection ? boxClassName : ""}
			onSelectBegin={() => setElementItems([ ...outerListBox.current.querySelectorAll(`.drag-list-item[data-drag-list-name=${itemIDName}]`) ])}
			onSelectMove={onSelectMove}
			startingScrollPosition={startingScrollPosition}
			onScroll={onScroll}>
			<div ref={outerListBox} onClickCapture={onClickCapture}>
				{children}
			</div>
		</SelectionBoxScrollbox>
	);
}
