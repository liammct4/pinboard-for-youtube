import { useDispatch } from "react-redux";
import { videosEndpoint } from "../../../lib/api/pinboardApi";
import { sendApiRequestWithAuthorization } from "../../../lib/user/resource";
import { fetchVideosFromAPI } from "../../../lib/user/resources/videos";
import { IVideo } from "../../../lib/video/video";
import { DataMutation, useUserAccount } from "../useUserAccount";
import { mutationActions } from "../../../features/mutation/mutationSlice";

export function useVideosResource() {
	const { user, isSignedIn } = useUserAccount();
	const dispatch = useDispatch();

	const fetchVideos = async () => isSignedIn ? await fetchVideosFromAPI(user.tokens.IdToken) : undefined;

	const updateAccountVideo = (video: IVideo) => {
		let mutation: DataMutation<IVideo> = {
			dataID: video.id,
			timestamp: Date.now(),
			data: video,
			position: -1
		};

		dispatch(mutationActions.appendRequestToVideos(mutation));
	}

	const removeAccountVideo = (id: string) => {
		let mutation: DataMutation<IVideo> = {
			dataID: id,
			position: -1,
			timestamp: Date.now(),
			data: null
		};

		dispatch(mutationActions.appendRequestToVideos(mutation));
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
