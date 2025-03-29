import { fetchVideosFromAPI } from "../../../lib/user/resources/videos";
import { useUserAccount } from "../useUserAccount";

export function useVideosResource() {
	const { isSignedIn, user } = useUserAccount();

	const fetchVideos = async () => isSignedIn ? await fetchVideosFromAPI(user.tokens.IdToken) : undefined;
	
	return {
		fetchVideos
	}
}
