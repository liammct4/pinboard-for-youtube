import { createContext } from "react";

export type SizeOption = "very small" | "small" | "medium" | "large" | "very large" | "max";
export interface IFormStyleContext {
	labelSize: SizeOption;
}

export const FormStyleContext = createContext<IFormStyleContext>({
	labelSize: "small",
});
