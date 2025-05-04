import { testDirectory, Tutorials2, Tutorials2_Other, Tutorials2_Other_Video2, Video1 } from "../../../testData/directory";
import { getItemFromPath } from "./directory";
import { parseStringToPath } from "./path";

describe("Directory helper functions", () => {
	describe("getItemFromPath()", () => {
		it("Retrieves the root directory.", () => {
			let result = getItemFromPath(testDirectory, parseStringToPath("$"));
			
			expect(result).toEqual(testDirectory.rootNode);
		});
		it("Retrieves a root level directory node.", () => {
			let result = getItemFromPath(testDirectory, parseStringToPath("$ > Tutorials 2"));
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2.nodeID);
			expect(testDirectory.directoryNodes[result!].slice).toEqual("Tutorials 2");
		});
		it("Retrieves a nested directory node.", () => {
			let result = getItemFromPath(testDirectory, parseStringToPath("$ > Tutorials 2 > Other"));
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2_Other.nodeID);
			expect(testDirectory.directoryNodes[result!].slice).toEqual("Other");
		});
		it("Retrieves a root level video node.", () => {
			let result = getItemFromPath(testDirectory, parseStringToPath("$:LXb3EKWsInQ"));
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Video1.nodeID);
			expect(testDirectory.videoNodes[result!].videoID).toEqual("LXb3EKWsInQ");
		});
		it("Retrieves a nested video node.", () => {
			let result = getItemFromPath(testDirectory, parseStringToPath("$ > Tutorials 2 > Other:AKeUssuu3Is"));

			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2_Other_Video2.nodeID);
			expect(testDirectory.videoNodes[result!].videoID).toEqual("AKeUssuu3Is");
		});
	});
});
