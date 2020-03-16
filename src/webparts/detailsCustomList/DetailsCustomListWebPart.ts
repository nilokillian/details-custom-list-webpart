import "core-js/modules/es6.array.find";
import "core-js/modules/es6.string.includes";
import "core-js/es6/array";
import "es6-map/implement";

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneHorizontalRule,
  PropertyPaneToggle
} from "@microsoft/sp-webpart-base";
import { UrlQueryParameterCollection } from "@microsoft/sp-core-library";
import { PropertyFieldMultiSelect } from "@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect";
import { DetailsListApp } from "./components/DetailsListApp";
import { IDetailsListAppProps } from "./interfaces/IDetailsListAppProps";
import SharePointService from "./services/SharePointService";
import { IList, IView, IField } from "./interfaces/ISharePoint";
import { xmlParser } from "./utils/xmlPerser";
import { sortByFieldsMapper, viewFieldsMapper } from "./mappers/WebPartMappers";
import { IRootFolder } from "./interfaces/IRootFolder";
import { IDownerStandardDetailsListWebPartProps } from "./interfaces/IDownerStandardDetailsListWebPartProps";
import { IFolder } from "./interfaces/IFolder";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls/lib/PropertyFieldNumber";

export default class DownerStandardDetailsListGroupedWebPart extends BaseClientSideWebPart<
  IDownerStandardDetailsListWebPartProps
