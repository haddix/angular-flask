import { __decorate } from "tslib";
import { Directive, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
let LongPressDirective = class LongPressDirective {
    constructor() {
        this.pressEnabled = true;
        this.duration = 500;
        this.longPressStart = new EventEmitter();
        this.longPressing = new EventEmitter();
        this.longPressEnd = new EventEmitter();
        this.mouseX = 0;
        this.mouseY = 0;
    }
    get press() {
        return this.pressing;
    }
    get isLongPress() {
        return this.isLongPressing;
    }
    onMouseDown(event) {
        // don't do right/middle clicks
        if (event.which !== 1 || !this.pressEnabled)
            return;
        // don't start drag if its on resize handle
        const target = event.target;
        if (target.classList.contains('resize-handle'))
            return;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.pressing = true;
        this.isLongPressing = false;
        const mouseup = fromEvent(document, 'mouseup');
        this.subscription = mouseup.subscribe((ev) => this.onMouseup());
        this.timeout = setTimeout(() => {
            this.isLongPressing = true;
            this.longPressStart.emit({
                event,
                model: this.pressModel
            });
            this.subscription.add(fromEvent(document, 'mousemove')
                .pipe(takeUntil(mouseup))
                .subscribe((mouseEvent) => this.onMouseMove(mouseEvent)));
            this.loop(event);
        }, this.duration);
        this.loop(event);
    }
    onMouseMove(event) {
        if (this.pressing && !this.isLongPressing) {
            const xThres = Math.abs(event.clientX - this.mouseX) > 10;
            const yThres = Math.abs(event.clientY - this.mouseY) > 10;
            if (xThres || yThres) {
                this.endPress();
            }
        }
    }
    loop(event) {
        if (this.isLongPressing) {
            this.timeout = setTimeout(() => {
                this.longPressing.emit({
                    event,
                    model: this.pressModel
                });
                this.loop(event);
            }, 50);
        }
    }
    endPress() {
        clearTimeout(this.timeout);
        this.isLongPressing = false;
        this.pressing = false;
        this._destroySubscription();
        this.longPressEnd.emit({
            model: this.pressModel
        });
    }
    onMouseup() {
        this.endPress();
    }
    ngOnDestroy() {
        this._destroySubscription();
    }
    _destroySubscription() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
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
export { LongPressDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9uZy1wcmVzcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL2xvbmctcHJlc3MuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDN0csT0FBTyxFQUE0QixTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTNDLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBQS9CO1FBQ1csaUJBQVksR0FBWSxJQUFJLENBQUM7UUFFN0IsYUFBUSxHQUFXLEdBQUcsQ0FBQztRQUV0QixtQkFBYyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckQsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUsvRCxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFdBQU0sR0FBVyxDQUFDLENBQUM7SUFtR3JCLENBQUM7SUE5RkMsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFHRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUdELFdBQVcsQ0FBQyxLQUFpQjtRQUMzQiwrQkFBK0I7UUFDL0IsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZO1lBQUUsT0FBTztRQUVwRCwyQ0FBMkM7UUFDM0MsTUFBTSxNQUFNLEdBQWdCLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDekMsSUFBSSxN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SUFDbEIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUEvR1U7SUFBUixLQUFLLEVBQUU7d0RBQThCO0FBQzdCO0lBQVIsS0FBSyxFQUFFO3NEQUFpQjtBQUNoQjtJQUFSLEtBQUssRUFBRTtvREFBd0I7QUFFdEI7SUFBVCxNQUFNLEVBQUU7MERBQXdEO0FBQ3ZEO0lBQVQsTUFBTSxFQUFFO3dEQUFzRDtBQUNyRDtJQUFULE1BQU0sRUFBRTt3REFBc0Q7QUFXL0Q7SUFEQyxXQUFXLENBQUMsYUFBYSxDQUFDOytDQUcxQjtBQUdEO0lBREMsV0FBVyxDQUFDLGlCQUFpQixDQUFDO3FEQUc5QjtBQUdEO0lBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FEQW1DckM7QUE5RFUsa0JBQWtCO0lBRDlCLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsQ0FBQztHQUMzQixrQkFBa0IsQ0FnSDlCO1NBaEhZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBNb3VzZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnRzJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2xvbmctcHJlc3NdJyB9KVxuZXhwb3J0IGNsYXNzIExvbmdQcmVzc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIHByZXNzRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHByZXNzTW9kZWw6IGFueTtcbiAgQElucHV0KCkgZHVyYXRpb246IG51bWJlciA9IDUwMDtcblxuICBAT3V0cHV0KCkgbG9uZ1ByZXNzU3RhcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgbG9uZ1ByZXNzaW5nOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGxvbmdQcmVzc0VuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJlc3Npbmc6IGJvb2xlYW47XG4gIGlzTG9uZ1ByZXNzaW5nOiBib29sZWFuO1xuICB0aW1lb3V0OiBhbnk7XG4gIG1vdXNlWDogbnVtYmVyID0gMDtcbiAgbW91c2VZOiBudW1iZXIgPSAwO1xuXG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucHJlc3MnKVxuICBnZXQgcHJlc3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucHJlc3Npbmc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmxvbmdwcmVzcycpXG4gIGdldCBpc0xvbmdQcmVzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc0xvbmdQcmVzc2luZztcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgLy8gZG9uJ3QgZG8gcmlnaHQvbWlkZGxlIGNsaWNrc1xuICAgIGlmIChldmVudC53aGljaCAhPT0gMSB8fCAhdGhpcy5wcmVzc0VuYWJsZWQpIHJldHVybjtcblxuICAgIC8vIGRvbid0IHN0YXJ0IGRyYWcgaWYgaXRzIG9uIHJlc2l6ZSBoYW5kbGVcbiAgICBjb25zdCB0YXJnZXQgPSA8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXNpemUtaGFuZGxlJykpIHJldHVybjtcblxuICAgIHRoaXMubW91c2VYID0gZXZlbnQuY2xpZW50WDtcbiAgICB0aGlzLm1vdXNlWSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICB0aGlzLnByZXNzaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmlzTG9uZ1ByZXNzaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBtb3VzZXVwID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbW91c2V1cC5zdWJzY3JpYmUoKGV2OiBNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2V1cCgpKTtcblxuICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pc0xvbmdQcmVzc2luZyA9IHRydWU7XG4gICAgICB0aGlzLmxvbmdQcmVzc1N0YXJ0LmVtaXQoe1xuICAgICAgICBldmVudCxcbiAgICAgICAgbW9kZWw6IHRoaXMucHJlc3NNb2RlbFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2Vtb3ZlJylcbiAgICAgICAgICAucGlwZSh0YWtlVW50aWwobW91c2V1cCkpXG4gICAgICAgICAgLnN1YnNjcmliZSgobW91c2VFdmVudDogTW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlTW92ZShtb3VzZUV2ZW50KSlcbiAgICAgICk7XG5cbiAgICAgIHRoaXMubG9vcChldmVudCk7XG4gICAgfSwgdGhpcy5kdXJhdGlvbik7XG5cbiAgICB0aGlzLmxvb3AoZXZlbnQpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wcmVzc2luZyAmJiAhdGhpcy5pc0xvbmdQcmVzc2luZykge1xuICAgICAgY29uc3QgeFRocmVzID0gTWF0aC5hYnMoZXZlbnQuY2xpZW50WCAtIHRoaXMubW91c2VYKSA+IDEwO1xuICAgICAgY29uc3QgeVRocmVzID0gTWF0aC5hYnMoZXZlbnQuY2xpZW50WSAtIHRoaXMubW91c2VZKSA+IDEwO1xuXG4gICAgICBpZiAoeFRocmVzIHx8IHlUaHJlcykge1xuICAgICAgICB0aGlzLmVuZFByZXNzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbG9vcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzTG9uZ1ByZXNzaW5nKSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5sb25nUHJlc3NpbmcuZW1pdCh7XG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgbW9kZWw6IHRoaXMucHJlc3NNb2RlbFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb29wKGV2ZW50KTtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cblxuICBlbmRQcmVzcygpOiB2b2lkIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICB0aGlzLmlzTG9uZ1ByZXNzaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wcmVzc2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTtcblxuICAgIHRoaXMubG9uZ1ByZXNzRW5kLmVtaXQoe1xuICAgICAgbW9kZWw6IHRoaXMucHJlc3NNb2RlbFxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZXVwKCk6IHZvaWQge1xuICAgIHRoaXMuZW5kUHJlc3MoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=