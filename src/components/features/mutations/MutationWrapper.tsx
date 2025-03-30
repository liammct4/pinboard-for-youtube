import { useEffect } from "react";
import { IWrapperProperties } from "../wrapper";
import { useServerResourceRequest } from "../resources/useServerResourceRequest";
import { directoriesEndpoint } from "../../../lib/api/pinboardApi";
import { useLocalStorage } from "../storage/useLocalStorage";
import { HttpStatusCode } from "../../../lib/util/http";
import { DataMutation } from "../useUserAccount";

export function MutationWrapper({ children }: IWrapperProperties) {
	const { storage, setStorage } = useLocalStorage();
	const { sendRequest } = useServerResourceRequest(directoriesEndpoint);

	function syncMutations<T>(mutationQueue: DataMutation<T>[], setMutationQueue: (queue: DataMutation<T>[]) => void) {
		if (mutationQueue.length == 0) {
			return;
		}

		let request = JSON.stringify(mutationQueue);

		sendRequest("PATCH", request)
			.then((response) => {
				if (response != undefined) {
					if (response.status == HttpStatusCode.OK) {
						setMutationQueue([]);
						setStorage(storage);
						return;
					}

					// TODO: Add proper error handling.
					console.error(`Could not perform the action. ${response.status}: ${response.body}`);
				}

				setMutationQueue(mutationQueue);
				setStorage(storage);
			});
	};

	useEffect(() => {
		// Directory.
		syncMutations(
			storage.account.mutationQueues.directoryPendingQueue,
			(queue) => storage.account.mutationQueues.directoryPendingQueue = queue
		);

		// Videos.
		syncMutations(
			storage.account.mutationQueues.videoPendingQueue,
			(queue) => storage.account.mutationQueues.videoPendingQueue = queue
		);

		// Custom themes.
		syncMutations(
			storage.account.mutationQueues.themePendingQueue,
			(queue) => storage.account.mutationQueues.themePendingQueue = queue
		);
	}, [storage.account.mutationQueues]);
	
	return children;
}
