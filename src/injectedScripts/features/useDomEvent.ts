import { useRef } from "react";

// Copied from add/removeEventListener definition.
type Handler<E extends keyof DocumentEventMap> = (this: Document, ev: DocumentEventMap[E]) => any;

export function useDomEvent<E extends keyof DocumentEventMap>(event: E, handler: Handler<E>) {
	const existingHandler = useRef<Handler<E> | null>(null);

	if (existingHandler.current != null) {
		document.removeEventListener(event, existingHandler.current);
	}

	existingHandler.current = handler;
	document.addEventListener(event, handler);
}
