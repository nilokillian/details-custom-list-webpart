import { useState, useEffect } from "react";

export const useIFrameContext = (
  selector = "ctl00_PlaceHolderMain_ctl00_RptControls_BtnCreateAlerttop"
): HTMLElement => {
  const [iframeElement, setIframeElement] = useState<HTMLElement>();
  let _currentElement: HTMLElement;
  const getElement = () => {
    const waitForSelector = (_selector: HTMLElement, callback: Function) => {
      selector
        ? callback()
        : setTimeout(() => {
            _currentElement = _selector;
          }, 400);
    };

    if (window.document.getElementById(selector)) {
      _currentElement = window.document.getElementById(selector);
    } else {
      waitForSelector(window.document.getElementById(selector), () => {
        _currentElement = window.document.getElementById(selector);
      });
    }

    return _currentElement;
  };

  useEffect(() => {
    setIframeElement(getElement());
  }, [_currentElement]);
  return iframeElement;
};
