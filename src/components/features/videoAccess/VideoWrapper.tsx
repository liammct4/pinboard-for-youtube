import { useEffect, useRef, useState } from "react";
import { IVideo } from "../../../lib/video/video";
import { VideoDirectoryContext } from "../../../context/video";
import { cloneDirectory, IDirectoryNode } from "../../video/navigation/directory";
import { IWrapperProperties } from "../wrapper";
import { removeParentPass } from "../../../lib/storage/userData/userData";
import { modifyStorage } from "../../../lib/storage/storage";

export interface IVideoWrapperProperties extends IWrapperProperties {
	initialDirectory: IDirectoryNode;
}

export function VideoWrapper({ initialDirectory, children }: IVideoWrapperProperties): React.ReactNode {
	const videos = useRef<Map<string, IVideo>>(new Map<string, IVideo>());
	const preventUpdateCounter = useRef<number>(0);
	const directoryRoot = useRef<IDirectoryNode>(initialDirectory);
	const [ counter, setCounter ] = useState<number>(0);
	const [ updateCount, setUpdateCount ] = useState<number>(0);

	useEffect(() => {
		if (counter == 0) {
			return;
		}

		preventUpdateCounter.current = 2;

		modifyStorage(storage => {
			storage.userData.directoryRoot = removeParentPass(directoryRoot.current);
		});
	}, [counter]);

	useEffect(() => {
		if (preventUpdateCounter.current != 0) {
			preventUpdateCounter.current -= 1;
			return;
		}

		modifyStorage(storage => {
			directoryRoot.current = cloneDirectory(storage.userData.directoryRoot);
		});

		setUpdateCount(updateCount + 1);
		// TODO: Replace.
	}, [/*JSON.stringify(storage.userData.directoryRoot), JSON.stringify(storage.userData.videos)*/]);

	return (
		<VideoDirectoryContext.Provider value={{
				updateCount,
				directoryRoot: directoryRoot.current,
				counter,
				setCounter
			}}>
				{children}
		</VideoDirectoryContext.Provider>
	);
}
