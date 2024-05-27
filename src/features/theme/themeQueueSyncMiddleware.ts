import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { appendMutationBatchToAccountQueue, appendMutationToAccountQueue } from "../account/accountSlice";
import { userIsLoggedIn } from "../../lib/user/accounts";
import { addCustomTheme, deleteCustomTheme, setCustomThemes } from "./themeSlice";
import { AppTheme } from "../../lib/config/theming/appTheme";

export const themeQueueSyncMiddleware = createListenerMiddleware();

themeQueueSyncMiddleware.startListening({
	matcher: isAnyOf(addCustomTheme, setCustomThemes, deleteCustomTheme),
	effect: async (action, listenerApi) => {
		if (!await userIsLoggedIn()) {
			return;
		}

		let affectedThemes: string | AppTheme | AppTheme[] = action.payload;

		if (Array.isArray(affectedThemes)) {
			listenerApi.dispatch(appendMutationBatchToAccountQueue(
				{
					dataMutationType: "THEME",
					info: affectedThemes.map((item, index) => {
						return {
							mutationDataID: item.id,
							position: index
						}
					})
				}
			));
		}
		else if (typeof affectedThemes == "string") {
			listenerApi.dispatch(appendMutationToAccountQueue({
				dataMutationType: "THEME",
				mutationDataID: affectedThemes,
				position: -1
			}));
		}
		else {
			// Means that just an individual tag was affected.
			listenerApi.dispatch(appendMutationToAccountQueue({
				dataMutationType: "THEME",
				mutationDataID: affectedThemes.id,
				position: -1
			}));
		}
	}
});
