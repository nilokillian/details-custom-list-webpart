import { IFeedbackForm } from "./IFeedbackForm";

export interface IFeedbackFormProps {
  feedbackFormSettings: IFeedbackForm;
  docId: string;
  isOpen: boolean;
  onCloseForm: () => void;
}
