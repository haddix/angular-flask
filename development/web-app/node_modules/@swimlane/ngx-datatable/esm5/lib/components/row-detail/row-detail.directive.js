import { __decorate } from "tslib";
import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableRowDetailTemplateDirective } from './row-detail-template.directive';
var DatatableRowDetailDirective = /** @class */ (function () {
    function DatatableRowDetailDirective() {
        /**
         * The detail row height is required especially
         * when virtual scroll is enabled.
         */
        this.rowHeight = 0;
        /**
         * Row detail row visbility was toggled.
         */
        this.toggle = new EventEmitter();
    }
    Object.defineProperty(DatatableRowDetailDirective.prototype, "template", {
        get: function () {
            return this._templateInput || this._templateQuery;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggle the expansion of the row
     */
    DatatableRowDetailDirective.prototype.toggleExpandRow = function (row) {
        this.toggle.emit({
            type: 'row',
            value: row
        });
    };
    /**
     * API method to expand all the rows.
     */
    DatatableRowDetailDirective.prototype.expandAllRows = function () {
        this.toggle.emit({
            type: 'all',
            value: true
        });
    };
    /**
     * API method to collapse all the rows.
     */
    DatatableRowDetailDirective.prototype.collapseAllRows = function () {
        this.toggle.emit({
            type: 'all',
            value: false
        });
    };
    __decorate([
        Input()
    ], DatatableRowDetailDirective.prototype, "rowHeight", void 0);
    __decorate([
        Input('template')
    ], DatatableRowDetailDirective.prototype, "_templateInput", void 0);
    __decorate([
        ContentChild(DatatableRowDetailTemplateDirective, { read: TemplateRef, static: true })
    ], DatatableRowDetailDirective.prototype, "_templateQuery", void 0);
    __decorate([
        Output()
    ], DatatableRowDetailDirective.prototype, "toggle", void 0);
    DatatableRowDetailDirective = __decorate([
        Directive({ selector: 'ngx-datatable-row-detail' })
    ], DatatableRowDetailDirective);
    return DatatableRowDetailDirective;
}());
export { DatatableRowDetailDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWRldGFpbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3Jvdy1kZXRhaWwvcm93LWRldGFpbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUd0RjtJQUFBO1FBQ0U7OztXQUdHO1FBQ00sY0FBUyxHQUFxRCxDQUFDLENBQUM7UUFZekU7O1dBRUc7UUFDTyxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUErQjNELENBQUM7SUF0Q0Msc0JBQUksaURBQVE7YUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3BELENBQUM7OztPQUFBO0lBT0Q7O09BRUc7SUFDSCxxREFBZSxHQUFmLFVBQWdCLEdBQVE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxHQUFHO1NBQ1gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsbURBQWEsR0FBYjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILHFEQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0lBN0NRO1FBQVIsS0FBSyxFQUFFO2tFQUFpRTtJQUd6RTtRQURDLEtBQUssQ0FBQyxVQUFVLENBQUM7dUVBQ2U7SUFHakM7UUFEQyxZQUFZLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQzt1RUFDdEQ7SUFTdkI7UUFBVCxNQUFNLEVBQUU7K0RBQWdEO0lBcEI5QywyQkFBMkI7UUFEdkMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLDBCQUEwQixFQUFFLENBQUM7T0FDdkMsMkJBQTJCLENBbUR2QztJQUFELGtDQUFDO0NBQUEsQUFuREQsSUFtREM7U0FuRFksMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBEaXJlY3RpdmUsIFRlbXBsYXRlUmVmLCBDb250ZW50Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGF0YWJsZVJvd0RldGFpbFRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSAnLi9yb3ctZGV0YWlsLXRlbXBsYXRlLmRpcmVjdGl2ZSc7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ25neC1kYXRhdGFibGUtcm93LWRldGFpbCcgfSlcbmV4cG9ydCBjbGFzcyBEYXRhdGFibGVSb3dEZXRhaWxEaXJlY3RpdmUge1xuICAvKipcbiAgICogVGhlIGRldGFpbCByb3cgaGVpZ2h0IGlzIHJlcXVpcmVkIGVzcGVjaWFsbHlcbiAgICogd2hlbiB2aXJ0dWFsIHNjcm9sbCBpcyBlbmFibGVkLlxuICAgKi9cbiAgQElucHV0KCkgcm93SGVpZ2h0OiBudW1iZXIgfCAoKHJvdz86IGFueSwgaW5kZXg/OiBudW1iZXIpID0+IG51bWJlcikgPSAwO1xuXG4gIEBJbnB1dCgndGVtcGxhdGUnKVxuICBfdGVtcGxhdGVJbnB1dDogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAQ29udGVudENoaWxkKERhdGF0YWJsZVJvd0RldGFpbFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgX3RlbXBsYXRlUXVlcnk6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZUlucHV0IHx8IHRoaXMuX3RlbXBsYXRlUXVlcnk7XG4gIH1cblxuICAvKipcbiAgICogUm93IGRldGFpbCByb3cgdmlzYmlsaXR5IHdhcyB0b2dnbGVkLlxuICAgKi9cbiAgQE91dHB1dCgpIHRvZ2dsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgZXhwYW5zaW9uIG9mIHRoZSByb3dcbiAgICovXG4gIHRvZ2dsZUV4cGFuZFJvdyhyb3c6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgdHlwZTogJ3JvdycsXG4gICAgICB2YWx1ZTogcm93XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIG1ldGhvZCB0byBleHBhbmQgYWxsIHRoZSByb3dzLlxuICAgKi9cbiAgZXhwYW5kQWxsUm93cygpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgdmFsdWU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgbWV0aG9kIHRvIGNvbGxhcHNlIGFsbCB0aGUgcm93cy5cbiAgICovXG4gIGNvbGxhcHNlQWxsUm93cygpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==