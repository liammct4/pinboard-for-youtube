import { DataMutation } from "../../../features/account/accountSlice";
import { IStorage } from "../../storage/storage";

export async function getVideoQueueStorage(): Promise<DataMutation[]> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.account.mutationQueues.videoPendingQueue;
}

export async function setVideoQueueStorage(videoQueue: DataMutation[]): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;
	
	storage.account.mutationQueues.videoPendingQueue = videoQueue;
	
	await chrome.storage.local.set(storage);
}

export async function getTagQueueStorage(): Promise<DataMutation[]> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;

	return storage.account.mutationQueues.tagPendingQueue;
}

export async function setTagQueueStorage(tagQueue: DataMutation[]): Promise<void> {
	let storage: IStorage = await chrome.storage.local.get() as IStorage;
	
	storage.account.mutationQueues.tagPendingQueue = tagQueue;
	
	await chrome.storage.local.set(storage);
}

