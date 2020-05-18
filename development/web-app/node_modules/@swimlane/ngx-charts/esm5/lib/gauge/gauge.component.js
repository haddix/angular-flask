import { __decorate, __extends, __read, __spread, __values } from "tslib";
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation, ContentChild } from '@angular/core';
import { scaleLinear } from 'd3-scale';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
var GaugeComponent = /** @class */ (function (_super) {
    __extends(GaugeComponent, _super);
    function GaugeComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.legend = false;
        _this.legendTitle = 'Legend';
        _this.legendPosition = 'right';
        _this.min = 0;
        _this.max = 100;
        _this.bigSegments = 10;
        _this.smallSegments = 5;
        _this.showAxis = true;
        _this.startAngle = -120;
        _this.angleSpan = 240;
        _this.activeEntries = [];
        _this.tooltipDisabled = false;
        _this.showText = true;
        _this.activate = new EventEmitter();
        _this.deactivate = new EventEmitter();
        _this.resizeScale = 1;
        _this.rotation = '';
        _this.textTransform = 'scale(1, 1)';
        _this.cornerRadius = 10;
        return _this;
    }
    GaugeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        _super.prototype.ngAfterViewInit.call(this);
        setTimeout(function () { return _this.scaleText(); });
    };
    GaugeComponent.prototype.update = function () {
        var _this = this;
        _super.prototype.update.call(this);
        if (!this.showAxis) {
            if (!this.margin) {
                this.margin = [10, 20, 10, 20];
            }
        }
        else {
            if (!this.margin) {
                this.margin = [60, 100, 60, 100];
            }
        }
        // make the starting angle positive
        if (this.startAngle < 0) {
            this.startAngle = (this.startAngle % 360) + 360;
        }
        this.angleSpan = Math.min(this.angleSpan, 360);
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showLegend: this.legend,
            legendPosition: this.legendPosition
        });
        this.domain = this.getDomain();
        this.valueDomain = this.getValueDomain();
        this.valueScale = this.getValueScale();
        this.displayValue = this.getDisplayValue();
        this.outerRadius = Math.min(this.dims.width, this.dims.height) / 2;
        this.arcs = this.getArcs();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        var xOffset = this.margin[3] + this.dims.width / 2;
        var yOffset = this.margin[0] + this.dims.height / 2;
        this.transform = "translate(" + xOffset + ", " + yOffset + ")";
        this.rotation = "rotate(" + this.startAngle + ")";
        setTimeout(function () { return _this.scaleText(); }, 50);
    };
    GaugeComponent.prototype.getArcs = function () {
        var e_1, _a;
        var arcs = [];
        var availableRadius = this.outerRadius * 0.7;
        var radiusPerArc = Math.min(availableRadius / this.results.length, 10);
        var arcWidth = radiusPerArc * 0.7;
        this.textRadius = this.outerRadius - this.results.length * radiusPerArc;
        this.cornerRadius = Math.floor(arcWidth / 2);
        var i = 0;
        try {
            for (var _b = __values(this.results), _c = _b.next(); !_c.done; _c = _b.next()) {
                var d = _c.value;
                var outerRadius = this.outerRadius - i * radiusPerArc;
                var innerRadius = outerRadius - arcWidth;
                var backgroundArc = {
                    endAngle: (this.angleSpan * Math.PI) / 180,
                    innerRadius: innerRadius,
                    outerRadius: outerRadius,
                    data: {
                        value: this.max,
                        name: d.name
                    }
                };
                var valueArc = {
                    endAngle: (Math.min(this.valueScale(d.value), this.angleSpan) * Math.PI) / 180,
                    innerRadius: innerRadius,
                    outerRadius: outerRadius,
                    data: {
                        value: d.value,
                        name: d.name
                    }
                };
                var arc = {
                    backgroundArc: backgroundArc,
                    valueArc: valueArc
                };
                arcs.push(arc);
                i++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return arcs;
    };
    GaugeComponent.prototype.getDomain = function () {
        return this.results.map(function (d) { return d.name; });
    };
    GaugeComponent.prototype.getValueDomain = function () {
        var values = this.results.map(function (d) { return d.value; });
        var dataMin = Math.min.apply(Math, __spread(values));
        var dataMax = Math.max.apply(Math, __spread(values));
        if (this.min !== undefined) {
            this.min = Math.min(this.min, dataMin);
        }
        else {
            this.min = dataMin;
        }
        if (this.max !== undefined) {
            this.max = Math.max(this.max, dataMax);
        }
        else {
            this.max = dataMax;
        }
        return [this.min, this.max];
    };
    GaugeComponent.prototype.getValueScale = function () {
        return scaleLinear().range([0, this.angleSpan]).nice().domain(this.valueDomain);
    };
    GaugeComponent.prototype.getDisplayValue = function () {
        var value = this.results.map(function (d) { return d.value; }).reduce(function (a, b) { return a + b; }, 0);
        if (this.textValue && 0 !== this.textValue.length) {
            return this.textValue.toLocaleString();
        }
        if (this.valueFormatting) {
            return this.valueFormatting(value);
        }
        return value.toLocaleString();
    };
    GaugeComponent.prototype.scaleText = function (repeat) {
        var _this = this;
        if (repeat === void 0) { repeat = true; }
        if (!this.showText) {
            return;
        }
        var width = this.textEl.nativeElement.getBoundingClientRect().width;
        var oldScale = this.resizeScale;
        if (width === 0) {
            this.resizeScale = 1;
        }
        else {
            var availableSpace = this.textRadius;
            this.resizeScale = Math.floor((availableSpace / (width / this.resizeScale)) * 100) / 100;
        }
        if (this.resizeScale !== oldScale) {
            this.textTransform = "scale(" + this.resizeScale + ", " + this.resizeScale + ")";
            this.cd.markForCheck();
            if (repeat) {
                setTimeout(function () { return _this.scaleText(false); }, 50);
            }
        }
    };
    GaugeComponent.prototype.onClick = function (data) {
        this.select.emit(data);
    };
    GaugeComponent.prototype.getLegendOptions = function () {
        return {
            scaleType: 'ordinal',
            colors: this.colors,
            domain: this.domain,
            title: this.legendTitle,
            position: this.legendPosition
        };
    };
    GaugeComponent.prototype.setColors = function () {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
    };
    GaugeComponent.prototype.onActivate = function (item) {
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = __spread([item], this.activeEntries);
        this.activate.emit({ value: item, entries: this.activeEntries });
    };
    GaugeComponent.prototype.onDeactivate = function (item) {
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = __spread(this.activeEntries);
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    };
    GaugeComponent.prototype.isActive = function (entry) {
        if (!this.activeEntries)
            return false;
        var item = this.activeEntries.find(function (d) {
            return entry.name === d.name && entry.series === d.series;
        });
        return item !== undefined;
    };
    GaugeComponent.prototype.trackBy = function (index, item) {
        return item.valueArc.data.name;
    };
    __decorate([
        Input()
    ], GaugeComponent.prototype, "legend", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "legendTitle", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "legendPosition", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "min", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "max", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "textValue", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "units", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "bigSegments", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "smallSegments", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "results", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "showAxis", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "startAngle", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "angleSpan", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "activeEntries", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "axisTickFormatting", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "valueFormatting", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "showText", void 0);
    __decorate([
        Input()
    ], GaugeComponent.prototype, "margin", void 0);
    __decorate([
        Output()
    ], GaugeComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], GaugeComponent.prototype, "deactivate", void 0);
    __decorate([
        ContentChild('tooltipTemplate')
    ], GaugeComponent.prototype, "tooltipTemplate", void 0);
    __decorate([
        ViewChild('textEl')
    ], GaugeComponent.prototype, "textEl", void 0);
    GaugeComponent = __decorate([
        Component({
            selector: 'ngx-charts-gauge',
            template: "\n    <ngx-charts-chart\n      [view]=\"[width, height]\"\n      [showLegend]=\"legend\"\n      [legendOptions]=\"legendOptions\"\n      [activeEntries]=\"activeEntries\"\n      [animations]=\"animations\"\n      (legendLabelClick)=\"onClick($event)\"\n      (legendLabelActivate)=\"onActivate($event)\"\n      (legendLabelDeactivate)=\"onDeactivate($event)\"\n    >\n      <svg:g [attr.transform]=\"transform\" class=\"gauge chart\">\n        <svg:g *ngFor=\"let arc of arcs; trackBy: trackBy\" [attr.transform]=\"rotation\">\n          <svg:g\n            ngx-charts-gauge-arc\n            [backgroundArc]=\"arc.backgroundArc\"\n            [valueArc]=\"arc.valueArc\"\n            [cornerRadius]=\"cornerRadius\"\n            [colors]=\"colors\"\n            [isActive]=\"isActive(arc.valueArc.data)\"\n            [tooltipDisabled]=\"tooltipDisabled\"\n            [tooltipTemplate]=\"tooltipTemplate\"\n            [valueFormatting]=\"valueFormatting\"\n            [animations]=\"animations\"\n            (select)=\"onClick($event)\"\n            (activate)=\"onActivate($event)\"\n            (deactivate)=\"onDeactivate($event)\"\n          ></svg:g>\n        </svg:g>\n\n        <svg:g\n          ngx-charts-gauge-axis\n          *ngIf=\"showAxis\"\n          [bigSegments]=\"bigSegments\"\n          [smallSegments]=\"smallSegments\"\n          [min]=\"min\"\n          [max]=\"max\"\n          [radius]=\"outerRadius\"\n          [angleSpan]=\"angleSpan\"\n          [valueScale]=\"valueScale\"\n          [startAngle]=\"startAngle\"\n          [tickFormatting]=\"axisTickFormatting\"\n        ></svg:g>\n\n        <svg:text\n          #textEl\n          *ngIf=\"showText\"\n          [style.textAnchor]=\"'middle'\"\n          [attr.transform]=\"textTransform\"\n          alignment-baseline=\"central\"\n        >\n          <tspan x=\"0\" dy=\"0\">{{ displayValue }}</tspan>\n          <tspan x=\"0\" dy=\"1.2em\">{{ units }}</tspan>\n        </svg:text>\n      </svg:g>\n    </ngx-charts-chart>\n  ",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}", ".gauge .background-arc path{fill:rgba(0,0,0,.05)}.gauge .gauge-tick path{stroke:#666}.gauge .gauge-tick text{font-size:12px;fill:#666;font-weight:700}.gauge .gauge-tick-large path{stroke-width:2px}.gauge .gauge-tick-small path{stroke-width:1px}"]
        })
    ], GaugeComponent);
    return GaugeComponent;
}(BaseChartComponent));
export { GaugeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1Z2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvZ2F1Z2UvZ2F1Z2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCxTQUFTLEVBRVQsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFDTixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXZDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSx1QkFBdUIsRUFBa0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFpRXJEO0lBQW9DLGtDQUFrQjtJQUF0RDtRQUFBLHFFQXlRQztRQXhRVSxZQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsaUJBQVcsR0FBVyxRQUFRLENBQUM7UUFDL0Isb0JBQWMsR0FBVyxPQUFPLENBQUM7UUFDakMsU0FBRyxHQUFXLENBQUMsQ0FBQztRQUNoQixTQUFHLEdBQVcsR0FBRyxDQUFDO1FBR2xCLGlCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLG1CQUFhLEdBQVcsQ0FBQyxDQUFDO1FBRTFCLGNBQVEsR0FBWSxJQUFJLENBQUM7UUFDekIsZ0JBQVUsR0FBVyxDQUFDLEdBQUcsQ0FBQztRQUMxQixlQUFTLEdBQVcsR0FBRyxDQUFDO1FBQ3hCLG1CQUFhLEdBQVUsRUFBRSxDQUFDO1FBRTFCLHFCQUFlLEdBQVksS0FBSyxDQUFDO1FBRWpDLGNBQVEsR0FBWSxJQUFJLENBQUM7UUFLeEIsY0FBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGdCQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENB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S0FBSyxFQUFFO21EQUFnQjtJQUNmO1FBQVIsS0FBSyxFQUFFO29EQUEwQjtJQUN6QjtRQUFSLEtBQUssRUFBRTtzREFBMkI7SUFDMUI7UUFBUixLQUFLLEVBQUU7cURBQXlCO0lBQ3hCO1FBQVIsS0FBSyxFQUFFO3lEQUEyQjtJQUMxQjtRQUFSLEtBQUssRUFBRTs4REFBeUI7SUFDeEI7UUFBUixLQUFLLEVBQUU7MkRBQWtDO0lBQ2pDO1FBQVIsS0FBSyxFQUFFOzJEQUF5QztJQUN4QztRQUFSLEtBQUssRUFBRTtvREFBMEI7SUFHekI7UUFBUixLQUFLLEVBQUU7a0RBQWU7SUFFYjtRQUFULE1BQU0sRUFBRTtvREFBa0Q7SUFDakQ7UUFBVCxNQUFNLEVBQUU7c0RBQW9EO0lBRTVCO1FBQWhDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQzsyREFBbUM7SUFFOUM7UUFBcEIsU0FBUyxDQUFDLFFBQVEsQ0FBQztrREFBb0I7SUE1QjdCLGNBQWM7UUEvRDFCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsUUFBUSxFQUFFLGcrREF3RFQ7WUFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7U0FDaEQsQ0FBQztPQUNXLGNBQWMsQ0F5UTFCO0lBQUQscUJBQUM7Q0FBQSxBQXpRRCxDQUFvQyxrQkFBa0IsR0F5UXJEO1NBelFZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBWaWV3Q2hpbGQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENvbnRlbnRDaGlsZCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBzY2FsZUxpbmVhciB9IGZyb20gJ2QzLXNjYWxlJztcblxuaW1wb3J0IHsgQmFzZUNoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50JztcbmltcG9ydCB7IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zLCBWaWV3RGltZW5zaW9ucyB9IGZyb20gJy4uL2NvbW1vbi92aWV3LWRpbWVuc2lvbnMuaGVscGVyJztcbmltcG9ydCB7IENvbG9ySGVscGVyIH0gZnJvbSAnLi4vY29tbW9uL2NvbG9yLmhlbHBlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1jaGFydHMtZ2F1Z2UnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZ3gtY2hhcnRzLWNoYXJ0XG4gICAgICBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIlxuICAgICAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcbiAgICAgIFtsZWdlbmRPcHRpb25zXT1cImxlZ2VuZE9wdGlvbnNcIlxuICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcbiAgICAgIChsZWdlbmRMYWJlbENsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gICAgICAobGVnZW5kTGFiZWxBY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxuICAgICAgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiBjbGFzcz1cImdhdWdlIGNoYXJ0XCI+XG4gICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgYXJjIG9mIGFyY3M7IHRyYWNrQnk6IHRyYWNrQnlcIiBbYXR0ci50cmFuc2Zvcm1dPVwicm90YXRpb25cIj5cbiAgICAgICAgICA8c3ZnOmdcbiAgICAgICAgICAgIG5neC1jaGFydHMtZ2F1Z2UtYXJjXG4gICAgICAgICAgICBbYmFja2dyb3VuZEFyY109XCJhcmMuYmFja2dyb3VuZEFyY1wiXG4gICAgICAgICAgICBbdmFsdWVBcmNdPVwiYXJjLnZhbHVlQXJjXCJcbiAgICAgICAgICAgIFtjb3JuZXJSYWRpdXNdPVwiY29ybmVyUmFkaXVzXCJcbiAgICAgICAgICAgIFtjb2xvcnNdPVwiY29sb3JzXCJcbiAgICAgICAgICAgIFtpc0FjdGl2ZV09XCJpc0FjdGl2ZShhcmMudmFsdWVBcmMuZGF0YSlcIlxuICAgICAgICAgICAgW3Rvb2x0aXBEaXNhYmxlZF09XCJ0b29sdGlwRGlzYWJsZWRcIlxuICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgICAgW3ZhbHVlRm9ybWF0dGluZ109XCJ2YWx1ZUZvcm1hdHRpbmdcIlxuICAgICAgICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXG4gICAgICAgICAgICAoc2VsZWN0KT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gICAgICAgICAgICAoYWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIChkZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICAgICAgICA+PC9zdmc6Zz5cbiAgICAgICAgPC9zdmc6Zz5cblxuICAgICAgICA8c3ZnOmdcbiAgICAgICAgICBuZ3gtY2hhcnRzLWdhdWdlLWF4aXNcbiAgICAgICAgICAqbmdJZj1cInNob3dBeGlzXCJcbiAgICAgICAgICBbYmlnU2VnbWVudHNdPVwiYmlnU2VnbWVudHNcIlxuICAgICAgICAgIFtzbWFsbFNlZ21lbnRzXT1cInNtYWxsU2VnbWVudHNcIlxuICAgICAgICAgIFttaW5dPVwibWluXCJcbiAgICAgICAgICBbbWF4XT1cIm1heFwiXG4gICAgICAgICAgW3JhZGl1c109XCJvdXRlclJhZGl1c1wiXG4gICAgICAgICAgW2FuZ2xlU3Bhbl09XCJhbmdsZVNwYW5cIlxuICAgICAgICAgIFt2YWx1ZVNjYWxlXT1cInZhbHVlU2NhbGVcIlxuICAgICAgICAgIFtzdGFydEFuZ2xlXT1cInN0YXJ0QW5nbGVcIlxuICAgICAgICAgIFt0aWNrRm9ybWF0dGluZ109XCJheGlzVGlja0Zvcm1hdHRpbmdcIlxuICAgICAgICA+PC9zdmc6Zz5cblxuICAgICAgICA8c3ZnOnRleHRcbiAgICAgICAgICAjdGV4dEVsXG4gICAgICAgICAgKm5nSWY9XCJzaG93VGV4dFwiXG4gICAgICAgICAgW3N0eWxlLnRleHRBbmNob3JdPVwiJ21pZGRsZSdcIlxuICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0ZXh0VHJhbnNmb3JtXCJcbiAgICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJjZW50cmFsXCJcbiAgICAgICAgPlxuICAgICAgICAgIDx0c3BhbiB4PVwiMFwiIGR5PVwiMFwiPnt7IGRpc3BsYXlWYWx1ZSB9fTwvdHNwYW4+XG4gICAgICAgICAgPHRzcGFuIHg9XCIwXCIgZHk9XCIxLjJlbVwiPnt7IHVuaXRzIH19PC90c3Bhbj5cbiAgICAgICAgPC9zdmc6dGV4dD5cbiAgICAgIDwvc3ZnOmc+XG4gICAgPC9uZ3gtY2hhcnRzLWNoYXJ0PlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50LnNjc3MnLCAnLi9nYXVnZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBHYXVnZUNvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBsZWdlbmQgPSBmYWxzZTtcbiAgQElucHV0KCkgbGVnZW5kVGl0bGU6IHN0cmluZyA9ICdMZWdlbmQnO1xuICBASW5wdXQoKSBsZWdlbmRQb3NpdGlvbjogc3RyaW5nID0gJ3JpZ2h0JztcbiAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSBtYXg6IG51bWJlciA9IDEwMDtcbiAgQElucHV0KCkgdGV4dFZhbHVlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHVuaXRzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJpZ1NlZ21lbnRzOiBudW1iZXIgPSAxMDtcbiAgQElucHV0KCkgc21hbGxTZWdtZW50czogbnVtYmVyID0gNTtcbiAgQElucHV0KCkgcmVzdWx0czogYW55W107XG4gIEBJbnB1dCgpIHNob3dBeGlzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgc3RhcnRBbmdsZTogbnVtYmVyID0gLTEyMDtcbiAgQElucHV0KCkgYW5nbGVTcGFuOiBudW1iZXIgPSAyNDA7XG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XG4gIEBJbnB1dCgpIGF4aXNUaWNrRm9ybWF0dGluZzogYW55O1xuICBASW5wdXQoKSB0b29sdGlwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgdmFsdWVGb3JtYXR0aW5nOiAodmFsdWU6IGFueSkgPT4gc3RyaW5nO1xuICBASW5wdXQoKSBzaG93VGV4dDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLy8gU3BlY2lmeSBtYXJnaW5zXG4gIEBJbnB1dCgpIG1hcmdpbjogYW55W107XG5cbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBDb250ZW50Q2hpbGQoJ3Rvb2x0aXBUZW1wbGF0ZScpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAVmlld0NoaWxkKCd0ZXh0RWwnKSB0ZXh0RWw6IEVsZW1lbnRSZWY7XG5cbiAgZGltczogVmlld0RpbWVuc2lvbnM7XG4gIGRvbWFpbjogYW55W107XG4gIHZhbHVlRG9tYWluOiBhbnk7XG4gIHZhbHVlU2NhbGU6IGFueTtcblxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xuICB0cmFuc2Zvcm06IHN0cmluZztcblxuICBvdXRlclJhZGl1czogbnVtYmVyO1xuICB0ZXh0UmFkaXVzOiBudW1iZXI7IC8vIG1heCBhdmFpbGFibGUgcmFkaXVzIGZvciB0aGUgdGV4dFxuICByZXNpemVTY2FsZTogbnVtYmVyID0gMTtcbiAgcm90YXRpb246IHN0cmluZyA9ICcnO1xuICB0ZXh0VHJhbnNmb3JtOiBzdHJpbmcgPSAnc2NhbGUoMSwgMSknO1xuICBjb3JuZXJSYWRpdXM6IG51bWJlciA9IDEwO1xuICBhcmNzOiBhbnlbXTtcbiAgZGlzcGxheVZhbHVlOiBzdHJpbmc7XG4gIGxlZ2VuZE9wdGlvbnM6IGFueTtcblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjYWxlVGV4dCgpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBzdXBlci51cGRhdGUoKTtcblxuICAgIGlmICghdGhpcy5zaG93QXhpcykge1xuICAgICAgaWYgKCF0aGlzLm1hcmdpbikge1xuICAgICAgICB0aGlzLm1hcmdpbiA9IFsxMCwgMjAsIDEwLCAyMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdGhpcy5tYXJnaW4pIHtcbiAgICAgICAgdGhpcy5tYXJnaW4gPSBbNjAsIDEwMCwgNjAsIDEwMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWFrZSB0aGUgc3RhcnRpbmcgYW5nbGUgcG9zaXRpdmVcbiAgICBpZiAodGhpcy5zdGFydEFuZ2xlIDwgMCkge1xuICAgICAgdGhpcy5zdGFydEFuZ2xlID0gKHRoaXMuc3RhcnRBbmdsZSAlIDM2MCkgKyAzNjA7XG4gICAgfVxuXG4gICAgdGhpcy5hbmdsZVNwYW4gPSBNYXRoLm1pbih0aGlzLmFuZ2xlU3BhbiwgMzYwKTtcblxuICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luLFxuICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmQsXG4gICAgICBsZWdlbmRQb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvblxuICAgIH0pO1xuXG4gICAgdGhpcy5kb21haW4gPSB0aGlzLmdldERvbWFpbigpO1xuICAgIHRoaXMudmFsdWVEb21haW4gPSB0aGlzLmdldFZhbHVlRG9tYWluKCk7XG4gICAgdGhpcy52YWx1ZVNjYWxlID0gdGhpcy5nZXRWYWx1ZVNjYWxlKCk7XG4gICAgdGhpcy5kaXNwbGF5VmFsdWUgPSB0aGlzLmdldERpc3BsYXlWYWx1ZSgpO1xuXG4gICAgdGhpcy5vdXRlclJhZGl1cyA9IE1hdGgubWluKHRoaXMuZGltcy53aWR0aCwgdGhpcy5kaW1zLmhlaWdodCkgLyAyO1xuXG4gICAgdGhpcy5hcmNzID0gdGhpcy5nZXRBcmNzKCk7XG5cbiAgICB0aGlzLnNldENvbG9ycygpO1xuICAgIHRoaXMubGVnZW5kT3B0aW9ucyA9IHRoaXMuZ2V0TGVnZW5kT3B0aW9ucygpO1xuXG4gICAgY29uc3QgeE9mZnNldCA9IHRoaXMubWFyZ2luWzNdICsgdGhpcy5kaW1zLndpZHRoIC8gMjtcbiAgICBjb25zdCB5T2Zmc2V0ID0gdGhpcy5tYXJnaW5bMF0gKyB0aGlzLmRpbXMuaGVpZ2h0IC8gMjtcblxuICAgIHRoaXMudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3hPZmZzZXR9LCAke3lPZmZzZXR9KWA7XG4gICAgdGhpcy5yb3RhdGlvbiA9IGByb3RhdGUoJHt0aGlzLnN0YXJ0QW5nbGV9KWA7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjYWxlVGV4dCgpLCA1MCk7XG4gIH1cblxuICBnZXRBcmNzKCk6IGFueVtdIHtcbiAgICBjb25zdCBhcmNzID0gW107XG5cbiAgICBjb25zdCBhdmFpbGFibGVSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzICogMC43O1xuXG4gICAgY29uc3QgcmFkaXVzUGVyQXJjID0gTWF0aC5taW4oYXZhaWxhYmxlUmFkaXVzIC8gdGhpcy5yZXN1bHRzLmxlbmd0aCwgMTApO1xuICAgIGNvbnN0IGFyY1dpZHRoID0gcmFkaXVzUGVyQXJjICogMC43O1xuICAgIHRoaXMudGV4dFJhZGl1cyA9IHRoaXMub3V0ZXJSYWRpdXMgLSB0aGlzLnJlc3VsdHMubGVuZ3RoICogcmFkaXVzUGVyQXJjO1xuICAgIHRoaXMuY29ybmVyUmFkaXVzID0gTWF0aC5mbG9vcihhcmNXaWR0aCAvIDIpO1xuXG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgZCBvZiB0aGlzLnJlc3VsdHMpIHtcbiAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cyAtIGkgKiByYWRpdXNQZXJBcmM7XG4gICAgICBjb25zdCBpbm5lclJhZGl1cyA9IG91dGVyUmFkaXVzIC0gYXJjV2lkdGg7XG5cbiAgICAgIGNvbnN0IGJhY2tncm91bmRBcmMgPSB7XG4gICAgICAgIGVuZEFuZ2xlOiAodGhpcy5hbmdsZVNwYW4gKiBNYXRoLlBJKSAvIDE4MCxcbiAgICAgICAgaW5uZXJSYWRpdXMsXG4gICAgICAgIG91dGVyUmFkaXVzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmFsdWU6IHRoaXMubWF4LFxuICAgICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB2YWx1ZUFyYyA9IHtcbiAgICAgICAgZW5kQW5nbGU6IChNYXRoLm1pbih0aGlzLnZhbHVlU2NhbGUoZC52YWx1ZSksIHRoaXMuYW5nbGVTcGFuKSAqIE1hdGguUEkpIC8gMTgwLFxuICAgICAgICBpbm5lclJhZGl1cyxcbiAgICAgICAgb3V0ZXJSYWRpdXMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2YWx1ZTogZC52YWx1ZSxcbiAgICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgYXJjID0ge1xuICAgICAgICBiYWNrZ3JvdW5kQXJjLFxuICAgICAgICB2YWx1ZUFyY1xuICAgICAgfTtcblxuICAgICAgYXJjcy5wdXNoKGFyYyk7XG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyY3M7XG4gIH1cblxuICBnZXREb21haW4oKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC5uYW1lKTtcbiAgfVxuXG4gIGdldFZhbHVlRG9tYWluKCk6IGFueVtdIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC52YWx1ZSk7XG4gICAgY29uc3QgZGF0YU1pbiA9IE1hdGgubWluKC4uLnZhbHVlcyk7XG4gICAgY29uc3QgZGF0YU1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XG5cbiAgICBpZiAodGhpcy5taW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1pbih0aGlzLm1pbiwgZGF0YU1pbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWluID0gZGF0YU1pbjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzLm1heCwgZGF0YU1heCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWF4ID0gZGF0YU1heDtcbiAgICB9XG5cbiAgICByZXR1cm4gW3RoaXMubWluLCB0aGlzLm1heF07XG4gIH1cblxuICBnZXRWYWx1ZVNjYWxlKCk6IGFueSB7XG4gICAgcmV0dXJuIHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMuYW5nbGVTcGFuXSkubmljZSgpLmRvbWFpbih0aGlzLnZhbHVlRG9tYWluKTtcbiAgfVxuXG4gIGdldERpc3BsYXlWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5yZXN1bHRzLm1hcChkID0+IGQudmFsdWUpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xuXG4gICAgaWYgKHRoaXMudGV4dFZhbHVlICYmIDAgIT09IHRoaXMudGV4dFZhbHVlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dFZhbHVlLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmFsdWVGb3JtYXR0aW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZUZvcm1hdHRpbmcodmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZS50b0xvY2FsZVN0cmluZygpO1xuICB9XG5cbiAgc2NhbGVUZXh0KHJlcGVhdDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2hvd1RleHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgeyB3aWR0aCB9ID0gdGhpcy50ZXh0RWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBvbGRTY2FsZSA9IHRoaXMucmVzaXplU2NhbGU7XG5cbiAgICBpZiAod2lkdGggPT09IDApIHtcbiAgICAgIHRoaXMucmVzaXplU2NhbGUgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhdmFpbGFibGVTcGFjZSA9IHRoaXMudGV4dFJhZGl1cztcbiAgICAgIHRoaXMucmVzaXplU2NhbGUgPSBNYXRoLmZsb29yKChhdmFpbGFibGVTcGFjZSAvICh3aWR0aCAvIHRoaXMucmVzaXplU2NhbGUpKSAqIDEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzaXplU2NhbGUgIT09IG9sZFNjYWxlKSB7XG4gICAgICB0aGlzLnRleHRUcmFuc2Zvcm0gPSBgc2NhbGUoJHt0aGlzLnJlc2l6ZVNjYWxlfSwgJHt0aGlzLnJlc2l6ZVNjYWxlfSlgO1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIGlmIChyZXBlYXQpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjYWxlVGV4dChmYWxzZSksIDUwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkNsaWNrKGRhdGEpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGRhdGEpO1xuICB9XG5cbiAgZ2V0TGVnZW5kT3B0aW9ucygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBzY2FsZVR5cGU6ICdvcmRpbmFsJyxcbiAgICAgIGNvbG9yczogdGhpcy5jb2xvcnMsXG4gICAgICBkb21haW46IHRoaXMuZG9tYWluLFxuICAgICAgdGl0bGU6IHRoaXMubGVnZW5kVGl0bGUsXG4gICAgICBwb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvblxuICAgIH07XG4gIH1cblxuICBzZXRDb2xvcnMoKTogdm9pZCB7XG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsICdvcmRpbmFsJywgdGhpcy5kb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcbiAgfVxuXG4gIG9uQWN0aXZhdGUoaXRlbSk6IHZvaWQge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZTtcbiAgICB9KTtcbiAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbaXRlbSwgLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogaXRlbSwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xuICB9XG5cbiAgb25EZWFjdGl2YXRlKGl0ZW0pOiB2b2lkIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZEluZGV4KGQgPT4ge1xuICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lICYmIGQudmFsdWUgPT09IGl0ZW0udmFsdWU7XG4gICAgfSk7XG5cbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XG5cbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XG4gIH1cblxuICBpc0FjdGl2ZShlbnRyeSk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5hY3RpdmVFbnRyaWVzKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kKGQgPT4ge1xuICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUgPT09IGQubmFtZSAmJiBlbnRyeS5zZXJpZXMgPT09IGQuc2VyaWVzO1xuICAgIH0pO1xuICAgIHJldHVybiBpdGVtICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICB0cmFja0J5KGluZGV4LCBpdGVtKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaXRlbS52YWx1ZUFyYy5kYXRhLm5hbWU7XG4gIH1cbn1cbiJdfQ==