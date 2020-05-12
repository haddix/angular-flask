import { __decorate } from "tslib";
import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { DataTableColumnHeaderDirective } from './column-header.directive';
import { DataTableColumnCellDirective } from './column-cell.directive';
import { DataTableColumnCellTreeToggle } from './tree.directive';
import { ColumnChangesService } from '../../services/column-changes.service';
var DataTableColumnDirective = /** @class */ (function () {
    function DataTableColumnDirective(columnChangesService) {
        this.columnChangesService = columnChangesService;
        this.isFirstChange = true;
    }
    Object.defineProperty(DataTableColumnDirective.prototype, "cellTemplate", {
        get: function () {
            return this._cellTemplateInput || this._cellTemplateQuery;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableColumnDirective.prototype, "headerTemplate", {
        get: function () {
            return this._headerTemplateInput || this._headerTemplateQuery;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableColumnDirective.prototype, "treeToggleTemplate", {
        get: function () {
            return this._treeToggleTemplateInput || this._treeToggleTemplateQuery;
        },
        enumerable: true,
        configurable: true
    });
    DataTableColumnDirective.prototype.ngOnChanges = function () {
        if (this.isFirstChange) {
            this.isFirstChange = false;
        }
        else {
            this.columnChangesService.onInputChange();
        }
    };
    DataTableColumnDirective.ctorParameters = function () { return [
        { type: ColumnChangesService }
    ]; };
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "name", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "prop", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "frozenLeft", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "frozenRight", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "flexGrow", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "resizeable", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "comparator", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "pipe", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "sortable", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "draggable", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "canAutoResize", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "minWidth", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "width", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "maxWidth", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "checkboxable", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "headerCheckboxable", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "headerClass", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "cellClass", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "isTreeColumn", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "treeLevelIndent", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "summaryFunc", void 0);
    __decorate([
        Input()
    ], DataTableColumnDirective.prototype, "summaryTemplate", void 0);
    __decorate([
        Input('cellTemplate')
    ], DataTableColumnDirective.prototype, "_cellTemplateInput", void 0);
    __decorate([
        ContentChild(DataTableColumnCellDirective, { read: TemplateRef, static: true })
    ], DataTableColumnDirective.prototype, "_cellTemplateQuery", void 0);
    __decorate([
        Input('headerTemplate')
    ], DataTableColumnDirective.prototype, "_headerTemplateInput", void 0);
    __decorate([
        ContentChild(DataTableColumnHeaderDirective, { read: TemplateRef, static: true })
    ], DataTableColumnDirective.prototype, "_headerTemplateQuery", void 0);
    __decorate([
        Input('treeToggleTemplate')
    ], DataTableColumnDirective.prototype, "_treeToggleTemplateInput", void 0);
    __decorate([
        ContentChild(DataTableColumnCellTreeToggle, { read: TemplateRef, static: true })
    ], DataTableColumnDirective.prototype, "_treeToggleTemplateQuery", void 0);
    DataTableColumnDirective = __decorate([
        Directive({ selector: 'ngx-datatable-column' })
    ], DataTableColumnDirective);
    return DataTableColumnDirective;
}());
export { DataTableColumnDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29sdW1ucy9jb2x1bW4uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUk3RTtJQXdERSxrQ0FBb0Isb0JBQTBDO1FBQTFDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFGdEQsa0JBQWEsR0FBRyxJQUFJLENBQUM7SUFFb0MsQ0FBQztJQTFCbEUsc0JBQUksa0RBQVk7YUFBaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDNUQsQ0FBQzs7O09BQUE7SUFRRCxzQkFBSSxvREFBYzthQUFsQjtZQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUNoRSxDQUFDOzs7T0FBQTtJQVFELHNCQUFJLHdEQUFrQjthQUF0QjtZQUNFLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztRQUN4RSxDQUFDOzs7T0FBQTtJQU1ELDhDQUFXLEdBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDNUI7YUFBTTtZQUNMLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUMzQztJQUNILENBQUM7O2dCQVJ5QyxvQkFBb0I7O0lBdkRyRDtRQUFSLEtBQUssRUFBRTswREFBYztJQUNiO1FBQVIsS0FBSyxFQUFFOzBEQUF1QjtJQUN0QjtRQUFSLEtBQUssRUFBRTtnRUFBaUI7SUFDaEI7UUFBUixLQUFLLEVBQUU7aUVBQWtCO0lBQ2pCO1FBQVIsS0FBSyxFQUFFOzhEQUFrQjtJQUNqQjtRQUFSLEtBQUssRUFBRTtnRUFBcUI7SUFDcEI7UUFBUixLQUFLLEVBQUU7Z0VBQWlCO0lBQ2hCO1FBQVIsS0FBSyxFQUFFOzBEQUFXO0lBQ1Y7UUFBUixLQUFLLEVBQUU7OERBQW1CO0lBQ2xCO1FBQVIsS0FBSyxFQUFFOytEQUFvQjtJQUNuQjtRQUFSLEtBQUssRUFBRTttRUFBd0I7SUFDdkI7UUFBUixLQUFLLEVBQUU7OERBQWtCO0lBQ2pCO1FBQVIsS0FBSyxFQUFFOzJEQUFlO0lBQ2Q7UUFBUixLQUFLLEVBQUU7OERBQWtCO0lBQ2pCO1FBQVIsS0FBSyxFQUFFO2tFQUF1QjtJQUN0QjtRQUFSLEtBQUssRUFBRTt3RUFBNkI7SUFDNUI7UUFBUixLQUFLLEVBQUU7aUVBQXFEO0lBQ3BEO1FBQVIsS0FBSyxFQUFFOytEQUFtRDtJQUNsRDtRQUFSLEtBQUssRUFBRTtrRUFBdUI7SUFDdEI7UUFBUixLQUFLLEVBQUU7cUVBQXlCO0lBQ3hCO1FBQVIsS0FBSyxFQUFFO2lFQUFvQztJQUNuQztRQUFSLEtBQUssRUFBRTtxRUFBbUM7SUFHM0M7UUFEQyxLQUFLLENBQUMsY0FBYyxDQUFDO3dFQUNlO0lBR3JDO1FBREMsWUFBWSxDQUFDLDRCQUE0QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7d0VBQzNDO0lBT3JDO1FBREMsS0FBSyxDQUFDLGdCQUFnQixDQUFDOzBFQUNlO0lBR3ZDO1FBREMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7MEVBQzNDO0lBT3ZDO1FBREMsS0FBSyxDQUFDLG9CQUFvQixDQUFDOzhFQUNlO0lBRzNDO1FBREMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7OEVBQ3RDO0lBaERoQyx3QkFBd0I7UUFEcEMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLENBQUM7T0FDbkMsd0JBQXdCLENBaUVwQztJQUFELCtCQUFDO0NBQUEsQUFqRUQsSUFpRUM7U0FqRVksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBUZW1wbGF0ZVJlZiwgQ29udGVudENoaWxkLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVDb2x1bW5IZWFkZXJEaXJlY3RpdmUgfSBmcm9tICcuL2NvbHVtbi1oZWFkZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGFUYWJsZUNvbHVtbkNlbGxEaXJlY3RpdmUgfSBmcm9tICcuL2NvbHVtbi1jZWxsLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVDb2x1bW5DZWxsVHJlZVRvZ2dsZSB9IGZyb20gJy4vdHJlZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ29sdW1uQ2hhbmdlc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb2x1bW4tY2hhbmdlcy5zZXJ2aWNlJztcbmltcG9ydCB7IFRhYmxlQ29sdW1uUHJvcCB9IGZyb20gJy4uLy4uL3R5cGVzL3RhYmxlLWNvbHVtbi50eXBlJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnbmd4LWRhdGF0YWJsZS1jb2x1bW4nIH0pXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBwcm9wOiBUYWJsZUNvbHVtblByb3A7XG4gIEBJbnB1dCgpIGZyb3plbkxlZnQ6IGFueTtcbiAgQElucHV0KCkgZnJvemVuUmlnaHQ6IGFueTtcbiAgQElucHV0KCkgZmxleEdyb3c6IG51bWJlcjtcbiAgQElucHV0KCkgcmVzaXplYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgY29tcGFyYXRvcjogYW55O1xuICBASW5wdXQoKSBwaXBlOiBhbnk7XG4gIEBJbnB1dCgpIHNvcnRhYmxlOiBib29sZWFuO1xuICBASW5wdXQoKSBkcmFnZ2FibGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNhbkF1dG9SZXNpemU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1pbldpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIHdpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIG1heFdpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIGNoZWNrYm94YWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaGVhZGVyQ2hlY2tib3hhYmxlOiBib29sZWFuO1xuICBASW5wdXQoKSBoZWFkZXJDbGFzczogc3RyaW5nIHwgKChkYXRhOiBhbnkpID0+IHN0cmluZyB8IGFueSk7XG4gIEBJbnB1dCgpIGNlbGxDbGFzczogc3RyaW5nIHwgKChkYXRhOiBhbnkpID0+IHN0cmluZyB8IGFueSk7XG4gIEBJbnB1dCgpIGlzVHJlZUNvbHVtbjogYm9vbGVhbjtcbiAgQElucHV0KCkgdHJlZUxldmVsSW5kZW50OiBudW1iZXI7XG4gIEBJbnB1dCgpIHN1bW1hcnlGdW5jOiAoY2VsbHM6IGFueVtdKSA9PiBhbnk7XG4gIEBJbnB1dCgpIHN1bW1hcnlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoJ2NlbGxUZW1wbGF0ZScpXG4gIF9jZWxsVGVtcGxhdGVJbnB1dDogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAQ29udGVudENoaWxkKERhdGFUYWJsZUNvbHVtbkNlbGxEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICBfY2VsbFRlbXBsYXRlUXVlcnk6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZ2V0IGNlbGxUZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY2VsbFRlbXBsYXRlSW5wdXQgfHwgdGhpcy5fY2VsbFRlbXBsYXRlUXVlcnk7XG4gIH1cblxuICBASW5wdXQoJ2hlYWRlclRlbXBsYXRlJylcbiAgX2hlYWRlclRlbXBsYXRlSW5wdXQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChEYXRhVGFibGVDb2x1bW5IZWFkZXJEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICBfaGVhZGVyVGVtcGxhdGVRdWVyeTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBnZXQgaGVhZGVyVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYWRlclRlbXBsYXRlSW5wdXQgfHwgdGhpcy5faGVhZGVyVGVtcGxhdGVRdWVyeTtcbiAgfVxuXG4gIEBJbnB1dCgndHJlZVRvZ2dsZVRlbXBsYXRlJylcbiAgX3RyZWVUb2dnbGVUZW1wbGF0ZUlucHV0OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoRGF0YVRhYmxlQ29sdW1uQ2VsbFRyZWVUb2dnbGUsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICBfdHJlZVRvZ2dsZVRlbXBsYXRlUXVlcnk6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZ2V0IHRyZWVUb2dnbGVUZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fdHJlZVRvZ2dsZVRlbXBsYXRlSW5wdXQgfHwgdGhpcy5fdHJlZVRvZ2dsZVRlbXBsYXRlUXVlcnk7XG4gIH1cblxuICBwcml2YXRlIGlzRmlyc3RDaGFuZ2UgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29sdW1uQ2hhbmdlc1NlcnZpY2U6IENvbHVtbkNoYW5nZXNTZXJ2aWNlKSB7fVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmlzRmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuaXNGaXJzdENoYW5nZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbHVtbkNoYW5nZXNTZXJ2aWNlLm9uSW5wdXRDaGFuZ2UoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==