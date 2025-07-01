import { defaultSettings } from "../src/lib/config/settings";
import { IConfig } from "../src/lib/storage/config";
import { IYoutubeVideoInfo } from "../src/lib/util/youtube/youtubeUtil";
import { IVideo, generateTimestamp } from "../src/lib/video/video";
import { AppThemes, DEFAULT_THEME } from "../src/styling/themes";

/* This files contains all of the testing/sample data needed. */

export const sampleCacheData: IYoutubeVideoInfo[] = [
    {
        "title": "COSTA RICA IN 4K 60fps HDR (ULTRA HD)",
        "author_name": "Jacob + Katie Schwarz",
        "author_url": "https://www.youtube.com/@JacobKatieSchwarz",
        "type": "video",
        "height": 113,
        "width": 200,
        "version": "1.0",
        "provider_name": "YouTube",
        "provider_url": "https://www.youtube.com/",
        "thumbnail_height": 360,
        "thumbnail_width": 480,
        "thumbnail_url": "https://i.ytimg.com/vi/LXb3EKWsInQ/hqdefault.jpg",
        "html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/LXb3EKWsInQ?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"COSTA RICA IN 4K 60fps HDR (ULTRA HD)\"></iframe>",
        "url": "https://www.youtube.com/watch?v=LXb3EKWsInQ",
        "video_id": "LXb3EKWsInQ"
    },
    {
        "title": "Beautiful Nature Video in 4K (Ultra HD) - Autumn River Sounds - 5 Hours Long",
        "author_name": "4K Relaxation Channel",
        "author_url": "https://www.youtube.com/@RelaxationChannel",
        "type": "video",
        "height": 113,
        "width": 200,
        "version": "1.0",
        "provider_name": "YouTube",
        "provider_url": "https://www.youtube.com/",
        "thumbnail_height": 360,
        "thumbnail_width": 480,
        "thumbnail_url": "https://i.ytimg.com/vi/WNCl-69POro/hqdefault.jpg",
        "html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/WNCl-69POro?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"Beautiful Nature Video in 4K (Ultra HD) - Autumn River Sounds - 5 Hours Long\"></iframe>",
        "url": "https://www.youtube.com/watch?v=WNCl-69POro",
        "video_id": "WNCl-69POro"
    },
	{
        "title": "Sony 4K Demo: Another World",
        "author_name": "Quang Nguyen",
        "author_url": "https://www.youtube.com/@QuangNguyen-qk6de",
        "type": "video",
        "height": 113,
        "width": 200,
        "version": "1.0",
        "provider_name": "YouTube",
        "provider_url": "https://www.youtube.com/",
        "thumbnail_height": 360,
        "thumbnail_width": 480,
        "thumbnail_url": "https://i.ytimg.com/vi/xcJtL7QggTI/hqdefault.jpg",
        "html": "<iframe width=\"200\" height=\"113\" src=\"https://www.youtube.com/embed/xcJtL7QggTI?feature=oembed\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen title=\"Sony 4K Demo: Another World\"></iframe>",
        "url": "https://www.youtube.com/watch?v=xcJtL7QggTI",
        "video_id": "xcJtL7QggTI"
    }
]

export const sampleVideoData: IVideo[] = [
	{
		id: "LXb3EKWsInQ",
		timestamps: [
			generateTimestamp(63, "Timestamp expands to this end margin." ),
			generateTimestamp(4351, "Timestamp in the middle..."),
		]
	},
	{
		id: "WNCl-69POro",
		timestamps: [
			generateTimestamp(10, "A::Random"),
			generateTimestamp(20, "B::Other")
		]
	},
	{
		id: "njX2bu-_Vw4",
		timestamps: [
			generateTimestamp(230, "Sed imperdiet interdum tempus."),
			generateTimestamp(1200, "Nunc dui dolor, feugiat id eros feugiat."),
			generateTimestamp(354, "Nulla ornare arcu tellus."),
			generateTimestamp(1354, "Praesent eu nulla lacus."),
		]
	},
	{
		id: "AKeUssuu3Is",
		timestamps: [
			generateTimestamp(16, "Maecenas lectus nisl, pretium.")
		]
	},
	{
		id: "ZjVAsJOl8SM",
		timestamps: [
			generateTimestamp(1063, "Another timestamp.")
		]
	},
	{
		id: "PnvkrBXmLSI",
		timestamps: [
			generateTimestamp(60342, "Phasellus convallis arcu in malesuada mattis."),
			generateTimestamp(0, "Maximus quis purus."),
		]
	},
	{
		id: "ERYG3NE1DO8",
		timestamps: []
	}
];
