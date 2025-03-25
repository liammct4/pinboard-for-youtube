import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { GlobalRequestHandler } from "../../lib/util/request";
import { IAuthenticatedUser } from "../../lib/user/accounts";

export interface IKeyIDItem {
	id: string;
}

export type DataMutation<T> = {
	dataID: string;
	timestamp: number;
	position: number;
	data: T;
}

type SignedIn = { user: IAuthenticatedUser, isSignedIn: true };
type NotSignedIn = { user: undefined, isSignedIn: false };

export function useAccountInfo(): SignedIn | NotSignedIn {
	const currentUser = useSelector((x: RootState) => x.auth.currentUser);
	const isSignedIn = currentUser != undefined;
	
	if (isSignedIn) {
		return { user: currentUser, isSignedIn: isSignedIn };
	}
	
	return { user: undefined, isSignedIn: false };
}
