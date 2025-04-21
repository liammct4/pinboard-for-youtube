import { createContext, useContext, useEffect, useState } from "react";
import { IWrapperProperties } from "../wrapper";
import { getActiveVideoInfo, IVideoInfo } from "../../../lib/browser/youtube";

export function useActiveVideoID(): string | null {
	const videoID = useContext(ActiveVideoContext);

	return videoID;
}

export function ActiveVideoWrapper({ children }: IWrapperProperties) {
	const [ activeVideoID, setActiveVideoID ] = useState<string | null>(null);

	useEffect(() => {
		getActiveVideoInfo().then(x => setActiveVideoID(x?.id == undefined ? null : x.id));
	}, []);

	return (
		<ActiveVideoContext.Provider value={activeVideoID}>
			{children}
		</ActiveVideoContext.Provider>
	);
}

const ActiveVideoContext = createContext<string | null>(null);
