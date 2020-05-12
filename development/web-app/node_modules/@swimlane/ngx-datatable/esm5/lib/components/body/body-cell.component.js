import { __decorate, __values } from "tslib";
import { Component, Input, PipeTransform, HostBinding, ViewChild, ChangeDetectorRef, Output, EventEmitter, HostListener, ElementRef, ViewContainerRef, OnDestroy, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import { SortDirection } from '../../types/sort-direction.type';
import { Keys } from '../../utils/keys';
var DataTableBodyCellComponent = /** @class */ (function () {
    function DataTableBodyCellComponent(element, cd) {
        this.cd = cd;
        this.activate = new EventEmitter();
        this.treeAction = new EventEmitter();
        this.isFocused = false;
        this.onCheckboxChangeFn = this.onCheckboxChange.bind(this);
        this.activateFn = this.activate.emit.bind(this.activate);
        this.cellContext = {
            onCheckboxChangeFn: this.onCheckboxChangeFn,
            activateFn: this.activateFn,
            row: this.row,
            group: this.group,
            value: this.value,
            column: this.column,
            rowHeight: this.rowHeight,
            isSelected: this.isSelected,
            rowIndex: this.rowIndex,
            treeStatus: this.treeStatus,
            onTreeAction: this.onTreeAction.bind(this)
        };
        this._element = element.nativeElement;
    }
    Object.defineProperty(DataTableBodyCellComponent.prototype, "group", {
        get: function () {
            return this._group;
        },
        set: function (group) {
            this._group = group;
            this.cellContext.group = group;
            this.checkValueUpdates();
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "rowHeight", {
        get: function () {
            return this._rowHeight;
        },
        set: function (val) {
            this._rowHeight = val;
            this.cellContext.rowHeight = val;
            this.checkValueUpdates();
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "isSelected", {
        get: function () {
            return this._isSelected;
        },
        set: function (val) {
            this._isSelected = val;
            this.cellContext.isSelected = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "expanded", {
        get: function () {
            return this._expanded;
        },
        set: function (val) {
            this._expanded = val;
            this.cellContext.expanded = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "rowIndex", {
        get: function () {
            return this._rowIndex;
        },
        set: function (val) {
            this._rowIndex = val;
            this.cellContext.rowIndex = val;
            this.checkValueUpdates();
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "column", {
        get: function () {
            return this._column;
        },
        set: function (column) {
            this._column = column;
            this.cellContext.column = column;
            this.checkValueUpdates();
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "row", {
        get: function () {
            return this._row;
        },
        set: function (row) {
            this._row = row;
            this.cellContext.row = row;
            this.checkValueUpdates();
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "sorts", {
        get: function () {
            return this._sorts;
        },
        set: function (val) {
            this._sorts = val;
            this.calcSortDir = this.calcSortDir(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "treeStatus", {
        get: function () {
            return this._treeStatus;
        },
        set: function (status) {
            if (status !== 'collapsed' && status !== 'expanded' && status !== 'loading' && status !== 'disabled') {
                this._treeStatus = 'collapsed';
            }
            else {
                this._treeStatus = status;
            }
            this.cellContext.treeStatus = this._treeStatus;
            this.checkValueUpdates();
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "columnCssClasses", {
        get: function () {
            var e_1, _a;
            var cls = 'datatable-body-cell';
            if (this.column.cellClass) {
                if (typeof this.column.cellClass === 'string') {
                    cls += ' ' + this.column.cellClass;
                }
                else if (typeof this.column.cellClass === 'function') {
                    var res = this.column.cellClass({
                        row: this.row,
                        group: this.group,
                        column: this.column,
                        value: this.value,
                        rowHeight: this.rowHeight
                    });
                    if (typeof res === 'string') {
                        cls += ' ' + res;
                    }
                    else if (typeof res === 'object') {
                        var keys = Object.keys(res);
                        try {
                            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                                var k = keys_1_1.value;
                                if (res[k] === true) {
                                    cls += " " + k;
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
            }
            if (!this.sortDir) {
                cls += ' sort-active';
            }
            if (this.isFocused) {
                cls += ' active';
            }
            if (this.sortDir === SortDirection.asc) {
                cls += ' sort-asc';
            }
            if (this.sortDir === SortDirection.desc) {
                cls += ' sort-desc';
            }
            return cls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "width", {
        get: function () {
            return this.column.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "minWidth", {
        get: function () {
            return this.column.minWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "maxWidth", {
        get: function () {
            return this.column.maxWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyCellComponent.prototype, "height", {
        get: function () {
            var height = this.rowHeight;
            if (isNaN(height)) {
                return height;
            }
            return height + 'px';
        },
        enumerable: true,
        configurable: true
    });
    DataTableBodyCellComponent.prototype.ngDoCheck = function () {
        this.checkValueUpdates();
    };
    DataTableBodyCellComponent.prototype.ngOnDestroy = function () {
        if (this.cellTemplate) {
            this.cellTemplate.clear();
        }
    };
    DataTableBodyCellComponent.prototype.checkValueUpdates = function () {
        var value = '';
        if (!this.row || !this.column) {
            value = '';
        }
        else {
            var val = this.column.$$valueGetter(this.row, this.column.prop);
            var userPipe = this.column.pipe;
            if (userPipe) {
                value = userPipe.transform(val);
            }
            else if (value !== undefined) {
                value = val;
            }
        }
        if (this.value !== value) {
            this.value = value;
            this.cellContext.value = value;
            this.sanitizedValue = value !== null && value !== undefined ? this.stripHtml(value) : value;
            this.cd.markForCheck();
        }
    };
    DataTableBodyCellComponent.prototype.onFocus = function () {
        this.isFocused = true;
    };
    DataTableBodyCellComponent.prototype.onBlur = function () {
        this.isFocused = false;
    };
    DataTableBodyCellComponent.prototype.onClick = function (event) {
        this.activate.emit({
            type: 'click',
            event: event,
            row: this.row,
            group: this.group,
            rowHeight: this.rowHeight,
            column: this.column,
            value: this.value,
            cellElement: this._element
        });
    };
    DataTableBodyCellComponent.prototype.onDblClick = function (event) {
        this.activate.emit({
            type: 'dblclick',
            event: event,
            row: this.row,
            group: this.group,
            rowHeight: this.rowHeight,
            column: this.column,
            value: this.value,
            cellElement: this._element
        });
    };
    DataTableBodyCellComponent.prototype.onKeyDown = function (event) {
        var keyCode = event.keyCode;
        var isTargetCell = event.target === this._element;
        var isAction = keyCode === Keys.return ||
            keyCode === Keys.down ||
            keyCode === Keys.up ||
            keyCode === Keys.left ||
            keyCode === Keys.right;
        if (isAction && isTargetCell) {
            event.preventDefault();
            event.stopPropagation();
            this.activate.emit({
                type: 'keydown',
                event: event,
                row: this.row,
                group: this.group,
                rowHeight: this.rowHeight,
                column: this.column,
                value: this.value,
                cellElement: this._element
            });
        }
    };
    DataTableBodyCellComponent.prototype.onCheckboxChange = function (event) {
        this.activate.emit({
            type: 'checkbox',
            event: event,
            row: this.row,
            group: this.group,
            rowHeight: this.rowHeight,
            column: this.column,
            value: this.value,
            cellElement: this._element,
            treeStatus: 'collapsed'
        });
    };
    DataTableBodyCellComponent.prototype.calcSortDir = function (sorts) {
        var _this = this;
        if (!sorts) {
            return;
        }
        var sort = sorts.find(function (s) {
            return s.prop === _this.column.prop;
        });
        if (sort) {
            return sort.dir;
        }
    };
    DataTableBodyCellComponent.prototype.stripHtml = function (html) {
        if (!html.replace) {
            return html;
        }
        return html.replace(/<\/?[^>]+(>|$)/g, '');
    };
    DataTableBodyCellComponent.prototype.onTreeAction = function () {
        this.treeAction.emit(this.row);
    };
    DataTableBodyCellComponent.prototype.calcLeftMargin = function (column, row) {
        var levelIndent = column.treeLevelIndent != null ? column.treeLevelIndent : 50;
        return column.isTreeColumn ? row.level * levelIndent : 0;
    };
    DataTableBodyCellComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "displayCheck", void 0);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "group", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "rowHeight", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "isSelected", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "expanded", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "rowIndex", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "column", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "row", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "sorts", null);
    __decorate([
        Input()
    ], DataTableBodyCellComponent.prototype, "treeStatus", null);
    __decorate([
        Output()
    ], DataTableBodyCellComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], DataTableBodyCellComponent.prototype, "treeAction", void 0);
    __decorate([
        ViewChild('cellTemplate', { read: ViewContainerRef, static: true })
    ], DataTableBodyCellComponent.prototype, "cellTemplate", void 0);
    __decorate([
        HostBinding('class')
    ], DataTableBodyCellComponent.prototype, "columnCssClasses", null);
    __decorate([
        HostBinding('style.width.px')
    ], DataTableBodyCellComponent.prototype, "width", null);
    __decorate([
        HostBinding('style.minWidth.px')
    ], DataTableBodyCellComponent.prototype, "minWidth", null);
    __decorate([
        HostBinding('style.maxWidth.px')
    ], DataTableBodyCellComponent.prototype, "maxWidth", null);
    __decorate([
        HostBinding('style.height')
    ], DataTableBodyCellComponent.prototype, "height", null);
    __decorate([
        HostListener('focus')
    ], DataTableBodyCellComponent.prototype, "onFocus", null);
    __decorate([
        HostListener('blur')
    ], DataTableBodyCellComponent.prototype, "onBlur", null);
    __decorate([
        HostListener('click', ['$event'])
    ], DataTableBodyCellComponent.prototype, "onClick", null);
    __decorate([
        HostListener('dblclick', ['$event'])
    ], DataTableBodyCellComponent.prototype, "onDblClick", null);
    __decorate([
        HostListener('keydown', ['$event'])
    ], DataTableBodyCellComponent.prototype, "onKeyDown", null);
    DataTableBodyCellComponent = __decorate([
        Component({
            selector: 'datatable-body-cell',
            changeDetection: ChangeDetectionStrategy.OnPush,
            template: "\n    <div class=\"datatable-body-cell-label\" [style.margin-left.px]=\"calcLeftMargin(column, row)\">\n      <label\n        *ngIf=\"column.checkboxable && (!displayCheck || displayCheck(row, column, value))\"\n        class=\"datatable-checkbox\"\n      >\n        <input type=\"checkbox\" [checked]=\"isSelected\" (click)=\"onCheckboxChange($event)\" />\n      </label>\n      <ng-container *ngIf=\"column.isTreeColumn\">\n        <button\n          *ngIf=\"!column.treeToggleTemplate\"\n          class=\"datatable-tree-button\"\n          [disabled]=\"treeStatus === 'disabled'\"\n          (click)=\"onTreeAction()\"\n        >\n          <span>\n            <i *ngIf=\"treeStatus === 'loading'\" class=\"icon datatable-icon-collapse\"></i>\n            <i *ngIf=\"treeStatus === 'collapsed'\" class=\"icon datatable-icon-up\"></i>\n            <i *ngIf=\"treeStatus === 'expanded' || treeStatus === 'disabled'\" class=\"icon datatable-icon-down\"></i>\n          </span>\n        </button>\n        <ng-template\n          *ngIf=\"column.treeToggleTemplate\"\n          [ngTemplateOutlet]=\"column.treeToggleTemplate\"\n          [ngTemplateOutletContext]=\"{ cellContext: cellContext }\"\n        >\n        </ng-template>\n      </ng-container>\n\n      <span *ngIf=\"!column.cellTemplate\" [title]=\"sanitizedValue\" [innerHTML]=\"value\"> </span>\n      <ng-template\n        #cellTemplate\n        *ngIf=\"column.cellTemplate\"\n        [ngTemplateOutlet]=\"column.cellTemplate\"\n        [ngTemplateOutletContext]=\"cellContext\"\n      >\n      </ng-template>\n    </div>\n  "
        })
    ], DataTableBodyCellComponent);
    return DataTableBodyCellComponent;
}());
export { DataTableBodyCellComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYm9keS9ib2R5LWNlbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxhQUFhLEVBQ2IsV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osVUFBVSxFQUNWLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsT0FBTyxFQUNQLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDaEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBK0N4QztJQWdORSxvQ0FBWSxPQUFtQixFQUFVLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBMUdwRCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBMkU3RCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLHVCQUFrQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsZUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEQsZ0JBQVcsR0FBUTtZQUNqQixrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCO1lBQzNDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsS0FB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RUFDckM7SUFHL0I7UUFEQyxXQUFXLENBQUMsT0FBTyxDQUFDO3NFQXlDcEI7SUFHRDtRQURDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQzsyREFHN0I7SUFHRDtRQURDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQzs4REFHaEM7SUFHRDtRQURDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQzs4REFHaEM7SUFHRDtRQURDLFdBQVcsQ0FBQyxjQUFjLENBQUM7NERBTzNCO0lBeUVEO1FBREMsWUFBWSxDQUFDLE9BQU8sQ0FBQzs2REFHckI7SUFHRDtRQURDLFlBQVksQ0FBQyxNQUFNLENBQUM7NERBR3BCO0lBR0Q7UUFEQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7NkRBWWpDO0lBR0Q7UUFEQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Z0VBWXBDO0lBR0Q7UUFEQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7K0RBMkJuQztJQXZUVSwwQkFBMEI7UUEzQ3RDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsUUFBUSxFQUFFLHVqREFzQ1Q7U0FDRixDQUFDO09BQ1csMEJBQTBCLENBb1d0QztJQUFELGlDQUFDO0NBQUEsQUFwV0QsSUFvV0M7U0FwV1ksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgUGlwZVRyYW5zZm9ybSxcbiAgSG9zdEJpbmRpbmcsXG4gIFZpZXdDaGlsZCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEVsZW1lbnRSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIE9uRGVzdHJveSxcbiAgRG9DaGVjayxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFRhYmxlQ29sdW1uIH0gZnJvbSAnLi4vLi4vdHlwZXMvdGFibGUtY29sdW1uLnR5cGUnO1xuaW1wb3J0IHsgU29ydERpcmVjdGlvbiB9IGZyb20gJy4uLy4uL3R5cGVzL3NvcnQtZGlyZWN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2tleXMnO1xuXG5leHBvcnQgdHlwZSBUcmVlU3RhdHVzID0gJ2NvbGxhcHNlZCcgfCAnZXhwYW5kZWQnIHwgJ2xvYWRpbmcnIHwgJ2Rpc2FibGVkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZGF0YXRhYmxlLWJvZHktY2VsbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJkYXRhdGFibGUtYm9keS1jZWxsLWxhYmVsXCIgW3N0eWxlLm1hcmdpbi1sZWZ0LnB4XT1cImNhbGNMZWZ0TWFyZ2luKGNvbHVtbiwgcm93KVwiPlxuICAgICAgPGxhYmVsXG4gICAgICAgICpuZ0lmPVwiY29sdW1uLmNoZWNrYm94YWJsZSAmJiAoIWRpc3BsYXlDaGVjayB8fCBkaXNwbGF5Q2hlY2socm93LCBjb2x1bW4sIHZhbHVlKSlcIlxuICAgICAgICBjbGFzcz1cImRhdGF0YWJsZS1jaGVja2JveFwiXG4gICAgICA+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBbY2hlY2tlZF09XCJpc1NlbGVjdGVkXCIgKGNsaWNrKT1cIm9uQ2hlY2tib3hDaGFuZ2UoJGV2ZW50KVwiIC8+XG4gICAgICA8L2xhYmVsPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5pc1RyZWVDb2x1bW5cIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICpuZ0lmPVwiIWNvbHVtbi50cmVlVG9nZ2xlVGVtcGxhdGVcIlxuICAgICAgICAgIGNsYXNzPVwiZGF0YXRhYmxlLXRyZWUtYnV0dG9uXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwidHJlZVN0YXR1cyA9PT0gJ2Rpc2FibGVkJ1wiXG4gICAgICAgICAgKGNsaWNrKT1cIm9uVHJlZUFjdGlvbigpXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPGkgKm5nSWY9XCJ0cmVlU3RhdHVzID09PSAnbG9hZGluZydcIiBjbGFzcz1cImljb24gZGF0YXRhYmxlLWljb24tY29sbGFwc2VcIj48L2k+XG4gICAgICAgICAgICA8aSAqbmdJZj1cInRyZWVTdGF0dXMgPT09ICdjb2xsYXBzZWQnXCIgY2xhc3M9XCJpY29uIGRhdGF0YWJsZS1pY29uLXVwXCI+PC9pPlxuICAgICAgICAgICAgPGkgKm5nSWY9XCJ0cmVlU3RhdHVzID09PSAnZXhwYW5kZWQnIHx8IHRyZWVTdGF0dXMgPT09ICdkaXNhYmxlZCdcIiBjbGFzcz1cImljb24gZGF0YXRhYmxlLWljb24tZG93blwiPjwvaT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAqbmdJZj1cImNvbHVtbi50cmVlVG9nZ2xlVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbHVtbi50cmVlVG9nZ2xlVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGNlbGxDb250ZXh0OiBjZWxsQ29udGV4dCB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPC9uZy1jb250YWluZXI+XG5cbiAgICAgIDxzcGFuICpuZ0lmPVwiIWNvbHVtbi5jZWxsVGVtcGxhdGVcIiBbdGl0bGVdPVwic2FuaXRpemVkVmFsdWVcIiBbaW5uZXJIVE1MXT1cInZhbHVlXCI+IDwvc3Bhbj5cbiAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAjY2VsbFRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwiY29sdW1uLmNlbGxUZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbHVtbi5jZWxsVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiY2VsbENvbnRleHRcIlxuICAgICAgPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVCb2R5Q2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIGRpc3BsYXlDaGVjazogKHJvdzogYW55LCBjb2x1bW4/OiBUYWJsZUNvbHVtbiwgdmFsdWU/OiBhbnkpID0+IGJvb2xlYW47XG5cbiAgQElucHV0KCkgc2V0IGdyb3VwKGdyb3VwOiBhbnkpIHtcbiAgICB0aGlzLl9ncm91cCA9IGdyb3VwO1xuICAgIHRoaXMuY2VsbENvbnRleHQuZ3JvdXAgPSBncm91cDtcbiAgICB0aGlzLmNoZWNrVmFsdWVVcGRhdGVzKCk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBncm91cCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXA7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgcm93SGVpZ2h0KHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fcm93SGVpZ2h0ID0gdmFsO1xuICAgIHRoaXMuY2VsbENvbnRleHQucm93SGVpZ2h0ID0gdmFsO1xuICAgIHRoaXMuY2hlY2tWYWx1ZVVwZGF0ZXMoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IHJvd0hlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcm93SGVpZ2h0O1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGlzU2VsZWN0ZWQodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5faXNTZWxlY3RlZCA9IHZhbDtcbiAgICB0aGlzLmNlbGxDb250ZXh0LmlzU2VsZWN0ZWQgPSB2YWw7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBpc1NlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc1NlbGVjdGVkO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGV4cGFuZGVkKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuX2V4cGFuZGVkID0gdmFsO1xuICAgIHRoaXMuY2VsbENvbnRleHQuZXhwYW5kZWQgPSB2YWw7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWQ7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgcm93SW5kZXgodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yb3dJbmRleCA9IHZhbDtcbiAgICB0aGlzLmNlbGxDb250ZXh0LnJvd0luZGV4ID0gdmFsO1xuICAgIHRoaXMuY2hlY2tWYWx1ZVVwZGF0ZXMoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IHJvd0luZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd0luZGV4O1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGNvbHVtbihjb2x1bW46IFRhYmxlQ29sdW1uKSB7XG4gICAgdGhpcy5fY29sdW1uID0gY29sdW1uO1xuICAgIHRoaXMuY2VsbENvbnRleHQuY29sdW1uID0gY29sdW1uO1xuICAgIHRoaXMuY2hlY2tWYWx1ZVVwZGF0ZXMoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGNvbHVtbigpOiBUYWJsZUNvbHVtbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbjtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCByb3cocm93OiBhbnkpIHtcbiAgICB0aGlzLl9yb3cgPSByb3c7XG4gICAgdGhpcy5jZWxsQ29udGV4dC5yb3cgPSByb3c7XG4gICAgdGhpcy5jaGVja1ZhbHVlVXBkYXRlcygpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgcm93KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdztcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBzb3J0cyh2YWw6IGFueVtdKSB7XG4gICAgdGhpcy5fc29ydHMgPSB2YWw7XG4gICAgdGhpcy5jYWxjU29ydERpciA9IHRoaXMuY2FsY1NvcnREaXIodmFsKTtcbiAgfVxuXG4gIGdldCBzb3J0cygpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnRzO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IHRyZWVTdGF0dXMoc3RhdHVzOiBUcmVlU3RhdHVzKSB7XG4gICAgaWYgKHN0YXR1cyAhPT0gJ2NvbGxhcHNlZCcgJiYgc3RhdHVzICE9PSAnZXhwYW5kZWQnICYmIHN0YXR1cyAhPT0gJ2xvYWRpbmcnICYmIHN0YXR1cyAhPT0gJ2Rpc2FibGVkJykge1xuICAgICAgdGhpcy5fdHJlZVN0YXR1cyA9ICdjb2xsYXBzZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90cmVlU3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgICB0aGlzLmNlbGxDb250ZXh0LnRyZWVTdGF0dXMgPSB0aGlzLl90cmVlU3RhdHVzO1xuICAgIHRoaXMuY2hlY2tWYWx1ZVVwZGF0ZXMoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IHRyZWVTdGF0dXMoKTogVHJlZVN0YXR1cyB7XG4gICAgcmV0dXJuIHRoaXMuX3RyZWVTdGF0dXM7XG4gIH1cblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoKSB0cmVlQWN0aW9uOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAVmlld0NoaWxkKCdjZWxsVGVtcGxhdGUnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICBjZWxsVGVtcGxhdGU6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBjb2x1bW5Dc3NDbGFzc2VzKCk6IGFueSB7XG4gICAgbGV0IGNscyA9ICdkYXRhdGFibGUtYm9keS1jZWxsJztcbiAgICBpZiAodGhpcy5jb2x1bW4uY2VsbENsYXNzKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuY29sdW1uLmNlbGxDbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY2xzICs9ICcgJyArIHRoaXMuY29sdW1uLmNlbGxDbGFzcztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY29sdW1uLmNlbGxDbGFzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLmNvbHVtbi5jZWxsQ2xhc3Moe1xuICAgICAgICAgIHJvdzogdGhpcy5yb3csXG4gICAgICAgICAgZ3JvdXA6IHRoaXMuZ3JvdXAsXG4gICAgICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNscyArPSAnICcgKyByZXM7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVzKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xuICAgICAgICAgICAgaWYgKHJlc1trXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBjbHMgKz0gYCAke2t9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLnNvcnREaXIpIHtcbiAgICAgIGNscyArPSAnIHNvcnQtYWN0aXZlJztcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNGb2N1c2VkKSB7XG4gICAgICBjbHMgKz0gJyBhY3RpdmUnO1xuICAgIH1cbiAgICBpZiAodGhpcy5zb3J0RGlyID09PSBTb3J0RGlyZWN0aW9uLmFzYykge1xuICAgICAgY2xzICs9ICcgc29ydC1hc2MnO1xuICAgIH1cbiAgICBpZiAodGhpcy5zb3J0RGlyID09PSBTb3J0RGlyZWN0aW9uLmRlc2MpIHtcbiAgICAgIGNscyArPSAnIHNvcnQtZGVzYyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNscztcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgucHgnKVxuICBnZXQgd2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW4ud2lkdGg7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1pbldpZHRoLnB4JylcbiAgZ2V0IG1pbldpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uLm1pbldpZHRoO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5tYXhXaWR0aC5weCcpXG4gIGdldCBtYXhXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbi5tYXhXaWR0aDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JylcbiAgZ2V0IGhlaWdodCgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucm93SGVpZ2h0O1xuICAgIGlmIChpc05hTihoZWlnaHQpKSB7XG4gICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0ICsgJ3B4JztcbiAgfVxuXG4gIHNhbml0aXplZFZhbHVlOiBhbnk7XG4gIHZhbHVlOiBhbnk7XG4gIHNvcnREaXI6IFNvcnREaXJlY3Rpb247XG4gIGlzRm9jdXNlZCA9IGZhbHNlO1xuICBvbkNoZWNrYm94Q2hhbmdlRm4gPSB0aGlzLm9uQ2hlY2tib3hDaGFuZ2UuYmluZCh0aGlzKTtcbiAgYWN0aXZhdGVGbiA9IHRoaXMuYWN0aXZhdGUuZW1pdC5iaW5kKHRoaXMuYWN0aXZhdGUpO1xuXG4gIGNlbGxDb250ZXh0OiBhbnkgPSB7XG4gICAgb25DaGVja2JveENoYW5nZUZuOiB0aGlzLm9uQ2hlY2tib3hDaGFuZ2VGbixcbiAgICBhY3RpdmF0ZUZuOiB0aGlzLmFjdGl2YXRlRm4sXG4gICAgcm93OiB0aGlzLnJvdyxcbiAgICBncm91cDogdGhpcy5ncm91cCxcbiAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICBjb2x1bW46IHRoaXMuY29sdW1uLFxuICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXG4gICAgaXNTZWxlY3RlZDogdGhpcy5pc1NlbGVjdGVkLFxuICAgIHJvd0luZGV4OiB0aGlzLnJvd0luZGV4LFxuICAgIHRyZWVTdGF0dXM6IHRoaXMudHJlZVN0YXR1cyxcbiAgICBvblRyZWVBY3Rpb246IHRoaXMub25UcmVlQWN0aW9uLmJpbmQodGhpcylcbiAgfTtcblxuICBwcml2YXRlIF9pc1NlbGVjdGVkOiBib29sZWFuO1xuICBwcml2YXRlIF9zb3J0czogYW55W107XG4gIHByaXZhdGUgX2NvbHVtbjogVGFibGVDb2x1bW47XG4gIHByaXZhdGUgX3JvdzogYW55O1xuICBwcml2YXRlIF9ncm91cDogYW55O1xuICBwcml2YXRlIF9yb3dIZWlnaHQ6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcm93SW5kZXg6IG51bWJlcjtcbiAgcHJpdmF0ZSBfZXhwYW5kZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX2VsZW1lbnQ6IGFueTtcbiAgcHJpdmF0ZSBfdHJlZVN0YXR1czogVHJlZVN0YXR1cztcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja1ZhbHVlVXBkYXRlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2VsbFRlbXBsYXRlKSB7XG4gICAgICB0aGlzLmNlbGxUZW1wbGF0ZS5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrVmFsdWVVcGRhdGVzKCk6IHZvaWQge1xuICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgaWYgKCF0aGlzLnJvdyB8fCAhdGhpcy5jb2x1bW4pIHtcbiAgICAgIHZhbHVlID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHZhbCA9IHRoaXMuY29sdW1uLiQkdmFsdWVHZXR0ZXIodGhpcy5yb3csIHRoaXMuY29sdW1uLnByb3ApO1xuICAgICAgY29uc3QgdXNlclBpcGU6IFBpcGVUcmFuc2Zvcm0gPSB0aGlzLmNvbHVtbi5waXBlO1xuXG4gICAgICBpZiAodXNlclBpcGUpIHtcbiAgICAgICAgdmFsdWUgPSB1c2VyUGlwZS50cmFuc2Zvcm0odmFsKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWx1ZSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuY2VsbENvbnRleHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc2FuaXRpemVkVmFsdWUgPSB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5zdHJpcEh0bWwodmFsdWUpIDogdmFsdWU7XG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJylcbiAgb25Gb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdibHVyJylcbiAgb25CbHVyKCk6IHZvaWQge1xuICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoe1xuICAgICAgdHlwZTogJ2NsaWNrJyxcbiAgICAgIGV2ZW50LFxuICAgICAgcm93OiB0aGlzLnJvdyxcbiAgICAgIGdyb3VwOiB0aGlzLmdyb3VwLFxuICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgIGNlbGxFbGVtZW50OiB0aGlzLl9lbGVtZW50XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkYmxjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uRGJsQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoe1xuICAgICAgdHlwZTogJ2RibGNsaWNrJyxcbiAgICAgIGV2ZW50LFxuICAgICAgcm93OiB0aGlzLnJvdyxcbiAgICAgIGdyb3VwOiB0aGlzLmdyb3VwLFxuICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgIGNlbGxFbGVtZW50OiB0aGlzLl9lbGVtZW50XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaXNUYXJnZXRDZWxsID0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLl9lbGVtZW50O1xuXG4gICAgY29uc3QgaXNBY3Rpb24gPVxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5yZXR1cm4gfHxcbiAgICAgIGtleUNvZGUgPT09IEtleXMuZG93biB8fFxuICAgICAga2V5Q29kZSA9PT0gS2V5cy51cCB8fFxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5sZWZ0IHx8XG4gICAgICBrZXlDb2RlID09PSBLZXlzLnJpZ2h0O1xuXG4gICAgaWYgKGlzQWN0aW9uICYmIGlzVGFyZ2V0Q2VsbCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICB0aGlzLmFjdGl2YXRlLmVtaXQoe1xuICAgICAgICB0eXBlOiAna2V5ZG93bicsXG4gICAgICAgIGV2ZW50LFxuICAgICAgICByb3c6IHRoaXMucm93LFxuICAgICAgICBncm91cDogdGhpcy5ncm91cCxcbiAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICAgIGNlbGxFbGVtZW50OiB0aGlzLl9lbGVtZW50XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvbkNoZWNrYm94Q2hhbmdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoe1xuICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgIGV2ZW50LFxuICAgICAgcm93OiB0aGlzLnJvdyxcbiAgICAgIGdyb3VwOiB0aGlzLmdyb3VwLFxuICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgIGNlbGxFbGVtZW50OiB0aGlzLl9lbGVtZW50LFxuICAgICAgdHJlZVN0YXR1czogJ2NvbGxhcHNlZCdcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGNTb3J0RGlyKHNvcnRzOiBhbnlbXSk6IGFueSB7XG4gICAgaWYgKCFzb3J0cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNvcnQgPSBzb3J0cy5maW5kKChzOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBzLnByb3AgPT09IHRoaXMuY29sdW1uLnByb3A7XG4gICAgfSk7XG5cbiAgICBpZiAoc29ydCkge1xuICAgICAgcmV0dXJuIHNvcnQuZGlyO1xuICAgIH1cbiAgfVxuXG4gIHN0cmlwSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghaHRtbC5yZXBsYWNlKSB7XG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIGh0bWwucmVwbGFjZSgvPFxcLz9bXj5dKyg+fCQpL2csICcnKTtcbiAgfVxuXG4gIG9uVHJlZUFjdGlvbigpIHtcbiAgICB0aGlzLnRyZWVBY3Rpb24uZW1pdCh0aGlzLnJvdyk7XG4gIH1cblxuICBjYWxjTGVmdE1hcmdpbihjb2x1bW46IGFueSwgcm93OiBhbnkpIHtcbiAgICBjb25zdCBsZXZlbEluZGVudCA9IGNvbHVtbi50cmVlTGV2ZWxJbmRlbnQgIT0gbnVsbCA/IGNvbHVtbi50cmVlTGV2ZWxJbmRlbnQgOiA1MDtcbiAgICByZXR1cm4gY29sdW1uLmlzVHJlZUNvbHVtbiA/IHJvdy5sZXZlbCAqIGxldmVsSW5kZW50IDogMDtcbiAgfVxufVxuIl19