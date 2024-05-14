import { createContext, Context } from "react"

export interface IDropdownOptionContext {
	options: string[];
}

export const DropdownOptionsContext: Context<IDropdownOptionContext> = createContext<IDropdownOptionContext>({ options: [] });
