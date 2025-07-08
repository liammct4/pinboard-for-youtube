import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IAuthenticatedUser, loginGetTokens } from "../../lib/user/accounts";
import { authActions } from "../../features/auth/authSlice";

export interface IKeyIDItem {
	id: string;
}

export type DataMutation<T> = {
	dataID: string;
	timestamp: number;
	position: number;
	data: T | null;
}

interface ISignedIn extends IUseUserAccount { user: IAuthenticatedUser, isSignedIn: true };
interface INotSignedIn extends IUseUserAccount { user: undefined, isSignedIn: false };

interface IUseUserAccount {
	attemptLogin: (email: string, password: string) => Promise<IAuthenticatedUser | undefined>
}

export function useUserAccount(): ISignedIn | INotSignedIn {
	const currentUser = useSelector((x: RootState) => x.auth.currentUser);
	const dispatch = useDispatch();
	const isSignedIn = currentUser != undefined;
	
	const attemptLogin = async (email: string, password: string) => {
		let tokens = await loginGetTokens(email, password);

		if (tokens == undefined) {
			return undefined;
		}

		let newlyAuthenticatedUser: IAuthenticatedUser = { email, tokens };

		dispatch(authActions.setCurrentUser(newlyAuthenticatedUser));
		return newlyAuthenticatedUser;
	}
	
	if (isSignedIn) {
		return { user: currentUser, isSignedIn: isSignedIn, attemptLogin };
	}
	
	return { user: undefined, isSignedIn: false, attemptLogin };
}
