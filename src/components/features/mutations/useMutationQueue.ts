import { useLocalStorage } from "../storage/useLocalStorage";
import { DataMutation } from "../useUserAccount";

export function useMutationQueue<T>(queue: DataMutation<T>[]) {
	const { storage, setStorage } = useLocalStorage();

	const updateMutationQueue = (mutation: DataMutation<T>) => {
		if (storage.auth.currentUser == null) {
			return;
		}

		queue.push(mutation);
		setStorage(storage);
	}

	return { updateMutationQueue };
}
