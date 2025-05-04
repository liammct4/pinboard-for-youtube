import { createNode, DirectoryTree, IDirectoryNode, IVideoNode } from "../src/lib/directory/directory";

// $ > Tutorials 2 > Other
export const Tutorials2_Other_Random: IDirectoryNode = {
	nodeID: createNode(),
	slice: "Random",
	subNodes: []
}

export const Tutorials2_Other_Video2: IVideoNode = {
	nodeID: createNode(),
	videoID: "AKeUssuu3Is"
};

// $ > Tutorials 2
export const Tutorials2_Other: IDirectoryNode = {
	nodeID: createNode(),
	slice: "Other",
	subNodes: [Tutorials2_Other_Video2.nodeID, Tutorials2_Other_Random.nodeID]
};

// $
export const Tutorials2: IDirectoryNode = {
	nodeID: createNode(),
	slice: "Tutorials 2",
	subNodes: [Tutorials2_Other.nodeID]
};

export const Video1: IVideoNode = {
	nodeID: createNode(),
	videoID: "LXb3EKWsInQ"
};

// Root.
export const rootNode: IDirectoryNode = {
	nodeID: createNode(),
	slice: "$",
	subNodes: [Tutorials2.nodeID, Video1.nodeID]
};

export const testDirectory: DirectoryTree = {
	rootNode: rootNode.nodeID,
	directoryNodes: {
		[rootNode.nodeID]: rootNode,
		[Tutorials2.nodeID]: Tutorials2,
		[Tutorials2_Other.nodeID]: Tutorials2_Other,
		[Tutorials2_Other_Random.nodeID]: Tutorials2_Other_Random
	},
	videoNodes: {
		[Video1.nodeID]: Video1,
		[Tutorials2_Other_Video2.nodeID]: Tutorials2_Other_Video2
	}
}
