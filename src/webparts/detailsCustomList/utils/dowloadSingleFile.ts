import SharePointService from "../services/SharePointService";
import { ISelectedItem } from "../interfaces/ISelectedItem";

export const dowloadSingleFile = (item: ISelectedItem) => {
  const base = SharePointService.context.pageContext.web.absoluteUrl;

  return item.selectedItemExt === "aspx"
    ? `${base}/_layouts/15/download.aspx?UniqueId=${item.selectedItemUniqueId}`
    : item.selectedItemUrlDownload;
};
