import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalEvent } from "../../features/events/useGlobalEvent";
import "./MouseTooltip.css";

export type Positioning = "START" | "CENTRE" | "END";

export interface IMouseTooltipProperties {
	children: JSX.Element | JSX.Element[];
	show: boolean;
	horizontal: Positioning;
	vertical: Positioning;
}

export function MouseTooltip({ horizontal, vertical, show, children }: IMouseTooltipProperties) {
	const unique = useRef(crypto.randomUUID());
	const frame = useRef<HTMLDivElement>(null!);
	const [ { width, height }, setSize ] = useState<{ width: number, height: number }>({ width: 0, height: 0});
	const [ mouseX, setMouseX ] = useState<number>(0);
	const [ mouseY, setMouseY ] = useState<number>(0);
	const displayMouseX = useMemo(() => {
		switch (horizontal) {
			case "START":
				return mouseX;
			case "CENTRE":
				return mouseX - (width / 2);
			case "END":
				return mouseX - width;
		}
	}, [mouseX, width]);
	const displayMouseY = useMemo(() => {
		switch (vertical) {
			case "START":
				return mouseY;
			case "CENTRE":
				return mouseY - (height / 2);
			case "END":
				return mouseY - height;
		}
	}, [mouseY, height]);
	useEffect(() => {
		if (!frame.current) {
			return;
		}

		new ResizeObserver(() => {
			let bounds = frame.current.getBoundingClientRect();

			setSize({ width: bounds.width, height: bounds.height });
		}).observe(frame.current);
	}, [frame.current]);

	useGlobalEvent({
		name: `mouse-tooltip-${unique.current}`,
		event: "MOUSE_MOVE",
		handler: (e) => {
			if (!show) {
				return;
			}

			setMouseX(e.clientX);
			setMouseY(e.clientY);
		}
	});
	
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
