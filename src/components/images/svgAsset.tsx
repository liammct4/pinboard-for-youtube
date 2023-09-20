export type Asset = React.FC<React.SVGProps<SVGSVGElement>>;
export interface ISVGContainerProperties {
	asset: Asset
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
 * For example, @example import { ReactComponent as SomeIcon } from "../../".
 * @param className The class name which will be applied to the <svg/>. Use this to specify a colour class.
 * @param manual-fill Overrides the provided colour class with a manual fill. (This can be a css variable).
 * @param manual-stroke Overrides the provided colour class with a manual stroke. (This can be a css variable).
 * @param use-fill Set to enable the fill colour on the asset, no fill is applied by default.
 * @param use-stroke Set to enable the stroke colour on the asset, no stroke is applied by default.
 */
export function IconContainer({
		asset: Asset,
		className = "icon-primary-content-contrast",
		"manual-fill": fill,
		"manual-stroke": stroke,
		"use-fill": useFill,
		"use-stroke": useStroke
	}: ISVGContainerProperties): React.ReactNode {

	return (
		<Asset
			className={className}
			style={{
				/* Check if the provided fill is a variable. */
				fill: fill?.startsWith("--") ? `var(${fill})` : fill,
				stroke: stroke?.startsWith("--") ? `var(${stroke})` : stroke
			}}
			data-use-fill={useFill}
			data-use-stroke={useStroke}/>
		);
}
