import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IStorage } from "../../lib/storage/storage";
import { DirectoryTree } from "../../components/video/navigation/directory";

export interface IDirectorySlice {
	videoBrowser: DirectoryTree;
}

let rootNodeID = crypto.randomUUID();

const initialState: IDirectorySlice = {
	videoBrowser: {
		rootNode: rootNodeID,
		directoryNodes: {},
		videoNodes: {}
	}
}

initialState.videoBrowser.directoryNodes[rootNodeID] = {
	nodeID: rootNodeID,
	slice: "$",
	subNodes: []
}

export const directorySlice = createSlice({
	name: "directory",
	initialState,
	reducers: {
		updateDirectorySliceFromStorage: (state, action: PayloadAction<IStorage>) => {
			state.videoBrowser = action.payload.userData.directoryRoot;
		},
	}
});

export const {
	updateDirectorySliceFromStorage,
} = directorySlice.actions;
export default directorySlice.reducer;
