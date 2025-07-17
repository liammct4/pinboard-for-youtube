import { Version } from "../../lib/util/versioning"

type VersionData = {
	version: Version;
	summary?: string;
	changes?: string[];
	bugFixes?: string[];
}

export const VersionInfo: VersionData[] = [
	{
		version: "1.1.2",
		changes: [
			"Added arrow key navigation for the theme list.",
			"Added update notes page.",
			"Adjusted Pinboard button behaviour on YouTube page, if autoplaying timestamps are enabled, clicking the button will create an autoplaying timestamp first instead of a regular timestamp."
		],
		bugFixes: [
			"Fixed an issue where clicking the \"Clear All\" button would not reset the current directory path.",
			"Fixed an issue where the \"Clear All\" button would still leave video data behind.",
			"Fixed an issue where scrollbars would be extremely difficult to see when using a dark theme.",
			"Fix UTF-8 incompatibility when copying/encoding data. (Removed encoding)",
			"Fixed an issue where the mouse tooltip when dragging a node would wrap improperly when cut off by the edge of the extension."
		]
	}
]
