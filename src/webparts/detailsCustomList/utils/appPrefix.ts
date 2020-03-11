const appExtensionPrefixes = [
  { name: "doc", prefix: "ms-word:ofe|u|" },
  { name: "docx", prefix: "ms-word:ofe|u|" },
  { name: "dotx", prefix: "ms-word:ofe|u|" },
  { name: "pptx", prefix: "ms-powerpoint:ofe|u|" },
  { name: "csv", prefix: "ms-excel:ofe|ofc|u|" },
  { name: "xls", prefix: "ms-excel:ofe|ofc|u|" },
  { name: "xlsx", prefix: "ms-excel:ofe|ofc|u|" }
];

export const getAppPrefix = (extension: string): string => {
  const currentAppExtensionPrefix = appExtensionPrefixes.find(
    ext => ext.name === extension
  );

  if (currentAppExtensionPrefix) {
    return currentAppExtensionPrefix.prefix;
  }

  return "";
};
