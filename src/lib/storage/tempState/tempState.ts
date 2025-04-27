import { LayoutState } from "./layoutState";

export interface ITempState {
	expandedVideos: string[],
	layout: LayoutState;
	videoBrowserScrollDistance: number;
}
