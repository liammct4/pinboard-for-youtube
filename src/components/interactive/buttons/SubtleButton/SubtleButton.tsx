import styles from "./SubtleButton.module.css";

export interface ISubtleButtonProperties extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {

}

export function SubtleButton(props: ISubtleButtonProperties) {
	return <button {...props} className={`${props.className} ${styles.subtleButton}`}/>
}