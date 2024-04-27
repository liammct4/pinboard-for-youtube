import { QueuedVideo } from "../../../features/account/accountSlice";
import { videosEndpoint } from "../../api/pinboardApi";
import { HttpStatusCode } from "../../util/http";
import { GlobalRequestHandler, HeaderArray, HttpResponse } from "../../util/request";
import { Video } from "../../video/video";

export async function pushAccountVideos(
		idToken: string,
		mutationQueue: QueuedVideo[],
		videoData: Video[]
	): Promise<HttpResponse | undefined> {
	let headers: HeaderArray = [["Authorization", idToken]];
	let response: HttpResponse | undefined = await GlobalRequestHandler.sendRequest("PATCH", videosEndpoint, {
		videoData: videoData,
		mutations: mutationQueue
	}, headers);
	
	if (response == undefined || response.status == HttpStatusCode.UNAUTHORIZED) {
		return undefined;
	}
	
	return response;
}
