import * as React from "react";
import {
  CommandBar,
  ICommandBarStyles,
  Separator,
  Callout,
  DirectionalHint,
  Stack,
  ActionButton
} from "office-ui-fabric-react";
import { SPItemsContext } from "../contexts/SPItemsContext";
import { SPFieldsContext } from "../contexts/SPFieldsContext";
import { FeedbackContext } from "../contexts/FeedbackContext";
import { AlertMeForm } from "./AlertMeForm";
import { FeedbackForm } from "./FeedbackForm";
import { ShareLinkForm } from "../components/ShareLinkForm";
import { menuItems, activeMenuItems } from "../constances/topMenu";
import { copyLink } from "../utils/copyLink";
import { alertMeLink } from "../utils/alertMeLink";

export const topMenuStyles = (): ICommandBarStyles => {
  const customStyle: ICommandBarStyles = {} as ICommandBarStyles;
  customStyle.root = { backgroundColor: "#fff" };
  return customStyle;
};

export const TopPanel = (props): JSX.Element => {
  const topPanelDialogRef = React.useRef();
  const { feedbackForm } = React.useContext(FeedbackContext);
  const [isCopyLinkDialog, setIsCopyLinkDialog] = React.useState(false);
  const [isShareLinkDialog, setIsShareLinkDialog] = React.useState(false);
  const [isAlertMeDialog, setIsAlertMeDialog] = React.useState(false);
  const [isFeedBackForm, setIsFeedBackForm] = React.useState(false);
  const {
    selectedItems,
    setSelectedItems,
    setClearSelection
  } = React.useContext(SPItemsContext);
  const { viewId, selectedListId, selectedListInternalName } = React.useContext(
    SPFieldsContext
  );

  return (
    <>
      <Stack horizontal disableShrink>
        <Stack.Item grow={5}>
          <CommandBar
            items={
              selectedItems.length > 0
                ? activeMenuItems(
                    selectedListInternalName,
                    feedbackForm ? feedbackForm.activateFeedbackForm : false,
                    setIsAlertMeDialog,
                    setIsCopyLinkDialog,
                    setIsShareLinkDialog,
                    setIsFeedBackForm,
                    selectedItems
                  )
                : menuItems(selectedListId, viewId)
            }
            styles={topMenuStyles}
          />
        </Stack.Item>
        <Stack.Item grow={1}>
          {selectedItems.length > 0 && (
            <ActionButton
              iconProps={{ iconName: "Cancel" }}
              onClick={() => {
                setSelectedItems([]);
                setClearSelection(true);
              }}
            >
              {selectedItems.length} selected
            </ActionButton>
          )}
        </Stack.Item>
      </Stack>
      {isFeedBackForm && (
        <FeedbackForm
          isOpen={isFeedBackForm}
          onCloseForm={() => setIsFeedBackForm(false)}
          feedbackFormSettings={feedbackForm}
          docId={selectedItems[0].selectedItemDocId}
        />
      )}
      <div className="calloutArea" ref={topPanelDialogRef}>
        {isCopyLinkDialog && (
          <Callout
            gapSpace={0}
            target={topPanelDialogRef.current}
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
            target={topPanelDialogRef.current}
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

        {isAlertMeDialog && (
          <AlertMeForm
            onDismiss={() => setIsAlertMeDialog(false)}
            isDialog={isAlertMeDialog}
            link={alertMeLink(
              selectedListId,
              selectedItems[0].selectedItemId.toString()
            )}
          />
        )}
      </div>
      <Separator />
    </>
  );
};
