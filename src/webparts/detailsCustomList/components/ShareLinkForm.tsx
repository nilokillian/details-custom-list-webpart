import * as React from "react";

export interface IShareLinkFormProps {
  listId: string;
  itemId: string;
}
import { shareLink } from "../utils/shareLink";

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
