import { videosEndpoint } from "../../api/pinboardApi";
import { HttpStatusCode } from "../../util/http";
import { IVideo } from "../../video/video";
import { sendApiRequestWithAuthorization } from "../resource";

export async function fetchVideosFromAPI(idToken: string) {
	let response = await sendApiRequestWithAuthorization(idToken, "GET", videosEndpoint);

	if (response == undefined) {	
		return undefined;
	}

	if (response.status != HttpStatusCode.OK) {
		console.error(`Fetching videos went wrong. ${response.status} ${response.body}`);
		return undefined;
	}

	let videos = JSON.parse(response.body) as IVideo[];
	
	return new Map<string, IVideo>(videos.map(x => [x.id, x]));
}
