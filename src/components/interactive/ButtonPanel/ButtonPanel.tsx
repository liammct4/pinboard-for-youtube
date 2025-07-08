import { KeyboardEvent, useEffect, useRef } from "react";
import "./ButtonPanel.css"

export interface IButtonPanelProperties {
	className?: string;
	direction?: "Horizontal" | "Vertical";
	children: JSX.Element | JSX.Element[];
}

export function ButtonPanel({ className, direction = "Horizontal", children }: IButtonPanelProperties) {
	const panelRef = useRef<HTMLDivElement>(null!);
	const existingHandler = useRef<((e: KeyboardEvent) => void) | null>(null);

	const listener = (e: KeyboardEvent) => {
		const buttons = Array.from(panelRef.current?.querySelectorAll("input, button"));
		const previousKey = direction == "Horizontal" ? "ArrowLeft" : "ArrowUp";
		const nextKey = direction == "Horizontal" ? "ArrowRight" : "ArrowDown";
			
		if (e.key != previousKey && e.key != nextKey) {
			return;
		}

		let index = buttons.findIndex(b => b.isSameNode(e.currentTarget));
		let newIndex: number;

		if (e.key == previousKey) {
			newIndex = index - 1 < 0 ? buttons.length - 1 : index - 1;
		}
		else {
			newIndex = index + 1 > buttons.length - 1 ? 0 : index + 1;
		}

		let target = buttons[newIndex] as HTMLElement;

		if (target != null) {
			target.focus();
		}
	};

	useEffect(() => {
		const buttons = Array.from(panelRef.current?.querySelectorAll("input, button"));

		if (existingHandler.current != null) {
			buttons.forEach(n => {
				// @ts-ignore Doesn't provide the correct event type.
				(n as HTMLButtonElement).removeEventListener("keydown", existingHandler.current);
			});
		}

		existingHandler.current = listener;

		buttons.forEach(n => {
			// @ts-ignore Doesn't provide the correct event type.
			(n as HTMLButtonElement).addEventListener("keydown", listener);
		});
	}, [panelRef.current, direction, children]);
	
	return (
		<div
			className={`${className} button-panel`}
			ref={panelRef}
			style={{ flexDirection: direction == "Vertical" ? "column" : "row" }}>
				{children}
		</div>
	);
}
