/**
 * @jest-environment jsdom
*/

import { randomUUID } from "node:crypto";

Object.defineProperty(globalThis, "crypto", {
	value: {
		randomUUID: randomUUID
	}
})

import reducer, { IDirectorySlice, directorySlice } from "./directorySlice";
import { testDirectory, Tutorials2_Other, Tutorials2_Other_Video2, Video1 } from "../../../testData/directory";
import { parsePath } from "../../lib/directory/path";
import { getNodeFromPath, NodeRef, stringifyNode, stringifyTree } from "../../lib/directory/directory";

// Jest, not showing diffs doesnt work.
function expectTree(expected: string, received: string) {
	if (expected != received) {
		console.log(`Expected:\n${expected}\n\nReceived:\n${received}`);
		expect(true).toBe(false);
	}
}

describe("Redux store: 'directory' slice actions.", () => {
	describe("moveNode()", () => {
		test("Moves a directory node from one folder to another (same level).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = reducer(state, directorySlice.actions.moveNode({
				targetNode: "$ > Alphabetical > BTop",
				newDirectory: "$ > Tutorials 2",
				videoData: []
			}));

			let originalPath = parsePath("$ > Alphabetical > BTop");
			let originalItem = getNodeFromPath(state.videoBrowser, originalPath);
			
			expect(originalItem).toBeNull();
			
			let path = parsePath("$ > Tutorials 2 > BTop");
			let item = getNodeFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.directoryNodes[item!].slice).toBe("BTop");
		});
		test("Moves a video node from one folder to another (different levels).", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = reducer(state, directorySlice.actions.moveNode({
				targetNode: "$ > Tutorials 2 > Other:AKeUssuu3Is",
				newDirectory: "$",
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

			let originalPath = parsePath("$ > Tutorials 2 > Other:AKeUssuu3Is");
			let originalItem = getNodeFromPath(state.videoBrowser, originalPath);
			
			expect(originalItem).toBeNull();
			
			let path = parsePath("$:AKeUssuu3Is");
			let item = getNodeFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.videoNodes[item!].videoID).toBe("AKeUssuu3Is");

			console.log(stringifyTree(state.videoBrowser, true));
		});
	});
	describe("createDirectoryNode()", () => {
		test("Adding a root level directory node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = reducer(state, directorySlice.actions.createDirectoryNode({
				path: "$",
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

			state = reducer(state, directorySlice.actions.createDirectoryNode({
				path: "$ > Tutorials 2 > Other",
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

			state = reducer(state, directorySlice.actions.createDirectoryNode({
				path: "$ > Alphabetical",
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

			state = reducer(state, directorySlice.actions.createDirectoryNode({
				path: "$ > Alphabetical",
				slice: "ZEnd"
			}));

			let path = parsePath("$ > Alphabetical");
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

			state = reducer(state, directorySlice.actions.createDirectoryNode({
				path: "$ > Alphabetical",
				slice: "FMid"
			}));

			let path = parsePath("$ > Alphabetical");
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

			state = reducer(state, directorySlice.actions.createVideoNode({
				path: "$ > Alphabetical",
				videoID: "PnvkrBXmLSI",
				videoData: [
					// @ts-ignore
					{
						video_id: "PnvkrBXmLSI",
						title: "A Hours Amazing Aerial Views of the Earth 4K / Relaxation Time"
					}
				],
			}))

			state = reducer(state, directorySlice.actions.createDirectoryNode({
				path: "$ > Alphabetical",
				slice: "ZEnd"
			}));

			let path = parsePath("$ > Alphabetical");
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

			state = reducer(state, directorySlice.actions.createVideoNode({
				path: "$ > Alphabetical > BTop",
				videoID: "PnvkrBXmLSI",
				videoData: [
					// @ts-ignore
					{
						video_id: "PnvkrBXmLSI",
						title: "A Hours Amazing Aerial Views of the Earth 4K / Relaxation Time"
					}
				],
			}))

			state = reducer(state, directorySlice.actions.createVideoNode({
				path: "$ > Alphabetical > BTop",
				videoID: "ERYG3NE1DO8",
				videoData: [
					// @ts-ignore
					{
						video_id: "ERYG3NE1DO8",
						title: "4K 2K 1080p 720p 480p video resolution test"
					}
				],
			}))

			state = reducer(state, directorySlice.actions.createDirectoryNode({
				path: "$ > Alphabetical > BTop",
				slice: "Test Stuff"
			}));

			let path = parsePath("$ > Alphabetical > BTop");
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
	
			state = reducer(state, directorySlice.actions.createVideoNode({
				path: "$",
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
	
			state = reducer(state, directorySlice.actions.createVideoNode({
				path: "$ > Tutorials 2 > Other",
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

			state = reducer(state, directorySlice.actions.removeVideoNodes([Video1.videoID]));

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

			state = reducer(state, directorySlice.actions.removeVideoNodes([Tutorials2_Other_Video2.videoID]));

			let removedNode = getNodeFromPath(state.videoBrowser, path);
			expect(removedNode).toBeNull();
		});
	});
});
