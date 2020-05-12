import { __decorate } from "tslib";
import { Directive, ElementRef, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * Draggable Directive for Angular2
 *
 * Inspiration:
 *   https://github.com/AngularClass/angular2-examples/blob/master/rx-draggable/directives/draggable.ts
 *   http://stackoverflow.com/questions/35662530/how-to-implement-drag-and-drop-in-angular2
 *
 */
let DraggableDirective = class DraggableDirective {
    constructor(element) {
        this.dragX = true;
        this.dragY = true;
        this.dragStart = new EventEmitter();
        this.dragging = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.isDragging = false;
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        if (changes['dragEventTarget'] && changes['dragEventTarget'].currentValue && this.dragModel.dragging) {
            this.onMousedown(changes['dragEventTarget'].currentValue);
        }
    }
    ngOnDestroy() {
        this._destroySubscription();
    }
    onMouseup(event) {
        if (!this.isDragging)
            return;
        this.isDragging = false;
        this.element.classList.remove('dragging');
        if (this.subscription) {
            this._destroySubscription();
            this.dragEnd.emit({
                event,
                element: this.element,
                model: this.dragModel
            });
        }
    }
    onMousedown(event) {
        // we only want to drag the inner header text
        const isDragElm = event.target.classList.contains('draggable');
        if (isDragElm && (this.dragX || this.dragY)) {
            event.preventDefault();
            this.isDragging = true;
            const mouseDownPos = { x: event.clientX, y: event.clientY };
            const mouseup = fromEvent(document, 'mouseup');
            this.subscription = mouseup.subscribe((ev) => this.onMouseup(ev));
            const mouseMoveSub = fromEvent(document, 'mousemove')
                .pipe(takeUntil(mouseup))
                .subscribe((ev) => this.move(ev, mouseDownPos));
            this.subscription.add(mouseMoveSub);
            this.dragStart.emit({
                event,
                element: this.element,
                model: this.dragModel
            });
        }
    }
    move(event, mouseDownPos) {
        if (!this.isDragging)
            return;
        const x = event.clientX - mouseDownPos.x;
        const y = event.clientY - mouseDownPos.y;
        if (this.dragX)
            this.element.style.left = `${x}px`;
        if (this.dragY)
            this.element.style.top = `${y}px`;
        this.element.classList.add('dragging');
        this.dragging.emit({
            event,
            element: this.element,
            model: this.dragModel
        });
    }
    _destroySubscription() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
};
DraggableDirective.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], DraggableDirective.prototype, "dragEventTarget", void 0);
__decorate([
    Input()
], DraggableDirective.prototype, "dragModel", void 0);
__decorate([
    Input()
], DraggableDirective.prototype, "dragX", void 0);
__decorate([
    Input()
], DraggableDirective.prototype, "dragY", void 0);
__decorate([
    Output()
], DraggableDirective.prototype, "dragStart", void 0);
__decorate([
    Output()
], DraggableDirective.prototype, "dragging", void 0);
__decorate([
    Output()
], DraggableDirective.prototype, "dragEnd", void 0);
DraggableDirective = __decorate([
    Directive({ selector: '[draggable]' })
], DraggableDirective);
export { DraggableDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEgsT0FBTyxFQUFnQixTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDOzs7Ozs7O0dBT0c7QUFFSCxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQWM3QixZQUFZLE9BQW1CO1FBWHRCLFVBQUssR0FBWSxJQUFJLENBQUM7UUFDdEIsVUFBSyxHQUFZLElBQUksQ0FBQztRQUVyQixjQUFTLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbEQsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUcxRCxlQUFVLEdBQVksS0FBSyxDQUFDO1FBSTFCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ3BHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNU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QUFPO1lBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUztTQUN0QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztDQUNGLENBQUE7O1lBakZzQixVQUFVOztBQWJ0QjtJQUFSLEtBQUssRUFBRTsyREFBc0I7QUFDckI7SUFBUixLQUFLLEVBQUU7cURBQWdCO0FBQ2Y7SUFBUixLQUFLLEVBQUU7aURBQXVCO0FBQ3RCO0lBQVIsS0FBSyxFQUFFO2lEQUF1QjtBQUVyQjtJQUFULE1BQU0sRUFBRTtxREFBbUQ7QUFDbEQ7SUFBVCxNQUFNLEVBQUU7b0RBQWtEO0FBQ2pEO0lBQVQsTUFBTSxFQUFFO21EQUFpRDtBQVIvQyxrQkFBa0I7SUFEOUIsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDO0dBQzFCLGtCQUFrQixDQStGOUI7U0EvRlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIERyYWdnYWJsZSBEaXJlY3RpdmUgZm9yIEFuZ3VsYXIyXG4gKlxuICogSW5zcGlyYXRpb246XG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9Bbmd1bGFyQ2xhc3MvYW5ndWxhcjItZXhhbXBsZXMvYmxvYi9tYXN0ZXIvcngtZHJhZ2dhYmxlL2RpcmVjdGl2ZXMvZHJhZ2dhYmxlLnRzXG4gKiAgIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2NjI1MzAvaG93LXRvLWltcGxlbWVudC1kcmFnLWFuZC1kcm9wLWluLWFuZ3VsYXIyXG4gKlxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbZHJhZ2dhYmxlXScgfSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGRyYWdFdmVudFRhcmdldDogYW55O1xuICBASW5wdXQoKSBkcmFnTW9kZWw6IGFueTtcbiAgQElucHV0KCkgZHJhZ1g6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBkcmFnWTogYm9vbGVhbiA9IHRydWU7XG5cbiAgQE91dHB1dCgpIGRyYWdTdGFydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkcmFnZ2luZzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkcmFnRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgaXNEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydkcmFnRXZlbnRUYXJnZXQnXSAmJiBjaGFuZ2VzWydkcmFnRXZlbnRUYXJnZXQnXS5jdXJyZW50VmFsdWUgJiYgdGhpcy5kcmFnTW9kZWwuZHJhZ2dpbmcpIHtcbiAgICAgIHRoaXMub25Nb3VzZWRvd24oY2hhbmdlc1snZHJhZ0V2ZW50VGFyZ2V0J10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kZXN0cm95U3Vic2NyaXB0aW9uKCk7XG4gIH1cblxuICBvbk1vdXNldXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZykgcmV0dXJuO1xuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWdnaW5nJyk7XG5cbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTtcbiAgICAgIHRoaXMuZHJhZ0VuZC5lbWl0KHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuZWxlbWVudCxcbiAgICAgICAgbW9kZWw6IHRoaXMuZHJhZ01vZGVsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlZG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIC8vIHdlIG9ubHkgd2FudCB0byBkcmFnIHRoZSBpbm5lciBoZWFkZXIgdGV4dFxuICAgIGNvbnN0IGlzRHJhZ0VsbSA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RyYWdnYWJsZScpO1xuXG4gICAgaWYgKGlzRHJhZ0VsbSAmJiAodGhpcy5kcmFnWCB8fCB0aGlzLmRyYWdZKSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG5cbiAgICAgIGNvbnN0IG1vdXNlRG93blBvcyA9IHsgeDogZXZlbnQuY2xpZW50WCwgeTogZXZlbnQuY2xpZW50WSB9O1xuXG4gICAgICBjb25zdCBtb3VzZXVwID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBtb3VzZXVwLnN1YnNjcmliZSgoZXY6IE1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZXVwKGV2KSk7XG5cbiAgICAgIGNvbnN0IG1vdXNlTW92ZVN1YiA9IGZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbW92ZScpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbChtb3VzZXVwKSlcbiAgICAgICAgLnN1YnNjcmliZSgoZXY6IE1vdXNlRXZlbnQpID0+IHRoaXMubW92ZShldiwgbW91c2VEb3duUG9zKSk7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChtb3VzZU1vdmVTdWIpO1xuXG4gICAgICB0aGlzLmRyYWdTdGFydC5lbWl0KHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuZWxlbWVudCxcbiAgICAgICAgbW9kZWw6IHRoaXMuZHJhZ01vZGVsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBtb3ZlKGV2ZW50OiBNb3VzZUV2ZW50LCBtb3VzZURvd25Qb3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKSByZXR1cm47XG5cbiAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WCAtIG1vdXNlRG93blBvcy54O1xuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZIC0gbW91c2VEb3duUG9zLnk7XG5cbiAgICBpZiAodGhpcy5kcmFnWCkgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt4fXB4YDtcbiAgICBpZiAodGhpcy5kcmFnWSkgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IGAke3l9cHhgO1xuXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG5cbiAgICB0aGlzLmRyYWdnaW5nLmVtaXQoe1xuICAgICAgZXZlbnQsXG4gICAgICBlbGVtZW50OiB0aGlzLmVsZW1lbnQsXG4gICAgICBtb2RlbDogdGhpcy5kcmFnTW9kZWxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=