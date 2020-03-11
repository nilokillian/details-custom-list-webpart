import * as React from "react";
import { createContext, useState, useEffect } from "react";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";
import { IAppSettingsContext } from "../interfaces/IAppSettingsContext";
import SharePointService from "../services/SharePointService";

export const AppSettingsContext = createContext<IAppSettingsContext>(
  {} as IAppSettingsContext
);

export const AppSettingsContextProvider: React.FC<IDetailsListAppProps> = props => {
  const [detailsListSize, setDetailsListSize] = useState<string>();
  const [userHasFullControl, setUserHasFullControl] = useState(false);
  const { selectedDetailsListSize } = props;

  useEffect(() => {
    setDetailsListSize(selectedDetailsListSize);
  }, [selectedDetailsListSize]);

  useEffect(() => {
    SharePointService.pnp_getCurrentUserPermissions().then(res => {
      setUserHasFullControl(res);
    });
  }, []);

  return (
    <AppSettingsContext.Provider
      value={{ detailsListSize, userHasFullControl }}
    >
      {props.children}
    </AppSettingsContext.Provider>
  );
};
