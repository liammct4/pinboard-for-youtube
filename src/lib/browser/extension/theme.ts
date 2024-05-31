import { IAppTheme } from "../../config/theming/appTheme";

/**
 * Sets the current active app theme according to the provided palette.
 * @param theme The theme to change to.
 */
export function swapAppTheme(theme: IAppTheme): void {
	Object.keys(theme.palette).forEach(key => {
		// @ts-ignore
		document.documentElement.style.setProperty(`--pfy-${key}`, theme.palette[key]);
	});
}
