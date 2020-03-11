import * as React from "react";
import {
  DetailsList,
  IDetailsHeaderProps,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
  ScrollablePane,
  ScrollbarVisibility,
  Sticky,
  StickyPositionType,
  ConstrainMode,
  IRenderFunction,
  ITooltipHostProps,
  TooltipHost
} from "office-ui-fabric-react";
import { SPFieldsContext } from "../contexts/SPFieldsContext";
import { SPItemsContext, ISelectedItem } from "../contexts/SPItemsContext";
import { AppSettingsContext } from "../contexts/AppSettingsContext";
import { UrlQueryFilterContext } from "../contexts/UrlQueryFilterContext";
import {
  columnsMapper,
  getValueByField,
  sortedItemsByGroups
} from "../mappers/DetailsListComponentMapper";
import {
  onRenderRow,
  onRenderItemColumn,
  onItemInvoked
} from "./DetailsListComponentRenders";
import { copyAndSort } from "../utils/copyAndSort";
import { getFileExtension } from "../utils/getFileExtension";
import { IQColumns } from "../interfaces/IQColumns";

export const DetailsListComponent: React.FC = (): JSX.Element => {
  const { detailsListSize } = React.useContext(AppSettingsContext);
  const { urlParams, urlQueryActive } = React.useContext(UrlQueryFilterContext);
  const {
    listItems,
    selectedItems,
    setSelectedItems,
    clearSelection,
    setClearSelection
  } = React.useContext(SPItemsContext);
  const { viewFields, sortByFields } = React.useContext(SPFieldsContext);
  const [items, setItems] = React.useState<any[]>([]);
  const [columns, setColumns] = React.useState<IColumn[]>(
    columnsMapper(viewFields)
  );

  const [selection] = React.useState<Selection>(
    () =>
      new Selection({
        onSelectionChanged: () => {
          const currentSelectedItems = selection.getSelection() as any[];
          const updatedSelectedItems: ISelectedItem[] = [];
          const mappedCurrentSelectedItems = currentSelectedItems.map(
            currentSelectedItem =>
              ({
                selectedItemId: currentSelectedItem.Id,
                selectedItemUniqueId: currentSelectedItem.UniqueId,
                serverRelativeUrl: currentSelectedItem.ServerRelativeUrl,
                selectedItemName: currentSelectedItem.Name,
                selectedItemDocId: currentSelectedItem.OData__dlc_DocId,
                selectedItemUrlOpenInBrowser: currentSelectedItem.LinkingUrl,
                selectedItemUrlDownload: currentSelectedItem.LinkingUrl
                  ? currentSelectedItem.LinkingUrl.split("?")[0]
                  : currentSelectedItem.ServerRelativeUrl,
                selectedItemExt: getFileExtension(currentSelectedItem.Name)
              } as ISelectedItem)
          );
          mappedCurrentSelectedItems.map(mappedCurrentSelectedItem => {
            const ifIsIn = selectedItems.some(
              selectedItem =>
                selectedItem.selectedItemId ===
                mappedCurrentSelectedItem.selectedItemDocId
            );

            if (!ifIsIn) updatedSelectedItems.push(mappedCurrentSelectedItem);
          });

          setSelectedItems(updatedSelectedItems);
        }
      })
  );

  const onColumnHeaderClick = (
    _event: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    let isSortedDescending = column.isSortedDescending;

    // If we've sorted this column, flip it.
    if (column.isSorted) {
      isSortedDescending = !isSortedDescending;
    }

    // Sort the items.
    const sortedItems = copyAndSort(
      items,
      column.fieldName!,
      isSortedDescending
    );

    // Reset the items and columns to match the state.
    setColumns(
      columns.map(col => {
        col.isSorted = col.key === column.key;

        if (col.isSorted) {
          col.isSortedDescending = isSortedDescending;
        }
        return col;
      })
    );
    setItems(sortedItems);
  };

  const onRenderDetailsHeader = (
    props: IDetailsHeaderProps,
    defaultRender?: IRenderFunction<IDetailsHeaderProps>
  ): JSX.Element => {
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip: (
            tooltipHostProps: ITooltipHostProps
          ) => <TooltipHost {...tooltipHostProps} />
        })}
      </Sticky>
    );
  };

  const urlQueryDataFilter = (): void => {
    let sortedItems = [];
    const fileredColumns: IColumn[] = [];
    const fileredItems = [];

    const qColumnsValues: IQColumns[] = [];
    if (!urlQueryActive) {
      sortedItems = sortedItemsByGroups(listItems, sortByFields);

      setColumns(columnsMapper(viewFields));
      setItems(sortedItems);
      return;
    }

    const initialColumnsPlusGroupBy = [...columnsMapper(viewFields)];

    initialColumnsPlusGroupBy.map(mappedColumn => {
      if (
        mappedColumn.fieldName === "Name" ||
        mappedColumn.fieldName === "DocIcon" ||
        mappedColumn.fieldName === "Modified" ||
        mappedColumn.fieldName === "Document_x0020_Type" ||
        mappedColumn.fieldName === "Flowchart"
      ) {
        fileredColumns.push(mappedColumn);
      } else {
        const currentValue = urlParams.getValue(mappedColumn.fieldName);

        if (currentValue && mappedColumn.key !== "groupBy") {
          fileredColumns.push(mappedColumn);

          qColumnsValues.push({
            columnName: mappedColumn.fieldName,
            value: currentValue,
            groupBy: false
          });
        } else if (currentValue && mappedColumn.key === "groupBy") {
          qColumnsValues.push({
            columnName: mappedColumn.fieldName,
            value: currentValue,
            groupBy: true
          });
        }
      }
    });
    if (
      qColumnsValues.some(q => q.groupBy === true) &&
      !qColumnsValues.some(q => q.groupBy === false)
    ) {
      fileredColumns.push(
        ...initialColumnsPlusGroupBy.filter(
          i =>
            i.fieldName !== "Name" &&
            i.fieldName !== "DocIcon" &&
            i.fieldName !== "Modified" &&
            i.fieldName !== "Document_x0020_Type" &&
            i.fieldName !== "Flowchart" &&
            i.key !== "groupBy"
        )
      );
    }

    if (qColumnsValues.length > 0) {
      let tempArray = [];

      qColumnsValues.map((filteredColumn, i: number) => {
        const clearedValue = filteredColumn.groupBy
          ? filteredColumn.value.replace(/%20/g, " ")
          : filteredColumn.value;
        if (i === 0) {
          if (clearedValue === "NotEmpty") {
            tempArray = listItems.filter(item =>
              getValueByField(item, filteredColumn.columnName)
            );
          } else if (clearedValue === "Empty") {
            tempArray = listItems.filter(
              item => !getValueByField(item, filteredColumn.columnName)
            );
          } else if (clearedValue === "All") {
            tempArray = listItems;
          } else {
            tempArray = listItems.filter(
              item =>
                getValueByField(item, filteredColumn.columnName) ===
                clearedValue
            );
          }
        } else {
          if (clearedValue === "NotEmpty") {
            tempArray = [
              ...tempArray.filter(item => item[filteredColumn.columnName])
            ];
          } else if (clearedValue === "Empty") {
            tempArray = tempArray.filter(
              item => !getValueByField(item, filteredColumn.columnName)
            );
          } else if (clearedValue === "All") {
            tempArray = tempArray;
          } else {
            tempArray = [
              ...tempArray.filter(
                item =>
                  getValueByField(item, filteredColumn.columnName) ===
                  clearedValue
              )
            ];
          }
        }
      });

      sortedItems = sortedItemsByGroups(fileredItems, sortByFields);

      selection.setItems(sortedItems);
      sortedItems.push(...tempArray);
      setColumns(fileredColumns);
      setItems(sortedItems);
    } else {
      sortedItems = sortedItemsByGroups(listItems, sortByFields);

      selection.setItems(sortedItems);
      setColumns(columnsMapper(viewFields));
      setItems(sortedItems);
    }
  };

  React.useEffect(() => {
    if (clearSelection) selection.setItems(items, true);
    setClearSelection(false);
  }, [clearSelection]);

  React.useEffect(() => {
    urlQueryDataFilter();
  }, [listItems, viewFields, sortByFields, urlQueryActive]);

  React.useEffect(() => {
    setItems(listItems);
  }, [listItems]);

  React.useEffect(() => {
    selection.setItems(items);
  }, [items]);

  return (
    <div style={{ height: detailsListSize, position: "relative" }}>
      <ScrollablePane scrollbarVisibility={ScrollbarVisibility.always}>
        <DetailsList
          setKey="dataSet"
          items={items}
          columns={columns}
          selectionMode={SelectionMode.multiple}
          onColumnHeaderClick={onColumnHeaderClick}
          onRenderItemColumn={onRenderItemColumn}
          onRenderRow={onRenderRow}
          constrainMode={ConstrainMode.unconstrained}
          onRenderDetailsHeader={onRenderDetailsHeader}
          selection={selection}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          onItemInvoked={onItemInvoked}
        />
      </ScrollablePane>
    </div>
  );
};
