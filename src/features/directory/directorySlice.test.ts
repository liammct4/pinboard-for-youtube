/**
 * @jest-environment jsdom
*/

import { randomUUID } from "node:crypto";

Object.defineProperty(globalThis, "crypto", {
	value: {
		randomUUID: randomUUID
	}
})

import { testDirectory, Tutorials2_Other, Tutorials2_Other_Video2, Video1 } from "../../../testData/directory";
import { parsePath } from "../../lib/directory/path";
import { getNodeFromPath, getNodeType, NodeRef, stringifyNode, stringifyTree, traverseTreeDF } from "../../lib/directory/directory";
import { directorySlice, IDirectorySlice } from "./directorySlice";

// Jest, not showing diffs doesnt work.
function expectTree(expected: string, received: string) {
	if (expected != received) {
		console.error(`Expected:\n${expected}\n\nReceived:\n${received}`);
		expect(true).toBe(false);
	}
}

describe("Redux store: 'directory' slice actions.", () => {
	describe("removeNodes()", () => {
		test("Removes a root level node", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
			
			state = directorySlice.reducer(state, directorySlice.actions.removeNodes([
				"$ > Alphabetical"	
			]));

			/* Before:
				D:$
					D:Alphabetical
						D:BTop
						D:JMiddle
						D:YBottom
					D:Tutorials 2
						D:Other
							D:Random
							V:AKeUssuu3Is
					V:LXb3EKWsInQ
			*/

			let path = parsePath("$");
			let item = getNodeFromPath(state.videoBrowser, path) as NodeRef;
			let expected = 
`D:$
    D:Tutorials 2
        D:Other
            D:Random
            V:AKeUssuu3Is
    V:LXb3EKWsInQ`

			let tree = stringifyNode(state.videoBrowser, item, false);

			expectTree(expected, tree);
		});
		test("Removes a deeply nested node", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let path = parsePath("$ > Tutorials 2 > Other");
			let item = getNodeFromPath(state.videoBrowser, path);

			expect(item).not.toBeNull();

			state = directorySlice.reducer(state, directorySlice.actions.removeNodes([
				"$ > Tutorials 2 > Other"	
			]));

			item = getNodeFromPath(state.videoBrowser, path);

			expect(item).toBeNull();
		});
		test("Removes multiple nodes", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let path1 = parsePath("$ > Tutorials 2 > Other");
			let path2 = parsePath("$ > Alphabetical");

			let item1 = getNodeFromPath(state.videoBrowser, path1);
			let item2 = getNodeFromPath(state.videoBrowser, path2);

			expect(item1).not.toBeNull();
			expect(item2).not.toBeNull();

			state = directorySlice.reducer(state, directorySlice.actions.removeNodes([
				"$ > Tutorials 2",
				"$ > Alphabetical"
			]));

			item1 = getNodeFromPath(state.videoBrowser, path1);
			item2 = getNodeFromPath(state.videoBrowser, path2)

			expect(item1).toBeNull();
			expect(item2).toBeNull();
		});
		test("Removes the sub nodes of a specified parent node to delete from the tree (Disconnected nodes).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let targetPath = parsePath("$ > Tutorials 2");
			let subNodePath = parsePath("$ > Tutorials 2 > Other");

			let subNodeID = getNodeFromPath(state.videoBrowser, subNodePath) as NodeRef;

			expect(getNodeFromPath(state.videoBrowser, targetPath)).not.toBeNull();
			expect(subNodeID).not.toBeNull();
			expect(state.videoBrowser.directoryNodes[subNodeID]).not.toBeUndefined();

			state = directorySlice.reducer(state, directorySlice.actions.removeNodes([
				"$ > Tutorials 2",
			]));

			expect(getNodeFromPath(state.videoBrowser, targetPath)).toBeNull();
			expect(getNodeFromPath(state.videoBrowser, subNodePath)).toBeNull();
			expect(state.videoBrowser.directoryNodes[subNodeID]).toBeUndefined();
		});
	});
	describe("moveNode()", () => {
		test("Moves a directory node from one folder to another (same level).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let originalPath = parsePath("$ > Alphabetical > BTop");
			let targetPath = parsePath("$ > Tutorials 2 > BTop");
	
			state = directorySlice.reducer(state, directorySlice.actions.moveNode({
				targetPath: originalPath,
				destinationPath: parsePath("$ > Tutorials 2"),
				videoData: []
			}));

			let originalItem = getNodeFromPath(state.videoBrowser, originalPath);
			
			expect(originalItem).toBeNull();
			
			let item = getNodeFromPath(state.videoBrowser, targetPath);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.directoryNodes[item!].slice).toBe("BTop");
		});
		test("Moves a video node from one folder to another (different levels).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let originalPath = parsePath("$ > Tutorials 2 > Other:AKeUssuu3Is");
	
			state = directorySlice.reducer(state, directorySlice.actions.moveNode({
				targetPath: originalPath,
				destinationPath: parsePath("$"),
				videoData: [
					// @ts-ignore
					{
						video_id: "AKeUssuu3Is",
						title: "A"
					},
					// @ts-ignore
					{
						video_id: "LXb3EKWsInQ",
						title: "B"
					}
				]
			}));

			let originalItem = getNodeFromPath(state.videoBrowser, originalPath);
			
			expect(originalItem).toBeNull();
			
			let path = parsePath("$:AKeUssuu3Is");
			let item = getNodeFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.videoNodes[item!].videoID).toBe("AKeUssuu3Is");
		});
	});
	describe("createDirectoryNode()", () => {
		test("Adding a root level directory node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = directorySlice.reducer(state, directorySlice.actions.createDirectoryNode({
				parentPath: parsePath("$"),
				slice: "Test A"
			}));

			let path = parsePath("$ > Test A");
			let item = getNodeFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.directoryNodes[item!].slice).toBe("Test A");
		});
		test("Adding a deeply nested directory node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			state = directorySlice.reducer(state, directorySlice.actions.createDirectoryNode({
				parentPath: parsePath("$ > Tutorials 2 > Other"),
				slice: "Test A"
			}));

			let path = parsePath("$ > Tutorials 2 > Other > Test A");
			let item = getNodeFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.directoryNodes[item!].slice).toBe("Test A");
		});
		test("Adding a directory node in alphabetical order (Start).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			state = directorySlice.reducer(state, directorySlice.actions.createDirectoryNode({
				parentPath: parsePath("$ > Alphabetical"),
				slice: "ATop"
			}));

			let path = parsePath("$ > Alphabetical");
			let item = getNodeFromPath(state.videoBrowser, path) as NodeRef;
			let expected = 
