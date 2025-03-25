import { useEffect, useRef, useState } from "react";
import { IVideo } from "../../../lib/video/video";
import { getDirectoryRootFromStorage, getVideoDictionary } from "../../../lib/storage/userData/userData";
import { VideoDirectoryContext } from "../../../context/video";
import { IDirectoryNode } from "../../video/navigation/directory";

export interface IVideoWrapperProperties {
	children: JSX.Element | JSX.Element[];
}

export function VideoWrapper({ children }: IVideoWrapperProperties): React.ReactNode {
	const videos = useRef<Map<string, IVideo>>(null!);
	const [ directoryRoot, setDirectoryRoot ] = useState<IDirectoryNode>(null!);
	const [ counter, setCounter ] = useState<number>(0);

	useEffect(() => {
		let updateVideos = async () => {
			videos.current = await getVideoDictionary();
			setDirectoryRoot(await getDirectoryRootFromStorage());
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
