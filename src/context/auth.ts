import { createContext } from "react";
import { IAuthenticatedUser } from "../lib/user/accounts";

export interface IUserAuthContext {
	currentUser: IAuthenticatedUser | undefined;
}

export const UserAuthContext = createContext<IUserAuthContext>({ currentUser: undefined });