`D:Alphabetical
    D:ATop
    D:BTop
    D:JMiddle
    D:YBottom`

			let tree = stringifyNode(state.videoBrowser, item, false);

			expectTree(expected, tree);
		});
		test("Adding a directory node in alphabetical order (End).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let path = parsePath("$ > Alphabetical");

			state = directorySlice.reducer(state, directorySlice.actions.createDirectoryNode({
				parentPath: path,
				slice: "ZEnd"
			}));

			let item = getNodeFromPath(state.videoBrowser, path) as NodeRef;
			let expected = 
`D:Alphabetical
    D:BTop
    D:JMiddle
    D:YBottom
    D:ZEnd`

			let tree = stringifyNode(state.videoBrowser, item, false);

			expectTree(expected, tree);
		});
		test("Adding a directory node in alphabetical order (Middle).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let path = parsePath("$ > Alphabetical");

			state = directorySlice.reducer(state, directorySlice.actions.createDirectoryNode({
				parentPath: path,
				slice: "FMid"
			}));

			let item = getNodeFromPath(state.videoBrowser, path) as NodeRef;
			let expected = 
`D:Alphabetical
    D:BTop
    D:FMid
    D:JMiddle
    D:YBottom`

			let tree = stringifyNode(state.videoBrowser, item, false);

			expectTree(expected, tree);
		});
		test("Adding a directory node in alphabetical order with a video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let path = parsePath("$ > Alphabetical");

			state = directorySlice.reducer(state, directorySlice.actions.createVideoNode({
				path: path,
				videoID: "PnvkrBXmLSI",
				videoData: [
					// @ts-ignore
					{
						video_id: "PnvkrBXmLSI",
						title: "A Hours Amazing Aerial Views of the Earth 4K / Relaxation Time"
					}
				],
			}))

			state = directorySlice.reducer(state, directorySlice.actions.createDirectoryNode({
				parentPath: path,
				slice: "ZEnd"
			}));

			let item = getNodeFromPath(state.videoBrowser, path) as NodeRef;
			let expected = 
`D:Alphabetical
    D:BTop
    D:JMiddle
    D:YBottom
    D:ZEnd
    V:PnvkrBXmLSI`

			let tree = stringifyNode(state.videoBrowser, item, false);

			expectTree(expected, tree);
		});
		test("Adding a directory node with no other directory nodes with video nodes.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}

			let path = parsePath("$ > Alphabetical > BTop");

			state = directorySlice.reducer(state, directorySlice.actions.createVideoNode({
				path,
				videoID: "PnvkrBXmLSI",
				videoData: [
					// @ts-ignore
					{
						video_id: "PnvkrBXmLSI",
						title: "A Hours Amazing Aerial Views of the Earth 4K / Relaxation Time"
					}
				],
			}))

			state = directorySlice.reducer(state, directorySlice.actions.createVideoNode({
				path,
				videoID: "ERYG3NE1DO8",
				videoData: [
					// @ts-ignore
					{
						video_id: "ERYG3NE1DO8",
						title: "4K 2K 1080p 720p 480p video resolution test"
					}
				],
			}))

			state = directorySlice.reducer(state, directorySlice.actions.createDirectoryNode({
				parentPath: path,
				slice: "Test Stuff"
			}));

			let item = getNodeFromPath(state.videoBrowser, path) as NodeRef;
			let expected = 
`D:BTop
    D:Test Stuff
    V:ERYG3NE1DO8
    V:PnvkrBXmLSI`

			let tree = stringifyNode(state.videoBrowser, item, false);

			expectTree(expected, tree);
		});
	});
	describe("createVideoNode()", () => {
		test("Adding a root level video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = directorySlice.reducer(state, directorySlice.actions.createVideoNode({
				path: parsePath("$"),
				videoID: "ZjVAsJOl8SM",
				videoData: [
					// @ts-ignore
					{
						video_id: "ZjVAsJOl8SM",
						title: "COSTA RICA IN 4K 60fps HDR (ULTRA HD)"
					}
				]
			}));

			let path = parsePath("$:ZjVAsJOl8SM");
			let item = getNodeFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.videoNodes[item!].videoID).toBe("ZjVAsJOl8SM");
		});
		test("Adding a nested video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = directorySlice.reducer(state, directorySlice.actions.createVideoNode({
				path: parsePath("$ > Tutorials 2 > Other"),
				videoID: "ZjVAsJOl8SM",
				videoData: [
					// @ts-ignore
					{
						video_id: "ZjVAsJOl8SM",
						title: "COSTA RICA IN 4K 60fps HDR (ULTRA HD)"
					}
				]
			}));

			let path = parsePath("$ > Tutorials 2 > Other:ZjVAsJOl8SM");
			let item = getNodeFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.videoNodes[item!].videoID).toBe("ZjVAsJOl8SM");
		});
	});
	describe("removeVideoNodes()", () => {
		it("Removes a top level video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			};

			let pathString = "$:LXb3EKWsInQ";
			let path = parsePath(pathString);
			
			let node = getNodeFromPath(state.videoBrowser, path);
			expect(node).not.toBeNull();

			state = directorySlice.reducer(state, directorySlice.actions.removeVideoNodesByID([Video1.videoID]));

			let removedNode = getNodeFromPath(state.videoBrowser, path);
			expect(removedNode).toBeNull();
		});
		it("Removes a deeply nested video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			};

			let pathString = "$ > Tutorials 2 > Other:AKeUssuu3Is";
			let path = parsePath(pathString);
			
			let node = getNodeFromPath(state.videoBrowser, path);
			expect(node).not.toBeNull();

			state = directorySlice.reducer(state, directorySlice.actions.removeVideoNodesByID([Tutorials2_Other_Video2.videoID]));

			let removedNode = getNodeFromPath(state.videoBrowser, path);
			expect(removedNode).toBeNull();
		});
	});
});
