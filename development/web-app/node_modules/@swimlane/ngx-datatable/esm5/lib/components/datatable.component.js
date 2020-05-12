import { __assign, __decorate, __param, __read, __spread } from "tslib";
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
var DatatableComponent = /** @class */ (function () {
    function DatatableComponent(scrollbarHelper, dimensionsHelper, cd, element, differs, columnChangesService, configuration) {
        var _this = this;
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
        this.rowIdentity = function (x) {
            if (_this._groupRowsBy) {
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
            this.messages = __assign({}, this.configuration.messages);
        }
    }
    Object.defineProperty(DatatableComponent.prototype, "rows", {
        /**
         * Gets the rows.
         */
        get: function () {
            return this._rows;
        },
        /**
         * Rows that are displayed in the table.
         */
        set: function (val) {
            this._rows = val;
            if (val) {
                this._internalRows = __spread(val);
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "groupRowsBy", {
        get: function () {
            return this._groupRowsBy;
        },
        /**
         * This attribute allows the user to set the name of the column to group the data with
         */
        set: function (val) {
            if (val) {
                this._groupRowsBy = val;
                if (this._rows && this._groupRowsBy) {
                    // cretes a new array with the data grouped
                    this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "columns", {
        /**
         * Get the columns.
         */
        get: function () {
            return this._columns;
        },
        /**
         * Columns to be displayed.
         */
        set: function (val) {
            if (val) {
                this._internalColumns = __spread(val);
                setColumnDefaults(this._internalColumns);
                this.recalculateColumns();
            }
            this._columns = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "limit", {
        /**
         * Gets the limit.
         */
        get: function () {
            return this._limit;
        },
        /**
         * The page size to be shown.
         * Default value: `undefined`
         */
        set: function (val) {
            this._limit = val;
            // recalculate sizes/etc
            this.recalculate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "count", {
        /**
         * Gets the count.
         */
        get: function () {
            return this._count;
        },
        /**
         * The total count of all rows.
         * Default value: `0`
         */
        set: function (val) {
            this._count = val;
            // recalculate sizes/etc
            this.recalculate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "offset", {
        get: function () {
            return Math.max(Math.min(this._offset, Math.ceil(this.rowCount / this.pageSize) - 1), 0);
        },
        /**
         * The current offset ( page - 1 ) shown.
         * Default value: `0`
         */
        set: function (val) {
            this._offset = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isFixedHeader", {
        /**
         * CSS class applied if the header height if fixed height.
         */
        get: function () {
            var headerHeight = this.headerHeight;
            return typeof headerHeight === 'string' ? headerHeight !== 'auto' : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isFixedRow", {
        /**
         * CSS class applied to the root element if
         * the row heights are fixed heights.
         */
        get: function () {
            return this.rowHeight !== 'auto';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isVertScroll", {
        /**
         * CSS class applied to root element if
         * vertical scrolling is enabled.
         */
        get: function () {
            return this.scrollbarV;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isVirtualized", {
        /**
         * CSS class applied to root element if
         * virtualization is enabled.
         */
        get: function () {
            return this.virtualization;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isHorScroll", {
        /**
         * CSS class applied to the root element
         * if the horziontal scrolling is enabled.
         */
        get: function () {
            return this.scrollbarH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isSelectable", {
        /**
         * CSS class applied to root element is selectable.
         */
        get: function () {
            return this.selectionType !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isCheckboxSelection", {
        /**
         * CSS class applied to root is checkbox selection.
         */
        get: function () {
            return this.selectionType === SelectionType.checkbox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isCellSelection", {
        /**
         * CSS class applied to root if cell selection.
         */
        get: function () {
            return this.selectionType === SelectionType.cell;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isSingleSelection", {
        /**
         * CSS class applied to root if single select.
         */
        get: function () {
            return this.selectionType === SelectionType.single;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isMultiSelection", {
        /**
         * CSS class added to root element if mulit select
         */
        get: function () {
            return this.selectionType === SelectionType.multi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "isMultiClickSelection", {
        /**
         * CSS class added to root element if mulit click select
         */
        get: function () {
            return this.selectionType === SelectionType.multiClick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "columnTemplates", {
        /**
         * Returns the column templates.
         */
        get: function () {
            return this._columnTemplates;
        },
        /**
         * Column templates gathered from `ContentChildren`
         * if described in your markup.
         */
        set: function (val) {
            this._columnTemplates = val;
            this.translateColumns(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatatableComponent.prototype, "allRowsSelected", {
        /**
         * Returns if all rows are selected.
         */
        get: function () {
            var allRowsSelected = this.rows && this.selected && this.selected.length === this.rows.length;
            if (this.bodyComponent && this.selectAllRowsOnPage) {
                var indexes = this.bodyComponent.indexes;
                var rowsOnPage = indexes.last - indexes.first;
                allRowsSelected = this.selected.length === rowsOnPage;
            }
            return this.selected && this.rows && this.rows.length !== 0 && allRowsSelected;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Lifecycle hook that is called after data-bound
     * properties of a directive are initialized.
     */
    DatatableComponent.prototype.ngOnInit = function () {
        // need to call this immediatly to size
        // if the table is hidden the visibility
        // listener will invoke this itself upon show
        this.recalculate();
    };
    /**
     * Lifecycle hook that is called after a component's
     * view has been fully initialized.
     */
    DatatableComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (!this.externalSorting) {
            this.sortInternalRows();
        }
        // this has to be done to prevent the change detection
        // tree from freaking out because we are readjusting
        if (typeof requestAnimationFrame === 'undefined') {
            return;
        }
        requestAnimationFrame(function () {
            _this.recalculate();
            // emit page for virtual server-side kickoff
            if (_this.externalPaging && _this.scrollbarV) {
                _this.page.emit({
                    count: _this.count,
                    pageSize: _this.pageSize,
                    limit: _this.limit,
                    offset: 0
                });
            }
        });
    };
    /**
     * Lifecycle hook that is called after a component's
     * content has been fully initialized.
     */
    DatatableComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.columnTemplates.changes.subscribe(function (v) { return _this.translateColumns(v); });
        this.listenForColumnInputChanges();
    };
    /**
     * Translates the templates to the column objects
     */
    DatatableComponent.prototype.translateColumns = function (val) {
        if (val) {
            var arr = val.toArray();
            if (arr.length) {
                this._internalColumns = translateTemplates(arr);
                setColumnDefaults(this._internalColumns);
                this.recalculateColumns();
                this.sortInternalRows();
                this.cd.markForCheck();
            }
        }
    };
    /**
     * Creates a map with the data grouped by the user choice of grouping index
     *
     * @param originalArray the original array passed via parameter
     * @param groupByIndex  the index of the column to group the data by
     */
    DatatableComponent.prototype.groupArrayBy = function (originalArray, groupBy) {
        // create a map to hold groups with their corresponding results
        var map = new Map();
        var i = 0;
        originalArray.forEach(function (item) {
            var key = item[groupBy];
            if (!map.has(key)) {
                map.set(key, [item]);
            }
            else {
                map.get(key).push(item);
            }
            i++;
        });
        var addGroup = function (key, value) {
            return { key: key, value: value };
        };
        // convert map back to a simple array of objects
        return Array.from(map, function (x) { return addGroup(x[0], x[1]); });
    };
    /*
     * Lifecycle hook that is called when Angular dirty checks a directive.
     */
    DatatableComponent.prototype.ngDoCheck = function () {
        if (this.rowDiffer.diff(this.rows)) {
            if (!this.externalSorting) {
                this.sortInternalRows();
            }
            else {
                this._internalRows = __spread(this.rows);
            }
            // auto group by parent on new update
            this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
            this.recalculatePages();
            this.cd.markForCheck();
        }
    };
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
    DatatableComponent.prototype.recalculate = function () {
        this.recalculateDims();
        this.recalculateColumns();
        this.cd.markForCheck();
    };
    /**
     * Window resize handler to update sizes.
     */
    DatatableComponent.prototype.onWindowResize = function () {
        this.recalculate();
    };
    /**
     * Recalulcates the column widths based on column width
     * distribution mode and scrollbar offsets.
     */
    DatatableComponent.prototype.recalculateColumns = function (columns, forceIdx, allowBleed) {
        if (columns === void 0) { columns = this._internalColumns; }
        if (forceIdx === void 0) { forceIdx = -1; }
        if (allowBleed === void 0) { allowBleed = this.scrollbarH; }
        if (!columns)
            return undefined;
        var width = this._innerWidth;
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
    };
    /**
     * Recalculates the dimensions of the table size.
     * Internally calls the page size and row count calcs too.
     *
     */
    DatatableComponent.prototype.recalculateDims = function () {
        var dims = this.dimensionsHelper.getDimensions(this.element);
        this._innerWidth = Math.floor(dims.width);
        if (this.scrollbarV) {
            var height = dims.height;
            if (this.headerHeight)
                height = height - this.headerHeight;
            if (this.footerHeight)
                height = height - this.footerHeight;
            this.bodyHeight = height;
        }
        this.recalculatePages();
    };
    /**
     * Recalculates the pages after a update.
     */
    DatatableComponent.prototype.recalculatePages = function () {
        this.pageSize = this.calcPageSize();
        this.rowCount = this.calcRowCount();
    };
    /**
     * Body triggered a page event.
     */
    DatatableComponent.prototype.onBodyPage = function (_a) {
        var offset = _a.offset;
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
    };
    /**
     * The body triggered a scroll event.
     */
    DatatableComponent.prototype.onBodyScroll = function (event) {
        this._offsetX.next(event.offsetX);
        this.scroll.emit(event);
        this.cd.detectChanges();
    };
    /**
     * The footer triggered a page event.
     */
    DatatableComponent.prototype.onFooterPage = function (event) {
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
    };
    /**
     * Recalculates the sizes of the page
     */
    DatatableComponent.prototype.calcPageSize = function (val) {
        if (val === void 0) { val = this.rows; }
        // Keep the page size constant even if the row has been expanded.
        // This is because an expanded row is still considered to be a child of
        // the original row.  Hence calculation would use rowHeight only.
        if (this.scrollbarV && this.virtualization) {
            var size = Math.ceil(this.bodyHeight / this.rowHeight);
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
    };
    /**
     * Calculates the row count.
     */
    DatatableComponent.prototype.calcRowCount = function (val) {
        if (val === void 0) { val = this.rows; }
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
    };
    /**
     * The header triggered a contextmenu event.
     */
    DatatableComponent.prototype.onColumnContextmenu = function (_a) {
        var event = _a.event, column = _a.column;
        this.tableContextmenu.emit({ event: event, type: ContextmenuType.header, content: column });
    };
    /**
     * The body triggered a contextmenu event.
     */
    DatatableComponent.prototype.onRowContextmenu = function (_a) {
        var event = _a.event, row = _a.row;
        this.tableContextmenu.emit({ event: event, type: ContextmenuType.body, content: row });
    };
    /**
     * The header triggered a column resize event.
     */
    DatatableComponent.prototype.onColumnResize = function (_a) {
        var column = _a.column, newValue = _a.newValue;
        /* Safari/iOS 10.2 workaround */
        if (column === undefined) {
            return;
        }
        var idx;
        var cols = this._internalColumns.map(function (c, i) {
            c = __assign({}, c);
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
            column: column,
            newValue: newValue
        });
    };
    /**
     * The header triggered a column re-order event.
     */
    DatatableComponent.prototype.onColumnReorder = function (_a) {
        var column = _a.column, newValue = _a.newValue, prevValue = _a.prevValue;
        var cols = this._internalColumns.map(function (c) {
            return __assign({}, c);
        });
        if (this.swapColumns) {
            var prevCol = cols[newValue];
            cols[newValue] = column;
            cols[prevValue] = prevCol;
        }
        else {
            if (newValue > prevValue) {
                var movedCol = cols[prevValue];
                for (var i = prevValue; i < newValue; i++) {
                    cols[i] = cols[i + 1];
                }
                cols[newValue] = movedCol;
            }
            else {
                var movedCol = cols[prevValue];
                for (var i = prevValue; i > newValue; i--) {
                    cols[i] = cols[i - 1];
                }
                cols[newValue] = movedCol;
            }
        }
        this._internalColumns = cols;
        this.reorder.emit({
            column: column,
            newValue: newValue,
            prevValue: prevValue
        });
    };
    /**
     * The header triggered a column sort event.
     */
    DatatableComponent.prototype.onColumnSort = function (event) {
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
    };
    /**
     * Toggle all row selection
     */
    DatatableComponent.prototype.onHeaderSelect = function (event) {
        var _a, _b;
        if (this.bodyComponent && this.selectAllRowsOnPage) {
            // before we splice, chk if we currently have all selected
            var first = this.bodyComponent.indexes.first;
            var last = this.bodyComponent.indexes.last;
            var allSelected = this.selected.length === last - first;
            // remove all existing either way
            this.selected = [];
            // do the opposite here
            if (!allSelected) {
                (_a = this.selected).push.apply(_a, __spread(this._internalRows.slice(first, last)));
            }
        }
        else {
            // before we splice, chk if we currently have all selected
            var allSelected = this.selected.length === this.rows.length;
            // remove all existing either way
            this.selected = [];
            // do the opposite here
            if (!allSelected) {
                (_b = this.selected).push.apply(_b, __spread(this.rows));
            }
        }
        this.select.emit({
            selected: this.selected
        });
    };
    /**
     * A row was selected from body
     */
    DatatableComponent.prototype.onBodySelect = function (event) {
        this.select.emit(event);
    };
    /**
     * A row was expanded or collapsed for tree
     */
    DatatableComponent.prototype.onTreeAction = function (event) {
        var _this = this;
        var row = event.row;
        // TODO: For duplicated items this will not work
        var rowIndex = this._rows.findIndex(function (r) { return r[_this.treeToRelation] === event.row[_this.treeToRelation]; });
        this.treeAction.emit({ row: row, rowIndex: rowIndex });
    };
    DatatableComponent.prototype.ngOnDestroy = function () {
        this._subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    /**
     * listen for changes to input bindings of all DataTableColumnDirective and
     * trigger the columnTemplates.changes observable to emit
     */
    DatatableComponent.prototype.listenForColumnInputChanges = function () {
        var _this = this;
        this._subscriptions.push(this.columnChangesService.columnInputChanges$.subscribe(function () {
            if (_this.columnTemplates) {
                _this.columnTemplates.notifyOnChanges();
            }
        }));
    };
    DatatableComponent.prototype.sortInternalRows = function () {
        this._internalRows = sortRows(this._internalRows, this._internalColumns, this.sorts);
    };
    DatatableComponent.ctorParameters = function () { return [
        { type: ScrollbarHelper, decorators: [{ type: SkipSelf }] },
        { type: DimensionsHelper, decorators: [{ type: SkipSelf }] },
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: KeyValueDiffers },
        { type: ColumnChangesService },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['configuration',] }] }
    ]; };
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
    return DatatableComponent;
}());
export { DatatableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXRhYmxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZGF0YXRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFDVixZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsTUFBTSxFQUNOLFNBQVMsRUFDVCxhQUFhLEVBQ2IsV0FBVyxFQUNYLFlBQVksRUFDWixPQUFPLEVBQ1AsZUFBZSxFQUNmLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRixPQUFPLEVBQUUsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hGLE9BQU8sRUFB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QXdCLENBQUM7K0RBR3JDO0lBTUQ7UUFEQyxXQUFXLENBQUMsdUJBQXVCLENBQUM7OERBR3BDO0lBTUQ7UUFEQyxXQUFXLENBQUMsNkJBQTZCLENBQUM7bUVBRzFDO0lBT0Q7UUFEQyxlQUFlLENBQUMsd0JBQXdCLENBQUM7NkRBSXpDO0lBYUQ7UUFEQyxZQUFZLENBQUMsMkJBQTJCLENBQUM7eURBQ0g7SUFNdkM7UUFEQyxZQUFZLENBQUMsNkJBQTZCLENBQUM7MkRBQ0Q7SUFNM0M7UUFEQyxZQUFZLENBQUMsd0JBQXdCLENBQUM7c0RBQ047SUFPakM7UUFEQyxTQUFTLENBQUMsc0JBQXNCLENBQUM7NkRBQ0k7SUFTdEM7UUFEQyxTQUFTLENBQUMsd0JBQXdCLENBQUM7K0RBQ007SUErR2pDO1FBQVIsS0FBSyxFQUFFOzJEQVFOO0lBNEZGO1FBRkMsWUFBWSxDQUFDLGVBQWUsQ0FBQztRQUM3QixZQUFZLENBQUMsQ0FBQyxDQUFDOzREQUdmO0lBcHZCVSxrQkFBa0I7UUFWOUIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGVBQWU7WUFDekIsazNGQUF5QztZQUN6QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUVyQyxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLGVBQWU7YUFDdkI7O1NBQ0YsQ0FBQztRQXFrQkcsV0FBQSxRQUFRLEVBQUUsQ0FBQTtRQUNWLFdBQUEsUUFBUSxFQUFFLENBQUE7UUFLVixXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUE7T0Exa0IzQixrQkFBa0IsQ0F5a0M5QjtJQUFELHlCQUFDO0NBQUEsQUF6a0NELElBeWtDQztTQXprQ1ksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIFZpZXdDaGlsZCxcbiAgSG9zdExpc3RlbmVyLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIE9uSW5pdCxcbiAgUXVlcnlMaXN0LFxuICBBZnRlclZpZXdJbml0LFxuICBIb3N0QmluZGluZyxcbiAgQ29udGVudENoaWxkLFxuICBEb0NoZWNrLFxuICBLZXlWYWx1ZURpZmZlcnMsXG4gIEtleVZhbHVlRGlmZmVyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBTa2lwU2VsZixcbiAgT3B0aW9uYWwsXG4gIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRGF0YXRhYmxlR3JvdXBIZWFkZXJEaXJlY3RpdmUgfSBmcm9tICcuL2JvZHkvYm9keS1ncm91cC1oZWFkZXIuZGlyZWN0aXZlJztcblxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IElOZ3hEYXRhdGFibGVDb25maWcgfSBmcm9tICcuLi9uZ3gtZGF0YXRhYmxlLm1vZHVsZSc7XG5pbXBvcnQgeyBncm91cFJvd3NCeVBhcmVudHMsIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCB9IGZyb20gJy4uL3V0aWxzL3RyZWUnO1xuaW1wb3J0IHsgVGFibGVDb2x1bW4gfSBmcm9tICcuLi90eXBlcy90YWJsZS1jb2x1bW4udHlwZSc7XG5pbXBvcnQgeyBzZXRDb2x1bW5EZWZhdWx0cywgdHJhbnNsYXRlVGVtcGxhdGVzIH0gZnJvbSAnLi4vdXRpbHMvY29sdW1uLWhlbHBlcic7XG5pbXBvcnQgeyBDb2x1bW5Nb2RlIH0gZnJvbSAnLi4vdHlwZXMvY29sdW1uLW1vZGUudHlwZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvc2VsZWN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgU29ydFR5cGUgfSBmcm9tICcuLi90eXBlcy9zb3J0LnR5cGUnO1xuaW1wb3J0IHsgQ29udGV4dG1lbnVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvY29udGV4dG1lbnUudHlwZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmUgfSBmcm9tICcuL2NvbHVtbnMvY29sdW1uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhdGFibGVSb3dEZXRhaWxEaXJlY3RpdmUgfSBmcm9tICcuL3Jvdy1kZXRhaWwvcm93LWRldGFpbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YXRhYmxlRm9vdGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9mb290ZXIvZm9vdGVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVCb2R5Q29tcG9uZW50IH0gZnJvbSAnLi9ib2R5L2JvZHkuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGFUYWJsZUhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVyL2hlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2Nyb2xsYmFySGVscGVyIH0gZnJvbSAnLi4vc2VydmljZXMvc2Nyb2xsYmFyLWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvbHVtbkNoYW5nZXNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvY29sdW1uLWNoYW5nZXMuc2VydmljZSc7XG5pbXBvcnQgeyBEaW1lbnNpb25zSGVscGVyIH0gZnJvbSAnLi4vc2VydmljZXMvZGltZW5zaW9ucy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyB0aHJvdHRsZWFibGUgfSBmcm9tICcuLi91dGlscy90aHJvdHRsZSc7XG5pbXBvcnQgeyBmb3JjZUZpbGxDb2x1bW5XaWR0aHMsIGFkanVzdENvbHVtbldpZHRocyB9IGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0IHsgc29ydFJvd3MgfSBmcm9tICcuLi91dGlscy9zb3J0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRhdGF0YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRhdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc3R5bGVVcmxzOiBbJy4vZGF0YXRhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25neC1kYXRhdGFibGUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgRGF0YXRhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0IHtcbiAgLyoqXG4gICAqIFRlbXBsYXRlIGZvciB0aGUgdGFyZ2V0IG1hcmtlciBvZiBkcmFnIHRhcmdldCBjb2x1bW5zLlxuICAgKi9cbiAgQElucHV0KCkgdGFyZ2V0TWFya2VyVGVtcGxhdGU6IGFueTtcblxuICAvKipcbiAgICogUm93cyB0aGF0IGFyZSBkaXNwbGF5ZWQgaW4gdGhlIHRhYmxlLlxuICAgKi9cbiAgQElucHV0KCkgc2V0IHJvd3ModmFsOiBhbnkpIHtcbiAgICB0aGlzLl9yb3dzID0gdmFsO1xuXG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy5faW50ZXJuYWxSb3dzID0gWy4uLnZhbF07XG4gICAgfVxuXG4gICAgLy8gYXV0byBzb3J0IG9uIG5ldyB1cGRhdGVzXG4gICAgaWYgKCF0aGlzLmV4dGVybmFsU29ydGluZykge1xuICAgICAgdGhpcy5zb3J0SW50ZXJuYWxSb3dzKCk7XG4gICAgfVxuXG4gICAgLy8gYXV0byBncm91cCBieSBwYXJlbnQgb24gbmV3IHVwZGF0ZVxuICAgIHRoaXMuX2ludGVybmFsUm93cyA9IGdyb3VwUm93c0J5UGFyZW50cyhcbiAgICAgIHRoaXMuX2ludGVybmFsUm93cyxcbiAgICAgIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCh0aGlzLnRyZWVGcm9tUmVsYXRpb24pLFxuICAgICAgb3B0aW9uYWxHZXR0ZXJGb3JQcm9wKHRoaXMudHJlZVRvUmVsYXRpb24pXG4gICAgKTtcblxuICAgIC8vIHJlY2FsY3VsYXRlIHNpemVzL2V0Y1xuICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcblxuICAgIGlmICh0aGlzLl9yb3dzICYmIHRoaXMuX2dyb3VwUm93c0J5KSB7XG4gICAgICAvLyBJZiBhIGNvbHVtbiBoYXMgYmVlbiBzcGVjaWZpZWQgaW4gX2dyb3VwUm93c0J5IGNyZWF0ZWQgYSBuZXcgYXJyYXkgd2l0aCB0aGUgZGF0YSBncm91cGVkIGJ5IHRoYXQgcm93XG4gICAgICB0aGlzLmdyb3VwZWRSb3dzID0gdGhpcy5ncm91cEFycmF5QnkodGhpcy5fcm93cywgdGhpcy5fZ3JvdXBSb3dzQnkpO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcm93cy5cbiAgICovXG4gIGdldCByb3dzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd3M7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBhdHRyaWJ1dGUgYWxsb3dzIHRoZSB1c2VyIHRvIHNldCB0aGUgbmFtZSBvZiB0aGUgY29sdW1uIHRvIGdyb3VwIHRoZSBkYXRhIHdpdGhcbiAgICovXG4gIEBJbnB1dCgpIHNldCBncm91cFJvd3NCeSh2YWw6IHN0cmluZykge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMuX2dyb3VwUm93c0J5ID0gdmFsO1xuICAgICAgaWYgKHRoaXMuX3Jvd3MgJiYgdGhpcy5fZ3JvdXBSb3dzQnkpIHtcbiAgICAgICAgLy8gY3JldGVzIGEgbmV3IGFycmF5IHdpdGggdGhlIGRhdGEgZ3JvdXBlZFxuICAgICAgICB0aGlzLmdyb3VwZWRSb3dzID0gdGhpcy5ncm91cEFycmF5QnkodGhpcy5fcm93cywgdGhpcy5fZ3JvdXBSb3dzQnkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBncm91cFJvd3NCeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBSb3dzQnk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBhdHRyaWJ1dGUgYWxsb3dzIHRoZSB1c2VyIHRvIHNldCBhIGdyb3VwZWQgYXJyYXkgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAqICBbXG4gICAqICAgIHtncm91cGlkPTF9IFtcbiAgICogICAgICB7aWQ9MSBuYW1lPVwidGVzdDFcIn0sXG4gICAqICAgICAge2lkPTIgbmFtZT1cInRlc3QyXCJ9LFxuICAgKiAgICAgIHtpZD0zIG5hbWU9XCJ0ZXN0M1wifVxuICAgKiAgICBdfSxcbiAgICogICAge2dyb3VwaWQ9Mj5bXG4gICAqICAgICAge2lkPTQgbmFtZT1cInRlc3Q0XCJ9LFxuICAgKiAgICAgIHtpZD01IG5hbWU9XCJ0ZXN0NVwifSxcbiAgICogICAgICB7aWQ9NiBuYW1lPVwidGVzdDZcIn1cbiAgICogICAgXX1cbiAgICogIF1cbiAgICovXG4gIEBJbnB1dCgpIGdyb3VwZWRSb3dzOiBhbnlbXTtcblxuICAvKipcbiAgICogQ29sdW1ucyB0byBiZSBkaXNwbGF5ZWQuXG4gICAqL1xuICBASW5wdXQoKSBzZXQgY29sdW1ucyh2YWw6IFRhYmxlQ29sdW1uW10pIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLl9pbnRlcm5hbENvbHVtbnMgPSBbLi4udmFsXTtcbiAgICAgIHNldENvbHVtbkRlZmF1bHRzKHRoaXMuX2ludGVybmFsQ29sdW1ucyk7XG4gICAgICB0aGlzLnJlY2FsY3VsYXRlQ29sdW1ucygpO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb2x1bW5zLlxuICAgKi9cbiAgZ2V0IGNvbHVtbnMoKTogVGFibGVDb2x1bW5bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbnM7XG4gIH1cblxuICAvKipcbiAgICogTGlzdCBvZiByb3cgb2JqZWN0cyB0aGF0IHNob3VsZCBiZVxuICAgKiByZXByZXNlbnRlZCBhcyBzZWxlY3RlZCBpbiB0aGUgZ3JpZC5cbiAgICogRGVmYXVsdCB2YWx1ZTogYFtdYFxuICAgKi9cbiAgQElucHV0KCkgc2VsZWN0ZWQ6IGFueVtdID0gW107XG5cbiAgLyoqXG4gICAqIEVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGxiYXJzXG4gICAqL1xuICBASW5wdXQoKSBzY3JvbGxiYXJWOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBob3J6IHNjcm9sbGJhcnNcbiAgICovXG4gIEBJbnB1dCgpIHNjcm9sbGJhckg6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIHJvdyBoZWlnaHQ7IHdoaWNoIGlzIG5lY2Vzc2FyeVxuICAgKiB0byBjYWxjdWxhdGUgdGhlIGhlaWdodCBmb3IgdGhlIGxhenkgcmVuZGVyaW5nLlxuICAgKi9cbiAgQElucHV0KCkgcm93SGVpZ2h0OiBudW1iZXIgfCAnYXV0bycgfCAoKHJvdz86IGFueSkgPT4gbnVtYmVyKSA9IDMwO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGNvbHVtbiB3aWR0aCBkaXN0cmlidXRpb24gZm9ybXVsYS5cbiAgICogRXhhbXBsZTogZmxleCwgZm9yY2UsIHN0YW5kYXJkXG4gICAqL1xuICBASW5wdXQoKSBjb2x1bW5Nb2RlOiBDb2x1bW5Nb2RlIHwga2V5b2YgdHlwZW9mIENvbHVtbk1vZGUgPSBDb2x1bW5Nb2RlLnN0YW5kYXJkO1xuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBoZWFkZXIgaGVpZ2h0IGluIHBpeGVscy5cbiAgICogUGFzcyBhIGZhbHNleSBmb3Igbm8gaGVhZGVyXG4gICAqL1xuICBASW5wdXQoKSBoZWFkZXJIZWlnaHQ6IG51bWJlciA9IDMwO1xuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBmb290ZXIgaGVpZ2h0IGluIHBpeGVscy5cbiAgICogUGFzcyBmYWxzZXkgZm9yIG5vIGZvb3RlclxuICAgKi9cbiAgQElucHV0KCkgZm9vdGVySGVpZ2h0OiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgdGFibGUgc2hvdWxkIHVzZSBleHRlcm5hbCBwYWdpbmdcbiAgICogb3RoZXJ3aXNlIGl0cyBhc3N1bWVkIHRoYXQgYWxsIGRhdGEgaXMgcHJlbG9hZGVkLlxuICAgKi9cbiAgQElucHV0KCkgZXh0ZXJuYWxQYWdpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSWYgdGhlIHRhYmxlIHNob3VsZCB1c2UgZXh0ZXJuYWwgc29ydGluZyBvclxuICAgKiB0aGUgYnVpbHQtaW4gYmFzaWMgc29ydGluZy5cbiAgICovXG4gIEBJbnB1dCgpIGV4dGVybmFsU29ydGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFnZSBzaXplIHRvIGJlIHNob3duLlxuICAgKiBEZWZhdWx0IHZhbHVlOiBgdW5kZWZpbmVkYFxuICAgKi9cbiAgQElucHV0KCkgc2V0IGxpbWl0KHZhbDogbnVtYmVyIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fbGltaXQgPSB2YWw7XG5cbiAgICAvLyByZWNhbGN1bGF0ZSBzaXplcy9ldGNcbiAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGltaXQuXG4gICAqL1xuICBnZXQgbGltaXQoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fbGltaXQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRvdGFsIGNvdW50IG9mIGFsbCByb3dzLlxuICAgKiBEZWZhdWx0IHZhbHVlOiBgMGBcbiAgICovXG4gIEBJbnB1dCgpIHNldCBjb3VudCh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX2NvdW50ID0gdmFsO1xuXG4gICAgLy8gcmVjYWxjdWxhdGUgc2l6ZXMvZXRjXG4gICAgdGhpcy5yZWNhbGN1bGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGNvdW50LlxuICAgKi9cbiAgZ2V0IGNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IG9mZnNldCAoIHBhZ2UgLSAxICkgc2hvd24uXG4gICAqIERlZmF1bHQgdmFsdWU6IGAwYFxuICAgKi9cbiAgQElucHV0KCkgc2V0IG9mZnNldCh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbDtcbiAgfVxuICBnZXQgb2Zmc2V0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHRoaXMuX29mZnNldCwgTWF0aC5jZWlsKHRoaXMucm93Q291bnQgLyB0aGlzLnBhZ2VTaXplKSAtIDEpLCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSBsaW5lYXIgbG9hZGluZyBiYXIuXG4gICAqIERlZmF1bHQgdmFsdWU6IGBmYWxzZWBcbiAgICovXG4gIEBJbnB1dCgpIGxvYWRpbmdJbmRpY2F0b3I6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVHlwZSBvZiByb3cgc2VsZWN0aW9uLiBPcHRpb25zIGFyZTpcbiAgICpcbiAgICogIC0gYHNpbmdsZWBcbiAgICogIC0gYG11bHRpYFxuICAgKiAgLSBgY2hlY2tib3hgXG4gICAqICAtIGBtdWx0aUNsaWNrYFxuICAgKiAgLSBgY2VsbGBcbiAgICpcbiAgICogRm9yIG5vIHNlbGVjdGlvbiBwYXNzIGEgYGZhbHNleWAuXG4gICAqIERlZmF1bHQgdmFsdWU6IGB1bmRlZmluZWRgXG4gICAqL1xuICBASW5wdXQoKSBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlO1xuXG4gIC8qKlxuICAgKiBFbmFibGUvRGlzYWJsZSBhYmlsaXR5IHRvIHJlLW9yZGVyIGNvbHVtbnNcbiAgICogYnkgZHJhZ2dpbmcgdGhlbS5cbiAgICovXG4gIEBJbnB1dCgpIHJlb3JkZXJhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogU3dhcCBjb2x1bW5zIG9uIHJlLW9yZGVyIGNvbHVtbnMgb3JcbiAgICogbW92ZSB0aGVtLlxuICAgKi9cbiAgQElucHV0KCkgc3dhcENvbHVtbnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBzb3J0aW5nXG4gICAqL1xuICBASW5wdXQoKSBzb3J0VHlwZTogU29ydFR5cGUgPSBTb3J0VHlwZS5zaW5nbGU7XG5cbiAgLyoqXG4gICAqIEFycmF5IG9mIHNvcnRlZCBjb2x1bW5zIGJ5IHByb3BlcnR5IGFuZCB0eXBlLlxuICAgKiBEZWZhdWx0IHZhbHVlOiBgW11gXG4gICAqL1xuICBASW5wdXQoKSBzb3J0czogYW55W10gPSBbXTtcblxuICAvKipcbiAgICogQ3NzIGNsYXNzIG92ZXJyaWRlc1xuICAgKi9cbiAgQElucHV0KCkgY3NzQ2xhc3NlczogYW55ID0ge1xuICAgIHNvcnRBc2NlbmRpbmc6ICdkYXRhdGFibGUtaWNvbi11cCcsXG4gICAgc29ydERlc2NlbmRpbmc6ICdkYXRhdGFibGUtaWNvbi1kb3duJyxcbiAgICBwYWdlckxlZnRBcnJvdzogJ2RhdGF0YWJsZS1pY29uLWxlZnQnLFxuICAgIHBhZ2VyUmlnaHRBcnJvdzogJ2RhdGF0YWJsZS1pY29uLXJpZ2h0JyxcbiAgICBwYWdlclByZXZpb3VzOiAnZGF0YXRhYmxlLWljb24tcHJldicsXG4gICAgcGFnZXJOZXh0OiAnZGF0YXRhYmxlLWljb24tc2tpcCdcbiAgfTtcblxuICAvKipcbiAgICogTWVzc2FnZSBvdmVycmlkZXMgZm9yIGxvY2FsaXphdGlvblxuICAgKlxuICAgKiBlbXB0eU1lc3NhZ2UgICAgIFtkZWZhdWx0XSA9ICdObyBkYXRhIHRvIGRpc3BsYXknXG4gICAqIHRvdGFsTWVzc2FnZSAgICAgW2RlZmF1bHRdID0gJ3RvdGFsJ1xuICAgKiBzZWxlY3RlZE1lc3NhZ2UgIFtkZWZhdWx0XSA9ICdzZWxlY3RlZCdcbiAgICovXG4gIEBJbnB1dCgpIG1lc3NhZ2VzOiBhbnkgPSB7XG4gICAgLy8gTWVzc2FnZSB0byBzaG93IHdoZW4gYXJyYXkgaXMgcHJlc2VudGVkXG4gICAgLy8gYnV0IGNvbnRhaW5zIG5vIHZhbHVlc1xuICAgIGVtcHR5TWVzc2FnZTogJ05vIGRhdGEgdG8gZGlzcGxheScsXG5cbiAgICAvLyBGb290ZXIgdG90YWwgbWVzc2FnZVxuICAgIHRvdGFsTWVzc2FnZTogJ3RvdGFsJyxcblxuICAgIC8vIEZvb3RlciBzZWxlY3RlZCBtZXNzYWdlXG4gICAgc2VsZWN0ZWRNZXNzYWdlOiAnc2VsZWN0ZWQnXG4gIH07XG5cbiAgLyoqXG4gICAqIFJvdyBzcGVjaWZpYyBjbGFzc2VzLlxuICAgKiBTaW1pbGFyIGltcGxlbWVudGF0aW9uIHRvIG5nQ2xhc3MuXG4gICAqXG4gICAqICBbcm93Q2xhc3NdPVwiJ2ZpcnN0IHNlY29uZCdcIlxuICAgKiAgW3Jvd0NsYXNzXT1cInsgJ2ZpcnN0JzogdHJ1ZSwgJ3NlY29uZCc6IHRydWUsICd0aGlyZCc6IGZhbHNlIH1cIlxuICAgKi9cbiAgQElucHV0KCkgcm93Q2xhc3M6IGFueTtcblxuICAvKipcbiAgICogQSBib29sZWFuL2Z1bmN0aW9uIHlvdSBjYW4gdXNlIHRvIGNoZWNrIHdoZXRoZXIgeW91IHdhbnRcbiAgICogdG8gc2VsZWN0IGEgcGFydGljdWxhciByb3cgYmFzZWQgb24gYSBjcml0ZXJpYS4gRXhhbXBsZTpcbiAgICpcbiAgICogICAgKHNlbGVjdGlvbikgPT4ge1xuICAgKiAgICAgIHJldHVybiBzZWxlY3Rpb24gIT09ICdFdGhlbCBQcmljZSc7XG4gICAqICAgIH1cbiAgICovXG4gIEBJbnB1dCgpIHNlbGVjdENoZWNrOiBhbnk7XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24geW91IGNhbiB1c2UgdG8gY2hlY2sgd2hldGhlciB5b3Ugd2FudFxuICAgKiB0byBzaG93IHRoZSBjaGVja2JveCBmb3IgYSBwYXJ0aWN1bGFyIHJvdyBiYXNlZCBvbiBhIGNyaXRlcmlhLiBFeGFtcGxlOlxuICAgKlxuICAgKiAgICAocm93LCBjb2x1bW4sIHZhbHVlKSA9PiB7XG4gICAqICAgICAgcmV0dXJuIHJvdy5uYW1lICE9PSAnRXRoZWwgUHJpY2UnO1xuICAgKiAgICB9XG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5Q2hlY2s6IChyb3c6IGFueSwgY29sdW1uPzogYW55LCB2YWx1ZT86IGFueSkgPT4gYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBib29sZWFuIHlvdSBjYW4gdXNlIHRvIHNldCB0aGUgZGV0YXVsdCBiZWhhdmlvdXIgb2Ygcm93cyBhbmQgZ3JvdXBzXG4gICAqIHdoZXRoZXIgdGhleSB3aWxsIHN0YXJ0IGV4cGFuZGVkIG9yIG5vdC4gSWYgb21taXRlZCB0aGUgZGVmYXVsdCBpcyBOT1QgZXhwYW5kZWQuXG4gICAqXG4gICAqL1xuICBASW5wdXQoKSBncm91cEV4cGFuc2lvbkRlZmF1bHQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJvcGVydHkgdG8gd2hpY2ggeW91IGNhbiB1c2UgZm9yIGN1c3RvbSB0cmFja2luZyBvZiByb3dzLlxuICAgKiBFeGFtcGxlOiAnbmFtZSdcbiAgICovXG4gIEBJbnB1dCgpIHRyYWNrQnlQcm9wOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb3BlcnR5IHRvIHdoaWNoIHlvdSBjYW4gdXNlIGZvciBkZXRlcm1pbmluZyBzZWxlY3QgYWxsXG4gICAqIHJvd3Mgb24gY3VycmVudCBwYWdlIG9yIG5vdC5cbiAgICpcbiAgICogQG1lbWJlck9mIERhdGF0YWJsZUNvbXBvbmVudFxuICAgKi9cbiAgQElucHV0KCkgc2VsZWN0QWxsUm93c09uUGFnZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgZm9yIHJvdyB2aXJ0dWFsaXphdGlvbiBvbiAvIG9mZlxuICAgKi9cbiAgQElucHV0KCkgdmlydHVhbGl6YXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUcmVlIGZyb20gcmVsYXRpb25cbiAgICovXG4gIEBJbnB1dCgpIHRyZWVGcm9tUmVsYXRpb246IHN0cmluZztcblxuICAvKipcbiAgICogVHJlZSB0byByZWxhdGlvblxuICAgKi9cbiAgQElucHV0KCkgdHJlZVRvUmVsYXRpb246IHN0cmluZztcblxuICAvKipcbiAgICogQSBmbGFnIGZvciBzd2l0Y2hpbmcgc3VtbWFyeSByb3cgb24gLyBvZmZcbiAgICovXG4gIEBJbnB1dCgpIHN1bW1hcnlSb3c6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQSBoZWlnaHQgb2Ygc3VtbWFyeSByb3dcbiAgICovXG4gIEBJbnB1dCgpIHN1bW1hcnlIZWlnaHQ6IG51bWJlciA9IDMwO1xuXG4gIC8qKlxuICAgKiBBIHByb3BlcnR5IGhvbGRzIGEgc3VtbWFyeSByb3cgcG9zaXRpb246IHRvcC9ib3R0b21cbiAgICovXG4gIEBJbnB1dCgpIHN1bW1hcnlQb3NpdGlvbjogc3RyaW5nID0gJ3RvcCc7XG5cbiAgLyoqXG4gICAqIEJvZHkgd2FzIHNjcm9sbGVkIHR5cGljYWxseSBpbiBhIGBzY3JvbGxiYXJWOnRydWVgIHNjZW5hcmlvLlxuICAgKi9cbiAgQE91dHB1dCgpIHNjcm9sbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEEgY2VsbCBvciByb3cgd2FzIGZvY3VzZWQgdmlhIGtleWJvYXJkIG9yIG1vdXNlIGNsaWNrLlxuICAgKi9cbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQSBjZWxsIG9yIHJvdyB3YXMgc2VsZWN0ZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQ29sdW1uIHNvcnQgd2FzIGludm9rZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgc29ydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIFRoZSB0YWJsZSB3YXMgcGFnZWQgZWl0aGVyIHRyaWdnZXJlZCBieSB0aGUgcGFnZXIgb3IgdGhlIGJvZHkgc2Nyb2xsLlxuICAgKi9cbiAgQE91dHB1dCgpIHBhZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBDb2x1bW5zIHdlcmUgcmUtb3JkZXJlZC5cbiAgICovXG4gIEBPdXRwdXQoKSByZW9yZGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQ29sdW1uIHdhcyByZXNpemVkLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlc2l6ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIFRoZSBjb250ZXh0IG1lbnUgd2FzIGludm9rZWQgb24gdGhlIHRhYmxlLlxuICAgKiB0eXBlIGluZGljYXRlcyB3aGV0aGVyIHRoZSBoZWFkZXIgb3IgdGhlIGJvZHkgd2FzIGNsaWNrZWQuXG4gICAqIGNvbnRlbnQgY29udGFpbnMgZWl0aGVyIHRoZSBjb2x1bW4gb3IgdGhlIHJvdyB0aGF0IHdhcyBjbGlja2VkLlxuICAgKi9cbiAgQE91dHB1dCgpIHRhYmxlQ29udGV4dG1lbnUgPSBuZXcgRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IE1vdXNlRXZlbnQ7IHR5cGU6IENvbnRleHRtZW51VHlwZTsgY29udGVudDogYW55IH0+KGZhbHNlKTtcblxuICAvKipcbiAgICogQSByb3cgd2FzIGV4cGFuZGVkIG90IGNvbGxhcHNlZCBmb3IgdHJlZVxuICAgKi9cbiAgQE91dHB1dCgpIHRyZWVBY3Rpb246IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCBpZiB0aGUgaGVhZGVyIGhlaWdodCBpZiBmaXhlZCBoZWlnaHQuXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmZpeGVkLWhlYWRlcicpXG4gIGdldCBpc0ZpeGVkSGVhZGVyKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGhlYWRlckhlaWdodDogbnVtYmVyIHwgc3RyaW5nID0gdGhpcy5oZWFkZXJIZWlnaHQ7XG4gICAgcmV0dXJuIHR5cGVvZiBoZWFkZXJIZWlnaHQgPT09ICdzdHJpbmcnID8gPHN0cmluZz5oZWFkZXJIZWlnaHQgIT09ICdhdXRvJyA6IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gdGhlIHJvb3QgZWxlbWVudCBpZlxuICAgKiB0aGUgcm93IGhlaWdodHMgYXJlIGZpeGVkIGhlaWdodHMuXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmZpeGVkLXJvdycpXG4gIGdldCBpc0ZpeGVkUm93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJvd0hlaWdodCAhPT0gJ2F1dG8nO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHJvb3QgZWxlbWVudCBpZlxuICAgKiB2ZXJ0aWNhbCBzY3JvbGxpbmcgaXMgZW5hYmxlZC5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc2Nyb2xsLXZlcnRpY2FsJylcbiAgZ2V0IGlzVmVydFNjcm9sbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zY3JvbGxiYXJWO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHJvb3QgZWxlbWVudCBpZlxuICAgKiB2aXJ0dWFsaXphdGlvbiBpcyBlbmFibGVkLlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy52aXJ0dWFsaXplZCcpXG4gIGdldCBpc1ZpcnR1YWxpemVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnZpcnR1YWxpemF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHRoZSByb290IGVsZW1lbnRcbiAgICogaWYgdGhlIGhvcnppb250YWwgc2Nyb2xsaW5nIGlzIGVuYWJsZWQuXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNjcm9sbC1ob3J6JylcbiAgZ2V0IGlzSG9yU2Nyb2xsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNjcm9sbGJhckg7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gcm9vdCBlbGVtZW50IGlzIHNlbGVjdGFibGUuXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNlbGVjdGFibGUnKVxuICBnZXQgaXNTZWxlY3RhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblR5cGUgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byByb290IGlzIGNoZWNrYm94IHNlbGVjdGlvbi5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MuY2hlY2tib3gtc2VsZWN0aW9uJylcbiAgZ2V0IGlzQ2hlY2tib3hTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5jaGVja2JveDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byByb290IGlmIGNlbGwgc2VsZWN0aW9uLlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5jZWxsLXNlbGVjdGlvbicpXG4gIGdldCBpc0NlbGxTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5jZWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHJvb3QgaWYgc2luZ2xlIHNlbGVjdC5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc2luZ2xlLXNlbGVjdGlvbicpXG4gIGdldCBpc1NpbmdsZVNlbGVjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLnNpbmdsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYWRkZWQgdG8gcm9vdCBlbGVtZW50IGlmIG11bGl0IHNlbGVjdFxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tdWx0aS1zZWxlY3Rpb24nKVxuICBnZXQgaXNNdWx0aVNlbGVjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLm11bHRpO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhZGRlZCB0byByb290IGVsZW1lbnQgaWYgbXVsaXQgY2xpY2sgc2VsZWN0XG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm11bHRpLWNsaWNrLXNlbGVjdGlvbicpXG4gIGdldCBpc011bHRpQ2xpY2tTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5tdWx0aUNsaWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbHVtbiB0ZW1wbGF0ZXMgZ2F0aGVyZWQgZnJvbSBgQ29udGVudENoaWxkcmVuYFxuICAgKiBpZiBkZXNjcmliZWQgaW4geW91ciBtYXJrdXAuXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZSlcbiAgc2V0IGNvbHVtblRlbXBsYXRlcyh2YWw6IFF1ZXJ5TGlzdDxEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmU+KSB7XG4gICAgdGhpcy5fY29sdW1uVGVtcGxhdGVzID0gdmFsO1xuICAgIHRoaXMudHJhbnNsYXRlQ29sdW1ucyh2YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNvbHVtbiB0ZW1wbGF0ZXMuXG4gICAqL1xuICBnZXQgY29sdW1uVGVtcGxhdGVzKCk6IFF1ZXJ5TGlzdDxEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmU+IHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uVGVtcGxhdGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJvdyBEZXRhaWwgdGVtcGxhdGVzIGdhdGhlcmVkIGZyb20gdGhlIENvbnRlbnRDaGlsZFxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChEYXRhdGFibGVSb3dEZXRhaWxEaXJlY3RpdmUpXG4gIHJvd0RldGFpbDogRGF0YXRhYmxlUm93RGV0YWlsRGlyZWN0aXZlO1xuXG4gIC8qKlxuICAgKiBHcm91cCBIZWFkZXIgdGVtcGxhdGVzIGdhdGhlcmVkIGZyb20gdGhlIENvbnRlbnRDaGlsZFxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChEYXRhdGFibGVHcm91cEhlYWRlckRpcmVjdGl2ZSlcbiAgZ3JvdXBIZWFkZXI6IERhdGF0YWJsZUdyb3VwSGVhZGVyRGlyZWN0aXZlO1xuXG4gIC8qKlxuICAgKiBGb290ZXIgdGVtcGxhdGUgZ2F0aGVyZWQgZnJvbSB0aGUgQ29udGVudENoaWxkXG4gICAqL1xuICBAQ29udGVudENoaWxkKERhdGF0YWJsZUZvb3RlckRpcmVjdGl2ZSlcbiAgZm9vdGVyOiBEYXRhdGFibGVGb290ZXJEaXJlY3RpdmU7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgYm9keSBjb21wb25lbnQgZm9yIG1hbnVhbGx5XG4gICAqIGludm9raW5nIGZ1bmN0aW9ucyBvbiB0aGUgYm9keS5cbiAgICovXG4gIEBWaWV3Q2hpbGQoRGF0YVRhYmxlQm9keUNvbXBvbmVudClcbiAgYm9keUNvbXBvbmVudDogRGF0YVRhYmxlQm9keUNvbXBvbmVudDtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBoZWFkZXIgY29tcG9uZW50IGZvciBtYW51YWxseVxuICAgKiBpbnZva2luZyBmdW5jdGlvbnMgb24gdGhlIGhlYWRlci5cbiAgICpcbiAgICogQG1lbWJlck9mIERhdGF0YWJsZUNvbXBvbmVudFxuICAgKi9cbiAgQFZpZXdDaGlsZChEYXRhVGFibGVIZWFkZXJDb21wb25lbnQpXG4gIGhlYWRlckNvbXBvbmVudDogRGF0YVRhYmxlSGVhZGVyQ29tcG9uZW50O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGlmIGFsbCByb3dzIGFyZSBzZWxlY3RlZC5cbiAgICovXG4gIGdldCBhbGxSb3dzU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgbGV0IGFsbFJvd3NTZWxlY3RlZCA9IHRoaXMucm93cyAmJiB0aGlzLnNlbGVjdGVkICYmIHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09PSB0aGlzLnJvd3MubGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMuYm9keUNvbXBvbmVudCAmJiB0aGlzLnNlbGVjdEFsbFJvd3NPblBhZ2UpIHtcbiAgICAgIGNvbnN0IGluZGV4ZXMgPSB0aGlzLmJvZHlDb21wb25lbnQuaW5kZXhlcztcbiAgICAgIGNvbnN0IHJvd3NPblBhZ2UgPSBpbmRleGVzLmxhc3QgLSBpbmRleGVzLmZpcnN0O1xuICAgICAgYWxsUm93c1NlbGVjdGVkID0gdGhpcy5zZWxlY3RlZC5sZW5ndGggPT09IHJvd3NPblBhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQgJiYgdGhpcy5yb3dzICYmIHRoaXMucm93cy5sZW5ndGggIT09IDAgJiYgYWxsUm93c1NlbGVjdGVkO1xuICB9XG5cbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIF9pbm5lcldpZHRoOiBudW1iZXI7XG4gIHBhZ2VTaXplOiBudW1iZXI7XG4gIGJvZHlIZWlnaHQ6IG51bWJlcjtcbiAgcm93Q291bnQ6IG51bWJlciA9IDA7XG4gIHJvd0RpZmZlcjogS2V5VmFsdWVEaWZmZXI8e30sIHt9PjtcblxuICBfb2Zmc2V0WCA9IG5ldyBCZWhhdmlvclN1YmplY3QoMCk7XG4gIF9saW1pdDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBfY291bnQ6IG51bWJlciA9IDA7XG4gIF9vZmZzZXQ6IG51bWJlciA9IDA7XG4gIF9yb3dzOiBhbnlbXTtcbiAgX2dyb3VwUm93c0J5OiBzdHJpbmc7XG4gIF9pbnRlcm5hbFJvd3M6IGFueVtdO1xuICBfaW50ZXJuYWxDb2x1bW5zOiBUYWJsZUNvbHVtbltdO1xuICBfY29sdW1uczogVGFibGVDb2x1bW5bXTtcbiAgX2NvbHVtblRlbXBsYXRlczogUXVlcnlMaXN0PERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZT47XG4gIF9zdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBTa2lwU2VsZigpIHByaXZhdGUgc2Nyb2xsYmFySGVscGVyOiBTY3JvbGxiYXJIZWxwZXIsXG4gICAgQFNraXBTZWxmKCkgcHJpdmF0ZSBkaW1lbnNpb25zSGVscGVyOiBEaW1lbnNpb25zSGVscGVyLFxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuICAgIHByaXZhdGUgY29sdW1uQ2hhbmdlc1NlcnZpY2U6IENvbHVtbkNoYW5nZXNTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoJ2NvbmZpZ3VyYXRpb24nKSBwcml2YXRlIGNvbmZpZ3VyYXRpb246IElOZ3hEYXRhdGFibGVDb25maWdcbiAgKSB7XG4gICAgLy8gZ2V0IHJlZiB0byBlbG0gZm9yIG1lYXN1cmluZ1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnJvd0RpZmZlciA9IGRpZmZlcnMuZmluZCh7fSkuY3JlYXRlKCk7XG5cbiAgICAvLyBhcHBseSBnbG9iYWwgc2V0dGluZ3MgZnJvbSBNb2R1bGUuZm9yUm9vdFxuICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb24gJiYgdGhpcy5jb25maWd1cmF0aW9uLm1lc3NhZ2VzKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0geyAuLi50aGlzLmNvbmZpZ3VyYXRpb24ubWVzc2FnZXMgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGlmZWN5Y2xlIGhvb2sgdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgZGF0YS1ib3VuZFxuICAgKiBwcm9wZXJ0aWVzIG9mIGEgZGlyZWN0aXZlIGFyZSBpbml0aWFsaXplZC5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8vIG5lZWQgdG8gY2FsbCB0aGlzIGltbWVkaWF0bHkgdG8gc2l6ZVxuICAgIC8vIGlmIHRoZSB0YWJsZSBpcyBoaWRkZW4gdGhlIHZpc2liaWxpdHlcbiAgICAvLyBsaXN0ZW5lciB3aWxsIGludm9rZSB0aGlzIGl0c2VsZiB1cG9uIHNob3dcbiAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogTGlmZWN5Y2xlIGhvb2sgdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgYSBjb21wb25lbnQnc1xuICAgKiB2aWV3IGhhcyBiZWVuIGZ1bGx5IGluaXRpYWxpemVkLlxuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5leHRlcm5hbFNvcnRpbmcpIHtcbiAgICAgIHRoaXMuc29ydEludGVybmFsUm93cygpO1xuICAgIH1cblxuICAgIC8vIHRoaXMgaGFzIHRvIGJlIGRvbmUgdG8gcHJldmVudCB0aGUgY2hhbmdlIGRldGVjdGlvblxuICAgIC8vIHRyZWUgZnJvbSBmcmVha2luZyBvdXQgYmVjYXVzZSB3ZSBhcmUgcmVhZGp1c3RpbmdcbiAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWNhbGN1bGF0ZSgpO1xuXG4gICAgICAvLyBlbWl0IHBhZ2UgZm9yIHZpcnR1YWwgc2VydmVyLXNpZGUga2lja29mZlxuICAgICAgaWYgKHRoaXMuZXh0ZXJuYWxQYWdpbmcgJiYgdGhpcy5zY3JvbGxiYXJWKSB7XG4gICAgICAgIHRoaXMucGFnZS5lbWl0KHtcbiAgICAgICAgICBjb3VudDogdGhpcy5jb3VudCxcbiAgICAgICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgICAgICBsaW1pdDogdGhpcy5saW1pdCxcbiAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGlmZWN5Y2xlIGhvb2sgdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgYSBjb21wb25lbnQnc1xuICAgKiBjb250ZW50IGhhcyBiZWVuIGZ1bGx5IGluaXRpYWxpemVkLlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuY29sdW1uVGVtcGxhdGVzLmNoYW5nZXMuc3Vic2NyaWJlKHYgPT4gdGhpcy50cmFuc2xhdGVDb2x1bW5zKHYpKTtcbiAgICB0aGlzLmxpc3RlbkZvckNvbHVtbklucHV0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgd2lsbCBiZSB1c2VkIHdoZW4gZGlzcGxheWluZyBvciBzZWxlY3Rpbmcgcm93cy5cbiAgICogd2hlbiB0cmFja2luZy9jb21wYXJpbmcgdGhlbSwgd2UnbGwgdXNlIHRoZSB2YWx1ZSBvZiB0aGlzIGZuLFxuICAgKlxuICAgKiAoYGZuKHgpID09PSBmbih5KWAgaW5zdGVhZCBvZiBgeCA9PT0geWApXG4gICAqL1xuICBASW5wdXQoKSByb3dJZGVudGl0eTogKHg6IGFueSkgPT4gYW55ID0gKHg6IGFueSkgPT4ge1xuICAgIGlmICh0aGlzLl9ncm91cFJvd3NCeSkge1xuICAgICAgLy8gZWFjaCBncm91cCBpbiBncm91cGVkUm93cyBhcmUgc3RvcmVkIGFzIHtrZXksIHZhbHVlOiBbcm93c119LFxuICAgICAgLy8gd2hlcmUga2V5IGlzIHRoZSBncm91cFJvd3NCeSBpbmRleFxuICAgICAgcmV0dXJuIHgua2V5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZXMgdGhlIHRlbXBsYXRlcyB0byB0aGUgY29sdW1uIG9iamVjdHNcbiAgICovXG4gIHRyYW5zbGF0ZUNvbHVtbnModmFsOiBhbnkpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICBjb25zdCBhcnIgPSB2YWwudG9BcnJheSgpO1xuICAgICAgaWYgKGFyci5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5faW50ZXJuYWxDb2x1bW5zID0gdHJhbnNsYXRlVGVtcGxhdGVzKGFycik7XG4gICAgICAgIHNldENvbHVtbkRlZmF1bHRzKHRoaXMuX2ludGVybmFsQ29sdW1ucyk7XG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGVDb2x1bW5zKCk7XG4gICAgICAgIHRoaXMuc29ydEludGVybmFsUm93cygpO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbWFwIHdpdGggdGhlIGRhdGEgZ3JvdXBlZCBieSB0aGUgdXNlciBjaG9pY2Ugb2YgZ3JvdXBpbmcgaW5kZXhcbiAgICpcbiAgICogQHBhcmFtIG9yaWdpbmFsQXJyYXkgdGhlIG9yaWdpbmFsIGFycmF5IHBhc3NlZCB2aWEgcGFyYW1ldGVyXG4gICAqIEBwYXJhbSBncm91cEJ5SW5kZXggIHRoZSBpbmRleCBvZiB0aGUgY29sdW1uIHRvIGdyb3VwIHRoZSBkYXRhIGJ5XG4gICAqL1xuICBncm91cEFycmF5Qnkob3JpZ2luYWxBcnJheTogYW55LCBncm91cEJ5OiBhbnkpIHtcbiAgICAvLyBjcmVhdGUgYSBtYXAgdG8gaG9sZCBncm91cHMgd2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIHJlc3VsdHNcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XG4gICAgbGV0IGk6IG51bWJlciA9IDA7XG5cbiAgICBvcmlnaW5hbEFycmF5LmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gaXRlbVtncm91cEJ5XTtcbiAgICAgIGlmICghbWFwLmhhcyhrZXkpKSB7XG4gICAgICAgIG1hcC5zZXQoa2V5LCBbaXRlbV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFwLmdldChrZXkpLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhZGRHcm91cCA9IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIHsga2V5LCB2YWx1ZSB9O1xuICAgIH07XG5cbiAgICAvLyBjb252ZXJ0IG1hcCBiYWNrIHRvIGEgc2ltcGxlIGFycmF5IG9mIG9iamVjdHNcbiAgICByZXR1cm4gQXJyYXkuZnJvbShtYXAsIHggPT4gYWRkR3JvdXAoeFswXSwgeFsxXSkpO1xuICB9XG5cbiAgLypcbiAgICogTGlmZWN5Y2xlIGhvb2sgdGhhdCBpcyBjYWxsZWQgd2hlbiBBbmd1bGFyIGRpcnR5IGNoZWNrcyBhIGRpcmVjdGl2ZS5cbiAgICovXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3dEaWZmZXIuZGlmZih0aGlzLnJvd3MpKSB7XG4gICAgICBpZiAoIXRoaXMuZXh0ZXJuYWxTb3J0aW5nKSB7XG4gICAgICAgIHRoaXMuc29ydEludGVybmFsUm93cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faW50ZXJuYWxSb3dzID0gWy4uLnRoaXMucm93c107XG4gICAgICB9XG5cbiAgICAgIC8vIGF1dG8gZ3JvdXAgYnkgcGFyZW50IG9uIG5ldyB1cGRhdGVcbiAgICAgIHRoaXMuX2ludGVybmFsUm93cyA9IGdyb3VwUm93c0J5UGFyZW50cyhcbiAgICAgICAgdGhpcy5faW50ZXJuYWxSb3dzLFxuICAgICAgICBvcHRpb25hbEdldHRlckZvclByb3AodGhpcy50cmVlRnJvbVJlbGF0aW9uKSxcbiAgICAgICAgb3B0aW9uYWxHZXR0ZXJGb3JQcm9wKHRoaXMudHJlZVRvUmVsYXRpb24pXG4gICAgICApO1xuXG4gICAgICB0aGlzLnJlY2FsY3VsYXRlUGFnZXMoKTtcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY2FsYydzIHRoZSBzaXplcyBvZiB0aGUgZ3JpZC5cbiAgICpcbiAgICogVXBkYXRlZCBhdXRvbWF0aWNhbGx5IG9uIGNoYW5nZXMgdG86XG4gICAqXG4gICAqICAtIENvbHVtbnNcbiAgICogIC0gUm93c1xuICAgKiAgLSBQYWdpbmcgcmVsYXRlZFxuICAgKlxuICAgKiBBbHNvIGNhbiBiZSBtYW51YWxseSBpbnZva2VkIG9yIHVwb24gd2luZG93IHJlc2l6ZS5cbiAgICovXG4gIHJlY2FsY3VsYXRlKCk6IHZvaWQge1xuICAgIHRoaXMucmVjYWxjdWxhdGVEaW1zKCk7XG4gICAgdGhpcy5yZWNhbGN1bGF0ZUNvbHVtbnMoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbmRvdyByZXNpemUgaGFuZGxlciB0byB1cGRhdGUgc2l6ZXMuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgQHRocm90dGxlYWJsZSg1KVxuICBvbldpbmRvd1Jlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWx1bGNhdGVzIHRoZSBjb2x1bW4gd2lkdGhzIGJhc2VkIG9uIGNvbHVtbiB3aWR0aFxuICAgKiBkaXN0cmlidXRpb24gbW9kZSBhbmQgc2Nyb2xsYmFyIG9mZnNldHMuXG4gICAqL1xuICByZWNhbGN1bGF0ZUNvbHVtbnMoXG4gICAgY29sdW1uczogYW55W10gPSB0aGlzLl9pbnRlcm5hbENvbHVtbnMsXG4gICAgZm9yY2VJZHg6IG51bWJlciA9IC0xLFxuICAgIGFsbG93QmxlZWQ6IGJvb2xlYW4gPSB0aGlzLnNjcm9sbGJhckhcbiAgKTogYW55W10gfCB1bmRlZmluZWQge1xuICAgIGlmICghY29sdW1ucykgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGxldCB3aWR0aCA9IHRoaXMuX2lubmVyV2lkdGg7XG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xuICAgICAgd2lkdGggPSB3aWR0aCAtIHRoaXMuc2Nyb2xsYmFySGVscGVyLndpZHRoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbHVtbk1vZGUgPT09IENvbHVtbk1vZGUuZm9yY2UpIHtcbiAgICAgIGZvcmNlRmlsbENvbHVtbldpZHRocyhjb2x1bW5zLCB3aWR0aCwgZm9yY2VJZHgsIGFsbG93QmxlZWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb2x1bW5Nb2RlID09PSBDb2x1bW5Nb2RlLmZsZXgpIHtcbiAgICAgIGFkanVzdENvbHVtbldpZHRocyhjb2x1bW5zLCB3aWR0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIHRoZSBkaW1lbnNpb25zIG9mIHRoZSB0YWJsZSBzaXplLlxuICAgKiBJbnRlcm5hbGx5IGNhbGxzIHRoZSBwYWdlIHNpemUgYW5kIHJvdyBjb3VudCBjYWxjcyB0b28uXG4gICAqXG4gICAqL1xuICByZWNhbGN1bGF0ZURpbXMoKTogdm9pZCB7XG4gICAgY29uc3QgZGltcyA9IHRoaXMuZGltZW5zaW9uc0hlbHBlci5nZXREaW1lbnNpb25zKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5faW5uZXJXaWR0aCA9IE1hdGguZmxvb3IoZGltcy53aWR0aCk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWKSB7XG4gICAgICBsZXQgaGVpZ2h0ID0gZGltcy5oZWlnaHQ7XG4gICAgICBpZiAodGhpcy5oZWFkZXJIZWlnaHQpIGhlaWdodCA9IGhlaWdodCAtIHRoaXMuaGVhZGVySGVpZ2h0O1xuICAgICAgaWYgKHRoaXMuZm9vdGVySGVpZ2h0KSBoZWlnaHQgPSBoZWlnaHQgLSB0aGlzLmZvb3RlckhlaWdodDtcbiAgICAgIHRoaXMuYm9keUhlaWdodCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLnJlY2FsY3VsYXRlUGFnZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgdGhlIHBhZ2VzIGFmdGVyIGEgdXBkYXRlLlxuICAgKi9cbiAgcmVjYWxjdWxhdGVQYWdlcygpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5jYWxjUGFnZVNpemUoKTtcbiAgICB0aGlzLnJvd0NvdW50ID0gdGhpcy5jYWxjUm93Q291bnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCb2R5IHRyaWdnZXJlZCBhIHBhZ2UgZXZlbnQuXG4gICAqL1xuICBvbkJvZHlQYWdlKHsgb2Zmc2V0IH06IGFueSk6IHZvaWQge1xuICAgIC8vIEF2b2lkIHBhZ2luYXRpb24gY2FtaW5nIGZyb20gYm9keSBldmVudHMgbGlrZSBzY3JvbGwgd2hlbiB0aGUgdGFibGVcbiAgICAvLyBoYXMgbm8gdmlydHVhbGl6YXRpb24gYW5kIHRoZSBleHRlcm5hbCBwYWdpbmcgaXMgZW5hYmxlLlxuICAgIC8vIFRoaXMgbWVhbnMsIGxldCdzIHRoZSBkZXZlbG9wZXIgaGFuZGxlIHBhZ2luYXRpb24gYnkgbXkgaGltKGhlcikgc2VsZlxuICAgIGlmICh0aGlzLmV4dGVybmFsUGFnaW5nICYmICF0aGlzLnZpcnR1YWxpemF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICB0aGlzLnBhZ2UuZW1pdCh7XG4gICAgICBjb3VudDogdGhpcy5jb3VudCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgbGltaXQ6IHRoaXMubGltaXQsXG4gICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJvZHkgdHJpZ2dlcmVkIGEgc2Nyb2xsIGV2ZW50LlxuICAgKi9cbiAgb25Cb2R5U2Nyb2xsKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5fb2Zmc2V0WC5uZXh0KGV2ZW50Lm9mZnNldFgpO1xuICAgIHRoaXMuc2Nyb2xsLmVtaXQoZXZlbnQpO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBmb290ZXIgdHJpZ2dlcmVkIGEgcGFnZSBldmVudC5cbiAgICovXG4gIG9uRm9vdGVyUGFnZShldmVudDogYW55KSB7XG4gICAgdGhpcy5vZmZzZXQgPSBldmVudC5wYWdlIC0gMTtcbiAgICB0aGlzLmJvZHlDb21wb25lbnQudXBkYXRlT2Zmc2V0WSh0aGlzLm9mZnNldCk7XG5cbiAgICB0aGlzLnBhZ2UuZW1pdCh7XG4gICAgICBjb3VudDogdGhpcy5jb3VudCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgbGltaXQ6IHRoaXMubGltaXQsXG4gICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5zZWxlY3RBbGxSb3dzT25QYWdlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgICB0aGlzLnNlbGVjdC5lbWl0KHtcbiAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc2VsZWN0ZWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgdGhlIHNpemVzIG9mIHRoZSBwYWdlXG4gICAqL1xuICBjYWxjUGFnZVNpemUodmFsOiBhbnlbXSA9IHRoaXMucm93cyk6IG51bWJlciB7XG4gICAgLy8gS2VlcCB0aGUgcGFnZSBzaXplIGNvbnN0YW50IGV2ZW4gaWYgdGhlIHJvdyBoYXMgYmVlbiBleHBhbmRlZC5cbiAgICAvLyBUaGlzIGlzIGJlY2F1c2UgYW4gZXhwYW5kZWQgcm93IGlzIHN0aWxsIGNvbnNpZGVyZWQgdG8gYmUgYSBjaGlsZCBvZlxuICAgIC8vIHRoZSBvcmlnaW5hbCByb3cuICBIZW5jZSBjYWxjdWxhdGlvbiB3b3VsZCB1c2Ugcm93SGVpZ2h0IG9ubHkuXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLnZpcnR1YWxpemF0aW9uKSB7XG4gICAgICBjb25zdCBzaXplID0gTWF0aC5jZWlsKHRoaXMuYm9keUhlaWdodCAvICh0aGlzLnJvd0hlaWdodCBhcyBudW1iZXIpKTtcbiAgICAgIHJldHVybiBNYXRoLm1heChzaXplLCAwKTtcbiAgICB9XG5cbiAgICAvLyBpZiBsaW1pdCBpcyBwYXNzZWQsIHdlIGFyZSBwYWdpbmdcbiAgICBpZiAodGhpcy5saW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5saW1pdDtcbiAgICB9XG5cbiAgICAvLyBvdGhlcndpc2UgdXNlIHJvdyBsZW5ndGhcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gdmFsLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBvdGhlciBlbXB0eSA6KFxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHJvdyBjb3VudC5cbiAgICovXG4gIGNhbGNSb3dDb3VudCh2YWw6IGFueVtdID0gdGhpcy5yb3dzKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMuZXh0ZXJuYWxQYWdpbmcpIHtcbiAgICAgIGlmICghdmFsKSByZXR1cm4gMDtcblxuICAgICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBlZFJvd3MubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnRyZWVGcm9tUmVsYXRpb24gIT0gbnVsbCAmJiB0aGlzLnRyZWVUb1JlbGF0aW9uICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVybmFsUm93cy5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaGVhZGVyIHRyaWdnZXJlZCBhIGNvbnRleHRtZW51IGV2ZW50LlxuICAgKi9cbiAgb25Db2x1bW5Db250ZXh0bWVudSh7IGV2ZW50LCBjb2x1bW4gfTogYW55KTogdm9pZCB7XG4gICAgdGhpcy50YWJsZUNvbnRleHRtZW51LmVtaXQoeyBldmVudCwgdHlwZTogQ29udGV4dG1lbnVUeXBlLmhlYWRlciwgY29udGVudDogY29sdW1uIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBib2R5IHRyaWdnZXJlZCBhIGNvbnRleHRtZW51IGV2ZW50LlxuICAgKi9cbiAgb25Sb3dDb250ZXh0bWVudSh7IGV2ZW50LCByb3cgfTogYW55KTogdm9pZCB7XG4gICAgdGhpcy50YWJsZUNvbnRleHRtZW51LmVtaXQoeyBldmVudCwgdHlwZTogQ29udGV4dG1lbnVUeXBlLmJvZHksIGNvbnRlbnQ6IHJvdyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaGVhZGVyIHRyaWdnZXJlZCBhIGNvbHVtbiByZXNpemUgZXZlbnQuXG4gICAqL1xuICBvbkNvbHVtblJlc2l6ZSh7IGNvbHVtbiwgbmV3VmFsdWUgfTogYW55KTogdm9pZCB7XG4gICAgLyogU2FmYXJpL2lPUyAxMC4yIHdvcmthcm91bmQgKi9cbiAgICBpZiAoY29sdW1uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaWR4OiBudW1iZXI7XG4gICAgY29uc3QgY29scyA9IHRoaXMuX2ludGVybmFsQ29sdW1ucy5tYXAoKGMsIGkpID0+IHtcbiAgICAgIGMgPSB7IC4uLmMgfTtcblxuICAgICAgaWYgKGMuJCRpZCA9PT0gY29sdW1uLiQkaWQpIHtcbiAgICAgICAgaWR4ID0gaTtcbiAgICAgICAgYy53aWR0aCA9IG5ld1ZhbHVlO1xuXG4gICAgICAgIC8vIHNldCB0aGlzIHNvIHdlIGNhbiBmb3JjZSB0aGUgY29sdW1uXG4gICAgICAgIC8vIHdpZHRoIGRpc3RyaWJ1dGlvbiB0byBiZSB0byB0aGlzIHZhbHVlXG4gICAgICAgIGMuJCRvbGRXaWR0aCA9IG5ld1ZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYztcbiAgICB9KTtcblxuICAgIHRoaXMucmVjYWxjdWxhdGVDb2x1bW5zKGNvbHMsIGlkeCk7XG4gICAgdGhpcy5faW50ZXJuYWxDb2x1bW5zID0gY29scztcblxuICAgIHRoaXMucmVzaXplLmVtaXQoe1xuICAgICAgY29sdW1uLFxuICAgICAgbmV3VmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaGVhZGVyIHRyaWdnZXJlZCBhIGNvbHVtbiByZS1vcmRlciBldmVudC5cbiAgICovXG4gIG9uQ29sdW1uUmVvcmRlcih7IGNvbHVtbiwgbmV3VmFsdWUsIHByZXZWYWx1ZSB9OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBjb2xzID0gdGhpcy5faW50ZXJuYWxDb2x1bW5zLm1hcChjID0+IHtcbiAgICAgIHJldHVybiB7IC4uLmMgfTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnN3YXBDb2x1bW5zKSB7XG4gICAgICBjb25zdCBwcmV2Q29sID0gY29sc1tuZXdWYWx1ZV07XG4gICAgICBjb2xzW25ld1ZhbHVlXSA9IGNvbHVtbjtcbiAgICAgIGNvbHNbcHJldlZhbHVlXSA9IHByZXZDb2w7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXdWYWx1ZSA+IHByZXZWYWx1ZSkge1xuICAgICAgICBjb25zdCBtb3ZlZENvbCA9IGNvbHNbcHJldlZhbHVlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHByZXZWYWx1ZTsgaSA8IG5ld1ZhbHVlOyBpKyspIHtcbiAgICAgICAgICBjb2xzW2ldID0gY29sc1tpICsgMV07XG4gICAgICAgIH1cbiAgICAgICAgY29sc1tuZXdWYWx1ZV0gPSBtb3ZlZENvbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1vdmVkQ29sID0gY29sc1twcmV2VmFsdWVdO1xuICAgICAgICBmb3IgKGxldCBpID0gcHJldlZhbHVlOyBpID4gbmV3VmFsdWU7IGktLSkge1xuICAgICAgICAgIGNvbHNbaV0gPSBjb2xzW2kgLSAxXTtcbiAgICAgICAgfVxuICAgICAgICBjb2xzW25ld1ZhbHVlXSA9IG1vdmVkQ29sO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2ludGVybmFsQ29sdW1ucyA9IGNvbHM7XG5cbiAgICB0aGlzLnJlb3JkZXIuZW1pdCh7XG4gICAgICBjb2x1bW4sXG4gICAgICBuZXdWYWx1ZSxcbiAgICAgIHByZXZWYWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXIgdHJpZ2dlcmVkIGEgY29sdW1uIHNvcnQgZXZlbnQuXG4gICAqL1xuICBvbkNvbHVtblNvcnQoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIC8vIGNsZWFuIHNlbGVjdGVkIHJvd3NcbiAgICBpZiAodGhpcy5zZWxlY3RBbGxSb3dzT25QYWdlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgICB0aGlzLnNlbGVjdC5lbWl0KHtcbiAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc2VsZWN0ZWRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc29ydHMgPSBldmVudC5zb3J0cztcblxuICAgIC8vIHRoaXMgY291bGQgYmUgb3B0aW1pemVkIGJldHRlciBzaW5jZSBpdCB3aWxsIHJlc29ydFxuICAgIC8vIHRoZSByb3dzIGFnYWluIG9uIHRoZSAncHVzaCcgZGV0ZWN0aW9uLi4uXG4gICAgaWYgKHRoaXMuZXh0ZXJuYWxTb3J0aW5nID09PSBmYWxzZSkge1xuICAgICAgLy8gZG9uJ3QgdXNlIG5vcm1hbCBzZXR0ZXIgc28gd2UgZG9uJ3QgcmVzb3J0XG4gICAgICB0aGlzLnNvcnRJbnRlcm5hbFJvd3MoKTtcbiAgICB9XG5cbiAgICAvLyBhdXRvIGdyb3VwIGJ5IHBhcmVudCBvbiBuZXcgdXBkYXRlXG4gICAgdGhpcy5faW50ZXJuYWxSb3dzID0gZ3JvdXBSb3dzQnlQYXJlbnRzKFxuICAgICAgdGhpcy5faW50ZXJuYWxSb3dzLFxuICAgICAgb3B0aW9uYWxHZXR0ZXJGb3JQcm9wKHRoaXMudHJlZUZyb21SZWxhdGlvbiksXG4gICAgICBvcHRpb25hbEdldHRlckZvclByb3AodGhpcy50cmVlVG9SZWxhdGlvbilcbiAgICApO1xuXG4gICAgLy8gQWx3YXlzIGdvIHRvIGZpcnN0IHBhZ2Ugd2hlbiBzb3J0aW5nIHRvIHNlZSB0aGUgbmV3bHkgc29ydGVkIGRhdGFcbiAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgdGhpcy5ib2R5Q29tcG9uZW50LnVwZGF0ZU9mZnNldFkodGhpcy5vZmZzZXQpO1xuICAgIHRoaXMuc29ydC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgYWxsIHJvdyBzZWxlY3Rpb25cbiAgICovXG4gIG9uSGVhZGVyU2VsZWN0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ib2R5Q29tcG9uZW50ICYmIHRoaXMuc2VsZWN0QWxsUm93c09uUGFnZSkge1xuICAgICAgLy8gYmVmb3JlIHdlIHNwbGljZSwgY2hrIGlmIHdlIGN1cnJlbnRseSBoYXZlIGFsbCBzZWxlY3RlZFxuICAgICAgY29uc3QgZmlyc3QgPSB0aGlzLmJvZHlDb21wb25lbnQuaW5kZXhlcy5maXJzdDtcbiAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLmJvZHlDb21wb25lbnQuaW5kZXhlcy5sYXN0O1xuICAgICAgY29uc3QgYWxsU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gbGFzdCAtIGZpcnN0O1xuXG4gICAgICAvLyByZW1vdmUgYWxsIGV4aXN0aW5nIGVpdGhlciB3YXlcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcblxuICAgICAgLy8gZG8gdGhlIG9wcG9zaXRlIGhlcmVcbiAgICAgIGlmICghYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5wdXNoKC4uLnRoaXMuX2ludGVybmFsUm93cy5zbGljZShmaXJzdCwgbGFzdCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBiZWZvcmUgd2Ugc3BsaWNlLCBjaGsgaWYgd2UgY3VycmVudGx5IGhhdmUgYWxsIHNlbGVjdGVkXG4gICAgICBjb25zdCBhbGxTZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09PSB0aGlzLnJvd3MubGVuZ3RoO1xuICAgICAgLy8gcmVtb3ZlIGFsbCBleGlzdGluZyBlaXRoZXIgd2F5XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgICAvLyBkbyB0aGUgb3Bwb3NpdGUgaGVyZVxuICAgICAgaWYgKCFhbGxTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkLnB1c2goLi4udGhpcy5yb3dzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdC5lbWl0KHtcbiAgICAgIHNlbGVjdGVkOiB0aGlzLnNlbGVjdGVkXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQSByb3cgd2FzIHNlbGVjdGVkIGZyb20gYm9keVxuICAgKi9cbiAgb25Cb2R5U2VsZWN0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJvdyB3YXMgZXhwYW5kZWQgb3IgY29sbGFwc2VkIGZvciB0cmVlXG4gICAqL1xuICBvblRyZWVBY3Rpb24oZXZlbnQ6IGFueSkge1xuICAgIGNvbnN0IHJvdyA9IGV2ZW50LnJvdztcbiAgICAvLyBUT0RPOiBGb3IgZHVwbGljYXRlZCBpdGVtcyB0aGlzIHdpbGwgbm90IHdvcmtcbiAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuX3Jvd3MuZmluZEluZGV4KHIgPT4gclt0aGlzLnRyZWVUb1JlbGF0aW9uXSA9PT0gZXZlbnQucm93W3RoaXMudHJlZVRvUmVsYXRpb25dKTtcbiAgICB0aGlzLnRyZWVBY3Rpb24uZW1pdCh7IHJvdywgcm93SW5kZXggfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goc3Vic2NyaXB0aW9uID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsaXN0ZW4gZm9yIGNoYW5nZXMgdG8gaW5wdXQgYmluZGluZ3Mgb2YgYWxsIERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZSBhbmRcbiAgICogdHJpZ2dlciB0aGUgY29sdW1uVGVtcGxhdGVzLmNoYW5nZXMgb2JzZXJ2YWJsZSB0byBlbWl0XG4gICAqL1xuICBwcml2YXRlIGxpc3RlbkZvckNvbHVtbklucHV0Q2hhbmdlcygpOiB2b2lkIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmNvbHVtbkNoYW5nZXNTZXJ2aWNlLmNvbHVtbklucHV0Q2hhbmdlcyQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1uVGVtcGxhdGVzKSB7XG4gICAgICAgICAgdGhpcy5jb2x1bW5UZW1wbGF0ZXMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgc29ydEludGVybmFsUm93cygpOiB2b2lkIHtcbiAgICB0aGlzLl9pbnRlcm5hbFJvd3MgPSBzb3J0Um93cyh0aGlzLl9pbnRlcm5hbFJvd3MsIHRoaXMuX2ludGVybmFsQ29sdW1ucywgdGhpcy5zb3J0cyk7XG4gIH1cbn1cbiJdfQ==