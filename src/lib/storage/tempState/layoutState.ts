export type VideoPresentationStyle = "MINIMAL" | "COMPACT" | "REGULAR";

export type LayoutState = {
	isCurrentVideosSectionExpanded: boolean;
	videoItemViewStyle: VideoPresentationStyle;
	isDirectoryBrowserSettingsExpanded: boolean;
}
