import { __decorate, __values } from "tslib";
import { Component, Output, EventEmitter, Input, HostBinding, ChangeDetectorRef, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ScrollerComponent } from './scroller.component';
import { columnsByPin, columnGroupWidths } from '../../utils/column';
import { RowHeightCache } from '../../utils/row-height-cache';
import { translateXY } from '../../utils/translate';
var DataTableBodyComponent = /** @class */ (function () {
    /**
     * Creates an instance of DataTableBodyComponent.
     */
    function DataTableBodyComponent(cd) {
        var _this = this;
        this.cd = cd;
        this.selected = [];
        this.scroll = new EventEmitter();
        this.page = new EventEmitter();
        this.activate = new EventEmitter();
        this.select = new EventEmitter();
        this.detailToggle = new EventEmitter();
        this.rowContextmenu = new EventEmitter(false);
        this.treeAction = new EventEmitter();
        this.rowHeightsCache = new RowHeightCache();
        this.temp = [];
        this.offsetY = 0;
        this.indexes = {};
        this.rowIndexes = new WeakMap();
        this.rowExpansions = [];
        /**
         * Get the height of the detail row.
         */
        this.getDetailRowHeight = function (row, index) {
            if (!_this.rowDetail) {
                return 0;
            }
            var rowHeight = _this.rowDetail.rowHeight;
            return typeof rowHeight === 'function' ? rowHeight(row, index) : rowHeight;
        };
        // declare fn here so we can get access to the `this` property
        this.rowTrackingFn = function (index, row) {
            var idx = _this.getRowIndex(row);
            if (_this.trackByProp) {
                return row[_this.trackByProp];
            }
            else {
                return idx;
            }
        };
    }
    Object.defineProperty(DataTableBodyComponent.prototype, "pageSize", {
        get: function () {
            return this._pageSize;
        },
        set: function (val) {
            this._pageSize = val;
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "rows", {
        get: function () {
            return this._rows;
        },
        set: function (val) {
            this._rows = val;
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (val) {
            this._columns = val;
            var colsByPin = columnsByPin(val);
            this.columnGroupWidths = columnGroupWidths(colsByPin, val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        set: function (val) {
            this._offset = val;
            if (!this.scrollbarV || (this.scrollbarV && !this.virtualization))
                this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "rowCount", {
        get: function () {
            return this._rowCount;
        },
        set: function (val) {
            this._rowCount = val;
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "bodyWidth", {
        get: function () {
            if (this.scrollbarH) {
                return this.innerWidth + 'px';
            }
            else {
                return '100%';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "bodyHeight", {
        get: function () {
            return this._bodyHeight;
        },
        set: function (val) {
            if (this.scrollbarV) {
                this._bodyHeight = val + 'px';
            }
            else {
                this._bodyHeight = 'auto';
            }
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "selectEnabled", {
        /**
         * Returns if selection is enabled.
         */
        get: function () {
            return !!this.selectionType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "scrollHeight", {
        /**
         * Property that would calculate the height of scroll bar
         * based on the row heights cache for virtual scroll and virtualization. Other scenarios
         * calculate scroll height automatically (as height will be undefined).
         */
        get: function () {
            if (this.scrollbarV && this.virtualization && this.rowCount) {
                return this.rowHeightsCache.query(this.rowCount - 1);
            }
            // avoid TS7030: Not all code paths return a value.
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called after the constructor, initializing input properties
     */
    DataTableBodyComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.rowDetail) {
            this.listener = this.rowDetail.toggle.subscribe(function (_a) {
                var type = _a.type, value = _a.value;
                if (type === 'row') {
                    _this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    _this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                _this.updateIndexes();
                _this.updateRows();
                _this.cd.markForCheck();
            });
        }
        if (this.groupHeader) {
            this.listener = this.groupHeader.toggle.subscribe(function (_a) {
                var type = _a.type, value = _a.value;
                if (type === 'group') {
                    _this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    _this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                _this.updateIndexes();
                _this.updateRows();
                _this.cd.markForCheck();
            });
        }
    };
    /**
     * Called once, before the instance is destroyed.
     */
    DataTableBodyComponent.prototype.ngOnDestroy = function () {
        if (this.rowDetail || this.groupHeader) {
            this.listener.unsubscribe();
        }
    };
    /**
     * Updates the Y offset given a new offset.
     */
    DataTableBodyComponent.prototype.updateOffsetY = function (offset) {
        // scroller is missing on empty table
        if (!this.scroller) {
            return;
        }
        if (this.scrollbarV && this.virtualization && offset) {
            // First get the row Index that we need to move to.
            var rowIndex = this.pageSize * offset;
            offset = this.rowHeightsCache.query(rowIndex - 1);
        }
        else if (this.scrollbarV && !this.virtualization) {
            offset = 0;
        }
        this.scroller.setOffset(offset || 0);
    };
    /**
     * Body was scrolled, this is mainly useful for
     * when a user is server-side pagination via virtual scroll.
     */
    DataTableBodyComponent.prototype.onBodyScroll = function (event) {
        var scrollYPos = event.scrollYPos;
        var scrollXPos = event.scrollXPos;
        // if scroll change, trigger update
        // this is mainly used for header cell positions
        if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
            this.scroll.emit({
                offsetY: scrollYPos,
                offsetX: scrollXPos
            });
        }
        this.offsetY = scrollYPos;
        this.offsetX = scrollXPos;
        this.updateIndexes();
        this.updatePage(event.direction);
        this.updateRows();
    };
    /**
     * Updates the page given a direction.
     */
    DataTableBodyComponent.prototype.updatePage = function (direction) {
        var offset = this.indexes.first / this.pageSize;
        if (direction === 'up') {
            offset = Math.ceil(offset);
        }
        else if (direction === 'down') {
            offset = Math.floor(offset);
        }
        if (direction !== undefined && !isNaN(offset)) {
            this.page.emit({ offset: offset });
        }
    };
    /**
     * Updates the rows in the view port
     */
    DataTableBodyComponent.prototype.updateRows = function () {
        var _this = this;
        var _a = this.indexes, first = _a.first, last = _a.last;
        var rowIndex = first;
        var idx = 0;
        var temp = [];
        // if grouprowsby has been specified treat row paging
        // parameters as group paging parameters ie if limit 10 has been
        // specified treat it as 10 groups rather than 10 rows
        if (this.groupedRows) {
            var maxRowsPerGroup = 3;
            // if there is only one group set the maximum number of
            // rows per group the same as the total number of rows
            if (this.groupedRows.length === 1) {
                maxRowsPerGroup = this.groupedRows[0].value.length;
            }
            while (rowIndex < last && rowIndex < this.groupedRows.length) {
                // Add the groups into this page
                var group = this.groupedRows[rowIndex];
                this.rowIndexes.set(group, rowIndex);
                if (group.value) {
                    // add indexes for each group item
                    group.value.forEach(function (g, i) {
                        var _idx = rowIndex + "-" + i;
                        _this.rowIndexes.set(g, _idx);
                    });
                }
                temp[idx] = group;
                idx++;
                // Group index in this context
                rowIndex++;
            }
        }
        else {
            while (rowIndex < last && rowIndex < this.rowCount) {
                var row = this.rows[rowIndex];
                if (row) {
                    // add indexes for each row
                    this.rowIndexes.set(row, rowIndex);
                    temp[idx] = row;
                }
                idx++;
                rowIndex++;
            }
        }
        this.temp = temp;
    };
    /**
     * Get the row height
     */
    DataTableBodyComponent.prototype.getRowHeight = function (row) {
        // if its a function return it
        if (typeof this.rowHeight === 'function') {
            return this.rowHeight(row);
        }
        return this.rowHeight;
    };
    /**
     * @param group the group with all rows
     */
    DataTableBodyComponent.prototype.getGroupHeight = function (group) {
        var rowHeight = 0;
        if (group.value) {
            for (var index = 0; index < group.value.length; index++) {
                rowHeight += this.getRowAndDetailHeight(group.value[index]);
            }
        }
        return rowHeight;
    };
    /**
     * Calculate row height based on the expanded state of the row.
     */
    DataTableBodyComponent.prototype.getRowAndDetailHeight = function (row) {
        var rowHeight = this.getRowHeight(row);
        var expanded = this.getRowExpanded(row);
        // Adding detail row height if its expanded.
        if (expanded) {
            rowHeight += this.getDetailRowHeight(row);
        }
        return rowHeight;
    };
    /**
     * Calculates the styles for the row so that the rows can be moved in 2D space
     * during virtual scroll inside the DOM.   In the below case the Y position is
     * manipulated.   As an example, if the height of row 0 is 30 px and row 1 is
     * 100 px then following styles are generated:
     *
     * transform: translate3d(0px, 0px, 0px);    ->  row0
     * transform: translate3d(0px, 30px, 0px);   ->  row1
     * transform: translate3d(0px, 130px, 0px);  ->  row2
     *
     * Row heights have to be calculated based on the row heights cache as we wont
     * be able to determine which row is of what height before hand.  In the above
     * case the positionY of the translate3d for row2 would be the sum of all the
     * heights of the rows before it (i.e. row0 and row1).
     *
     * @param rows the row that needs to be placed in the 2D space.
     * @returns the CSS3 style to be applied
     *
     * @memberOf DataTableBodyComponent
     */
    DataTableBodyComponent.prototype.getRowsStyles = function (rows) {
        var styles = {};
        // only add styles for the group if there is a group
        if (this.groupedRows) {
            styles.width = this.columnGroupWidths.total;
        }
        if (this.scrollbarV && this.virtualization) {
            var idx = 0;
            if (this.groupedRows) {
                // Get the latest row rowindex in a group
                var row = rows[rows.length - 1];
                idx = row ? this.getRowIndex(row) : 0;
            }
            else {
                idx = this.getRowIndex(rows);
            }
            // const pos = idx * rowHeight;
            // The position of this row would be the sum of all row heights
            // until the previous row position.
            var pos = this.rowHeightsCache.query(idx - 1);
            translateXY(styles, 0, pos);
        }
        return styles;
    };
    /**
     * Calculate bottom summary row offset for scrollbar mode.
     * For more information about cache and offset calculation
     * see description for `getRowsStyles` method
     *
     * @returns the CSS3 style to be applied
     *
     * @memberOf DataTableBodyComponent
     */
    DataTableBodyComponent.prototype.getBottomSummaryRowStyles = function () {
        if (!this.scrollbarV || !this.rows || !this.rows.length) {
            return null;
        }
        var styles = { position: 'absolute' };
        var pos = this.rowHeightsCache.query(this.rows.length - 1);
        translateXY(styles, 0, pos);
        return styles;
    };
    /**
     * Hides the loading indicator
     */
    DataTableBodyComponent.prototype.hideIndicator = function () {
        var _this = this;
        setTimeout(function () { return (_this.loadingIndicator = false); }, 500);
    };
    /**
     * Updates the index of the rows in the viewport
     */
    DataTableBodyComponent.prototype.updateIndexes = function () {
        var first = 0;
        var last = 0;
        if (this.scrollbarV) {
            if (this.virtualization) {
                // Calculation of the first and last indexes will be based on where the
                // scrollY position would be at.  The last index would be the one
                // that shows up inside the view port the last.
                var height = parseInt(this.bodyHeight, 0);
                first = this.rowHeightsCache.getRowIndex(this.offsetY);
                last = this.rowHeightsCache.getRowIndex(height + this.offsetY) + 1;
            }
            else {
                // If virtual rows are not needed
                // We render all in one go
                first = 0;
                last = this.rowCount;
            }
        }
        else {
            // The server is handling paging and will pass an array that begins with the
            // element at a specified offset.  first should always be 0 with external paging.
            if (!this.externalPaging) {
                first = Math.max(this.offset * this.pageSize, 0);
            }
            last = Math.min(first + this.pageSize, this.rowCount);
        }
        this.indexes = { first: first, last: last };
    };
    /**
     * Refreshes the full Row Height cache.  Should be used
     * when the entire row array state has changed.
     */
    DataTableBodyComponent.prototype.refreshRowHeightCache = function () {
        var e_1, _a;
        if (!this.scrollbarV || (this.scrollbarV && !this.virtualization)) {
            return;
        }
        // clear the previous row height cache if already present.
        // this is useful during sorts, filters where the state of the
        // rows array is changed.
        this.rowHeightsCache.clearCache();
        // Initialize the tree only if there are rows inside the tree.
        if (this.rows && this.rows.length) {
            var rowExpansions = new Set();
            try {
                for (var _b = __values(this.rows), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var row = _c.value;
                    if (this.getRowExpanded(row)) {
                        rowExpansions.add(row);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.rowHeightsCache.initCache({
                rows: this.rows,
                rowHeight: this.rowHeight,
                detailRowHeight: this.getDetailRowHeight,
                externalVirtual: this.scrollbarV && this.externalPaging,
                rowCount: this.rowCount,
                rowIndexes: this.rowIndexes,
                rowExpansions: rowExpansions
            });
        }
    };
    /**
     * Gets the index for the view port
     */
    DataTableBodyComponent.prototype.getAdjustedViewPortIndex = function () {
        // Capture the row index of the first row that is visible on the viewport.
        // If the scroll bar is just below the row which is highlighted then make that as the
        // first index.
        var viewPortFirstRowIndex = this.indexes.first;
        if (this.scrollbarV && this.virtualization) {
            var offsetScroll = this.rowHeightsCache.query(viewPortFirstRowIndex - 1);
            return offsetScroll <= this.offsetY ? viewPortFirstRowIndex - 1 : viewPortFirstRowIndex;
        }
        return viewPortFirstRowIndex;
    };
    /**
     * Toggle the Expansion of the row i.e. if the row is expanded then it will
     * collapse and vice versa.   Note that the expanded status is stored as
     * a part of the row object itself as we have to preserve the expanded row
     * status in case of sorting and filtering of the row set.
     */
    DataTableBodyComponent.prototype.toggleRowExpansion = function (row) {
        // Capture the row index of the first row that is visible on the viewport.
        var viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        var rowExpandedIdx = this.getRowExpandedIdx(row, this.rowExpansions);
        var expanded = rowExpandedIdx > -1;
        // If the detailRowHeight is auto --> only in case of non-virtualized scroll
        if (this.scrollbarV && this.virtualization) {
            var detailRowHeight = this.getDetailRowHeight(row) * (expanded ? -1 : 1);
            // const idx = this.rowIndexes.get(row) || 0;
            var idx = this.getRowIndex(row);
            this.rowHeightsCache.update(idx, detailRowHeight);
        }
        // Update the toggled row and update thive nevere heights in the cache.
        if (expanded) {
            this.rowExpansions.splice(rowExpandedIdx, 1);
        }
        else {
            this.rowExpansions.push(row);
        }
        this.detailToggle.emit({
            rows: [row],
            currentIndex: viewPortFirstRowIndex
        });
    };
    /**
     * Expand/Collapse all the rows no matter what their state is.
     */
    DataTableBodyComponent.prototype.toggleAllRows = function (expanded) {
        var e_2, _a;
        // clear prev expansions
        this.rowExpansions = [];
        // Capture the row index of the first row that is visible on the viewport.
        var viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        if (expanded) {
            try {
                for (var _b = __values(this.rows), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var row = _c.value;
                    this.rowExpansions.push(row);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (this.scrollbarV) {
            // Refresh the full row heights cache since every row was affected.
            this.recalcLayout();
        }
        // Emit all rows that have been expanded.
        this.detailToggle.emit({
            rows: this.rows,
            currentIndex: viewPortFirstRowIndex
        });
    };
    /**
     * Recalculates the table
     */
    DataTableBodyComponent.prototype.recalcLayout = function () {
        this.refreshRowHeightCache();
        this.updateIndexes();
        this.updateRows();
    };
    /**
     * Tracks the column
     */
    DataTableBodyComponent.prototype.columnTrackingFn = function (index, column) {
        return column.$$id;
    };
    /**
     * Gets the row pinning group styles
     */
    DataTableBodyComponent.prototype.stylesByGroup = function (group) {
        var widths = this.columnGroupWidths;
        var offsetX = this.offsetX;
        var styles = {
            width: widths[group] + "px"
        };
        if (group === 'left') {
            translateXY(styles, offsetX, 0);
        }
        else if (group === 'right') {
            var bodyWidth = parseInt(this.innerWidth + '', 0);
            var totalDiff = widths.total - bodyWidth;
            var offsetDiff = totalDiff - offsetX;
            var offset = offsetDiff * -1;
            translateXY(styles, offset, 0);
        }
        return styles;
    };
    /**
     * Returns if the row was expanded and set default row expansion when row expansion is empty
     */
    DataTableBodyComponent.prototype.getRowExpanded = function (row) {
        var e_3, _a;
        if (this.rowExpansions.length === 0 && this.groupExpansionDefault) {
            try {
                for (var _b = __values(this.groupedRows), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var group = _c.value;
                    this.rowExpansions.push(group);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return this.getRowExpandedIdx(row, this.rowExpansions) > -1;
    };
    DataTableBodyComponent.prototype.getRowExpandedIdx = function (row, expanded) {
        var _this = this;
        if (!expanded || !expanded.length)
            return -1;
        var rowId = this.rowIdentity(row);
        return expanded.findIndex(function (r) {
            var id = _this.rowIdentity(r);
            return id === rowId;
        });
    };
    /**
     * Gets the row index given a row
     */
    DataTableBodyComponent.prototype.getRowIndex = function (row) {
        return this.rowIndexes.get(row) || 0;
    };
    DataTableBodyComponent.prototype.onTreeAction = function (row) {
        this.treeAction.emit({ row: row });
    };
    DataTableBodyComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "scrollbarV", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "scrollbarH", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "loadingIndicator", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "externalPaging", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "rowHeight", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "offsetX", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "emptyMessage", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "selectionType", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "selected", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "rowIdentity", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "rowDetail", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "groupHeader", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "selectCheck", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "displayCheck", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "trackByProp", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "rowClass", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "groupedRows", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "groupExpansionDefault", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "innerWidth", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "groupRowsBy", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "virtualization", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "summaryRow", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "summaryPosition", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "summaryHeight", void 0);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "pageSize", null);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "rows", null);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "columns", null);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "offset", null);
    __decorate([
        Input()
    ], DataTableBodyComponent.prototype, "rowCount", null);
    __decorate([
        HostBinding('style.width')
    ], DataTableBodyComponent.prototype, "bodyWidth", null);
    __decorate([
        Input(),
        HostBinding('style.height')
    ], DataTableBodyComponent.prototype, "bodyHeight", null);
    __decorate([
        Output()
    ], DataTableBodyComponent.prototype, "scroll", void 0);
    __decorate([
        Output()
    ], DataTableBodyComponent.prototype, "page", void 0);
    __decorate([
        Output()
    ], DataTableBodyComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], DataTableBodyComponent.prototype, "select", void 0);
    __decorate([
        Output()
    ], DataTableBodyComponent.prototype, "detailToggle", void 0);
    __decorate([
        Output()
    ], DataTableBodyComponent.prototype, "rowContextmenu", void 0);
    __decorate([
        Output()
    ], DataTableBodyComponent.prototype, "treeAction", void 0);
    __decorate([
        ViewChild(ScrollerComponent)
    ], DataTableBodyComponent.prototype, "scroller", void 0);
    DataTableBodyComponent = __decorate([
        Component({
            selector: 'datatable-body',
            template: "\n    <datatable-progress *ngIf=\"loadingIndicator\"> </datatable-progress>\n    <datatable-selection\n      #selector\n      [selected]=\"selected\"\n      [rows]=\"rows\"\n      [selectCheck]=\"selectCheck\"\n      [selectEnabled]=\"selectEnabled\"\n      [selectionType]=\"selectionType\"\n      [rowIdentity]=\"rowIdentity\"\n      (select)=\"select.emit($event)\"\n      (activate)=\"activate.emit($event)\"\n    >\n      <datatable-scroller\n        *ngIf=\"rows?.length\"\n        [scrollbarV]=\"scrollbarV\"\n        [scrollbarH]=\"scrollbarH\"\n        [scrollHeight]=\"scrollHeight\"\n        [scrollWidth]=\"columnGroupWidths?.total\"\n        (scroll)=\"onBodyScroll($event)\"\n      >\n        <datatable-summary-row\n          *ngIf=\"summaryRow && summaryPosition === 'top'\"\n          [rowHeight]=\"summaryHeight\"\n          [offsetX]=\"offsetX\"\n          [innerWidth]=\"innerWidth\"\n          [rows]=\"rows\"\n          [columns]=\"columns\"\n        >\n        </datatable-summary-row>\n        <datatable-row-wrapper\n          [groupedRows]=\"groupedRows\"\n          *ngFor=\"let group of temp; let i = index; trackBy: rowTrackingFn\"\n          [innerWidth]=\"innerWidth\"\n          [ngStyle]=\"getRowsStyles(group)\"\n          [rowDetail]=\"rowDetail\"\n          [groupHeader]=\"groupHeader\"\n          [offsetX]=\"offsetX\"\n          [detailRowHeight]=\"getDetailRowHeight(group && group[i], i)\"\n          [row]=\"group\"\n          [expanded]=\"getRowExpanded(group)\"\n          [rowIndex]=\"getRowIndex(group && group[i])\"\n          (rowContextmenu)=\"rowContextmenu.emit($event)\"\n        >\n          <datatable-body-row\n            *ngIf=\"!groupedRows; else groupedRowsTemplate\"\n            tabindex=\"-1\"\n            [isSelected]=\"selector.getRowSelected(group)\"\n            [innerWidth]=\"innerWidth\"\n            [offsetX]=\"offsetX\"\n            [columns]=\"columns\"\n            [rowHeight]=\"getRowHeight(group)\"\n            [row]=\"group\"\n            [rowIndex]=\"getRowIndex(group)\"\n            [expanded]=\"getRowExpanded(group)\"\n            [rowClass]=\"rowClass\"\n            [displayCheck]=\"displayCheck\"\n            [treeStatus]=\"group && group.treeStatus\"\n            (treeAction)=\"onTreeAction(group)\"\n            (activate)=\"selector.onActivate($event, indexes.first + i)\"\n          >\n          </datatable-body-row>\n          <ng-template #groupedRowsTemplate>\n            <datatable-body-row\n              *ngFor=\"let row of group.value; let i = index; trackBy: rowTrackingFn\"\n              tabindex=\"-1\"\n              [isSelected]=\"selector.getRowSelected(row)\"\n              [innerWidth]=\"innerWidth\"\n              [offsetX]=\"offsetX\"\n              [columns]=\"columns\"\n              [rowHeight]=\"getRowHeight(row)\"\n              [row]=\"row\"\n              [group]=\"group.value\"\n              [rowIndex]=\"getRowIndex(row)\"\n              [expanded]=\"getRowExpanded(row)\"\n              [rowClass]=\"rowClass\"\n              (activate)=\"selector.onActivate($event, i)\"\n            >\n            </datatable-body-row>\n          </ng-template>\n        </datatable-row-wrapper>\n        <datatable-summary-row\n          *ngIf=\"summaryRow && summaryPosition === 'bottom'\"\n          [ngStyle]=\"getBottomSummaryRowStyles()\"\n          [rowHeight]=\"summaryHeight\"\n          [offsetX]=\"offsetX\"\n          [innerWidth]=\"innerWidth\"\n          [rows]=\"rows\"\n          [columns]=\"columns\"\n        >\n        </datatable-summary-row>\n      </datatable-scroller>\n      <div class=\"empty-row\" *ngIf=\"!rows?.length && !loadingIndicator\" [innerHTML]=\"emptyMessage\"></div>\n    </datatable-selection>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            host: {
                class: 'datatable-body'
            }
        })
    ], DataTableBodyComponent);
    return DataTableBodyComponent;
}());
export { DataTableBodyComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBQ0wsV0FBVyxFQUNYLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsTUFBTSxFQUNOLFNBQVMsRUFDVCx1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFekQsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUF3R3BEO0lBaUpFOztPQUVHO0lBQ0gsZ0NBQW9CLEVBQXFCO1FBQXpDLGlCQVVDO1FBVm1CLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBM0loQyxhQUFRLEdBQVUsRUFBRSxDQUFDO1FBd0ZwQixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdDLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRCxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFrQyxLQUFLLENBQUMsQ0FBQztRQUMxRSxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUF3QjdELG9CQUFlLEdBQW1CLElBQUksY0FBYyxFQUFFLENBQUM7UUFD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QU0sRUFBRTt3REFBOEM7SUFDN0M7UUFBVCxNQUFNLEVBQUU7NERBQWtEO0lBQ2pEO1FBQVQsTUFBTSxFQUFFOzBEQUFnRDtJQUMvQztRQUFULE1BQU0sRUFBRTtnRUFBc0Q7SUFDckQ7UUFBVCxNQUFNLEVBQUU7a0VBQTJFO0lBQzFFO1FBQVQsTUFBTSxFQUFFOzhEQUFvRDtJQUUvQjtRQUE3QixTQUFTLENBQUMsaUJBQWlCLENBQUM7NERBQTZCO0lBekcvQyxzQkFBc0I7UUF0R2xDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsUUFBUSxFQUFFLDBxSEE4RlQ7WUFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLGdCQUFnQjthQUN4QjtTQUNGLENBQUM7T0FDVyxzQkFBc0IsQ0FxcUJsQztJQUFELDZCQUFDO0NBQUEsQUFycUJELElBcXFCQztTQXJxQlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIEhvc3RCaW5kaW5nLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgVmlld0NoaWxkLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxlckNvbXBvbmVudCB9IGZyb20gJy4vc2Nyb2xsZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9zZWxlY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBjb2x1bW5zQnlQaW4sIGNvbHVtbkdyb3VwV2lkdGhzIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29sdW1uJztcbmltcG9ydCB7IFJvd0hlaWdodENhY2hlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm93LWhlaWdodC1jYWNoZSc7XG5pbXBvcnQgeyB0cmFuc2xhdGVYWSB9IGZyb20gJy4uLy4uL3V0aWxzL3RyYW5zbGF0ZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RhdGF0YWJsZS1ib2R5JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGF0YXRhYmxlLXByb2dyZXNzICpuZ0lmPVwibG9hZGluZ0luZGljYXRvclwiPiA8L2RhdGF0YWJsZS1wcm9ncmVzcz5cbiAgICA8ZGF0YXRhYmxlLXNlbGVjdGlvblxuICAgICAgI3NlbGVjdG9yXG4gICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgW3Jvd3NdPVwicm93c1wiXG4gICAgICBbc2VsZWN0Q2hlY2tdPVwic2VsZWN0Q2hlY2tcIlxuICAgICAgW3NlbGVjdEVuYWJsZWRdPVwic2VsZWN0RW5hYmxlZFwiXG4gICAgICBbc2VsZWN0aW9uVHlwZV09XCJzZWxlY3Rpb25UeXBlXCJcbiAgICAgIFtyb3dJZGVudGl0eV09XCJyb3dJZGVudGl0eVwiXG4gICAgICAoc2VsZWN0KT1cInNlbGVjdC5lbWl0KCRldmVudClcIlxuICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlLmVtaXQoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPGRhdGF0YWJsZS1zY3JvbGxlclxuICAgICAgICAqbmdJZj1cInJvd3M/Lmxlbmd0aFwiXG4gICAgICAgIFtzY3JvbGxiYXJWXT1cInNjcm9sbGJhclZcIlxuICAgICAgICBbc2Nyb2xsYmFySF09XCJzY3JvbGxiYXJIXCJcbiAgICAgICAgW3Njcm9sbEhlaWdodF09XCJzY3JvbGxIZWlnaHRcIlxuICAgICAgICBbc2Nyb2xsV2lkdGhdPVwiY29sdW1uR3JvdXBXaWR0aHM/LnRvdGFsXCJcbiAgICAgICAgKHNjcm9sbCk9XCJvbkJvZHlTY3JvbGwoJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICAgIDxkYXRhdGFibGUtc3VtbWFyeS1yb3dcbiAgICAgICAgICAqbmdJZj1cInN1bW1hcnlSb3cgJiYgc3VtbWFyeVBvc2l0aW9uID09PSAndG9wJ1wiXG4gICAgICAgICAgW3Jvd0hlaWdodF09XCJzdW1tYXJ5SGVpZ2h0XCJcbiAgICAgICAgICBbb2Zmc2V0WF09XCJvZmZzZXRYXCJcbiAgICAgICAgICBbaW5uZXJXaWR0aF09XCJpbm5lcldpZHRoXCJcbiAgICAgICAgICBbcm93c109XCJyb3dzXCJcbiAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcbiAgICAgICAgPlxuICAgICAgICA8L2RhdGF0YWJsZS1zdW1tYXJ5LXJvdz5cbiAgICAgICAgPGRhdGF0YWJsZS1yb3ctd3JhcHBlclxuICAgICAgICAgIFtncm91cGVkUm93c109XCJncm91cGVkUm93c1wiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGdyb3VwIG9mIHRlbXA7IGxldCBpID0gaW5kZXg7IHRyYWNrQnk6IHJvd1RyYWNraW5nRm5cIlxuICAgICAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxuICAgICAgICAgIFtuZ1N0eWxlXT1cImdldFJvd3NTdHlsZXMoZ3JvdXApXCJcbiAgICAgICAgICBbcm93RGV0YWlsXT1cInJvd0RldGFpbFwiXG4gICAgICAgICAgW2dyb3VwSGVhZGVyXT1cImdyb3VwSGVhZGVyXCJcbiAgICAgICAgICBbb2Zmc2V0WF09XCJvZmZzZXRYXCJcbiAgICAgICAgICBbZGV0YWlsUm93SGVpZ2h0XT1cImdldERldGFpbFJvd0hlaWdodChncm91cCAmJiBncm91cFtpXSwgaSlcIlxuICAgICAgICAgIFtyb3ddPVwiZ3JvdXBcIlxuICAgICAgICAgIFtleHBhbmRlZF09XCJnZXRSb3dFeHBhbmRlZChncm91cClcIlxuICAgICAgICAgIFtyb3dJbmRleF09XCJnZXRSb3dJbmRleChncm91cCAmJiBncm91cFtpXSlcIlxuICAgICAgICAgIChyb3dDb250ZXh0bWVudSk9XCJyb3dDb250ZXh0bWVudS5lbWl0KCRldmVudClcIlxuICAgICAgICA+XG4gICAgICAgICAgPGRhdGF0YWJsZS1ib2R5LXJvd1xuICAgICAgICAgICAgKm5nSWY9XCIhZ3JvdXBlZFJvd3M7IGVsc2UgZ3JvdXBlZFJvd3NUZW1wbGF0ZVwiXG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgIFtpc1NlbGVjdGVkXT1cInNlbGVjdG9yLmdldFJvd1NlbGVjdGVkKGdyb3VwKVwiXG4gICAgICAgICAgICBbaW5uZXJXaWR0aF09XCJpbm5lcldpZHRoXCJcbiAgICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxuICAgICAgICAgICAgW2NvbHVtbnNdPVwiY29sdW1uc1wiXG4gICAgICAgICAgICBbcm93SGVpZ2h0XT1cImdldFJvd0hlaWdodChncm91cClcIlxuICAgICAgICAgICAgW3Jvd109XCJncm91cFwiXG4gICAgICAgICAgICBbcm93SW5kZXhdPVwiZ2V0Um93SW5kZXgoZ3JvdXApXCJcbiAgICAgICAgICAgIFtleHBhbmRlZF09XCJnZXRSb3dFeHBhbmRlZChncm91cClcIlxuICAgICAgICAgICAgW3Jvd0NsYXNzXT1cInJvd0NsYXNzXCJcbiAgICAgICAgICAgIFtkaXNwbGF5Q2hlY2tdPVwiZGlzcGxheUNoZWNrXCJcbiAgICAgICAgICAgIFt0cmVlU3RhdHVzXT1cImdyb3VwICYmIGdyb3VwLnRyZWVTdGF0dXNcIlxuICAgICAgICAgICAgKHRyZWVBY3Rpb24pPVwib25UcmVlQWN0aW9uKGdyb3VwKVwiXG4gICAgICAgICAgICAoYWN0aXZhdGUpPVwic2VsZWN0b3Iub25BY3RpdmF0ZSgkZXZlbnQsIGluZGV4ZXMuZmlyc3QgKyBpKVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvZGF0YXRhYmxlLWJvZHktcm93PlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZ3JvdXBlZFJvd3NUZW1wbGF0ZT5cbiAgICAgICAgICAgIDxkYXRhdGFibGUtYm9keS1yb3dcbiAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IHJvdyBvZiBncm91cC52YWx1ZTsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogcm93VHJhY2tpbmdGblwiXG4gICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgICBbaXNTZWxlY3RlZF09XCJzZWxlY3Rvci5nZXRSb3dTZWxlY3RlZChyb3cpXCJcbiAgICAgICAgICAgICAgW2lubmVyV2lkdGhdPVwiaW5uZXJXaWR0aFwiXG4gICAgICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxuICAgICAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcbiAgICAgICAgICAgICAgW3Jvd0hlaWdodF09XCJnZXRSb3dIZWlnaHQocm93KVwiXG4gICAgICAgICAgICAgIFtyb3ddPVwicm93XCJcbiAgICAgICAgICAgICAgW2dyb3VwXT1cImdyb3VwLnZhbHVlXCJcbiAgICAgICAgICAgICAgW3Jvd0luZGV4XT1cImdldFJvd0luZGV4KHJvdylcIlxuICAgICAgICAgICAgICBbZXhwYW5kZWRdPVwiZ2V0Um93RXhwYW5kZWQocm93KVwiXG4gICAgICAgICAgICAgIFtyb3dDbGFzc109XCJyb3dDbGFzc1wiXG4gICAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJzZWxlY3Rvci5vbkFjdGl2YXRlKCRldmVudCwgaSlcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9kYXRhdGFibGUtYm9keS1yb3c+XG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kYXRhdGFibGUtcm93LXdyYXBwZXI+XG4gICAgICAgIDxkYXRhdGFibGUtc3VtbWFyeS1yb3dcbiAgICAgICAgICAqbmdJZj1cInN1bW1hcnlSb3cgJiYgc3VtbWFyeVBvc2l0aW9uID09PSAnYm90dG9tJ1wiXG4gICAgICAgICAgW25nU3R5bGVdPVwiZ2V0Qm90dG9tU3VtbWFyeVJvd1N0eWxlcygpXCJcbiAgICAgICAgICBbcm93SGVpZ2h0XT1cInN1bW1hcnlIZWlnaHRcIlxuICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxuICAgICAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxuICAgICAgICAgIFtyb3dzXT1cInJvd3NcIlxuICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbnNcIlxuICAgICAgICA+XG4gICAgICAgIDwvZGF0YXRhYmxlLXN1bW1hcnktcm93PlxuICAgICAgPC9kYXRhdGFibGUtc2Nyb2xsZXI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktcm93XCIgKm5nSWY9XCIhcm93cz8ubGVuZ3RoICYmICFsb2FkaW5nSW5kaWNhdG9yXCIgW2lubmVySFRNTF09XCJlbXB0eU1lc3NhZ2VcIj48L2Rpdj5cbiAgICA8L2RhdGF0YWJsZS1zZWxlY3Rpb24+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdkYXRhdGFibGUtYm9keSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVCb2R5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBzY3JvbGxiYXJWOiBib29sZWFuO1xuICBASW5wdXQoKSBzY3JvbGxiYXJIOiBib29sZWFuO1xuICBASW5wdXQoKSBsb2FkaW5nSW5kaWNhdG9yOiBib29sZWFuO1xuICBASW5wdXQoKSBleHRlcm5hbFBhZ2luZzogYm9vbGVhbjtcbiAgQElucHV0KCkgcm93SGVpZ2h0OiBudW1iZXIgfCAnYXV0bycgfCAoKHJvdz86IGFueSkgPT4gbnVtYmVyKTtcbiAgQElucHV0KCkgb2Zmc2V0WDogbnVtYmVyO1xuICBASW5wdXQoKSBlbXB0eU1lc3NhZ2U6IHN0cmluZztcbiAgQElucHV0KCkgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZTtcbiAgQElucHV0KCkgc2VsZWN0ZWQ6IGFueVtdID0gW107XG4gIEBJbnB1dCgpIHJvd0lkZW50aXR5OiBhbnk7XG4gIEBJbnB1dCgpIHJvd0RldGFpbDogYW55O1xuICBASW5wdXQoKSBncm91cEhlYWRlcjogYW55O1xuICBASW5wdXQoKSBzZWxlY3RDaGVjazogYW55O1xuICBASW5wdXQoKSBkaXNwbGF5Q2hlY2s6IGFueTtcbiAgQElucHV0KCkgdHJhY2tCeVByb3A6IHN0cmluZztcbiAgQElucHV0KCkgcm93Q2xhc3M6IGFueTtcbiAgQElucHV0KCkgZ3JvdXBlZFJvd3M6IGFueTtcbiAgQElucHV0KCkgZ3JvdXBFeHBhbnNpb25EZWZhdWx0OiBib29sZWFuO1xuICBASW5wdXQoKSBpbm5lcldpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIGdyb3VwUm93c0J5OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHZpcnR1YWxpemF0aW9uOiBib29sZWFuO1xuICBASW5wdXQoKSBzdW1tYXJ5Um93OiBib29sZWFuO1xuICBASW5wdXQoKSBzdW1tYXJ5UG9zaXRpb246IHN0cmluZztcbiAgQElucHV0KCkgc3VtbWFyeUhlaWdodDogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIHNldCBwYWdlU2l6ZSh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VTaXplID0gdmFsO1xuICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XG4gIH1cblxuICBnZXQgcGFnZVNpemUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZVNpemU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgcm93cyh2YWw6IGFueVtdKSB7XG4gICAgdGhpcy5fcm93cyA9IHZhbDtcbiAgICB0aGlzLnJlY2FsY0xheW91dCgpO1xuICB9XG5cbiAgZ2V0IHJvd3MoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGNvbHVtbnModmFsOiBhbnlbXSkge1xuICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XG4gICAgY29uc3QgY29sc0J5UGluID0gY29sdW1uc0J5UGluKHZhbCk7XG4gICAgdGhpcy5jb2x1bW5Hcm91cFdpZHRocyA9IGNvbHVtbkdyb3VwV2lkdGhzKGNvbHNCeVBpbiwgdmFsKTtcbiAgfVxuXG4gIGdldCBjb2x1bW5zKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBvZmZzZXQodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWw7XG4gICAgaWYgKCF0aGlzLnNjcm9sbGJhclYgfHwgKHRoaXMuc2Nyb2xsYmFyViAmJiAhdGhpcy52aXJ0dWFsaXphdGlvbikpIHRoaXMucmVjYWxjTGF5b3V0KCk7XG4gIH1cblxuICBnZXQgb2Zmc2V0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCByb3dDb3VudCh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX3Jvd0NvdW50ID0gdmFsO1xuICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XG4gIH1cblxuICBnZXQgcm93Q291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcm93Q291bnQ7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLndpZHRoJylcbiAgZ2V0IGJvZHlXaWR0aCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnNjcm9sbGJhckgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlubmVyV2lkdGggKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJzEwMCUnO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JylcbiAgc2V0IGJvZHlIZWlnaHQodmFsKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xuICAgICAgdGhpcy5fYm9keUhlaWdodCA9IHZhbCArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvZHlIZWlnaHQgPSAnYXV0byc7XG4gICAgfVxuXG4gICAgdGhpcy5yZWNhbGNMYXlvdXQoKTtcbiAgfVxuXG4gIGdldCBib2R5SGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9ib2R5SGVpZ2h0O1xuICB9XG5cbiAgQE91dHB1dCgpIHNjcm9sbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwYWdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZXRhaWxUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcm93Q29udGV4dG1lbnUgPSBuZXcgRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IE1vdXNlRXZlbnQ7IHJvdzogYW55IH0+KGZhbHNlKTtcbiAgQE91dHB1dCgpIHRyZWVBY3Rpb246IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBWaWV3Q2hpbGQoU2Nyb2xsZXJDb21wb25lbnQpIHNjcm9sbGVyOiBTY3JvbGxlckNvbXBvbmVudDtcblxuICAvKipcbiAgICogUmV0dXJucyBpZiBzZWxlY3Rpb24gaXMgZW5hYmxlZC5cbiAgICovXG4gIGdldCBzZWxlY3RFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuc2VsZWN0aW9uVHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wZXJ0eSB0aGF0IHdvdWxkIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0IG9mIHNjcm9sbCBiYXJcbiAgICogYmFzZWQgb24gdGhlIHJvdyBoZWlnaHRzIGNhY2hlIGZvciB2aXJ0dWFsIHNjcm9sbCBhbmQgdmlydHVhbGl6YXRpb24uIE90aGVyIHNjZW5hcmlvc1xuICAgKiBjYWxjdWxhdGUgc2Nyb2xsIGhlaWdodCBhdXRvbWF0aWNhbGx5IChhcyBoZWlnaHQgd2lsbCBiZSB1bmRlZmluZWQpLlxuICAgKi9cbiAgZ2V0IHNjcm9sbEhlaWdodCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgdGhpcy52aXJ0dWFsaXphdGlvbiAmJiB0aGlzLnJvd0NvdW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yb3dIZWlnaHRzQ2FjaGUucXVlcnkodGhpcy5yb3dDb3VudCAtIDEpO1xuICAgIH1cbiAgICAvLyBhdm9pZCBUUzcwMzA6IE5vdCBhbGwgY29kZSBwYXRocyByZXR1cm4gYSB2YWx1ZS5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcm93SGVpZ2h0c0NhY2hlOiBSb3dIZWlnaHRDYWNoZSA9IG5ldyBSb3dIZWlnaHRDYWNoZSgpO1xuICB0ZW1wOiBhbnlbXSA9IFtdO1xuICBvZmZzZXRZID0gMDtcbiAgaW5kZXhlczogYW55ID0ge307XG4gIGNvbHVtbkdyb3VwV2lkdGhzOiBhbnk7XG4gIGNvbHVtbkdyb3VwV2lkdGhzV2l0aG91dEdyb3VwOiBhbnk7XG4gIHJvd1RyYWNraW5nRm46IGFueTtcbiAgbGlzdGVuZXI6IGFueTtcbiAgcm93SW5kZXhlczogYW55ID0gbmV3IFdlYWtNYXA8YW55LCBzdHJpbmc+KCk7XG4gIHJvd0V4cGFuc2lvbnM6IGFueVtdID0gW107XG5cbiAgX3Jvd3M6IGFueVtdO1xuICBfYm9keUhlaWdodDogYW55O1xuICBfY29sdW1uczogYW55W107XG4gIF9yb3dDb3VudDogbnVtYmVyO1xuICBfb2Zmc2V0OiBudW1iZXI7XG4gIF9wYWdlU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIERhdGFUYWJsZUJvZHlDb21wb25lbnQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIC8vIGRlY2xhcmUgZm4gaGVyZSBzbyB3ZSBjYW4gZ2V0IGFjY2VzcyB0byB0aGUgYHRoaXNgIHByb3BlcnR5XG4gICAgdGhpcy5yb3dUcmFja2luZ0ZuID0gKGluZGV4OiBudW1iZXIsIHJvdzogYW55KTogYW55ID0+IHtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuZ2V0Um93SW5kZXgocm93KTtcbiAgICAgIGlmICh0aGlzLnRyYWNrQnlQcm9wKSB7XG4gICAgICAgIHJldHVybiByb3dbdGhpcy50cmFja0J5UHJvcF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBjb25zdHJ1Y3RvciwgaW5pdGlhbGl6aW5nIGlucHV0IHByb3BlcnRpZXNcbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvd0RldGFpbCkge1xuICAgICAgdGhpcy5saXN0ZW5lciA9IHRoaXMucm93RGV0YWlsLnRvZ2dsZS5zdWJzY3JpYmUoKHsgdHlwZSwgdmFsdWUgfTogeyB0eXBlOiBzdHJpbmc7IHZhbHVlOiBhbnkgfSkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3JvdycpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVJvd0V4cGFuc2lvbih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdhbGwnKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVBbGxSb3dzKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZnJlc2ggcm93cyBhZnRlciB0b2dnbGVcbiAgICAgICAgLy8gRml4ZXMgIzg4M1xuICAgICAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVSb3dzKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncm91cEhlYWRlcikge1xuICAgICAgdGhpcy5saXN0ZW5lciA9IHRoaXMuZ3JvdXBIZWFkZXIudG9nZ2xlLnN1YnNjcmliZSgoeyB0eXBlLCB2YWx1ZSB9OiB7IHR5cGU6IHN0cmluZzsgdmFsdWU6IGFueSB9KSA9PiB7XG4gICAgICAgIGlmICh0eXBlID09PSAnZ3JvdXAnKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVSb3dFeHBhbnNpb24odmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnYWxsJykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlQWxsUm93cyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWZyZXNoIHJvd3MgYWZ0ZXIgdG9nZ2xlXG4gICAgICAgIC8vIEZpeGVzICM4ODNcbiAgICAgICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUm93cygpO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBvbmNlLCBiZWZvcmUgdGhlIGluc3RhbmNlIGlzIGRlc3Ryb3llZC5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvd0RldGFpbCB8fCB0aGlzLmdyb3VwSGVhZGVyKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIFkgb2Zmc2V0IGdpdmVuIGEgbmV3IG9mZnNldC5cbiAgICovXG4gIHVwZGF0ZU9mZnNldFkob2Zmc2V0PzogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gc2Nyb2xsZXIgaXMgbWlzc2luZyBvbiBlbXB0eSB0YWJsZVxuICAgIGlmICghdGhpcy5zY3JvbGxlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgdGhpcy52aXJ0dWFsaXphdGlvbiAmJiBvZmZzZXQpIHtcbiAgICAgIC8vIEZpcnN0IGdldCB0aGUgcm93IEluZGV4IHRoYXQgd2UgbmVlZCB0byBtb3ZlIHRvLlxuICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLnBhZ2VTaXplICogb2Zmc2V0O1xuICAgICAgb2Zmc2V0ID0gdGhpcy5yb3dIZWlnaHRzQ2FjaGUucXVlcnkocm93SW5kZXggLSAxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiAhdGhpcy52aXJ0dWFsaXphdGlvbikge1xuICAgICAgb2Zmc2V0ID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLnNjcm9sbGVyLnNldE9mZnNldChvZmZzZXQgfHwgMCk7XG4gIH1cblxuICAvKipcbiAgICogQm9keSB3YXMgc2Nyb2xsZWQsIHRoaXMgaXMgbWFpbmx5IHVzZWZ1bCBmb3JcbiAgICogd2hlbiBhIHVzZXIgaXMgc2VydmVyLXNpZGUgcGFnaW5hdGlvbiB2aWEgdmlydHVhbCBzY3JvbGwuXG4gICAqL1xuICBvbkJvZHlTY3JvbGwoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHNjcm9sbFlQb3M6IG51bWJlciA9IGV2ZW50LnNjcm9sbFlQb3M7XG4gICAgY29uc3Qgc2Nyb2xsWFBvczogbnVtYmVyID0gZXZlbnQuc2Nyb2xsWFBvcztcblxuICAgIC8vIGlmIHNjcm9sbCBjaGFuZ2UsIHRyaWdnZXIgdXBkYXRlXG4gICAgLy8gdGhpcyBpcyBtYWlubHkgdXNlZCBmb3IgaGVhZGVyIGNlbGwgcG9zaXRpb25zXG4gICAgaWYgKHRoaXMub2Zmc2V0WSAhPT0gc2Nyb2xsWVBvcyB8fCB0aGlzLm9mZnNldFggIT09IHNjcm9sbFhQb3MpIHtcbiAgICAgIHRoaXMuc2Nyb2xsLmVtaXQoe1xuICAgICAgICBvZmZzZXRZOiBzY3JvbGxZUG9zLFxuICAgICAgICBvZmZzZXRYOiBzY3JvbGxYUG9zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLm9mZnNldFkgPSBzY3JvbGxZUG9zO1xuICAgIHRoaXMub2Zmc2V0WCA9IHNjcm9sbFhQb3M7XG5cbiAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcbiAgICB0aGlzLnVwZGF0ZVBhZ2UoZXZlbnQuZGlyZWN0aW9uKTtcbiAgICB0aGlzLnVwZGF0ZVJvd3MoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwYWdlIGdpdmVuIGEgZGlyZWN0aW9uLlxuICAgKi9cbiAgdXBkYXRlUGFnZShkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLmluZGV4ZXMuZmlyc3QgLyB0aGlzLnBhZ2VTaXplO1xuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xuICAgICAgb2Zmc2V0ID0gTWF0aC5jZWlsKG9mZnNldCk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xuICAgICAgb2Zmc2V0ID0gTWF0aC5mbG9vcihvZmZzZXQpO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgdGhpcy5wYWdlLmVtaXQoeyBvZmZzZXQgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHJvd3MgaW4gdGhlIHZpZXcgcG9ydFxuICAgKi9cbiAgdXBkYXRlUm93cygpOiB2b2lkIHtcbiAgICBjb25zdCB7IGZpcnN0LCBsYXN0IH0gPSB0aGlzLmluZGV4ZXM7XG4gICAgbGV0IHJvd0luZGV4ID0gZmlyc3Q7XG4gICAgbGV0IGlkeCA9IDA7XG4gICAgY29uc3QgdGVtcDogYW55W10gPSBbXTtcblxuICAgIC8vIGlmIGdyb3Vwcm93c2J5IGhhcyBiZWVuIHNwZWNpZmllZCB0cmVhdCByb3cgcGFnaW5nXG4gICAgLy8gcGFyYW1ldGVycyBhcyBncm91cCBwYWdpbmcgcGFyYW1ldGVycyBpZSBpZiBsaW1pdCAxMCBoYXMgYmVlblxuICAgIC8vIHNwZWNpZmllZCB0cmVhdCBpdCBhcyAxMCBncm91cHMgcmF0aGVyIHRoYW4gMTAgcm93c1xuICAgIGlmICh0aGlzLmdyb3VwZWRSb3dzKSB7XG4gICAgICBsZXQgbWF4Um93c1Blckdyb3VwID0gMztcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGdyb3VwIHNldCB0aGUgbWF4aW11bSBudW1iZXIgb2ZcbiAgICAgIC8vIHJvd3MgcGVyIGdyb3VwIHRoZSBzYW1lIGFzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93c1xuICAgICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIG1heFJvd3NQZXJHcm91cCA9IHRoaXMuZ3JvdXBlZFJvd3NbMF0udmFsdWUubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAocm93SW5kZXggPCBsYXN0ICYmIHJvd0luZGV4IDwgdGhpcy5ncm91cGVkUm93cy5sZW5ndGgpIHtcbiAgICAgICAgLy8gQWRkIHRoZSBncm91cHMgaW50byB0aGlzIHBhZ2VcbiAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwZWRSb3dzW3Jvd0luZGV4XTtcbiAgICAgICAgdGhpcy5yb3dJbmRleGVzLnNldChncm91cCwgcm93SW5kZXgpO1xuXG4gICAgICAgIGlmIChncm91cC52YWx1ZSkge1xuICAgICAgICAgIC8vIGFkZCBpbmRleGVzIGZvciBlYWNoIGdyb3VwIGl0ZW1cbiAgICAgICAgICBncm91cC52YWx1ZS5mb3JFYWNoKChnOiBhbnksIGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgX2lkeCA9IGAke3Jvd0luZGV4fS0ke2l9YDtcbiAgICAgICAgICAgIHRoaXMucm93SW5kZXhlcy5zZXQoZywgX2lkeCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcFtpZHhdID0gZ3JvdXA7XG4gICAgICAgIGlkeCsrO1xuXG4gICAgICAgIC8vIEdyb3VwIGluZGV4IGluIHRoaXMgY29udGV4dFxuICAgICAgICByb3dJbmRleCsrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAocm93SW5kZXggPCBsYXN0ICYmIHJvd0luZGV4IDwgdGhpcy5yb3dDb3VudCkge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLnJvd3Nbcm93SW5kZXhdO1xuXG4gICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICAvLyBhZGQgaW5kZXhlcyBmb3IgZWFjaCByb3dcbiAgICAgICAgICB0aGlzLnJvd0luZGV4ZXMuc2V0KHJvdywgcm93SW5kZXgpO1xuICAgICAgICAgIHRlbXBbaWR4XSA9IHJvdztcbiAgICAgICAgfVxuXG4gICAgICAgIGlkeCsrO1xuICAgICAgICByb3dJbmRleCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGVtcCA9IHRlbXA7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSByb3cgaGVpZ2h0XG4gICAqL1xuICBnZXRSb3dIZWlnaHQocm93OiBhbnkpOiBudW1iZXIge1xuICAgIC8vIGlmIGl0cyBhIGZ1bmN0aW9uIHJldHVybiBpdFxuICAgIGlmICh0eXBlb2YgdGhpcy5yb3dIZWlnaHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvd0hlaWdodChyb3cpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJvd0hlaWdodCBhcyBudW1iZXI7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIGdyb3VwIHRoZSBncm91cCB3aXRoIGFsbCByb3dzXG4gICAqL1xuICBnZXRHcm91cEhlaWdodChncm91cDogYW55KTogbnVtYmVyIHtcbiAgICBsZXQgcm93SGVpZ2h0ID0gMDtcblxuICAgIGlmIChncm91cC52YWx1ZSkge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGdyb3VwLnZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICByb3dIZWlnaHQgKz0gdGhpcy5nZXRSb3dBbmREZXRhaWxIZWlnaHQoZ3JvdXAudmFsdWVbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcm93SGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSByb3cgaGVpZ2h0IGJhc2VkIG9uIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgcm93LlxuICAgKi9cbiAgZ2V0Um93QW5kRGV0YWlsSGVpZ2h0KHJvdzogYW55KTogbnVtYmVyIHtcbiAgICBsZXQgcm93SGVpZ2h0ID0gdGhpcy5nZXRSb3dIZWlnaHQocm93KTtcbiAgICBjb25zdCBleHBhbmRlZCA9IHRoaXMuZ2V0Um93RXhwYW5kZWQocm93KTtcblxuICAgIC8vIEFkZGluZyBkZXRhaWwgcm93IGhlaWdodCBpZiBpdHMgZXhwYW5kZWQuXG4gICAgaWYgKGV4cGFuZGVkKSB7XG4gICAgICByb3dIZWlnaHQgKz0gdGhpcy5nZXREZXRhaWxSb3dIZWlnaHQocm93KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93SGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBkZXRhaWwgcm93LlxuICAgKi9cbiAgZ2V0RGV0YWlsUm93SGVpZ2h0ID0gKHJvdz86IGFueSwgaW5kZXg/OiBhbnkpOiBudW1iZXIgPT4ge1xuICAgIGlmICghdGhpcy5yb3dEZXRhaWwpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBjb25zdCByb3dIZWlnaHQgPSB0aGlzLnJvd0RldGFpbC5yb3dIZWlnaHQ7XG4gICAgcmV0dXJuIHR5cGVvZiByb3dIZWlnaHQgPT09ICdmdW5jdGlvbicgPyByb3dIZWlnaHQocm93LCBpbmRleCkgOiAocm93SGVpZ2h0IGFzIG51bWJlcik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHN0eWxlcyBmb3IgdGhlIHJvdyBzbyB0aGF0IHRoZSByb3dzIGNhbiBiZSBtb3ZlZCBpbiAyRCBzcGFjZVxuICAgKiBkdXJpbmcgdmlydHVhbCBzY3JvbGwgaW5zaWRlIHRoZSBET00uICAgSW4gdGhlIGJlbG93IGNhc2UgdGhlIFkgcG9zaXRpb24gaXNcbiAgICogbWFuaXB1bGF0ZWQuICAgQXMgYW4gZXhhbXBsZSwgaWYgdGhlIGhlaWdodCBvZiByb3cgMCBpcyAzMCBweCBhbmQgcm93IDEgaXNcbiAgICogMTAwIHB4IHRoZW4gZm9sbG93aW5nIHN0eWxlcyBhcmUgZ2VuZXJhdGVkOlxuICAgKlxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMHB4LCAwcHgpOyAgICAtPiAgcm93MFxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMzBweCwgMHB4KTsgICAtPiAgcm93MVxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMTMwcHgsIDBweCk7ICAtPiAgcm93MlxuICAgKlxuICAgKiBSb3cgaGVpZ2h0cyBoYXZlIHRvIGJlIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlIHJvdyBoZWlnaHRzIGNhY2hlIGFzIHdlIHdvbnRcbiAgICogYmUgYWJsZSB0byBkZXRlcm1pbmUgd2hpY2ggcm93IGlzIG9mIHdoYXQgaGVpZ2h0IGJlZm9yZSBoYW5kLiAgSW4gdGhlIGFib3ZlXG4gICAqIGNhc2UgdGhlIHBvc2l0aW9uWSBvZiB0aGUgdHJhbnNsYXRlM2QgZm9yIHJvdzIgd291bGQgYmUgdGhlIHN1bSBvZiBhbGwgdGhlXG4gICAqIGhlaWdodHMgb2YgdGhlIHJvd3MgYmVmb3JlIGl0IChpLmUuIHJvdzAgYW5kIHJvdzEpLlxuICAgKlxuICAgKiBAcGFyYW0gcm93cyB0aGUgcm93IHRoYXQgbmVlZHMgdG8gYmUgcGxhY2VkIGluIHRoZSAyRCBzcGFjZS5cbiAgICogQHJldHVybnMgdGhlIENTUzMgc3R5bGUgdG8gYmUgYXBwbGllZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgRGF0YVRhYmxlQm9keUNvbXBvbmVudFxuICAgKi9cbiAgZ2V0Um93c1N0eWxlcyhyb3dzOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHN0eWxlczogYW55ID0ge307XG5cbiAgICAvLyBvbmx5IGFkZCBzdHlsZXMgZm9yIHRoZSBncm91cCBpZiB0aGVyZSBpcyBhIGdyb3VwXG4gICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MpIHtcbiAgICAgIHN0eWxlcy53aWR0aCA9IHRoaXMuY29sdW1uR3JvdXBXaWR0aHMudG90YWw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLnZpcnR1YWxpemF0aW9uKSB7XG4gICAgICBsZXQgaWR4ID0gMDtcblxuICAgICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBsYXRlc3Qgcm93IHJvd2luZGV4IGluIGEgZ3JvdXBcbiAgICAgICAgY29uc3Qgcm93ID0gcm93c1tyb3dzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZHggPSByb3cgPyB0aGlzLmdldFJvd0luZGV4KHJvdykgOiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWR4ID0gdGhpcy5nZXRSb3dJbmRleChyb3dzKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3QgcG9zID0gaWR4ICogcm93SGVpZ2h0O1xuICAgICAgLy8gVGhlIHBvc2l0aW9uIG9mIHRoaXMgcm93IHdvdWxkIGJlIHRoZSBzdW0gb2YgYWxsIHJvdyBoZWlnaHRzXG4gICAgICAvLyB1bnRpbCB0aGUgcHJldmlvdXMgcm93IHBvc2l0aW9uLlxuICAgICAgY29uc3QgcG9zID0gdGhpcy5yb3dIZWlnaHRzQ2FjaGUucXVlcnkoaWR4IC0gMSk7XG5cbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgMCwgcG9zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBib3R0b20gc3VtbWFyeSByb3cgb2Zmc2V0IGZvciBzY3JvbGxiYXIgbW9kZS5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgY2FjaGUgYW5kIG9mZnNldCBjYWxjdWxhdGlvblxuICAgKiBzZWUgZGVzY3JpcHRpb24gZm9yIGBnZXRSb3dzU3R5bGVzYCBtZXRob2RcbiAgICpcbiAgICogQHJldHVybnMgdGhlIENTUzMgc3R5bGUgdG8gYmUgYXBwbGllZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgRGF0YVRhYmxlQm9keUNvbXBvbmVudFxuICAgKi9cbiAgZ2V0Qm90dG9tU3VtbWFyeVJvd1N0eWxlcygpOiBhbnkge1xuICAgIGlmICghdGhpcy5zY3JvbGxiYXJWIHx8ICF0aGlzLnJvd3MgfHwgIXRoaXMucm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlcyA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScgfTtcbiAgICBjb25zdCBwb3MgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeSh0aGlzLnJvd3MubGVuZ3RoIC0gMSk7XG5cbiAgICB0cmFuc2xhdGVYWShzdHlsZXMsIDAsIHBvcyk7XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGVzIHRoZSBsb2FkaW5nIGluZGljYXRvclxuICAgKi9cbiAgaGlkZUluZGljYXRvcigpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLmxvYWRpbmdJbmRpY2F0b3IgPSBmYWxzZSksIDUwMCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgaW5kZXggb2YgdGhlIHJvd3MgaW4gdGhlIHZpZXdwb3J0XG4gICAqL1xuICB1cGRhdGVJbmRleGVzKCk6IHZvaWQge1xuICAgIGxldCBmaXJzdCA9IDA7XG4gICAgbGV0IGxhc3QgPSAwO1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xuICAgICAgaWYgKHRoaXMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRpb24gb2YgdGhlIGZpcnN0IGFuZCBsYXN0IGluZGV4ZXMgd2lsbCBiZSBiYXNlZCBvbiB3aGVyZSB0aGVcbiAgICAgICAgLy8gc2Nyb2xsWSBwb3NpdGlvbiB3b3VsZCBiZSBhdC4gIFRoZSBsYXN0IGluZGV4IHdvdWxkIGJlIHRoZSBvbmVcbiAgICAgICAgLy8gdGhhdCBzaG93cyB1cCBpbnNpZGUgdGhlIHZpZXcgcG9ydCB0aGUgbGFzdC5cbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5ib2R5SGVpZ2h0LCAwKTtcbiAgICAgICAgZmlyc3QgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5nZXRSb3dJbmRleCh0aGlzLm9mZnNldFkpO1xuICAgICAgICBsYXN0ID0gdGhpcy5yb3dIZWlnaHRzQ2FjaGUuZ2V0Um93SW5kZXgoaGVpZ2h0ICsgdGhpcy5vZmZzZXRZKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiB2aXJ0dWFsIHJvd3MgYXJlIG5vdCBuZWVkZWRcbiAgICAgICAgLy8gV2UgcmVuZGVyIGFsbCBpbiBvbmUgZ29cbiAgICAgICAgZmlyc3QgPSAwO1xuICAgICAgICBsYXN0ID0gdGhpcy5yb3dDb3VudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHNlcnZlciBpcyBoYW5kbGluZyBwYWdpbmcgYW5kIHdpbGwgcGFzcyBhbiBhcnJheSB0aGF0IGJlZ2lucyB3aXRoIHRoZVxuICAgICAgLy8gZWxlbWVudCBhdCBhIHNwZWNpZmllZCBvZmZzZXQuICBmaXJzdCBzaG91bGQgYWx3YXlzIGJlIDAgd2l0aCBleHRlcm5hbCBwYWdpbmcuXG4gICAgICBpZiAoIXRoaXMuZXh0ZXJuYWxQYWdpbmcpIHtcbiAgICAgICAgZmlyc3QgPSBNYXRoLm1heCh0aGlzLm9mZnNldCAqIHRoaXMucGFnZVNpemUsIDApO1xuICAgICAgfVxuICAgICAgbGFzdCA9IE1hdGgubWluKGZpcnN0ICsgdGhpcy5wYWdlU2l6ZSwgdGhpcy5yb3dDb3VudCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmRleGVzID0geyBmaXJzdCwgbGFzdCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZnJlc2hlcyB0aGUgZnVsbCBSb3cgSGVpZ2h0IGNhY2hlLiAgU2hvdWxkIGJlIHVzZWRcbiAgICogd2hlbiB0aGUgZW50aXJlIHJvdyBhcnJheSBzdGF0ZSBoYXMgY2hhbmdlZC5cbiAgICovXG4gIHJlZnJlc2hSb3dIZWlnaHRDYWNoZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2Nyb2xsYmFyViB8fCAodGhpcy5zY3JvbGxiYXJWICYmICF0aGlzLnZpcnR1YWxpemF0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNsZWFyIHRoZSBwcmV2aW91cyByb3cgaGVpZ2h0IGNhY2hlIGlmIGFscmVhZHkgcHJlc2VudC5cbiAgICAvLyB0aGlzIGlzIHVzZWZ1bCBkdXJpbmcgc29ydHMsIGZpbHRlcnMgd2hlcmUgdGhlIHN0YXRlIG9mIHRoZVxuICAgIC8vIHJvd3MgYXJyYXkgaXMgY2hhbmdlZC5cbiAgICB0aGlzLnJvd0hlaWdodHNDYWNoZS5jbGVhckNhY2hlKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSB0cmVlIG9ubHkgaWYgdGhlcmUgYXJlIHJvd3MgaW5zaWRlIHRoZSB0cmVlLlxuICAgIGlmICh0aGlzLnJvd3MgJiYgdGhpcy5yb3dzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgcm93RXhwYW5zaW9ucyA9IG5ldyBTZXQoKTtcbiAgICAgIGZvciAoY29uc3Qgcm93IG9mIHRoaXMucm93cykge1xuICAgICAgICBpZiAodGhpcy5nZXRSb3dFeHBhbmRlZChyb3cpKSB7XG4gICAgICAgICAgcm93RXhwYW5zaW9ucy5hZGQocm93KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJvd0hlaWdodHNDYWNoZS5pbml0Q2FjaGUoe1xuICAgICAgICByb3dzOiB0aGlzLnJvd3MsXG4gICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXG4gICAgICAgIGRldGFpbFJvd0hlaWdodDogdGhpcy5nZXREZXRhaWxSb3dIZWlnaHQsXG4gICAgICAgIGV4dGVybmFsVmlydHVhbDogdGhpcy5zY3JvbGxiYXJWICYmIHRoaXMuZXh0ZXJuYWxQYWdpbmcsXG4gICAgICAgIHJvd0NvdW50OiB0aGlzLnJvd0NvdW50LFxuICAgICAgICByb3dJbmRleGVzOiB0aGlzLnJvd0luZGV4ZXMsXG4gICAgICAgIHJvd0V4cGFuc2lvbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbmRleCBmb3IgdGhlIHZpZXcgcG9ydFxuICAgKi9cbiAgZ2V0QWRqdXN0ZWRWaWV3UG9ydEluZGV4KCk6IG51bWJlciB7XG4gICAgLy8gQ2FwdHVyZSB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByb3cgdGhhdCBpcyB2aXNpYmxlIG9uIHRoZSB2aWV3cG9ydC5cbiAgICAvLyBJZiB0aGUgc2Nyb2xsIGJhciBpcyBqdXN0IGJlbG93IHRoZSByb3cgd2hpY2ggaXMgaGlnaGxpZ2h0ZWQgdGhlbiBtYWtlIHRoYXQgYXMgdGhlXG4gICAgLy8gZmlyc3QgaW5kZXguXG4gICAgY29uc3Qgdmlld1BvcnRGaXJzdFJvd0luZGV4ID0gdGhpcy5pbmRleGVzLmZpcnN0O1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLnZpcnR1YWxpemF0aW9uKSB7XG4gICAgICBjb25zdCBvZmZzZXRTY3JvbGwgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeSh2aWV3UG9ydEZpcnN0Um93SW5kZXggLSAxKTtcbiAgICAgIHJldHVybiBvZmZzZXRTY3JvbGwgPD0gdGhpcy5vZmZzZXRZID8gdmlld1BvcnRGaXJzdFJvd0luZGV4IC0gMSA6IHZpZXdQb3J0Rmlyc3RSb3dJbmRleDtcbiAgICB9XG5cbiAgICByZXR1cm4gdmlld1BvcnRGaXJzdFJvd0luZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgRXhwYW5zaW9uIG9mIHRoZSByb3cgaS5lLiBpZiB0aGUgcm93IGlzIGV4cGFuZGVkIHRoZW4gaXQgd2lsbFxuICAgKiBjb2xsYXBzZSBhbmQgdmljZSB2ZXJzYS4gICBOb3RlIHRoYXQgdGhlIGV4cGFuZGVkIHN0YXR1cyBpcyBzdG9yZWQgYXNcbiAgICogYSBwYXJ0IG9mIHRoZSByb3cgb2JqZWN0IGl0c2VsZiBhcyB3ZSBoYXZlIHRvIHByZXNlcnZlIHRoZSBleHBhbmRlZCByb3dcbiAgICogc3RhdHVzIGluIGNhc2Ugb2Ygc29ydGluZyBhbmQgZmlsdGVyaW5nIG9mIHRoZSByb3cgc2V0LlxuICAgKi9cbiAgdG9nZ2xlUm93RXhwYW5zaW9uKHJvdzogYW55KTogdm9pZCB7XG4gICAgLy8gQ2FwdHVyZSB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByb3cgdGhhdCBpcyB2aXNpYmxlIG9uIHRoZSB2aWV3cG9ydC5cbiAgICBjb25zdCB2aWV3UG9ydEZpcnN0Um93SW5kZXggPSB0aGlzLmdldEFkanVzdGVkVmlld1BvcnRJbmRleCgpO1xuICAgIGNvbnN0IHJvd0V4cGFuZGVkSWR4ID0gdGhpcy5nZXRSb3dFeHBhbmRlZElkeChyb3csIHRoaXMucm93RXhwYW5zaW9ucyk7XG4gICAgY29uc3QgZXhwYW5kZWQgPSByb3dFeHBhbmRlZElkeCA+IC0xO1xuXG4gICAgLy8gSWYgdGhlIGRldGFpbFJvd0hlaWdodCBpcyBhdXRvIC0tPiBvbmx5IGluIGNhc2Ugb2Ygbm9uLXZpcnR1YWxpemVkIHNjcm9sbFxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgdGhpcy52aXJ0dWFsaXphdGlvbikge1xuICAgICAgY29uc3QgZGV0YWlsUm93SGVpZ2h0ID0gdGhpcy5nZXREZXRhaWxSb3dIZWlnaHQocm93KSAqIChleHBhbmRlZCA/IC0xIDogMSk7XG4gICAgICAvLyBjb25zdCBpZHggPSB0aGlzLnJvd0luZGV4ZXMuZ2V0KHJvdykgfHwgMDtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuZ2V0Um93SW5kZXgocm93KTtcbiAgICAgIHRoaXMucm93SGVpZ2h0c0NhY2hlLnVwZGF0ZShpZHgsIGRldGFpbFJvd0hlaWdodCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSB0b2dnbGVkIHJvdyBhbmQgdXBkYXRlIHRoaXZlIG5ldmVyZSBoZWlnaHRzIGluIHRoZSBjYWNoZS5cbiAgICBpZiAoZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMucm93RXhwYW5zaW9ucy5zcGxpY2Uocm93RXhwYW5kZWRJZHgsIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvd0V4cGFuc2lvbnMucHVzaChyb3cpO1xuICAgIH1cblxuICAgIHRoaXMuZGV0YWlsVG9nZ2xlLmVtaXQoe1xuICAgICAgcm93czogW3Jvd10sXG4gICAgICBjdXJyZW50SW5kZXg6IHZpZXdQb3J0Rmlyc3RSb3dJbmRleFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cGFuZC9Db2xsYXBzZSBhbGwgdGhlIHJvd3Mgbm8gbWF0dGVyIHdoYXQgdGhlaXIgc3RhdGUgaXMuXG4gICAqL1xuICB0b2dnbGVBbGxSb3dzKGV4cGFuZGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgLy8gY2xlYXIgcHJldiBleHBhbnNpb25zXG4gICAgdGhpcy5yb3dFeHBhbnNpb25zID0gW107XG5cbiAgICAvLyBDYXB0dXJlIHRoZSByb3cgaW5kZXggb2YgdGhlIGZpcnN0IHJvdyB0aGF0IGlzIHZpc2libGUgb24gdGhlIHZpZXdwb3J0LlxuICAgIGNvbnN0IHZpZXdQb3J0Rmlyc3RSb3dJbmRleCA9IHRoaXMuZ2V0QWRqdXN0ZWRWaWV3UG9ydEluZGV4KCk7XG5cbiAgICBpZiAoZXhwYW5kZWQpIHtcbiAgICAgIGZvciAoY29uc3Qgcm93IG9mIHRoaXMucm93cykge1xuICAgICAgICB0aGlzLnJvd0V4cGFuc2lvbnMucHVzaChyb3cpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYpIHtcbiAgICAgIC8vIFJlZnJlc2ggdGhlIGZ1bGwgcm93IGhlaWdodHMgY2FjaGUgc2luY2UgZXZlcnkgcm93IHdhcyBhZmZlY3RlZC5cbiAgICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XG4gICAgfVxuXG4gICAgLy8gRW1pdCBhbGwgcm93cyB0aGF0IGhhdmUgYmVlbiBleHBhbmRlZC5cbiAgICB0aGlzLmRldGFpbFRvZ2dsZS5lbWl0KHtcbiAgICAgIHJvd3M6IHRoaXMucm93cyxcbiAgICAgIGN1cnJlbnRJbmRleDogdmlld1BvcnRGaXJzdFJvd0luZGV4XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIHRoZSB0YWJsZVxuICAgKi9cbiAgcmVjYWxjTGF5b3V0KCk6IHZvaWQge1xuICAgIHRoaXMucmVmcmVzaFJvd0hlaWdodENhY2hlKCk7XG4gICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XG4gICAgdGhpcy51cGRhdGVSb3dzKCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tzIHRoZSBjb2x1bW5cbiAgICovXG4gIGNvbHVtblRyYWNraW5nRm4oaW5kZXg6IG51bWJlciwgY29sdW1uOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBjb2x1bW4uJCRpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSByb3cgcGlubmluZyBncm91cCBzdHlsZXNcbiAgICovXG4gIHN0eWxlc0J5R3JvdXAoZ3JvdXA6IHN0cmluZykge1xuICAgIGNvbnN0IHdpZHRocyA9IHRoaXMuY29sdW1uR3JvdXBXaWR0aHM7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHRoaXMub2Zmc2V0WDtcblxuICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgIHdpZHRoOiBgJHt3aWR0aHNbZ3JvdXBdfXB4YFxuICAgIH07XG5cbiAgICBpZiAoZ3JvdXAgPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCBvZmZzZXRYLCAwKTtcbiAgICB9IGVsc2UgaWYgKGdyb3VwID09PSAncmlnaHQnKSB7XG4gICAgICBjb25zdCBib2R5V2lkdGggPSBwYXJzZUludCh0aGlzLmlubmVyV2lkdGggKyAnJywgMCk7XG4gICAgICBjb25zdCB0b3RhbERpZmYgPSB3aWR0aHMudG90YWwgLSBib2R5V2lkdGg7XG4gICAgICBjb25zdCBvZmZzZXREaWZmID0gdG90YWxEaWZmIC0gb2Zmc2V0WDtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG9mZnNldERpZmYgKiAtMTtcbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgb2Zmc2V0LCAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIHJvdyB3YXMgZXhwYW5kZWQgYW5kIHNldCBkZWZhdWx0IHJvdyBleHBhbnNpb24gd2hlbiByb3cgZXhwYW5zaW9uIGlzIGVtcHR5XG4gICAqL1xuICBnZXRSb3dFeHBhbmRlZChyb3c6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnJvd0V4cGFuc2lvbnMubGVuZ3RoID09PSAwICYmIHRoaXMuZ3JvdXBFeHBhbnNpb25EZWZhdWx0KSB7XG4gICAgICBmb3IgKGNvbnN0IGdyb3VwIG9mIHRoaXMuZ3JvdXBlZFJvd3MpIHtcbiAgICAgICAgdGhpcy5yb3dFeHBhbnNpb25zLnB1c2goZ3JvdXApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldFJvd0V4cGFuZGVkSWR4KHJvdywgdGhpcy5yb3dFeHBhbnNpb25zKSA+IC0xO1xuICB9XG5cbiAgZ2V0Um93RXhwYW5kZWRJZHgocm93OiBhbnksIGV4cGFuZGVkOiBhbnlbXSk6IG51bWJlciB7XG4gICAgaWYgKCFleHBhbmRlZCB8fCAhZXhwYW5kZWQubGVuZ3RoKSByZXR1cm4gLTE7XG5cbiAgICBjb25zdCByb3dJZCA9IHRoaXMucm93SWRlbnRpdHkocm93KTtcbiAgICByZXR1cm4gZXhwYW5kZWQuZmluZEluZGV4KHIgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnJvd0lkZW50aXR5KHIpO1xuICAgICAgcmV0dXJuIGlkID09PSByb3dJZDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSByb3cgaW5kZXggZ2l2ZW4gYSByb3dcbiAgICovXG4gIGdldFJvd0luZGV4KHJvdzogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5yb3dJbmRleGVzLmdldChyb3cpIHx8IDA7XG4gIH1cblxuICBvblRyZWVBY3Rpb24ocm93OiBhbnkpIHtcbiAgICB0aGlzLnRyZWVBY3Rpb24uZW1pdCh7IHJvdyB9KTtcbiAgfVxufVxuIl19