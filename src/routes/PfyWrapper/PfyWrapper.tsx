import { Outlet } from "react-router-dom";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { ExtensionBoundsWrapper } from "../../components/features/extensionBounds/ExtensionBoundsWrapper";
import { EventWrapper } from "../../components/features/events/EventWrapper";
import { NotificationWrapper } from "../../components/features/notifications/NotificationWrapper";
import { RequestHandlerWrapper } from "../../components/features/requestHandler/RequestHandlerWrapper";
import { DragListController } from "../../components/interactive/dragList/DragListController";
import "./PfyWrapper.css"

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
