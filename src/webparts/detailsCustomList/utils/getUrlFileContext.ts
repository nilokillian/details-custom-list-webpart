import SharePointService from "../services/SharePointService";

export const getUrlFileContext = async (
  relativeUrl: string
): Promise<string> => {
  const result = await SharePointService.getListFileContent(relativeUrl);

  const url = result
    .split("=")
    .slice(1)
    .join("=");

  return url;
};
