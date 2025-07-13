import { useEffect } from "react";
import { To, useNavigate } from "react-router-dom";
import { IWrapperProperties } from "../wrapper";
import { accessStorage } from "../../../lib/storage/storage";

export function PersistentStateWrapper({ children }: IWrapperProperties) {
	const navigate = useNavigate();

	// When the extension initializes, the first thing to check if theres any persistent state and redirect.
	// There also needs to be a check to retrieve the videos from account storage.
	useEffect(() => {
		// Persistent state.
		const checkPersistentState = async () => {
			let storage = await accessStorage();
			let path: string | undefined = storage.persistentState.path;

			if (path != undefined) {
				navigate(path as To)
			}
		}

		checkPersistentState();
	}, []);

	return children;
}
