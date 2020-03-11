import { zipFiles } from "./zipFiles";
import SharePointService from "../services/SharePointService";
import { ISelectedItem } from "../interfaces/ISelectedItem";
import { IFile } from "../services/interfaces";

export const getZippedFiles = async (files: ISelectedItem[]): Promise<void> => {
  const res = await SharePointService.pnp_getLibraryFileBlob(
    files.map(
      f => ({ name: f.selectedItemName, url: f.serverRelativeUrl } as IFile)
    )
  );
  zipFiles(res);
};
