import { Outlet } from "react-router-dom";
import { NotificationWrapper } from "../components/features/notifications/NotificationWrapper.tsx";
import { ExtensionBoundsWrapper } from "../components/features/extensionBounds/ExtensionBoundsWrapper.tsx";
import { EventWrapper } from "../components/features/events/EventWrapper.tsx";
import { RequestHandlerWrapper } from "../components/features/requestHandler/RequestHandlerWrapper.tsx";
import { StyleContextWrapper } from "../components/features/styleContext/StyleContextWrapper.tsx";
import { DragListController } from "../components/interactive/dragList/DragListController.tsx";
import "./PfyWrapper.css"
import "./HomePage.css"

export function PfyWrapper(): React.ReactNode {
	return (
		<StyleContextWrapper update-theme use-transition>
			<ExtensionBoundsWrapper>
				<EventWrapper>
					<NotificationWrapper>
						<RequestHandlerWrapper>
							<DragListController>
								<Outlet/>
							</DragListController>
						</RequestHandlerWrapper>
					</NotificationWrapper>
				</EventWrapper>
			</ExtensionBoundsWrapper>
		</StyleContextWrapper>
	)
}
