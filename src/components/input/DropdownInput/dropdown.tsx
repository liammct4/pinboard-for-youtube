import * as Select from "@radix-ui/react-select"
import "./../../../styling/elements/select.css"

export function SelectItem({ value, children }: { value: string, children: React.ReactNode }): React.ReactNode {
	return (
		<Select.Item className="select-item" value={value}>
			<Select.ItemText>{children}</Select.ItemText>
		</Select.Item>
	);
}
