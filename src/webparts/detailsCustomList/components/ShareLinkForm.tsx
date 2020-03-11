import * as React from "react";
import { shareLink } from "../utils/shareLink";
import { IShareLinkFormProps } from "../interfaces/IShareLinkFormProps";

export const ShareLinkForm: React.FC<IShareLinkFormProps> = ({
  listId,
  itemId
}): JSX.Element => {
  return (
    <iframe
      style={{ width: "350px", height: "450px" }}
      src={shareLink(listId, itemId)}
      frameBorder={0}
    />
  );
};
