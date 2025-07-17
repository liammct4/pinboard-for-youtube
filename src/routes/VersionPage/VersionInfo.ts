import { Version } from "../../lib/util/versioning"

type VersionData = {
	version: Version;
	summary?: string;
	features?: string[];
	bugFixes?: string[];
}

export const VersionInfo: VersionData[] = [
	{
		version: "1.1.2",
		features: [
			"Added arrow key navigation for the theme list.",
			"Added update notes page."
		],
		bugFixes: [
			"Fixed an issue where clicking the \"Clear All\" button would not reset the current directory path.",
			"Fixed an issue where the \"Clear All\" button would still leave video data behind.",
			"Fixed an issue where scrollbars would be extremely difficult to see when using a dark theme.",
			"Fix UTF-8 incompatibility when copying/encoding data.",
		]
	}
]
