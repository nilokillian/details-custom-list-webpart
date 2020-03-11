import * as React from "react";
import { createContext, useState, useEffect } from "react";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";
import { ISPFieldsContext } from "../interfaces/ISPFieldsContext";
import { ISortByField, IViewField } from "../interfaces/IWebPartMappers";
import { IRootFolder } from "../interfaces/IRootFolder";
import SharePointService from "../services/SharePointService";

export const SPFieldsContext = createContext<ISPFieldsContext>(
  {} as ISPFieldsContext
);

export interface ISPFieldsContextProviderProps {
  selectedListId: string;
  selectedListTitle: string;
  selectedListInternalName: string;
  selectedViewId: string;
  selectedSortByFields: IViewField[];
  selectedGroupByFields: string[];
  selectedViewFields: string[];
}

export const SPFieldsContextProvider: React.FC<IDetailsListAppProps> = props => {
  const [viewId, setViewId] = useState<string>("");
  const [viewFields, setViewFields] = useState<IViewField[] | any[]>([]);
  const [sortByFields, setSortByFields] = useState<ISortByField[] | any[]>([]);

  const [selectedListInternalName, setSelectedListInternalName] = useState("");

  const {
    selectedViewFields,
    selectedSortByFields,
    selectedListId,
    selectedViewId,
    selectedListTitle
  } = props;

  const getLibraryRootFolderName = async (listTitle: string): Promise<void> => {
    const result: IRootFolder = await SharePointService.pnp_getLibraryRootFolder(
      listTitle
    );
    setSelectedListInternalName(result.Name);
  };

  useEffect(() => {
    if (selectedListTitle) getLibraryRootFolderName(selectedListTitle);
  }, [selectedListTitle]);

  useEffect(() => {
    setViewFields(selectedViewFields);
  }, [selectedViewFields]);

  useEffect(() => {
    setSortByFields(selectedSortByFields);
  }, [selectedSortByFields]);

  useEffect(() => {
    setViewId(selectedViewId);
  }, [selectedViewId]);

  return (
    <SPFieldsContext.Provider
      value={{
        viewId,
        viewFields,
        sortByFields,
        selectedListInternalName,
        selectedListId
      }}
    >
      {viewFields && viewFields.length > 0 && props.children}
    </SPFieldsContext.Provider>
  );
};
