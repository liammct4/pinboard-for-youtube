import { useLocalStorage } from "../storage/useLocalStorage";
import { DataMutation, useUserAccount } from "../useUserAccount";

export function useMutationQueue<T>(queue: DataMutation<T>[]) {
	const { isSignedIn } = useUserAccount();
	const { storage, setStorage } = useLocalStorage();

	const updateMutationQueue = (mutation: DataMutation<T>) => {
		if (!isSignedIn) {
			return;
		}

		queue.push(mutation);
		setStorage(storage);
	}

	return { updateMutationQueue };
}
