import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalEvent } from "../../features/events/useGlobalEvent";
import "./MouseTooltip.css";
import { useGlobalMousePosition } from "../../features/events/useGlobalMousePosition";

export type Positioning = "START" | "CENTRE" | "END";

export interface IMouseTooltipProperties {
	children: JSX.Element | JSX.Element[];
	show: boolean;
	horizontal: Positioning;
	vertical: Positioning;
}

export function MouseTooltip({ horizontal, vertical, show, children }: IMouseTooltipProperties) {
	const frame = useRef<HTMLDivElement>(null!);
	const [ { width, height }, setSize ] = useState<{ width: number, height: number }>({ width: 0, height: 0});
	const mouse = useGlobalMousePosition(show);
	const displayMouseX = useMemo(() => {
		switch (horizontal) {
			case "START":
				return mouse.x;
			case "CENTRE":
				return mouse.x - (width / 2);
			case "END":
				return mouse.x - width;
		}
	}, [mouse.x, width]);
	const displayMouseY = useMemo(() => {
		switch (vertical) {
			case "START":
				return mouse.y;
			case "CENTRE":
				return mouse.y - (height / 2);
			case "END":
				return mouse.y - height;
		}
	}, [mouse.y, height]);
	useEffect(() => {
		if (!frame.current) {
			return;
		}

		new ResizeObserver(() => {
			let bounds = frame.current.getBoundingClientRect();

			setSize({ width: bounds.width, height: bounds.height });
		}).observe(frame.current);
	}, [frame.current]);
	
	return (
		show ?
			<div
				className="mouse-tooltip-outer-frame"
				style={{ left: `${displayMouseX}px`, top: `${displayMouseY}px` }}
				ref={frame}>
					{children}
			</div>
			:
			<></>
	);
}
