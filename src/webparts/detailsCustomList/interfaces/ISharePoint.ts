export interface IList {
  Id: string;
  Title: string;
  EntityTypeName: string;
}

export interface IView {
  BaseViewId: string;
  ContentTypeId: { StringValue: string };
  DefaultView: boolean;
  EditorModified: boolean;
  Hidden: boolean;
  HtmlSchemaXml: string;
  Id: string;
  ImageUrl: string;
  IncludeRootFolder: false;
  JSLink: string;
  ListViewXml: string;
  OrderedView: boolean;
  Paged: boolean;
  PersonalView: boolean;
  ReadOnlyView: boolean;
  RequiresClientIntegration: boolean;
  RowLimit: number;
  Scope: number;
  ServerRelativePath: { DecodedUrl: string };
  ServerRelativeUrl: string;
  Threaded: boolean;
  Title: string;
  ViewData: string;
  ViewQuery: string;
  ViewType: string;
}

export interface IField {
  Description: string;
  EntityPropertyName: string;
  FieldTypeKind: number;
  FromBaseType: boolean;
  Group: string;
  Hidden: boolean;
  Id: string;
  IndexStatus: number;
  Indexed: boolean;
  InternalName: string;
  Sortable: boolean;
  StaticName: string;
  Title: string;
  TypeAsString: string;
}

export interface IListItem {
  Category1: string;
  Category2: string;
  Category3: string;
  Category4: string;
  Category5: string;
  IMS_x0020_Document_x0020_Type: string;
  L1_x0020__x0026__x0020_L2_x0020_Topic: string;
  L2_x002e_1: string;
  L3_x0020_Topic: string;
  Level3: string;
  OData__x004c_4: string;
  OData__dlc_DocId: string;
  Order_x0020_1: string;
  Order_x0020_2: string;
  Order_x0020_3: string;
  Topic_x0020_2: string;
  ContentTypeId: string;
  Created: string;
  DocumentTypeOrderBy: string;
  Document_x0020_Type: string;
  File?: {
    Name: string;
    ServerRelativeUrl: string;
    Level: number;
  };
  LinkFilenameNoMenu: string;
  ServerRelativeUrl: string;
  GUID: string;
  ID: number;
  Id: number;
  KeyDocument: boolean;
  Modified: string;
  Title: string | null;
  FileSystemObjectType: number;
}
