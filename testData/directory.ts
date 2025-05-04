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
	subNodes: [Tutorials2_Other_Random.nodeID, Tutorials2_Other_Video2.nodeID]
};

// $ > Alphabetical
export const Alphabetical_BTop: IDirectoryNode = {
	nodeID: createNode(),
	slice: "BTop",
	subNodes: []
}

export const Alphabetical_JMiddle: IDirectoryNode = {
	nodeID: createNode(),
	slice: "JMiddle",
	subNodes: []
}

export const Alphabetical_YBottom: IDirectoryNode = {
	nodeID: createNode(),
	slice: "YBottom",
	subNodes: []
}

// $
export const Tutorials2: IDirectoryNode = {
	nodeID: createNode(),
	slice: "Tutorials 2",
	subNodes: [Tutorials2_Other.nodeID]
};

export const Alphabetical: IDirectoryNode = {
	nodeID: createNode(),
	slice: "Alphabetical",
	subNodes: [Alphabetical_BTop.nodeID, Alphabetical_JMiddle.nodeID, Alphabetical_YBottom.nodeID]
}

export const Video1: IVideoNode = {
	nodeID: createNode(),
	videoID: "LXb3EKWsInQ"
};

// Root.
export const rootNode: IDirectoryNode = {
	nodeID: createNode(),
	slice: "$",
	subNodes: [Alphabetical.nodeID, Tutorials2.nodeID, Video1.nodeID]
};

export const testDirectory: DirectoryTree = {
	rootNode: rootNode.nodeID,
	directoryNodes: {
		[rootNode.nodeID]: rootNode,
		[Tutorials2.nodeID]: Tutorials2,
		[Tutorials2_Other.nodeID]: Tutorials2_Other,
		[Tutorials2_Other_Random.nodeID]: Tutorials2_Other_Random,
		[Alphabetical.nodeID]: Alphabetical,
		[Alphabetical_BTop.nodeID]: Alphabetical_BTop,
		[Alphabetical_JMiddle.nodeID]: Alphabetical_JMiddle,
		[Alphabetical_YBottom.nodeID]: Alphabetical_YBottom
	},
	videoNodes: {
		[Video1.nodeID]: Video1,
		[Tutorials2_Other_Video2.nodeID]: Tutorials2_Other_Video2
	}
}
