export type VideoPresentationStyle = "MINIMAL" | "COMPACT" | "REGULAR";
export type TimestampStyle = "FULL" | "TEXT";

export type LayoutState = {
	isCurrentVideosSectionExpanded: boolean;
	videoItemViewStyle: VideoPresentationStyle;
	isDirectoryBrowserSettingsExpanded: boolean;
	timestampStyle: TimestampStyle;
}
