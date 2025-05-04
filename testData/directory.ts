import { DirectoryTree, IDirectoryNode, IVideoNode } from "../src/lib/directory/directory";

// $ > Tutorials 2 > Other
export const Tutorials2_Other_Random: IDirectoryNode = {
	nodeID: crypto.randomUUID(),
	slice: "Random",
	subNodes: []
}

export const Tutorials2_Other_Video2: IVideoNode = {
	nodeID: crypto.randomUUID(),
	videoID: "AKeUssuu3Is"
};

// $ > Tutorials 2
export const Tutorials2_Other: IDirectoryNode = {
	nodeID: crypto.randomUUID(),
	slice: "Other",
	subNodes: [Tutorials2_Other_Video2.nodeID, Tutorials2_Other_Random.nodeID]
};

// $
export const Tutorials2: IDirectoryNode = {
	nodeID: crypto.randomUUID(),
	slice: "Tutorials 2",
	subNodes: [Tutorials2_Other.nodeID]
};

export const Video1: IVideoNode = {
	nodeID: crypto.randomUUID(),
	videoID: "LXb3EKWsInQ"
};

// Root.
export const rootNode: IDirectoryNode = {
	nodeID: crypto.randomUUID(),
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
