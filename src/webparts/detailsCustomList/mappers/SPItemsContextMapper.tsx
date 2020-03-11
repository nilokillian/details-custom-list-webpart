export const itemsReMapper = (items: any[]): any[] => {
  return items.map(item => {
    const obj = {
      DocumentId: item["OData__dlc_DocId"],
      ...item,
      ...item.File
    };
    delete obj.File;

    return obj;
  });
};

export const removeFolders = (items: any): any[] => {
  return items.filter((i: any) => i.FileSystemObjectType === 0);
};

export const itemsMapper = (items: any, fields: any[]): any[] => {
  const mappedItems = [];
  const itemsWithNoFolders = removeFolders(items);
  itemsWithNoFolders.map((item: any) => {
    let currentItem = item;

    fields.map(field => {
      switch (field.fieldType) {
        case "Text":
          currentItem = {
            ...currentItem,
            [field.internalName]: item[field.internalName]
          };
          break;
        case "URL":
          currentItem = {
            ...currentItem,
            [field.internalName]: item[field.internalName]
              ? item[field.internalName].Url
              : ""
          };
          break;
        default:
          currentItem = {
            ...currentItem,
            [field.internalName]: item[field.internalName]
          };
          break;
      }
    });

    mappedItems.push(currentItem);
  });

  return mappedItems;
};
