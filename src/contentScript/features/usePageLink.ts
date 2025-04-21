import { useEffect, useState } from "react";

export function usePageLink() {
	const [ pageLink, setPageLink ] = useState<string>(window.location.href);
	useEffect(() => {
		window.addEventListener("navigate", () => {
			setTimeout(() => setPageLink(window.location.href), 500);
		});
	}, []);

	return pageLink;
}
