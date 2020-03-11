import * as JSZip from "jszip";
import * as FileSaver from "file-saver";
import { IFileBlob } from "../services/SharePointService";

export const zipFiles = (files: IFileBlob[]) => {
  const zip: JSZip = new JSZip();

  for (const file of files) {
    zip.file(file.fileName, file.fileContext);
  }
  zip
    .generateAsync({ type: "blob" })
    .then(c => FileSaver.saveAs(c, "Documents.zip"));
};
