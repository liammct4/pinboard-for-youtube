export const apiUrlBase = "https://s2kp0hps4g.execute-api.us-east-1.amazonaws.com/prod"
export let authenticationResource = apiUrlBase + "/authentication"
export let accountsEndpoint = authenticationResource + "/accounts"
export let sessionEndpoint = authenticationResource + "/session" 

export let userDataResource = apiUrlBase + "/userdata"
export let videosEndpoint = userDataResource + "/videos"
export let directoriesEndpoint = userDataResource + "/directory"
export let themesEndpoint = userDataResource + "/themes"
