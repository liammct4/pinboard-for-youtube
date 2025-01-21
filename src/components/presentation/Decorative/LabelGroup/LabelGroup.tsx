import "./LabelGroup.css"

export interface ILabelGroupProperties {
	label: string;
	children: JSX.Element;
	placeLineAfter?: boolean | undefined;
}

export function LabelGroup({ label, placeLineAfter, children }: ILabelGroupProperties): React.ReactNode {
	let shouldPlaceLine = placeLineAfter ?? true;
	
	return (
		<div className="label-group">
			<span>{label}</span>
			<div className="content-outer">
				{children}
			</div>
			{shouldPlaceLine ? <div className="line-separator"/> : <></>}
		</div>
	);
}
