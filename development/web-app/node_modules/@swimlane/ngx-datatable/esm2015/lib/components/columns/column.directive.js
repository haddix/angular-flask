import { __decorate } from "tslib";
import { Directive, TemplateRef, ContentChild, Input } from '@angular/core';
import { DataTableColumnHeaderDirective } from './column-header.directive';
import { DataTableColumnCellDirective } from './column-cell.directive';
import { DataTableColumnCellTreeToggle } from './tree.directive';
import { ColumnChangesService } from '../../services/column-changes.service';
let DataTableColumnDirective = class DataTableColumnDirective {
    constructor(columnChangesService) {
        this.columnChangesService = columnChangesService;
        this.isFirstChange = true;
    }
    get cellTemplate() {
        return this._cellTemplateInput || this._cellTemplateQuery;
    }
    get headerTemplate() {
        return this._headerTemplateInput || this._headerTemplateQuery;
    }
    get treeToggleTemplate() {
        return this._treeToggleTemplateInput || this._treeToggleTemplateQuery;
    }
    ngOnChanges() {
        if (this.isFirstChange) {
            this.isFirstChange = false;
        }
        else {
            this.columnChangesService.onInputChange();
        }
    }
};
DataTableColumnDirective.ctorParameters = () => [
    { type: ColumnChangesService }
];
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
export { DataTableColumnDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29sdW1ucy9jb2x1bW4uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUk3RSxJQUFhLHdCQUF3QixHQUFyQyxNQUFhLHdCQUF3QjtJQXdEbkMsWUFBb0Isb0JBQTBDO1FBQTFDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFGdEQsa0JBQWEsR0FBRyxJQUFJLENBQUM7SUFFb0MsQ0FBQztJQTFCbEUsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQzVELENBQUM7SUFRRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDO0lBQ2hFLENBQUM7SUFRRCxJQUFJLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUM7SUFDeEUsQ0FBQztJQU1ELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDNUI7YUFBTTtZQUNMLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUMzQztJQUNILENBQUM7Q0FDRixDQUFBOztZQVQyQyxvQkFBb0I7O0FBdkRyRDtJQUFSLEtBQUssRUFBRTtzREFBYztBQUNiO0lBQVIsS0FBSyxFQUFFO3NEQUF1QjtBQUN0QjtJQUFSLEtBQUssRUFBRTs0REFBaUI7QUFDaEI7SUFBUixLQUFLLEVBQUU7NkRBQWtCO0FBQ2pCO0lBQVIsS0FBSyxFQUFFOzBEQUFrQjtBQUNqQjtJQUFSLEtBQUssRUFBRTs0REFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7NERBQWlCO0FBQ2hCO0lBQVIsS0FBSyxFQUFFO3NEQUFXO0FBQ1Y7SUFBUixLQUFLLEVBQUU7MERBQW1CO0FBQ2xCO0lBQVIsS0FBSyxFQUFFOzJEQUFvQjtBQUNuQjtJQUFSLEtBQUssRUFBRTsrREFBd0I7QUFDdkI7SUFBUixLQUFLLEVBQUU7MERBQWtCO0FBQ2pCO0lBQVIsS0FBSyxFQUFFO3VEQUFlO0FBQ2Q7SUFBUixLQUFLLEVBQUU7MERBQWtCO0FBQ2pCO0lBQVIsS0FBSyxFQUFFOzhEQUF1QjtBQUN0QjtJQUFSLEtBQUssRUFBRTtvRUFBNkI7QUFDNUI7SUFBUixLQUFLLEVBQUU7NkRBQXFEO0FBQ3BEO0lBQVIsS0FBSyxFQUFFOzJEQUFtRDtBQUNsRDtJQUFSLEtBQUssRUFBRTs4REFBdUI7QUFDdEI7SUFBUixLQUFLLEVBQUU7aUVBQXlCO0FBQ3hCO0lBQVIsS0FBSyxFQUFFOzZEQUFvQztBQUNuQztJQUFSLEtBQUssRUFBRTtpRUFBbUM7QUFHM0M7SUFEQyxLQUFLLENBQUMsY0FBYyxDQUFDO29FQUNlO0FBR3JDO0lBREMsWUFBWSxDQUFDLDRCQUE0QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7b0VBQzNDO0FBT3JDO0lBREMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO3NFQUNlO0FBR3ZDO0lBREMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7c0VBQzNDO0FBT3ZDO0lBREMsS0FBSyxDQUFDLG9CQUFvQixDQUFDOzBFQUNlO0FBRzNDO0lBREMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7MEVBQ3RDO0FBaERoQyx3QkFBd0I7SUFEcEMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLENBQUM7R0FDbkMsd0JBQXdCLENBaUVwQztTQWpFWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIFRlbXBsYXRlUmVmLCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGFUYWJsZUNvbHVtbkhlYWRlckRpcmVjdGl2ZSB9IGZyb20gJy4vY29sdW1uLWhlYWRlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YVRhYmxlQ29sdW1uQ2VsbERpcmVjdGl2ZSB9IGZyb20gJy4vY29sdW1uLWNlbGwuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGFUYWJsZUNvbHVtbkNlbGxUcmVlVG9nZ2xlIH0gZnJvbSAnLi90cmVlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDb2x1bW5DaGFuZ2VzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbHVtbi1jaGFuZ2VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgVGFibGVDb2x1bW5Qcm9wIH0gZnJvbSAnLi4vLi4vdHlwZXMvdGFibGUtY29sdW1uLnR5cGUnO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICduZ3gtZGF0YXRhYmxlLWNvbHVtbicgfSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByb3A6IFRhYmxlQ29sdW1uUHJvcDtcbiAgQElucHV0KCkgZnJvemVuTGVmdDogYW55O1xuICBASW5wdXQoKSBmcm96ZW5SaWdodDogYW55O1xuICBASW5wdXQoKSBmbGV4R3JvdzogbnVtYmVyO1xuICBASW5wdXQoKSByZXNpemVhYmxlOiBib29sZWFuO1xuICBASW5wdXQoKSBjb21wYXJhdG9yOiBhbnk7XG4gIEBJbnB1dCgpIHBpcGU6IGFueTtcbiAgQElucHV0KCkgc29ydGFibGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGRyYWdnYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgY2FuQXV0b1Jlc2l6ZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbWluV2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgd2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgbWF4V2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgY2hlY2tib3hhYmxlOiBib29sZWFuO1xuICBASW5wdXQoKSBoZWFkZXJDaGVja2JveGFibGU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGhlYWRlckNsYXNzOiBzdHJpbmcgfCAoKGRhdGE6IGFueSkgPT4gc3RyaW5nIHwgYW55KTtcbiAgQElucHV0KCkgY2VsbENsYXNzOiBzdHJpbmcgfCAoKGRhdGE6IGFueSkgPT4gc3RyaW5nIHwgYW55KTtcbiAgQElucHV0KCkgaXNUcmVlQ29sdW1uOiBib29sZWFuO1xuICBASW5wdXQoKSB0cmVlTGV2ZWxJbmRlbnQ6IG51bWJlcjtcbiAgQElucHV0KCkgc3VtbWFyeUZ1bmM6IChjZWxsczogYW55W10pID0+IGFueTtcbiAgQElucHV0KCkgc3VtbWFyeVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgnY2VsbFRlbXBsYXRlJylcbiAgX2NlbGxUZW1wbGF0ZUlucHV0OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoRGF0YVRhYmxlQ29sdW1uQ2VsbERpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIF9jZWxsVGVtcGxhdGVRdWVyeTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBnZXQgY2VsbFRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9jZWxsVGVtcGxhdGVJbnB1dCB8fCB0aGlzLl9jZWxsVGVtcGxhdGVRdWVyeTtcbiAgfVxuXG4gIEBJbnB1dCgnaGVhZGVyVGVtcGxhdGUnKVxuICBfaGVhZGVyVGVtcGxhdGVJbnB1dDogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAQ29udGVudENoaWxkKERhdGFUYWJsZUNvbHVtbkhlYWRlckRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIF9oZWFkZXJUZW1wbGF0ZVF1ZXJ5OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGdldCBoZWFkZXJUZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5faGVhZGVyVGVtcGxhdGVJbnB1dCB8fCB0aGlzLl9oZWFkZXJUZW1wbGF0ZVF1ZXJ5O1xuICB9XG5cbiAgQElucHV0KCd0cmVlVG9nZ2xlVGVtcGxhdGUnKVxuICBfdHJlZVRvZ2dsZVRlbXBsYXRlSW5wdXQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChEYXRhVGFibGVDb2x1bW5DZWxsVHJlZVRvZ2dsZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIF90cmVlVG9nZ2xlVGVtcGxhdGVRdWVyeTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBnZXQgdHJlZVRvZ2dsZVRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl90cmVlVG9nZ2xlVGVtcGxhdGVJbnB1dCB8fCB0aGlzLl90cmVlVG9nZ2xlVGVtcGxhdGVRdWVyeTtcbiAgfVxuXG4gIHByaXZhdGUgaXNGaXJzdENoYW5nZSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb2x1bW5DaGFuZ2VzU2VydmljZTogQ29sdW1uQ2hhbmdlc1NlcnZpY2UpIHt9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKHRoaXMuaXNGaXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5pc0ZpcnN0Q2hhbmdlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29sdW1uQ2hhbmdlc1NlcnZpY2Uub25JbnB1dENoYW5nZSgpO1xuICAgIH1cbiAgfVxufVxuIl19