import { ILinkStyles, mergeStyleSets } from "office-ui-fabric-react";

export const linkStyle = (): Partial<ILinkStyles> => {
  const customStyle: Partial<ILinkStyles> = {};

  customStyle.root = {
    color: "#333333",
    selectors: {
      ["&:hover"]: {
        color: "#333333",
        textDecoration: "none"
      }
    }
  };

  return customStyle;
};

export const iconClassNames = mergeStyleSets({
  fileIconCell: {
    display: "flex"
  },
  fileIconImg: {
    verticalAlign: "middle",
    maxHeight: "16px",
    maxWidth: "16px"
  }
});

export const checkMarkStyle = () => ({
  root: { backgroundColor: "#599b00", fontSize: 50 }
});

export const addAddLinkIconStyle = () => ({
  root: { height: 30, verticalAlign: "sub" }
});
