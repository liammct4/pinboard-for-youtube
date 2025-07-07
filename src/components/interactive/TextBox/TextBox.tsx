import styles from "./TextBox.module.css"

export interface ITextBoxProperties extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	monospace?: boolean;
}

export function TextBox(props: ITextBoxProperties) {
	let actualProps = { ...props };
	delete actualProps.monospace;
	
	return (
		<textarea {...actualProps} className={props.className + " " + styles.textBox} data-monospace={props.monospace}/>
	)
}
