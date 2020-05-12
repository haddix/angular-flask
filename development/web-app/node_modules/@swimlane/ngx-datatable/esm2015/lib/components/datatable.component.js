import { __decorate, __param } from "tslib";
import { Component, Input, Output, ElementRef, EventEmitter, ViewChild, HostListener, ContentChildren, OnInit, QueryList, AfterViewInit, HostBinding, ContentChild, DoCheck, KeyValueDiffers, KeyValueDiffer, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf, Optional, Inject } from '@angular/core';
import { DatatableGroupHeaderDirective } from './body/body-group-header.directive';
import { BehaviorSubject } from 'rxjs';
import { groupRowsByParents, optionalGetterForProp } from '../utils/tree';
import { setColumnDefaults, translateTemplates } from '../utils/column-helper';
import { ColumnMode } from '../types/column-mode.type';
import { SelectionType } from '../types/selection.type';
import { SortType } from '../types/sort.type';
import { ContextmenuType } from '../types/contextmenu.type';
import { DataTableColumnDirective } from './columns/column.directive';
import { DatatableRowDetailDirective } from './row-detail/row-detail.directive';
import { DatatableFooterDirective } from './footer/footer.directive';
import { DataTableBodyComponent } from './body/body.component';
import { DataTableHeaderComponent } from './header/header.component';
import { ScrollbarHelper } from '../services/scrollbar-helper.service';
import { ColumnChangesService } from '../services/column-changes.service';
import { DimensionsHelper } from '../services/dimensions-helper.service';
import { throttleable } from '../utils/throttle';
import { forceFillColumnWidths, adjustColumnWidths } from '../utils/math';
import { sortRows } from '../utils/sort';
let DatatableComponent = class DatatableComponent {
    constructor(scrollbarHelper, dimensionsHelper, cd, element, differs, columnChangesService, configuration) {
        this.scrollbarHelper = scrollbarHelper;
        this.dimensionsHelper = dimensionsHelper;
        this.cd = cd;
        this.columnChangesService = columnChangesService;
        this.configuration = configuration;
        /**
         * List of row objects that should be
         * represented as selected in the grid.
         * Default value: `[]`
         */
        this.selected = [];
        /**
         * Enable vertical scrollbars
         */
        this.scrollbarV = false;
        /**
         * Enable horz scrollbars
         */
        this.scrollbarH = false;
        /**
         * The row height; which is necessary
         * to calculate the height for the lazy rendering.
         */
        this.rowHeight = 30;
        /**
         * Type of column width distribution formula.
         * Example: flex, force, standard
         */
        this.columnMode = ColumnMode.standard;
        /**
         * The minimum header height in pixels.
         * Pass a falsey for no header
         */
        this.headerHeight = 30;
        /**
         * The minimum footer height in pixels.
         * Pass falsey for no footer
         */
        this.footerHeight = 0;
        /**
         * If the table should use external paging
         * otherwise its assumed that all data is preloaded.
         */
        this.externalPaging = false;
        /**
         * If the table should use external sorting or
         * the built-in basic sorting.
         */
        this.externalSorting = false;
        /**
         * Show the linear loading bar.
         * Default value: `false`
         */
        this.loadingIndicator = false;
        /**
         * Enable/Disable ability to re-order columns
         * by dragging them.
         */
        this.reorderable = true;
        /**
         * Swap columns on re-order columns or
         * move them.
         */
        this.swapColumns = true;
        /**
         * The type of sorting
         */
        this.sortType = SortType.single;
        /**
         * Array of sorted columns by property and type.
         * Default value: `[]`
         */
        this.sorts = [];
        /**
         * Css class overrides
         */
        this.cssClasses = {
            sortAscending: 'datatable-icon-up',
            sortDescending: 'datatable-icon-down',
            pagerLeftArrow: 'datatable-icon-left',
            pagerRightArrow: 'datatable-icon-right',
            pagerPrevious: 'datatable-icon-prev',
            pagerNext: 'datatable-icon-skip'
        };
        /**
         * Message overrides for localization
         *
         * emptyMessage     [default] = 'No data to display'
         * totalMessage     [default] = 'total'
         * selectedMessage  [default] = 'selected'
         */
        this.messages = {
            // Message to show when array is presented
            // but contains no values
            emptyMessage: 'No data to display',
            // Footer total message
            totalMessage: 'total',
            // Footer selected message
            selectedMessage: 'selected'
        };
        /**
         * A boolean you can use to set the detault behaviour of rows and groups
         * whether they will start expanded or not. If ommited the default is NOT expanded.
         *
         */
        this.groupExpansionDefault = false;
        /**
         * Property to which you can use for determining select all
         * rows on current page or not.
         *
         * @memberOf DatatableComponent
         */
        this.selectAllRowsOnPage = false;
        /**
         * A flag for row virtualization on / off
         */
        this.virtualization = true;
        /**
         * A flag for switching summary row on / off
         */
        this.summaryRow = false;
        /**
         * A height of summary row
         */
        this.summaryHeight = 30;
        /**
         * A property holds a summary row position: top/bottom
         */
        this.summaryPosition = 'top';
        /**
         * Body was scrolled typically in a `scrollbarV:true` scenario.
         */
        this.scroll = new EventEmitter();
        /**
         * A cell or row was focused via keyboard or mouse click.
         */
        this.activate = new EventEmitter();
        /**
         * A cell or row was selected.
         */
        this.select = new EventEmitter();
        /**
         * Column sort was invoked.
         */
        this.sort = new EventEmitter();
        /**
         * The table was paged either triggered by the pager or the body scroll.
         */
        this.page = new EventEmitter();
        /**
         * Columns were re-ordered.
         */
        this.reorder = new EventEmitter();
        /**
         * Column was resized.
         */
        this.resize = new EventEmitter();
        /**
         * The context menu was invoked on the table.
         * type indicates whether the header or the body was clicked.
         * content contains either the column or the row that was clicked.
         */
        this.tableContextmenu = new EventEmitter(false);
        /**
         * A row was expanded ot collapsed for tree
         */
        this.treeAction = new EventEmitter();
        this.rowCount = 0;
        this._offsetX = new BehaviorSubject(0);
        this._count = 0;
        this._offset = 0;
        this._subscriptions = [];
        /**
         * This will be used when displaying or selecting rows.
         * when tracking/comparing them, we'll use the value of this fn,
         *
         * (`fn(x) === fn(y)` instead of `x === y`)
         */
        this.rowIdentity = (x) => {
            if (this._groupRowsBy) {
                // each group in groupedRows are stored as {key, value: [rows]},
                // where key is the groupRowsBy index
                return x.key;
            }
            else {
                return x;
            }
        };
        // get ref to elm for measuring
        this.element = element.nativeElement;
        this.rowDiffer = differs.find({}).create();
        // apply global settings from Module.forRoot
        if (this.configuration && this.configuration.messages) {
            this.messages = Object.assign({}, this.configuration.messages);
        }
    }
    /**
     * Rows that are displayed in the table.
     */
    set rows(val) {
        this._rows = val;
        if (val) {
            this._internalRows = [...val];
        }
        // auto sort on new updates
        if (!this.externalSorting) {
            this.sortInternalRows();
        }
        // auto group by parent on new update
        this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
        // recalculate sizes/etc
        this.recalculate();
        if (this._rows && this._groupRowsBy) {
            // If a column has been specified in _groupRowsBy created a new array with the data grouped by that row
            this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
        }
        this.cd.markForCheck();
    }
    /**
     * Gets the rows.
     */
    get rows() {
        return this._rows;
    }
    /**
     * This attribute allows the user to set the name of the column to group the data with
     */
    set groupRowsBy(val) {
        if (val) {
            this._groupRowsBy = val;
            if (this._rows && this._groupRowsBy) {
                // cretes a new array with the data grouped
                this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
            }
        }
    }
    get groupRowsBy() {
        return this._groupRowsBy;
    }
    /**
     * Columns to be displayed.
     */
    set columns(val) {
        if (val) {
            this._internalColumns = [...val];
            setColumnDefaults(this._internalColumns);
            this.recalculateColumns();
        }
        this._columns = val;
    }
    /**
     * Get the columns.
     */
    get columns() {
        return this._columns;
    }
    /**
     * The page size to be shown.
     * Default value: `undefined`
     */
    set limit(val) {
        this._limit = val;
        // recalculate sizes/etc
        this.recalculate();
    }
    /**
     * Gets the limit.
     */
    get limit() {
        return this._limit;
    }
    /**
     * The total count of all rows.
     * Default value: `0`
     */
    set count(val) {
        this._count = val;
        // recalculate sizes/etc
        this.recalculate();
    }
    /**
     * Gets the count.
     */
    get count() {
        return this._count;
    }
    /**
     * The current offset ( page - 1 ) shown.
     * Default value: `0`
     */
    set offset(val) {
        this._offset = val;
    }
    get offset() {
        return Math.max(Math.min(this._offset, Math.ceil(this.rowCount / this.pageSize) - 1), 0);
    }
    /**
     * CSS class applied if the header height if fixed height.
     */
    get isFixedHeader() {
        const headerHeight = this.headerHeight;
        return typeof headerHeight === 'string' ? headerHeight !== 'auto' : true;
    }
    /**
     * CSS class applied to the root element if
     * the row heights are fixed heights.
     */
    get isFixedRow() {
        return this.rowHeight !== 'auto';
    }
    /**
     * CSS class applied to root element if
     * vertical scrolling is enabled.
     */
    get isVertScroll() {
        return this.scrollbarV;
    }
    /**
     * CSS class applied to root element if
     * virtualization is enabled.
     */
    get isVirtualized() {
        return this.virtualization;
    }
    /**
     * CSS class applied to the root element
     * if the horziontal scrolling is enabled.
     */
    get isHorScroll() {
        return this.scrollbarH;
    }
    /**
     * CSS class applied to root element is selectable.
     */
    get isSelectable() {
        return this.selectionType !== undefined;
    }
    /**
     * CSS class applied to root is checkbox selection.
     */
    get isCheckboxSelection() {
        return this.selectionType === SelectionType.checkbox;
    }
    /**
     * CSS class applied to root if cell selection.
     */
    get isCellSelection() {
        return this.selectionType === SelectionType.cell;
    }
    /**
     * CSS class applied to root if single select.
     */
    get isSingleSelection() {
        return this.selectionType === SelectionType.single;
    }
    /**
     * CSS class added to root element if mulit select
     */
    get isMultiSelection() {
        return this.selectionType === SelectionType.multi;
    }
    /**
     * CSS class added to root element if mulit click select
     */
    get isMultiClickSelection() {
        return this.selectionType === SelectionType.multiClick;
    }
    /**
     * Column templates gathered from `ContentChildren`
     * if described in your markup.
     */
    set columnTemplates(val) {
        this._columnTemplates = val;
        this.translateColumns(val);
    }
    /**
     * Returns the column templates.
     */
    get columnTemplates() {
        return this._columnTemplates;
    }
    /**
     * Returns if all rows are selected.
     */
    get allRowsSelected() {
        let allRowsSelected = this.rows && this.selected && this.selected.length === this.rows.length;
        if (this.bodyComponent && this.selectAllRowsOnPage) {
            const indexes = this.bodyComponent.indexes;
            const rowsOnPage = indexes.last - indexes.first;
            allRowsSelected = this.selected.length === rowsOnPage;
        }
        return this.selected && this.rows && this.rows.length !== 0 && allRowsSelected;
    }
    /**
     * Lifecycle hook that is called after data-bound
     * properties of a directive are initialized.
     */
    ngOnInit() {
        // need to call this immediatly to size
        // if the table is hidden the visibility
        // listener will invoke this itself upon show
        this.recalculate();
    }
    /**
     * Lifecycle hook that is called after a component's
     * view has been fully initialized.
     */
    ngAfterViewInit() {
        if (!this.externalSorting) {
            this.sortInternalRows();
        }
        // this has to be done to prevent the change detection
        // tree from freaking out because we are readjusting
        if (typeof requestAnimationFrame === 'undefined') {
            return;
        }
        requestAnimationFrame(() => {
            this.recalculate();
            // emit page for virtual server-side kickoff
            if (this.externalPaging && this.scrollbarV) {
                this.page.emit({
                    count: this.count,
                    pageSize: this.pageSize,
                    limit: this.limit,
                    offset: 0
                });
            }
        });
    }
    /**
     * Lifecycle hook that is called after a component's
     * content has been fully initialized.
     */
    ngAfterContentInit() {
        this.columnTemplates.changes.subscribe(v => this.translateColumns(v));
        this.listenForColumnInputChanges();
    }
    /**
     * Translates the templates to the column objects
     */
    translateColumns(val) {
        if (val) {
            const arr = val.toArray();
            if (arr.length) {
                this._internalColumns = translateTemplates(arr);
                setColumnDefaults(this._internalColumns);
                this.recalculateColumns();
                this.sortInternalRows();
                this.cd.markForCheck();
            }
        }
    }
    /**
     * Creates a map with the data grouped by the user choice of grouping index
     *
     * @param originalArray the original array passed via parameter
     * @param groupByIndex  the index of the column to group the data by
     */
    groupArrayBy(originalArray, groupBy) {
        // create a map to hold groups with their corresponding results
        const map = new Map();
        let i = 0;
        originalArray.forEach((item) => {
            const key = item[groupBy];
            if (!map.has(key)) {
                map.set(key, [item]);
            }
            else {
                map.get(key).push(item);
            }
            i++;
        });
        const addGroup = (key, value) => {
            return { key, value };
        };
        // convert map back to a simple array of objects
        return Array.from(map, x => addGroup(x[0], x[1]));
    }
    /*
     * Lifecycle hook that is called when Angular dirty checks a directive.
     */
    ngDoCheck() {
        if (this.rowDiffer.diff(this.rows)) {
            if (!this.externalSorting) {
                this.sortInternalRows();
            }
            else {
                this._internalRows = [...this.rows];
            }
            // auto group by parent on new update
            this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
            this.recalculatePages();
            this.cd.markForCheck();
        }
    }
    /**
     * Recalc's the sizes of the grid.
     *
     * Updated automatically on changes to:
     *
     *  - Columns
     *  - Rows
     *  - Paging related
     *
     * Also can be manually invoked or upon window resize.
     */
    recalculate() {
        this.recalculateDims();
        this.recalculateColumns();
        this.cd.markForCheck();
    }
    /**
     * Window resize handler to update sizes.
     */
    onWindowResize() {
        this.recalculate();
    }
    /**
     * Recalulcates the column widths based on column width
     * distribution mode and scrollbar offsets.
     */
    recalculateColumns(columns = this._internalColumns, forceIdx = -1, allowBleed = this.scrollbarH) {
        if (!columns)
            return undefined;
        let width = this._innerWidth;
        if (this.scrollbarV) {
            width = width - this.scrollbarHelper.width;
        }
        if (this.columnMode === ColumnMode.force) {
            forceFillColumnWidths(columns, width, forceIdx, allowBleed);
        }
        else if (this.columnMode === ColumnMode.flex) {
            adjustColumnWidths(columns, width);
        }
        return columns;
    }
    /**
     * Recalculates the dimensions of the table size.
     * Internally calls the page size and row count calcs too.
     *
     */
    recalculateDims() {
        const dims = this.dimensionsHelper.getDimensions(this.element);
        this._innerWidth = Math.floor(dims.width);
        if (this.scrollbarV) {
            let height = dims.height;
            if (this.headerHeight)
                height = height - this.headerHeight;
            if (this.footerHeight)
                height = height - this.footerHeight;
            this.bodyHeight = height;
        }
        this.recalculatePages();
    }
    /**
     * Recalculates the pages after a update.
     */
    recalculatePages() {
        this.pageSize = this.calcPageSize();
        this.rowCount = this.calcRowCount();
    }
    /**
     * Body triggered a page event.
     */
    onBodyPage({ offset }) {
        // Avoid pagination caming from body events like scroll when the table
        // has no virtualization and the external paging is enable.
        // This means, let's the developer handle pagination by my him(her) self
        if (this.externalPaging && !this.virtualization) {
            return;
        }
        this.offset = offset;
        this.page.emit({
            count: this.count,
            pageSize: this.pageSize,
            limit: this.limit,
            offset: this.offset
        });
    }
    /**
     * The body triggered a scroll event.
     */
    onBodyScroll(event) {
        this._offsetX.next(event.offsetX);
        this.scroll.emit(event);
        this.cd.detectChanges();
    }
    /**
     * The footer triggered a page event.
     */
    onFooterPage(event) {
        this.offset = event.page - 1;
        this.bodyComponent.updateOffsetY(this.offset);
        this.page.emit({
            count: this.count,
            pageSize: this.pageSize,
            limit: this.limit,
            offset: this.offset
        });
        if (this.selectAllRowsOnPage) {
            this.selected = [];
            this.select.emit({
                selected: this.selected
            });
        }
    }
    /**
     * Recalculates the sizes of the page
     */
    calcPageSize(val = this.rows) {
        // Keep the page size constant even if the row has been expanded.
        // This is because an expanded row is still considered to be a child of
        // the original row.  Hence calculation would use rowHeight only.
        if (this.scrollbarV && this.virtualization) {
            const size = Math.ceil(this.bodyHeight / this.rowHeight);
            return Math.max(size, 0);
        }
        // if limit is passed, we are paging
        if (this.limit !== undefined) {
            return this.limit;
        }
        // otherwise use row length
        if (val) {
            return val.length;
        }
        // other empty :(
        return 0;
    }
    /**
     * Calculates the row count.
     */
    calcRowCount(val = this.rows) {
        if (!this.externalPaging) {
            if (!val)
                return 0;
            if (this.groupedRows) {
                return this.groupedRows.length;
            }
            else if (this.treeFromRelation != null && this.treeToRelation != null) {
                return this._internalRows.length;
            }
            else {
                return val.length;
            }
        }
        return this.count;
    }
    /**
     * The header triggered a contextmenu event.
     */
    onColumnContextmenu({ event, column }) {
        this.tableContextmenu.emit({ event, type: ContextmenuType.header, content: column });
    }
    /**
     * The body triggered a contextmenu event.
     */
    onRowContextmenu({ event, row }) {
        this.tableContextmenu.emit({ event, type: ContextmenuType.body, content: row });
    }
    /**
     * The header triggered a column resize event.
     */
    onColumnResize({ column, newValue }) {
        /* Safari/iOS 10.2 workaround */
        if (column === undefined) {
            return;
        }
        let idx;
        const cols = this._internalColumns.map((c, i) => {
            c = Object.assign({}, c);
            if (c.$$id === column.$$id) {
                idx = i;
                c.width = newValue;
                // set this so we can force the column
                // width distribution to be to this value
                c.$$oldWidth = newValue;
            }
            return c;
        });
        this.recalculateColumns(cols, idx);
        this._internalColumns = cols;
        this.resize.emit({
            column,
            newValue
        });
    }
    /**
     * The header triggered a column re-order event.
     */
    onColumnReorder({ column, newValue, prevValue }) {
        const cols = this._internalColumns.map(c => {
            return Object.assign({}, c);
        });
        if (this.swapColumns) {
            const prevCol = cols[newValue];
            cols[newValue] = column;
            cols[prevValue] = prevCol;
        }
        else {
            if (newValue > prevValue) {
                const movedCol = cols[prevValue];
                for (let i = prevValue; i < newValue; i++) {
                    cols[i] = cols[i + 1];
                }
                cols[newValue] = movedCol;
            }
            else {
                const movedCol = cols[prevValue];
                for (let i = prevValue; i > newValue; i--) {
                    cols[i] = cols[i - 1];
                }
                cols[newValue] = movedCol;
            }
        }
        this._internalColumns = cols;
        this.reorder.emit({
            column,
            newValue,
            prevValue
        });
    }
    /**
     * The header triggered a column sort event.
     */
    onColumnSort(event) {
        // clean selected rows
        if (this.selectAllRowsOnPage) {
            this.selected = [];
            this.select.emit({
                selected: this.selected
            });
        }
        this.sorts = event.sorts;
        // this could be optimized better since it will resort
        // the rows again on the 'push' detection...
        if (this.externalSorting === false) {
            // don't use normal setter so we don't resort
            this.sortInternalRows();
        }
        // auto group by parent on new update
        this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
        // Always go to first page when sorting to see the newly sorted data
        this.offset = 0;
        this.bodyComponent.updateOffsetY(this.offset);
        this.sort.emit(event);
    }
    /**
     * Toggle all row selection
     */
    onHeaderSelect(event) {
        if (this.bodyComponent && this.selectAllRowsOnPage) {
            // before we splice, chk if we currently have all selected
            const first = this.bodyComponent.indexes.first;
            const last = this.bodyComponent.indexes.last;
            const allSelected = this.selected.length === last - first;
            // remove all existing either way
            this.selected = [];
            // do the opposite here
            if (!allSelected) {
                this.selected.push(...this._internalRows.slice(first, last));
            }
        }
        else {
            // before we splice, chk if we currently have all selected
            const allSelected = this.selected.length === this.rows.length;
            // remove all existing either way
            this.selected = [];
            // do the opposite here
            if (!allSelected) {
                this.selected.push(...this.rows);
            }
        }
        this.select.emit({
            selected: this.selected
        });
    }
    /**
     * A row was selected from body
     */
    onBodySelect(event) {
        this.select.emit(event);
    }
    /**
     * A row was expanded or collapsed for tree
     */
    onTreeAction(event) {
        const row = event.row;
        // TODO: For duplicated items this will not work
        const rowIndex = this._rows.findIndex(r => r[this.treeToRelation] === event.row[this.treeToRelation]);
        this.treeAction.emit({ row, rowIndex });
    }
    ngOnDestroy() {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    /**
     * listen for changes to input bindings of all DataTableColumnDirective and
     * trigger the columnTemplates.changes observable to emit
     */
    listenForColumnInputChanges() {
        this._subscriptions.push(this.columnChangesService.columnInputChanges$.subscribe(() => {
            if (this.columnTemplates) {
                this.columnTemplates.notifyOnChanges();
            }
        }));
    }
    sortInternalRows() {
        this._internalRows = sortRows(this._internalRows, this._internalColumns, this.sorts);
    }
};
DatatableComponent.ctorParameters = () => [
    { type: ScrollbarHelper, decorators: [{ type: SkipSelf }] },
    { type: DimensionsHelper, decorators: [{ type: SkipSelf }] },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: KeyValueDiffers },
    { type: ColumnChangesService },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['configuration',] }] }
];
__decorate([
    Input()
], DatatableComponent.prototype, "targetMarkerTemplate", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "rows", null);
__decorate([
    Input()
], DatatableComponent.prototype, "groupRowsBy", null);
__decorate([
    Input()
], DatatableComponent.prototype, "groupedRows", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "columns", null);
__decorate([
    Input()
], DatatableComponent.prototype, "selected", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "scrollbarV", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "scrollbarH", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "rowHeight", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "columnMode", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "headerHeight", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "footerHeight", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "externalPaging", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "externalSorting", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "limit", null);
__decorate([
    Input()
], DatatableComponent.prototype, "count", null);
__decorate([
    Input()
], DatatableComponent.prototype, "offset", null);
__decorate([
    Input()
], DatatableComponent.prototype, "loadingIndicator", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "selectionType", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "reorderable", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "swapColumns", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "sortType", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "sorts", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "cssClasses", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "messages", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "rowClass", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "selectCheck", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "displayCheck", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "groupExpansionDefault", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "trackByProp", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "selectAllRowsOnPage", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "virtualization", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "treeFromRelation", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "treeToRelation", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "summaryRow", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "summaryHeight", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "summaryPosition", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "scroll", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "activate", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "select", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "sort", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "page", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "reorder", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "resize", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "tableContextmenu", void 0);
__decorate([
    Output()
], DatatableComponent.prototype, "treeAction", void 0);
__decorate([
    HostBinding('class.fixed-header')
], DatatableComponent.prototype, "isFixedHeader", null);
__decorate([
    HostBinding('class.fixed-row')
], DatatableComponent.prototype, "isFixedRow", null);
__decorate([
    HostBinding('class.scroll-vertical')
], DatatableComponent.prototype, "isVertScroll", null);
__decorate([
    HostBinding('class.virtualized')
], DatatableComponent.prototype, "isVirtualized", null);
__decorate([
    HostBinding('class.scroll-horz')
], DatatableComponent.prototype, "isHorScroll", null);
__decorate([
    HostBinding('class.selectable')
], DatatableComponent.prototype, "isSelectable", null);
__decorate([
    HostBinding('class.checkbox-selection')
], DatatableComponent.prototype, "isCheckboxSelection", null);
__decorate([
    HostBinding('class.cell-selection')
], DatatableComponent.prototype, "isCellSelection", null);
__decorate([
    HostBinding('class.single-selection')
], DatatableComponent.prototype, "isSingleSelection", null);
__decorate([
    HostBinding('class.multi-selection')
], DatatableComponent.prototype, "isMultiSelection", null);
__decorate([
    HostBinding('class.multi-click-selection')
], DatatableComponent.prototype, "isMultiClickSelection", null);
__decorate([
    ContentChildren(DataTableColumnDirective)
], DatatableComponent.prototype, "columnTemplates", null);
__decorate([
    ContentChild(DatatableRowDetailDirective)
], DatatableComponent.prototype, "rowDetail", void 0);
__decorate([
    ContentChild(DatatableGroupHeaderDirective)
], DatatableComponent.prototype, "groupHeader", void 0);
__decorate([
    ContentChild(DatatableFooterDirective)
], DatatableComponent.prototype, "footer", void 0);
__decorate([
    ViewChild(DataTableBodyComponent)
], DatatableComponent.prototype, "bodyComponent", void 0);
__decorate([
    ViewChild(DataTableHeaderComponent)
], DatatableComponent.prototype, "headerComponent", void 0);
__decorate([
    Input()
], DatatableComponent.prototype, "rowIdentity", void 0);
__decorate([
    HostListener('window:resize'),
    throttleable(5)
], DatatableComponent.prototype, "onWindowResize", null);
DatatableComponent = __decorate([
    Component({
        selector: 'ngx-datatable',
        template: "<div visibilityObserver (visible)=\"recalculate()\">\n  <datatable-header\n    *ngIf=\"headerHeight\"\n    [sorts]=\"sorts\"\n    [sortType]=\"sortType\"\n    [scrollbarH]=\"scrollbarH\"\n    [innerWidth]=\"_innerWidth\"\n    [offsetX]=\"_offsetX | async\"\n    [dealsWithGroup]=\"groupedRows !== undefined\"\n    [columns]=\"_internalColumns\"\n    [headerHeight]=\"headerHeight\"\n    [reorderable]=\"reorderable\"\n    [targetMarkerTemplate]=\"targetMarkerTemplate\"\n    [sortAscendingIcon]=\"cssClasses.sortAscending\"\n    [sortDescendingIcon]=\"cssClasses.sortDescending\"\n    [allRowsSelected]=\"allRowsSelected\"\n    [selectionType]=\"selectionType\"\n    (sort)=\"onColumnSort($event)\"\n    (resize)=\"onColumnResize($event)\"\n    (reorder)=\"onColumnReorder($event)\"\n    (select)=\"onHeaderSelect($event)\"\n    (columnContextmenu)=\"onColumnContextmenu($event)\"\n  >\n  </datatable-header>\n  <datatable-body\n    [groupRowsBy]=\"groupRowsBy\"\n    [groupedRows]=\"groupedRows\"\n    [rows]=\"_internalRows\"\n    [groupExpansionDefault]=\"groupExpansionDefault\"\n    [scrollbarV]=\"scrollbarV\"\n    [scrollbarH]=\"scrollbarH\"\n    [virtualization]=\"virtualization\"\n    [loadingIndicator]=\"loadingIndicator\"\n    [externalPaging]=\"externalPaging\"\n    [rowHeight]=\"rowHeight\"\n    [rowCount]=\"rowCount\"\n    [offset]=\"offset\"\n    [trackByProp]=\"trackByProp\"\n    [columns]=\"_internalColumns\"\n    [pageSize]=\"pageSize\"\n    [offsetX]=\"_offsetX | async\"\n    [rowDetail]=\"rowDetail\"\n    [groupHeader]=\"groupHeader\"\n    [selected]=\"selected\"\n    [innerWidth]=\"_innerWidth\"\n    [bodyHeight]=\"bodyHeight\"\n    [selectionType]=\"selectionType\"\n    [emptyMessage]=\"messages.emptyMessage\"\n    [rowIdentity]=\"rowIdentity\"\n    [rowClass]=\"rowClass\"\n    [selectCheck]=\"selectCheck\"\n    [displayCheck]=\"displayCheck\"\n    [summaryRow]=\"summaryRow\"\n    [summaryHeight]=\"summaryHeight\"\n    [summaryPosition]=\"summaryPosition\"\n    (page)=\"onBodyPage($event)\"\n    (activate)=\"activate.emit($event)\"\n    (rowContextmenu)=\"onRowContextmenu($event)\"\n    (select)=\"onBodySelect($event)\"\n    (scroll)=\"onBodyScroll($event)\"\n    (treeAction)=\"onTreeAction($event)\"\n  >\n  </datatable-body>\n  <datatable-footer\n    *ngIf=\"footerHeight\"\n    [rowCount]=\"rowCount\"\n    [pageSize]=\"pageSize\"\n    [offset]=\"offset\"\n    [footerHeight]=\"footerHeight\"\n    [footerTemplate]=\"footer\"\n    [totalMessage]=\"messages.totalMessage\"\n    [pagerLeftArrowIcon]=\"cssClasses.pagerLeftArrow\"\n    [pagerRightArrowIcon]=\"cssClasses.pagerRightArrow\"\n    [pagerPreviousIcon]=\"cssClasses.pagerPrevious\"\n    [selectedCount]=\"selected.length\"\n    [selectedMessage]=\"!!selectionType && messages.selectedMessage\"\n    [pagerNextIcon]=\"cssClasses.pagerNext\"\n    (page)=\"onFooterPage($event)\"\n  >\n  </datatable-footer>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        host: {
            class: 'ngx-datatable'
        },
        styles: [".ngx-datatable{display:block;overflow:hidden;justify-content:center;position:relative;transform:translate3d(0,0,0)}.ngx-datatable [hidden]{display:none!important}.ngx-datatable *,.ngx-datatable :after,.ngx-datatable :before{box-sizing:border-box}.ngx-datatable.scroll-vertical .datatable-body{overflow-y:auto}.ngx-datatable.scroll-vertical.virtualized .datatable-body .datatable-row-wrapper{position:absolute}.ngx-datatable.scroll-horz .datatable-body{overflow-x:auto;-webkit-overflow-scrolling:touch}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner{white-space:nowrap}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner .datatable-header-cell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ngx-datatable.fixed-row .datatable-scroll,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row{white-space:nowrap}.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-cell,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-group-cell{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ngx-datatable .datatable-body-row,.ngx-datatable .datatable-header-inner,.ngx-datatable .datatable-row-center{display:flex;flex-direction:row;-o-flex-flow:row;flex-flow:row}.ngx-datatable .datatable-body-cell,.ngx-datatable .datatable-header-cell{overflow-x:hidden;vertical-align:top;display:inline-block;line-height:1.625}.ngx-datatable .datatable-body-cell:focus,.ngx-datatable .datatable-header-cell:focus{outline:0}.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-right{z-index:9}.ngx-datatable .datatable-row-center,.ngx-datatable .datatable-row-group,.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-right{position:relative}.ngx-datatable .datatable-header{display:block;overflow:hidden}.ngx-datatable .datatable-header .datatable-header-inner{align-items:stretch;-webkit-align-items:stretch}.ngx-datatable .datatable-header .datatable-header-cell{position:relative;display:inline-block}.ngx-datatable .datatable-header .datatable-header-cell.sortable .datatable-header-cell-wrapper{cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell.longpress .datatable-header-cell-wrapper{cursor:move}.ngx-datatable .datatable-header .datatable-header-cell .sort-btn{line-height:100%;vertical-align:middle;display:inline-block;cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell .resize-handle--not-resizable{display:inline-block;position:absolute;right:0;top:0;bottom:0;width:5px;padding:0 4px;visibility:hidden}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle{cursor:ew-resize}.ngx-datatable .datatable-header .datatable-header-cell.resizeable:hover .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell:hover .resize-handle--not-resizable{visibility:visible}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker{position:absolute;top:0;bottom:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromLeft{right:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromRight{left:0}.ngx-datatable .datatable-header .datatable-header-cell .datatable-header-cell-template-wrap{height:inherit}.ngx-datatable .datatable-body{position:relative;z-index:10;display:block}.ngx-datatable .datatable-body .datatable-scroll{display:inline-block}.ngx-datatable .datatable-body .datatable-row-detail{overflow-y:hidden}.ngx-datatable .datatable-body .datatable-row-wrapper{display:flex;flex-direction:column}.ngx-datatable .datatable-body .datatable-body-row{outline:0}.ngx-datatable .datatable-body .datatable-body-row>div{display:flex}.ngx-datatable .datatable-footer{display:block;width:100%;overflow:auto}.ngx-datatable .datatable-footer .datatable-footer-inner{display:flex;align-items:center;width:100%}.ngx-datatable .datatable-footer .selected-count .page-count{flex:1 1 40%}.ngx-datatable .datatable-footer .selected-count .datatable-pager{flex:1 1 60%}.ngx-datatable .datatable-footer .page-count{flex:1 1 20%}.ngx-datatable .datatable-footer .datatable-pager{flex:1 1 80%;text-align:right}.ngx-datatable .datatable-footer .datatable-pager .pager,.ngx-datatable .datatable-footer .datatable-pager .pager li{padding:0;margin:0;display:inline-block;list-style:none}.ngx-datatable .datatable-footer .datatable-pager .pager li,.ngx-datatable .datatable-footer .datatable-pager .pager li a{outline:0}.ngx-datatable .datatable-footer .datatable-pager .pager li a{cursor:pointer;display:inline-block}.ngx-datatable .datatable-footer .datatable-pager .pager li.disabled a{cursor:not-allowed}"]
    }),
    __param(0, SkipSelf()),
    __param(1, SkipSelf()),
    __param(6, Optional()), __param(6, Inject('configuration'))
], DatatableComponent);
export { DatatableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXRhYmxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZGF0YXRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFDVixZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsV0FBVyxFQUNYLFlBQVksRUFDWixPQUFPLEVBQ1AsZUFBZSxFQUNmLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRixPQUFPLEVBQUUsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hGLE9BQU8sRUFB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LEVBQUU7WUFDSixLQUFLLEVBQUUsZUFBZTtTQUN2Qjs7S0FDRixDQUFDO0lBcWtCRyxXQUFBLFFBQVEsRUFBRSxDQUFBO0lBQ1YsV0FBQSxRQUFRLEVBQUUsQ0FBQTtJQUtWLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQTtHQTFrQjNCLGtCQUFrQixDQXlrQzlCO1NBemtDWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0NoaWxkLFxuICBIb3N0TGlzdGVuZXIsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgT25Jbml0LFxuICBRdWVyeUxpc3QsXG4gIEFmdGVyVmlld0luaXQsXG4gIEhvc3RCaW5kaW5nLFxuICBDb250ZW50Q2hpbGQsXG4gIERvQ2hlY2ssXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgS2V5VmFsdWVEaWZmZXIsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIFNraXBTZWxmLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEYXRhdGFibGVHcm91cEhlYWRlckRpcmVjdGl2ZSB9IGZyb20gJy4vYm9keS9ib2R5LWdyb3VwLWhlYWRlci5kaXJlY3RpdmUnO1xuXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSU5neERhdGF0YWJsZUNvbmZpZyB9IGZyb20gJy4uL25neC1kYXRhdGFibGUubW9kdWxlJztcbmltcG9ydCB7IGdyb3VwUm93c0J5UGFyZW50cywgb3B0aW9uYWxHZXR0ZXJGb3JQcm9wIH0gZnJvbSAnLi4vdXRpbHMvdHJlZSc7XG5pbXBvcnQgeyBUYWJsZUNvbHVtbiB9IGZyb20gJy4uL3R5cGVzL3RhYmxlLWNvbHVtbi50eXBlJztcbmltcG9ydCB7IHNldENvbHVtbkRlZmF1bHRzLCB0cmFuc2xhdGVUZW1wbGF0ZXMgfSBmcm9tICcuLi91dGlscy9jb2x1bW4taGVscGVyJztcbmltcG9ydCB7IENvbHVtbk1vZGUgfSBmcm9tICcuLi90eXBlcy9jb2x1bW4tbW9kZS50eXBlJztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuLi90eXBlcy9zZWxlY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBTb3J0VHlwZSB9IGZyb20gJy4uL3R5cGVzL3NvcnQudHlwZSc7XG5pbXBvcnQgeyBDb250ZXh0bWVudVR5cGUgfSBmcm9tICcuLi90eXBlcy9jb250ZXh0bWVudS50eXBlJztcbmltcG9ydCB7IERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZSB9IGZyb20gJy4vY29sdW1ucy9jb2x1bW4uZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGF0YWJsZVJvd0RldGFpbERpcmVjdGl2ZSB9IGZyb20gJy4vcm93LWRldGFpbC9yb3ctZGV0YWlsLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhdGFibGVGb290ZXJEaXJlY3RpdmUgfSBmcm9tICcuL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGFUYWJsZUJvZHlDb21wb25lbnQgfSBmcm9tICcuL2JvZHkvYm9keS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGF0YVRhYmxlSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTY3JvbGxiYXJIZWxwZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9zY3JvbGxiYXItaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29sdW1uQ2hhbmdlc1NlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9jb2x1bW4tY2hhbmdlcy5zZXJ2aWNlJztcbmltcG9ydCB7IERpbWVuc2lvbnNIZWxwZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9kaW1lbnNpb25zLWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IHRocm90dGxlYWJsZSB9IGZyb20gJy4uL3V0aWxzL3Rocm90dGxlJztcbmltcG9ydCB7IGZvcmNlRmlsbENvbHVtbldpZHRocywgYWRqdXN0Q29sdW1uV2lkdGhzIH0gZnJvbSAnLi4vdXRpbHMvbWF0aCc7XG5pbXBvcnQgeyBzb3J0Um93cyB9IGZyb20gJy4uL3V0aWxzL3NvcnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZGF0YXRhYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGF0YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFsnLi9kYXRhdGFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbmd4LWRhdGF0YWJsZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBEYXRhdGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQge1xuICAvKipcbiAgICogVGVtcGxhdGUgZm9yIHRoZSB0YXJnZXQgbWFya2VyIG9mIGRyYWcgdGFyZ2V0IGNvbHVtbnMuXG4gICAqL1xuICBASW5wdXQoKSB0YXJnZXRNYXJrZXJUZW1wbGF0ZTogYW55O1xuXG4gIC8qKlxuICAgKiBSb3dzIHRoYXQgYXJlIGRpc3BsYXllZCBpbiB0aGUgdGFibGUuXG4gICAqL1xuICBASW5wdXQoKSBzZXQgcm93cyh2YWw6IGFueSkge1xuICAgIHRoaXMuX3Jvd3MgPSB2YWw7XG5cbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLl9pbnRlcm5hbFJvd3MgPSBbLi4udmFsXTtcbiAgICB9XG5cbiAgICAvLyBhdXRvIHNvcnQgb24gbmV3IHVwZGF0ZXNcbiAgICBpZiAoIXRoaXMuZXh0ZXJuYWxTb3J0aW5nKSB7XG4gICAgICB0aGlzLnNvcnRJbnRlcm5hbFJvd3MoKTtcbiAgICB9XG5cbiAgICAvLyBhdXRvIGdyb3VwIGJ5IHBhcmVudCBvbiBuZXcgdXBkYXRlXG4gICAgdGhpcy5faW50ZXJuYWxSb3dzID0gZ3JvdXBSb3dzQnlQYXJlbnRzKFxuICAgICAgdGhpcy5faW50ZXJuYWxSb3dzLFxuICAgICAgb3B0aW9uYWxHZXR0ZXJGb3JQcm9wKHRoaXMudHJlZUZyb21SZWxhdGlvbiksXG4gICAgICBvcHRpb25hbEdldHRlckZvclByb3AodGhpcy50cmVlVG9SZWxhdGlvbilcbiAgICApO1xuXG4gICAgLy8gcmVjYWxjdWxhdGUgc2l6ZXMvZXRjXG4gICAgdGhpcy5yZWNhbGN1bGF0ZSgpO1xuXG4gICAgaWYgKHRoaXMuX3Jvd3MgJiYgdGhpcy5fZ3JvdXBSb3dzQnkpIHtcbiAgICAgIC8vIElmIGEgY29sdW1uIGhhcyBiZWVuIHNwZWNpZmllZCBpbiBfZ3JvdXBSb3dzQnkgY3JlYXRlZCBhIG5ldyBhcnJheSB3aXRoIHRoZSBkYXRhIGdyb3VwZWQgYnkgdGhhdCByb3dcbiAgICAgIHRoaXMuZ3JvdXBlZFJvd3MgPSB0aGlzLmdyb3VwQXJyYXlCeSh0aGlzLl9yb3dzLCB0aGlzLl9ncm91cFJvd3NCeSk7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSByb3dzLlxuICAgKi9cbiAgZ2V0IHJvd3MoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fcm93cztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBhbGxvd3MgdGhlIHVzZXIgdG8gc2V0IHRoZSBuYW1lIG9mIHRoZSBjb2x1bW4gdG8gZ3JvdXAgdGhlIGRhdGEgd2l0aFxuICAgKi9cbiAgQElucHV0KCkgc2V0IGdyb3VwUm93c0J5KHZhbDogc3RyaW5nKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy5fZ3JvdXBSb3dzQnkgPSB2YWw7XG4gICAgICBpZiAodGhpcy5fcm93cyAmJiB0aGlzLl9ncm91cFJvd3NCeSkge1xuICAgICAgICAvLyBjcmV0ZXMgYSBuZXcgYXJyYXkgd2l0aCB0aGUgZGF0YSBncm91cGVkXG4gICAgICAgIHRoaXMuZ3JvdXBlZFJvd3MgPSB0aGlzLmdyb3VwQXJyYXlCeSh0aGlzLl9yb3dzLCB0aGlzLl9ncm91cFJvd3NCeSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGdyb3VwUm93c0J5KCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cFJvd3NCeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBhbGxvd3MgdGhlIHVzZXIgdG8gc2V0IGEgZ3JvdXBlZCBhcnJheSBpbiB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAgICogIFtcbiAgICogICAge2dyb3VwaWQ9MX0gW1xuICAgKiAgICAgIHtpZD0xIG5hbWU9XCJ0ZXN0MVwifSxcbiAgICogICAgICB7aWQ9MiBuYW1lPVwidGVzdDJcIn0sXG4gICAqICAgICAge2lkPTMgbmFtZT1cInRlc3QzXCJ9XG4gICAqICAgIF19LFxuICAgKiAgICB7Z3JvdXBpZD0yPltcbiAgICogICAgICB7aWQ9NCBuYW1lPVwidGVzdDRcIn0sXG4gICAqICAgICAge2lkPTUgbmFtZT1cInRlc3Q1XCJ9LFxuICAgKiAgICAgIHtpZD02IG5hbWU9XCJ0ZXN0NlwifVxuICAgKiAgICBdfVxuICAgKiAgXVxuICAgKi9cbiAgQElucHV0KCkgZ3JvdXBlZFJvd3M6IGFueVtdO1xuXG4gIC8qKlxuICAgKiBDb2x1bW5zIHRvIGJlIGRpc3BsYXllZC5cbiAgICovXG4gIEBJbnB1dCgpIHNldCBjb2x1bW5zKHZhbDogVGFibGVDb2x1bW5bXSkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMuX2ludGVybmFsQ29sdW1ucyA9IFsuLi52YWxdO1xuICAgICAgc2V0Q29sdW1uRGVmYXVsdHModGhpcy5faW50ZXJuYWxDb2x1bW5zKTtcbiAgICAgIHRoaXMucmVjYWxjdWxhdGVDb2x1bW5zKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fY29sdW1ucyA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvbHVtbnMuXG4gICAqL1xuICBnZXQgY29sdW1ucygpOiBUYWJsZUNvbHVtbltdIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHJvdyBvYmplY3RzIHRoYXQgc2hvdWxkIGJlXG4gICAqIHJlcHJlc2VudGVkIGFzIHNlbGVjdGVkIGluIHRoZSBncmlkLlxuICAgKiBEZWZhdWx0IHZhbHVlOiBgW11gXG4gICAqL1xuICBASW5wdXQoKSBzZWxlY3RlZDogYW55W10gPSBbXTtcblxuICAvKipcbiAgICogRW5hYmxlIHZlcnRpY2FsIHNjcm9sbGJhcnNcbiAgICovXG4gIEBJbnB1dCgpIHNjcm9sbGJhclY6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRW5hYmxlIGhvcnogc2Nyb2xsYmFyc1xuICAgKi9cbiAgQElucHV0KCkgc2Nyb2xsYmFySDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgcm93IGhlaWdodDsgd2hpY2ggaXMgbmVjZXNzYXJ5XG4gICAqIHRvIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0IGZvciB0aGUgbGF6eSByZW5kZXJpbmcuXG4gICAqL1xuICBASW5wdXQoKSByb3dIZWlnaHQ6IG51bWJlciB8ICdhdXRvJyB8ICgocm93PzogYW55KSA9PiBudW1iZXIpID0gMzA7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgY29sdW1uIHdpZHRoIGRpc3RyaWJ1dGlvbiBmb3JtdWxhLlxuICAgKiBFeGFtcGxlOiBmbGV4LCBmb3JjZSwgc3RhbmRhcmRcbiAgICovXG4gIEBJbnB1dCgpIGNvbHVtbk1vZGU6IENvbHVtbk1vZGUgfCBrZXlvZiB0eXBlb2YgQ29sdW1uTW9kZSA9IENvbHVtbk1vZGUuc3RhbmRhcmQ7XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIGhlYWRlciBoZWlnaHQgaW4gcGl4ZWxzLlxuICAgKiBQYXNzIGEgZmFsc2V5IGZvciBubyBoZWFkZXJcbiAgICovXG4gIEBJbnB1dCgpIGhlYWRlckhlaWdodDogbnVtYmVyID0gMzA7XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIGZvb3RlciBoZWlnaHQgaW4gcGl4ZWxzLlxuICAgKiBQYXNzIGZhbHNleSBmb3Igbm8gZm9vdGVyXG4gICAqL1xuICBASW5wdXQoKSBmb290ZXJIZWlnaHQ6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIElmIHRoZSB0YWJsZSBzaG91bGQgdXNlIGV4dGVybmFsIHBhZ2luZ1xuICAgKiBvdGhlcndpc2UgaXRzIGFzc3VtZWQgdGhhdCBhbGwgZGF0YSBpcyBwcmVsb2FkZWQuXG4gICAqL1xuICBASW5wdXQoKSBleHRlcm5hbFBhZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgdGFibGUgc2hvdWxkIHVzZSBleHRlcm5hbCBzb3J0aW5nIG9yXG4gICAqIHRoZSBidWlsdC1pbiBiYXNpYyBzb3J0aW5nLlxuICAgKi9cbiAgQElucHV0KCkgZXh0ZXJuYWxTb3J0aW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBwYWdlIHNpemUgdG8gYmUgc2hvd24uXG4gICAqIERlZmF1bHQgdmFsdWU6IGB1bmRlZmluZWRgXG4gICAqL1xuICBASW5wdXQoKSBzZXQgbGltaXQodmFsOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9saW1pdCA9IHZhbDtcblxuICAgIC8vIHJlY2FsY3VsYXRlIHNpemVzL2V0Y1xuICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsaW1pdC5cbiAgICovXG4gIGdldCBsaW1pdCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9saW1pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgY291bnQgb2YgYWxsIHJvd3MuXG4gICAqIERlZmF1bHQgdmFsdWU6IGAwYFxuICAgKi9cbiAgQElucHV0KCkgc2V0IGNvdW50KHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fY291bnQgPSB2YWw7XG5cbiAgICAvLyByZWNhbGN1bGF0ZSBzaXplcy9ldGNcbiAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY291bnQuXG4gICAqL1xuICBnZXQgY291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgb2Zmc2V0ICggcGFnZSAtIDEgKSBzaG93bi5cbiAgICogRGVmYXVsdCB2YWx1ZTogYDBgXG4gICAqL1xuICBASW5wdXQoKSBzZXQgb2Zmc2V0KHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsO1xuICB9XG4gIGdldCBvZmZzZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fb2Zmc2V0LCBNYXRoLmNlaWwodGhpcy5yb3dDb3VudCAvIHRoaXMucGFnZVNpemUpIC0gMSksIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIGxpbmVhciBsb2FkaW5nIGJhci5cbiAgICogRGVmYXVsdCB2YWx1ZTogYGZhbHNlYFxuICAgKi9cbiAgQElucHV0KCkgbG9hZGluZ0luZGljYXRvcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHJvdyBzZWxlY3Rpb24uIE9wdGlvbnMgYXJlOlxuICAgKlxuICAgKiAgLSBgc2luZ2xlYFxuICAgKiAgLSBgbXVsdGlgXG4gICAqICAtIGBjaGVja2JveGBcbiAgICogIC0gYG11bHRpQ2xpY2tgXG4gICAqICAtIGBjZWxsYFxuICAgKlxuICAgKiBGb3Igbm8gc2VsZWN0aW9uIHBhc3MgYSBgZmFsc2V5YC5cbiAgICogRGVmYXVsdCB2YWx1ZTogYHVuZGVmaW5lZGBcbiAgICovXG4gIEBJbnB1dCgpIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGU7XG5cbiAgLyoqXG4gICAqIEVuYWJsZS9EaXNhYmxlIGFiaWxpdHkgdG8gcmUtb3JkZXIgY29sdW1uc1xuICAgKiBieSBkcmFnZ2luZyB0aGVtLlxuICAgKi9cbiAgQElucHV0KCkgcmVvcmRlcmFibGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBTd2FwIGNvbHVtbnMgb24gcmUtb3JkZXIgY29sdW1ucyBvclxuICAgKiBtb3ZlIHRoZW0uXG4gICAqL1xuICBASW5wdXQoKSBzd2FwQ29sdW1uczogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHNvcnRpbmdcbiAgICovXG4gIEBJbnB1dCgpIHNvcnRUeXBlOiBTb3J0VHlwZSA9IFNvcnRUeXBlLnNpbmdsZTtcblxuICAvKipcbiAgICogQXJyYXkgb2Ygc29ydGVkIGNvbHVtbnMgYnkgcHJvcGVydHkgYW5kIHR5cGUuXG4gICAqIERlZmF1bHQgdmFsdWU6IGBbXWBcbiAgICovXG4gIEBJbnB1dCgpIHNvcnRzOiBhbnlbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBDc3MgY2xhc3Mgb3ZlcnJpZGVzXG4gICAqL1xuICBASW5wdXQoKSBjc3NDbGFzc2VzOiBhbnkgPSB7XG4gICAgc29ydEFzY2VuZGluZzogJ2RhdGF0YWJsZS1pY29uLXVwJyxcbiAgICBzb3J0RGVzY2VuZGluZzogJ2RhdGF0YWJsZS1pY29uLWRvd24nLFxuICAgIHBhZ2VyTGVmdEFycm93OiAnZGF0YXRhYmxlLWljb24tbGVmdCcsXG4gICAgcGFnZXJSaWdodEFycm93OiAnZGF0YXRhYmxlLWljb24tcmlnaHQnLFxuICAgIHBhZ2VyUHJldmlvdXM6ICdkYXRhdGFibGUtaWNvbi1wcmV2JyxcbiAgICBwYWdlck5leHQ6ICdkYXRhdGFibGUtaWNvbi1za2lwJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBNZXNzYWdlIG92ZXJyaWRlcyBmb3IgbG9jYWxpemF0aW9uXG4gICAqXG4gICAqIGVtcHR5TWVzc2FnZSAgICAgW2RlZmF1bHRdID0gJ05vIGRhdGEgdG8gZGlzcGxheSdcbiAgICogdG90YWxNZXNzYWdlICAgICBbZGVmYXVsdF0gPSAndG90YWwnXG4gICAqIHNlbGVjdGVkTWVzc2FnZSAgW2RlZmF1bHRdID0gJ3NlbGVjdGVkJ1xuICAgKi9cbiAgQElucHV0KCkgbWVzc2FnZXM6IGFueSA9IHtcbiAgICAvLyBNZXNzYWdlIHRvIHNob3cgd2hlbiBhcnJheSBpcyBwcmVzZW50ZWRcbiAgICAvLyBidXQgY29udGFpbnMgbm8gdmFsdWVzXG4gICAgZW1wdHlNZXNzYWdlOiAnTm8gZGF0YSB0byBkaXNwbGF5JyxcblxuICAgIC8vIEZvb3RlciB0b3RhbCBtZXNzYWdlXG4gICAgdG90YWxNZXNzYWdlOiAndG90YWwnLFxuXG4gICAgLy8gRm9vdGVyIHNlbGVjdGVkIG1lc3NhZ2VcbiAgICBzZWxlY3RlZE1lc3NhZ2U6ICdzZWxlY3RlZCdcbiAgfTtcblxuICAvKipcbiAgICogUm93IHNwZWNpZmljIGNsYXNzZXMuXG4gICAqIFNpbWlsYXIgaW1wbGVtZW50YXRpb24gdG8gbmdDbGFzcy5cbiAgICpcbiAgICogIFtyb3dDbGFzc109XCInZmlyc3Qgc2Vjb25kJ1wiXG4gICAqICBbcm93Q2xhc3NdPVwieyAnZmlyc3QnOiB0cnVlLCAnc2Vjb25kJzogdHJ1ZSwgJ3RoaXJkJzogZmFsc2UgfVwiXG4gICAqL1xuICBASW5wdXQoKSByb3dDbGFzczogYW55O1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4vZnVuY3Rpb24geW91IGNhbiB1c2UgdG8gY2hlY2sgd2hldGhlciB5b3Ugd2FudFxuICAgKiB0byBzZWxlY3QgYSBwYXJ0aWN1bGFyIHJvdyBiYXNlZCBvbiBhIGNyaXRlcmlhLiBFeGFtcGxlOlxuICAgKlxuICAgKiAgICAoc2VsZWN0aW9uKSA9PiB7XG4gICAqICAgICAgcmV0dXJuIHNlbGVjdGlvbiAhPT0gJ0V0aGVsIFByaWNlJztcbiAgICogICAgfVxuICAgKi9cbiAgQElucHV0KCkgc2VsZWN0Q2hlY2s6IGFueTtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB5b3UgY2FuIHVzZSB0byBjaGVjayB3aGV0aGVyIHlvdSB3YW50XG4gICAqIHRvIHNob3cgdGhlIGNoZWNrYm94IGZvciBhIHBhcnRpY3VsYXIgcm93IGJhc2VkIG9uIGEgY3JpdGVyaWEuIEV4YW1wbGU6XG4gICAqXG4gICAqICAgIChyb3csIGNvbHVtbiwgdmFsdWUpID0+IHtcbiAgICogICAgICByZXR1cm4gcm93Lm5hbWUgIT09ICdFdGhlbCBQcmljZSc7XG4gICAqICAgIH1cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlDaGVjazogKHJvdzogYW55LCBjb2x1bW4/OiBhbnksIHZhbHVlPzogYW55KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4geW91IGNhbiB1c2UgdG8gc2V0IHRoZSBkZXRhdWx0IGJlaGF2aW91ciBvZiByb3dzIGFuZCBncm91cHNcbiAgICogd2hldGhlciB0aGV5IHdpbGwgc3RhcnQgZXhwYW5kZWQgb3Igbm90LiBJZiBvbW1pdGVkIHRoZSBkZWZhdWx0IGlzIE5PVCBleHBhbmRlZC5cbiAgICpcbiAgICovXG4gIEBJbnB1dCgpIGdyb3VwRXhwYW5zaW9uRGVmYXVsdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBQcm9wZXJ0eSB0byB3aGljaCB5b3UgY2FuIHVzZSBmb3IgY3VzdG9tIHRyYWNraW5nIG9mIHJvd3MuXG4gICAqIEV4YW1wbGU6ICduYW1lJ1xuICAgKi9cbiAgQElucHV0KCkgdHJhY2tCeVByb3A6IHN0cmluZztcblxuICAvKipcbiAgICogUHJvcGVydHkgdG8gd2hpY2ggeW91IGNhbiB1c2UgZm9yIGRldGVybWluaW5nIHNlbGVjdCBhbGxcbiAgICogcm93cyBvbiBjdXJyZW50IHBhZ2Ugb3Igbm90LlxuICAgKlxuICAgKiBAbWVtYmVyT2YgRGF0YXRhYmxlQ29tcG9uZW50XG4gICAqL1xuICBASW5wdXQoKSBzZWxlY3RBbGxSb3dzT25QYWdlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBmb3Igcm93IHZpcnR1YWxpemF0aW9uIG9uIC8gb2ZmXG4gICAqL1xuICBASW5wdXQoKSB2aXJ0dWFsaXphdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRyZWUgZnJvbSByZWxhdGlvblxuICAgKi9cbiAgQElucHV0KCkgdHJlZUZyb21SZWxhdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUcmVlIHRvIHJlbGF0aW9uXG4gICAqL1xuICBASW5wdXQoKSB0cmVlVG9SZWxhdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgZm9yIHN3aXRjaGluZyBzdW1tYXJ5IHJvdyBvbiAvIG9mZlxuICAgKi9cbiAgQElucHV0KCkgc3VtbWFyeVJvdzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBIGhlaWdodCBvZiBzdW1tYXJ5IHJvd1xuICAgKi9cbiAgQElucHV0KCkgc3VtbWFyeUhlaWdodDogbnVtYmVyID0gMzA7XG5cbiAgLyoqXG4gICAqIEEgcHJvcGVydHkgaG9sZHMgYSBzdW1tYXJ5IHJvdyBwb3NpdGlvbjogdG9wL2JvdHRvbVxuICAgKi9cbiAgQElucHV0KCkgc3VtbWFyeVBvc2l0aW9uOiBzdHJpbmcgPSAndG9wJztcblxuICAvKipcbiAgICogQm9keSB3YXMgc2Nyb2xsZWQgdHlwaWNhbGx5IGluIGEgYHNjcm9sbGJhclY6dHJ1ZWAgc2NlbmFyaW8uXG4gICAqL1xuICBAT3V0cHV0KCkgc2Nyb2xsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQSBjZWxsIG9yIHJvdyB3YXMgZm9jdXNlZCB2aWEga2V5Ym9hcmQgb3IgbW91c2UgY2xpY2suXG4gICAqL1xuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBBIGNlbGwgb3Igcm93IHdhcyBzZWxlY3RlZC5cbiAgICovXG4gIEBPdXRwdXQoKSBzZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBDb2x1bW4gc29ydCB3YXMgaW52b2tlZC5cbiAgICovXG4gIEBPdXRwdXQoKSBzb3J0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogVGhlIHRhYmxlIHdhcyBwYWdlZCBlaXRoZXIgdHJpZ2dlcmVkIGJ5IHRoZSBwYWdlciBvciB0aGUgYm9keSBzY3JvbGwuXG4gICAqL1xuICBAT3V0cHV0KCkgcGFnZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIENvbHVtbnMgd2VyZSByZS1vcmRlcmVkLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlb3JkZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBDb2x1bW4gd2FzIHJlc2l6ZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVzaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogVGhlIGNvbnRleHQgbWVudSB3YXMgaW52b2tlZCBvbiB0aGUgdGFibGUuXG4gICAqIHR5cGUgaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGhlYWRlciBvciB0aGUgYm9keSB3YXMgY2xpY2tlZC5cbiAgICogY29udGVudCBjb250YWlucyBlaXRoZXIgdGhlIGNvbHVtbiBvciB0aGUgcm93IHRoYXQgd2FzIGNsaWNrZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgdGFibGVDb250ZXh0bWVudSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogTW91c2VFdmVudDsgdHlwZTogQ29udGV4dG1lbnVUeXBlOyBjb250ZW50OiBhbnkgfT4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBBIHJvdyB3YXMgZXhwYW5kZWQgb3QgY29sbGFwc2VkIGZvciB0cmVlXG4gICAqL1xuICBAT3V0cHV0KCkgdHJlZUFjdGlvbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIGlmIHRoZSBoZWFkZXIgaGVpZ2h0IGlmIGZpeGVkIGhlaWdodC5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZml4ZWQtaGVhZGVyJylcbiAgZ2V0IGlzRml4ZWRIZWFkZXIoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgaGVhZGVySGVpZ2h0OiBudW1iZXIgfCBzdHJpbmcgPSB0aGlzLmhlYWRlckhlaWdodDtcbiAgICByZXR1cm4gdHlwZW9mIGhlYWRlckhlaWdodCA9PT0gJ3N0cmluZycgPyA8c3RyaW5nPmhlYWRlckhlaWdodCAhPT0gJ2F1dG8nIDogdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byB0aGUgcm9vdCBlbGVtZW50IGlmXG4gICAqIHRoZSByb3cgaGVpZ2h0cyBhcmUgZml4ZWQgaGVpZ2h0cy5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZml4ZWQtcm93JylcbiAgZ2V0IGlzRml4ZWRSb3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucm93SGVpZ2h0ICE9PSAnYXV0byc7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gcm9vdCBlbGVtZW50IGlmXG4gICAqIHZlcnRpY2FsIHNjcm9sbGluZyBpcyBlbmFibGVkLlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zY3JvbGwtdmVydGljYWwnKVxuICBnZXQgaXNWZXJ0U2Nyb2xsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbGJhclY7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gcm9vdCBlbGVtZW50IGlmXG4gICAqIHZpcnR1YWxpemF0aW9uIGlzIGVuYWJsZWQuXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnZpcnR1YWxpemVkJylcbiAgZ2V0IGlzVmlydHVhbGl6ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmlydHVhbGl6YXRpb247XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gdGhlIHJvb3QgZWxlbWVudFxuICAgKiBpZiB0aGUgaG9yemlvbnRhbCBzY3JvbGxpbmcgaXMgZW5hYmxlZC5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc2Nyb2xsLWhvcnonKVxuICBnZXQgaXNIb3JTY3JvbGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsYmFySDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byByb290IGVsZW1lbnQgaXMgc2VsZWN0YWJsZS5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc2VsZWN0YWJsZScpXG4gIGdldCBpc1NlbGVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uVHlwZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHJvb3QgaXMgY2hlY2tib3ggc2VsZWN0aW9uLlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5jaGVja2JveC1zZWxlY3Rpb24nKVxuICBnZXQgaXNDaGVja2JveFNlbGVjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLmNoZWNrYm94O1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHJvb3QgaWYgY2VsbCBzZWxlY3Rpb24uXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmNlbGwtc2VsZWN0aW9uJylcbiAgZ2V0IGlzQ2VsbFNlbGVjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLmNlbGw7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gcm9vdCBpZiBzaW5nbGUgc2VsZWN0LlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zaW5nbGUtc2VsZWN0aW9uJylcbiAgZ2V0IGlzU2luZ2xlU2VsZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuc2luZ2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhZGRlZCB0byByb290IGVsZW1lbnQgaWYgbXVsaXQgc2VsZWN0XG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm11bHRpLXNlbGVjdGlvbicpXG4gIGdldCBpc011bHRpU2VsZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUubXVsdGk7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFkZGVkIHRvIHJvb3QgZWxlbWVudCBpZiBtdWxpdCBjbGljayBzZWxlY3RcbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MubXVsdGktY2xpY2stc2VsZWN0aW9uJylcbiAgZ2V0IGlzTXVsdGlDbGlja1NlbGVjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLm11bHRpQ2xpY2s7XG4gIH1cblxuICAvKipcbiAgICogQ29sdW1uIHRlbXBsYXRlcyBnYXRoZXJlZCBmcm9tIGBDb250ZW50Q2hpbGRyZW5gXG4gICAqIGlmIGRlc2NyaWJlZCBpbiB5b3VyIG1hcmt1cC5cbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oRGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlKVxuICBzZXQgY29sdW1uVGVtcGxhdGVzKHZhbDogUXVlcnlMaXN0PERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZT4pIHtcbiAgICB0aGlzLl9jb2x1bW5UZW1wbGF0ZXMgPSB2YWw7XG4gICAgdGhpcy50cmFuc2xhdGVDb2x1bW5zKHZhbCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29sdW1uIHRlbXBsYXRlcy5cbiAgICovXG4gIGdldCBjb2x1bW5UZW1wbGF0ZXMoKTogUXVlcnlMaXN0PERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZT4ge1xuICAgIHJldHVybiB0aGlzLl9jb2x1bW5UZW1wbGF0ZXM7XG4gIH1cblxuICAvKipcbiAgICogUm93IERldGFpbCB0ZW1wbGF0ZXMgZ2F0aGVyZWQgZnJvbSB0aGUgQ29udGVudENoaWxkXG4gICAqL1xuICBAQ29udGVudENoaWxkKERhdGF0YWJsZVJvd0RldGFpbERpcmVjdGl2ZSlcbiAgcm93RGV0YWlsOiBEYXRhdGFibGVSb3dEZXRhaWxEaXJlY3RpdmU7XG5cbiAgLyoqXG4gICAqIEdyb3VwIEhlYWRlciB0ZW1wbGF0ZXMgZ2F0aGVyZWQgZnJvbSB0aGUgQ29udGVudENoaWxkXG4gICAqL1xuICBAQ29udGVudENoaWxkKERhdGF0YWJsZUdyb3VwSGVhZGVyRGlyZWN0aXZlKVxuICBncm91cEhlYWRlcjogRGF0YXRhYmxlR3JvdXBIZWFkZXJEaXJlY3RpdmU7XG5cbiAgLyoqXG4gICAqIEZvb3RlciB0ZW1wbGF0ZSBnYXRoZXJlZCBmcm9tIHRoZSBDb250ZW50Q2hpbGRcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoRGF0YXRhYmxlRm9vdGVyRGlyZWN0aXZlKVxuICBmb290ZXI6IERhdGF0YWJsZUZvb3RlckRpcmVjdGl2ZTtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBib2R5IGNvbXBvbmVudCBmb3IgbWFudWFsbHlcbiAgICogaW52b2tpbmcgZnVuY3Rpb25zIG9uIHRoZSBib2R5LlxuICAgKi9cbiAgQFZpZXdDaGlsZChEYXRhVGFibGVCb2R5Q29tcG9uZW50KVxuICBib2R5Q29tcG9uZW50OiBEYXRhVGFibGVCb2R5Q29tcG9uZW50O1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGhlYWRlciBjb21wb25lbnQgZm9yIG1hbnVhbGx5XG4gICAqIGludm9raW5nIGZ1bmN0aW9ucyBvbiB0aGUgaGVhZGVyLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgRGF0YXRhYmxlQ29tcG9uZW50XG4gICAqL1xuICBAVmlld0NoaWxkKERhdGFUYWJsZUhlYWRlckNvbXBvbmVudClcbiAgaGVhZGVyQ29tcG9uZW50OiBEYXRhVGFibGVIZWFkZXJDb21wb25lbnQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgYWxsIHJvd3MgYXJlIHNlbGVjdGVkLlxuICAgKi9cbiAgZ2V0IGFsbFJvd3NTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICBsZXQgYWxsUm93c1NlbGVjdGVkID0gdGhpcy5yb3dzICYmIHRoaXMuc2VsZWN0ZWQgJiYgdGhpcy5zZWxlY3RlZC5sZW5ndGggPT09IHRoaXMucm93cy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5ib2R5Q29tcG9uZW50ICYmIHRoaXMuc2VsZWN0QWxsUm93c09uUGFnZSkge1xuICAgICAgY29uc3QgaW5kZXhlcyA9IHRoaXMuYm9keUNvbXBvbmVudC5pbmRleGVzO1xuICAgICAgY29uc3Qgcm93c09uUGFnZSA9IGluZGV4ZXMubGFzdCAtIGluZGV4ZXMuZmlyc3Q7XG4gICAgICBhbGxSb3dzU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gcm93c09uUGFnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZCAmJiB0aGlzLnJvd3MgJiYgdGhpcy5yb3dzLmxlbmd0aCAhPT0gMCAmJiBhbGxSb3dzU2VsZWN0ZWQ7XG4gIH1cblxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgX2lubmVyV2lkdGg6IG51bWJlcjtcbiAgcGFnZVNpemU6IG51bWJlcjtcbiAgYm9keUhlaWdodDogbnVtYmVyO1xuICByb3dDb3VudDogbnVtYmVyID0gMDtcbiAgcm93RGlmZmVyOiBLZXlWYWx1ZURpZmZlcjx7fSwge30+O1xuXG4gIF9vZmZzZXRYID0gbmV3IEJlaGF2aW9yU3ViamVjdCgwKTtcbiAgX2xpbWl0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIF9jb3VudDogbnVtYmVyID0gMDtcbiAgX29mZnNldDogbnVtYmVyID0gMDtcbiAgX3Jvd3M6IGFueVtdO1xuICBfZ3JvdXBSb3dzQnk6IHN0cmluZztcbiAgX2ludGVybmFsUm93czogYW55W107XG4gIF9pbnRlcm5hbENvbHVtbnM6IFRhYmxlQ29sdW1uW107XG4gIF9jb2x1bW5zOiBUYWJsZUNvbHVtbltdO1xuICBfY29sdW1uVGVtcGxhdGVzOiBRdWVyeUxpc3Q8RGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlPjtcbiAgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQFNraXBTZWxmKCkgcHJpdmF0ZSBzY3JvbGxiYXJIZWxwZXI6IFNjcm9sbGJhckhlbHBlcixcbiAgICBAU2tpcFNlbGYoKSBwcml2YXRlIGRpbWVuc2lvbnNIZWxwZXI6IERpbWVuc2lvbnNIZWxwZXIsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXG4gICAgcHJpdmF0ZSBjb2x1bW5DaGFuZ2VzU2VydmljZTogQ29sdW1uQ2hhbmdlc1NlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdCgnY29uZmlndXJhdGlvbicpIHByaXZhdGUgY29uZmlndXJhdGlvbjogSU5neERhdGF0YWJsZUNvbmZpZ1xuICApIHtcbiAgICAvLyBnZXQgcmVmIHRvIGVsbSBmb3IgbWVhc3VyaW5nXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMucm93RGlmZmVyID0gZGlmZmVycy5maW5kKHt9KS5jcmVhdGUoKTtcblxuICAgIC8vIGFwcGx5IGdsb2JhbCBzZXR0aW5ncyBmcm9tIE1vZHVsZS5mb3JSb290XG4gICAgaWYgKHRoaXMuY29uZmlndXJhdGlvbiAmJiB0aGlzLmNvbmZpZ3VyYXRpb24ubWVzc2FnZXMpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSB7IC4uLnRoaXMuY29uZmlndXJhdGlvbi5tZXNzYWdlcyB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMaWZlY3ljbGUgaG9vayB0aGF0IGlzIGNhbGxlZCBhZnRlciBkYXRhLWJvdW5kXG4gICAqIHByb3BlcnRpZXMgb2YgYSBkaXJlY3RpdmUgYXJlIGluaXRpYWxpemVkLlxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gbmVlZCB0byBjYWxsIHRoaXMgaW1tZWRpYXRseSB0byBzaXplXG4gICAgLy8gaWYgdGhlIHRhYmxlIGlzIGhpZGRlbiB0aGUgdmlzaWJpbGl0eVxuICAgIC8vIGxpc3RlbmVyIHdpbGwgaW52b2tlIHRoaXMgaXRzZWxmIHVwb24gc2hvd1xuICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWZlY3ljbGUgaG9vayB0aGF0IGlzIGNhbGxlZCBhZnRlciBhIGNvbXBvbmVudCdzXG4gICAqIHZpZXcgaGFzIGJlZW4gZnVsbHkgaW5pdGlhbGl6ZWQuXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmV4dGVybmFsU29ydGluZykge1xuICAgICAgdGhpcy5zb3J0SW50ZXJuYWxSb3dzKCk7XG4gICAgfVxuXG4gICAgLy8gdGhpcyBoYXMgdG8gYmUgZG9uZSB0byBwcmV2ZW50IHRoZSBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAgLy8gdHJlZSBmcm9tIGZyZWFraW5nIG91dCBiZWNhdXNlIHdlIGFyZSByZWFkanVzdGluZ1xuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XG5cbiAgICAgIC8vIGVtaXQgcGFnZSBmb3IgdmlydHVhbCBzZXJ2ZXItc2lkZSBraWNrb2ZmXG4gICAgICBpZiAodGhpcy5leHRlcm5hbFBhZ2luZyAmJiB0aGlzLnNjcm9sbGJhclYpIHtcbiAgICAgICAgdGhpcy5wYWdlLmVtaXQoe1xuICAgICAgICAgIGNvdW50OiB0aGlzLmNvdW50LFxuICAgICAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgICAgIGxpbWl0OiB0aGlzLmxpbWl0LFxuICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWZlY3ljbGUgaG9vayB0aGF0IGlzIGNhbGxlZCBhZnRlciBhIGNvbXBvbmVudCdzXG4gICAqIGNvbnRlbnQgaGFzIGJlZW4gZnVsbHkgaW5pdGlhbGl6ZWQuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5jb2x1bW5UZW1wbGF0ZXMuY2hhbmdlcy5zdWJzY3JpYmUodiA9PiB0aGlzLnRyYW5zbGF0ZUNvbHVtbnModikpO1xuICAgIHRoaXMubGlzdGVuRm9yQ29sdW1uSW5wdXRDaGFuZ2VzKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyB3aWxsIGJlIHVzZWQgd2hlbiBkaXNwbGF5aW5nIG9yIHNlbGVjdGluZyByb3dzLlxuICAgKiB3aGVuIHRyYWNraW5nL2NvbXBhcmluZyB0aGVtLCB3ZSdsbCB1c2UgdGhlIHZhbHVlIG9mIHRoaXMgZm4sXG4gICAqXG4gICAqIChgZm4oeCkgPT09IGZuKHkpYCBpbnN0ZWFkIG9mIGB4ID09PSB5YClcbiAgICovXG4gIEBJbnB1dCgpIHJvd0lkZW50aXR5OiAoeDogYW55KSA9PiBhbnkgPSAoeDogYW55KSA9PiB7XG4gICAgaWYgKHRoaXMuX2dyb3VwUm93c0J5KSB7XG4gICAgICAvLyBlYWNoIGdyb3VwIGluIGdyb3VwZWRSb3dzIGFyZSBzdG9yZWQgYXMge2tleSwgdmFsdWU6IFtyb3dzXX0sXG4gICAgICAvLyB3aGVyZSBrZXkgaXMgdGhlIGdyb3VwUm93c0J5IGluZGV4XG4gICAgICByZXR1cm4geC5rZXk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVHJhbnNsYXRlcyB0aGUgdGVtcGxhdGVzIHRvIHRoZSBjb2x1bW4gb2JqZWN0c1xuICAgKi9cbiAgdHJhbnNsYXRlQ29sdW1ucyh2YWw6IGFueSkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIGNvbnN0IGFyciA9IHZhbC50b0FycmF5KCk7XG4gICAgICBpZiAoYXJyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9pbnRlcm5hbENvbHVtbnMgPSB0cmFuc2xhdGVUZW1wbGF0ZXMoYXJyKTtcbiAgICAgICAgc2V0Q29sdW1uRGVmYXVsdHModGhpcy5faW50ZXJuYWxDb2x1bW5zKTtcbiAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZUNvbHVtbnMoKTtcbiAgICAgICAgdGhpcy5zb3J0SW50ZXJuYWxSb3dzKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBtYXAgd2l0aCB0aGUgZGF0YSBncm91cGVkIGJ5IHRoZSB1c2VyIGNob2ljZSBvZiBncm91cGluZyBpbmRleFxuICAgKlxuICAgKiBAcGFyYW0gb3JpZ2luYWxBcnJheSB0aGUgb3JpZ2luYWwgYXJyYXkgcGFzc2VkIHZpYSBwYXJhbWV0ZXJcbiAgICogQHBhcmFtIGdyb3VwQnlJbmRleCAgdGhlIGluZGV4IG9mIHRoZSBjb2x1bW4gdG8gZ3JvdXAgdGhlIGRhdGEgYnlcbiAgICovXG4gIGdyb3VwQXJyYXlCeShvcmlnaW5hbEFycmF5OiBhbnksIGdyb3VwQnk6IGFueSkge1xuICAgIC8vIGNyZWF0ZSBhIG1hcCB0byBob2xkIGdyb3VwcyB3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgcmVzdWx0c1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICBsZXQgaTogbnVtYmVyID0gMDtcblxuICAgIG9yaWdpbmFsQXJyYXkuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSBpdGVtW2dyb3VwQnldO1xuICAgICAgaWYgKCFtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgbWFwLnNldChrZXksIFtpdGVtXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXAuZ2V0KGtleSkucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9KTtcblxuICAgIGNvbnN0IGFkZEdyb3VwID0gKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB7XG4gICAgICByZXR1cm4geyBrZXksIHZhbHVlIH07XG4gICAgfTtcblxuICAgIC8vIGNvbnZlcnQgbWFwIGJhY2sgdG8gYSBzaW1wbGUgYXJyYXkgb2Ygb2JqZWN0c1xuICAgIHJldHVybiBBcnJheS5mcm9tKG1hcCwgeCA9PiBhZGRHcm91cCh4WzBdLCB4WzFdKSk7XG4gIH1cblxuICAvKlxuICAgKiBMaWZlY3ljbGUgaG9vayB0aGF0IGlzIGNhbGxlZCB3aGVuIEFuZ3VsYXIgZGlydHkgY2hlY2tzIGEgZGlyZWN0aXZlLlxuICAgKi9cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvd0RpZmZlci5kaWZmKHRoaXMucm93cykpIHtcbiAgICAgIGlmICghdGhpcy5leHRlcm5hbFNvcnRpbmcpIHtcbiAgICAgICAgdGhpcy5zb3J0SW50ZXJuYWxSb3dzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pbnRlcm5hbFJvd3MgPSBbLi4udGhpcy5yb3dzXTtcbiAgICAgIH1cblxuICAgICAgLy8gYXV0byBncm91cCBieSBwYXJlbnQgb24gbmV3IHVwZGF0ZVxuICAgICAgdGhpcy5faW50ZXJuYWxSb3dzID0gZ3JvdXBSb3dzQnlQYXJlbnRzKFxuICAgICAgICB0aGlzLl9pbnRlcm5hbFJvd3MsXG4gICAgICAgIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCh0aGlzLnRyZWVGcm9tUmVsYXRpb24pLFxuICAgICAgICBvcHRpb25hbEdldHRlckZvclByb3AodGhpcy50cmVlVG9SZWxhdGlvbilcbiAgICAgICk7XG5cbiAgICAgIHRoaXMucmVjYWxjdWxhdGVQYWdlcygpO1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjJ3MgdGhlIHNpemVzIG9mIHRoZSBncmlkLlxuICAgKlxuICAgKiBVcGRhdGVkIGF1dG9tYXRpY2FsbHkgb24gY2hhbmdlcyB0bzpcbiAgICpcbiAgICogIC0gQ29sdW1uc1xuICAgKiAgLSBSb3dzXG4gICAqICAtIFBhZ2luZyByZWxhdGVkXG4gICAqXG4gICAqIEFsc28gY2FuIGJlIG1hbnVhbGx5IGludm9rZWQgb3IgdXBvbiB3aW5kb3cgcmVzaXplLlxuICAgKi9cbiAgcmVjYWxjdWxhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5yZWNhbGN1bGF0ZURpbXMoKTtcbiAgICB0aGlzLnJlY2FsY3VsYXRlQ29sdW1ucygpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogV2luZG93IHJlc2l6ZSBoYW5kbGVyIHRvIHVwZGF0ZSBzaXplcy5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBAdGhyb3R0bGVhYmxlKDUpXG4gIG9uV2luZG93UmVzaXplKCk6IHZvaWQge1xuICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbHVsY2F0ZXMgdGhlIGNvbHVtbiB3aWR0aHMgYmFzZWQgb24gY29sdW1uIHdpZHRoXG4gICAqIGRpc3RyaWJ1dGlvbiBtb2RlIGFuZCBzY3JvbGxiYXIgb2Zmc2V0cy5cbiAgICovXG4gIHJlY2FsY3VsYXRlQ29sdW1ucyhcbiAgICBjb2x1bW5zOiBhbnlbXSA9IHRoaXMuX2ludGVybmFsQ29sdW1ucyxcbiAgICBmb3JjZUlkeDogbnVtYmVyID0gLTEsXG4gICAgYWxsb3dCbGVlZDogYm9vbGVhbiA9IHRoaXMuc2Nyb2xsYmFySFxuICApOiBhbnlbXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFjb2x1bW5zKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgbGV0IHdpZHRoID0gdGhpcy5faW5uZXJXaWR0aDtcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWKSB7XG4gICAgICB3aWR0aCA9IHdpZHRoIC0gdGhpcy5zY3JvbGxiYXJIZWxwZXIud2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sdW1uTW9kZSA9PT0gQ29sdW1uTW9kZS5mb3JjZSkge1xuICAgICAgZm9yY2VGaWxsQ29sdW1uV2lkdGhzKGNvbHVtbnMsIHdpZHRoLCBmb3JjZUlkeCwgYWxsb3dCbGVlZCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbHVtbk1vZGUgPT09IENvbHVtbk1vZGUuZmxleCkge1xuICAgICAgYWRqdXN0Q29sdW1uV2lkdGhzKGNvbHVtbnMsIHdpZHRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHRhYmxlIHNpemUuXG4gICAqIEludGVybmFsbHkgY2FsbHMgdGhlIHBhZ2Ugc2l6ZSBhbmQgcm93IGNvdW50IGNhbGNzIHRvby5cbiAgICpcbiAgICovXG4gIHJlY2FsY3VsYXRlRGltcygpOiB2b2lkIHtcbiAgICBjb25zdCBkaW1zID0gdGhpcy5kaW1lbnNpb25zSGVscGVyLmdldERpbWVuc2lvbnModGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLl9pbm5lcldpZHRoID0gTWF0aC5mbG9vcihkaW1zLndpZHRoKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYpIHtcbiAgICAgIGxldCBoZWlnaHQgPSBkaW1zLmhlaWdodDtcbiAgICAgIGlmICh0aGlzLmhlYWRlckhlaWdodCkgaGVpZ2h0ID0gaGVpZ2h0IC0gdGhpcy5oZWFkZXJIZWlnaHQ7XG4gICAgICBpZiAodGhpcy5mb290ZXJIZWlnaHQpIGhlaWdodCA9IGhlaWdodCAtIHRoaXMuZm9vdGVySGVpZ2h0O1xuICAgICAgdGhpcy5ib2R5SGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIHRoaXMucmVjYWxjdWxhdGVQYWdlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgcGFnZXMgYWZ0ZXIgYSB1cGRhdGUuXG4gICAqL1xuICByZWNhbGN1bGF0ZVBhZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMucGFnZVNpemUgPSB0aGlzLmNhbGNQYWdlU2l6ZSgpO1xuICAgIHRoaXMucm93Q291bnQgPSB0aGlzLmNhbGNSb3dDb3VudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJvZHkgdHJpZ2dlcmVkIGEgcGFnZSBldmVudC5cbiAgICovXG4gIG9uQm9keVBhZ2UoeyBvZmZzZXQgfTogYW55KTogdm9pZCB7XG4gICAgLy8gQXZvaWQgcGFnaW5hdGlvbiBjYW1pbmcgZnJvbSBib2R5IGV2ZW50cyBsaWtlIHNjcm9sbCB3aGVuIHRoZSB0YWJsZVxuICAgIC8vIGhhcyBubyB2aXJ0dWFsaXphdGlvbiBhbmQgdGhlIGV4dGVybmFsIHBhZ2luZyBpcyBlbmFibGUuXG4gICAgLy8gVGhpcyBtZWFucywgbGV0J3MgdGhlIGRldmVsb3BlciBoYW5kbGUgcGFnaW5hdGlvbiBieSBteSBoaW0oaGVyKSBzZWxmXG4gICAgaWYgKHRoaXMuZXh0ZXJuYWxQYWdpbmcgJiYgIXRoaXMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcblxuICAgIHRoaXMucGFnZS5lbWl0KHtcbiAgICAgIGNvdW50OiB0aGlzLmNvdW50LFxuICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICBsaW1pdDogdGhpcy5saW1pdCxcbiAgICAgIG9mZnNldDogdGhpcy5vZmZzZXRcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYm9keSB0cmlnZ2VyZWQgYSBzY3JvbGwgZXZlbnQuXG4gICAqL1xuICBvbkJvZHlTY3JvbGwoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLl9vZmZzZXRYLm5leHQoZXZlbnQub2Zmc2V0WCk7XG4gICAgdGhpcy5zY3JvbGwuZW1pdChldmVudCk7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGZvb3RlciB0cmlnZ2VyZWQgYSBwYWdlIGV2ZW50LlxuICAgKi9cbiAgb25Gb290ZXJQYWdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLm9mZnNldCA9IGV2ZW50LnBhZ2UgLSAxO1xuICAgIHRoaXMuYm9keUNvbXBvbmVudC51cGRhdGVPZmZzZXRZKHRoaXMub2Zmc2V0KTtcblxuICAgIHRoaXMucGFnZS5lbWl0KHtcbiAgICAgIGNvdW50OiB0aGlzLmNvdW50LFxuICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICBsaW1pdDogdGhpcy5saW1pdCxcbiAgICAgIG9mZnNldDogdGhpcy5vZmZzZXRcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnNlbGVjdEFsbFJvd3NPblBhZ2UpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICAgIHRoaXMuc2VsZWN0LmVtaXQoe1xuICAgICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgc2l6ZXMgb2YgdGhlIHBhZ2VcbiAgICovXG4gIGNhbGNQYWdlU2l6ZSh2YWw6IGFueVtdID0gdGhpcy5yb3dzKTogbnVtYmVyIHtcbiAgICAvLyBLZWVwIHRoZSBwYWdlIHNpemUgY29uc3RhbnQgZXZlbiBpZiB0aGUgcm93IGhhcyBiZWVuIGV4cGFuZGVkLlxuICAgIC8vIFRoaXMgaXMgYmVjYXVzZSBhbiBleHBhbmRlZCByb3cgaXMgc3RpbGwgY29uc2lkZXJlZCB0byBiZSBhIGNoaWxkIG9mXG4gICAgLy8gdGhlIG9yaWdpbmFsIHJvdy4gIEhlbmNlIGNhbGN1bGF0aW9uIHdvdWxkIHVzZSByb3dIZWlnaHQgb25seS5cbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgIGNvbnN0IHNpemUgPSBNYXRoLmNlaWwodGhpcy5ib2R5SGVpZ2h0IC8gKHRoaXMucm93SGVpZ2h0IGFzIG51bWJlcikpO1xuICAgICAgcmV0dXJuIE1hdGgubWF4KHNpemUsIDApO1xuICAgIH1cblxuICAgIC8vIGlmIGxpbWl0IGlzIHBhc3NlZCwgd2UgYXJlIHBhZ2luZ1xuICAgIGlmICh0aGlzLmxpbWl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpbWl0O1xuICAgIH1cblxuICAgIC8vIG90aGVyd2lzZSB1c2Ugcm93IGxlbmd0aFxuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIG90aGVyIGVtcHR5IDooXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgcm93IGNvdW50LlxuICAgKi9cbiAgY2FsY1Jvd0NvdW50KHZhbDogYW55W10gPSB0aGlzLnJvd3MpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5leHRlcm5hbFBhZ2luZykge1xuICAgICAgaWYgKCF2YWwpIHJldHVybiAwO1xuXG4gICAgICBpZiAodGhpcy5ncm91cGVkUm93cykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cGVkUm93cy5sZW5ndGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudHJlZUZyb21SZWxhdGlvbiAhPSBudWxsICYmIHRoaXMudHJlZVRvUmVsYXRpb24gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJuYWxSb3dzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWwubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXIgdHJpZ2dlcmVkIGEgY29udGV4dG1lbnUgZXZlbnQuXG4gICAqL1xuICBvbkNvbHVtbkNvbnRleHRtZW51KHsgZXZlbnQsIGNvbHVtbiB9OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlQ29udGV4dG1lbnUuZW1pdCh7IGV2ZW50LCB0eXBlOiBDb250ZXh0bWVudVR5cGUuaGVhZGVyLCBjb250ZW50OiBjb2x1bW4gfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJvZHkgdHJpZ2dlcmVkIGEgY29udGV4dG1lbnUgZXZlbnQuXG4gICAqL1xuICBvblJvd0NvbnRleHRtZW51KHsgZXZlbnQsIHJvdyB9OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlQ29udGV4dG1lbnUuZW1pdCh7IGV2ZW50LCB0eXBlOiBDb250ZXh0bWVudVR5cGUuYm9keSwgY29udGVudDogcm93IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXIgdHJpZ2dlcmVkIGEgY29sdW1uIHJlc2l6ZSBldmVudC5cbiAgICovXG4gIG9uQ29sdW1uUmVzaXplKHsgY29sdW1uLCBuZXdWYWx1ZSB9OiBhbnkpOiB2b2lkIHtcbiAgICAvKiBTYWZhcmkvaU9TIDEwLjIgd29ya2Fyb3VuZCAqL1xuICAgIGlmIChjb2x1bW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpZHg6IG51bWJlcjtcbiAgICBjb25zdCBjb2xzID0gdGhpcy5faW50ZXJuYWxDb2x1bW5zLm1hcCgoYywgaSkgPT4ge1xuICAgICAgYyA9IHsgLi4uYyB9O1xuXG4gICAgICBpZiAoYy4kJGlkID09PSBjb2x1bW4uJCRpZCkge1xuICAgICAgICBpZHggPSBpO1xuICAgICAgICBjLndpZHRoID0gbmV3VmFsdWU7XG5cbiAgICAgICAgLy8gc2V0IHRoaXMgc28gd2UgY2FuIGZvcmNlIHRoZSBjb2x1bW5cbiAgICAgICAgLy8gd2lkdGggZGlzdHJpYnV0aW9uIHRvIGJlIHRvIHRoaXMgdmFsdWVcbiAgICAgICAgYy4kJG9sZFdpZHRoID0gbmV3VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUNvbHVtbnMoY29scywgaWR4KTtcbiAgICB0aGlzLl9pbnRlcm5hbENvbHVtbnMgPSBjb2xzO1xuXG4gICAgdGhpcy5yZXNpemUuZW1pdCh7XG4gICAgICBjb2x1bW4sXG4gICAgICBuZXdWYWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXIgdHJpZ2dlcmVkIGEgY29sdW1uIHJlLW9yZGVyIGV2ZW50LlxuICAgKi9cbiAgb25Db2x1bW5SZW9yZGVyKHsgY29sdW1uLCBuZXdWYWx1ZSwgcHJldlZhbHVlIH06IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbHMgPSB0aGlzLl9pbnRlcm5hbENvbHVtbnMubWFwKGMgPT4ge1xuICAgICAgcmV0dXJuIHsgLi4uYyB9O1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuc3dhcENvbHVtbnMpIHtcbiAgICAgIGNvbnN0IHByZXZDb2wgPSBjb2xzW25ld1ZhbHVlXTtcbiAgICAgIGNvbHNbbmV3VmFsdWVdID0gY29sdW1uO1xuICAgICAgY29sc1twcmV2VmFsdWVdID0gcHJldkNvbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld1ZhbHVlID4gcHJldlZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG1vdmVkQ29sID0gY29sc1twcmV2VmFsdWVdO1xuICAgICAgICBmb3IgKGxldCBpID0gcHJldlZhbHVlOyBpIDwgbmV3VmFsdWU7IGkrKykge1xuICAgICAgICAgIGNvbHNbaV0gPSBjb2xzW2kgKyAxXTtcbiAgICAgICAgfVxuICAgICAgICBjb2xzW25ld1ZhbHVlXSA9IG1vdmVkQ29sO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbW92ZWRDb2wgPSBjb2xzW3ByZXZWYWx1ZV07XG4gICAgICAgIGZvciAobGV0IGkgPSBwcmV2VmFsdWU7IGkgPiBuZXdWYWx1ZTsgaS0tKSB7XG4gICAgICAgICAgY29sc1tpXSA9IGNvbHNbaSAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIGNvbHNbbmV3VmFsdWVdID0gbW92ZWRDb2w7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5faW50ZXJuYWxDb2x1bW5zID0gY29scztcblxuICAgIHRoaXMucmVvcmRlci5lbWl0KHtcbiAgICAgIGNvbHVtbixcbiAgICAgIG5ld1ZhbHVlLFxuICAgICAgcHJldlZhbHVlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGhlYWRlciB0cmlnZ2VyZWQgYSBjb2x1bW4gc29ydCBldmVudC5cbiAgICovXG4gIG9uQ29sdW1uU29ydChldmVudDogYW55KTogdm9pZCB7XG4gICAgLy8gY2xlYW4gc2VsZWN0ZWQgcm93c1xuICAgIGlmICh0aGlzLnNlbGVjdEFsbFJvd3NPblBhZ2UpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICAgIHRoaXMuc2VsZWN0LmVtaXQoe1xuICAgICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zb3J0cyA9IGV2ZW50LnNvcnRzO1xuXG4gICAgLy8gdGhpcyBjb3VsZCBiZSBvcHRpbWl6ZWQgYmV0dGVyIHNpbmNlIGl0IHdpbGwgcmVzb3J0XG4gICAgLy8gdGhlIHJvd3MgYWdhaW4gb24gdGhlICdwdXNoJyBkZXRlY3Rpb24uLi5cbiAgICBpZiAodGhpcy5leHRlcm5hbFNvcnRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAvLyBkb24ndCB1c2Ugbm9ybWFsIHNldHRlciBzbyB3ZSBkb24ndCByZXNvcnRcbiAgICAgIHRoaXMuc29ydEludGVybmFsUm93cygpO1xuICAgIH1cblxuICAgIC8vIGF1dG8gZ3JvdXAgYnkgcGFyZW50IG9uIG5ldyB1cGRhdGVcbiAgICB0aGlzLl9pbnRlcm5hbFJvd3MgPSBncm91cFJvd3NCeVBhcmVudHMoXG4gICAgICB0aGlzLl9pbnRlcm5hbFJvd3MsXG4gICAgICBvcHRpb25hbEdldHRlckZvclByb3AodGhpcy50cmVlRnJvbVJlbGF0aW9uKSxcbiAgICAgIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCh0aGlzLnRyZWVUb1JlbGF0aW9uKVxuICAgICk7XG5cbiAgICAvLyBBbHdheXMgZ28gdG8gZmlyc3QgcGFnZSB3aGVuIHNvcnRpbmcgdG8gc2VlIHRoZSBuZXdseSBzb3J0ZWQgZGF0YVxuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB0aGlzLmJvZHlDb21wb25lbnQudXBkYXRlT2Zmc2V0WSh0aGlzLm9mZnNldCk7XG4gICAgdGhpcy5zb3J0LmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBhbGwgcm93IHNlbGVjdGlvblxuICAgKi9cbiAgb25IZWFkZXJTZWxlY3QoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmJvZHlDb21wb25lbnQgJiYgdGhpcy5zZWxlY3RBbGxSb3dzT25QYWdlKSB7XG4gICAgICAvLyBiZWZvcmUgd2Ugc3BsaWNlLCBjaGsgaWYgd2UgY3VycmVudGx5IGhhdmUgYWxsIHNlbGVjdGVkXG4gICAgICBjb25zdCBmaXJzdCA9IHRoaXMuYm9keUNvbXBvbmVudC5pbmRleGVzLmZpcnN0O1xuICAgICAgY29uc3QgbGFzdCA9IHRoaXMuYm9keUNvbXBvbmVudC5pbmRleGVzLmxhc3Q7XG4gICAgICBjb25zdCBhbGxTZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09PSBsYXN0IC0gZmlyc3Q7XG5cbiAgICAgIC8vIHJlbW92ZSBhbGwgZXhpc3RpbmcgZWl0aGVyIHdheVxuICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuXG4gICAgICAvLyBkbyB0aGUgb3Bwb3NpdGUgaGVyZVxuICAgICAgaWYgKCFhbGxTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLnB1c2goLi4udGhpcy5faW50ZXJuYWxSb3dzLnNsaWNlKGZpcnN0LCBsYXN0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGJlZm9yZSB3ZSBzcGxpY2UsIGNoayBpZiB3ZSBjdXJyZW50bHkgaGF2ZSBhbGwgc2VsZWN0ZWRcbiAgICAgIGNvbnN0IGFsbFNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZC5sZW5ndGggPT09IHRoaXMucm93cy5sZW5ndGg7XG4gICAgICAvLyByZW1vdmUgYWxsIGV4aXN0aW5nIGVpdGhlciB3YXlcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICAgIC8vIGRvIHRoZSBvcHBvc2l0ZSBoZXJlXG4gICAgICBpZiAoIWFsbFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQucHVzaCguLi50aGlzLnJvd3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0LmVtaXQoe1xuICAgICAgc2VsZWN0ZWQ6IHRoaXMuc2VsZWN0ZWRcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJvdyB3YXMgc2VsZWN0ZWQgZnJvbSBib2R5XG4gICAqL1xuICBvbkJvZHlTZWxlY3QoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0LmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcm93IHdhcyBleHBhbmRlZCBvciBjb2xsYXBzZWQgZm9yIHRyZWVcbiAgICovXG4gIG9uVHJlZUFjdGlvbihldmVudDogYW55KSB7XG4gICAgY29uc3Qgcm93ID0gZXZlbnQucm93O1xuICAgIC8vIFRPRE86IEZvciBkdXBsaWNhdGVkIGl0ZW1zIHRoaXMgd2lsbCBub3Qgd29ya1xuICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5fcm93cy5maW5kSW5kZXgociA9PiByW3RoaXMudHJlZVRvUmVsYXRpb25dID09PSBldmVudC5yb3dbdGhpcy50cmVlVG9SZWxhdGlvbl0pO1xuICAgIHRoaXMudHJlZUFjdGlvbi5lbWl0KHsgcm93LCByb3dJbmRleCB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWJzY3JpcHRpb24gPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxpc3RlbiBmb3IgY2hhbmdlcyB0byBpbnB1dCBiaW5kaW5ncyBvZiBhbGwgRGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlIGFuZFxuICAgKiB0cmlnZ2VyIHRoZSBjb2x1bW5UZW1wbGF0ZXMuY2hhbmdlcyBvYnNlcnZhYmxlIHRvIGVtaXRcbiAgICovXG4gIHByaXZhdGUgbGlzdGVuRm9yQ29sdW1uSW5wdXRDaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuY29sdW1uQ2hhbmdlc1NlcnZpY2UuY29sdW1uSW5wdXRDaGFuZ2VzJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jb2x1bW5UZW1wbGF0ZXMpIHtcbiAgICAgICAgICB0aGlzLmNvbHVtblRlbXBsYXRlcy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzb3J0SW50ZXJuYWxSb3dzKCk6IHZvaWQge1xuICAgIHRoaXMuX2ludGVybmFsUm93cyA9IHNvcnRSb3dzKHRoaXMuX2ludGVybmFsUm93cywgdGhpcy5faW50ZXJuYWxDb2x1bW5zLCB0aGlzLnNvcnRzKTtcbiAgfVxufVxuIl19