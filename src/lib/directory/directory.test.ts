import { testDirectory, Tutorials2, Tutorials2_Other, Tutorials2_Other_Random, Tutorials2_Other_Video2, Video1 } from "../../../testData/directory";
import { getNodeFromPath, getPathOfNode } from "./directory";
import { parsePath, pathToString } from "./path";

describe("Directory helper functions", () => {
	describe("getItemFromPath()", () => {
		it("Retrieves the root directory.", () => {
			let result = getNodeFromPath(testDirectory, parsePath("$"));
			
			expect(result).toEqual(testDirectory.rootNode);
		});
		it("Retrieves a root level directory node.", () => {
			let result = getNodeFromPath(testDirectory, parsePath("$ > Tutorials 2"));
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2.nodeID);
			expect(testDirectory.directoryNodes[result!].slice).toEqual("Tutorials 2");
		});
		it("Retrieves a nested directory node.", () => {
			let result = getNodeFromPath(testDirectory, parsePath("$ > Tutorials 2 > Other"));
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2_Other.nodeID);
			expect(testDirectory.directoryNodes[result!].slice).toEqual("Other");
		});
		it("Retrieves a root level video node.", () => {
			let result = getNodeFromPath(testDirectory, parsePath("$:LXb3EKWsInQ"));
			
			expect(result).not.toBeNull();
			expect(result).toEqual(Video1.nodeID);
			expect(testDirectory.videoNodes[result!].videoID).toEqual("LXb3EKWsInQ");
		});
		it("Retrieves a nested video node.", () => {
			let result = getNodeFromPath(testDirectory, parsePath("$ > Tutorials 2 > Other:AKeUssuu3Is"));

			expect(result).not.toBeNull();
			expect(result).toEqual(Tutorials2_Other_Video2.nodeID);
			expect(testDirectory.videoNodes[result!].videoID).toEqual("AKeUssuu3Is");
		});
	});
	describe("getPathOfNode()", () => {
		it("Retrieves the root node path if provided with the root node.", () => {
			let result = getPathOfNode(testDirectory, testDirectory.rootNode);

			expect(result).not.toBeNull();
			expect(pathToString(result!)).toEqual("$");
		});
		it("Retrieves a one level deep video node.", () => {
			let result = getPathOfNode(testDirectory, Video1.nodeID);

			expect(result).not.toBeNull();
			expect(pathToString(result!)).toEqual(`$:${Video1.videoID}`);
		});
		it("Retrieves a deeply nested video node.", () => {
			let result = getPathOfNode(testDirectory, Tutorials2_Other_Video2.nodeID);

			expect(result).not.toBeNull();
			expect(pathToString(result!)).toEqual(`$ > Tutorials 2 > Other:${Tutorials2_Other_Video2.videoID}`);
		});
		it("Retrieves a one level deep directory node.", () => {
			let result = getPathOfNode(testDirectory, Tutorials2.nodeID);

			expect(result).not.toBeNull();
			expect(pathToString(result!)).toEqual("$ > Tutorials 2");
		});
		it("Retrieves a deeply nested directory node.", () => {
			let result = getPathOfNode(testDirectory, Tutorials2_Other_Random.nodeID);

			expect(result).not.toBeNull();
			expect(pathToString(result!)).toEqual("$ > Tutorials 2 > Other > Random");
		});
	});
});
