import { themesEndpoint } from "../../api/pinboardApi";
import { IAppTheme } from "../../config/theming/appTheme";
import { HttpStatusCode } from "../../util/http";
import { sendApiRequestWithAuthorization } from "../resource";

export async function fetchCustomThemesFromAPI(token: string) {
	let response = await sendApiRequestWithAuthorization(token, "GET", themesEndpoint);
	
	if (response == undefined) {
		return undefined;
	}

	if (response.status != HttpStatusCode.OK) {
		console.error(`Could not fetch custom themes: ${response.status} ${response.body}`);
		return undefined;
	}

	return JSON.parse(response.body) as IAppTheme[];
}
