import { Outlet } from "react-router-dom";
import { StorageWrapper } from "../components/features/storage/StorageWrapper.tsx";
import { NotificationWrapper } from "../components/features/notifications/NotificationWrapper.tsx";
import { ExtensionBoundsWrapper } from "../components/features/extensionBounds/ExtensionBoundsWrapper.tsx";
import { VideoWrapper } from "../components/features/videoAccess/VideoWrapper.tsx";
import { EventWrapper } from "../components/features/events/EventWrapper.tsx";
import "./HomePage.css"
import "./PfyWrapper.css"

export function PfyWrapper(): React.ReactNode {
	return (
		<StorageWrapper>
			<VideoWrapper>
				<div className="pfy-style-context">
					<ExtensionBoundsWrapper>
						<EventWrapper>
							<NotificationWrapper>
								<Outlet/>
							</NotificationWrapper>
						</EventWrapper>
					</ExtensionBoundsWrapper>
				</div>
			</VideoWrapper>
		</StorageWrapper>
	)
}
