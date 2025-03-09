import "./LabelGroup.css"

export interface ILabelGroupProperties {
	label: string;
	children: JSX.Element[] | JSX.Element;
	className?: string;
	placeLineAfter?: boolean | undefined;
}

export function LabelGroup({ className, label, placeLineAfter, children }: ILabelGroupProperties): React.ReactNode {
	let shouldPlaceLine = placeLineAfter ?? true;
	
	return (
		<div className="label-group">
			<span>{label}</span>
			<div className={`${className} content-outer`}>
				{children}
			</div>
			{shouldPlaceLine ? <div className="line-separator"/> : <></>}
		</div>
	);
}
