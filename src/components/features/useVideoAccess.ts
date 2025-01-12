import { useContext } from "react";
import { IVideoDirectoryContext, VideoDirectoryContext } from "../../context/video";

export function useVideoAccess() {
	const videos = useContext<IVideoDirectoryContext>(VideoDirectoryContext);
	
	return {

	}
}
