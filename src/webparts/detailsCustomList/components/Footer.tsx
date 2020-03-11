import * as React from "react";
import { Stack, Separator } from "office-ui-fabric-react";
import { getCategoryIcon } from "../styles/Icons";
import styles from "../styles/DetailsList.module.scss";

export const Footer = (): JSX.Element => {
  return (
    <React.Fragment>
      <Separator />
      <Stack horizontal horizontalAlign="start" style={{ marginTop: 30 }}>
        <div className={styles.footerBlock}>
          {getCategoryIcon("Mandatory")}
          <span> - Must be completed</span>
        </div>
        <div className={styles.footerBlock}>
          {getCategoryIcon("By Discretion")}
          <span> - Can be omitted at the discretion of the Bid Board</span>
        </div>
        <div className={styles.footerBlock}>
          {getCategoryIcon("Optional")}
          <span>
            - Not mandatory, however the Bid Board can request it be completed
          </span>
        </div>
      </Stack>
    </React.Fragment>
  );
};
