import * as React from "react";
import * as moment from "moment";
import {
  IDetailsListProps,
  IDetailsRowStyles,
  DetailsRow,
  IColumn,
  Stack
} from "office-ui-fabric-react";
import { IListItem } from "../interfaces/ISharePoint";
import {
  getDocTypeIcon,
  getCategoryIcon,
  getIconByFieldType
} from "../styles/Icons";
import { ContextualMenuComponent } from "./ContextualMenuComponent";
import { getFileExtension } from "../utils/getFileExtension";
import { getUrlFileContext } from "../utils/getUrlFileContext";

export const onItemInvoked = async (item: any): Promise<void> => {
  const ext = getFileExtension(item.Name);

  let link = item.LinkingUri ? item.LinkingUri : item.ServerRelativeUrl;

  if (ext === "url") {
    link = await getUrlFileContext(item.ServerRelativeUrl);
  } else {
    link = item.LinkingUri ? item.LinkingUri : item.ServerRelativeUrl;
  }
  window.open(link, "_blank");
};

export const onFileNameClick = async (item: any) => {
  const ext = getFileExtension(item.Name);

  let link = item.LinkingUri ? item.LinkingUri : item.ServerRelativeUrl;

  if (ext === "url") {
    link = await getUrlFileContext(item.ServerRelativeUrl);
  } else {
    link = item.LinkingUri ? item.LinkingUri : item.ServerRelativeUrl;
  }
  window.open(link, "_blank");
};

export const onRenderRow: IDetailsListProps["onRenderRow"] = props => {
  const customStyles: Partial<IDetailsRowStyles> = {};

  if (props) {
    customStyles.root = { maxHeight: 35 };
    customStyles.cell = { fontSize: 14, display: "flex", alignItems: "center" };
    customStyles.checkCell = { display: "flex", alignItems: "center" };
    return <DetailsRow {...props} styles={customStyles} />;
  }
  return null;
};

export const onRenderItemColumn = (
  item: any,
  _index: number,
  column: IColumn
): JSX.Element => {
  const fieldContent = item[column.fieldName as keyof IListItem] as string;
  const ext = getFileExtension(item.Name);

  switch (column.name) {
    case "Type":
      return getDocTypeIcon(ext);
    case "Name":
      return (
        <span data-selection-disabled={true}>
          <Stack horizontal>
            <Stack verticalAlign="center">
              <span
                style={{ cursor: "pointer" }}
                onClick={async () => await onFileNameClick(item)}
              >
                {item.Name}
              </span>
              {/* <Link
                data-interception="off"
                href={ onFileNameClick(item).then(r=>{return Promise.resolve(r)})
                  // item.LinkingUri ? item.LinkingUri : item.ServerRelativeUrl
                }
                target="_blank"
                styles={linkStyle}
              >
                {item.Name}
              </Link> */}
            </Stack>
            <ContextualMenuComponent
              selectedItemId={item.Id}
              docId={item.DocId}
            />
          </Stack>
        </span>
      );
    default:
      if (column["fieldType"] === "URL" && fieldContent) {
        return (
          <Stack horizontal horizontalAlign="center">
            <Stack verticalAlign="center">
              {getIconByFieldType("URL", fieldContent)}
            </Stack>
          </Stack>
        );
      } else if (column["fieldType"] === "DateTime" && fieldContent) {
        const d = moment(fieldContent).format("MMMM Do , YYYY");
        return <span>{d}</span>;
      } else {
        return (
          <Stack horizontal horizontalAlign="center">
            <Stack verticalAlign="center">
              {getCategoryIcon(fieldContent)}
            </Stack>
          </Stack>
        );
      }
  }
};
