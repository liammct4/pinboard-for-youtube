import { useEffect, useRef, useState } from "react";
import { IVideo } from "../../../lib/video/video";
import { VideoDirectoryContext } from "../../../context/video";
import { cloneDirectory, IDirectoryNode } from "../../video/navigation/directory";
import { IWrapperProperties } from "../wrapper";
import { useLocalStorage } from "../storage/useLocalStorage";
import { removeParentPass } from "../../../lib/storage/userData/userData";

export function VideoWrapper({ children }: IWrapperProperties): React.ReactNode {
	const videos = useRef<Map<string, IVideo>>(new Map<string, IVideo>());
	const { storage, setStorage } = useLocalStorage();
	const preventUpdateCounter = useRef<number>(0);
	const directoryRoot = useRef<IDirectoryNode>(cloneDirectory(storage.userData.directoryRoot));
	const [ counter, setCounter ] = useState<number>(0);
	const [ updateCount, setUpdateCount ] = useState<number>(0);

	useEffect(() => {
		if (counter == 0) {
			return;
		}

		preventUpdateCounter.current = 2;
		storage.userData.videos = Array.from(videos.current.values());
		storage.userData.directoryRoot = removeParentPass(directoryRoot.current);

		setStorage(storage);
	}, [counter]);

	useEffect(() => {
		if (preventUpdateCounter.current != 0) {
			preventUpdateCounter.current -= 1;
			return;
		}

		directoryRoot.current = cloneDirectory(storage.userData.directoryRoot);
		storage.userData.videos.forEach(x => videos.current.set(x.id, x));
		
		setUpdateCount(updateCount + 1);
	}, [JSON.stringify(storage.userData.directoryRoot), JSON.stringify(storage.userData.videos)]);

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
