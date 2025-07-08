import { createContext, useState } from "react";
import { IWrapperProperties } from "../../features/wrapper";

// Necessary because mouse events are still triggered even with a dialog box open.
export function DragListController({ children }: IWrapperProperties) {
	const [ active, setActive ] = useState<boolean>(true);
	
	return (
		<DragListControllerContext.Provider value={{ active, setActive }}>
			{children}
		</DragListControllerContext.Provider>
	)
}

export interface IDragListControllerContext {
	active: boolean;
	setActive: (active: boolean) => void;
}

export const DragListControllerContext = createContext<IDragListControllerContext>({
	active: true,
	setActive: () => console.error("DragListControllerContext.setActive: No context provided.")
});
