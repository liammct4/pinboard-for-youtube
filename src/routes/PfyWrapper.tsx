import { Outlet } from "react-router-dom";
import { StorageWrapper } from "../components/features/storage/StorageWrapper.tsx";
import { NotificationWrapper } from "../components/features/notifications/NotificationWrapper.tsx";
import { ExtensionBoundsWrapper } from "../components/features/extensionBounds/ExtensionBoundsWrapper.tsx";
import { VideoWrapper } from "../components/features/videoAccess/VideoWrapper.tsx";
import { EventWrapper } from "../components/features/events/EventWrapper.tsx";
import "./HomePage.css"
import "./PfyWrapper.css"
import { RequestHandlerWrapper } from "../components/features/requestHandler/RequestHandlerWrapper.tsx";

export function PfyWrapper(): React.ReactNode {
	return (
		<StorageWrapper>
				<div className="pfy-style-context">
					<ExtensionBoundsWrapper>
						<EventWrapper>
							<NotificationWrapper>
								<RequestHandlerWrapper>
									<VideoWrapper>
										<Outlet/>
									</VideoWrapper>
								</RequestHandlerWrapper>
							</NotificationWrapper>
						</EventWrapper>
					</ExtensionBoundsWrapper>
				</div>
		</StorageWrapper>
	)
}
