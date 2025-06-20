import { useMemo } from "react";
import { getNodeFromPath } from "../../../lib/directory/directory";
import { NodePath, parsePath } from "../../../lib/directory/path";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export function useDirectory(path: NodePath) {
	const tree = useSelector((state: RootState) => state.directory.videoBrowser);
	const directory = useMemo(() => {
		let nodeID = getNodeFromPath(tree, path);

		if (nodeID == null) {
			return tree.directoryNodes[tree.rootNode];
		}

		return tree.directoryNodes[nodeID];
	}, [path, tree]);

	return directory;
}

export function useDirectoryPath(path: string) {
	const nodePath = useMemo(() => parsePath(path), [path]);

	return nodePath;
}
