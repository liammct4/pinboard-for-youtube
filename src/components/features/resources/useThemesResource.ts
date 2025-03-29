import { fetchCustomThemesFromAPI } from "../../../lib/user/resources/themes";
import { useUserAccount } from "../useUserAccount";

export function useThemesResource() {
	const { user, isSignedIn } = useUserAccount();
	const fetchCustomThemes = async () => isSignedIn ? fetchCustomThemesFromAPI(user.tokens.IdToken) : undefined;

	return {
		fetchCustomThemes
	}
}
