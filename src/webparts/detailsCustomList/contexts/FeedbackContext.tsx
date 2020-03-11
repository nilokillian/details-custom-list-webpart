import * as React from "react";
import { createContext, useState, useEffect } from "react";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";
import { IFeedbackContext } from "../interfaces/IFeedbackContext";
import { IFeedbackForm } from "../interfaces/IFeedbackForm";

export const FeedbackContext = createContext<IFeedbackContext>(
  {} as IFeedbackContext
);

export const FeedbackContextProvider: React.FC<IDetailsListAppProps> = props => {
  const [feedbackForm, setFeedbackForm] = useState<IFeedbackForm>();

  useEffect(() => {
    setFeedbackForm(props.feedbackForm);
  }, [props.feedbackForm]);

  return (
    <FeedbackContext.Provider value={{ feedbackForm }}>
      {props.children}
    </FeedbackContext.Provider>
  );
};