> {
  private _listOptionsLoading = false;
  private _listOptions: IPropertyPaneDropdownOption[];
  private _folderOptions: IPropertyPaneDropdownOption[];
  private _viewOptionsLoading = false;
  private _viewOptions: IPropertyPaneDropdownOption[];
  private _viewColumnOptions: IPropertyPaneDropdownOption[];
  private _listColumnOptions: IPropertyPaneDropdownOption[];
  private _detailsListSizeOptions: IPropertyPaneDropdownOption[];
  private _allViews: IView[];

  public render(): void {
    const {
      selectedListId,
      selectedListTitle,
      selectedFolders,
      selectedView,
      selectedViewId,
      selectedViewCamlQuery,
      selectedViewFieldsMapped,
      selectedSortByFieldsMapped,
      urlQueryActive,
      activateFeedbackForm,
      feedbackListFieldName,
      feedbackListFieldDocIdName,
      feedbackListName,
      selectedDetailsListSize,
      activateFooter,
      docIconColumnsSize,
      nameColumnsSize,
      documentTypeColumnsSize,
      modifiedColumnsSize
    } = this.properties;

    const element: React.ReactElement<IDetailsListAppProps> = React.createElement(
      DetailsListApp,
      {
        selectedListId,
        selectedViewId,
        selectedListTitle,
        selectedFoldersPaths: selectedFolders,
        selectedViewTitle: selectedView,
        selectedViewCamlQuery,
        selectedViewFields: selectedViewFieldsMapped,
        selectedSortByFields: selectedSortByFieldsMapped,
        urlParams: this.getUrlParams(),
        urlQueryActive,
        feedbackForm: activateFeedbackForm
          ? {
              activateFeedbackForm,
              feedbackListFieldName,
              feedbackListFieldDocIdName,
              feedbackListName
            }
          : undefined,
        onWebpartConfigure: this.onWebpartConfigure,
        selectedDetailsListSize,
        defaultColumnsWidth: {
          docIconColumnsSize,
          nameColumnsSize,
          documentTypeColumnsSize,
          modifiedColumnsSize
        },
        footer: activateFooter
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onWebpartConfigure = (): void => {
    this.context.propertyPane.open();
  };

  public getUrlParams = (): UrlQueryParameterCollection => {
    const queryParms = new UrlQueryParameterCollection(window.location.href);

    return queryParms;
  };

  public getLists = async (): Promise<void> => {
    const filterString = `Hidden eq false and (BaseTemplate eq 101 )`;
    try {
      const result: IList[] = await SharePointService.pnp_getListsAdvanced(
        filterString
      );

      this._listOptions = result.map(list => ({
        key: list.Title,
        text: list.Title,
        id: list.Id,
        internalName: list.EntityTypeName
      }));
    } catch (error) {
      throw error;
    }
  };

  public getLibraryRootFolderName = async (
    listTitle: string
  ): Promise<string> => {
    const result: IRootFolder = await SharePointService.pnp_getLibraryRootFolder(
      listTitle
    );
    return result.Name;
  };

  public getViewsOptions = async (): Promise<void> => {
    const { selectedListTitle } = this.properties;
    const select = ["*"];
    const result = await SharePointService.pnp_getViews(
      selectedListTitle,
      select
    );
    this._allViews = result;
    this._viewOptions = result.map(view => ({
      key: view.Title,
      text: view.Title
    }));
  };

  public getListFieldsOptions = async (): Promise<void> => {
    const result: IField[] = await SharePointService.pnp_getListFields(
      this.properties.selectedListTitle,
      "Hidden eq false"
    );

    this._listColumnOptions = result.map(field => ({
      text: field.Title,
      key: field.InternalName,
      fieldType: field.TypeAsString
    }));
  };

  public getColumnOptions = (): void => {
    if (this.properties.selectedView) {
      const currentView = this._allViews.find(
        view => view.Title === this.properties.selectedView
      );

      const { viewFields, viewId } = xmlParser(currentView);

      this.properties.selectedViewId = viewId;
      this.properties.selectedViewCamlQuery = currentView.ViewQuery;
      this._viewColumnOptions = viewFields.map((f: string) => ({
        key: f,
        text: f
      }));
    }
  };

  public getFolderOptions = async (): Promise<void> => {
    const folders: IFolder[] = await SharePointService.pnp_getFolders(
      this.properties.selectedListTitle
    );

    this._folderOptions = folders
      .filter(folder => folder.Name !== "Forms")
      .map(filteredfolder => ({
        key: filteredfolder.ServerRelativeUrl,
        text: filteredfolder.Name
      }));
  };

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    SharePointService.setup(this.context);
    SharePointService.pnp_setup(this.context);
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    const { detailsListSizeOptions, selectedListTitle } = this.properties;
    this._detailsListSizeOptions = [
      { key: detailsListSizeOptions.large, text: "large" },
      { key: detailsListSizeOptions.medium, text: "medium" },
      { key: detailsListSizeOptions.small, text: "small" },
      { key: detailsListSizeOptions.autoSize, text: "autoSize" }
    ];

    this._listOptionsLoading = true;
    await this.getLists();
    this._listOptionsLoading = false;

    if (selectedListTitle) {
      this.getLibraryRootFolderName(selectedListTitle);
      this.properties.selectedListId = this._listOptions.find(
        listOption => listOption.text === selectedListTitle
      )["id"];

      await this.getListFieldsOptions();
      await this.getFolderOptions();
      this._viewOptionsLoading = true;
      await this.getViewsOptions();
      this._viewOptionsLoading = false;

      if (this.properties.selectedView) {
        this.getColumnOptions();
      }
    }

    this.context.propertyPane.refresh();
  }

  protected async onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): Promise<void> {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    const { selectedListTitle } = this.properties;
    if (propertyPath === "selectedListTitle" && newValue) {
      this.properties.selectedListTitle = newValue;
      this.properties.selectedListId = this._listOptions.find(
        listOption => listOption.text === selectedListTitle
      )["id"];

      this.properties.selectedView = "";
      this.properties.selectedViewFields = [];
      this.properties.selectedViewCamlQuery = "";
      this.properties.selectedFolders = [];
      this.properties.selectedSortByFields = [];
      this.properties.selectedViewFieldsMapped = [];

      this._viewOptionsLoading = true;
      await this.getViewsOptions();
      this._viewOptionsLoading = false;
      await this.getListFieldsOptions();
      await this.getFolderOptions();
      this.context.propertyPane.refresh();
    } else if (propertyPath === "selectedFolders" && newValue) {
      this.properties.selectedView = "";
      this.properties.selectedViewCamlQuery = "";
      this.properties.selectedViewFields = [];
      this.properties.selectedSortByFields = [];
      this.context.propertyPane.refresh();
    } else if (propertyPath === "selectedView" && newValue) {
      this.getColumnOptions();
      this.properties.selectedViewFields = [];
      this.properties.selectedSortByFields = [];
      this.context.propertyPane.refresh();
    } else if (propertyPath === "selectedViewFields" && newValue) {
      this.properties.selectedViewFieldsMapped = viewFieldsMapper(
        newValue,
        this._listColumnOptions
      );
      this.properties.selectedViewFields = newValue;
      this.context.propertyPane.refresh();
    } else if (propertyPath === "selectedSortByFields" && newValue) {
      this.properties.selectedSortByFieldsMapped = sortByFieldsMapper(
        newValue,
        this._listColumnOptions
      );
      this.context.propertyPane.refresh();
    } else if (propertyPath === "urlQueryActive" && newValue) {
      this.properties.urlQueryActive = newValue;
      this.context.propertyPane.refresh();
    } else if (propertyPath === "selectedDetailsListSize" && newValue) {
      this.context.propertyPane.refresh();
    }

    // else if (
    //   propertyPath === "docIconColumnsSize" ||
    //   propertyPath === "nameColumnsSize" ||
    //   propertyPath === "documentTypeColumnsSize" ||
    //   (propertyPath === "modifiedColumnsSize" && newValue)
    // ) {
    //   this.context.propertyPane.refresh();
    // }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const {
      selectedListTitle,
      selectedFolders,
      selectedView,
      selectedViewFields,
      selectedSortByFields,
      selectedDetailsListSize,
      feedbackListName,
      feedbackListFieldName,
      feedbackListFieldDocIdName,
      activateFeedbackForm,
      activateFooter,
      docIconColumnsSize,
      nameColumnsSize,
      documentTypeColumnsSize,
      modifiedColumnsSize
    } = this.properties;

    return {
      pages: [
        {
          groups: [
            {
              groupName: "Sources",
              groupFields: [
                PropertyPaneHorizontalRule(),
                PropertyPaneDropdown("selectedListTitle", {
                  label: "Select list [ only library type lists are shown ]",
                  options: this._listOptions,
                  selectedKey: selectedListTitle,
                  disabled: this._listOptionsLoading
                }),
                PropertyFieldMultiSelect("selectedFolders", {
                  key: "selectedFolders",
                  label:
                    "Select folders [ leave empty to get items from root folder ]",
                  selectedKeys: selectedFolders,
                  options: this._folderOptions,
                  disabled: this._listOptionsLoading
                }),

                PropertyPaneDropdown("selectedView", {
                  label: "Select view [ view filter is applied to items ]",
                  options: this._viewOptions,
                  selectedKey: selectedView,
                  disabled:
                    this._listOptionsLoading ||
                    this._viewOptionsLoading ||
                    !selectedListTitle
                }),
                PropertyFieldMultiSelect("selectedViewFields", {
                  key: "selectedViewFields",
                  label: "Select view fields [ columns headers ]",
                  selectedKeys: selectedViewFields,
                  options: this._viewColumnOptions,
                  disabled: this._viewOptionsLoading
                })
              ]
            },

            {
              groupName: "Sorting",
              groupFields: [
                PropertyPaneHorizontalRule(),
                PropertyFieldMultiSelect("selectedSortByFields", {
                  key: "selectedSortByFields",
                  label: "Select columns to sort by",
                  selectedKeys: selectedSortByFields,
                  options: this._listColumnOptions,
                  disabled:
                    this._listOptionsLoading ||
                    this._viewOptionsLoading ||
                    selectedViewFields.length < 1
                })
              ]
            },

            // {
            //   groupName: "URL query settings",
            //   groupFields: [
            //     PropertyPaneHorizontalRule(),
            //     PropertyPaneToggle("urlQueryActive", {
            //       label: `${
            //         urlQueryActive ? "Deactivate" : "Activate"
            //       } url query filter`,
            //       checked: urlQueryActive,
            //       offText: " ",
            //       onText: " "
            //     })
            //   ]
            // },

            {
              groupName: "Feedback form settings",
              groupFields: [
                PropertyPaneHorizontalRule(),
                PropertyPaneTextField("feedbackListName", {
                  label: "List title",
                  value: feedbackListName
                }),
                PropertyPaneTextField("feedbackListFieldName", {
                  label: "Column internal name for Feedback body",
                  value: feedbackListFieldName
                }),
                PropertyPaneTextField("feedbackListFieldDocIdName", {
                  label: "Column internal name for Document Id",
                  value: feedbackListFieldDocIdName
                }),

                PropertyPaneToggle("activateFeedbackForm", {
                  label: `${
                    activateFeedbackForm ? "Hide" : "Show"
                  } feedback from`,
                  checked: activateFeedbackForm,
                  disabled: !feedbackListFieldDocIdName || !feedbackListName,
                  offText: " ",
                  onText: " "
                })
              ]
            },
            {
              groupName: "Footer settings",
              groupFields: [
                PropertyPaneHorizontalRule(),
                PropertyPaneToggle("activateFooter", {
                  label: `${activateFooter ? "Hide" : "Show"} footer`,
                  checked: activateFooter,
                  offText: " ",
                  onText: " "
                })
              ]
            },
            {
              groupName: "List container settings",
              groupFields: [
                PropertyPaneHorizontalRule(),
                PropertyPaneDropdown("selectedDetailsListSize", {
                  label: "Select Details list size",
                  options: this._detailsListSizeOptions,
                  selectedKey: selectedDetailsListSize
                }),

                PropertyFieldNumber("docIconColumnsSize", {
                  key: "docIconColumnsSize",
                  label: "DocIcon column size",
                  value: docIconColumnsSize,
                  maxValue: 1000,
                  minValue: 1
                }),

                PropertyFieldNumber("nameColumnsSize", {
                  key: "nameColumnsSize",
                  label: "Name column size",
                  value: nameColumnsSize,
                  maxValue: 1000,
                  minValue: 1
                }),

                PropertyFieldNumber("documentTypeColumnsSize", {
                  key: "documentTypeColumnsSize",
                  label: "Document Type column size",
                  value: documentTypeColumnsSize,
                  maxValue: 1000,
                  minValue: 1
                }),

                PropertyFieldNumber("modifiedColumnsSize", {
                  key: "modifiedColumnsSize",
                  label: "Modified column size",
                  value: modifiedColumnsSize,
                  maxValue: 1000,
                  minValue: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
