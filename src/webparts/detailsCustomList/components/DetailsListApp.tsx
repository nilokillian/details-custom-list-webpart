import * as React from "react";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { initializeFileTypeIcons } from "@uifabric/file-type-icons";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";
import { SPItemsContextProvider } from "../contexts/SPItemsContext";
import { SPFieldsContextProvider } from "../contexts/SPFieldsContext";
import { AppSettingsContextProvider } from "../contexts/AppSettingsContext";
import { UrlQueryFilterContextProvider } from "../contexts/UrlQueryFilterContext";
import { DetailsListComponent } from "./DetailsListComponent";
import { FeedbackContextProvider } from "../contexts/FeedbackContext";
import { TopPanel } from "./TopPanel";
import { Footer } from "./Footer";

export const DetailsListApp: React.FC<IDetailsListAppProps> = (
  props
): JSX.Element => {
  React.useEffect(() => {
    initializeFileTypeIcons();
  }, []);

  const getJSX = () => {
    return props.selectedListTitle && props.selectedViewFields.length > 0 ? (
      <UrlQueryFilterContextProvider {...props}>
        <AppSettingsContextProvider {...props}>
          <SPFieldsContextProvider {...props}>
            <SPItemsContextProvider {...props}>
              <FeedbackContextProvider {...props}>
                <div className="appWrapper">
                  <TopPanel {...props} />
                  <DetailsListComponent {...props} />
                  {props.footer && <Footer />}
                </div>
              </FeedbackContextProvider>
            </SPItemsContextProvider>
          </SPFieldsContextProvider>
        </AppSettingsContextProvider>
      </UrlQueryFilterContextProvider>
    ) : (
      <Placeholder
        iconName="Edit"
        iconText="Configure Details List web part"
        description="Custom Details List."
        buttonLabel="Configure"
        onConfigure={props.onWebpartConfigure}
      />
    );
  };
  return getJSX();
};
