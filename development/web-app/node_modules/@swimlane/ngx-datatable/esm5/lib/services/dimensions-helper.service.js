import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
/**
 * Gets the width of the scrollbar.  Nesc for windows
 * http://stackoverflow.com/a/13382873/888165
 */
var DimensionsHelper = /** @class */ (function () {
    function DimensionsHelper() {
    }
    DimensionsHelper.prototype.getDimensions = function (element) {
        return element.getBoundingClientRect();
    };
    DimensionsHelper = __decorate([
        Injectable()
    ], DimensionsHelper);
    return DimensionsHelper;
}());
export { DimensionsHelper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGltZW5zaW9ucy1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2RpbWVuc2lvbnMtaGVscGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBVSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQ7OztHQUdHO0FBRUg7SUFBQTtJQUlBLENBQUM7SUFIQyx3Q0FBYSxHQUFiLFVBQWMsT0FBZ0I7UUFDNUIsT0FBTyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBSFUsZ0JBQWdCO1FBRDVCLFVBQVUsRUFBRTtPQUNBLGdCQUFnQixDQUk1QjtJQUFELHVCQUFDO0NBQUEsQUFKRCxJQUlDO1NBSlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogR2V0cyB0aGUgd2lkdGggb2YgdGhlIHNjcm9sbGJhci4gIE5lc2MgZm9yIHdpbmRvd3NcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzMzgyODczLzg4ODE2NVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGltZW5zaW9uc0hlbHBlciB7XG4gIGdldERpbWVuc2lvbnMoZWxlbWVudDogRWxlbWVudCk6IENsaWVudFJlY3Qge1xuICAgIHJldHVybiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG59XG4iXX0=