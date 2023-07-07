export type Handler<T> = (args: T) => void;

/**
 * Encapsulates a set of related event handlers which can be dispatched from a single source.
 */
export class MultiEvent<T> {
	private handlers: Array<Handler<T>> = [];

	public subscribe(newHandler: Handler<T>): boolean {
		if (this.handlers.findIndex(x => x == newHandler) != -1) {
			return false;
		}

		this.handlers.push(newHandler);

		return true;
	}

	public unsubscribe(handler: Handler<T>): boolean {
		let index: number = this.handlers.findIndex(x => x == handler);

		if (index == -1) {
			return false;
		}

		this.handlers.splice(index, 1);

		return true;
	}

	public dispatch(eventArgs: T): void {
		this.handlers.forEach(element => {
			element(eventArgs);
		});
	}
}
