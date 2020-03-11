import * as React from "react";
import { createContext, useState, useEffect } from "react";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";
import { IUrlQueryFilterContext } from "../interfaces/IUrlQueryFilterContext";
import { UrlQueryParameterCollection } from "@microsoft/sp-core-library";

export const UrlQueryFilterContext = createContext<IUrlQueryFilterContext>(
  {} as IUrlQueryFilterContext
);

export const UrlQueryFilterContextProvider: React.FC<IDetailsListAppProps> = props => {
  const [urlParams, setUrlParam] = useState<UrlQueryParameterCollection>();
  const [urlQueryActive, setUrlQueryActive] = useState<boolean>(false);

  useEffect(() => {
    setUrlParam(props.urlParams);
  }, [props.urlParams]);

  useEffect(() => {
    setUrlQueryActive(props.urlQueryActive);
  }, [props.urlQueryActive]);

  return (
    <UrlQueryFilterContext.Provider value={{ urlParams, urlQueryActive }}>
      {props.children}
    </UrlQueryFilterContext.Provider>
  );
};
