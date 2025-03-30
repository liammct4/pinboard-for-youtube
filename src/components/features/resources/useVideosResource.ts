import { videosEndpoint } from "../../../lib/api/pinboardApi";
import { sendApiRequestWithAuthorization } from "../../../lib/user/resource";
import { fetchVideosFromAPI } from "../../../lib/user/resources/videos";
import { IVideo } from "../../../lib/video/video";
import { useMutationQueue } from "../mutations/useMutationQueue";
import { useLocalStorage } from "../storage/useLocalStorage";
import { DataMutation, useUserAccount } from "../useUserAccount";

export function useVideosResource() {
	const { isSignedIn, user } = useUserAccount();
	const { storage } = useLocalStorage();
	const { updateMutationQueue } = useMutationQueue(storage.account.mutationQueues.videoPendingQueue);

	const fetchVideos = async () => isSignedIn ? await fetchVideosFromAPI(user.tokens.IdToken) : undefined;

	const createAccountVideo = (video: IVideo) => {
		let mutation: DataMutation<IVideo> = {
			dataID: video.id,
			timestamp: Date.now(),
			data: video,
			position: -1
		};

		updateMutationQueue(mutation);
	}

	const clearAllVideos = async () => {
		if (!isSignedIn) {
			return;
		}

		await sendApiRequestWithAuthorization(user.tokens.IdToken, "DELETE", videosEndpoint);
	};
	
	return {
		fetchVideos,
		createAccountVideo,
		clearAllVideos
	}
}
