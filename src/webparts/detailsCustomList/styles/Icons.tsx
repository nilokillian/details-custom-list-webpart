import * as React from "react";
import {
  getFileTypeIconProps,
  FileTypeIconSize
} from "@uifabric/file-type-icons";
import { Icon, IconButton } from "office-ui-fabric-react";

const FILE_ICONS: { name: string }[] = [
  { name: "accdb" },
  { name: "csv" },
  { name: "docx" },
  { name: "dotx" },
  { name: "mpt" },
  { name: "odt" },
  { name: "one" },
  { name: "onepkg" },
  { name: "onetoc" },
  { name: "pptx" },
  { name: "pub" },
  { name: "vsdx" },
  { name: "xls" },
  { name: "xlsx" },
  { name: "xsn" }
];

const CATEGORY_ICONS: { name: string; icons: string[] }[] = [
  { name: "Mandatory", icons: ["CheckMark"] },
  { name: "Optional", icons: ["LocationCircle"] },
  { name: "By Discretion", icons: ["CheckMark", "Asterisk"] }
];

const FIELD_TYPE_ICONS: { name: string; icon: string }[] = [
  { name: "URL", icon: "FlowChart" }
];

export const getIconByFieldType = (fieldType: string, value: string) => {
  const currentType = FIELD_TYPE_ICONS.find(type => type.name === fieldType);

  const getJSXEl = (): JSX.Element => {
    return (
      <div>
        <IconButton
          iconProps={{ iconName: currentType.icon }}
          href={value}
          target="_blank"
          data-interception="off"
          styles={{
            icon: { color: "#1990cc", fontSize: "x-large" }
          }}
        />
      </div>
    );
  };
  return currentType ? getJSXEl() : fieldType;
};

export const getCategoryIcon = (value: string): JSX.Element | any => {
  const currentCat = CATEGORY_ICONS.find(cat => cat.name === value);
  const getJSXEl = (): JSX.Element => {
    return (
      <div>
        {currentCat.icons.map(icon => (
          <Icon
            iconName={icon}
            styles={{ root: { fontWeight: 600, fontSize: "medium" } }}
          />
        ))}
      </div>
    );
  };
  return currentCat ? getJSXEl() : value;
};

export const getDocTypeIcon = (
  extension: string,
  iconSize = 16 as FileTypeIconSize
): JSX.Element => {
  return (
    <Icon
      styles={{
        root: {
          height: "auto",
          marginTop: 0,
          marginRight: 8,
          maxHeight: 25,
          verticalAlign: "middle",
          display: "inline-block"
        },
        imageContainer: { maxHeight: 16, maxWidth: 16 }
      }}
      {...getFileTypeIconProps({
        extension,
        size: iconSize,
        imageFileType: "png"
      })}
    />
  );
};
