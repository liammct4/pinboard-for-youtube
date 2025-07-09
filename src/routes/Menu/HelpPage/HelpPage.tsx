import { SplitHeading } from "../../../components/presentation/Decorative/Headings/SplitHeading/SplitHeading";
import styles from "./HelpPage.module.css";
import about from "./../../../about.json";
import { ButtonPanel } from "../../../components/interactive/ButtonPanel/ButtonPanel";
import { SmallButton } from "../../../components/interactive/buttons/SmallButton/SmallButton";

type IRowProperties = {
	row: number;
	label?: string;
	text: string;
	bold?: boolean;
}

function Row({ row, label, text, bold }: IRowProperties) {
	let rowStart = row * 2;

	return (
		<>
			{label != undefined ? <span className={styles.rowLabel} style={{ gridColumn: 1, gridRow: rowStart }}>{label}</span> : <></>}
			<span
				className={styles.rowText}
				style={{
					gridColumn: label == undefined ? 1 : 2,
					gridRow: rowStart
				}}
				data-bold={bold}>{text}</span>
		</>
	)
}

export function HelpPage(): React.ReactNode {

	return (
		<>
			<SplitHeading text="About this extension"/>
			<div className={styles.infoPanel}>
				<div className={styles.aboutArea}>
					<Row row={0} text="Pinboard for YouTube" bold/>
					<Row row={1} label="Version: " text={about.version}/>
					<Row row={2} label="Author: " text={about.author}/>
				</div>
				<ButtonPanel className={styles.buttonPanel} direction="Vertical">
					<SmallButton onClick={() => window.open("https://github.com/liammct4/pinboard-for-youtube")}>Repository</SmallButton>
					<SmallButton onClick={() => window.open("https://github.com/liammct4/pinboard-for-youtube/blob/main/README.md")}>README</SmallButton>
					<SmallButton onClick={() => window.open("https://github.com/liammct4/pinboard-for-youtube/blob/main/LICENSE")}>License</SmallButton>
				</ButtonPanel>
			</div>
			<SplitHeading text="Issues"/>
			<p className={styles.paragraph}>
				If you encounter any issues, please use the <a className="link-text" href="https://github.com/liammct4/pinboard-for-youtube/issues" target="_blank">Issues</a> tab on the GitHub page.
				If possible, please include the steps needed to reproduce the issue as well as any extra information
				which might be helpful.
			</p>
			<SplitHeading text="Suggestions & Questions"/>
			<p className={styles.paragraph}>
				I am open to any feature suggestions and feedback you may have. If you would like to
				submit a request, or would like to ask a question, please use the <a className="link-text" href="https://github.com/liammct4/pinboard-for-youtube/discussions" target="_blank">Discussions</a> tab in the GitHub repository.  
			</p>
		</>
	)
}
