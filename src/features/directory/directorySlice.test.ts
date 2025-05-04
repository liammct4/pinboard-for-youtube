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
import { parsePathFromString } from "../../lib/directory/path";
import { getItemFromPath } from "../../lib/directory/directory";

describe("Redux store: 'directory' slice actions.", () => {
	describe("directoryAddVideo()", () => {
		test("Adding a root level video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = reducer(state, directorySlice.actions.directoryAddVideo({
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

			let path = parsePathFromString("$:ZjVAsJOl8SM");
			let item = getItemFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.videoNodes[item!].videoID).toBe("ZjVAsJOl8SM");
		});
		test("Adding a nested video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			}
	
			state = reducer(state, directorySlice.actions.directoryAddVideo({
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

			let path = parsePathFromString("$ > Tutorials 2 > Other:ZjVAsJOl8SM");
			let item = getItemFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.videoNodes[item!].videoID).toBe("ZjVAsJOl8SM");
		});
	});
	describe("directoryRemoveVideos()", () => {
		it("Removes a top level video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			};

			let pathString = "$:LXb3EKWsInQ";
			let path = parsePathFromString(pathString);
			
			let node = getItemFromPath(state.videoBrowser, path);
			expect(node).not.toBeNull();

			state = reducer(state, directorySlice.actions.directoryRemoveVideos([Video1.videoID]));

			let removedNode = getItemFromPath(state.videoBrowser, path);
			expect(removedNode).toBeNull();
		});
		it("Removes a deeply nested video node.", () => {
			let state: IDirectorySlice = {
				videoBrowser: testDirectory
			};

			let pathString = "$ > Tutorials 2 > Other:AKeUssuu3Is";
			let path = parsePathFromString(pathString);
			
			let node = getItemFromPath(state.videoBrowser, path);
			expect(node).not.toBeNull();

			state = reducer(state, directorySlice.actions.directoryRemoveVideos([Tutorials2_Other_Video2.videoID]));

			let removedNode = getItemFromPath(state.videoBrowser, path);
			expect(removedNode).toBeNull();
		});
	});
});
