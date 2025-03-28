import React, { useRef } from "react";
import { GlobalEventContext, EventType, INamedGlobalEventHandler } from "./useGlobalEvent";
import { IWrapperProperties } from "../wrapper";

export function EventWrapper({ children }: IWrapperProperties): React.ReactNode {
	const handlers = useRef<INamedGlobalEventHandler[]>([]);

	const filterTriggerEvent = (e: React.MouseEvent<HTMLElement>, eventType: EventType) =>
		handlers
		.current
		.filter(x => x.event == eventType)
		.forEach(x => x.handler(e));

	return (
		<div
			style={{ width: "100%", height: "100%" }}
			onMouseDown={(e) => filterTriggerEvent(e, "MOUSE_DOWN")}
			onMouseMove={(e) => filterTriggerEvent(e, "MOUSE_MOVE")}
			onMouseUp={(e) => filterTriggerEvent(e, "MOUSE_UP")}>
			<GlobalEventContext.Provider value={{ handlers: handlers.current }}>
				{children}
			</GlobalEventContext.Provider>
		</div>
	);
}
