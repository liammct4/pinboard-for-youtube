import { Outlet, useNavigate } from "react-router-dom";
import { StyleContextWrapper } from "../../components/features/styleContext/StyleContextWrapper";
import { ExtensionBoundsWrapper } from "../../components/features/extensionBounds/ExtensionBoundsWrapper";
import { EventWrapper } from "../../components/features/events/EventWrapper";
import { NotificationWrapper } from "../../components/features/notifications/NotificationWrapper";
import { RequestHandlerWrapper } from "../../components/features/requestHandler/RequestHandlerWrapper";
import { DragListController } from "../../components/interactive/dragList/DragListController";
import "./PfyWrapper.css"
import { useEffect } from "react";
import { isVersionGreater, Version } from "../../lib/util/versioning";
import { about } from "../../about"
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export function PfyWrapper(): React.ReactNode {
	const navigate = useNavigate();
	const lastReadVersion = useSelector((state: RootState) => state.tempState.acceptedVersion);

	useEffect(() => {
		if (isVersionGreater(about.version, lastReadVersion)) {
			navigate("app/menu/options/updates");
		}
	}, [])
	
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
