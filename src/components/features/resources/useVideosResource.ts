import { videosEndpoint } from "../../../lib/api/pinboardApi";
import { IAuthenticatedUser } from "../../../lib/user/accounts";
import { sendApiRequestWithAuthorization } from "../../../lib/user/resource";
import { fetchVideosFromAPI } from "../../../lib/user/resources/videos";
import { IVideo } from "../../../lib/video/video";
import { useMutationQueue } from "../mutations/useMutationQueue";
import { useLocalStorage } from "../storage/useLocalStorage";
import { DataMutation, useUserAccount } from "../useUserAccount";

export function useVideosResource(user: IAuthenticatedUser | null) {
	const { storage } = useLocalStorage();
	const { updateMutationQueue } = useMutationQueue(storage.account.mutationQueues.videoPendingQueue);

	const fetchVideos = async () => user != null ? await fetchVideosFromAPI(user.tokens.IdToken) : undefined;

	const updateAccountVideo = (video: IVideo) => {
		let mutation: DataMutation<IVideo> = {
			dataID: video.id,
			timestamp: Date.now(),
			data: video,
			position: -1
		};

		updateMutationQueue(mutation);
	}

	const removeAccountVideo = (id: string) => {
		let mutation: DataMutation<IVideo> = {
			dataID: id,
			position: -1,
			timestamp: Date.now(),
			data: null
		};

		updateMutationQueue(mutation);
	}

	const clearAllVideos = async () => {
		if (user == null) {
			return;
		}

		await sendApiRequestWithAuthorization(user.tokens.IdToken, "DELETE", videosEndpoint);
	};
	
	return {
		fetchVideos,
		updateAccountVideo,
		removeAccountVideo,
		clearAllVideos
	}
}
