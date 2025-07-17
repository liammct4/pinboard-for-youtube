import { useEffect, useState } from "react";
import { ButtonPanel } from "../../components/interactive/ButtonPanel/ButtonPanel";
import { SmallButton } from "../../components/interactive/buttons/SmallButton/SmallButton";
import { SplitHeading } from "../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import { isVersionGreater, isVersionLesser, Version } from "../../lib/util/versioning";
import { about } from "../../about"
import { VersionInfo } from "./VersionInfo";
import styles from "./VersionPage.module.css"
import { useDispatch, useSelector } from "react-redux";
import { tempStateActions } from "../../features/state/tempStateSlice";
import { RootState } from "../../app/store";

export function VersionPage() {
	const [ index, setIndex ] = useState<number>(VersionInfo.findIndex(v => v.version == about.version));
	const latestReadVersion = useSelector((state: RootState) => state.tempState.acceptedVersion);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isVersionLesser(latestReadVersion, about.version)) {
			dispatch(tempStateActions.readVersion(about.version));
		}
	}, []);

	const versionData = VersionInfo[index];

	return (
		<div className={styles.page}>
			<SplitHeading text={`Update version ${versionData.version}`}/>
			{
				versionData.version == about.version ? 
					<p className={styles.latestText}>A new update has been installed, version {versionData.version}, see the changes below:</p>
					: <></>
			}
			{
				versionData.summary ? 
					<p>{versionData.summary}</p>
					: <></>
			}
			{
				versionData.changes ?
					<>
						<h4 className={styles.subtitle}>Changes:</h4>
						<ul className={styles.list}>
							{versionData.changes.map(f => <li key={f}>{f}</li>)}
						</ul>
					</>
					: <></>
			}
			{
				versionData.bugFixes ?
					<>
						<h4 className={styles.subtitle}>Bug fixes:</h4>
						<ul className={styles.list}>
							{versionData.bugFixes.map(b => <li key={b}>{b}</li>)}
						</ul>
					</>
					: <></>
			}
			<ButtonPanel className={styles.buttons} direction="Horizontal">
				<SmallButton title="View previous update." onClick={() => setIndex(index - 1)} disabled={index == 0}>Previous</SmallButton>
				<SmallButton title="View next update." onClick={() => setIndex(index + 1)} disabled={index == VersionInfo.length - 1}>Next</SmallButton>
			</ButtonPanel>
		</div>
	)
}
