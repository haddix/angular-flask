import { __decorate } from "tslib";
import { Directive, Output, EventEmitter, ElementRef, HostBinding, NgZone, OnInit, OnDestroy } from '@angular/core';
/**
 * Visibility Observer Directive
 *
 * Usage:
 *
 * 		<div
 * 			visibilityObserver
 * 			(visible)="onVisible($event)">
 * 		</div>
 *
 */
var VisibilityDirective = /** @class */ (function () {
    function VisibilityDirective(element, zone) {
        this.element = element;
        this.zone = zone;
        this.isVisible = false;
        this.visible = new EventEmitter();
    }
    VisibilityDirective.prototype.ngOnInit = function () {
        this.runCheck();
    };
    VisibilityDirective.prototype.ngOnDestroy = function () {
        clearTimeout(this.timeout);
    };
    VisibilityDirective.prototype.onVisibilityChange = function () {
        var _this = this;
        // trigger zone recalc for columns
        this.zone.run(function () {
            _this.isVisible = true;
            _this.visible.emit(true);
        });
    };
    VisibilityDirective.prototype.runCheck = function () {
        var _this = this;
        var check = function () {
            // https://davidwalsh.name/offsetheight-visibility
            var _a = _this.element.nativeElement, offsetHeight = _a.offsetHeight, offsetWidth = _a.offsetWidth;
            if (offsetHeight && offsetWidth) {
                clearTimeout(_this.timeout);
                _this.onVisibilityChange();
            }
            else {
                clearTimeout(_this.timeout);
                _this.zone.runOutsideAngular(function () {
                    _this.timeout = setTimeout(function () { return check(); }, 50);
                });
            }
        };
        this.timeout = setTimeout(function () { return check(); });
    };
    VisibilityDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
    __decorate([
        HostBinding('class.visible')
    ], VisibilityDirective.prototype, "isVisible", void 0);
    __decorate([
        Output()
    ], VisibilityDirective.prototype, "visible", void 0);
    VisibilityDirective = __decorate([
        Directive({ selector: '[visibilityObserver]' })
    ], VisibilityDirective);
    return VisibilityDirective;
}());
export { VisibilityDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaWJpbGl0eS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL3Zpc2liaWxpdHkuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVwSDs7Ozs7Ozs7OztHQVVHO0FBRUg7SUFRRSw2QkFBb0IsT0FBbUIsRUFBVSxJQUFZO1FBQXpDLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBTjdELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFFakIsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBSU0sQ0FBQztJQUVqRSxzQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCx5Q0FBVyxHQUFYO1FBQ0UsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0RBQWtCLEdBQWxCO1FBQUEsaUJBTUM7UUFMQyxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDWixLQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxzQ0FBUSxHQUFSO1FBQUEsaUJBaUJDO1FBaEJDLElBQU0sS0FBSyxHQUFHO1lBQ1osa0RBQWtEO1lBQzVDLElBQUEsZ0NBQTBELEVBQXhELDhCQUFZLEVBQUUsNEJBQTBDLENBQUM7WUFFakUsSUFBSSxZQUFZLElBQUksV0FBVyxFQUFFO2dCQUMvQixZQUFZLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQixLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUMzQjtpQkFBTTtnQkFDTCxZQUFZLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQixLQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO29CQUMxQixLQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxjQUFNLE9BQUEsS0FBSyxFQUFFLEVBQVAsQ0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsY0FBTSxPQUFBLEtBQUssRUFBRSxFQUFQLENBQU8sQ0FBQyxDQUFDO0lBQzNDLENBQUM7O2dCQW5DNEIsVUFBVTtnQkFBZ0IsTUFBTTs7SUFON0Q7UUFEQyxXQUFXLENBQUMsZUFBZSxDQUFDOzBEQUNGO0lBRWpCO1FBQVQsTUFBTSxFQUFFO3dEQUFpRDtJQUovQyxtQkFBbUI7UUFEL0IsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLENBQUM7T0FDbkMsbUJBQW1CLENBNEMvQjtJQUFELDBCQUFDO0NBQUEsQUE1Q0QsSUE0Q0M7U0E1Q1ksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIE5nWm9uZSwgT25Jbml0LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBWaXNpYmlsaXR5IE9ic2VydmVyIERpcmVjdGl2ZVxuICpcbiAqIFVzYWdlOlxuICpcbiAqIFx0XHQ8ZGl2XG4gKiBcdFx0XHR2aXNpYmlsaXR5T2JzZXJ2ZXJcbiAqIFx0XHRcdCh2aXNpYmxlKT1cIm9uVmlzaWJsZSgkZXZlbnQpXCI+XG4gKiBcdFx0PC9kaXY+XG4gKlxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbdmlzaWJpbGl0eU9ic2VydmVyXScgfSlcbmV4cG9ydCBjbGFzcyBWaXNpYmlsaXR5RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnZpc2libGUnKVxuICBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgdmlzaWJsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgdGltZW91dDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5ydW5DaGVjaygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gIH1cblxuICBvblZpc2liaWxpdHlDaGFuZ2UoKTogdm9pZCB7XG4gICAgLy8gdHJpZ2dlciB6b25lIHJlY2FsYyBmb3IgY29sdW1uc1xuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgdGhpcy52aXNpYmxlLmVtaXQodHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBydW5DaGVjaygpOiB2b2lkIHtcbiAgICBjb25zdCBjaGVjayA9ICgpID0+IHtcbiAgICAgIC8vIGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL29mZnNldGhlaWdodC12aXNpYmlsaXR5XG4gICAgICBjb25zdCB7IG9mZnNldEhlaWdodCwgb2Zmc2V0V2lkdGggfSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgICBpZiAob2Zmc2V0SGVpZ2h0ICYmIG9mZnNldFdpZHRoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICB0aGlzLm9uVmlzaWJpbGl0eUNoYW5nZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiBjaGVjaygpLCA1MCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGNoZWNrKCkpO1xuICB9XG59XG4iXX0=