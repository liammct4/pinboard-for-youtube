import { Outlet } from "react-router-dom";
import { StorageWrapper } from "../components/features/storage/StorageWrapper.tsx";
import { NotificationWrapper } from "../components/features/notifications/NotificationWrapper.tsx";
import { ExtensionBoundsWrapper } from "../components/features/extensionBounds/ExtensionBoundsWrapper.tsx";
import { VideoWrapper } from "../components/features/videoAccess/VideoWrapper.tsx";
import { EventWrapper } from "../components/features/events/EventWrapper.tsx";
import { RequestHandlerWrapper } from "../components/features/requestHandler/RequestHandlerWrapper.tsx";
import { AccountDataWrapper } from "../components/features/accountData/AccountDataWrapper.tsx";
import { MutationWrapper } from "../components/features/mutations/MutationWrapper.tsx";
import { StyleContextWrapper } from "../components/features/styleContext/StyleContextWrapper.tsx";
import "./PfyWrapper.css"
import "./HomePage.css"
import { ActiveVideoWrapper } from "../components/features/activeVideo/useActiveVideo.tsx";

export function PfyWrapper(): React.ReactNode {
	return (
		<StorageWrapper>
			<StyleContextWrapper update-theme>
				<ExtensionBoundsWrapper>
					<EventWrapper>
						<NotificationWrapper>
							<RequestHandlerWrapper>
								<VideoWrapper>
									<AccountDataWrapper>
										<MutationWrapper>
											<ActiveVideoWrapper>
												<Outlet/>
											</ActiveVideoWrapper>
										</MutationWrapper>
									</AccountDataWrapper>
								</VideoWrapper>
							</RequestHandlerWrapper>
						</NotificationWrapper>
					</EventWrapper>
				</ExtensionBoundsWrapper>
			</StyleContextWrapper>
		</StorageWrapper>
	)
}
