import { IColumn } from "office-ui-fabric-react";
import { sortBy } from "lodash";
import { IViewField } from "../interfaces/IWebPartMappers";
import { IDefaultColumnsWidth } from "../interfaces/IDefaultColumnsWidth";

export const columnSizemapper = (
  columnName: string,
  defaultColumnsWidth: IDefaultColumnsWidth
): number => {
  switch (columnName) {
    case "Type":
      return defaultColumnsWidth.docIconColumnsSize;

    case "Name":
      return defaultColumnsWidth.nameColumnsSize;

    case "Document Type":
      return defaultColumnsWidth.documentTypeColumnsSize;

    case "Modified":
      return defaultColumnsWidth.modifiedColumnsSize;

    default:
      return 85;
  }
};

export const columnsMapper = (
  fields: IViewField[],
  defaultColumnsWidth: IDefaultColumnsWidth
): IColumn[] => {
  const columns: IColumn[] = fields.map(field => {
    const obj = {
      key:
        field.internalName === "LinkFilenameNoMenu" ||
        field.internalName === "LinkFilename"
          ? "Name"
          : field.internalName,
      name: field.title,
      fieldName:
        field.internalName === "LinkFilenameNoMenu" ||
        field.internalName === "LinkFilename"
          ? "Name"
          : field.internalName,
      minWidth: 50,
      maxWidth: columnSizemapper(field.title, defaultColumnsWidth),
      isResizable: true,
      iconName: field.title === "Type" ? "Page" : "",
      isIconOnly: field.title === "Type",
      fieldType: field.fieldType
    } as IColumn;

    return obj;
  });
  return columns;
};

export const getValueByField = (
  item: any,
  field: string
): string | number | undefined =>
  item[field] ? item[field] : item["OData_" + field];

export const checkODataField = (items: any[], field: string): string => {
  const isOdata = items.some(i => i["OData_" + field]);

  return isOdata ? "OData_" + field : field;
};

export const sortedItemsByGroups = (items: any[], sortByFields: any[]) => {
  const sortedItems = sortBy(
    items,
    sortByFields.map(s => s.internalName)
  );

  return sortedItems;
};
