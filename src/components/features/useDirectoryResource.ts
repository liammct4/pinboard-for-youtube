import { useEffect, useState } from "react";
import { directoriesEndpoint } from "../../lib/api/pinboardApi";
import { HttpStatusCode } from "../../lib/util/http";
import { HttpResponse } from "../../lib/util/request";
import { directoryPathConcat, getParentPathFromPath, getRootDirectoryPathFromSubDirectory, getSectionRaw, IDirectoryNode, NodeType, VideoBrowserNode } from "../video/navigation/directory";
import { useLocalStorage } from "./storage/useLocalStorage";
import { DataMutation, useAccountInfo } from "./useAccountInfo";
import { useServerResourceRequest } from "./useServerResourceRequest";

export type DirectoryAction = "Create" | "Rename" | "Delete";
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

export function useDirectoryResource() {
	const { isSignedIn } = useAccountInfo();
	const { storage, setStorage } = useLocalStorage();
	const { sendRequest } = useServerResourceRequest(directoriesEndpoint);

	useEffect(() => {
		let mutationQueue = storage.account.mutationQueues.directoryPendingQueue;

		if (mutationQueue.length == 0) {
			return;
		}

		sendRequest("PATCH", JSON.stringify(mutationQueue))
			.then((response) => {
				if (response != undefined) {
					if (response.status == HttpStatusCode.OK) {
						storage.account.mutationQueues.directoryPendingQueue = [];
						setStorage(storage);
						return;
					}
		
					// TODO: Add proper error handling.
					console.error(`Could not perform the action. ${response.status}: ${response.body}`);
				}

				storage.account.mutationQueues.directoryPendingQueue = mutationQueue;
				setStorage(storage);
			});
	}, [storage.account.mutationQueues.directoryPendingQueue]);

	const updateMutationQueue = (mutation: DataMutation<IDirectoryModificationAction>) => {
		if (!isSignedIn) {
			return;
		}

		storage.account.mutationQueues.directoryPendingQueue.push(mutation);
		setStorage(storage);
	}

	const createAction = (node: VideoBrowserNode) => {
		let mutation: DataMutation<IDirectoryModificationAction> = {
			dataID: node.nodeID,
			position: node.parent?.subNodes.indexOf(node) as number,
			timestamp: Date.now(),
			data: {
				path: getParentPathFromPath(getRootDirectoryPathFromSubDirectory(node)),
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
				path: getRootDirectoryPathFromSubDirectory(node),
				action: "Delete",
				type: convertNodeType(node.type)
			}
		}

		updateMutationQueue(mutation);
	}

	const renameAction = (renamedNode: IDirectoryNode, oldName: string) => {
		let parentPath = getParentPathFromPath(getRootDirectoryPathFromSubDirectory(renamedNode));
		
		let mutation: DataMutation<IDirectoryModificationAction> = {
			dataID: renamedNode.nodeID,
			position: renamedNode.parent?.subNodes.indexOf(renamedNode) as number,
			timestamp: Date.now(),
			data: {
				path: directoryPathConcat(parentPath, oldName),
				data: getSectionRaw(renamedNode),
				action: "Rename",
				type: "Directory"
			}
		}

		updateMutationQueue(mutation);
	}

	return { createAction, deleteAction, renameAction }
}
