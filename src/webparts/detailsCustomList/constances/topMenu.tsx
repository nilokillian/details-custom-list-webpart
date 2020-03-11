import * as React from "react";
import {
  ICommandBarItemProps,
  IContextualMenuItemProps
} from "office-ui-fabric-react";
import { exportToExcel } from "../utils/exportToExcel";
import { getDocTypeIcon } from "../styles/Icons";
import { getOpentInLink } from "../utils/openInLink";
import { dowloadSingleFile } from "../utils/dowloadSingleFile";
import { getZippedFiles } from "../utils/getZippedFiles";
import { ISelectedItem } from "../interfaces/ISelectedItem";

const getDisplayAttr = (selectedItems: ISelectedItem[]) => {
  return selectedItems.length === 1 &&
    selectedItems[0].selectedItemExt !== "aspx" &&
    selectedItems[0].selectedItemExt !== "url"
    ? "inline-block"
    : "none";
};

export const menuItems = (
  listId: string,
  viewId: string
): ICommandBarItemProps[] => [
  {
    key: "exportTo",
    text: "Export to Excel",
    cacheKey: "myCacheKey",
    style: {
      backgroundColor: "#fff"
    },
    href: exportToExcel(listId, viewId),
    iconProps: { iconName: "ExcelLogo" }
  }
];

export const activeMenuItems = (
  selectedListInternalName: string,
  activateFeedbackForm: boolean,
  onAlertMe: (value: boolean) => void,
  onCopyLink: (value: boolean) => void,
  onShareLink: (value: boolean) => void,
  onForm: (value: boolean) => void,
  selectedItems: ISelectedItem[]
): ICommandBarItemProps[] => [
  {
    key: "open",
    text: "Open",
    cacheKey: "myCacheKey",
    onRenderIcon: () => getDocTypeIcon(selectedItems[0].selectedItemExt),
    style: {
      backgroundColor: "#fff",
      display: getDisplayAttr(selectedItems)
    },
    onClick: () => onShareLink(true),
    subMenuProps: {
      contextualMenuItemAs: (props: IContextualMenuItemProps) => {
        return (
          <>
            {getDocTypeIcon(selectedItems[0].selectedItemExt)}
            <span>{props.item.text}</span>
          </>
        );
      },
      styles: { container: { overflow: "hidden" } },
      items: [
        {
          key: "openInbrowser",
          text: "Open in browser",
          href: selectedItems[0].selectedItemUrlOpenInBrowser,
          target: "_blank",
          ["data-interception"]: "off"
        },
        {
          key: "openInApp",
          text: "Open in app",
          href: getOpentInLink(
            selectedItems[0].selectedItemExt,
            selectedListInternalName,
            selectedItems[0].selectedItemName
          )
        }
      ]
    }
  },

  {
    key: "share",
    text: "Share",
    cacheKey: "myCacheKey",
    iconProps: { iconName: "Share" },
    style: {
      backgroundColor: "#fff",
      display: selectedItems.length === 1 ? "inline-block" : "none"
    },
    onClick: () => onShareLink(true)
  },

  {
    key: "copyLink",
    text: "Copy link",
    cacheKey: "myCacheKey",
    iconProps: { iconName: "Link" },
    style: {
      backgroundColor: "#fff",
      display: selectedItems.length === 1 ? "inline-block" : "none"
    },
    onClick: () => onCopyLink(true)
  },
  {
    key: "download",
    text: "Download",
    cacheKey: "myCacheKey",
    iconProps: { iconName: "Download" },
    style: { backgroundColor: "#fff" },
    href: selectedItems.length === 1 && dowloadSingleFile(selectedItems[0]),
    onClick:
      selectedItems.length > 1
        ? async () => await getZippedFiles(selectedItems)
        : () => null
  },

  {
    key: "alert",
    text: "Alert Me",
    cacheKey: "myCacheKey",
    iconProps: { iconName: "AlertSolid" },
    style: {
      backgroundColor: "#fff",
      display: getDisplayAttr(selectedItems)
    },
    onClick: () => onAlertMe(true)
  },

  {
    key: "feedback",
    text: "Feedback",
    cacheKey: "myCacheKey",
    iconProps: { iconName: "Feedback" },
    style: {
      backgroundColor: "#fff",
      display:
        activateFeedbackForm && selectedItems.length === 1
          ? "inline-block"
          : " none"
    },
    onClick: () => onForm(true)
  }
];
