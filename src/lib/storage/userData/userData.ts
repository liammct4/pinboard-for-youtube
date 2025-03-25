import { IDirectoryNode, IVideoNode, VideoBrowserNode } from "../../../components/video/navigation/directory";
import { ITagDefinition, IVideo } from "../../video/video"
import { IStorage } from "../storage"

export async function getVideoDictionary(): Promise<Map<string, IVideo>> {
	let storage = await chrome.storage.local.get() as IStorage;
	let map = new Map<string, IVideo>();

	storage.user_data.videos.forEach(x => map.set(x.id, x));

	return map;
}

export async function saveVideoDictionaryToStorage(map: Map<string, IVideo>): Promise<void> {
	let storage = await chrome.storage.local.get() as IStorage;
	let videos: IVideo[] = [];

	for (const key of map.keys()) {
		videos.push(map.get(key)!);
	}

	storage.user_data.videos = videos;

	await chrome.storage.local.set(storage);
}

function addParentPass(root: IDirectoryNode) {
	for (let node of (root as IDirectoryNode).subNodes) {
		node.parent = root;

		if (node.type == "DIRECTORY") {
			addParentPass(node as IDirectoryNode);
		}
	}
}

export async function getDirectoryRootFromStorage(): Promise<IDirectoryNode> {
	let storage = await chrome.storage.local.get() as IStorage;

	addParentPass(storage.user_data.directoryRoot);
	
	return storage.user_data.directoryRoot;
}

function removeParentPass(root: IDirectoryNode): IDirectoryNode {
	let newRoot: IDirectoryNode = {
		nodeID: root.nodeID,
		slice: root.slice,
		parent: null,
		subNodes: [],
		type: "DIRECTORY"
	}

	for (let node of root.subNodes) {
		let newNode: VideoBrowserNode;

		if (node.type == "DIRECTORY") {
			newNode = removeParentPass(node);
		}
		else {
			let newVideoNode: IVideoNode = {
				nodeID: node.nodeID,
				parent: null,
				type: "VIDEO",
				videoID: node.videoID
			};

			newNode = newVideoNode;
		}

		newRoot.subNodes.push(newNode);
	}

	return newRoot;
}

export async function saveDirectoryToStorage(root: IDirectoryNode) {
	let storage = await chrome.storage.local.get() as IStorage;

	let newRoot = removeParentPass(root);

	storage.user_data.directoryRoot = newRoot;

	await chrome.storage.local.set(storage);
}

export async function setStoredVideos(videos: Map<string, IVideo>) {
	let storage = await chrome.storage.local.get() as IStorage;

	let videoList: IVideo[] = [];

	for (let video of videos.values()) {
		videoList.push(video);
	}

	storage.user_data.videos = videoList;

	await chrome.storage.local.set(storage);
}
