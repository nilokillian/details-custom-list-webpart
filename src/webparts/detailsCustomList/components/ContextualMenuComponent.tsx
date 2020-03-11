import * as React from "react";
import {
  ActionButton,
  ContextualMenuItemType,
  DirectionalHint,
  Callout
} from "office-ui-fabric-react";
import { AlertMeForm } from "./AlertMeForm";
import { SPFieldsContext } from "../contexts/SPFieldsContext";
import { SPItemsContext } from "../contexts/SPItemsContext";
import { FeedbackContext } from "../contexts/FeedbackContext";
import { FeedbackForm } from "./FeedbackForm";
import { alertMeLink } from "../utils/alertMeLink";
import { getOpentInLink } from "../utils/openInLink";
import { copyLink } from "../utils/copyLink";
import { ShareLinkForm } from "./ShareLinkForm";
import { dowloadSingleFile } from "../utils/dowloadSingleFile";
import { getZippedFiles } from "../utils/getZippedFiles";

export interface IContextualMenuComponentProps {
  selectedItemId: string | number;
  docId: string;
}

export const ContextualMenuComponent: React.FC<IContextualMenuComponentProps> = React.memo(
  ({ selectedItemId, docId }): JSX.Element => {
    const contextualMneuDialogRef = React.useRef();
    const [isCopyLinkDialog, setIsCopyLinkDialog] = React.useState(false);
    const [isShareLinkDialog, setIsShareLinkDialog] = React.useState(false);
    const [isAlerMeDialog, setAlerMeDialog] = React.useState<boolean>(false);
    const [isFeedbackForm, setFeedbackForm] = React.useState<boolean>(false);
    const { selectedListId, selectedListInternalName } = React.useContext(
      SPFieldsContext
    );
    const { selectedItems } = React.useContext(SPItemsContext);
    const { feedbackForm } = React.useContext(FeedbackContext);

    return (
      <div className="calloutArea">
        <ActionButton
          persistMenu={true}
          menuProps={{
            directionalHint: DirectionalHint.bottomCenter,
            shouldFocusOnMount: true,
            shouldFocusOnContainer: true,
            items: [
              {
                key: "openInApp",
                subMenuProps: {
                  items: [
                    {
                      key: "openInBrowser",
                      text: "Open in browser",
                      title: "Open in browser",
                      href:
                        selectedItems.length > 0 &&
                        selectedItems[0].selectedItemUrlOpenInBrowser,
                      target: "_blank",
                      ["data-interception"]: "off"
                    },
                    {
                      key: "openInApp",
                      text: "Open in app",
                      title: "Open in app",
                      href:
                        selectedItems.length > 0 &&
                        getOpentInLink(
                          selectedItems[0].selectedItemExt,
                          selectedListInternalName,
                          selectedItems[0].selectedItemName
                        )
                    }
                  ]
                },
                text: "Open",
                style: {
                  display:
                    selectedItems.length === 1 &&
                    selectedItems[0].selectedItemExt !== "aspx"
                      ? "inline-block"
                      : "none"
                }
              },
              {
                key: "divider_1",
                itemType: ContextualMenuItemType.Divider
              },
              {
                key: "share",
                text: "Share",
                onClick: () => setIsShareLinkDialog(true),
                style: {
                  display: selectedItems.length === 1 ? "inline-block" : "none"
                }
              },
              {
                key: "copyLink",
                text: "Copy link",
                onClick: () => setIsCopyLinkDialog(true),
                style: {
                  display: selectedItems.length === 1 ? "inline-block" : "none"
                }
              },
              {
                key: "alertMe",
                text: "Alert Me",
                onClick: () => setAlerMeDialog(true),
                style: {
                  display:
                    selectedItems.length === 1 &&
                    selectedItems[0].selectedItemExt !== "aspx"
                      ? "inline-block"
                      : "none"
                }
              },
              {
                key: "download",
                text: "Download",
                href:
                  selectedItems.length === 1 &&
                  dowloadSingleFile(selectedItems[0]),
                onClick:
                  selectedItems.length > 1
                    ? async () =>
                        await getZippedFiles(
                          selectedListInternalName,
                          selectedItems.map(i => i.selectedItemName)
                        )
                    : () => null,
                style: {
                  display: selectedItems.length > 0 ? "inline-block" : "none"
                }
              },
              {
                key: "feedback",
                text: "Feedback",
                onClick: () => setFeedbackForm(true),
                style: {
                  display:
                    feedbackForm &&
                    selectedItems.length > 0 &&
                    selectedItems[0].selectedItemExt !== "aspx"
                      ? "inline-block"
                      : "none"
                }
              }
            ]
          }}
          disabled={!selectedItems || selectedItems.length === 0}
          iconProps={{ iconName: "MoreVertical" }}
          styles={{
            root: {
              marginLeft: 10
            },
            icon: { color: "#808080", fontSize: 19 },
            iconHovered: { color: "#808080" },
            menuIcon: { display: "none" }
          }}
        />
        <div className="calloutArea" ref={contextualMneuDialogRef}>
          {isCopyLinkDialog && (
            <Callout
              gapSpace={0}
              target={contextualMneuDialogRef.current}
              onDismiss={() => setIsCopyLinkDialog(false)}
              setInitialFocus={true}
              isBeakVisible={false}
              directionalHint={DirectionalHint.bottomCenter}
            >
              <iframe
                style={{ width: "350px", height: "250px" }}
                src={copyLink(
                  selectedListId,
                  selectedItems[0].selectedItemId.toString()
                )}
                frameBorder={0}
              />
            </Callout>
          )}

          {isShareLinkDialog && (
            <Callout
              gapSpace={0}
              target={contextualMneuDialogRef.current}
              onDismiss={() => setIsShareLinkDialog(false)}
              setInitialFocus={true}
              isBeakVisible={false}
              directionalHint={DirectionalHint.bottomCenter}
            >
              <ShareLinkForm
                listId={selectedListId}
                itemId={selectedItems[0].selectedItemId.toString()}
              />
            </Callout>
          )}
        </div>

        {isAlerMeDialog && (
          <AlertMeForm
            isDialog={isAlerMeDialog}
            onDismiss={() => setAlerMeDialog(false)}
            link={alertMeLink(selectedListId, selectedItemId.toString())}
          />
        )}

        {isFeedbackForm && (
          <FeedbackForm
            isOpen={isFeedbackForm}
            onCloseForm={() => setFeedbackForm(false)}
            feedbackFormSettings={feedbackForm}
            docId={docId}
          />
        )}
      </div>
    );
  }
);
