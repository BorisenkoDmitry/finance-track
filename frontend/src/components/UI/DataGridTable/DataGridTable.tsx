import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnSizingState,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type Table,
} from "@tanstack/react-table";
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiExpandUpDownLine } from "react-icons/ri";
import { RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";

export type DataGridAlign = "left" | "center" | "right";

export type DataGridColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
  align?: DataGridAlign;
  truncate?: boolean;
  /** If true, uses tabular numbers + stronger font by default */
  isNumeric?: boolean;
  /** Optional tooltip on cell using the raw value */
  titleFromValue?: boolean;
};

function getMeta<T>(col: { columnDef: ColumnDef<T, unknown> }): DataGridColumnMeta {
  return (col.columnDef.meta ?? {}) as DataGridColumnMeta;
}

function shallowRecordEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

function GridCheckbox(props: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  onChange: (next: boolean) => void;
}) {
  const { checked, indeterminate, disabled, ariaLabel, onChange } = props;
  return (
    <label
      className={[
        "inline-flex items-center justify-center",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      ].join(" ")}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        ref={(el) => {
          if (!el) return;
          el.indeterminate = Boolean(indeterminate);
        }}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={[
          "relative inline-flex h-5 w-5 items-center justify-center rounded-lg",
          "border border-primary-700/50 bg-primary-900/35 shadow-[0_6px_18px_-12px_rgba(0,0,0,0.8)]",
          "transition-colors",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/60",
          "peer-checked:border-secondary-500 peer-checked:bg-secondary-500/90",
          indeterminate ? "border-primary-500/50 bg-primary-500/20" : "",
        ].join(" ")}
      >
        {indeterminate ? (
          <span className="h-[2px] w-3 rounded-full bg-grey-0" />
        ) : checked ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-grey-0"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </label>
  );
}

type FooterRenderCtx<TData> = {
  table: Table<TData>;
  gridTemplateColumns: string;
  leafColumnCount: number;
  hasRowNumber: boolean;
  hasSelection: boolean;
  hasActions: boolean;
};

export type DataGridTableProps<TData> = {
  data: TData[];
  columns: Array<ColumnDef<TData, unknown>>;

  /** If omitted, uses row index */
  getRowId?: (originalRow: TData, index: number) => string;

  /** Adds a leading numbering column */
  showRowNumber?: boolean;
  rowNumberColumnSize?: number;

  /** Enables multi-select column (checkboxes) */
  enableMultiSelect?: boolean;
  selectionColumnSize?: number;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /** Convenience callback for consumers who want selected originals */
  onSelectionChange?: (selected: TData[]) => void;

  /** Shows edit/delete actions column */
  onEditRow?: (row: TData) => void;
  onDeleteRow?: (row: TData) => void;
  /** If provided, overrides default actions UI */
  renderRowActions?: (row: TData) => ReactNode;
  actionsColumnSize?: number;

  /** Enables tanstack column resizing */
  enableColumnResizing?: boolean;
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
  initialColumnSizing?: ColumnSizingState;

  /** Enables tanstack sorting */
  enableSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  initialSorting?: SortingState;

  emptyState?: ReactNode;
  className?: string;

  /** Optional row-level className (for highlighting active row etc.) */
  getRowClassName?: (row: TData) => string | undefined;

  /** Optional extra content rendered right after each row (e.g. expandable details) */
  renderRowAfter?: (ctx: { row: TData; rowId: string }) => ReactNode;

  /** Optional footer row renderer (gets the exact grid template) */
  renderFooter?: (ctx: FooterRenderCtx<TData>) => ReactNode;
};

export function DataGridTable<TData>({
  data,
  columns,
  getRowId,
  showRowNumber = true,
  rowNumberColumnSize = 48,
  enableMultiSelect = false,
  selectionColumnSize = 52,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  onSelectionChange,
  onEditRow,
  onDeleteRow,
  renderRowActions,
  actionsColumnSize = 100,
  enableColumnResizing = false,
  columnSizing: columnSizingProp,
  onColumnSizingChange,
  initialColumnSizing,
  enableSorting = true,
  sorting: sortingProp,
  onSortingChange,
  initialSorting,
  emptyState = null,
  className,
  getRowClassName,
  renderRowAfter,
  renderFooter,
}: DataGridTableProps<TData>) {
  const columnHelper = useMemo(() => createColumnHelper<TData>(), []);
  const hasActions = Boolean(onEditRow || onDeleteRow || renderRowActions);
  const getRowIdRef = useRef<DataGridTableProps<TData>["getRowId"]>(getRowId);
  useEffect(() => {
    getRowIdRef.current = getRowId;
  }, [getRowId]);

  const getRowIdStable = useMemo(() => {
    return (row: TData, index: number) => {
      const fn = getRowIdRef.current;
      return fn ? fn(row, index) : String(index);
    };
  }, []);

  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({});
  const rowSelection = rowSelectionProp ?? rowSelectionState;

  const [columnSizingState, setColumnSizingState] = useState<ColumnSizingState>(
    initialColumnSizing ?? {}
  );
  const columnSizing = columnSizingProp ?? columnSizingState;

  const [sortingState, setSortingState] = useState<SortingState>(
    initialSorting ?? []
  );
  const sorting = sortingProp ?? sortingState;

  const onSelectionChangeRef = useRef<DataGridTableProps<TData>["onSelectionChange"]>(
    onSelectionChange
  );
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  const augmentedColumns = useMemo(() => {
    const cols: Array<ColumnDef<TData, unknown>> = [];

    if (enableMultiSelect) {
      cols.push(
        columnHelper.display({
          id: "__select",
          size: selectionColumnSize,
          header: ({ table }) => (
            <GridCheckbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={
                table.getIsSomePageRowsSelected() &&
                !table.getIsAllPageRowsSelected()
              }
              ariaLabel="Выбрать все строки"
              onChange={(next) => table.toggleAllPageRowsSelected(next)}
            />
          ),
          cell: ({ row }) => (
            <GridCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              ariaLabel="Выбрать строку"
              onChange={(next) => row.toggleSelected(next)}
            />
          ),
          enableResizing: false,
          enableSorting: false,
        })
      );
    }

    if (showRowNumber) {
      cols.push(
        columnHelper.display({
          id: "__rownum",
          size: rowNumberColumnSize,
          header: "№",
          cell: ({ row }) => (
            <span className="text-xs tabular-nums text-grey-200/30">
              {row.index + 1}
            </span>
          ),
          enableResizing: false,
          enableSorting: false,
        })
      );
    }

    cols.push(...columns);

    if (hasActions) {
      cols.push(
        columnHelper.display({
          id: "__actions",
          size: actionsColumnSize,
          header: "",
          cell: ({ row }) => {
            const original = row.original;

            if (renderRowActions) return renderRowActions(original);

            return (
              <div className="flex items-center justify-start gap-1 opacity-0 transition-opacity duration-200 [div[role=row]:hover_&]:opacity-100">
                {onEditRow && (
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/40 transition-colors hover:bg-primary-700/20 hover:text-grey-0"
                    onClick={() => onEditRow(original)}
                    aria-label="Редактировать"
                  >
                    <RiEdit2Line />
                  </button>
                )}
                {onDeleteRow && (
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/40 transition-colors hover:bg-red-500/15 hover:text-red-400"
                    onClick={() => onDeleteRow(original)}
                    aria-label="Удалить"
                  >
                    <RiDeleteBin3Line />
                  </button>
                )}
              </div>
            );
          },
          enableResizing: false,
          enableSorting: false,
        })
      );
    }

    return cols;
  }, [
    actionsColumnSize,
    columnHelper,
    columns,
    enableMultiSelect,
    hasActions,
    onDeleteRow,
    onEditRow,
    renderRowActions,
    rowNumberColumnSize,
    selectionColumnSize,
    showRowNumber,
  ]);

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> =
    onRowSelectionChange ??
    ((updater) => {
      setRowSelectionState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return shallowRecordEqual(prev, next) ? prev : next;
      });
    });

  const handleColumnSizingChange: OnChangeFn<ColumnSizingState> =
    onColumnSizingChange ??
    ((updater) => {
      setColumnSizingState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return shallowRecordEqual(prev, next) ? prev : next;
      });
    });

  const handleSortingChange: OnChangeFn<SortingState> =
    onSortingChange ??
    ((updater) => {
      setSortingState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        // SortingState is an array; cheap stringify compare is OK for small headers
        return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    });

  const table = useReactTable({
    data,
    columns: augmentedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getRowId: ((row: TData, index: number) => getRowIdStable(row, index)) as never,
    enableRowSelection: enableMultiSelect,
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      rowSelection,
      columnSizing,
      sorting,
    },
    onColumnSizingChange: handleColumnSizingChange,
    onSortingChange: handleSortingChange,
    enableColumnResizing,
    columnResizeMode: enableColumnResizing ? "onChange" : "onEnd",
    enableSorting,
    enableSortingRemoval: true,
    enableMultiSort: false,
  });

  const leafColumns = table.getVisibleLeafColumns();
  const gridTemplateColumns = leafColumns.map((c) => `${c.getSize()}px`).join(" ");
  const minWidth = leafColumns.reduce((acc, c) => acc + c.getSize(), 0);

  useEffect(() => {
    const cb = onSelectionChangeRef.current;
    if (!cb) return;
    const selectedIdSet = new Set(
      Object.entries(rowSelection)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k)
    );
    if (selectedIdSet.size === 0) {
      cb([]);
      return;
    }
    const selected: TData[] = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const id = getRowIdStable(row, i);
      if (selectedIdSet.has(id)) selected.push(row);
    }
    cb(selected);
  }, [data, getRowIdStable, rowSelection]);

  if (!data || data.length === 0) return emptyState;

  return (
    <div
      className={[
        "max-w-full overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ═══ MOBILE CARD VIEW ═══ */}
      <div className="rounded-2xl border border-primary-700/12 bg-primary-900/15 lg:hidden">
        {table.getRowModel().rows.map((row, rowIdx) => {
          const original = row.original;
          const cells = row.getVisibleCells().filter((c) => !c.column.id.startsWith("__"));
          const rowClassName = getRowClassName?.(original);
          const after = renderRowAfter?.({ row: original, rowId: row.id });

          const firstCell = cells[0];
          const numericCell = cells.find((c) => getMeta(c.column).isNumeric);
          const otherCells = cells.filter((c) => c !== firstCell && c !== numericCell);
          const isLast = rowIdx === table.getRowModel().rows.length - 1;

          return (
            <div
              key={row.id}
              className={[
                "px-4 py-3",
                !isLast ? "border-b border-primary-700/8" : "",
                "transition-colors duration-150 active:bg-primary-700/8",
                rowClassName,
              ].filter(Boolean).join(" ")}
            >
              {/* Content row */}
              <div className="flex items-center gap-3">
                {/* Row number */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-700/15 text-[10px] font-medium tabular-nums text-grey-200/30">
                  {row.index + 1}
                </span>

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-grey-0">
                    {firstCell && flexRender(firstCell.column.columnDef.cell, firstCell.getContext())}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    {otherCells.slice(0, 2).map((cell) => (
                      <span key={cell.id} className="truncate text-[11px] text-grey-200/30">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                {numericCell && (
                  <span className="shrink-0 text-sm font-bold tabular-nums">
                    {flexRender(numericCell.column.columnDef.cell, numericCell.getContext())}
                  </span>
                )}
              </div>

              {/* Actions — compact */}
              {hasActions && (
                <div className="mt-2 flex items-center gap-1 pl-10">
                  {renderRowActions ? (
                    renderRowActions(original)
                  ) : (
                    <>
                      {onEditRow && (
                        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-grey-200/25 active:bg-primary-700/20 active:text-grey-0" onClick={() => onEditRow(original)}>
                          <RiEdit2Line size={13} />
                        </button>
                      )}
                      {onDeleteRow && (
                        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-grey-200/25 active:bg-red-500/15 active:text-red-400" onClick={() => onDeleteRow(original)}>
                          <RiDeleteBin3Line size={13} />
                        </button>
                      )}
                    </>
                  )}
                  {enableMultiSelect && (
                    <div className="ml-auto">
                      <GridCheckbox checked={row.getIsSelected()} disabled={!row.getCanSelect()} ariaLabel="Выбрать" onChange={(next) => row.toggleSelected(next)} />
                    </div>
                  )}
                </div>
              )}

              {after && <div className="mt-2 pl-10">{after}</div>}
            </div>
          );
        })}

      </div>

      {/* ═══ DESKTOP TABLE VIEW ═══ */}
      <div className="hidden max-w-full overflow-x-auto lg:block app-surface-strong">
        <div role="table" style={{ minWidth }}>
        <div className="sticky top-0 z-10">
          {table.getHeaderGroups().map((hg) => (
            <div
              role="row"
              key={hg.id}
              className="grid items-center border-b border-primary-700/15"
              style={{ gridTemplateColumns }}
            >
              {hg.headers.map((header) => {
                const meta = getMeta(header.column);
                const sortState = header.column.getIsSorted();
                const SortIcon =
                  sortState === "asc"
                    ? RiArrowUpSLine
                    : sortState === "desc"
                      ? RiArrowDownSLine
                      : RiExpandUpDownLine;
                const canSort = header.column.getCanSort();
                return (
                  <div
                    role="columnheader"
                    key={header.id}
                    className={[
                      "relative px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-grey-200/50",
                      "text-left",
                      "whitespace-normal break-words",
                      meta.headerClassName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        className="group inline-flex w-full items-start justify-between gap-2 text-left cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                        aria-label="Сортировка"
                      >
                        <span className="min-w-0 flex-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        <span className="mt-[1px] inline-flex h-4 w-4 items-center justify-center opacity-70 group-hover:opacity-100">
                          <SortIcon />
                        </span>
                      </button>
                    ) : (
                      <div className="min-w-0">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                    {enableColumnResizing && header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={[
                          "absolute right-0 top-0 h-full w-2 cursor-col-resize",
                          "after:absolute after:right-0 after:top-1/2 after:h-6 after:w-[2px] after:-translate-y-1/2 after:rounded-full after:bg-primary-700/60 after:content-['']",
                          header.column.getIsResizing()
                            ? "after:bg-secondary-500"
                            : "",
                        ].join(" ")}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div role="rowgroup">
          {table.getRowModel().rows.map((row) => {
            const original = row.original;
            const after = renderRowAfter?.({ row: original, rowId: row.id });
            const rowClassName = getRowClassName?.(original);
            return (
              <Fragment key={row.id}>
                <div
                  role="row"
                  className={[
                    "grid items-center rounded-xl border-b border-primary-700/8",
                    "transition-[background-color] duration-200",
                    "hover:bg-primary-700/8",
                    rowClassName,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ gridTemplateColumns }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = getMeta(cell.column);
                    const numeric = meta.isNumeric
                      ? "font-bold tabular-nums text-grey-0"
                      : "";
                    const truncate = meta.truncate
                      ? "truncate"
                      : "whitespace-normal break-words";

                    const title = meta.titleFromValue
                      ? String(cell.getValue() ?? "")
                      : undefined;

                    return (
                      <div
                        role="cell"
                        key={cell.id}
                        title={title}
                        className={[
                          "px-4 py-3.5 text-sm text-grey-200",
                          "text-left",
                          numeric,
                          truncate,
                          meta.cellClassName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  })}
                </div>
                {after ? (
                  <div
                    role="row"
                    className="rounded-xl bg-primary-900/15 px-2 pb-2"
                  >
                    {after}
                  </div>
                ) : null}
              </Fragment>
            );
          })}

          {renderFooter?.({
            table,
            gridTemplateColumns,
            leafColumnCount: leafColumns.length,
            hasRowNumber: showRowNumber,
            hasSelection: enableMultiSelect,
            hasActions,
          }) ?? null}
        </div>
      </div>
      </div>
    </div>
  );
}

