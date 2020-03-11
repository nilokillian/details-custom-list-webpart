import SharePointService from "../services/SharePointService";
import { getAppPrefix } from "./appPrefix";

export const getOpentInLink = (
  fileExtension: string,
  listInternalName: string,
  fileName: string
) => {
  const baseUrl: string = SharePointService.context.pageContext.web.absoluteUrl;

  return `${getAppPrefix(
    fileExtension
  )}${baseUrl}/${listInternalName}/${fileName}`;
};
