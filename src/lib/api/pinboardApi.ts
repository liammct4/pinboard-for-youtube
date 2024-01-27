const apiUrlBase = "https://s2kp0hps4g.execute-api.us-east-1.amazonaws.com/prod"
let authenticationResource = apiUrlBase + "/authentication"
let accountsEndpoint = authenticationResource + "/accounts"
let sessionEndpoint = authenticationResource + "/session"

let userDataResource = apiUrlBase + "/userdata"
let videosEndpoint = userDataResource + "/videos"
let tagsEndpoint = userDataResource + "/tags" 

export {
	apiUrlBase,
	authenticationResource,
	accountsEndpoint,
	sessionEndpoint,
	userDataResource,
	videosEndpoint,
	tagsEndpoint
}
