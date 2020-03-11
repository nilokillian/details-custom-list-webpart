import SharePointService from "../services/SharePointService";

export const shareLink = (listId: string, listItemId: string): string => {
  const baseUrl: string = SharePointService.context.pageContext.web.absoluteUrl;

  return `${baseUrl}/_layouts/15/sharedialog.aspx?listId={${listId}}&listItemId=${listItemId}&clientId=listPart&ma=0`;
};

///return `${baseUrl}/_layouts/15/sharedialog.aspx?listId={${listId}}&listItemId=${listItemId}&clientId=sharePoint&ma=1`;
