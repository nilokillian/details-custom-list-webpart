import SharePointService from "../services/SharePointService";

export const newDocument = (libName: string) => {
  const baseUrl: string = SharePointService.context.pageContext.web.absoluteUrl;

  return `ms-word:nft|u|${baseUrl}/${libName}/Forms/template.dotx|s|${baseUrl}/${libName}`;
};
