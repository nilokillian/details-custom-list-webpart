export const getFileExtension = (stringInput: string) => {
  const ext: string[] = stringInput.split(".");

  return ext[ext.length - 1];
};
