import { LayoutState } from "./layoutState";

export interface ITempState {
	expandedVideos: string[],
	layout: LayoutState;
	currentDirectoryPath: string;
	videoBrowserScrollDistance: number;
}
