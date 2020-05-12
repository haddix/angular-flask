import { __decorate } from "tslib";
import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableGroupHeaderTemplateDirective } from './body-group-header-template.directive';
var DatatableGroupHeaderDirective = /** @class */ (function () {
    function DatatableGroupHeaderDirective() {
        /**
         * Row height is required when virtual scroll is enabled.
         */
        this.rowHeight = 0;
        /**
         * Track toggling of group visibility
         */
        this.toggle = new EventEmitter();
    }
    Object.defineProperty(DatatableGroupHeaderDirective.prototype, "template", {
        get: function () {
            return this._templateInput || this._templateQuery;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggle the expansion of a group
     */
    DatatableGroupHeaderDirective.prototype.toggleExpandGroup = function (group) {
        this.toggle.emit({
            type: 'group',
            value: group
        });
    };
    /**
     * Expand all groups
     */
    DatatableGroupHeaderDirective.prototype.expandAllGroups = function () {
        this.toggle.emit({
            type: 'all',
            value: true
        });
    };
    /**
     * Collapse all groups
     */
    DatatableGroupHeaderDirective.prototype.collapseAllGroups = function () {
        this.toggle.emit({
            type: 'all',
            value: false
        });
    };
    __decorate([
        Input()
    ], DatatableGroupHeaderDirective.prototype, "rowHeight", void 0);
    __decorate([
        Input('template')
    ], DatatableGroupHeaderDirective.prototype, "_templateInput", void 0);
    __decorate([
        ContentChild(DatatableGroupHeaderTemplateDirective, { read: TemplateRef, static: true })
    ], DatatableGroupHeaderDirective.prototype, "_templateQuery", void 0);
    __decorate([
        Output()
    ], DatatableGroupHeaderDirective.prototype, "toggle", void 0);
    DatatableGroupHeaderDirective = __decorate([
        Directive({ selector: 'ngx-datatable-group-header' })
    ], DatatableGroupHeaderDirective);
    return DatatableGroupHeaderDirective;
}());
export { DatatableGroupHeaderDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1ncm91cC1oZWFkZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ib2R5L2JvZHktZ3JvdXAtaGVhZGVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRy9GO0lBQUE7UUFDRTs7V0FFRztRQUNNLGNBQVMsR0FBdUQsQ0FBQyxDQUFDO1FBWTNFOztXQUVHO1FBQ08sV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBK0IzRCxDQUFDO0lBdENDLHNCQUFJLG1EQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUNwRCxDQUFDOzs7T0FBQTtJQU9EOztPQUVHO0lBQ0gseURBQWlCLEdBQWpCLFVBQWtCLEtBQVU7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsdURBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILHlEQUFpQixHQUFqQjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQztJQUNMLENBQUM7SUE3Q1E7UUFBUixLQUFLLEVBQUU7b0VBQW1FO0lBRzNFO1FBREMsS0FBSyxDQUFDLFVBQVUsQ0FBQzt5RUFDZTtJQUdqQztRQURDLFlBQVksQ0FBQyxxQ0FBcUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO3lFQUN4RDtJQVN2QjtRQUFULE1BQU0sRUFBRTtpRUFBZ0Q7SUFuQjlDLDZCQUE2QjtRQUR6QyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUUsQ0FBQztPQUN6Qyw2QkFBNkIsQ0FrRHpDO0lBQUQsb0NBQUM7Q0FBQSxBQWxERCxJQWtEQztTQWxEWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIERpcmVjdGl2ZSwgVGVtcGxhdGVSZWYsIENvbnRlbnRDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YXRhYmxlR3JvdXBIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4vYm9keS1ncm91cC1oZWFkZXItdGVtcGxhdGUuZGlyZWN0aXZlJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnbmd4LWRhdGF0YWJsZS1ncm91cC1oZWFkZXInIH0pXG5leHBvcnQgY2xhc3MgRGF0YXRhYmxlR3JvdXBIZWFkZXJEaXJlY3RpdmUge1xuICAvKipcbiAgICogUm93IGhlaWdodCBpcyByZXF1aXJlZCB3aGVuIHZpcnR1YWwgc2Nyb2xsIGlzIGVuYWJsZWQuXG4gICAqL1xuICBASW5wdXQoKSByb3dIZWlnaHQ6IG51bWJlciB8ICgoZ3JvdXA/OiBhbnksIGluZGV4PzogbnVtYmVyKSA9PiBudW1iZXIpID0gMDtcblxuICBASW5wdXQoJ3RlbXBsYXRlJylcbiAgX3RlbXBsYXRlSW5wdXQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChEYXRhdGFibGVHcm91cEhlYWRlclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgX3RlbXBsYXRlUXVlcnk6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZUlucHV0IHx8IHRoaXMuX3RlbXBsYXRlUXVlcnk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgdG9nZ2xpbmcgb2YgZ3JvdXAgdmlzaWJpbGl0eVxuICAgKi9cbiAgQE91dHB1dCgpIHRvZ2dsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgZXhwYW5zaW9uIG9mIGEgZ3JvdXBcbiAgICovXG4gIHRvZ2dsZUV4cGFuZEdyb3VwKGdyb3VwOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICB2YWx1ZTogZ3JvdXBcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmQgYWxsIGdyb3Vwc1xuICAgKi9cbiAgZXhwYW5kQWxsR3JvdXBzKCk6IHZvaWQge1xuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgdHlwZTogJ2FsbCcsXG4gICAgICB2YWx1ZTogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbGxhcHNlIGFsbCBncm91cHNcbiAgICovXG4gIGNvbGxhcHNlQWxsR3JvdXBzKCk6IHZvaWQge1xuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgdHlwZTogJ2FsbCcsXG4gICAgICB2YWx1ZTogZmFsc2VcbiAgICB9KTtcbiAgfVxufVxuIl19