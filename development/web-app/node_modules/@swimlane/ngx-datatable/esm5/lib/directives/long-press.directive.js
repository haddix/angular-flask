import { __decorate } from "tslib";
import { Directive, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
var LongPressDirective = /** @class */ (function () {
    function LongPressDirective() {
        this.pressEnabled = true;
        this.duration = 500;
        this.longPressStart = new EventEmitter();
        this.longPressing = new EventEmitter();
        this.longPressEnd = new EventEmitter();
        this.mouseX = 0;
        this.mouseY = 0;
    }
    Object.defineProperty(LongPressDirective.prototype, "press", {
        get: function () {
            return this.pressing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LongPressDirective.prototype, "isLongPress", {
        get: function () {
            return this.isLongPressing;
        },
        enumerable: true,
        configurable: true
    });
    LongPressDirective.prototype.onMouseDown = function (event) {
        var _this = this;
        // don't do right/middle clicks
        if (event.which !== 1 || !this.pressEnabled)
            return;
        // don't start drag if its on resize handle
        var target = event.target;
        if (target.classList.contains('resize-handle'))
            return;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.pressing = true;
        this.isLongPressing = false;
        var mouseup = fromEvent(document, 'mouseup');
        this.subscription = mouseup.subscribe(function (ev) { return _this.onMouseup(); });
        this.timeout = setTimeout(function () {
            _this.isLongPressing = true;
            _this.longPressStart.emit({
                event: event,
                model: _this.pressModel
            });
            _this.subscription.add(fromEvent(document, 'mousemove')
                .pipe(takeUntil(mouseup))
                .subscribe(function (mouseEvent) { return _this.onMouseMove(mouseEvent); }));
            _this.loop(event);
        }, this.duration);
        this.loop(event);
    };
    LongPressDirective.prototype.onMouseMove = function (event) {
        if (this.pressing && !this.isLongPressing) {
            var xThres = Math.abs(event.clientX - this.mouseX) > 10;
            var yThres = Math.abs(event.clientY - this.mouseY) > 10;
            if (xThres || yThres) {
                this.endPress();
            }
        }
    };
    LongPressDirective.prototype.loop = function (event) {
        var _this = this;
        if (this.isLongPressing) {
            this.timeout = setTimeout(function () {
                _this.longPressing.emit({
                    event: event,
                    model: _this.pressModel
                });
                _this.loop(event);
            }, 50);
        }
    };
    LongPressDirective.prototype.endPress = function () {
        clearTimeout(this.timeout);
        this.isLongPressing = false;
        this.pressing = false;
        this._destroySubscription();
        this.longPressEnd.emit({
            model: this.pressModel
        });
    };
    LongPressDirective.prototype.onMouseup = function () {
        this.endPress();
    };
    LongPressDirective.prototype.ngOnDestroy = function () {
        this._destroySubscription();
    };
    LongPressDirective.prototype._destroySubscription = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    };
    __decorate([
        Input()
    ], LongPressDirective.prototype, "pressEnabled", void 0);
    __decorate([
        Input()
    ], LongPressDirective.prototype, "pressModel", void 0);
    __decorate([
        Input()
    ], LongPressDirective.prototype, "duration", void 0);
    __decorate([
        Output()
    ], LongPressDirective.prototype, "longPressStart", void 0);
    __decorate([
        Output()
    ], LongPressDirective.prototype, "longPressing", void 0);
    __decorate([
        Output()
    ], LongPressDirective.prototype, "longPressEnd", void 0);
    __decorate([
        HostBinding('class.press')
    ], LongPressDirective.prototype, "press", null);
    __decorate([
        HostBinding('class.longpress')
    ], LongPressDirective.prototype, "isLongPress", null);
    __decorate([
        HostListener('mousedown', ['$event'])
    ], LongPressDirective.prototype, "onMouseDown", null);
    LongPressDirective = __decorate([
        Directive({ selector: '[long-press]' })
    ], LongPressDirective);
    return LongPressDirective;
}());
export { LongPressDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9uZy1wcmVzcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL2xvbmctcHJlc3MuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDN0csT0FBTyxFQUE0QixTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTNDO0lBQUE7UUFDVyxpQkFBWSxHQUFZLElBQUksQ0FBQztRQUU3QixhQUFRLEdBQVcsR0FBRyxDQUFDO1FBRXRCLG1CQUFjLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdkQsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRCxpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBSy9ELFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsV0FBTSxHQUFXLENBQUMsQ0FBQztJQW1HckIsQ0FBQztJQTlGQyxzQkFBSSxxQ0FBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7OztPQUFBO0lBR0Qsc0JBQUksMkNBQVc7YUFBZjtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QixDQUFDOzs7T0FBQTtJQUdELHdDQUFXLEdBQVgsVUFBWSxLQUFpQjtRQUQ3QixpQkFtQ0M7UUFqQ0MsK0JBQStCO1FBQy9CLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUFFLE9BQU87UUFFcEQsMkNBQTJDO1FBQzNDLElBQU0sTUFBTSxHQUFnQixLQUFLLENBQUMsTUFBTSxD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QUNMLENBQUM7SUFFRCxzQ0FBUyxHQUFUO1FBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCx3Q0FBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVPLGlEQUFvQixHQUE1QjtRQUNFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQTlHUTtRQUFSLEtBQUssRUFBRTs0REFBOEI7SUFDN0I7UUFBUixLQUFLLEVBQUU7MERBQWlCO0lBQ2hCO1FBQVIsS0FBSyxFQUFFO3dEQUF3QjtJQUV0QjtRQUFULE1BQU0sRUFBRTs4REFBd0Q7SUFDdkQ7UUFBVCxNQUFNLEVBQUU7NERBQXNEO0lBQ3JEO1FBQVQsTUFBTSxFQUFFOzREQUFzRDtJQVcvRDtRQURDLFdBQVcsQ0FBQyxhQUFhLENBQUM7bURBRzFCO0lBR0Q7UUFEQyxXQUFXLENBQUMsaUJBQWlCLENBQUM7eURBRzlCO0lBR0Q7UUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7eURBbUNyQztJQTlEVSxrQkFBa0I7UUFEOUIsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDO09BQzNCLGtCQUFrQixDQWdIOUI7SUFBRCx5QkFBQztDQUFBLEFBaEhELElBZ0hDO1NBaEhZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBNb3VzZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnRzJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2xvbmctcHJlc3NdJyB9KVxuZXhwb3J0IGNsYXNzIExvbmdQcmVzc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIHByZXNzRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHByZXNzTW9kZWw6IGFueTtcbiAgQElucHV0KCkgZHVyYXRpb246IG51bWJlciA9IDUwMDtcblxuICBAT3V0cHV0KCkgbG9uZ1ByZXNzU3RhcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgbG9uZ1ByZXNzaW5nOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGxvbmdQcmVzc0VuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJlc3Npbmc6IGJvb2xlYW47XG4gIGlzTG9uZ1ByZXNzaW5nOiBib29sZWFuO1xuICB0aW1lb3V0OiBhbnk7XG4gIG1vdXNlWDogbnVtYmVyID0gMDtcbiAgbW91c2VZOiBudW1iZXIgPSAwO1xuXG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucHJlc3MnKVxuICBnZXQgcHJlc3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucHJlc3Npbmc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmxvbmdwcmVzcycpXG4gIGdldCBpc0xvbmdQcmVzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc0xvbmdQcmVzc2luZztcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgLy8gZG9uJ3QgZG8gcmlnaHQvbWlkZGxlIGNsaWNrc1xuICAgIGlmIChldmVudC53aGljaCAhPT0gMSB8fCAhdGhpcy5wcmVzc0VuYWJsZWQpIHJldHVybjtcblxuICAgIC8vIGRvbid0IHN0YXJ0IGRyYWcgaWYgaXRzIG9uIHJlc2l6ZSBoYW5kbGVcbiAgICBjb25zdCB0YXJnZXQgPSA8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXNpemUtaGFuZGxlJykpIHJldHVybjtcblxuICAgIHRoaXMubW91c2VYID0gZXZlbnQuY2xpZW50WDtcbiAgICB0aGlzLm1vdXNlWSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICB0aGlzLnByZXNzaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmlzTG9uZ1ByZXNzaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBtb3VzZXVwID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbW91c2V1cC5zdWJzY3JpYmUoKGV2OiBNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2V1cCgpKTtcblxuICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pc0xvbmdQcmVzc2luZyA9IHRydWU7XG4gICAgICB0aGlzLmxvbmdQcmVzc1N0YXJ0LmVtaXQoe1xuICAgICAgICBldmVudCxcbiAgICAgICAgbW9kZWw6IHRoaXMucHJlc3NNb2RlbFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2Vtb3ZlJylcbiAgICAgICAgICAucGlwZSh0YWtlVW50aWwobW91c2V1cCkpXG4gICAgICAgICAgLnN1YnNjcmliZSgobW91c2VFdmVudDogTW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlTW92ZShtb3VzZUV2ZW50KSlcbiAgICAgICk7XG5cbiAgICAgIHRoaXMubG9vcChldmVudCk7XG4gICAgfSwgdGhpcy5kdXJhdGlvbik7XG5cbiAgICB0aGlzLmxvb3AoZXZlbnQpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wcmVzc2luZyAmJiAhdGhpcy5pc0xvbmdQcmVzc2luZykge1xuICAgICAgY29uc3QgeFRocmVzID0gTWF0aC5hYnMoZXZlbnQuY2xpZW50WCAtIHRoaXMubW91c2VYKSA+IDEwO1xuICAgICAgY29uc3QgeVRocmVzID0gTWF0aC5hYnMoZXZlbnQuY2xpZW50WSAtIHRoaXMubW91c2VZKSA+IDEwO1xuXG4gICAgICBpZiAoeFRocmVzIHx8IHlUaHJlcykge1xuICAgICAgICB0aGlzLmVuZFByZXNzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbG9vcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzTG9uZ1ByZXNzaW5nKSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5sb25nUHJlc3NpbmcuZW1pdCh7XG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgbW9kZWw6IHRoaXMucHJlc3NNb2RlbFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb29wKGV2ZW50KTtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cblxuICBlbmRQcmVzcygpOiB2b2lkIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB0aGlzLmlzTG9uZ1ByZXNzaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wcmVzc2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTtcblxuICAgIHRoaXMubG9uZ1ByZXNzRW5kLmVtaXQoe1xuICAgICAgbW9kZWw6IHRoaXMucHJlc3NNb2RlbFxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZXVwKCk6IHZvaWQge1xuICAgIHRoaXMuZW5kUHJlc3MoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=