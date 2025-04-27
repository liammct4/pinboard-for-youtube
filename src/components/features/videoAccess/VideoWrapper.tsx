import { useEffect, useRef, useState } from "react";
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
	const [ updateCount, setUpdateCount ] = useState<number>(0);

	useEffect(() => {
		directoryRoot.current = cloneDirectory(storage.user_data.directoryRoot);
		storage.user_data.videos.forEach(x => videos.current.set(x.id, x));

		setUpdateCount(updateCount + 1);
	}, [JSON.stringify(storage.user_data.directoryRoot)]);

	return (
		<VideoDirectoryContext.Provider value={{
				updateCount,
				videoData: videos.current,
				directoryRoot: directoryRoot.current,
				counter,
				setCounter
			}}>
				{children}
		</VideoDirectoryContext.Provider>
	);
}
