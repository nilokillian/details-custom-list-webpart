import { IViewField, ISortByField } from "./IWebPartMappers";

export interface ISPFieldsContext {
  selectedListId: string;
  viewId: string;
  selectedListInternalName: string;
  viewFields: IViewField[];
  sortByFields: ISortByField[];
}
