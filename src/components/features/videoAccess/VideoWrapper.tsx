import { useEffect, useRef, useState } from "react";
import { IVideo } from "../../../lib/video/video";
import { VideoDirectoryContext } from "../../../context/video";
import { IDirectoryNode } from "../../video/navigation/directory";
import { accessStorage } from "../../../lib/storage/storage";
import { addParentPass } from "../../../lib/storage/userData/userData";
import { IWrapperProperties } from "../wrapper";

export function VideoWrapper({ children }: IWrapperProperties): React.ReactNode {
	const videos = useRef<Map<string, IVideo>>(new Map<string, IVideo>());
	const [ directoryRoot, setDirectoryRoot ] = useState<IDirectoryNode>(null!);
	const [ counter, setCounter ] = useState<number>(0);

	useEffect(() => {
		let updateVideos = async () => {
			let storage = await accessStorage();
			videos.current = new Map<string, IVideo>(storage.user_data.videos.map(x => [x.id, x]));
			addParentPass(storage.user_data.directoryRoot);
			setDirectoryRoot(storage.user_data.directoryRoot);
		}

		updateVideos();
	}, []);

	return (
		<VideoDirectoryContext.Provider
			value={{ videoData: videos.current, directoryRoot: directoryRoot, counter, setCounter }}>
				{children}
		</VideoDirectoryContext.Provider>
	);
}
