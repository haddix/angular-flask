import { __decorate, __values } from "tslib";
import { Component, Input, EventEmitter, Output, HostBinding, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SelectionType } from '../../types/selection.type';
import { nextSortDir } from '../../utils/sort';
import { SortDirection } from '../../types/sort-direction.type';
var DataTableHeaderCellComponent = /** @class */ (function () {
    function DataTableHeaderCellComponent(cd) {
        this.cd = cd;
        this.sort = new EventEmitter();
        this.select = new EventEmitter();
        this.columnContextmenu = new EventEmitter(false);
        this.sortFn = this.onSort.bind(this);
        this.selectFn = this.select.emit.bind(this.select);
        this.cellContext = {
            column: this.column,
            sortDir: this.sortDir,
            sortFn: this.sortFn,
            allRowsSelected: this.allRowsSelected,
            selectFn: this.selectFn
        };
    }
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "allRowsSelected", {
        get: function () {
            return this._allRowsSelected;
        },
        set: function (value) {
            this._allRowsSelected = value;
            this.cellContext.allRowsSelected = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "column", {
        get: function () {
            return this._column;
        },
        set: function (column) {
            this._column = column;
            this.cellContext.column = column;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "sorts", {
        get: function () {
            return this._sorts;
        },
        set: function (val) {
            this._sorts = val;
            this.sortDir = this.calcSortDir(val);
            this.cellContext.sortDir = this.sortDir;
            this.sortClass = this.calcSortClass(this.sortDir);
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "columnCssClasses", {
        get: function () {
            var e_1, _a;
            var cls = 'datatable-header-cell';
            if (this.column.sortable)
                cls += ' sortable';
            if (this.column.resizeable)
                cls += ' resizeable';
            if (this.column.headerClass) {
                if (typeof this.column.headerClass === 'string') {
                    cls += ' ' + this.column.headerClass;
                }
                else if (typeof this.column.headerClass === 'function') {
                    var res = this.column.headerClass({
                        column: this.column
                    });
                    if (typeof res === 'string') {
                        cls += res;
                    }
                    else if (typeof res === 'object') {
                        var keys = Object.keys(res);
                        try {
                            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                                var k = keys_1_1.value;
                                if (res[k] === true)
                                    cls += " " + k;
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
            var sortDir = this.sortDir;
            if (sortDir) {
                cls += " sort-active sort-" + sortDir;
            }
            return cls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "name", {
        get: function () {
            // guaranteed to have a value by setColumnDefaults() in column-helper.ts
            return this.column.headerTemplate === undefined ? this.column.name : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "minWidth", {
        get: function () {
            return this.column.minWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "maxWidth", {
        get: function () {
            return this.column.maxWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "width", {
        get: function () {
            return this.column.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableHeaderCellComponent.prototype, "isCheckboxable", {
        get: function () {
            return this.column.checkboxable && this.column.headerCheckboxable && this.selectionType === SelectionType.checkbox;
        },
        enumerable: true,
        configurable: true
    });
    DataTableHeaderCellComponent.prototype.onContextmenu = function ($event) {
        this.columnContextmenu.emit({ event: $event, column: this.column });
    };
    DataTableHeaderCellComponent.prototype.calcSortDir = function (sorts) {
        var _this = this;
        if (sorts && this.column) {
            var sort = sorts.find(function (s) {
                return s.prop === _this.column.prop;
            });
            if (sort)
                return sort.dir;
        }
    };
    DataTableHeaderCellComponent.prototype.onSort = function () {
        if (!this.column.sortable)
            return;
        var newValue = nextSortDir(this.sortType, this.sortDir);
        this.sort.emit({
            column: this.column,
            prevValue: this.sortDir,
            newValue: newValue
        });
    };
    DataTableHeaderCellComponent.prototype.calcSortClass = function (sortDir) {
        if (sortDir === SortDirection.asc) {
            return "sort-btn sort-asc " + this.sortAscendingIcon;
        }
        else if (sortDir === SortDirection.desc) {
            return "sort-btn sort-desc " + this.sortDescendingIcon;
        }
        else {
            return "sort-btn";
        }
    };
    DataTableHeaderCellComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "sortType", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "sortAscendingIcon", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "sortDescendingIcon", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "isTarget", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "targetMarkerTemplate", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "targetMarkerContext", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "allRowsSelected", null);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "selectionType", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "column", null);
    __decorate([
        HostBinding('style.height.px'),
        Input()
    ], DataTableHeaderCellComponent.prototype, "headerHeight", void 0);
    __decorate([
        Input()
    ], DataTableHeaderCellComponent.prototype, "sorts", null);
    __decorate([
        Output()
    ], DataTableHeaderCellComponent.prototype, "sort", void 0);
    __decorate([
        Output()
    ], DataTableHeaderCellComponent.prototype, "select", void 0);
    __decorate([
        Output()
    ], DataTableHeaderCellComponent.prototype, "columnContextmenu", void 0);
    __decorate([
        HostBinding('class')
    ], DataTableHeaderCellComponent.prototype, "columnCssClasses", null);
    __decorate([
        HostBinding('attr.title')
    ], DataTableHeaderCellComponent.prototype, "name", null);
    __decorate([
        HostBinding('style.minWidth.px')
    ], DataTableHeaderCellComponent.prototype, "minWidth", null);
    __decorate([
        HostBinding('style.maxWidth.px')
    ], DataTableHeaderCellComponent.prototype, "maxWidth", null);
    __decorate([
        HostBinding('style.width.px')
    ], DataTableHeaderCellComponent.prototype, "width", null);
    __decorate([
        HostListener('contextmenu', ['$event'])
    ], DataTableHeaderCellComponent.prototype, "onContextmenu", null);
    DataTableHeaderCellComponent = __decorate([
        Component({
            selector: 'datatable-header-cell',
            template: "\n    <div class=\"datatable-header-cell-template-wrap\">\n      <ng-template\n        *ngIf=\"isTarget\"\n        [ngTemplateOutlet]=\"targetMarkerTemplate\"\n        [ngTemplateOutletContext]=\"targetMarkerContext\"\n      >\n      </ng-template>\n      <label *ngIf=\"isCheckboxable\" class=\"datatable-checkbox\">\n        <input type=\"checkbox\" [checked]=\"allRowsSelected\" (change)=\"select.emit(!allRowsSelected)\" />\n      </label>\n      <span *ngIf=\"!column.headerTemplate\" class=\"datatable-header-cell-wrapper\">\n        <span class=\"datatable-header-cell-label draggable\" (click)=\"onSort()\" [innerHTML]=\"name\"> </span>\n      </span>\n      <ng-template\n        *ngIf=\"column.headerTemplate\"\n        [ngTemplateOutlet]=\"column.headerTemplate\"\n        [ngTemplateOutletContext]=\"cellContext\"\n      >\n      </ng-template>\n      <span (click)=\"onSort()\" [class]=\"sortClass\"> </span>\n    </div>\n  ",
            host: {
                class: 'datatable-header-cell'
            },
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], DataTableHeaderCellComponent);
    return DataTableHeaderCellComponent;
}());
export { DataTableHeaderCellComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWNlbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLWNlbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxZQUFZLEVBQ1osTUFBTSxFQUNOLFdBQVcsRUFDWCxZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFM0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQWdDaEU7SUE2SEUsc0NBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBOUUvQixTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0MsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQy9DLHNCQUFpQixHQUFHLElBQUksWUFBWSxDQUFxQyxLQUFLLENBQUMsQ0FBQztRQTREMUYsV0FBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR2hDLGFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLGdCQUFXLEdBQVE7WUFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1lBQ3JDLFFBQVEsRUFBRSxJ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O1FBQVIsS0FBSyxFQUFFOzZEQU1QO0lBTVM7UUFBVCxNQUFNLEVBQUU7OERBQThDO0lBQzdDO1FBQVQsTUFBTSxFQUFFO2dFQUFnRDtJQUMvQztRQUFULE1BQU0sRUFBRTsyRUFBaUY7SUFHMUY7UUFEQyxXQUFXLENBQUMsT0FBTyxDQUFDO3dFQStCcEI7SUFHRDtRQURDLFdBQVcsQ0FBQyxZQUFZLENBQUM7NERBSXpCO0lBR0Q7UUFEQyxXQUFXLENBQUMsbUJBQW1CLENBQUM7Z0VBR2hDO0lBR0Q7UUFEQyxXQUFXLENBQUMsbUJBQW1CLENBQUM7Z0VBR2hDO0lBR0Q7UUFEQyxXQUFXLENBQUMsZ0JBQWdCLENBQUM7NkRBRzdCO0lBeUJEO1FBREMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FFQUd2QztJQWxJVSw0QkFBNEI7UUE5QnhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLDI2QkFzQlQ7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLHVCQUF1QjthQUMvQjtZQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7T0FDVyw0QkFBNEIsQ0FrS3hDO0lBQUQsbUNBQUM7Q0FBQSxBQWxLRCxJQWtLQztTQWxLWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU29ydFR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9zb3J0LnR5cGUnO1xuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL3NlbGVjdGlvbi50eXBlJztcbmltcG9ydCB7IFRhYmxlQ29sdW1uIH0gZnJvbSAnLi4vLi4vdHlwZXMvdGFibGUtY29sdW1uLnR5cGUnO1xuaW1wb3J0IHsgbmV4dFNvcnREaXIgfSBmcm9tICcuLi8uLi91dGlscy9zb3J0JztcbmltcG9ydCB7IFNvcnREaXJlY3Rpb24gfSBmcm9tICcuLi8uLi90eXBlcy9zb3J0LWRpcmVjdGlvbi50eXBlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZGF0YXRhYmxlLWhlYWRlci1jZWxsJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZGF0YXRhYmxlLWhlYWRlci1jZWxsLXRlbXBsYXRlLXdyYXBcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAqbmdJZj1cImlzVGFyZ2V0XCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGFyZ2V0TWFya2VyVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwidGFyZ2V0TWFya2VyQ29udGV4dFwiXG4gICAgICA+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPGxhYmVsICpuZ0lmPVwiaXNDaGVja2JveGFibGVcIiBjbGFzcz1cImRhdGF0YWJsZS1jaGVja2JveFwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgW2NoZWNrZWRdPVwiYWxsUm93c1NlbGVjdGVkXCIgKGNoYW5nZSk9XCJzZWxlY3QuZW1pdCghYWxsUm93c1NlbGVjdGVkKVwiIC8+XG4gICAgICA8L2xhYmVsPlxuICAgICAgPHNwYW4gKm5nSWY9XCIhY29sdW1uLmhlYWRlclRlbXBsYXRlXCIgY2xhc3M9XCJkYXRhdGFibGUtaGVhZGVyLWNlbGwtd3JhcHBlclwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImRhdGF0YWJsZS1oZWFkZXItY2VsbC1sYWJlbCBkcmFnZ2FibGVcIiAoY2xpY2spPVwib25Tb3J0KClcIiBbaW5uZXJIVE1MXT1cIm5hbWVcIj4gPC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwiY29sdW1uLmhlYWRlclRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29sdW1uLmhlYWRlclRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImNlbGxDb250ZXh0XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8c3BhbiAoY2xpY2spPVwib25Tb3J0KClcIiBbY2xhc3NdPVwic29ydENsYXNzXCI+IDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnZGF0YXRhYmxlLWhlYWRlci1jZWxsJ1xuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVIZWFkZXJDZWxsQ29tcG9uZW50IHtcbiAgQElucHV0KCkgc29ydFR5cGU6IFNvcnRUeXBlO1xuICBASW5wdXQoKSBzb3J0QXNjZW5kaW5nSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBzb3J0RGVzY2VuZGluZ0ljb246IHN0cmluZztcblxuICBASW5wdXQoKSBpc1RhcmdldDogYm9vbGVhbjtcbiAgQElucHV0KCkgdGFyZ2V0TWFya2VyVGVtcGxhdGU6IGFueTtcbiAgQElucHV0KCkgdGFyZ2V0TWFya2VyQ29udGV4dDogYW55O1xuXG4gIF9hbGxSb3dzU2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgc2V0IGFsbFJvd3NTZWxlY3RlZCh2YWx1ZSkge1xuICAgIHRoaXMuX2FsbFJvd3NTZWxlY3RlZCA9IHZhbHVlO1xuICAgIHRoaXMuY2VsbENvbnRleHQuYWxsUm93c1NlbGVjdGVkID0gdmFsdWU7XG4gIH1cbiAgZ2V0IGFsbFJvd3NTZWxlY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWxsUm93c1NlbGVjdGVkO1xuICB9XG5cbiAgQElucHV0KCkgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZTtcblxuICBASW5wdXQoKSBzZXQgY29sdW1uKGNvbHVtbjogVGFibGVDb2x1bW4pIHtcbiAgICB0aGlzLl9jb2x1bW4gPSBjb2x1bW47XG4gICAgdGhpcy5jZWxsQ29udGV4dC5jb2x1bW4gPSBjb2x1bW47XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBjb2x1bW4oKTogVGFibGVDb2x1bW4ge1xuICAgIHJldHVybiB0aGlzLl9jb2x1bW47XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmhlaWdodC5weCcpXG4gIEBJbnB1dCgpXG4gIGhlYWRlckhlaWdodDogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIHNldCBzb3J0cyh2YWw6IGFueVtdKSB7XG4gICAgdGhpcy5fc29ydHMgPSB2YWw7XG4gICAgdGhpcy5zb3J0RGlyID0gdGhpcy5jYWxjU29ydERpcih2YWwpO1xuICAgIHRoaXMuY2VsbENvbnRleHQuc29ydERpciA9IHRoaXMuc29ydERpcjtcbiAgICB0aGlzLnNvcnRDbGFzcyA9IHRoaXMuY2FsY1NvcnRDbGFzcyh0aGlzLnNvcnREaXIpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgc29ydHMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLl9zb3J0cztcbiAgfVxuXG4gIEBPdXRwdXQoKSBzb3J0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBjb2x1bW5Db250ZXh0bWVudSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogTW91c2VFdmVudDsgY29sdW1uOiBhbnkgfT4oZmFsc2UpO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgY29sdW1uQ3NzQ2xhc3NlcygpOiBhbnkge1xuICAgIGxldCBjbHMgPSAnZGF0YXRhYmxlLWhlYWRlci1jZWxsJztcblxuICAgIGlmICh0aGlzLmNvbHVtbi5zb3J0YWJsZSkgY2xzICs9ICcgc29ydGFibGUnO1xuICAgIGlmICh0aGlzLmNvbHVtbi5yZXNpemVhYmxlKSBjbHMgKz0gJyByZXNpemVhYmxlJztcbiAgICBpZiAodGhpcy5jb2x1bW4uaGVhZGVyQ2xhc3MpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5jb2x1bW4uaGVhZGVyQ2xhc3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNscyArPSAnICcgKyB0aGlzLmNvbHVtbi5oZWFkZXJDbGFzcztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY29sdW1uLmhlYWRlckNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuY29sdW1uLmhlYWRlckNsYXNzKHtcbiAgICAgICAgICBjb2x1bW46IHRoaXMuY29sdW1uXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNscyArPSByZXM7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVzKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xuICAgICAgICAgICAgaWYgKHJlc1trXSA9PT0gdHJ1ZSkgY2xzICs9IGAgJHtrfWA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc29ydERpciA9IHRoaXMuc29ydERpcjtcbiAgICBpZiAoc29ydERpcikge1xuICAgICAgY2xzICs9IGAgc29ydC1hY3RpdmUgc29ydC0ke3NvcnREaXJ9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xzO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnRpdGxlJylcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAvLyBndWFyYW50ZWVkIHRvIGhhdmUgYSB2YWx1ZSBieSBzZXRDb2x1bW5EZWZhdWx0cygpIGluIGNvbHVtbi1oZWxwZXIudHNcbiAgICByZXR1cm4gdGhpcy5jb2x1bW4uaGVhZGVyVGVtcGxhdGUgPT09IHVuZGVmaW5lZCA/IHRoaXMuY29sdW1uLm5hbWUgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1pbldpZHRoLnB4JylcbiAgZ2V0IG1pbldpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uLm1pbldpZHRoO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5tYXhXaWR0aC5weCcpXG4gIGdldCBtYXhXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbi5tYXhXaWR0aDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgucHgnKVxuICBnZXQgd2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW4ud2lkdGg7XG4gIH1cblxuICBnZXQgaXNDaGVja2JveGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uLmNoZWNrYm94YWJsZSAmJiB0aGlzLmNvbHVtbi5oZWFkZXJDaGVja2JveGFibGUgJiYgdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLmNoZWNrYm94O1xuICB9XG5cbiAgc29ydEZuID0gdGhpcy5vblNvcnQuYmluZCh0aGlzKTtcbiAgc29ydENsYXNzOiBzdHJpbmc7XG4gIHNvcnREaXI6IFNvcnREaXJlY3Rpb247XG4gIHNlbGVjdEZuID0gdGhpcy5zZWxlY3QuZW1pdC5iaW5kKHRoaXMuc2VsZWN0KTtcblxuICBjZWxsQ29udGV4dDogYW55ID0ge1xuICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgc29ydERpcjogdGhpcy5zb3J0RGlyLFxuICAgIHNvcnRGbjogdGhpcy5zb3J0Rm4sXG4gICAgYWxsUm93c1NlbGVjdGVkOiB0aGlzLmFsbFJvd3NTZWxlY3RlZCxcbiAgICBzZWxlY3RGbjogdGhpcy5zZWxlY3RGblxuICB9O1xuXG4gIHByaXZhdGUgX2NvbHVtbjogVGFibGVDb2x1bW47XG4gIHByaXZhdGUgX3NvcnRzOiBhbnlbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gIG9uQ29udGV4dG1lbnUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5Db250ZXh0bWVudS5lbWl0KHsgZXZlbnQ6ICRldmVudCwgY29sdW1uOiB0aGlzLmNvbHVtbiB9KTtcbiAgfVxuXG4gIGNhbGNTb3J0RGlyKHNvcnRzOiBhbnlbXSk6IGFueSB7XG4gICAgaWYgKHNvcnRzICYmIHRoaXMuY29sdW1uKSB7XG4gICAgICBjb25zdCBzb3J0ID0gc29ydHMuZmluZCgoczogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBzLnByb3AgPT09IHRoaXMuY29sdW1uLnByb3A7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHNvcnQpIHJldHVybiBzb3J0LmRpcjtcbiAgICB9XG4gIH1cblxuICBvblNvcnQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbHVtbi5zb3J0YWJsZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgbmV3VmFsdWUgPSBuZXh0U29ydERpcih0aGlzLnNvcnRUeXBlLCB0aGlzLnNvcnREaXIpO1xuICAgIHRoaXMuc29ydC5lbWl0KHtcbiAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgICBwcmV2VmFsdWU6IHRoaXMuc29ydERpcixcbiAgICAgIG5ld1ZhbHVlXG4gICAgfSk7XG4gIH1cblxuICBjYWxjU29ydENsYXNzKHNvcnREaXI6IFNvcnREaXJlY3Rpb24pOiBzdHJpbmcge1xuICAgIGlmIChzb3J0RGlyID09PSBTb3J0RGlyZWN0aW9uLmFzYykge1xuICAgICAgcmV0dXJuIGBzb3J0LWJ0biBzb3J0LWFzYyAke3RoaXMuc29ydEFzY2VuZGluZ0ljb259YDtcbiAgICB9IGVsc2UgaWYgKHNvcnREaXIgPT09IFNvcnREaXJlY3Rpb24uZGVzYykge1xuICAgICAgcmV0dXJuIGBzb3J0LWJ0biBzb3J0LWRlc2MgJHt0aGlzLnNvcnREZXNjZW5kaW5nSWNvbn1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHNvcnQtYnRuYDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==