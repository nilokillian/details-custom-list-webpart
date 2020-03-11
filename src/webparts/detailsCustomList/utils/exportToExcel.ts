import SharePointService from "../services/SharePointService";

export const exportToExcel = (listId: string, viewId: string): string => {
  const baseUrl: string = SharePointService.context.pageContext.web.absoluteUrl;
  return `${baseUrl}/_vti_bin/owssvr.dll?CS=109&Using=_layouts/query.iqy&List=${listId}&View=${viewId}&CacheControl=1`;
};
