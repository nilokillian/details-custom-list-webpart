import * as React from "react";
import { Modal, Spinner, SpinnerSize } from "office-ui-fabric-react";

export interface IAlertMeFormProps {
  link: string;
  isDialog: boolean;
  onDismiss: () => void;
}

export const AlertMeForm: React.FC<IAlertMeFormProps> = ({
  isDialog,
  onDismiss,
  link
}): JSX.Element => {
  const [iframeRef, setIframeRef] = React.useState();
  const [aspnetForm, setAspnetForm] = React.useState();

  const onDismissTimer = () => {
    setAspnetForm(null);
    setTimeout(() => {
      onDismiss();
    }, 4000);
  };
  React.useEffect(() => {
    setIframeRef(iframeRef);
  }, [iframeRef]);

  const iframeOnLoad = (): void => {
    try {
      const currentFrameElm = iframeRef.contentWindow.frameElement;
      const formSubmitBtn = iframeRef.contentWindow.document.getElementById(
        "ctl00_PlaceHolderMain_ctl00_RptControls_BtnCreateAlerttop"
      );

      setAspnetForm(formSubmitBtn);
      if (formSubmitBtn) currentFrameElm.cancelPopUp = onDismiss;

      if (formSubmitBtn)
        formSubmitBtn.addEventListener("click", onDismissTimer);
    } catch (err) {
      if (err.name !== "SecurityError") {
        throw err;
      }
    }
  };

  return (
    <Modal
      isOpen={isDialog}
      titleAriaId="AlerMe"
      onDismiss={onDismiss}
      styles={{ scrollableContent: { margin: 20 } }}
    >
      {!aspnetForm && <Spinner size={SpinnerSize.large} />}
      <iframe
        ref={setIframeRef}
        onLoad={iframeOnLoad}
        style={{ width: "600px", height: "850px" }}
        src={link}
        frameBorder={0}
      />
    </Modal>
  );
};
