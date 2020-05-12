import { __assign, __decorate } from "tslib";
import { Component, Input } from '@angular/core';
function defaultSumFunc(cells) {
    var cellsWithValues = cells.filter(function (cell) { return !!cell; });
    if (!cellsWithValues.length) {
        return null;
    }
    if (cellsWithValues.some(function (cell) { return typeof cell !== 'number'; })) {
        return null;
    }
    return cellsWithValues.reduce(function (res, cell) { return res + cell; });
}
function noopSumFunc(cells) {
    return null;
}
var DataTableSummaryRowComponent = /** @class */ (function () {
    function DataTableSummaryRowComponent() {
        this.summaryRow = {};
    }
    DataTableSummaryRowComponent.prototype.ngOnChanges = function () {
        if (!this.columns || !this.rows) {
            return;
        }
        this.updateInternalColumns();
        this.updateValues();
    };
    DataTableSummaryRowComponent.prototype.updateInternalColumns = function () {
        this._internalColumns = this.columns.map(function (col) { return (__assign(__assign({}, col), { cellTemplate: col.summaryTemplate })); });
    };
    DataTableSummaryRowComponent.prototype.updateValues = function () {
        var _this = this;
        this.summaryRow = {};
        this.columns
            .filter(function (col) { return !col.summaryTemplate; })
            .forEach(function (col) {
            var cellsFromSingleColumn = _this.rows.map(function (row) { return row[col.prop]; });
            var sumFunc = _this.getSummaryFunction(col);
            _this.summaryRow[col.prop] = col.pipe
                ? col.pipe.transform(sumFunc(cellsFromSingleColumn))
                : sumFunc(cellsFromSingleColumn);
        });
    };
    DataTableSummaryRowComponent.prototype.getSummaryFunction = function (column) {
        if (column.summaryFunc === undefined) {
            return defaultSumFunc;
        }
        else if (column.summaryFunc === null) {
            return noopSumFunc;
        }
        else {
            return column.summaryFunc;
        }
    };
    __decorate([
        Input()
    ], DataTableSummaryRowComponent.prototype, "rows", void 0);
    __decorate([
        Input()
    ], DataTableSummaryRowComponent.prototype, "columns", void 0);
    __decorate([
        Input()
    ], DataTableSummaryRowComponent.prototype, "rowHeight", void 0);
    __decorate([
        Input()
    ], DataTableSummaryRowComponent.prototype, "offsetX", void 0);
    __decorate([
        Input()
    ], DataTableSummaryRowComponent.prototype, "innerWidth", void 0);
    DataTableSummaryRowComponent = __decorate([
        Component({
            selector: 'datatable-summary-row',
            template: "\n    <datatable-body-row\n      *ngIf=\"summaryRow && _internalColumns\"\n      tabindex=\"-1\"\n      [innerWidth]=\"innerWidth\"\n      [offsetX]=\"offsetX\"\n      [columns]=\"_internalColumns\"\n      [rowHeight]=\"rowHeight\"\n      [row]=\"summaryRow\"\n      [rowIndex]=\"-1\"\n    >\n    </datatable-body-row>\n  ",
            host: {
                class: 'datatable-summary-row'
            }
        })
    ], DataTableSummaryRowComponent);
    return DataTableSummaryRowComponent;
}());
export { DataTableSummaryRowComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeS1yb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ib2R5L3N1bW1hcnkvc3VtbWFyeS1yb3cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBeUMsTUFBTSxlQUFlLENBQUM7QUFVeEYsU0FBUyxjQUFjLENBQUMsS0FBWTtJQUNsQyxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQztJQUVyRCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtRQUMzQixPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUF4QixDQUF3QixDQUFDLEVBQUU7UUFDMUQsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxJQUFJLElBQUssT0FBQSxHQUFHLEdBQUcsSUFBSSxFQUFWLENBQVUsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFZO0lBQy9CLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQXFCRDtJQUFBO1FBU0UsZUFBVSxHQUFRLEVBQUUsQ0FBQztJQXlDdkIsQ0FBQztJQXZDQyxrREFBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQy9CLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU8sNERBQXFCLEdBQTdCO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsdUJBQzNDLEdBQUcsS0FDTixZQUFZLEVBQUUsR0FBRyxDQUFDLGVBQWUsSUFDakMsRUFIOEMsQ0FHOUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVPLG1EQUFZLEdBQXBCO1FBQUEsaUJBYUM7UUFaQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsT0FBTzthQUNULE1BQU0sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBcEIsQ0FBb0IsQ0FBQzthQUNuQyxPQUFPLENBQUMsVUFBQSxHQUFHO1lBQ1YsSUFBTSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7WUFDbEUsSUFBTSxPQUFPLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTdDLEtBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJO2dCQUNsQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ3BELENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyx5REFBa0IsR0FBMUIsVUFBMkIsTUFBc0I7UUFDL0MsSUFBSSxNQUFNLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUNwQyxPQUFPLGNBQWMsQ0FBQztTQUN2QjthQUFNLElBQUksTUFBTSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDdEMsT0FBTyxXQUFXLENBQUM7U0FDcEI7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFoRFE7UUFBUixLQUFLLEVBQUU7OERBQWE7SUFDWjtRQUFSLEtBQUssRUFBRTtpRUFBMkI7SUFFMUI7UUFBUixLQUFLLEVBQUU7bUVBQW1CO0lBQ2xCO1FBQVIsS0FBSyxFQUFFO2lFQUFpQjtJQUNoQjtRQUFSLEtBQUssRUFBRTtvRUFBb0I7SUFOakIsNEJBQTRCO1FBbkJ4QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLFFBQVEsRUFBRSxvVUFZVDtZQUNELElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsdUJBQXVCO2FBQy9CO1NBQ0YsQ0FBQztPQUNXLDRCQUE0QixDQWtEeEM7SUFBRCxtQ0FBQztDQUFBLEFBbERELElBa0RDO1NBbERZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgUGlwZVRyYW5zZm9ybSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBJU3VtbWFyeUNvbHVtbiB7XG4gIHN1bW1hcnlGdW5jPzogKGNlbGxzOiBhbnlbXSkgPT4gYW55O1xuICBzdW1tYXJ5VGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHByb3A6IHN0cmluZztcbiAgcGlwZT86IFBpcGVUcmFuc2Zvcm07XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRTdW1GdW5jKGNlbGxzOiBhbnlbXSk6IGFueSB7XG4gIGNvbnN0IGNlbGxzV2l0aFZhbHVlcyA9IGNlbGxzLmZpbHRlcihjZWxsID0+ICEhY2VsbCk7XG5cbiAgaWYgKCFjZWxsc1dpdGhWYWx1ZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGNlbGxzV2l0aFZhbHVlcy5zb21lKGNlbGwgPT4gdHlwZW9mIGNlbGwgIT09ICdudW1iZXInKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGNlbGxzV2l0aFZhbHVlcy5yZWR1Y2UoKHJlcywgY2VsbCkgPT4gcmVzICsgY2VsbCk7XG59XG5cbmZ1bmN0aW9uIG5vb3BTdW1GdW5jKGNlbGxzOiBhbnlbXSk6IHZvaWQge1xuICByZXR1cm4gbnVsbDtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZGF0YXRhYmxlLXN1bW1hcnktcm93JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGF0YXRhYmxlLWJvZHktcm93XG4gICAgICAqbmdJZj1cInN1bW1hcnlSb3cgJiYgX2ludGVybmFsQ29sdW1uc1wiXG4gICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxuICAgICAgW29mZnNldFhdPVwib2Zmc2V0WFwiXG4gICAgICBbY29sdW1uc109XCJfaW50ZXJuYWxDb2x1bW5zXCJcbiAgICAgIFtyb3dIZWlnaHRdPVwicm93SGVpZ2h0XCJcbiAgICAgIFtyb3ddPVwic3VtbWFyeVJvd1wiXG4gICAgICBbcm93SW5kZXhdPVwiLTFcIlxuICAgID5cbiAgICA8L2RhdGF0YWJsZS1ib2R5LXJvdz5cbiAgYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnZGF0YXRhYmxlLXN1bW1hcnktcm93J1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZVN1bW1hcnlSb3dDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSByb3dzOiBhbnlbXTtcbiAgQElucHV0KCkgY29sdW1uczogSVN1bW1hcnlDb2x1bW5bXTtcblxuICBASW5wdXQoKSByb3dIZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgb2Zmc2V0WDogbnVtYmVyO1xuICBASW5wdXQoKSBpbm5lcldpZHRoOiBudW1iZXI7XG5cbiAgX2ludGVybmFsQ29sdW1uczogSVN1bW1hcnlDb2x1bW5bXTtcbiAgc3VtbWFyeVJvdzogYW55ID0ge307XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKCF0aGlzLmNvbHVtbnMgfHwgIXRoaXMucm93cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZUludGVybmFsQ29sdW1ucygpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVzKCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUludGVybmFsQ29sdW1ucygpIHtcbiAgICB0aGlzLl9pbnRlcm5hbENvbHVtbnMgPSB0aGlzLmNvbHVtbnMubWFwKGNvbCA9PiAoe1xuICAgICAgLi4uY29sLFxuICAgICAgY2VsbFRlbXBsYXRlOiBjb2wuc3VtbWFyeVRlbXBsYXRlXG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVWYWx1ZXMoKSB7XG4gICAgdGhpcy5zdW1tYXJ5Um93ID0ge307XG5cbiAgICB0aGlzLmNvbHVtbnNcbiAgICAgIC5maWx0ZXIoY29sID0+ICFjb2wuc3VtbWFyeVRlbXBsYXRlKVxuICAgICAgLmZvckVhY2goY29sID0+IHtcbiAgICAgICAgY29uc3QgY2VsbHNGcm9tU2luZ2xlQ29sdW1uID0gdGhpcy5yb3dzLm1hcChyb3cgPT4gcm93W2NvbC5wcm9wXSk7XG4gICAgICAgIGNvbnN0IHN1bUZ1bmMgPSB0aGlzLmdldFN1bW1hcnlGdW5jdGlvbihjb2wpO1xuXG4gICAgICAgIHRoaXMuc3VtbWFyeVJvd1tjb2wucHJvcF0gPSBjb2wucGlwZVxuICAgICAgICAgID8gY29sLnBpcGUudHJhbnNmb3JtKHN1bUZ1bmMoY2VsbHNGcm9tU2luZ2xlQ29sdW1uKSlcbiAgICAgICAgICA6IHN1bUZ1bmMoY2VsbHNGcm9tU2luZ2xlQ29sdW1uKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdW1tYXJ5RnVuY3Rpb24oY29sdW1uOiBJU3VtbWFyeUNvbHVtbik6IChhOiBhbnlbXSkgPT4gYW55IHtcbiAgICBpZiAoY29sdW1uLnN1bW1hcnlGdW5jID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0U3VtRnVuYztcbiAgICB9IGVsc2UgaWYgKGNvbHVtbi5zdW1tYXJ5RnVuYyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5vb3BTdW1GdW5jO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29sdW1uLnN1bW1hcnlGdW5jO1xuICAgIH1cbiAgfVxufVxuIl19