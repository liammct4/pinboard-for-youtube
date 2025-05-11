import { Outlet } from "react-router-dom";
import { NotificationWrapper } from "../components/features/notifications/NotificationWrapper.tsx";
import { ExtensionBoundsWrapper } from "../components/features/extensionBounds/ExtensionBoundsWrapper.tsx";
import { EventWrapper } from "../components/features/events/EventWrapper.tsx";
import { RequestHandlerWrapper } from "../components/features/requestHandler/RequestHandlerWrapper.tsx";
import { StyleContextWrapper } from "../components/features/styleContext/StyleContextWrapper.tsx";
import "./PfyWrapper.css"
import "./HomePage.css"

export function PfyWrapper(): React.ReactNode {
	return (
		<StyleContextWrapper update-theme>
			<ExtensionBoundsWrapper>
				<EventWrapper>
					<NotificationWrapper>
						<RequestHandlerWrapper>
							<Outlet/>
						</RequestHandlerWrapper>
					</NotificationWrapper>
				</EventWrapper>
			</ExtensionBoundsWrapper>
		</StyleContextWrapper>
	)
}
