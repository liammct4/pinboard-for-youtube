import { store } from "../src/app/store";
import { cacheActions } from "../src/features/cache/cacheSlice";
import { directoryActions } from "../src/features/directory/directorySlice";
import { videoActions } from "../src/features/video/videoSlice";
import { IYoutubeVideoInfo } from "../src/lib/util/youtube/youtubeUtil";
import { IVideo, createTimestamp, generateTimestamp } from "../src/lib/video/video";

/* This files contains all of the testing/sample data needed. */

export const sampleCacheData: IYoutubeVideoInfo[] = [
	{
		"title": "Cooling the London Underground: The Never-Ending Quest",
		"author_name": "Jago Hazzard",
		"author_url": "https://www.youtube.com/@JagoHazzard",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/5Yw-Pp_RW08/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/5Yw-Pp_RW08?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"Cooling the London Underground: The Never-Ending Quest\"></iframe>",
		"url": "https://www.youtube.com/watch?v=5Yw-Pp_RW08",
		"video_id": "5Yw-Pp_RW08"
	},
	{
		"title": "I Upgraded My Car With Open-Source AUTOPILOT and it's AMAZING",
		"author_name": "Linus Tech Tips",
		"author_url": "https://www.youtube.com/@LinusTechTips",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/xdmxM-v4KQg/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/xdmxM-v4KQg?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"I Upgraded My Car With Open-Source AUTOPILOT and it&#39;s AMAZING\"></iframe>",
		"url": "https://www.youtube.com/watch?v=xdmxM-v4KQg",
		"video_id": "xdmxM-v4KQg"
	},
	{
		"title": "Christian Horner sacked - Red Bull F1 bombshell explained",
		"author_name": "THE RACE",
		"author_url": "https://www.youtube.com/@WeAreTheRace",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/sXEz3_-T1lo/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/sXEz3_-T1lo?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"Christian Horner sacked - Red Bull F1 bombshell explained\"></iframe>",
		"url": "https://www.youtube.com/watch?v=sXEz3_-T1lo",
		"video_id": "sXEz3_-T1lo"
	},
	{
		"title": "26 Minutes of Incredible Facts by Professor Brian Cox",
		"author_name": "Tech Topia",
		"author_url": "https://www.youtube.com/@tech_topia",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/CWK04Numd0M/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/CWK04Numd0M?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"26 Minutes of Incredible Facts by Professor Brian Cox\"></iframe>",
		"url": "https://www.youtube.com/watch?v=CWK04Numd0M",
		"video_id": "CWK04Numd0M"
	},
	{
		"title": "A day in the life of the UK",
		"author_name": "Chris Spargo",
		"author_url": "https://www.youtube.com/@ChrisSpargo",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/o4EfRggPL-M/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/o4EfRggPL-M?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"A day in the life of the UK\"></iframe>",
		"url": "https://www.youtube.com/watch?v=o4EfRggPL-M",
		"video_id": "o4EfRggPL-M"
	},
	{
		"title": "002. Avalonia UI - Grid Basics",
		"author_name": "AngelSix",
		"author_url": "https://www.youtube.com/@AngelSix",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/rw9bH97uA-Q/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/rw9bH97uA-Q?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"002. Avalonia UI - Grid Basics\"></iframe>",
		"url": "https://www.youtube.com/watch?v=rw9bH97uA-Q",
		"video_id": "rw9bH97uA-Q"
	},
	{
		"title": "001. Avalonia UI - Getting Started Environment Setup",
		"author_name": "AngelSix",
		"author_url": "https://www.youtube.com/@AngelSix",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/YhKuZImznEE/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/YhKuZImznEE?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"001. Avalonia UI - Getting Started Environment Setup\"></iframe>",
		"url": "https://www.youtube.com/watch?v=YhKuZImznEE",
		"video_id": "YhKuZImznEE"
	},
	{
		"title": "OpenGL Tutorial 18 - Framebuffer & Post-processing",
		"author_name": "Victor Gordan",
		"author_url": "https://www.youtube.com/@VictorGordan",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/QQ3jr-9Rc1o/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/QQ3jr-9Rc1o?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"OpenGL Tutorial 18 - Framebuffer &amp; Post-processing\"></iframe>",
		"url": "https://www.youtube.com/watch?v=QQ3jr-9Rc1o",
		"video_id": "QQ3jr-9Rc1o"
	},
	{
		"title": "I Cycled 2500km in London — Here's How It Changed My Life",
		"author_name": "Evan Edinger",
		"author_url": "https://www.youtube.com/@evan",
		"type": "video",
		"height": 113,
		"width": 200,
		"version": "1.0",
		"provider_name": "YouTube",
		"provider_url": "https://www.youtube.com/",
		"thumbnail_height": 360,
		"thumbnail_width": 480,
		"thumbnail_url": "https://i.ytimg.com/vi/Dmf6aEx09Oo/hqdefault.jpg",
		"html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/Dmf6aEx09Oo?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"I Cycled 2500km in London — Here&#39;s How It Changed My Life\"></iframe>",
		"url": "https://www.youtube.com/watch?v=Dmf6aEx09Oo",
		"video_id": "Dmf6aEx09Oo"
	}
]

