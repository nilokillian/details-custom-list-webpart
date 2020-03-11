import { UrlQueryParameterCollection } from "@microsoft/sp-core-library";

export interface IUrlQueryFilterContext {
  urlParams: UrlQueryParameterCollection;
  urlQueryActive: boolean;
}
