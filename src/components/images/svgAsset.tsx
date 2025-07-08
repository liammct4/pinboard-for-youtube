export type Asset = React.FC<React.SVGProps<SVGSVGElement>>;

type DataPropName = `data-${string}`;
interface DataProps {
	[name: DataPropName]: string
}

export interface ISVGContainerProperties extends DataProps, React.SVGProps<SVGSVGElement> {
	asset?: Asset
	className?: string;
	"manual-fill"?: string;
	"manual-stroke"?: string;
	"use-fill"?: boolean;
	"use-stroke"?: boolean;
}

/**
 * Facilitates SVG icon display for customizable colours. Use colour classes
 * defined in common-definitions.css (prefixed by 'icon-colour') for conforming
 * to the app theme.
 * @param asset The asset to include, this is an imported SVG file as. 
 * For example, @example import SomeIcon from "../../SomeIcon.svg?react".
 * @param className The class name which will be applied to the <svg/>. Use this to specify a colour class.
 * @param manual-fill Overrides the provided colour class with a manual fill. (This can be a css variable).
 * @param manual-stroke Overrides the provided colour class with a manual stroke. (This can be a css variable).
 * @param use-fill Set to enable the fill colour on the asset, no fill is applied by default.
 * @param use-stroke Set to enable the stroke colour on the asset, no stroke is applied by default.
 */
export function IconContainer(props: ISVGContainerProperties): React.ReactNode {
	let actualProps = { ...props };

	delete actualProps["manual-fill"];
	delete actualProps["manual-stroke"];
	delete actualProps["use-fill"];
	delete actualProps["use-stroke"];
	delete actualProps.asset;

	let className = props.className ?? "icon-primary-content-contrast";
	let Asset = props.asset!;

	return (
		<Asset
			{...actualProps}
			className={className}
			style={{
				/* Check if the provided fill is a variable. */
				fill: props["manual-fill"]?.startsWith("--") ? `var(${props["manual-fill"]})` : props["manual-fill"],
				stroke: props["manual-stroke"]?.startsWith("--") ? `var(${props["manual-stroke"]})` : props["manual-stroke"]
			}}
			data-use-fill={props["use-fill"]}
			data-use-stroke={props["use-stroke"]}/>
		);
}
