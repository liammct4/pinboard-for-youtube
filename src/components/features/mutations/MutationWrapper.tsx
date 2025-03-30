import { useEffect, useRef, useState } from "react";
import { IWrapperProperties } from "../wrapper";
import { useServerResourceRequest } from "../resources/useServerResourceRequest";
import { directoriesEndpoint, themesEndpoint, videosEndpoint } from "../../../lib/api/pinboardApi";
import { useLocalStorage } from "../storage/useLocalStorage";
import { HttpStatusCode } from "../../../lib/util/http";
import { DataMutation } from "../useUserAccount";
import { HttpResponse, Method } from "../../../lib/util/request";

export function MutationWrapper({ children }: IWrapperProperties) {
	const { storage, setStorage } = useLocalStorage();
	const { sendRequest: sendDirectoryRequest } = useServerResourceRequest(directoriesEndpoint);
	const { sendRequest: sendVideosRequest } = useServerResourceRequest(videosEndpoint);
	const { sendRequest: sendThemesRequest } = useServerResourceRequest(themesEndpoint);
	const lastRequest = useRef<string>("");

	async function syncMutations<T>(
			mutationQueue: DataMutation<T>[],
			setMutationQueue: (queue: DataMutation<T>[]) => void,
			sendRequest: (method: Method, body?: string | undefined) => Promise<HttpResponse | undefined>
		) {
		if (mutationQueue.length == 0) {
			return;
		}

		let request = JSON.stringify(mutationQueue);

		if (request == lastRequest.current) {
			return;
		}

		lastRequest.current = request;

		let response = await sendRequest("PATCH", request);

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
	};

	useEffect(() => {
		syncMutations(
			storage.account.mutationQueues.directoryPendingQueue,
			(queue) => storage.account.mutationQueues.directoryPendingQueue = queue,
			sendDirectoryRequest
		);
	}, [JSON.stringify(storage.account.mutationQueues.directoryPendingQueue)]);

	useEffect(() => {
		syncMutations(
			storage.account.mutationQueues.videoPendingQueue,
			(queue) => storage.account.mutationQueues.videoPendingQueue = queue,
			sendVideosRequest
		);
	}, [JSON.stringify(storage.account.mutationQueues.videoPendingQueue)]);

	useEffect(() => {
		syncMutations(
			storage.account.mutationQueues.themePendingQueue,
			(queue) => storage.account.mutationQueues.themePendingQueue = queue,
			sendThemesRequest
		);
	}, [JSON.stringify(storage.account.mutationQueues.themePendingQueue)]);
	
	return children;
}
