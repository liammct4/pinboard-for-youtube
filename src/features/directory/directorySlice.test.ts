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
import { testDirectory } from "../../../testData/directory";
import { parseStringToPath } from "../../lib/directory/path";
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

			let path = parseStringToPath("$:ZjVAsJOl8SM");
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

			let path = parseStringToPath("$ > Tutorials 2 > Other:ZjVAsJOl8SM");
			let item = getItemFromPath(state.videoBrowser, path);
			
			expect(item).not.toBeNull();
			expect(state.videoBrowser.videoNodes[item!].videoID).toBe("ZjVAsJOl8SM");
		});
	});
});
