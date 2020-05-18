import { __decorate, __values } from "tslib";
import { ElementRef, NgZone, ChangeDetectorRef, Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VisibilityObserver } from '../utils/visibility-observer';
var BaseChartComponent = /** @class */ (function () {
    function BaseChartComponent(chartElement, zone, cd) {
        this.chartElement = chartElement;
        this.zone = zone;
        this.cd = cd;
        this.scheme = 'cool';
        this.schemeType = 'ordinal';
        this.animations = true;
        this.select = new EventEmitter();
    }
    BaseChartComponent.prototype.ngAfterViewInit = function () {
        this.bindWindowResizeEvent();
        // listen for visibility of the element for hidden by default scenario
        this.visibilityObserver = new VisibilityObserver(this.chartElement, this.zone);
        this.visibilityObserver.visible.subscribe(this.update.bind(this));
    };
    BaseChartComponent.prototype.ngOnDestroy = function () {
        this.unbindEvents();
        if (this.visibilityObserver) {
            this.visibilityObserver.visible.unsubscribe();
            this.visibilityObserver.destroy();
        }
    };
    BaseChartComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    BaseChartComponent.prototype.update = function () {
        if (this.results) {
            this.results = this.cloneData(this.results);
        }
        else {
            this.results = [];
        }
        if (this.view) {
            this.width = this.view[0];
            this.height = this.view[1];
        }
        else {
            var dims = this.getContainerDims();
            if (dims) {
                this.width = dims.width;
                this.height = dims.height;
            }
        }
        // default values if width or height are 0 or undefined
        if (!this.width) {
            this.width = 600;
        }
        if (!this.height) {
            this.height = 400;
        }
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        if (this.cd) {
            this.cd.markForCheck();
        }
    };
    BaseChartComponent.prototype.getContainerDims = function () {
        var width;
        var height;
        var hostElem = this.chartElement.nativeElement;
        if (hostElem.parentNode !== null) {
            // Get the container dimensions
            var dims = hostElem.parentNode.getBoundingClientRect();
            width = dims.width;
            height = dims.height;
        }
        if (width && height) {
            return { width: width, height: height };
        }
        return null;
    };
    /**
     * Converts all date objects that appear as name
     * into formatted date strings
     */
    BaseChartComponent.prototype.formatDates = function () {
        for (var i = 0; i < this.results.length; i++) {
            var g = this.results[i];
            g.label = g.name;
            if (g.label instanceof Date) {
                g.label = g.label.toLocaleDateString();
            }
            if (g.series) {
                for (var j = 0; j < g.series.length; j++) {
                    var d = g.series[j];
                    d.label = d.name;
                    if (d.label instanceof Date) {
                        d.label = d.label.toLocaleDateString();
                    }
                }
            }
        }
    };
    BaseChartComponent.prototype.unbindEvents = function () {
        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    };
    BaseChartComponent.prototype.bindWindowResizeEvent = function () {
        var _this = this;
        var source = observableFromEvent(window, 'resize');
        var subscription = source.pipe(debounceTime(200)).subscribe(function (e) {
            _this.update();
            if (_this.cd) {
                _this.cd.markForCheck();
            }
        });
        this.resizeSubscription = subscription;
    };
    /**
     * Clones the data into a new object
     *
     * @memberOf BaseChart
     */
    BaseChartComponent.prototype.cloneData = function (data) {
        var e_1, _a, e_2, _b;
        var results = [];
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var item = data_1_1.value;
                var copy = {
                    name: item['name']
                };
                if (item['value'] !== undefined) {
                    copy['value'] = item['value'];
                }
                if (item['series'] !== undefined) {
                    copy['series'] = [];
                    try {
                        for (var _c = (e_2 = void 0, __values(item['series'])), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var seriesItem = _d.value;
                            var seriesItemCopy = Object.assign({}, seriesItem);
                            copy['series'].push(seriesItemCopy);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                if (item['extra'] !== undefined) {
                    copy['extra'] = JSON.parse(JSON.stringify(item['extra']));
                }
                results.push(copy);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return results;
    };
    BaseChartComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], BaseChartComponent.prototype, "results", void 0);
    __decorate([
        Input()
    ], BaseChartComponent.prototype, "view", void 0);
    __decorate([
        Input()
    ], BaseChartComponent.prototype, "scheme", void 0);
    __decorate([
        Input()
    ], BaseChartComponent.prototype, "schemeType", void 0);
    __decorate([
        Input()
    ], BaseChartComponent.prototype, "customColors", void 0);
    __decorate([
        Input()
    ], BaseChartComponent.prototype, "animations", void 0);
    __decorate([
        Output()
    ], BaseChartComponent.prototype, "select", void 0);
    BaseChartComponent = __decorate([
        Component({
            selector: 'base-chart',
            template: " <div></div> "
        })
    ], BaseChartComponent);
    return BaseChartComponent;
}());
export { BaseChartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osYUFBYSxFQUNiLFNBQVMsRUFDVCxTQUFTLEVBQ1QsYUFBYSxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBTWxFO0lBZUUsNEJBQXNCLFlBQXdCLEVBQVksSUFBWSxFQUFZLEVBQXFCO1FBQWpGLGlCQUFZLEdBQVosWUFBWSxDQUFZO1FBQVksU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFZLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBWjlGLFdBQU0sR0FBUSxNQUFNLENBQUM7UUFDckIsZUFBVSxHQUFXLFNBQVMsQ0FBQztRQUUvQixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBT29FLENBQUM7SUFFM0csNENBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRTdCLHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENB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T0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwQjs7Ozs7Ozs7O1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Z0JBdEptQyxVQUFVO2dCQUFrQixNQUFNO2dCQUFnQixpQkFBaUI7O0lBZDlGO1FBQVIsS0FBSyxFQUFFO3VEQUFjO0lBQ2I7UUFBUixLQUFLLEVBQUU7b0RBQXdCO0lBQ3ZCO1FBQVIsS0FBSyxFQUFFO3NEQUFzQjtJQUNyQjtRQUFSLEtBQUssRUFBRTswREFBZ0M7SUFDL0I7UUFBUixLQUFLLEVBQUU7NERBQW1CO0lBQ2xCO1FBQVIsS0FBSyxFQUFFOzBEQUE0QjtJQUUxQjtRQUFULE1BQU0sRUFBRTtzREFBNkI7SUFSM0Isa0JBQWtCO1FBSjlCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxlQUFlO1NBQzFCLENBQUM7T0FDVyxrQkFBa0IsQ0FzSzlCO0lBQUQseUJBQUM7Q0FBQSxBQXRLRCxJQXNLQztTQXRLWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBFbGVtZW50UmVmLFxuICBOZ1pvbmUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGZyb21FdmVudCBhcyBvYnNlcnZhYmxlRnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBWaXNpYmlsaXR5T2JzZXJ2ZXIgfSBmcm9tICcuLi91dGlscy92aXNpYmlsaXR5LW9ic2VydmVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYmFzZS1jaGFydCcsXG4gIHRlbXBsYXRlOiBgIDxkaXY+PC9kaXY+IGBcbn0pXG5leHBvcnQgY2xhc3MgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSByZXN1bHRzOiBhbnk7XG4gIEBJbnB1dCgpIHZpZXc6IFtudW1iZXIsIG51bWJlcl07XG4gIEBJbnB1dCgpIHNjaGVtZTogYW55ID0gJ2Nvb2wnO1xuICBASW5wdXQoKSBzY2hlbWVUeXBlOiBzdHJpbmcgPSAnb3JkaW5hbCc7XG4gIEBJbnB1dCgpIGN1c3RvbUNvbG9yczogYW55O1xuICBASW5wdXQoKSBhbmltYXRpb25zOiBib29sZWFuID0gdHJ1ZTtcblxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICByZXNpemVTdWJzY3JpcHRpb246IGFueTtcbiAgdmlzaWJpbGl0eU9ic2VydmVyOiBWaXNpYmlsaXR5T2JzZXJ2ZXI7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNoYXJ0RWxlbWVudDogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSwgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5iaW5kV2luZG93UmVzaXplRXZlbnQoKTtcblxuICAgIC8vIGxpc3RlbiBmb3IgdmlzaWJpbGl0eSBvZiB0aGUgZWxlbWVudCBmb3IgaGlkZGVuIGJ5IGRlZmF1bHQgc2NlbmFyaW9cbiAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlciA9IG5ldyBWaXNpYmlsaXR5T2JzZXJ2ZXIodGhpcy5jaGFydEVsZW1lbnQsIHRoaXMuem9uZSk7XG4gICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIudmlzaWJsZS5zdWJzY3JpYmUodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuYmluZEV2ZW50cygpO1xuICAgIGlmICh0aGlzLnZpc2liaWxpdHlPYnNlcnZlcikge1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIudmlzaWJsZS51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlc3VsdHMpIHtcbiAgICAgIHRoaXMucmVzdWx0cyA9IHRoaXMuY2xvbmVEYXRhKHRoaXMucmVzdWx0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMud2lkdGggPSB0aGlzLnZpZXdbMF07XG4gICAgICB0aGlzLmhlaWdodCA9IHRoaXMudmlld1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGltcyA9IHRoaXMuZ2V0Q29udGFpbmVyRGltcygpO1xuICAgICAgaWYgKGRpbXMpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IGRpbXMud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZGltcy5oZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdCB2YWx1ZXMgaWYgd2lkdGggb3IgaGVpZ2h0IGFyZSAwIG9yIHVuZGVmaW5lZFxuICAgIGlmICghdGhpcy53aWR0aCkge1xuICAgICAgdGhpcy53aWR0aCA9IDYwMDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVpZ2h0KSB7XG4gICAgICB0aGlzLmhlaWdodCA9IDQwMDtcbiAgICB9XG5cbiAgICB0aGlzLndpZHRoID0gTWF0aC5mbG9vcih0aGlzLndpZHRoKTtcbiAgICB0aGlzLmhlaWdodCA9IE1hdGguZmxvb3IodGhpcy5oZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuY2QpIHtcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29udGFpbmVyRGltcygpOiBhbnkge1xuICAgIGxldCB3aWR0aDtcbiAgICBsZXQgaGVpZ2h0O1xuICAgIGNvbnN0IGhvc3RFbGVtID0gdGhpcy5jaGFydEVsZW1lbnQubmF0aXZlRWxlbWVudDtcblxuICAgIGlmIChob3N0RWxlbS5wYXJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAvLyBHZXQgdGhlIGNvbnRhaW5lciBkaW1lbnNpb25zXG4gICAgICBjb25zdCBkaW1zID0gaG9zdEVsZW0ucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHdpZHRoID0gZGltcy53aWR0aDtcbiAgICAgIGhlaWdodCA9IGRpbXMuaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmICh3aWR0aCAmJiBoZWlnaHQpIHtcbiAgICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbGwgZGF0ZSBvYmplY3RzIHRoYXQgYXBwZWFyIGFzIG5hbWVcbiAgICogaW50byBmb3JtYXR0ZWQgZGF0ZSBzdHJpbmdzXG4gICAqL1xuICBmb3JtYXREYXRlcygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZyA9IHRoaXMucmVzdWx0c1tpXTtcbiAgICAgIGcubGFiZWwgPSBnLm5hbWU7XG4gICAgICBpZiAoZy5sYWJlbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgZy5sYWJlbCA9IGcubGFiZWwudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChnLnNlcmllcykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGcuc2VyaWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgZCA9IGcuc2VyaWVzW2pdO1xuICAgICAgICAgIGQubGFiZWwgPSBkLm5hbWU7XG4gICAgICAgICAgaWYgKGQubGFiZWwgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICBkLmxhYmVsID0gZC5sYWJlbC50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdW5iaW5kRXZlbnRzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5yZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGJpbmRXaW5kb3dSZXNpemVFdmVudCgpOiB2b2lkIHtcbiAgICBjb25zdCBzb3VyY2UgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5waXBlKGRlYm91bmNlVGltZSgyMDApKS5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgaWYgKHRoaXMuY2QpIHtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbiA9IHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9uZXMgdGhlIGRhdGEgaW50byBhIG5ldyBvYmplY3RcbiAgICpcbiAgICogQG1lbWJlck9mIEJhc2VDaGFydFxuICAgKi9cbiAgcHJpdmF0ZSBjbG9uZURhdGEoZGF0YSk6IGFueSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEpIHtcbiAgICAgIGNvbnN0IGNvcHkgPSB7XG4gICAgICAgIG5hbWU6IGl0ZW1bJ25hbWUnXVxuICAgICAgfTtcblxuICAgICAgaWYgKGl0ZW1bJ3ZhbHVlJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb3B5Wyd2YWx1ZSddID0gaXRlbVsndmFsdWUnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bJ3NlcmllcyddICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29weVsnc2VyaWVzJ10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBzZXJpZXNJdGVtIG9mIGl0ZW1bJ3NlcmllcyddKSB7XG4gICAgICAgICAgY29uc3Qgc2VyaWVzSXRlbUNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCBzZXJpZXNJdGVtKTtcbiAgICAgICAgICBjb3B5WydzZXJpZXMnXS5wdXNoKHNlcmllc0l0ZW1Db3B5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsnZXh0cmEnXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvcHlbJ2V4dHJhJ10gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGl0ZW1bJ2V4dHJhJ10pKTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cy5wdXNoKGNvcHkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG59XG4iXX0=