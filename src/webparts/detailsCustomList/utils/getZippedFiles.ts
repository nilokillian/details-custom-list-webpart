import { zipFiles } from "./zipFiles";
import SharePointService from "../services/SharePointService";

const callFlow = async (listTitle: string, fileNames: string[]) => {
  const requestHeaders: Headers = new Headers();
  console.log("callFlow");
  requestHeaders.append("Content-type", "application/json");

  const body = JSON.stringify({
    url: SharePointService.context.pageContext.web.absoluteUrl,
    listTitle: listTitle,
    fileNames: fileNames
  });

  const httpClientOptions = {
    headers: requestHeaders,
    body: body
  };
  const flowUrl =
    "https://prod-00.australiasoutheast.logic.azure.com:443/workflows/5b72e79ef90549cb87a66ce060f0c242/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jM4v1brod2Yr2ZLhS_xBV2ANMetCfY803rkv2VP_3nc";

  const res = await SharePointService.post_flow(flowUrl, httpClientOptions);

  console.log("res", res);
};

export const getZippedFiles = async (
  listName: string,
  items: string[]
): Promise<void> => {
  callFlow(listName, items);
  // const res = await SharePointService.pnp_getLibraryFileBlobinBatch(
  //   listName,
  //   items
  // );
  // zipFiles(res);
};
