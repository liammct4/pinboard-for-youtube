import { useRef, useState } from "react";
import { IVideo } from "../../../lib/video/video";
import { VideoDirectoryContext } from "../../../context/video";
import { cloneDirectory, IDirectoryNode } from "../../video/navigation/directory";
import { IWrapperProperties } from "../wrapper";
import { useLocalStorage } from "../storage/useLocalStorage";

export function VideoWrapper({ children }: IWrapperProperties): React.ReactNode {
	const videos = useRef<Map<string, IVideo>>(new Map<string, IVideo>());
	const { storage } = useLocalStorage();
	const directoryRoot = useRef<IDirectoryNode>(cloneDirectory(storage.user_data.directoryRoot));
	const [ counter, setCounter ] = useState<number>(0);

	return (
		<VideoDirectoryContext.Provider value={{
				videoData: videos.current,
				directoryRoot: directoryRoot.current,
				counter,
				setCounter
			}}>
				{children}
		</VideoDirectoryContext.Provider>
	);
}
