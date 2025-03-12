import { createContext, useContext, useRef } from "react";

export type EventType = "MOUSE_MOVE" | "MOUSE_UP" | "MOUSE_DOWN";
export type GlobalEventAction = (e: React.MouseEvent<HTMLElement>) => void;

export type GlobalEventHandler = {
	event: EventType;
	handler: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface INamedGlobalEventHandler extends GlobalEventHandler {
	name: string;
}

export function useGlobalEvent({ event, handler }: GlobalEventHandler) {
	const unique = useRef(crypto.randomUUID());
	const { handlers } = useContext<IGlobalEventContext>(GlobalEventContext);

	let index = handlers.findIndex(x => x.name == unique.current && x.event == event);

	if (index == -1) {
		handlers.push({ name: unique.current, event, handler });
	}
	else {
		handlers[index] = { name: unique.current, event, handler };
	}
}

export interface IGlobalEventContext {
	handlers: INamedGlobalEventHandler[];
}

export const GlobalEventContext = createContext<IGlobalEventContext>({
	handlers: []
});
