import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export function useVideo() {
	const videos = useSelector((state: RootState) => state.video.videos);

	return {
		videoExists: (id: string) => {
			return videos.find(x => x.id == id) != undefined;
		},
		getVideo: (id: string) => {
			return videos.find(x => x.id == id);
		}
	};
}
