import { RootState } from "../../app/store";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addTagDefinition, removeTagDefinition, setTagDefinitions } from "./videoSlice";
import { appendMutationBatchToAccountQueue, appendMutationToAccountQueue } from "../account/accountSlice";
import { TagDefinition } from "../../lib/video/video";
import { userIsLoggedIn } from "../../lib/user/accounts";

const tagQueueSyncMiddleware = createListenerMiddleware();

tagQueueSyncMiddleware.startListening({
	matcher: isAnyOf(addTagDefinition, removeTagDefinition, setTagDefinitions),
	effect: async (action, listenerApi) => {
		if (!await userIsLoggedIn()) {
			return;
		}

		let affectedTags: string | TagDefinition | TagDefinition[] = action.payload;

		if (Array.isArray(affectedTags)) {
			listenerApi.dispatch(appendMutationBatchToAccountQueue(
				{
					dataMutationType: "TAG",
					info: affectedTags.map((item, index) => {
						return {
							mutationDataID: item.id,
							position: index
						}
					})
				}
			));
		}
		else if (typeof affectedTags == "string") {
			listenerApi.dispatch(appendMutationToAccountQueue({
				dataMutationType: "TAG",
				mutationDataID: affectedTags,
				position: -1
			}));
		}
		else {
			// Means that just an individual tag was affected.
			listenerApi.dispatch(appendMutationToAccountQueue({
				dataMutationType: "TAG",
				mutationDataID: affectedTags.id,
				position: -1
			}));
		}
	}
});

export default tagQueueSyncMiddleware;
