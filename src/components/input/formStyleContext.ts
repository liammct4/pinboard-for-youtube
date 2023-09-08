import { createContext } from "react";

export type SizeOption = "small" | "medium" | "large" | "max";
export interface IFormStyleContext {
	labelSize: SizeOption;
}

export const FormStyleContext = createContext<IFormStyleContext>({
	labelSize: "small",
});
