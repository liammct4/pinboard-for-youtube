import { DirectoryTree, getItemFromPath, IDirectoryNode, IVideoNode } from "./directory";

// $ > Tutorials 2 > Other
let Tutorials2_Other_Video2: IVideoNode = {
	nodeID: crypto.randomUUID(),
	videoID: "AKeUssuu3Is"
};

// $ > Tutorials 2
let Tutorials2_Other: IDirectoryNode = {
	nodeID: crypto.randomUUID(),
	slice: "Other",
	subNodes: [Tutorials2_Other_Video2.nodeID]
};

// $
let Tutorials2: IDirectoryNode = {
	nodeID: crypto.randomUUID(),
	slice: "Tutorials 2",
	subNodes: [Tutorials2_Other.nodeID]
};

let Video1: IVideoNode = {
	nodeID: crypto.randomUUID(),
	videoID: "LXb3EKWsInQ"
};

// Root.
let rootNode: IDirectoryNode = {
	nodeID: crypto.randomUUID(),
	slice: "$",
	subNodes: [Tutorials2.nodeID, Video1.nodeID]
};

let testDirectory: DirectoryTree = {
	rootNode: rootNode.nodeID,
	directoryNodes: {
		[rootNode.nodeID]: rootNode,
		[Tutorials2.nodeID]: Tutorials2,
		[Tutorials2_Other.nodeID]: Tutorials2_Other
	},
	videoNodes: {
		[Video1.nodeID]: Video1,
		[Tutorials2_Other_Video2.nodeID]: Tutorials2_Other_Video2
	}
}

describe("Directory helper functions", () => {
	describe("getItemFromPath()", () => {
		it("Retrieves the root directory.", () => {
			let result = getItemFromPath(testDirectory, "$");
			
			expect(result).toEqual(testDirectory.rootNode);
		});
		it("Retrieves a root level directory node.", () => {
			let result = getItemFromPath(testDirectory, "$ > Tutorials 2");
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2.nodeID);
			expect(testDirectory.directoryNodes[result!].slice).toEqual("Tutorials 2");
		});
		it("Retrieves a nested directory node.", () => {
			let result = getItemFromPath(testDirectory, "$ > Tutorials 2 > Other");
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2_Other.nodeID);
			expect(testDirectory.directoryNodes[result!].slice).toEqual("Other");
		});
		it("Retrieves a root level video node.", () => {
			let result = getItemFromPath(testDirectory, "$:LXb3EKWsInQ");
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Video1.nodeID);
			expect(testDirectory.videoNodes[result!].videoID).toEqual("LXb3EKWsInQ");
		});
		it("Retrieves a nested video node.", () => {
			let result = getItemFromPath(testDirectory, "$ > Tutorials 2 > Other:AKeUssuu3Is");

			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2_Other_Video2.nodeID);
			expect(testDirectory.videoNodes[result!].videoID).toEqual("AKeUssuu3Is");
		});
	});
});
