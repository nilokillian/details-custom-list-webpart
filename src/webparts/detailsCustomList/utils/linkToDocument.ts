import SharePointService from "../services/SharePointService";

export const linkToDocument = (
  listId: string,
  listInternalName: string
): string => {
  const baseUrl: string = SharePointService.context.pageContext.web.absoluteUrl;
  const serverRelativeUrl =
    SharePointService.context.pageContext.web.serverRelativeUrl;

  return `${baseUrl}/_layouts/15/NewLink.aspx?List=${listId}&RootFolder=${serverRelativeUrl}/${listInternalName}&ContentTypeId=0x01010A00ACFE190000BE6F4BB99824B01BCB6931&Source=${baseUrl}/SitePages/OandBProcessDocs.aspx`;
};
