import SharePointService from "../services/SharePointService";

export const copyLink = (listId: string, listItemId: string): string => {
  const baseUrl: string = SharePointService.context.pageContext.web.absoluteUrl;

  return `${baseUrl}/_layouts/15/sharedialog.aspx?listId={${listId}}&listItemId=${listItemId}&clientId=listPart&mode=copy&ma=0`;
};
