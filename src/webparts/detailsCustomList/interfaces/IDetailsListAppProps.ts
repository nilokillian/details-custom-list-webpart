import { UrlQueryParameterCollection } from "@microsoft/sp-core-library";
import { IFeedbackForm } from "./IFeedbackForm";
import { IViewField, ISortByField } from "./IWebPartMappers";

export interface IDetailsListAppProps {
  selectedListId: string;
  selectedFoldersPaths: string[];
  selectedViewId: string;
  selectedListTitle: string;
  selectedViewTitle: string;
  selectedViewCamlQuery: string;
  selectedViewFields: IViewField[];
  selectedSortByFields: ISortByField[];
  urlParams?: UrlQueryParameterCollection;
  urlQueryActive: boolean;
  feedbackForm?: IFeedbackForm | undefined;
  onWebpartConfigure: () => void;
  selectedDetailsListSize: string;
  footer: boolean;
}
