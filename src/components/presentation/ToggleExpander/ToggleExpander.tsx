import * as Collapsible from "@radix-ui/react-collapsible"
import "./../../../styling/elements/expander.css"

export interface IToggleExpanderProperties {
	expanded: boolean;
	children: JSX.Element;
}

export function ToggleExpander({ expanded, children }: IToggleExpanderProperties): React.ReactNode {
	
	return (
		<Collapsible.Root open={expanded}>
			<Collapsible.Content className="expander-content" data-expander-use-slide-animation>
				{children}
			</Collapsible.Content>
		</Collapsible.Root>
	);
}
