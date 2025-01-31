import { createContext, useContext } from "react";

export type EventType = "MOUSE_MOVE" | "MOUSE_UP" | "MOUSE_DOWN";
export type GlobalEventAction = (e: React.MouseEvent<HTMLElement>) => void;

export type GlobalEventHandler = {
	name: string;
	event: EventType;
	handler: (e: React.MouseEvent<HTMLElement>) => void;
}

export function useGlobalEvent({ name, event, handler }: GlobalEventHandler) {
	const { handlers } = useContext<IGlobalEventContext>(GlobalEventContext);

	let index = handlers.findIndex(x => x.name == name && x.event == event);

	if (index == -1) {
		handlers.push({ name, event, handler });
	}
	else {
		handlers[index] = { name, event, handler };
	}
}

export interface IGlobalEventContext {
	handlers: GlobalEventHandler[];
}

export const GlobalEventContext = createContext<IGlobalEventContext>({
	handlers: []
});
