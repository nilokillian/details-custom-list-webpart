import * as React from "react";
import { createContext, useState, useEffect, useContext } from "react";
import SharePointService from "../services/SharePointService";
import { IListItem } from "../interfaces/ISharePoint";
import { itemsMapper, itemsReMapper } from "../mappers/SPItemsContextMapper";
import { SPFieldsContext } from "./SPFieldsContext";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";

export interface ISPItemsContext {
  listItems: IListItem[];
  selectedItems: ISelectedItem[];
  setSelectedItems: (selectedItems: ISelectedItem[]) => void;
  clearSelection: boolean;
  setClearSelection: (value: boolean) => void;
  queryUrlFilterGroupByField: string;
  setQueryUrlFilterGroupByField: (value: string) => void;
}

export interface ISelectedItem {
  selectedItemId: string | number;
  selectedItemName: string;
  serverRelativeUrl: string;
  selectedItemUrlDownload: string;
  selectedItemUrlOpenInBrowser: string;
  selectedItemDocId: string;
  selectedItemExt: string;
  selectedItemUniqueId: string;
}

export const SPItemsContext = createContext<ISPItemsContext>(
  {} as ISPItemsContext
);

export const SPItemsContextProvider: React.FC<IDetailsListAppProps> = (
  props
): JSX.Element => {
  const {
    selectedListTitle,
    selectedViewCamlQuery,
    selectedFoldersPaths
  } = props;
  const [listItems, setListItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<ISelectedItem[]>([]);
  const [queryUrlFilterGroupByField, setQueryUrlFilterGroupByField] = useState<
    string
  >("");
  const { viewFields, selectedListId } = useContext(SPFieldsContext);

  const [clearSelection, setClearSelection] = useState(false);

  const getListItemsByCamlQuery = async (): Promise<void> => {
    const itemsResult = await SharePointService.pnp_getListItemsByCamlQuery(
      selectedListId,
      selectedViewCamlQuery,
      ["File"],
      selectedFoldersPaths
    );

    const reMappedItems = itemsReMapper(itemsResult);
    const mappedItems = itemsMapper(reMappedItems, viewFields);

    setListItems(mappedItems);
  };

  //fetch items from SP, re-fetching when dependencies changed
  useEffect(() => {
    if (selectedListTitle && selectedFoldersPaths && selectedViewCamlQuery) {
      getListItemsByCamlQuery();
    }
  }, [selectedListTitle, selectedFoldersPaths, selectedViewCamlQuery]);

  return (
    <React.Fragment>
      {listItems.length > 0 && (
        <SPItemsContext.Provider
          value={{
            listItems,
            selectedItems,
            setSelectedItems,
            clearSelection,
            setClearSelection,
            queryUrlFilterGroupByField,
            setQueryUrlFilterGroupByField
          }}
        >
          {props.children}
        </SPItemsContext.Provider>
      )}
    </React.Fragment>
  );
};
