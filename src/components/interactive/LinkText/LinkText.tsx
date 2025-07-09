import styles from "./LinkText.module.css";

export interface ILinkProperties extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
{
	
}

export function LinkText(props: ILinkProperties) {
	return <a {...props} className={props.className + " " + styles.link} target="_blank"/>
}
