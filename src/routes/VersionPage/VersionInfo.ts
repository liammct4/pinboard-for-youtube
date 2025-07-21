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
	},
	{
		version: "1.2.3",
		changes: [
			"Improved error info whenever a video node has missing video data. There is now an option to remake the video from the node ID."
		],
		bugFixes: [
			"Fixed an issue where having multiple YouTube pages open at one time and interacting with the extension on one page would overwrite the changes made on another page.",
			"Fixed an issue where hotkeys could be used even though a dialog box was open, which caused unintended side effects.",
			"Improved directory renaming behaviour by fixing unintended actions occuring when interacting with the textbox (such as entering the directory)."
		]
	}
]
