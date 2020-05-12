import { __decorate, __param, __values } from "tslib";
import { Directive, Output, EventEmitter, ContentChildren, QueryList, KeyValueDiffers, AfterContentInit, OnDestroy, Inject } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DOCUMENT } from '@angular/common';
var OrderableDirective = /** @class */ (function () {
    function OrderableDirective(differs, document) {
        this.document = document;
        this.reorder = new EventEmitter();
        this.targetChanged = new EventEmitter();
        this.differ = differs.find({}).create();
    }
    OrderableDirective.prototype.ngAfterContentInit = function () {
        // HACK: Investigate Better Way
        this.updateSubscriptions();
        this.draggables.changes.subscribe(this.updateSubscriptions.bind(this));
    };
    OrderableDirective.prototype.ngOnDestroy = function () {
        this.draggables.forEach(function (d) {
            d.dragStart.unsubscribe();
            d.dragging.unsubscribe();
            d.dragEnd.unsubscribe();
        });
    };
    OrderableDirective.prototype.updateSubscriptions = function () {
        var _this = this;
        var diffs = this.differ.diff(this.createMapDiffs());
        if (diffs) {
            var subscribe = function (_a) {
                var currentValue = _a.currentValue, previousValue = _a.previousValue;
                unsubscribe_1({ previousValue: previousValue });
                if (currentValue) {
                    currentValue.dragStart.subscribe(_this.onDragStart.bind(_this));
                    currentValue.dragging.subscribe(_this.onDragging.bind(_this));
                    currentValue.dragEnd.subscribe(_this.onDragEnd.bind(_this));
                }
            };
            var unsubscribe_1 = function (_a) {
                var previousValue = _a.previousValue;
                if (previousValue) {
                    previousValue.dragStart.unsubscribe();
                    previousValue.dragging.unsubscribe();
                    previousValue.dragEnd.unsubscribe();
                }
            };
            diffs.forEachAddedItem(subscribe);
            // diffs.forEachChangedItem(subscribe.bind(this));
            diffs.forEachRemovedItem(unsubscribe_1);
        }
    };
    OrderableDirective.prototype.onDragStart = function () {
        var e_1, _a;
        this.positions = {};
        var i = 0;
        try {
            for (var _b = __values(this.draggables.toArray()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var dragger = _c.value;
                var elm = dragger.element;
                var left = parseInt(elm.offsetLeft.toString(), 0);
                this.positions[dragger.dragModel.prop] = {
                    left: left,
                    right: left + parseInt(elm.offsetWidth.toString(), 0),
                    index: i++,
                    element: elm
                };
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    OrderableDirective.prototype.onDragging = function (_a) {
        var element = _a.element, model = _a.model, event = _a.event;
        var prevPos = this.positions[model.prop];
        var target = this.isTarget(model, event);
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
    };
    OrderableDirective.prototype.onDragEnd = function (_a) {
        var element = _a.element, model = _a.model, event = _a.event;
        var prevPos = this.positions[model.prop];
        var target = this.isTarget(model, event);
        if (target) {
            this.reorder.emit({
                prevIndex: prevPos.index,
                newIndex: target.i,
                model: model
            });
        }
        this.lastDraggingIndex = undefined;
        element.style.left = 'auto';
    };
    OrderableDirective.prototype.isTarget = function (model, event) {
        var i = 0;
        var x = event.x || event.clientX;
        var y = event.y || event.clientY;
        var targets = this.document.elementsFromPoint(x, y);
        var _loop_1 = function (prop) {
            // current column position which throws event.
            var pos = this_1.positions[prop];
            // since we drag the inner span, we need to find it in the elements at the cursor
            if (model.prop !== prop && targets.find(function (el) { return el === pos.element; })) {
                return { value: {
                        pos: pos,
                        i: i
                    } };
            }
            i++;
        };
        var this_1 = this;
        for (var prop in this.positions) {
            var state_1 = _loop_1(prop);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    OrderableDirective.prototype.createMapDiffs = function () {
        return this.draggables.toArray().reduce(function (acc, curr) {
            acc[curr.dragModel.$$id] = curr;
            return acc;
        }, {});
    };
    OrderableDirective.ctorParameters = function () { return [
        { type: KeyValueDiffers },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
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
    return OrderableDirective;
}());
export { OrderableDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvb3JkZXJhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUczQztJQVdFLDRCQUFZLE9BQXdCLEVBQTRCLFFBQWE7UUFBYixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBVm5FLFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBVTlELElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsK0NBQWtCLEdBQWxCO1FBQ0UsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELHdDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDdkIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUMsUUFBUSxDQUFDLFdB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LGtCQUFrQixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDOzBEQUNqQjtJQUwvQixrQkFBa0I7UUFEOUIsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDO1FBWUUsV0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7T0FYNUMsa0JBQWtCLENBMkk5QjtJQUFELHlCQUFDO0NBQUEsQUEzSUQsSUEySUM7U0EzSVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ29udGVudENoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgT25EZXN0cm95LFxuICBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuL2RyYWdnYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbb3JkZXJhYmxlXScgfSlcbmV4cG9ydCBjbGFzcyBPcmRlcmFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCkgcmVvcmRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSB0YXJnZXRDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAQ29udGVudENoaWxkcmVuKERyYWdnYWJsZURpcmVjdGl2ZSwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KVxuICBkcmFnZ2FibGVzOiBRdWVyeUxpc3Q8RHJhZ2dhYmxlRGlyZWN0aXZlPjtcblxuICBwb3NpdGlvbnM6IGFueTtcbiAgZGlmZmVyOiBhbnk7XG4gIGxhc3REcmFnZ2luZ0luZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLmRpZmZlciA9IGRpZmZlcnMuZmluZCh7fSkuY3JlYXRlKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgLy8gSEFDSzogSW52ZXN0aWdhdGUgQmV0dGVyIFdheVxuICAgIHRoaXMudXBkYXRlU3Vic2NyaXB0aW9ucygpO1xuICAgIHRoaXMuZHJhZ2dhYmxlcy5jaGFuZ2VzLnN1YnNjcmliZSh0aGlzLnVwZGF0ZVN1YnNjcmlwdGlvbnMuYmluZCh0aGlzKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYWdnYWJsZXMuZm9yRWFjaChkID0+IHtcbiAgICAgIGQuZHJhZ1N0YXJ0LnVuc3Vic2NyaWJlKCk7XG4gICAgICBkLmRyYWdnaW5nLnVuc3Vic2NyaWJlKCk7XG4gICAgICBkLmRyYWdFbmQudW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVN1YnNjcmlwdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgZGlmZnMgPSB0aGlzLmRpZmZlci5kaWZmKHRoaXMuY3JlYXRlTWFwRGlmZnMoKSk7XG5cbiAgICBpZiAoZGlmZnMpIHtcbiAgICAgIGNvbnN0IHN1YnNjcmliZSA9ICh7IGN1cnJlbnRWYWx1ZSwgcHJldmlvdXNWYWx1ZSB9OiBhbnkpID0+IHtcbiAgICAgICAgdW5zdWJzY3JpYmUoeyBwcmV2aW91c1ZhbHVlIH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBjdXJyZW50VmFsdWUuZHJhZ1N0YXJ0LnN1YnNjcmliZSh0aGlzLm9uRHJhZ1N0YXJ0LmJpbmQodGhpcykpO1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZS5kcmFnZ2luZy5zdWJzY3JpYmUodGhpcy5vbkRyYWdnaW5nLmJpbmQodGhpcykpO1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZS5kcmFnRW5kLnN1YnNjcmliZSh0aGlzLm9uRHJhZ0VuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgdW5zdWJzY3JpYmUgPSAoeyBwcmV2aW91c1ZhbHVlIH06IGFueSkgPT4ge1xuICAgICAgICBpZiAocHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgIHByZXZpb3VzVmFsdWUuZHJhZ1N0YXJ0LnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgcHJldmlvdXNWYWx1ZS5kcmFnZ2luZy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHByZXZpb3VzVmFsdWUuZHJhZ0VuZC51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBkaWZmcy5mb3JFYWNoQWRkZWRJdGVtKHN1YnNjcmliZSk7XG4gICAgICAvLyBkaWZmcy5mb3JFYWNoQ2hhbmdlZEl0ZW0oc3Vic2NyaWJlLmJpbmQodGhpcykpO1xuICAgICAgZGlmZnMuZm9yRWFjaFJlbW92ZWRJdGVtKHVuc3Vic2NyaWJlKTtcbiAgICB9XG4gIH1cblxuICBvbkRyYWdTdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IHt9O1xuXG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgZHJhZ2dlciBvZiB0aGlzLmRyYWdnYWJsZXMudG9BcnJheSgpKSB7XG4gICAgICBjb25zdCBlbG0gPSBkcmFnZ2VyLmVsZW1lbnQ7XG4gICAgICBjb25zdCBsZWZ0ID0gcGFyc2VJbnQoZWxtLm9mZnNldExlZnQudG9TdHJpbmcoKSwgMCk7XG4gICAgICB0aGlzLnBvc2l0aW9uc1tkcmFnZ2VyLmRyYWdNb2RlbC5wcm9wXSA9IHtcbiAgICAgICAgbGVmdCxcbiAgICAgICAgcmlnaHQ6IGxlZnQgKyBwYXJzZUludChlbG0ub2Zmc2V0V2lkdGgudG9TdHJpbmcoKSwgMCksXG4gICAgICAgIGluZGV4OiBpKyssXG4gICAgICAgIGVsZW1lbnQ6IGVsbVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBvbkRyYWdnaW5nKHsgZWxlbWVudCwgbW9kZWwsIGV2ZW50IH06IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHByZXZQb3MgPSB0aGlzLnBvc2l0aW9uc1ttb2RlbC5wcm9wXTtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmlzVGFyZ2V0KG1vZGVsLCBldmVudCk7XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICBpZiAodGhpcy5sYXN0RHJhZ2dpbmdJbmRleCAhPT0gdGFyZ2V0LmkpIHtcbiAgICAgICAgdGhpcy50YXJnZXRDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgIHByZXZJbmRleDogdGhpcy5sYXN0RHJhZ2dpbmdJbmRleCxcbiAgICAgICAgICBuZXdJbmRleDogdGFyZ2V0LmksXG4gICAgICAgICAgaW5pdGlhbEluZGV4OiBwcmV2UG9zLmluZGV4XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxhc3REcmFnZ2luZ0luZGV4ID0gdGFyZ2V0Lmk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmxhc3REcmFnZ2luZ0luZGV4ICE9PSBwcmV2UG9zLmluZGV4KSB7XG4gICAgICB0aGlzLnRhcmdldENoYW5nZWQuZW1pdCh7XG4gICAgICAgIHByZXZJbmRleDogdGhpcy5sYXN0RHJhZ2dpbmdJbmRleCxcbiAgICAgICAgaW5pdGlhbEluZGV4OiBwcmV2UG9zLmluZGV4XG4gICAgICB9KTtcbiAgICAgIHRoaXMubGFzdERyYWdnaW5nSW5kZXggPSBwcmV2UG9zLmluZGV4O1xuICAgIH1cbiAgfVxuXG4gIG9uRHJhZ0VuZCh7IGVsZW1lbnQsIG1vZGVsLCBldmVudCB9OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2UG9zID0gdGhpcy5wb3NpdGlvbnNbbW9kZWwucHJvcF07XG5cbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmlzVGFyZ2V0KG1vZGVsLCBldmVudCk7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5yZW9yZGVyLmVtaXQoe1xuICAgICAgICBwcmV2SW5kZXg6IHByZXZQb3MuaW5kZXgsXG4gICAgICAgIG5ld0luZGV4OiB0YXJnZXQuaSxcbiAgICAgICAgbW9kZWxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMubGFzdERyYWdnaW5nSW5kZXggPSB1bmRlZmluZWQ7XG4gICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICB9XG5cbiAgaXNUYXJnZXQobW9kZWw6IGFueSwgZXZlbnQ6IGFueSk6IGFueSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IHggPSBldmVudC54IHx8IGV2ZW50LmNsaWVudFg7XG4gICAgY29uc3QgeSA9IGV2ZW50LnkgfHwgZXZlbnQuY2xpZW50WTtcbiAgICBjb25zdCB0YXJnZXRzID0gdGhpcy5kb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludCh4LCB5KTtcblxuICAgIGZvciAoY29uc3QgcHJvcCBpbiB0aGlzLnBvc2l0aW9ucykge1xuICAgICAgLy8gY3VycmVudCBjb2x1bW4gcG9zaXRpb24gd2hpY2ggdGhyb3dzIGV2ZW50LlxuICAgICAgY29uc3QgcG9zID0gdGhpcy5wb3NpdGlvbnNbcHJvcF07XG5cbiAgICAgIC8vIHNpbmNlIHdlIGRyYWcgdGhlIGlubmVyIHNwYW4sIHdlIG5lZWQgdG8gZmluZCBpdCBpbiB0aGUgZWxlbWVudHMgYXQgdGhlIGN1cnNvclxuICAgICAgaWYgKG1vZGVsLnByb3AgIT09IHByb3AgJiYgdGFyZ2V0cy5maW5kKChlbDogYW55KSA9PiBlbCA9PT0gcG9zLmVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcG9zLFxuICAgICAgICAgIGlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlTWFwRGlmZnMoKTogeyBba2V5OiBzdHJpbmddOiBEcmFnZ2FibGVEaXJlY3RpdmUgfSB7XG4gICAgcmV0dXJuIHRoaXMuZHJhZ2dhYmxlcy50b0FycmF5KCkucmVkdWNlKChhY2MsIGN1cnIpID0+IHtcbiAgICAgIGFjY1tjdXJyLmRyYWdNb2RlbC4kJGlkXSA9IGN1cnI7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfVxufVxuIl19