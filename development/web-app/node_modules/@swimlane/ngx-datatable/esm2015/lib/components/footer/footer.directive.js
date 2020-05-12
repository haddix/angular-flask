import { __decorate } from "tslib";
import { Input, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DataTableFooterTemplateDirective } from './footer-template.directive';
let DatatableFooterDirective = class DatatableFooterDirective {
    get template() {
        return this._templateInput || this._templateQuery;
    }
};
__decorate([
    Input()
], DatatableFooterDirective.prototype, "footerHeight", void 0);
__decorate([
    Input()
], DatatableFooterDirective.prototype, "totalMessage", void 0);
__decorate([
    Input()
], DatatableFooterDirective.prototype, "selectedMessage", void 0);
__decorate([
    Input()
], DatatableFooterDirective.prototype, "pagerLeftArrowIcon", void 0);
__decorate([
    Input()
], DatatableFooterDirective.prototype, "pagerRightArrowIcon", void 0);
__decorate([
    Input()
], DatatableFooterDirective.prototype, "pagerPreviousIcon", void 0);
__decorate([
    Input()
], DatatableFooterDirective.prototype, "pagerNextIcon", void 0);
__decorate([
    Input('template')
], DatatableFooterDirective.prototype, "_templateInput", void 0);
__decorate([
    ContentChild(DataTableFooterTemplateDirective, { read: TemplateRef })
], DatatableFooterDirective.prototype, "_templateQuery", void 0);
DatatableFooterDirective = __decorate([
    Directive({ selector: 'ngx-datatable-footer' })
], DatatableFooterDirective);
export { DatatableFooterDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHL0UsSUFBYSx3QkFBd0IsR0FBckMsTUFBYSx3QkFBd0I7SUFlbkMsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDcEQsQ0FBQztDQUNGLENBQUE7QUFqQlU7SUFBUixLQUFLLEVBQUU7OERBQXNCO0FBQ3JCO0lBQVIsS0FBSyxFQUFFOzhEQUFzQjtBQUNyQjtJQUFSLEtBQUssRUFBRTtpRUFBbUM7QUFDbEM7SUFBUixLQUFLLEVBQUU7b0VBQTRCO0FBQzNCO0lBQVIsS0FBSyxFQUFFO3FFQUE2QjtBQUM1QjtJQUFSLEtBQUssRUFBRTttRUFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7K0RBQXVCO0FBRy9CO0lBREMsS0FBSyxDQUFDLFVBQVUsQ0FBQztnRUFDZTtBQUdqQztJQURDLFlBQVksQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQztnRUFDckM7QUFidEIsd0JBQXdCO0lBRHBDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxDQUFDO0dBQ25DLHdCQUF3QixDQWtCcEM7U0FsQlksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5wdXQsIERpcmVjdGl2ZSwgVGVtcGxhdGVSZWYsIENvbnRlbnRDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YVRhYmxlRm9vdGVyVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tICcuL2Zvb3Rlci10ZW1wbGF0ZS5kaXJlY3RpdmUnO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICduZ3gtZGF0YXRhYmxlLWZvb3RlcicgfSlcbmV4cG9ydCBjbGFzcyBEYXRhdGFibGVGb290ZXJEaXJlY3RpdmUge1xuICBASW5wdXQoKSBmb290ZXJIZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgdG90YWxNZXNzYWdlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNlbGVjdGVkTWVzc2FnZTogc3RyaW5nIHwgYm9vbGVhbjtcbiAgQElucHV0KCkgcGFnZXJMZWZ0QXJyb3dJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBhZ2VyUmlnaHRBcnJvd0ljb246IHN0cmluZztcbiAgQElucHV0KCkgcGFnZXJQcmV2aW91c0ljb246IHN0cmluZztcbiAgQElucHV0KCkgcGFnZXJOZXh0SWNvbjogc3RyaW5nO1xuXG4gIEBJbnB1dCgndGVtcGxhdGUnKVxuICBfdGVtcGxhdGVJbnB1dDogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAQ29udGVudENoaWxkKERhdGFUYWJsZUZvb3RlclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIF90ZW1wbGF0ZVF1ZXJ5OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVJbnB1dCB8fCB0aGlzLl90ZW1wbGF0ZVF1ZXJ5O1xuICB9XG59XG4iXX0=