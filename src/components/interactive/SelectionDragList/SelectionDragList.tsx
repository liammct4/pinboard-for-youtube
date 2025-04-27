import { useEffect, useMemo, useRef, useState } from "react";
import { DragEvent, DragList, DragListItemData } from "../../../lib/dragList/DragList";
import { SelectionBoxScrollbox } from "../SelectionBoxScrollbox/SelectionBoxScrollbox";
import "./SelectionDragList.css"
import { Rect } from "../../../lib/util/objects/types";
import { rectIntersects } from "../../../lib/util/generic/miscUtil";

export interface ISelectionDragListProperties {
	className?: string;
	boxClassName?: string;
	allowSelection?: boolean;
	setSelectedItems: (items: string[]) => void;
	onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
	startingScrollPosition?: number;
	children: JSX.Element | JSX.Element[];
}

export function SelectionList({
		className,
		boxClassName,
		setSelectedItems,
		allowSelection,
		onScroll,
		startingScrollPosition,
		children,
	}: ISelectionDragListProperties) {
	const outerListBox = useRef<HTMLDivElement>(null!);
	const [ elementItems, setElementItems] = useState<Element[]>([]);
	const dataItems = useMemo<DragListItemData[]>(() => {
		if (elementItems.length == 0) {
			return [];
		}

		let listBounds = outerListBox.current.getBoundingClientRect();

		return elementItems.map<DragListItemData>(element => {
			let elementBounds = element.getBoundingClientRect();
			
			return {
				id: element.getAttribute("data-box-id") as string,
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
			.map(x => x.id)
		);
	};

	return (
		<SelectionBoxScrollbox
			frameClassName={className}
			boxClassName={allowSelection ? boxClassName : ""}
			onSelectBegin={() => setElementItems([ ...outerListBox.current.querySelectorAll(".drag-list-item") ])}
			onSelectMove={onSelectMove}
			startingScrollPosition={startingScrollPosition}
			onScroll={onScroll}>
			<div ref={outerListBox}>
				{children}
			</div>
		</SelectionBoxScrollbox>
	);
}
