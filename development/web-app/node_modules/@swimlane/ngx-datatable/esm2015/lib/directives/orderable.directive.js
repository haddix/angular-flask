import { __decorate, __param } from "tslib";
import { Directive, Output, EventEmitter, ContentChildren, QueryList, KeyValueDiffers, AfterContentInit, OnDestroy, Inject } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DOCUMENT } from '@angular/common';
let OrderableDirective = class OrderableDirective {
    constructor(differs, document) {
        this.document = document;
        this.reorder = new EventEmitter();
        this.targetChanged = new EventEmitter();
        this.differ = differs.find({}).create();
    }
    ngAfterContentInit() {
        // HACK: Investigate Better Way
        this.updateSubscriptions();
        this.draggables.changes.subscribe(this.updateSubscriptions.bind(this));
    }
    ngOnDestroy() {
        this.draggables.forEach(d => {
            d.dragStart.unsubscribe();
            d.dragging.unsubscribe();
            d.dragEnd.unsubscribe();
        });
    }
    updateSubscriptions() {
        const diffs = this.differ.diff(this.createMapDiffs());
        if (diffs) {
            const subscribe = ({ currentValue, previousValue }) => {
                unsubscribe({ previousValue });
                if (currentValue) {
                    currentValue.dragStart.subscribe(this.onDragStart.bind(this));
                    currentValue.dragging.subscribe(this.onDragging.bind(this));
                    currentValue.dragEnd.subscribe(this.onDragEnd.bind(this));
                }
            };
            const unsubscribe = ({ previousValue }) => {
                if (previousValue) {
                    previousValue.dragStart.unsubscribe();
                    previousValue.dragging.unsubscribe();
                    previousValue.dragEnd.unsubscribe();
                }
            };
            diffs.forEachAddedItem(subscribe);
            // diffs.forEachChangedItem(subscribe.bind(this));
            diffs.forEachRemovedItem(unsubscribe);
        }
    }
    onDragStart() {
        this.positions = {};
        let i = 0;
        for (const dragger of this.draggables.toArray()) {
            const elm = dragger.element;
            const left = parseInt(elm.offsetLeft.toString(), 0);
            this.positions[dragger.dragModel.prop] = {
                left,
                right: left + parseInt(elm.offsetWidth.toString(), 0),
                index: i++,
                element: elm
            };
        }
    }
    onDragging({ element, model, event }) {
        const prevPos = this.positions[model.prop];
        const target = this.isTarget(model, event);
        if (target) {
            if (this.lastDraggingIndex !== target.i) {
                this.targetChanged.emit({
                    prevIndex: this.lastDraggingIndex,
                    newIndex: target.i,
                    initialIndex: prevPos.index
                });
                this.lastDraggingIndex = target.i;
            }
        }
        else if (this.lastDraggingIndex !== prevPos.index) {
            this.targetChanged.emit({
                prevIndex: this.lastDraggingIndex,
                initialIndex: prevPos.index
            });
            this.lastDraggingIndex = prevPos.index;
        }
    }
    onDragEnd({ element, model, event }) {
        const prevPos = this.positions[model.prop];
        const target = this.isTarget(model, event);
        if (target) {
            this.reorder.emit({
                prevIndex: prevPos.index,
                newIndex: target.i,
                model
            });
        }
        this.lastDraggingIndex = undefined;
        element.style.left = 'auto';
    }
    isTarget(model, event) {
        let i = 0;
        const x = event.x || event.clientX;
        const y = event.y || event.clientY;
        const targets = this.document.elementsFromPoint(x, y);
        for (const prop in this.positions) {
            // current column position which throws event.
            const pos = this.positions[prop];
            // since we drag the inner span, we need to find it in the elements at the cursor
            if (model.prop !== prop && targets.find((el) => el === pos.element)) {
                return {
                    pos,
                    i
                };
            }
            i++;
        }
    }
    createMapDiffs() {
        return this.draggables.toArray().reduce((acc, curr) => {
            acc[curr.dragModel.$$id] = curr;
            return acc;
        }, {});
    }
};
OrderableDirective.ctorParameters = () => [
    { type: KeyValueDiffers },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
__decorate([
    Output()
], OrderableDirective.prototype, "reorder", void 0);
__decorate([
    Output()
], OrderableDirective.prototype, "targetChanged", void 0);
__decorate([
    ContentChildren(DraggableDirective, { descendants: true })
], OrderableDirective.prototype, "draggables", void 0);
OrderableDirective = __decorate([
    Directive({ selector: '[orderable]' }),
    __param(1, Inject(DOCUMENT))
], OrderableDirective);
export { OrderableDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvb3JkZXJhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUczQyxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQVc3QixZQUFZLE9BQXdCLEVBQTRCLFFBQWE7UUFBYixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBVm5FLFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBVTlELElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLCtCQUErQjtRQUMvQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMx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QUUsYUFBYSxFQUFFLENBQUM7SUFZRSxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQVg1QyxrQkFBa0IsQ0EySTlCO1NBM0lZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBLZXlWYWx1ZURpZmZlcnMsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9kcmFnZ2FibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW29yZGVyYWJsZV0nIH0pXG5leHBvcnQgY2xhc3MgT3JkZXJhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpIHJlb3JkZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgdGFyZ2V0Q2hhbmdlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihEcmFnZ2FibGVEaXJlY3RpdmUsIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgZHJhZ2dhYmxlczogUXVlcnlMaXN0PERyYWdnYWJsZURpcmVjdGl2ZT47XG5cbiAgcG9zaXRpb25zOiBhbnk7XG4gIGRpZmZlcjogYW55O1xuICBsYXN0RHJhZ2dpbmdJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycywgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55KSB7XG4gICAgdGhpcy5kaWZmZXIgPSBkaWZmZXJzLmZpbmQoe30pLmNyZWF0ZSgpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIC8vIEhBQ0s6IEludmVzdGlnYXRlIEJldHRlciBXYXlcbiAgICB0aGlzLnVwZGF0ZVN1YnNjcmlwdGlvbnMoKTtcbiAgICB0aGlzLmRyYWdnYWJsZXMuY2hhbmdlcy5zdWJzY3JpYmUodGhpcy51cGRhdGVTdWJzY3JpcHRpb25zLmJpbmQodGhpcykpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kcmFnZ2FibGVzLmZvckVhY2goZCA9PiB7XG4gICAgICBkLmRyYWdTdGFydC51bnN1YnNjcmliZSgpO1xuICAgICAgZC5kcmFnZ2luZy51bnN1YnNjcmliZSgpO1xuICAgICAgZC5kcmFnRW5kLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVTdWJzY3JpcHRpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpZmZzID0gdGhpcy5kaWZmZXIuZGlmZih0aGlzLmNyZWF0ZU1hcERpZmZzKCkpO1xuXG4gICAgaWYgKGRpZmZzKSB7XG4gICAgICBjb25zdCBzdWJzY3JpYmUgPSAoeyBjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWUgfTogYW55KSA9PiB7XG4gICAgICAgIHVuc3Vic2NyaWJlKHsgcHJldmlvdXNWYWx1ZSB9KTtcblxuICAgICAgICBpZiAoY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgY3VycmVudFZhbHVlLmRyYWdTdGFydC5zdWJzY3JpYmUodGhpcy5vbkRyYWdTdGFydC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICBjdXJyZW50VmFsdWUuZHJhZ2dpbmcuc3Vic2NyaWJlKHRoaXMub25EcmFnZ2luZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICBjdXJyZW50VmFsdWUuZHJhZ0VuZC5zdWJzY3JpYmUodGhpcy5vbkRyYWdFbmQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gKHsgcHJldmlvdXNWYWx1ZSB9OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgICBwcmV2aW91c1ZhbHVlLmRyYWdTdGFydC51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHByZXZpb3VzVmFsdWUuZHJhZ2dpbmcudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICBwcmV2aW91c1ZhbHVlLmRyYWdFbmQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZGlmZnMuZm9yRWFjaEFkZGVkSXRlbShzdWJzY3JpYmUpO1xuICAgICAgLy8gZGlmZnMuZm9yRWFjaENoYW5nZWRJdGVtKHN1YnNjcmliZS5iaW5kKHRoaXMpKTtcbiAgICAgIGRpZmZzLmZvckVhY2hSZW1vdmVkSXRlbSh1bnN1YnNjcmliZSk7XG4gICAgfVxuICB9XG5cbiAgb25EcmFnU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5wb3NpdGlvbnMgPSB7fTtcblxuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IGRyYWdnZXIgb2YgdGhpcy5kcmFnZ2FibGVzLnRvQXJyYXkoKSkge1xuICAgICAgY29uc3QgZWxtID0gZHJhZ2dlci5lbGVtZW50O1xuICAgICAgY29uc3QgbGVmdCA9IHBhcnNlSW50KGVsbS5vZmZzZXRMZWZ0LnRvU3RyaW5nKCksIDApO1xuICAgICAgdGhpcy5wb3NpdGlvbnNbZHJhZ2dlci5kcmFnTW9kZWwucHJvcF0gPSB7XG4gICAgICAgIGxlZnQsXG4gICAgICAgIHJpZ2h0OiBsZWZ0ICsgcGFyc2VJbnQoZWxtLm9mZnNldFdpZHRoLnRvU3RyaW5nKCksIDApLFxuICAgICAgICBpbmRleDogaSsrLFxuICAgICAgICBlbGVtZW50OiBlbG1cbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgb25EcmFnZ2luZyh7IGVsZW1lbnQsIG1vZGVsLCBldmVudCB9OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2UG9zID0gdGhpcy5wb3NpdGlvbnNbbW9kZWwucHJvcF07XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pc1RhcmdldChtb2RlbCwgZXZlbnQpO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgaWYgKHRoaXMubGFzdERyYWdnaW5nSW5kZXggIT09IHRhcmdldC5pKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Q2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICBwcmV2SW5kZXg6IHRoaXMubGFzdERyYWdnaW5nSW5kZXgsXG4gICAgICAgICAgbmV3SW5kZXg6IHRhcmdldC5pLFxuICAgICAgICAgIGluaXRpYWxJbmRleDogcHJldlBvcy5pbmRleFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sYXN0RHJhZ2dpbmdJbmRleCA9IHRhcmdldC5pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5sYXN0RHJhZ2dpbmdJbmRleCAhPT0gcHJldlBvcy5pbmRleCkge1xuICAgICAgdGhpcy50YXJnZXRDaGFuZ2VkLmVtaXQoe1xuICAgICAgICBwcmV2SW5kZXg6IHRoaXMubGFzdERyYWdnaW5nSW5kZXgsXG4gICAgICAgIGluaXRpYWxJbmRleDogcHJldlBvcy5pbmRleFxuICAgICAgfSk7XG4gICAgICB0aGlzLmxhc3REcmFnZ2luZ0luZGV4ID0gcHJldlBvcy5pbmRleDtcbiAgICB9XG4gIH1cblxuICBvbkRyYWdFbmQoeyBlbGVtZW50LCBtb2RlbCwgZXZlbnQgfTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgcHJldlBvcyA9IHRoaXMucG9zaXRpb25zW21vZGVsLnByb3BdO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pc1RhcmdldChtb2RlbCwgZXZlbnQpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMucmVvcmRlci5lbWl0KHtcbiAgICAgICAgcHJldkluZGV4OiBwcmV2UG9zLmluZGV4LFxuICAgICAgICBuZXdJbmRleDogdGFyZ2V0LmksXG4gICAgICAgIG1vZGVsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3REcmFnZ2luZ0luZGV4ID0gdW5kZWZpbmVkO1xuICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgfVxuXG4gIGlzVGFyZ2V0KG1vZGVsOiBhbnksIGV2ZW50OiBhbnkpOiBhbnkge1xuICAgIGxldCBpID0gMDtcbiAgICBjb25zdCB4ID0gZXZlbnQueCB8fCBldmVudC5jbGllbnRYO1xuICAgIGNvbnN0IHkgPSBldmVudC55IHx8IGV2ZW50LmNsaWVudFk7XG4gICAgY29uc3QgdGFyZ2V0cyA9IHRoaXMuZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoeCwgeSk7XG5cbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gdGhpcy5wb3NpdGlvbnMpIHtcbiAgICAgIC8vIGN1cnJlbnQgY29sdW1uIHBvc2l0aW9uIHdoaWNoIHRocm93cyBldmVudC5cbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMucG9zaXRpb25zW3Byb3BdO1xuXG4gICAgICAvLyBzaW5jZSB3ZSBkcmFnIHRoZSBpbm5lciBzcGFuLCB3ZSBuZWVkIHRvIGZpbmQgaXQgaW4gdGhlIGVsZW1lbnRzIGF0IHRoZSBjdXJzb3JcbiAgICAgIGlmIChtb2RlbC5wcm9wICE9PSBwcm9wICYmIHRhcmdldHMuZmluZCgoZWw6IGFueSkgPT4gZWwgPT09IHBvcy5lbGVtZW50KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBvcyxcbiAgICAgICAgICBpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU1hcERpZmZzKCk6IHsgW2tleTogc3RyaW5nXTogRHJhZ2dhYmxlRGlyZWN0aXZlIH0ge1xuICAgIHJldHVybiB0aGlzLmRyYWdnYWJsZXMudG9BcnJheSgpLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG4gICAgICBhY2NbY3Vyci5kcmFnTW9kZWwuJCRpZF0gPSBjdXJyO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH1cbn1cbiJdfQ==