import { __decorate } from "tslib";
import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableGroupHeaderTemplateDirective } from './body-group-header-template.directive';
let DatatableGroupHeaderDirective = class DatatableGroupHeaderDirective {
    constructor() {
        /**
         * Row height is required when virtual scroll is enabled.
         */
        this.rowHeight = 0;
        /**
         * Track toggling of group visibility
         */
        this.toggle = new EventEmitter();
    }
    get template() {
        return this._templateInput || this._templateQuery;
    }
    /**
     * Toggle the expansion of a group
     */
    toggleExpandGroup(group) {
        this.toggle.emit({
            type: 'group',
            value: group
        });
    }
    /**
     * Expand all groups
     */
    expandAllGroups() {
        this.toggle.emit({
            type: 'all',
            value: true
        });
    }
    /**
     * Collapse all groups
     */
    collapseAllGroups() {
        this.toggle.emit({
            type: 'all',
            value: false
        });
    }
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
export { DatatableGroupHeaderDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1ncm91cC1oZWFkZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ib2R5L2JvZHktZ3JvdXAtaGVhZGVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRy9GLElBQWEsNkJBQTZCLEdBQTFDLE1BQWEsNkJBQTZCO0lBQTFDO1FBQ0U7O1dBRUc7UUFDTSxjQUFTLEdBQXVELENBQUMsQ0FBQztRQVkzRTs7V0FFRztRQUNPLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQStCM0QsQ0FBQztJQXRDQyxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUNwRCxDQUFDO0lBT0Q7O09BRUc7SUFDSCxpQkFBaUIsQ0FBQyxLQUFVO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFLE9BQU87WUFDYixLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILGVBQWU7UUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQkFBaUI7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQTtBQTlDVTtJQUFSLEtBQUssRUFBRTtnRUFBbUU7QUFHM0U7SUFEQyxLQUFLLENBQUMsVUFBVSxDQUFDO3FFQUNlO0FBR2pDO0lBREMsWUFBWSxDQUFDLHFDQUFxQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7cUVBQ3hEO0FBU3ZCO0lBQVQsTUFBTSxFQUFFOzZEQUFnRDtBQW5COUMsNkJBQTZCO0lBRHpDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0dBQ3pDLDZCQUE2QixDQWtEekM7U0FsRFksNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBEaXJlY3RpdmUsIFRlbXBsYXRlUmVmLCBDb250ZW50Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGF0YWJsZUdyb3VwSGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tICcuL2JvZHktZ3JvdXAtaGVhZGVyLXRlbXBsYXRlLmRpcmVjdGl2ZSc7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ25neC1kYXRhdGFibGUtZ3JvdXAtaGVhZGVyJyB9KVxuZXhwb3J0IGNsYXNzIERhdGF0YWJsZUdyb3VwSGVhZGVyRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIFJvdyBoZWlnaHQgaXMgcmVxdWlyZWQgd2hlbiB2aXJ0dWFsIHNjcm9sbCBpcyBlbmFibGVkLlxuICAgKi9cbiAgQElucHV0KCkgcm93SGVpZ2h0OiBudW1iZXIgfCAoKGdyb3VwPzogYW55LCBpbmRleD86IG51bWJlcikgPT4gbnVtYmVyKSA9IDA7XG5cbiAgQElucHV0KCd0ZW1wbGF0ZScpXG4gIF90ZW1wbGF0ZUlucHV0OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoRGF0YXRhYmxlR3JvdXBIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIF90ZW1wbGF0ZVF1ZXJ5OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVJbnB1dCB8fCB0aGlzLl90ZW1wbGF0ZVF1ZXJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIHRvZ2dsaW5nIG9mIGdyb3VwIHZpc2liaWxpdHlcbiAgICovXG4gIEBPdXRwdXQoKSB0b2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIGV4cGFuc2lvbiBvZiBhIGdyb3VwXG4gICAqL1xuICB0b2dnbGVFeHBhbmRHcm91cChncm91cDogYW55KTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGUuZW1pdCh7XG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgdmFsdWU6IGdyb3VwXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhwYW5kIGFsbCBncm91cHNcbiAgICovXG4gIGV4cGFuZEFsbEdyb3VwcygpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgdmFsdWU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsYXBzZSBhbGwgZ3JvdXBzXG4gICAqL1xuICBjb2xsYXBzZUFsbEdyb3VwcygpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==