const autoplay = createTimestamp();

export const sampleVideoData: IVideo[] = [
	{
		id: "sXEz3_-T1lo",
		timestamps: [
			
		],
		autoplayTimestamp: null
	},
	{
		id: "o4EfRggPL-M",
		timestamps: [

		],
		autoplayTimestamp: null
	},
	{
		id: "CWK04Numd0M",
		timestamps: [

		],
		autoplayTimestamp: null
	},
	{
		id: "Dmf6aEx09Oo",
		timestamps: [
			{ id: createTimestamp(), message: "The cost of cycling vs the London Underground", time: 341 },
			{ id: createTimestamp(), message: "Lime Bikes vs good ebikes with torque sensors", time: 492 },
			{ id: autoplay, message: "Autoplaying timestamp!", time: 859 }
		],
		autoplayTimestamp: autoplay
	},
	{
		id: "xdmxM-v4KQg",
		timestamps: [

		],
		autoplayTimestamp: null
	},
	{
		id: "YhKuZImznEE",
		timestamps: [

		],
		autoplayTimestamp: null
	},
	{
		id: "rw9bH97uA-Q",
		timestamps: [
			{ id: createTimestamp(), message: "Setup.", time: 165 },
			{ id: createTimestamp(), message: "Reference to StackPanel.", time: 873 },
			{ id: autoplay, message: "Autoplaying timestamp!", time: 1392 }
		],
		autoplayTimestamp: autoplay
	},
	{
		id: "QQ3jr-9Rc1o",
		timestamps: [

		],
		autoplayTimestamp: null
	}
];


export function createTestUserData() {
	let activeID = "5Yw-Pp_RW08";
	store.dispatch(videoActions.changeActiveVideoID(activeID as string));

	// Videos.
	sampleVideoData.forEach(v => store.dispatch(videoActions.addVideo(v)));

	// Caching.
	sampleCacheData.forEach(v => store.dispatch(cacheActions.saveVideoToCache(v)));
	
	// Directory setup.
	store.dispatch(directoryActions.createDirectoryNode({ parentPath: "$", slice: "Entertainment" }));
	store.dispatch(directoryActions.createDirectoryNode({ parentPath: "$ > Entertainment", slice: "Games" }));
	store.dispatch(directoryActions.createDirectoryNode({ parentPath: "$", slice: "Tutorials" }));
	store.dispatch(directoryActions.createDirectoryNode({ parentPath: "$ > Tutorials", slice: "OpenGL" }));

	// Directory videos.
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$ > Entertainment", videoID: sampleVideoData[0].id, videoData: store.getState().cache.videoCache }));
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$ > Entertainment", videoID: sampleVideoData[1].id, videoData: store.getState().cache.videoCache }));
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$", videoID: sampleVideoData[2].id, videoData: store.getState().cache.videoCache }));
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$ > Entertainment", videoID: sampleVideoData[3].id, videoData: store.getState().cache.videoCache }));
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$ > Entertainment", videoID: sampleVideoData[4].id, videoData: store.getState().cache.videoCache }));
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$ > Tutorials", videoID: sampleVideoData[5].id, videoData: store.getState().cache.videoCache }));
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$ > Tutorials", videoID: sampleVideoData[6].id, videoData: store.getState().cache.videoCache }));
	store.dispatch(directoryActions.createVideoNode({ parentPath: "$ > Tutorials > OpenGL", videoID: sampleVideoData[7].id, videoData: store.getState().cache.videoCache }));
}
