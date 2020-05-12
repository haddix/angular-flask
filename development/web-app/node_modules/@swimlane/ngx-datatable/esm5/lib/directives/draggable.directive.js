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
var DraggableDirective = /** @class */ (function () {
    function DraggableDirective(element) {
        this.dragX = true;
        this.dragY = true;
        this.dragStart = new EventEmitter();
        this.dragging = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.isDragging = false;
        this.element = element.nativeElement;
    }
    DraggableDirective.prototype.ngOnChanges = function (changes) {
        if (changes['dragEventTarget'] && changes['dragEventTarget'].currentValue && this.dragModel.dragging) {
            this.onMousedown(changes['dragEventTarget'].currentValue);
        }
    };
    DraggableDirective.prototype.ngOnDestroy = function () {
        this._destroySubscription();
    };
    DraggableDirective.prototype.onMouseup = function (event) {
        if (!this.isDragging)
            return;
        this.isDragging = false;
        this.element.classList.remove('dragging');
        if (this.subscription) {
            this._destroySubscription();
            this.dragEnd.emit({
                event: event,
                element: this.element,
                model: this.dragModel
            });
        }
    };
    DraggableDirective.prototype.onMousedown = function (event) {
        var _this = this;
        // we only want to drag the inner header text
        var isDragElm = event.target.classList.contains('draggable');
        if (isDragElm && (this.dragX || this.dragY)) {
            event.preventDefault();
            this.isDragging = true;
            var mouseDownPos_1 = { x: event.clientX, y: event.clientY };
            var mouseup = fromEvent(document, 'mouseup');
            this.subscription = mouseup.subscribe(function (ev) { return _this.onMouseup(ev); });
            var mouseMoveSub = fromEvent(document, 'mousemove')
                .pipe(takeUntil(mouseup))
                .subscribe(function (ev) { return _this.move(ev, mouseDownPos_1); });
            this.subscription.add(mouseMoveSub);
            this.dragStart.emit({
                event: event,
                element: this.element,
                model: this.dragModel
            });
        }
    };
    DraggableDirective.prototype.move = function (event, mouseDownPos) {
        if (!this.isDragging)
            return;
        var x = event.clientX - mouseDownPos.x;
        var y = event.clientY - mouseDownPos.y;
        if (this.dragX)
            this.element.style.left = x + "px";
        if (this.dragY)
            this.element.style.top = y + "px";
        this.element.classList.add('dragging');
        this.dragging.emit({
            event: event,
            element: this.element,
            model: this.dragModel
        });
    };
    DraggableDirective.prototype._destroySubscription = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    };
    DraggableDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return DraggableDirective;
}());
export { DraggableDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEgsT0FBTyxFQUFnQixTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDOzs7Ozs7O0dBT0c7QUFFSDtJQWNFLDRCQUFZLE9BQW1CO1FBWHRCLFVBQUssR0FBWSxJQUFJLENBQUM7UUFDdEIsVUFBSyxHQUFZLElBQUksQ0FBQztRQUVyQixjQUFTLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbEQsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUcxRCxlQUFVLEdBQVksS0FBSyxDQUFDO1FBSTFCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsd0NBQVcsR0FBWCxVQUFZLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ3BHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDO0lBRUQsd0NBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxvQkFBb0Is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LE9BQUE7WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQ3RCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxpREFBb0IsR0FBNUI7UUFDRSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztTQUMvQjtJQUNILENBQUM7O2dCQWhGb0IsVUFBVTs7SUFidEI7UUFBUixLQUFLLEVBQUU7K0RBQXNCO0lBQ3JCO1FBQVIsS0FBSyxFQUFFO3lEQUFnQjtJQUNmO1FBQVIsS0FBSyxFQUFFO3FEQUF1QjtJQUN0QjtRQUFSLEtBQUssRUFBRTtxREFBdUI7SUFFckI7UUFBVCxNQUFNLEVBQUU7eURBQW1EO0lBQ2xEO1FBQVQsTUFBTSxFQUFFO3dEQUFrRDtJQUNqRDtRQUFULE1BQU0sRUFBRTt1REFBaUQ7SUFSL0Msa0JBQWtCO1FBRDlCLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsQ0FBQztPQUMxQixrQkFBa0IsQ0ErRjlCO0lBQUQseUJBQUM7Q0FBQSxBQS9GRCxJQStGQztTQS9GWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogRHJhZ2dhYmxlIERpcmVjdGl2ZSBmb3IgQW5ndWxhcjJcbiAqXG4gKiBJbnNwaXJhdGlvbjpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL0FuZ3VsYXJDbGFzcy9hbmd1bGFyMi1leGFtcGxlcy9ibG9iL21hc3Rlci9yeC1kcmFnZ2FibGUvZGlyZWN0aXZlcy9kcmFnZ2FibGUudHNcbiAqICAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNTY2MjUzMC9ob3ctdG8taW1wbGVtZW50LWRyYWctYW5kLWRyb3AtaW4tYW5ndWxhcjJcbiAqXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tkcmFnZ2FibGVdJyB9KVxuZXhwb3J0IGNsYXNzIERyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgZHJhZ0V2ZW50VGFyZ2V0OiBhbnk7XG4gIEBJbnB1dCgpIGRyYWdNb2RlbDogYW55O1xuICBASW5wdXQoKSBkcmFnWDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGRyYWdZOiBib29sZWFuID0gdHJ1ZTtcblxuICBAT3V0cHV0KCkgZHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRyYWdnaW5nOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRyYWdFbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBpc0RyYWdnaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ2RyYWdFdmVudFRhcmdldCddICYmIGNoYW5nZXNbJ2RyYWdFdmVudFRhcmdldCddLmN1cnJlbnRWYWx1ZSAmJiB0aGlzLmRyYWdNb2RlbC5kcmFnZ2luZykge1xuICAgICAgdGhpcy5vbk1vdXNlZG93bihjaGFuZ2VzWydkcmFnRXZlbnRUYXJnZXQnXS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTtcbiAgfVxuXG4gIG9uTW91c2V1cChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKSByZXR1cm47XG5cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcblxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fZGVzdHJveVN1YnNjcmlwdGlvbigpO1xuICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoe1xuICAgICAgICBldmVudCxcbiAgICAgICAgZWxlbWVudDogdGhpcy5lbGVtZW50LFxuICAgICAgICBtb2RlbDogdGhpcy5kcmFnTW9kZWxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgLy8gd2Ugb25seSB3YW50IHRvIGRyYWcgdGhlIGlubmVyIGhlYWRlciB0ZXh0XG4gICAgY29uc3QgaXNEcmFnRWxtID0gKDxIVE1MRWxlbWVudD5ldmVudC50YXJnZXQpLmNsYXNzTGlzdC5jb250YWlucygnZHJhZ2dhYmxlJyk7XG5cbiAgICBpZiAoaXNEcmFnRWxtICYmICh0aGlzLmRyYWdYIHx8IHRoaXMuZHJhZ1kpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcblxuICAgICAgY29uc3QgbW91c2VEb3duUG9zID0geyB4OiBldmVudC5jbGllbnRYLCB5OiBldmVudC5jbGllbnRZIH07XG5cbiAgICAgIGNvbnN0IG1vdXNldXAgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJyk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG1vdXNldXAuc3Vic2NyaWJlKChldjogTW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNldXAoZXYpKTtcblxuICAgICAgY29uc3QgbW91c2VNb3ZlU3ViID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2Vtb3ZlJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKG1vdXNldXApKVxuICAgICAgICAuc3Vic2NyaWJlKChldjogTW91c2VFdmVudCkgPT4gdGhpcy5tb3ZlKGV2LCBtb3VzZURvd25Qb3MpKTtcblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKG1vdXNlTW92ZVN1Yik7XG5cbiAgICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoe1xuICAgICAgICBldmVudCxcbiAgICAgICAgZWxlbWVudDogdGhpcy5lbGVtZW50LFxuICAgICAgICBtb2RlbDogdGhpcy5kcmFnTW9kZWxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQsIG1vdXNlRG93blBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzRHJhZ2dpbmcpIHJldHVybjtcblxuICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYIC0gbW91c2VEb3duUG9zLng7XG4gICAgY29uc3QgeSA9IGV2ZW50LmNsaWVudFkgLSBtb3VzZURvd25Qb3MueTtcblxuICAgIGlmICh0aGlzLmRyYWdYKSB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3h9cHhgO1xuICAgIGlmICh0aGlzLmRyYWdZKSB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7eX1weGA7XG5cbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcblxuICAgIHRoaXMuZHJhZ2dpbmcuZW1pdCh7XG4gICAgICBldmVudCxcbiAgICAgIGVsZW1lbnQ6IHRoaXMuZWxlbWVudCxcbiAgICAgIG1vZGVsOiB0aGlzLmRyYWdNb2RlbFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGVzdHJveVN1YnNjcmlwdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==