import * as React from "react";
import {
  PrimaryButton,
  TextField,
  Stack,
  IStackTokens,
  Panel,
  PanelType,
  Label,
  Separator,
  Image
} from "office-ui-fabric-react";
import SharePointService from "../services/SharePointService";
import { IFeedbackFormProps } from "../interfaces/IFeedbackFormProps";

const formImage: string = require("../images/FormResource.png");

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 2
};

export const FeedbackForm = ({
  isOpen,
  onCloseForm,
  feedbackFormSettings,
  docId
}: IFeedbackFormProps): JSX.Element => {
  const [feedback, seFeedback] = React.useState<string | undefined>(undefined);
  const _submitForm = async (e: any): Promise<void> => {
    e.preventDefault();
    const data = {
      [feedbackFormSettings.feedbackListFieldDocIdName]: docId,
      [feedbackFormSettings.feedbackListFieldName]: feedback
    };

    try {
      await SharePointService.pnp_addItem(
        feedbackFormSettings.feedbackListName,
        data
      );

      onCloseForm();
    } catch (error) {
      onCloseForm();
      throw error;
    }
  };

  const _onRenderFooterContent = () => {
    return (
      <Stack horizontal horizontalAlign="end">
        <PrimaryButton onClick={_submitForm} text="Save" disabled={!feedback} />
      </Stack>
    );
  };

  const _onRenderHeader = (): JSX.Element => {
    return (
      <Stack verticalAlign="center">
        <Image
          src={formImage}
          width={300}
          height={110}
          styles={{ root: { margin: "0 auto" } }}
        />
        <Label style={{ fontSize: 13, textAlign: "center", margin: 10 }}>
          Hi {SharePointService.context.pageContext.user.displayName}, when you
          submit this form, the owner will be able to see your name and email
          address.
        </Label>
        <Separator />
      </Stack>
    );
  };

  return (
    <Panel
      styles={{ headerText: { fontFamily: "Arial, Helvetica, sans-serif" } }}
      isOpen={isOpen}
      type={PanelType.custom}
      customWidth="520px"
      onDismiss={onCloseForm}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={_onRenderFooterContent}
      onRenderHeader={_onRenderHeader}
    >
      <form onSubmit={_submitForm}>
        <Stack tokens={itemAlignmentsStackTokens}>
          <Label>
            <p>
              Thank you for taking the time to submit feedback. Your name, email
              address and feedback will be sent to the relevant owner for
              consideration.
            </p>
            <p>
              Note: For all IT related issues, Australian users contact 1300 333
              000, New Zealand Users contact 0800 156 666 and Spotless Users
              Contact - AU - 1300 333 000, NZ - 0800 487 768
            </p>
          </Label>

          <TextField
            multiline
            rows={6}
            onChange={(e: any, newValue?: string) => seFeedback(newValue)}
            value={feedback}
            placeholder="Your comment"
          />
        </Stack>
      </form>
    </Panel>
  );
};
