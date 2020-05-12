import { __decorate } from "tslib";
import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
var DataTableFooterComponent = /** @class */ (function () {
    function DataTableFooterComponent() {
        this.selectedCount = 0;
        this.page = new EventEmitter();
    }
    Object.defineProperty(DataTableFooterComponent.prototype, "isVisible", {
        get: function () {
            return this.rowCount / this.pageSize > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableFooterComponent.prototype, "curPage", {
        get: function () {
            return this.offset + 1;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "footerHeight", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "rowCount", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "pageSize", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "offset", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "pagerLeftArrowIcon", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "pagerRightArrowIcon", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "pagerPreviousIcon", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "pagerNextIcon", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "totalMessage", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "footerTemplate", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "selectedCount", void 0);
    __decorate([
        Input()
    ], DataTableFooterComponent.prototype, "selectedMessage", void 0);
    __decorate([
        Output()
    ], DataTableFooterComponent.prototype, "page", void 0);
    DataTableFooterComponent = __decorate([
        Component({
            selector: 'datatable-footer',
            template: "\n    <div\n      class=\"datatable-footer-inner\"\n      [ngClass]=\"{ 'selected-count': selectedMessage }\"\n      [style.height.px]=\"footerHeight\"\n    >\n      <ng-template\n        *ngIf=\"footerTemplate\"\n        [ngTemplateOutlet]=\"footerTemplate.template\"\n        [ngTemplateOutletContext]=\"{\n          rowCount: rowCount,\n          pageSize: pageSize,\n          selectedCount: selectedCount,\n          curPage: curPage,\n          offset: offset\n        }\"\n      >\n      </ng-template>\n      <div class=\"page-count\" *ngIf=\"!footerTemplate\">\n        <span *ngIf=\"selectedMessage\"> {{ selectedCount?.toLocaleString() }} {{ selectedMessage }} / </span>\n        {{ rowCount?.toLocaleString() }} {{ totalMessage }}\n      </div>\n      <datatable-pager\n        *ngIf=\"!footerTemplate\"\n        [pagerLeftArrowIcon]=\"pagerLeftArrowIcon\"\n        [pagerRightArrowIcon]=\"pagerRightArrowIcon\"\n        [pagerPreviousIcon]=\"pagerPreviousIcon\"\n        [pagerNextIcon]=\"pagerNextIcon\"\n        [page]=\"curPage\"\n        [size]=\"pageSize\"\n        [count]=\"rowCount\"\n        [hidden]=\"!isVisible\"\n        (change)=\"page.emit($event)\"\n      >\n      </datatable-pager>\n    </div>\n  ",
            host: {
                class: 'datatable-footer'
            },
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], DataTableFooterComponent);
    return DataTableFooterComponent;
}());
export { DataTableFooterComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUE4Q2hHO0lBQUE7UUFZVyxrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUd6QixTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFTekQsQ0FBQztJQVBDLHNCQUFJLCtDQUFTO2FBQWI7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDM0MsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw2Q0FBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQXRCUTtRQUFSLEtBQUssRUFBRTtrRUFBc0I7SUFDckI7UUFBUixLQUFLLEVBQUU7OERBQWtCO0lBQ2pCO1FBQVIsS0FBSyxFQUFFOzhEQUFrQjtJQUNqQjtRQUFSLEtBQUssRUFBRTs0REFBZ0I7SUFDZjtRQUFSLEtBQUssRUFBRTt3RUFBNEI7SUFDM0I7UUFBUixLQUFLLEVBQUU7eUVBQTZCO0lBQzVCO1FBQVIsS0FBSyxFQUFFO3VFQUEyQjtJQUMxQjtRQUFSLEtBQUssRUFBRTttRUFBdUI7SUFDdEI7UUFBUixLQUFLLEVBQUU7a0VBQXNCO0lBQ3JCO1FBQVIsS0FBSyxFQUFFO29FQUEwQztJQUV6QztRQUFSLEtBQUssRUFBRTttRUFBMkI7SUFDMUI7UUFBUixLQUFLLEVBQUU7cUVBQW1DO0lBRWpDO1FBQVQsTUFBTSxFQUFFOzBEQUE4QztJQWY1Qyx3QkFBd0I7UUE1Q3BDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsUUFBUSxFQUFFLDhzQ0FvQ1Q7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLGtCQUFrQjthQUMxQjtZQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7T0FDVyx3QkFBd0IsQ0F3QnBDO0lBQUQsK0JBQUM7Q0FBQSxBQXhCRCxJQXdCQztTQXhCWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGF0YWJsZUZvb3RlckRpcmVjdGl2ZSB9IGZyb20gJy4vZm9vdGVyLmRpcmVjdGl2ZSc7XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtZm9vdGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImRhdGF0YWJsZS1mb290ZXItaW5uZXJcIlxuICAgICAgW25nQ2xhc3NdPVwieyAnc2VsZWN0ZWQtY291bnQnOiBzZWxlY3RlZE1lc3NhZ2UgfVwiXG4gICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cImZvb3RlckhlaWdodFwiXG4gICAgPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwiZm9vdGVyVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJmb290ZXJUZW1wbGF0ZS50ZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgICAgcm93Q291bnQ6IHJvd0NvdW50LFxuICAgICAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZSxcbiAgICAgICAgICBzZWxlY3RlZENvdW50OiBzZWxlY3RlZENvdW50LFxuICAgICAgICAgIGN1clBhZ2U6IGN1clBhZ2UsXG4gICAgICAgICAgb2Zmc2V0OiBvZmZzZXRcbiAgICAgICAgfVwiXG4gICAgICA+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtY291bnRcIiAqbmdJZj1cIiFmb290ZXJUZW1wbGF0ZVwiPlxuICAgICAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTWVzc2FnZVwiPiB7eyBzZWxlY3RlZENvdW50Py50b0xvY2FsZVN0cmluZygpIH19IHt7IHNlbGVjdGVkTWVzc2FnZSB9fSAvIDwvc3Bhbj5cbiAgICAgICAge3sgcm93Q291bnQ/LnRvTG9jYWxlU3RyaW5nKCkgfX0ge3sgdG90YWxNZXNzYWdlIH19XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkYXRhdGFibGUtcGFnZXJcbiAgICAgICAgKm5nSWY9XCIhZm9vdGVyVGVtcGxhdGVcIlxuICAgICAgICBbcGFnZXJMZWZ0QXJyb3dJY29uXT1cInBhZ2VyTGVmdEFycm93SWNvblwiXG4gICAgICAgIFtwYWdlclJpZ2h0QXJyb3dJY29uXT1cInBhZ2VyUmlnaHRBcnJvd0ljb25cIlxuICAgICAgICBbcGFnZXJQcmV2aW91c0ljb25dPVwicGFnZXJQcmV2aW91c0ljb25cIlxuICAgICAgICBbcGFnZXJOZXh0SWNvbl09XCJwYWdlck5leHRJY29uXCJcbiAgICAgICAgW3BhZ2VdPVwiY3VyUGFnZVwiXG4gICAgICAgIFtzaXplXT1cInBhZ2VTaXplXCJcbiAgICAgICAgW2NvdW50XT1cInJvd0NvdW50XCJcbiAgICAgICAgW2hpZGRlbl09XCIhaXNWaXNpYmxlXCJcbiAgICAgICAgKGNoYW5nZSk9XCJwYWdlLmVtaXQoJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICA8L2RhdGF0YWJsZS1wYWdlcj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnZGF0YXRhYmxlLWZvb3RlcidcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlRm9vdGVyQ29tcG9uZW50IHtcbiAgQElucHV0KCkgZm9vdGVySGVpZ2h0OiBudW1iZXI7XG4gIEBJbnB1dCgpIHJvd0NvdW50OiBudW1iZXI7XG4gIEBJbnB1dCgpIHBhZ2VTaXplOiBudW1iZXI7XG4gIEBJbnB1dCgpIG9mZnNldDogbnVtYmVyO1xuICBASW5wdXQoKSBwYWdlckxlZnRBcnJvd0ljb246IHN0cmluZztcbiAgQElucHV0KCkgcGFnZXJSaWdodEFycm93SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBwYWdlclByZXZpb3VzSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBwYWdlck5leHRJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHRvdGFsTWVzc2FnZTogc3RyaW5nO1xuICBASW5wdXQoKSBmb290ZXJUZW1wbGF0ZTogRGF0YXRhYmxlRm9vdGVyRGlyZWN0aXZlO1xuXG4gIEBJbnB1dCgpIHNlbGVjdGVkQ291bnQ6IG51bWJlciA9IDA7XG4gIEBJbnB1dCgpIHNlbGVjdGVkTWVzc2FnZTogc3RyaW5nIHwgYm9vbGVhbjtcblxuICBAT3V0cHV0KCkgcGFnZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yb3dDb3VudCAvIHRoaXMucGFnZVNpemUgPiAxO1xuICB9XG5cbiAgZ2V0IGN1clBhZ2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vZmZzZXQgKyAxO1xuICB9XG59XG4iXX0=