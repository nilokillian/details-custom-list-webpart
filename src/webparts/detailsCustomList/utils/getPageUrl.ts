import SharePointService from "../services/SharePointService";

export const getPageUrl = (): string => {
  const tenantUri = window.location.protocol + "//" + window.location.host;
  const absoluteUrlBase = SharePointService.context.pageContext.web.absoluteUrl;
  const serverRequest =
    SharePointService.context.pageContext.site.serverRequestPath;
  const isWorkbench = serverRequest.includes("workbench");

  return isWorkbench
    ? absoluteUrlBase + serverRequest
    : tenantUri + serverRequest;
};
