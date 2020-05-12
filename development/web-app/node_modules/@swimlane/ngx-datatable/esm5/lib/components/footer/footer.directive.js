import { __decorate } from "tslib";
import { Input, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DataTableFooterTemplateDirective } from './footer-template.directive';
var DatatableFooterDirective = /** @class */ (function () {
    function DatatableFooterDirective() {
    }
    Object.defineProperty(DatatableFooterDirective.prototype, "template", {
        get: function () {
            return this._templateInput || this._templateQuery;
        },
        enumerable: true,
        configurable: true
    });
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
    return DatatableFooterDirective;
}());
export { DatatableFooterDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHL0U7SUFBQTtJQWtCQSxDQUFDO0lBSEMsc0JBQUksOENBQVE7YUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3BELENBQUM7OztPQUFBO0lBaEJRO1FBQVIsS0FBSyxFQUFFO2tFQUFzQjtJQUNyQjtRQUFSLEtBQUssRUFBRTtrRUFBc0I7SUFDckI7UUFBUixLQUFLLEVBQUU7cUVBQW1DO0lBQ2xDO1FBQVIsS0FBSyxFQUFFO3dFQUE0QjtJQUMzQjtRQUFSLEtBQUssRUFBRTt5RUFBNkI7SUFDNUI7UUFBUixLQUFLLEVBQUU7dUVBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFO21FQUF1QjtJQUcvQjtRQURDLEtBQUssQ0FBQyxVQUFVLENBQUM7b0VBQ2U7SUFHakM7UUFEQyxZQUFZLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7b0VBQ3JDO0lBYnRCLHdCQUF3QjtRQURwQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQztPQUNuQyx3QkFBd0IsQ0FrQnBDO0lBQUQsK0JBQUM7Q0FBQSxBQWxCRCxJQWtCQztTQWxCWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgRGlyZWN0aXZlLCBUZW1wbGF0ZVJlZiwgQ29udGVudENoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVGb290ZXJUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4vZm9vdGVyLXRlbXBsYXRlLmRpcmVjdGl2ZSc7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ25neC1kYXRhdGFibGUtZm9vdGVyJyB9KVxuZXhwb3J0IGNsYXNzIERhdGF0YWJsZUZvb3RlckRpcmVjdGl2ZSB7XG4gIEBJbnB1dCgpIGZvb3RlckhlaWdodDogbnVtYmVyO1xuICBASW5wdXQoKSB0b3RhbE1lc3NhZ2U6IHN0cmluZztcbiAgQElucHV0KCkgc2VsZWN0ZWRNZXNzYWdlOiBzdHJpbmcgfCBib29sZWFuO1xuICBASW5wdXQoKSBwYWdlckxlZnRBcnJvd0ljb246IHN0cmluZztcbiAgQElucHV0KCkgcGFnZXJSaWdodEFycm93SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBwYWdlclByZXZpb3VzSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBwYWdlck5leHRJY29uOiBzdHJpbmc7XG5cbiAgQElucHV0KCd0ZW1wbGF0ZScpXG4gIF90ZW1wbGF0ZUlucHV0OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoRGF0YVRhYmxlRm9vdGVyVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgX3RlbXBsYXRlUXVlcnk6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZUlucHV0IHx8IHRoaXMuX3RlbXBsYXRlUXVlcnk7XG4gIH1cbn1cbiJdfQ==