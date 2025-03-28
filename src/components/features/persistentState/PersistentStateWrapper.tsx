import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { To, useNavigate } from "react-router-dom";
import { useUserAccount } from "../useUserAccount";
import { useLocalStorage } from "../storage/useLocalStorage";
import { IWrapperProperties } from "../wrapper";

export function PersistentStateWrapper({ children }: IWrapperProperties) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, isSignedIn } = useUserAccount();
	const { storage } = useLocalStorage();

	// When the extension initializes, the first thing to check if theres any persistent state and redirect.
	// There also needs to be a check to retrieve the videos from account storage.
	useEffect(() => {
		// Persistent state.
		const checkPersistentState = async () => {
			let path: string | undefined = storage.persistentState.path;

			if (path != undefined) {
				navigate(path as To)
			}
		}

		checkPersistentState();
	}, []);

	return children;
}
