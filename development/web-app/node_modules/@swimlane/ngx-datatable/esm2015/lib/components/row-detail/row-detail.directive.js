import { __decorate } from "tslib";
import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableRowDetailTemplateDirective } from './row-detail-template.directive';
let DatatableRowDetailDirective = class DatatableRowDetailDirective {
    constructor() {
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
    get template() {
        return this._templateInput || this._templateQuery;
    }
    /**
     * Toggle the expansion of the row
     */
    toggleExpandRow(row) {
        this.toggle.emit({
            type: 'row',
            value: row
        });
    }
    /**
     * API method to expand all the rows.
     */
    expandAllRows() {
        this.toggle.emit({
            type: 'all',
            value: true
        });
    }
    /**
     * API method to collapse all the rows.
     */
    collapseAllRows() {
        this.toggle.emit({
            type: 'all',
            value: false
        });
    }
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
export { DatatableRowDetailDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWRldGFpbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3Jvdy1kZXRhaWwvcm93LWRldGFpbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUd0RixJQUFhLDJCQUEyQixHQUF4QyxNQUFhLDJCQUEyQjtJQUF4QztRQUNFOzs7V0FHRztRQUNNLGNBQVMsR0FBcUQsQ0FBQyxDQUFDO1FBWXpFOztXQUVHO1FBQ08sV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBK0IzRCxDQUFDO0lBdENDLElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ3BELENBQUM7SUFPRDs7T0FFRztJQUNILGVBQWUsQ0FBQyxHQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsR0FBRztTQUNYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILGFBQWE7UUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxlQUFlO1FBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUE7QUE5Q1U7SUFBUixLQUFLLEVBQUU7OERBQWlFO0FBR3pFO0lBREMsS0FBSyxDQUFDLFVBQVUsQ0FBQzttRUFDZTtBQUdqQztJQURDLFlBQVksQ0FBQyxtQ0FBbUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO21FQUN0RDtBQVN2QjtJQUFULE1BQU0sRUFBRTsyREFBZ0Q7QUFwQjlDLDJCQUEyQjtJQUR2QyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQztHQUN2QywyQkFBMkIsQ0FtRHZDO1NBbkRZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgRGlyZWN0aXZlLCBUZW1wbGF0ZVJlZiwgQ29udGVudENoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRhdGFibGVSb3dEZXRhaWxUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4vcm93LWRldGFpbC10ZW1wbGF0ZS5kaXJlY3RpdmUnO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICduZ3gtZGF0YXRhYmxlLXJvdy1kZXRhaWwnIH0pXG5leHBvcnQgY2xhc3MgRGF0YXRhYmxlUm93RGV0YWlsRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIFRoZSBkZXRhaWwgcm93IGhlaWdodCBpcyByZXF1aXJlZCBlc3BlY2lhbGx5XG4gICAqIHdoZW4gdmlydHVhbCBzY3JvbGwgaXMgZW5hYmxlZC5cbiAgICovXG4gIEBJbnB1dCgpIHJvd0hlaWdodDogbnVtYmVyIHwgKChyb3c/OiBhbnksIGluZGV4PzogbnVtYmVyKSA9PiBudW1iZXIpID0gMDtcblxuICBASW5wdXQoJ3RlbXBsYXRlJylcbiAgX3RlbXBsYXRlSW5wdXQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChEYXRhdGFibGVSb3dEZXRhaWxUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIF90ZW1wbGF0ZVF1ZXJ5OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVJbnB1dCB8fCB0aGlzLl90ZW1wbGF0ZVF1ZXJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFJvdyBkZXRhaWwgcm93IHZpc2JpbGl0eSB3YXMgdG9nZ2xlZC5cbiAgICovXG4gIEBPdXRwdXQoKSB0b2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIGV4cGFuc2lvbiBvZiB0aGUgcm93XG4gICAqL1xuICB0b2dnbGVFeHBhbmRSb3cocm93OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdyb3cnLFxuICAgICAgdmFsdWU6IHJvd1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSBtZXRob2QgdG8gZXhwYW5kIGFsbCB0aGUgcm93cy5cbiAgICovXG4gIGV4cGFuZEFsbFJvd3MoKTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGUuZW1pdCh7XG4gICAgICB0eXBlOiAnYWxsJyxcbiAgICAgIHZhbHVlOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIG1ldGhvZCB0byBjb2xsYXBzZSBhbGwgdGhlIHJvd3MuXG4gICAqL1xuICBjb2xsYXBzZUFsbFJvd3MoKTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGUuZW1pdCh7XG4gICAgICB0eXBlOiAnYWxsJyxcbiAgICAgIHZhbHVlOiBmYWxzZVxuICAgIH0pO1xuICB9XG59XG4iXX0=