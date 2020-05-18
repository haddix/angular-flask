import { __decorate, __read, __spread, __values } from "tslib";
import { Component, Input, Output, EventEmitter, ElementRef, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { brushX } from 'd3-brush';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { select, event as d3event } from 'd3-selection';
import { id } from '../..//utils/id';
var Timeline = /** @class */ (function () {
    function Timeline(element, cd) {
        this.cd = cd;
        this.height = 50;
        this.select = new EventEmitter();
        this.onDomainChange = new EventEmitter();
        this.initialized = false;
        this.element = element.nativeElement;
    }
    Timeline.prototype.ngOnChanges = function (changes) {
        this.update();
        if (!this.initialized) {
            this.addBrush();
            this.initialized = true;
        }
    };
    Timeline.prototype.update = function () {
        this.dims = this.getDims();
        this.height = this.dims.height;
        var offsetY = this.view[1] - this.height;
        this.xDomain = this.getXDomain();
        this.xScale = this.getXScale();
        if (this.brush) {
            this.updateBrush();
        }
        this.transform = "translate(0 , " + offsetY + ")";
        this.filterId = 'filter' + id().toString();
        this.filter = "url(#" + this.filterId + ")";
        this.cd.markForCheck();
    };
    Timeline.prototype.getXDomain = function () {
        var e_1, _a, e_2, _b;
        var values = [];
        try {
            for (var _c = __values(this.results), _d = _c.next(); !_d.done; _d = _c.next()) {
                var results = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values(results.series)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var d = _f.value;
                        if (!values.includes(d.name)) {
                            values.push(d.name);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var domain = [];
        if (this.scaleType === 'time') {
            var min = Math.min.apply(Math, __spread(values));
            var max = Math.max.apply(Math, __spread(values));
            domain = [min, max];
        }
        else if (this.scaleType === 'linear') {
            values = values.map(function (v) { return Number(v); });
            var min = Math.min.apply(Math, __spread(values));
            var max = Math.max.apply(Math, __spread(values));
            domain = [min, max];
        }
        else {
            domain = values;
        }
        return domain;
    };
    Timeline.prototype.getXScale = function () {
        var scale;
        if (this.scaleType === 'time') {
            scale = scaleTime().range([0, this.dims.width]).domain(this.xDomain);
        }
        else if (this.scaleType === 'linear') {
            scale = scaleLinear().range([0, this.dims.width]).domain(this.xDomain);
        }
        else if (this.scaleType === 'ordinal') {
            scale = scalePoint().range([0, this.dims.width]).padding(0.1).domain(this.xDomain);
        }
        return scale;
    };
    Timeline.prototype.addBrush = function () {
        var _this = this;
        if (this.brush)
            return;
        var height = this.height;
        var width = this.view[0];
        this.brush = brushX()
            .extent([
            [0, 0],
            [width, height]
        ])
            .on('brush end', function () {
            var selection = d3event.selection || _this.xScale.range();
            var newDomain = selection.map(_this.xScale.invert);
            _this.onDomainChange.emit(newDomain);
            _this.cd.markForCheck();
        });
        select(this.element).select('.brush').call(this.brush);
    };
    Timeline.prototype.updateBrush = function () {
        if (!this.brush)
            return;
        var height = this.height;
        var width = this.view[0];
        this.brush.extent([
            [0, 0],
            [width, height]
        ]);
        select(this.element).select('.brush').call(this.brush);
        // clear hardcoded properties so they can be defined by CSS
        select(this.element)
            .select('.selection')
            .attr('fill', undefined)
            .attr('stroke', undefined)
            .attr('fill-opacity', undefined);
        this.cd.markForCheck();
    };
    Timeline.prototype.getDims = function () {
        var width = this.view[0];
        var dims = {
            width: width,
            height: this.height
        };
        return dims;
    };
    Timeline.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], Timeline.prototype, "view", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "state", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "results", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "scheme", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "customColors", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "legend", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "miniChart", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "autoScale", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "scaleType", void 0);
    __decorate([
        Input()
    ], Timeline.prototype, "height", void 0);
    __decorate([
        Output()
    ], Timeline.prototype, "select", void 0);
    __decorate([
        Output()
    ], Timeline.prototype, "onDomainChange", void 0);
    Timeline = __decorate([
        Component({
            selector: 'g[ngx-charts-timeline]',
            template: "\n    <svg:g class=\"timeline\" [attr.transform]=\"transform\">\n      <svg:filter [attr.id]=\"filterId\">\n        <svg:feColorMatrix\n          in=\"SourceGraphic\"\n          type=\"matrix\"\n          values=\"0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\"\n        />\n      </svg:filter>\n      <svg:g class=\"embedded-chart\">\n        <ng-content></ng-content>\n      </svg:g>\n      <svg:rect x=\"0\" [attr.width]=\"view[0]\" y=\"0\" [attr.height]=\"height\" class=\"brush-background\" />\n      <svg:g class=\"brush\"></svg:g>\n    </svg:g>\n  ",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".timeline .brush-background{fill:rgba(0,0,0,.05)}.timeline .brush .selection{fill:rgba(0,0,0,.1);stroke-width:1px;stroke:#888}.timeline .brush .handle{fill-opacity:0}.timeline .embedded-chart{opacity:.6}"]
        })
    ], Timeline);
    return Timeline;
}());
export { Timeline };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvY29tbW9uL3RpbWVsaW5lL3RpbWVsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsYUFBYSxFQUNiLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDeEQsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBd0JyQztJQXlCRSxrQkFBWSxPQUFtQixFQUFVLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBZnJELFdBQU0sR0FBVyxFQUFFLENBQUM7UUFFbkIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUIsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBUTlDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBSzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsOEJBQVcsR0FBWCxVQUFZLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsV0FB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LENBQUMsQ0FBQztRQUUzQixJQUFNLElBQUksR0FBRztZQUNYLEtBQUssT0FBQTtZQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOztnQkFoSW9CLFVBQVU7Z0JBQWMsaUJBQWlCOztJQXhCckQ7UUFBUixLQUFLLEVBQUU7MENBQU07SUFDTDtRQUFSLEtBQUssRUFBRTsyQ0FBTztJQUNOO1FBQVIsS0FBSyxFQUFFOzZDQUFTO0lBQ1I7UUFBUixLQUFLLEVBQUU7NENBQVE7SUFDUDtRQUFSLEtBQUssRUFBRTtrREFBYztJQUNiO1FBQVIsS0FBSyxFQUFFOzRDQUFRO0lBQ1A7UUFBUixLQUFLLEVBQUU7K0NBQVc7SUFDVjtRQUFSLEtBQUssRUFBRTsrQ0FBVztJQUNWO1FBQVIsS0FBSyxFQUFFOytDQUFXO0lBQ1Y7UUFBUixLQUFLLEVBQUU7NENBQXFCO0lBRW5CO1FBQVQsTUFBTSxFQUFFOzRDQUE2QjtJQUM1QjtRQUFULE1BQU0sRUFBRTtvREFBcUM7SUFibkMsUUFBUTtRQXRCcEIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxRQUFRLEVBQUUsb2xCQWVUO1lBRUQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7WUFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O1NBQ2hELENBQUM7T0FDVyxRQUFRLENBMEpwQjtJQUFELGVBQUM7Q0FBQSxBQTFKRCxJQTBKQztTQTFKWSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGJydXNoWCB9IGZyb20gJ2QzLWJydXNoJztcbmltcG9ydCB7IHNjYWxlTGluZWFyLCBzY2FsZVRpbWUsIHNjYWxlUG9pbnQgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBzZWxlY3QsIGV2ZW50IGFzIGQzZXZlbnQgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi8vdXRpbHMvaWQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtdGltZWxpbmVdJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3ZnOmcgY2xhc3M9XCJ0aW1lbGluZVwiIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIj5cbiAgICAgIDxzdmc6ZmlsdGVyIFthdHRyLmlkXT1cImZpbHRlcklkXCI+XG4gICAgICAgIDxzdmc6ZmVDb2xvck1hdHJpeFxuICAgICAgICAgIGluPVwiU291cmNlR3JhcGhpY1wiXG4gICAgICAgICAgdHlwZT1cIm1hdHJpeFwiXG4gICAgICAgICAgdmFsdWVzPVwiMC4zMzMzIDAuMzMzMyAwLjMzMzMgMCAwIDAuMzMzMyAwLjMzMzMgMC4zMzMzIDAgMCAwLjMzMzMgMC4zMzMzIDAuMzMzMyAwIDAgMCAwIDAgMSAwXCJcbiAgICAgICAgLz5cbiAgICAgIDwvc3ZnOmZpbHRlcj5cbiAgICAgIDxzdmc6ZyBjbGFzcz1cImVtYmVkZGVkLWNoYXJ0XCI+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvc3ZnOmc+XG4gICAgICA8c3ZnOnJlY3QgeD1cIjBcIiBbYXR0ci53aWR0aF09XCJ2aWV3WzBdXCIgeT1cIjBcIiBbYXR0ci5oZWlnaHRdPVwiaGVpZ2h0XCIgY2xhc3M9XCJicnVzaC1iYWNrZ3JvdW5kXCIgLz5cbiAgICAgIDxzdmc6ZyBjbGFzcz1cImJydXNoXCI+PC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi90aW1lbGluZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBUaW1lbGluZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHZpZXc7XG4gIEBJbnB1dCgpIHN0YXRlO1xuICBASW5wdXQoKSByZXN1bHRzO1xuICBASW5wdXQoKSBzY2hlbWU7XG4gIEBJbnB1dCgpIGN1c3RvbUNvbG9ycztcbiAgQElucHV0KCkgbGVnZW5kO1xuICBASW5wdXQoKSBtaW5pQ2hhcnQ7XG4gIEBJbnB1dCgpIGF1dG9TY2FsZTtcbiAgQElucHV0KCkgc2NhbGVUeXBlO1xuICBASW5wdXQoKSBoZWlnaHQ6IG51bWJlciA9IDUwO1xuXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkRvbWFpbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgZGltczogYW55O1xuICB4RG9tYWluOiBhbnlbXTtcbiAgeFNjYWxlOiBhbnk7XG4gIGJydXNoOiBhbnk7XG4gIHRyYW5zZm9ybTogc3RyaW5nO1xuICBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuICBmaWx0ZXJJZDogYW55O1xuICBmaWx0ZXI6IGFueTtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmFkZEJydXNoKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5kaW1zID0gdGhpcy5nZXREaW1zKCk7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmRpbXMuaGVpZ2h0O1xuICAgIGNvbnN0IG9mZnNldFkgPSB0aGlzLnZpZXdbMV0gLSB0aGlzLmhlaWdodDtcblxuICAgIHRoaXMueERvbWFpbiA9IHRoaXMuZ2V0WERvbWFpbigpO1xuICAgIHRoaXMueFNjYWxlID0gdGhpcy5nZXRYU2NhbGUoKTtcblxuICAgIGlmICh0aGlzLmJydXNoKSB7XG4gICAgICB0aGlzLnVwZGF0ZUJydXNoKCk7XG4gICAgfVxuXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAgLCAke29mZnNldFl9KWA7XG5cbiAgICB0aGlzLmZpbHRlcklkID0gJ2ZpbHRlcicgKyBpZCgpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5maWx0ZXIgPSBgdXJsKCMke3RoaXMuZmlsdGVySWR9KWA7XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0WERvbWFpbigpOiBhbnlbXSB7XG4gICAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCByZXN1bHRzIG9mIHRoaXMucmVzdWx0cykge1xuICAgICAgZm9yIChjb25zdCBkIG9mIHJlc3VsdHMuc2VyaWVzKSB7XG4gICAgICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKGQubmFtZSkpIHtcbiAgICAgICAgICB2YWx1ZXMucHVzaChkLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGRvbWFpbiA9IFtdO1xuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbiguLi52YWx1ZXMpO1xuICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udmFsdWVzKTtcbiAgICAgIGRvbWFpbiA9IFttaW4sIG1heF07XG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpIHtcbiAgICAgIHZhbHVlcyA9IHZhbHVlcy5tYXAodiA9PiBOdW1iZXIodikpO1xuICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udmFsdWVzKTtcbiAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XG4gICAgICBkb21haW4gPSBbbWluLCBtYXhdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb21haW4gPSB2YWx1ZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIGdldFhTY2FsZSgpIHtcbiAgICBsZXQgc2NhbGU7XG5cbiAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xuICAgICAgc2NhbGUgPSBzY2FsZVRpbWUoKS5yYW5nZShbMCwgdGhpcy5kaW1zLndpZHRoXSkuZG9tYWluKHRoaXMueERvbWFpbik7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpIHtcbiAgICAgIHNjYWxlID0gc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgdGhpcy5kaW1zLndpZHRoXSkuZG9tYWluKHRoaXMueERvbWFpbik7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICBzY2FsZSA9IHNjYWxlUG9pbnQoKS5yYW5nZShbMCwgdGhpcy5kaW1zLndpZHRoXSkucGFkZGluZygwLjEpLmRvbWFpbih0aGlzLnhEb21haW4pO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIGFkZEJydXNoKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmJydXNoKSByZXR1cm47XG5cbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMudmlld1swXTtcblxuICAgIHRoaXMuYnJ1c2ggPSBicnVzaFgoKVxuICAgICAgLmV4dGVudChbXG4gICAgICAgIFswLCAwXSxcbiAgICAgICAgW3dpZHRoLCBoZWlnaHRdXG4gICAgICBdKVxuICAgICAgLm9uKCdicnVzaCBlbmQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGQzZXZlbnQuc2VsZWN0aW9uIHx8IHRoaXMueFNjYWxlLnJhbmdlKCk7XG4gICAgICAgIGNvbnN0IG5ld0RvbWFpbiA9IHNlbGVjdGlvbi5tYXAodGhpcy54U2NhbGUuaW52ZXJ0KTtcblxuICAgICAgICB0aGlzLm9uRG9tYWluQ2hhbmdlLmVtaXQobmV3RG9tYWluKTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuXG4gICAgc2VsZWN0KHRoaXMuZWxlbWVudCkuc2VsZWN0KCcuYnJ1c2gnKS5jYWxsKHRoaXMuYnJ1c2gpO1xuICB9XG5cbiAgdXBkYXRlQnJ1c2goKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmJydXNoKSByZXR1cm47XG5cbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMudmlld1swXTtcblxuICAgIHRoaXMuYnJ1c2guZXh0ZW50KFtcbiAgICAgIFswLCAwXSxcbiAgICAgIFt3aWR0aCwgaGVpZ2h0XVxuICAgIF0pO1xuICAgIHNlbGVjdCh0aGlzLmVsZW1lbnQpLnNlbGVjdCgnLmJydXNoJykuY2FsbCh0aGlzLmJydXNoKTtcblxuICAgIC8vIGNsZWFyIGhhcmRjb2RlZCBwcm9wZXJ0aWVzIHNvIHRoZXkgY2FuIGJlIGRlZmluZWQgYnkgQ1NTXG4gICAgc2VsZWN0KHRoaXMuZWxlbWVudClcbiAgICAgIC5zZWxlY3QoJy5zZWxlY3Rpb24nKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCB1bmRlZmluZWQpXG4gICAgICAuYXR0cignc3Ryb2tlJywgdW5kZWZpbmVkKVxuICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIHVuZGVmaW5lZCk7XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0RGltcygpOiBhbnkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy52aWV3WzBdO1xuXG4gICAgY29uc3QgZGltcyA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxuICAgIH07XG5cbiAgICByZXR1cm4gZGltcztcbiAgfVxufVxuIl19