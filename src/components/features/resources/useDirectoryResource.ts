import { directoryPathConcat, getParentPathFromPath, getRootDirectoryPathFromSubNode, getSectionRaw, IDirectoryNode, NodeType, VideoBrowserNode } from "../../video/navigation/directory";
import { useLocalStorage } from "../storage/useLocalStorage";
import { DataMutation, useUserAccount } from "../useUserAccount";
import { fetchDirectoryFromAPI } from "../../../lib/user/resources/directory";
import { useMutationQueue } from "../mutations/useMutationQueue";
import { sendApiRequestWithAuthorization } from "../../../lib/user/resource";
import { directoriesEndpoint } from "../../../lib/api/pinboardApi";
import { IAuthenticatedUser } from "../../../lib/user/accounts";

export type DirectoryAction = "Create" | "Rename" | "Delete" | "Move";
export type DirectoryActionType = "Video" | "Directory"; 

export interface IDirectoryModificationAction {
	path: string;
	data?: string | undefined;
	action: DirectoryAction;
	type: DirectoryActionType;
}

function convertNodeType(type: NodeType): DirectoryActionType {
	return type == "DIRECTORY" ? "Directory" : "Video"; 
}

export function useDirectoryResource(user: IAuthenticatedUser | null) {
	const { storage } = useLocalStorage();
	const { updateMutationQueue } = useMutationQueue(storage.account.mutationQueues.directoryPendingQueue);

	const fetchDirectoryRoot = async () => user != null ? await fetchDirectoryFromAPI(user.tokens.IdToken) : undefined;

	const createAction = (node: VideoBrowserNode) => {
		let mutation: DataMutation<IDirectoryModificationAction> = {
			dataID: node.nodeID,
			position: node.parent?.subNodes.indexOf(node) as number,
			timestamp: Date.now(),
			data: {
				path: getParentPathFromPath(getRootDirectoryPathFromSubNode(node)),
				data: getSectionRaw(node),
				action: "Create",
				type: convertNodeType(node.type)
			}
		}

		updateMutationQueue(mutation);
	}

	const deleteAction = async (node: VideoBrowserNode) => {
		let mutation: DataMutation<IDirectoryModificationAction> = {
			dataID: node.nodeID,
			position: 0,
			timestamp: Date.now(),
			data: {
				path: getRootDirectoryPathFromSubNode(node),
				action: "Delete",
				type: convertNodeType(node.type)
			}
		}

		updateMutationQueue(mutation);
	}

	const renameAction = (renamedNode: IDirectoryNode, oldName: string) => {
		let parentPath = getParentPathFromPath(getRootDirectoryPathFromSubNode(renamedNode));
		
		let mutation: DataMutation<IDirectoryModificationAction> = {
			dataID: renamedNode.nodeID,
			position: renamedNode.parent?.subNodes.indexOf(renamedNode) as number,
			timestamp: Date.now(),
			data: {
				path: directoryPathConcat(parentPath, oldName, "DIRECTORY"),
				data: getSectionRaw(renamedNode),
				action: "Rename",
				type: "Directory"
			}
		}

		updateMutationQueue(mutation);
	}

	const moveAction = (node: VideoBrowserNode, oldDirectory: string) => {
		let mutation: DataMutation<IDirectoryModificationAction> = {
			dataID: node.nodeID,
			position: node.parent?.subNodes.indexOf(node) as number,
			timestamp: Date.now(),
			data: {
				path: oldDirectory,
				data: getParentPathFromPath(getRootDirectoryPathFromSubNode(node)),
				action: "Move",
				type: convertNodeType(node.type)
			}
		}

		updateMutationQueue(mutation);
	}

	const clearAllDirectories = async () => {
		if (user == null) {
			return;
		}

		await sendApiRequestWithAuthorization(user.tokens.IdToken, "DELETE", directoriesEndpoint);
	};

	return { fetchDirectoryRoot, createAction, deleteAction, renameAction, moveAction, clearAllDirectories }
}
