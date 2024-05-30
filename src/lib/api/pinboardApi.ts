import { ServerResourceType } from "../../features/account/accountSlice"

export const apiUrlBase = "https://s2kp0hps4g.execute-api.us-east-1.amazonaws.com/prod"
export let authenticationResource = apiUrlBase + "/authentication"
export let accountsEndpoint = authenticationResource + "/accounts"
export let sessionEndpoint = authenticationResource + "/session" 

export let userDataResource = apiUrlBase + "/userdata"
export let videosEndpoint = userDataResource + "/videos"
export let tagsEndpoint = userDataResource + "/tags"
export let themesEndpoint = userDataResource + "/themes"

/**
 * Locates the appropriate endpoint for a provided resource.
 * Will return the entire API link combined with the resource.
 * @param resource The resource to locate.
 * @returns The located resource server link.
 */
export function getResourceEndPoint(resource: ServerResourceType) {
	switch (resource) {
		case "TAG":
			return tagsEndpoint;
		case "VIDEO":
			return videosEndpoint;
		case "THEME":
			return themesEndpoint;
	}
}
