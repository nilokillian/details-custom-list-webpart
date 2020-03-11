import { IListItem } from "./ISharePoint";
import { ISelectedItem } from "../contexts/SPItemsContext";

export interface ISPItemsContext {
  listItems: IListItem[];
  selectedItems: ISelectedItem[];
  setSelectedItems: (selectedItems: ISelectedItem[]) => void;
  clearSelection: boolean;
  setClearSelection: (value: boolean) => void;
  queryUrlFilterGroupByField: string;
  setQueryUrlFilterGroupByField: (value: string) => void;
}
