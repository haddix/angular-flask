import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * service to make DatatableComponent aware of changes to
 * input bindings of DataTableColumnDirective
 */
var ColumnChangesService = /** @class */ (function () {
    function ColumnChangesService() {
        this.columnInputChanges = new Subject();
    }
    Object.defineProperty(ColumnChangesService.prototype, "columnInputChanges$", {
        get: function () {
            return this.columnInputChanges.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ColumnChangesService.prototype.onInputChange = function () {
        this.columnInputChanges.next();
    };
    ColumnChangesService = __decorate([
        Injectable()
    ], ColumnChangesService);
    return ColumnChangesService;
}());
export { ColumnChangesService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLWNoYW5nZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2NvbHVtbi1jaGFuZ2VzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUzQzs7O0dBR0c7QUFFSDtJQUFBO1FBQ1UsdUJBQWtCLEdBQUcsSUFBSSxPQUFPLEVBQWEsQ0FBQztJQVN4RCxDQUFDO0lBUEMsc0JBQUkscURBQW1CO2FBQXZCO1lBQ0UsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDaEQsQ0FBQzs7O09BQUE7SUFFRCw0Q0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFUVSxvQkFBb0I7UUFEaEMsVUFBVSxFQUFFO09BQ0Esb0JBQW9CLENBVWhDO0lBQUQsMkJBQUM7Q0FBQSxBQVZELElBVUM7U0FWWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBzZXJ2aWNlIHRvIG1ha2UgRGF0YXRhYmxlQ29tcG9uZW50IGF3YXJlIG9mIGNoYW5nZXMgdG9cbiAqIGlucHV0IGJpbmRpbmdzIG9mIERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29sdW1uQ2hhbmdlc1NlcnZpY2Uge1xuICBwcml2YXRlIGNvbHVtbklucHV0Q2hhbmdlcyA9IG5ldyBTdWJqZWN0PHVuZGVmaW5lZD4oKTtcblxuICBnZXQgY29sdW1uSW5wdXRDaGFuZ2VzJCgpOiBPYnNlcnZhYmxlPHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbklucHV0Q2hhbmdlcy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIG9uSW5wdXRDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5JbnB1dENoYW5nZXMubmV4dCgpO1xuICB9XG59XG4iXX0=