import { __decorate, __extends, __read, __spread, __values } from "tslib";
import { Component, Input, Output, EventEmitter, ViewEncapsulation, HostListener, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { scaleLinear, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { id } from '../utils/id';
import { getUniqueXDomainValues, getScaleType } from '../common/domain.helper';
var AreaChartComponent = /** @class */ (function (_super) {
    __extends(AreaChartComponent, _super);
    function AreaChartComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.legendTitle = 'Legend';
        _this.legendPosition = 'right';
        _this.baseValue = 'auto';
        _this.showGridLines = true;
        _this.curve = curveLinear;
        _this.activeEntries = [];
        _this.trimXAxisTicks = true;
        _this.trimYAxisTicks = true;
        _this.rotateXAxisTicks = true;
        _this.maxXAxisTickLength = 16;
        _this.maxYAxisTickLength = 16;
        _this.roundDomains = false;
        _this.tooltipDisabled = false;
        _this.activate = new EventEmitter();
        _this.deactivate = new EventEmitter();
        _this.margin = [10, 20, 10, 20];
        _this.xAxisHeight = 0;
        _this.yAxisWidth = 0;
        _this.timelineHeight = 50;
        _this.timelinePadding = 10;
        return _this;
    }
    AreaChartComponent.prototype.update = function () {
        _super.prototype.update.call(this);
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showXAxis: this.xAxis,
            showYAxis: this.yAxis,
            xAxisHeight: this.xAxisHeight,
            yAxisWidth: this.yAxisWidth,
            showXLabel: this.showXAxisLabel,
            showYLabel: this.showYAxisLabel,
            showLegend: this.legend,
            legendType: this.schemeType,
            legendPosition: this.legendPosition
        });
        if (this.timeline) {
            this.dims.height -= this.timelineHeight + this.margin[2] + this.timelinePadding;
        }
        this.xDomain = this.getXDomain();
        if (this.filteredDomain) {
            this.xDomain = this.filteredDomain;
        }
        this.yDomain = this.getYDomain();
        this.seriesDomain = this.getSeriesDomain();
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
        this.yScale = this.getYScale(this.yDomain, this.dims.height);
        this.updateTimeline();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.transform = "translate(" + this.dims.xOffset + ", " + this.margin[0] + ")";
        this.clipPathId = 'clip' + id().toString();
        this.clipPath = "url(#" + this.clipPathId + ")";
    };
    AreaChartComponent.prototype.updateTimeline = function () {
        if (this.timeline) {
            this.timelineWidth = this.dims.width;
            this.timelineXDomain = this.getXDomain();
            this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
            this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
            this.timelineTransform = "translate(" + this.dims.xOffset + ", " + -this.margin[2] + ")";
        }
    };
    AreaChartComponent.prototype.getXDomain = function () {
        var values = getUniqueXDomainValues(this.results);
        this.scaleType = getScaleType(values);
        var domain = [];
        if (this.scaleType === 'linear') {
            values = values.map(function (v) { return Number(v); });
        }
        var min;
        var max;
        if (this.scaleType === 'time' || this.scaleType === 'linear') {
            min = this.xScaleMin ? this.xScaleMin : Math.min.apply(Math, __spread(values));
            max = this.xScaleMax ? this.xScaleMax : Math.max.apply(Math, __spread(values));
        }
        if (this.scaleType === 'time') {
            domain = [new Date(min), new Date(max)];
            this.xSet = __spread(values).sort(function (a, b) {
                var aDate = a.getTime();
                var bDate = b.getTime();
                if (aDate > bDate)
                    return 1;
                if (bDate > aDate)
                    return -1;
                return 0;
            });
        }
        else if (this.scaleType === 'linear') {
            domain = [min, max];
            // Use compare function to sort numbers numerically
            this.xSet = __spread(values).sort(function (a, b) { return a - b; });
        }
        else {
            domain = values;
            this.xSet = values;
        }
        return domain;
    };
    AreaChartComponent.prototype.getYDomain = function () {
        var e_1, _a, e_2, _b;
        var domain = [];
        try {
            for (var _c = __values(this.results), _d = _c.next(); !_d.done; _d = _c.next()) {
                var results = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values(results.series)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var d = _f.value;
                        if (!domain.includes(d.value)) {
                            domain.push(d.value);
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
        var values = __spread(domain);
        if (!this.autoScale) {
            values.push(0);
        }
        if (this.baseValue !== 'auto') {
            values.push(this.baseValue);
        }
        var min = this.yScaleMin ? this.yScaleMin : Math.min.apply(Math, __spread(values));
        var max = this.yScaleMax ? this.yScaleMax : Math.max.apply(Math, __spread(values));
        return [min, max];
    };
    AreaChartComponent.prototype.getSeriesDomain = function () {
        return this.results.map(function (d) { return d.name; });
    };
    AreaChartComponent.prototype.getXScale = function (domain, width) {
        var scale;
        if (this.scaleType === 'time') {
            scale = scaleTime();
        }
        else if (this.scaleType === 'linear') {
            scale = scaleLinear();
        }
        else if (this.scaleType === 'ordinal') {
            scale = scalePoint().padding(0.1);
        }
        scale.range([0, width]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    };
    AreaChartComponent.prototype.getYScale = function (domain, height) {
        var scale = scaleLinear().range([height, 0]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    };
    AreaChartComponent.prototype.getScaleType = function (values) {
        var e_3, _a;
        var date = true;
        var num = true;
        try {
            for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                var value = values_1_1.value;
                if (!this.isDate(value)) {
                    date = false;
                }
                if (typeof value !== 'number') {
                    num = false;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (date) {
            return 'time';
        }
        if (num) {
            return 'linear';
        }
        return 'ordinal';
    };
    AreaChartComponent.prototype.isDate = function (value) {
        if (value instanceof Date) {
            return true;
        }
        return false;
    };
    AreaChartComponent.prototype.updateDomain = function (domain) {
        this.filteredDomain = domain;
        this.xDomain = this.filteredDomain;
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
    };
    AreaChartComponent.prototype.updateHoveredVertical = function (item) {
        this.hoveredVertical = item.value;
        this.deactivateAll();
    };
    AreaChartComponent.prototype.hideCircles = function () {
        this.hoveredVertical = null;
        this.deactivateAll();
    };
    AreaChartComponent.prototype.onClick = function (data, series) {
        if (series) {
            data.series = series.name;
        }
        this.select.emit(data);
    };
    AreaChartComponent.prototype.trackBy = function (index, item) {
        return item.name;
    };
    AreaChartComponent.prototype.setColors = function () {
        var domain;
        if (this.schemeType === 'ordinal') {
            domain = this.seriesDomain;
        }
        else {
            domain = this.yDomain;
        }
        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    };
    AreaChartComponent.prototype.getLegendOptions = function () {
        var opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            title: undefined,
            position: this.legendPosition
        };
        if (opts.scaleType === 'ordinal') {
            opts.domain = this.seriesDomain;
            opts.colors = this.colors;
            opts.title = this.legendTitle;
        }
        else {
            opts.domain = this.yDomain;
            opts.colors = this.colors.scale;
        }
        return opts;
    };
    AreaChartComponent.prototype.updateYAxisWidth = function (_a) {
        var width = _a.width;
        this.yAxisWidth = width;
        this.update();
    };
    AreaChartComponent.prototype.updateXAxisHeight = function (_a) {
        var height = _a.height;
        this.xAxisHeight = height;
        this.update();
    };
    AreaChartComponent.prototype.onActivate = function (item) {
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = __spread([item], this.activeEntries);
        this.activate.emit({ value: item, entries: this.activeEntries });
    };
    AreaChartComponent.prototype.onDeactivate = function (item) {
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = __spread(this.activeEntries);
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    };
    AreaChartComponent.prototype.deactivateAll = function () {
        var e_4, _a;
        this.activeEntries = __spread(this.activeEntries);
        try {
            for (var _b = __values(this.activeEntries), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                this.deactivate.emit({ value: entry, entries: [] });
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this.activeEntries = [];
    };
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "legend", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "legendTitle", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "legendPosition", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "state", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "xAxis", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "yAxis", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "baseValue", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "autoScale", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "showXAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "showYAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "xAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "yAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "timeline", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "gradient", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "showGridLines", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "curve", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "activeEntries", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "schemeType", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "trimXAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "trimYAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "rotateXAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "maxXAxisTickLength", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "maxYAxisTickLength", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "xAxisTickFormatting", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "yAxisTickFormatting", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "xAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "yAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "roundDomains", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "xScaleMin", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "xScaleMax", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "yScaleMin", void 0);
    __decorate([
        Input()
    ], AreaChartComponent.prototype, "yScaleMax", void 0);
    __decorate([
        Output()
    ], AreaChartComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], AreaChartComponent.prototype, "deactivate", void 0);
    __decorate([
        ContentChild('tooltipTemplate')
    ], AreaChartComponent.prototype, "tooltipTemplate", void 0);
    __decorate([
        ContentChild('seriesTooltipTemplate')
    ], AreaChartComponent.prototype, "seriesTooltipTemplate", void 0);
    __decorate([
        HostListener('mouseleave')
    ], AreaChartComponent.prototype, "hideCircles", null);
    AreaChartComponent = __decorate([
        Component({
            selector: 'ngx-charts-area-chart',
            template: "\n    <ngx-charts-chart\n      [view]=\"[width, height]\"\n      [showLegend]=\"legend\"\n      [legendOptions]=\"legendOptions\"\n      [activeEntries]=\"activeEntries\"\n      [animations]=\"animations\"\n      (legendLabelClick)=\"onClick($event)\"\n      (legendLabelActivate)=\"onActivate($event)\"\n      (legendLabelDeactivate)=\"onDeactivate($event)\"\n    >\n      <svg:defs>\n        <svg:clipPath [attr.id]=\"clipPathId\">\n          <svg:rect\n            [attr.width]=\"dims.width + 10\"\n            [attr.height]=\"dims.height + 10\"\n            [attr.transform]=\"'translate(-5, -5)'\"\n          />\n        </svg:clipPath>\n      </svg:defs>\n      <svg:g [attr.transform]=\"transform\" class=\"area-chart chart\">\n        <svg:g\n          ngx-charts-x-axis\n          *ngIf=\"xAxis\"\n          [xScale]=\"xScale\"\n          [dims]=\"dims\"\n          [showGridLines]=\"showGridLines\"\n          [showLabel]=\"showXAxisLabel\"\n          [labelText]=\"xAxisLabel\"\n          [trimTicks]=\"trimXAxisTicks\"\n          [rotateTicks]=\"rotateXAxisTicks\"\n          [maxTickLength]=\"maxXAxisTickLength\"\n          [tickFormatting]=\"xAxisTickFormatting\"\n          [ticks]=\"xAxisTicks\"\n          (dimensionsChanged)=\"updateXAxisHeight($event)\"\n        ></svg:g>\n        <svg:g\n          ngx-charts-y-axis\n          *ngIf=\"yAxis\"\n          [yScale]=\"yScale\"\n          [dims]=\"dims\"\n          [showGridLines]=\"showGridLines\"\n          [showLabel]=\"showYAxisLabel\"\n          [labelText]=\"yAxisLabel\"\n          [trimTicks]=\"trimYAxisTicks\"\n          [maxTickLength]=\"maxYAxisTickLength\"\n          [tickFormatting]=\"yAxisTickFormatting\"\n          [ticks]=\"yAxisTicks\"\n          (dimensionsChanged)=\"updateYAxisWidth($event)\"\n        ></svg:g>\n        <svg:g [attr.clip-path]=\"clipPath\">\n          <svg:g *ngFor=\"let series of results; trackBy: trackBy\">\n            <svg:g\n              ngx-charts-area-series\n              [xScale]=\"xScale\"\n              [yScale]=\"yScale\"\n              [baseValue]=\"baseValue\"\n              [colors]=\"colors\"\n              [data]=\"series\"\n              [activeEntries]=\"activeEntries\"\n              [scaleType]=\"scaleType\"\n              [gradient]=\"gradient\"\n              [curve]=\"curve\"\n              [animations]=\"animations\"\n            />\n          </svg:g>\n\n          <svg:g *ngIf=\"!tooltipDisabled\" (mouseleave)=\"hideCircles()\">\n            <svg:g\n              ngx-charts-tooltip-area\n              [dims]=\"dims\"\n              [xSet]=\"xSet\"\n              [xScale]=\"xScale\"\n              [yScale]=\"yScale\"\n              [results]=\"results\"\n              [colors]=\"colors\"\n              [tooltipDisabled]=\"tooltipDisabled\"\n              [tooltipTemplate]=\"seriesTooltipTemplate\"\n              (hover)=\"updateHoveredVertical($event)\"\n            />\n\n            <svg:g *ngFor=\"let series of results\">\n              <svg:g\n                ngx-charts-circle-series\n                [xScale]=\"xScale\"\n                [yScale]=\"yScale\"\n                [colors]=\"colors\"\n                [activeEntries]=\"activeEntries\"\n                [data]=\"series\"\n                [scaleType]=\"scaleType\"\n                [visibleValue]=\"hoveredVertical\"\n                [tooltipDisabled]=\"tooltipDisabled\"\n                [tooltipTemplate]=\"tooltipTemplate\"\n                (select)=\"onClick($event, series)\"\n                (activate)=\"onActivate($event)\"\n                (deactivate)=\"onDeactivate($event)\"\n              />\n            </svg:g>\n          </svg:g>\n        </svg:g>\n      </svg:g>\n      <svg:g\n        ngx-charts-timeline\n        *ngIf=\"timeline && scaleType != 'ordinal'\"\n        [attr.transform]=\"timelineTransform\"\n        [results]=\"results\"\n        [view]=\"[timelineWidth, height]\"\n        [height]=\"timelineHeight\"\n        [scheme]=\"scheme\"\n        [customColors]=\"customColors\"\n        [legend]=\"legend\"\n        [scaleType]=\"scaleType\"\n        (onDomainChange)=\"updateDomain($event)\"\n      >\n        <svg:g *ngFor=\"let series of results; trackBy: trackBy\">\n          <svg:g\n            ngx-charts-area-series\n            [xScale]=\"timelineXScale\"\n            [yScale]=\"timelineYScale\"\n            [baseValue]=\"baseValue\"\n            [colors]=\"colors\"\n            [data]=\"series\"\n            [scaleType]=\"scaleType\"\n            [gradient]=\"gradient\"\n            [curve]=\"curve\"\n            [animations]=\"animations\"\n          />\n        </svg:g>\n      </svg:g>\n    </ngx-charts-chart>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None,
            styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}"]
        })
    ], AreaChartComponent);
    return AreaChartComponent;
}(BaseChartComponent));
export { AreaChartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9hcmVhLWNoYXJ0L2FyZWEtY2hhcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUV2QyxPQUFPLEVBQUUsdUJBQXVCLEVBQWtCLE1BQU0sa0NBQWtDLENBQUM7QUFDM0YsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDakMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBMkkvRTtJQUF3QyxzQ0FBa0I7SUFBMUQ7UUFBQSxxRUF1VkM7UUFyVlUsaUJBQVcsR0FBVyxRQUFRLENBQUM7UUFDL0Isb0JBQWMsR0FBVyxPQUFPLENBQUM7UUFJakMsZUFBUyxHQUFRLE1BQU0sQ0FBQztRQVF4QixtQkFBYSxHQUFZLElBQUksQ0FBQztRQUM5QixXQUFLLEdBQVEsV0FBVyxDQUFDO1FBQ3pCLG1CQUFhLEdBQVUsRUFBRSxDQUFDO1FBRTFCLG9CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLG9CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLHNCQUFnQixHQUFZLElBQUksQ0FBQztRQUNqQyx3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VCxRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLFFBQVEsRUFBRSwra0pBa0lUO1lBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFFL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O1NBQ3RDLENBQUM7T0FDVyxrQkFBa0IsQ0F1VjlCO0lBQUQseUJBQUM7Q0FBQSxBQXZWRCxDQUF3QyxrQkFBa0IsR0F1VnpEO1NBdlZZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSG9zdExpc3RlbmVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29udGVudENoaWxkLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHNjYWxlTGluZWFyLCBzY2FsZVBvaW50LCBzY2FsZVRpbWUgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBjdXJ2ZUxpbmVhciB9IGZyb20gJ2QzLXNoYXBlJztcblxuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcbmltcG9ydCB7IEJhc2VDaGFydENvbXBvbmVudCB9IGZyb20gJy4uL2NvbW1vbi9iYXNlLWNoYXJ0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcbmltcG9ydCB7IGdldFVuaXF1ZVhEb21haW5WYWx1ZXMsIGdldFNjYWxlVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9kb21haW4uaGVscGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1hcmVhLWNoYXJ0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmd4LWNoYXJ0cy1jaGFydFxuICAgICAgW3ZpZXddPVwiW3dpZHRoLCBoZWlnaHRdXCJcbiAgICAgIFtzaG93TGVnZW5kXT1cImxlZ2VuZFwiXG4gICAgICBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCJcbiAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxuICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXG4gICAgICAobGVnZW5kTGFiZWxDbGljayk9XCJvbkNsaWNrKCRldmVudClcIlxuICAgICAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICAgIChsZWdlbmRMYWJlbERlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIlxuICAgID5cbiAgICAgIDxzdmc6ZGVmcz5cbiAgICAgICAgPHN2ZzpjbGlwUGF0aCBbYXR0ci5pZF09XCJjbGlwUGF0aElkXCI+XG4gICAgICAgICAgPHN2ZzpyZWN0XG4gICAgICAgICAgICBbYXR0ci53aWR0aF09XCJkaW1zLndpZHRoICsgMTBcIlxuICAgICAgICAgICAgW2F0dHIuaGVpZ2h0XT1cImRpbXMuaGVpZ2h0ICsgMTBcIlxuICAgICAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cIid0cmFuc2xhdGUoLTUsIC01KSdcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3ZnOmNsaXBQYXRoPlxuICAgICAgPC9zdmc6ZGVmcz5cbiAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCIgY2xhc3M9XCJhcmVhLWNoYXJ0IGNoYXJ0XCI+XG4gICAgICAgIDxzdmc6Z1xuICAgICAgICAgIG5neC1jaGFydHMteC1heGlzXG4gICAgICAgICAgKm5nSWY9XCJ4QXhpc1wiXG4gICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxuICAgICAgICAgIFtkaW1zXT1cImRpbXNcIlxuICAgICAgICAgIFtzaG93R3JpZExpbmVzXT1cInNob3dHcmlkTGluZXNcIlxuICAgICAgICAgIFtzaG93TGFiZWxdPVwic2hvd1hBeGlzTGFiZWxcIlxuICAgICAgICAgIFtsYWJlbFRleHRdPVwieEF4aXNMYWJlbFwiXG4gICAgICAgICAgW3RyaW1UaWNrc109XCJ0cmltWEF4aXNUaWNrc1wiXG4gICAgICAgICAgW3JvdGF0ZVRpY2tzXT1cInJvdGF0ZVhBeGlzVGlja3NcIlxuICAgICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFhBeGlzVGlja0xlbmd0aFwiXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInhBeGlzVGlja0Zvcm1hdHRpbmdcIlxuICAgICAgICAgIFt0aWNrc109XCJ4QXhpc1RpY2tzXCJcbiAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwidXBkYXRlWEF4aXNIZWlnaHQoJGV2ZW50KVwiXG4gICAgICAgID48L3N2ZzpnPlxuICAgICAgICA8c3ZnOmdcbiAgICAgICAgICBuZ3gtY2hhcnRzLXktYXhpc1xuICAgICAgICAgICpuZ0lmPVwieUF4aXNcIlxuICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcbiAgICAgICAgICBbZGltc109XCJkaW1zXCJcbiAgICAgICAgICBbc2hvd0dyaWRMaW5lc109XCJzaG93R3JpZExpbmVzXCJcbiAgICAgICAgICBbc2hvd0xhYmVsXT1cInNob3dZQXhpc0xhYmVsXCJcbiAgICAgICAgICBbbGFiZWxUZXh0XT1cInlBeGlzTGFiZWxcIlxuICAgICAgICAgIFt0cmltVGlja3NdPVwidHJpbVlBeGlzVGlja3NcIlxuICAgICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFlBeGlzVGlja0xlbmd0aFwiXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInlBeGlzVGlja0Zvcm1hdHRpbmdcIlxuICAgICAgICAgIFt0aWNrc109XCJ5QXhpc1RpY2tzXCJcbiAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwidXBkYXRlWUF4aXNXaWR0aCgkZXZlbnQpXCJcbiAgICAgICAgPjwvc3ZnOmc+XG4gICAgICAgIDxzdmc6ZyBbYXR0ci5jbGlwLXBhdGhdPVwiY2xpcFBhdGhcIj5cbiAgICAgICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHNlcmllcyBvZiByZXN1bHRzOyB0cmFja0J5OiB0cmFja0J5XCI+XG4gICAgICAgICAgICA8c3ZnOmdcbiAgICAgICAgICAgICAgbmd4LWNoYXJ0cy1hcmVhLXNlcmllc1xuICAgICAgICAgICAgICBbeFNjYWxlXT1cInhTY2FsZVwiXG4gICAgICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcbiAgICAgICAgICAgICAgW2Jhc2VWYWx1ZV09XCJiYXNlVmFsdWVcIlxuICAgICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXG4gICAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXG4gICAgICAgICAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxuICAgICAgICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXG4gICAgICAgICAgICAgIFtncmFkaWVudF09XCJncmFkaWVudFwiXG4gICAgICAgICAgICAgIFtjdXJ2ZV09XCJjdXJ2ZVwiXG4gICAgICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2ZzpnPlxuXG4gICAgICAgICAgPHN2ZzpnICpuZ0lmPVwiIXRvb2x0aXBEaXNhYmxlZFwiIChtb3VzZWxlYXZlKT1cImhpZGVDaXJjbGVzKClcIj5cbiAgICAgICAgICAgIDxzdmc6Z1xuICAgICAgICAgICAgICBuZ3gtY2hhcnRzLXRvb2x0aXAtYXJlYVxuICAgICAgICAgICAgICBbZGltc109XCJkaW1zXCJcbiAgICAgICAgICAgICAgW3hTZXRdPVwieFNldFwiXG4gICAgICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcbiAgICAgICAgICAgICAgW3lTY2FsZV09XCJ5U2NhbGVcIlxuICAgICAgICAgICAgICBbcmVzdWx0c109XCJyZXN1bHRzXCJcbiAgICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxuICAgICAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXG4gICAgICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwic2VyaWVzVG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgKGhvdmVyKT1cInVwZGF0ZUhvdmVyZWRWZXJ0aWNhbCgkZXZlbnQpXCJcbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgc2VyaWVzIG9mIHJlc3VsdHNcIj5cbiAgICAgICAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgICAgICAgbmd4LWNoYXJ0cy1jaXJjbGUtc2VyaWVzXG4gICAgICAgICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxuICAgICAgICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcbiAgICAgICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXG4gICAgICAgICAgICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXG4gICAgICAgICAgICAgICAgW2RhdGFdPVwic2VyaWVzXCJcbiAgICAgICAgICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXG4gICAgICAgICAgICAgICAgW3Zpc2libGVWYWx1ZV09XCJob3ZlcmVkVmVydGljYWxcIlxuICAgICAgICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwidG9vbHRpcERpc2FibGVkXCJcbiAgICAgICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgKHNlbGVjdCk9XCJvbkNsaWNrKCRldmVudCwgc2VyaWVzKVwiXG4gICAgICAgICAgICAgICAgKGFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKGRlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9zdmc6Zz5cbiAgICAgICAgICA8L3N2ZzpnPlxuICAgICAgICA8L3N2ZzpnPlxuICAgICAgPC9zdmc6Zz5cbiAgICAgIDxzdmc6Z1xuICAgICAgICBuZ3gtY2hhcnRzLXRpbWVsaW5lXG4gICAgICAgICpuZ0lmPVwidGltZWxpbmUgJiYgc2NhbGVUeXBlICE9ICdvcmRpbmFsJ1wiXG4gICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0aW1lbGluZVRyYW5zZm9ybVwiXG4gICAgICAgIFtyZXN1bHRzXT1cInJlc3VsdHNcIlxuICAgICAgICBbdmlld109XCJbdGltZWxpbmVXaWR0aCwgaGVpZ2h0XVwiXG4gICAgICAgIFtoZWlnaHRdPVwidGltZWxpbmVIZWlnaHRcIlxuICAgICAgICBbc2NoZW1lXT1cInNjaGVtZVwiXG4gICAgICAgIFtjdXN0b21Db2xvcnNdPVwiY3VzdG9tQ29sb3JzXCJcbiAgICAgICAgW2xlZ2VuZF09XCJsZWdlbmRcIlxuICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXG4gICAgICAgIChvbkRvbWFpbkNoYW5nZSk9XCJ1cGRhdGVEb21haW4oJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgc2VyaWVzIG9mIHJlc3VsdHM7IHRyYWNrQnk6IHRyYWNrQnlcIj5cbiAgICAgICAgICA8c3ZnOmdcbiAgICAgICAgICAgIG5neC1jaGFydHMtYXJlYS1zZXJpZXNcbiAgICAgICAgICAgIFt4U2NhbGVdPVwidGltZWxpbmVYU2NhbGVcIlxuICAgICAgICAgICAgW3lTY2FsZV09XCJ0aW1lbGluZVlTY2FsZVwiXG4gICAgICAgICAgICBbYmFzZVZhbHVlXT1cImJhc2VWYWx1ZVwiXG4gICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXG4gICAgICAgICAgICBbZGF0YV09XCJzZXJpZXNcIlxuICAgICAgICAgICAgW3NjYWxlVHlwZV09XCJzY2FsZVR5cGVcIlxuICAgICAgICAgICAgW2dyYWRpZW50XT1cImdyYWRpZW50XCJcbiAgICAgICAgICAgIFtjdXJ2ZV09XCJjdXJ2ZVwiXG4gICAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L3N2ZzpnPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L25neC1jaGFydHMtY2hhcnQ+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdHlsZVVybHM6IFsnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBBcmVhQ2hhcnRDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQge1xuICBASW5wdXQoKSBsZWdlbmQ7XG4gIEBJbnB1dCgpIGxlZ2VuZFRpdGxlOiBzdHJpbmcgPSAnTGVnZW5kJztcbiAgQElucHV0KCkgbGVnZW5kUG9zaXRpb246IHN0cmluZyA9ICdyaWdodCc7XG4gIEBJbnB1dCgpIHN0YXRlO1xuICBASW5wdXQoKSB4QXhpcztcbiAgQElucHV0KCkgeUF4aXM7XG4gIEBJbnB1dCgpIGJhc2VWYWx1ZTogYW55ID0gJ2F1dG8nO1xuICBASW5wdXQoKSBhdXRvU2NhbGU7XG4gIEBJbnB1dCgpIHNob3dYQXhpc0xhYmVsO1xuICBASW5wdXQoKSBzaG93WUF4aXNMYWJlbDtcbiAgQElucHV0KCkgeEF4aXNMYWJlbDtcbiAgQElucHV0KCkgeUF4aXNMYWJlbDtcbiAgQElucHV0KCkgdGltZWxpbmU7XG4gIEBJbnB1dCgpIGdyYWRpZW50OiBib29sZWFuO1xuICBASW5wdXQoKSBzaG93R3JpZExpbmVzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgY3VydmU6IGFueSA9IGN1cnZlTGluZWFyO1xuICBASW5wdXQoKSBhY3RpdmVFbnRyaWVzOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoKSBzY2hlbWVUeXBlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHRyaW1YQXhpc1RpY2tzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgdHJpbVlBeGlzVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSByb3RhdGVYQXhpc1RpY2tzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbWF4WEF4aXNUaWNrTGVuZ3RoOiBudW1iZXIgPSAxNjtcbiAgQElucHV0KCkgbWF4WUF4aXNUaWNrTGVuZ3RoOiBudW1iZXIgPSAxNjtcbiAgQElucHV0KCkgeEF4aXNUaWNrRm9ybWF0dGluZzogYW55O1xuICBASW5wdXQoKSB5QXhpc1RpY2tGb3JtYXR0aW5nOiBhbnk7XG4gIEBJbnB1dCgpIHhBeGlzVGlja3M6IGFueVtdO1xuICBASW5wdXQoKSB5QXhpc1RpY2tzOiBhbnlbXTtcbiAgQElucHV0KCkgcm91bmREb21haW5zOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSB4U2NhbGVNaW46IGFueTtcbiAgQElucHV0KCkgeFNjYWxlTWF4OiBhbnk7XG4gIEBJbnB1dCgpIHlTY2FsZU1pbjogbnVtYmVyO1xuICBASW5wdXQoKSB5U2NhbGVNYXg6IG51bWJlcjtcblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQENvbnRlbnRDaGlsZCgndG9vbHRpcFRlbXBsYXRlJykgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKCdzZXJpZXNUb29sdGlwVGVtcGxhdGUnKSBzZXJpZXNUb29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZGltczogVmlld0RpbWVuc2lvbnM7XG4gIHhTZXQ6IGFueTtcbiAgeERvbWFpbjogYW55O1xuICB5RG9tYWluOiBhbnk7XG4gIHNlcmllc0RvbWFpbjogYW55O1xuICB4U2NhbGU6IGFueTtcbiAgeVNjYWxlOiBhbnk7XG4gIHRyYW5zZm9ybTogc3RyaW5nO1xuICBjb2xvcnM6IENvbG9ySGVscGVyO1xuICBjbGlwUGF0aElkOiBzdHJpbmc7XG4gIGNsaXBQYXRoOiBzdHJpbmc7XG4gIHNjYWxlVHlwZTogc3RyaW5nO1xuICBzZXJpZXM6IGFueTtcbiAgbWFyZ2luID0gWzEwLCAyMCwgMTAsIDIwXTtcbiAgaG92ZXJlZFZlcnRpY2FsOiBhbnk7IC8vIHRoZSB2YWx1ZSBvZiB0aGUgeCBheGlzIHRoYXQgaXMgaG92ZXJlZCBvdmVyXG4gIHhBeGlzSGVpZ2h0OiBudW1iZXIgPSAwO1xuICB5QXhpc1dpZHRoOiBudW1iZXIgPSAwO1xuICBmaWx0ZXJlZERvbWFpbjogYW55O1xuICBsZWdlbmRPcHRpb25zOiBhbnk7XG5cbiAgdGltZWxpbmVXaWR0aDogYW55O1xuICB0aW1lbGluZUhlaWdodDogbnVtYmVyID0gNTA7XG4gIHRpbWVsaW5lWFNjYWxlOiBhbnk7XG4gIHRpbWVsaW5lWVNjYWxlOiBhbnk7XG4gIHRpbWVsaW5lWERvbWFpbjogYW55O1xuICB0aW1lbGluZVRyYW5zZm9ybTogYW55O1xuICB0aW1lbGluZVBhZGRpbmc6IG51bWJlciA9IDEwO1xuXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBzdXBlci51cGRhdGUoKTtcblxuICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luLFxuICAgICAgc2hvd1hBeGlzOiB0aGlzLnhBeGlzLFxuICAgICAgc2hvd1lBeGlzOiB0aGlzLnlBeGlzLFxuICAgICAgeEF4aXNIZWlnaHQ6IHRoaXMueEF4aXNIZWlnaHQsXG4gICAgICB5QXhpc1dpZHRoOiB0aGlzLnlBeGlzV2lkdGgsXG4gICAgICBzaG93WExhYmVsOiB0aGlzLnNob3dYQXhpc0xhYmVsLFxuICAgICAgc2hvd1lMYWJlbDogdGhpcy5zaG93WUF4aXNMYWJlbCxcbiAgICAgIHNob3dMZWdlbmQ6IHRoaXMubGVnZW5kLFxuICAgICAgbGVnZW5kVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxuICAgICAgbGVnZW5kUG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnRpbWVsaW5lKSB7XG4gICAgICB0aGlzLmRpbXMuaGVpZ2h0IC09IHRoaXMudGltZWxpbmVIZWlnaHQgKyB0aGlzLm1hcmdpblsyXSArIHRoaXMudGltZWxpbmVQYWRkaW5nO1xuICAgIH1cblxuICAgIHRoaXMueERvbWFpbiA9IHRoaXMuZ2V0WERvbWFpbigpO1xuICAgIGlmICh0aGlzLmZpbHRlcmVkRG9tYWluKSB7XG4gICAgICB0aGlzLnhEb21haW4gPSB0aGlzLmZpbHRlcmVkRG9tYWluO1xuICAgIH1cblxuICAgIHRoaXMueURvbWFpbiA9IHRoaXMuZ2V0WURvbWFpbigpO1xuICAgIHRoaXMuc2VyaWVzRG9tYWluID0gdGhpcy5nZXRTZXJpZXNEb21haW4oKTtcblxuICAgIHRoaXMueFNjYWxlID0gdGhpcy5nZXRYU2NhbGUodGhpcy54RG9tYWluLCB0aGlzLmRpbXMud2lkdGgpO1xuICAgIHRoaXMueVNjYWxlID0gdGhpcy5nZXRZU2NhbGUodGhpcy55RG9tYWluLCB0aGlzLmRpbXMuaGVpZ2h0KTtcblxuICAgIHRoaXMudXBkYXRlVGltZWxpbmUoKTtcblxuICAgIHRoaXMuc2V0Q29sb3JzKCk7XG4gICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XG5cbiAgICB0aGlzLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0aGlzLmRpbXMueE9mZnNldH0sICR7dGhpcy5tYXJnaW5bMF19KWA7XG5cbiAgICB0aGlzLmNsaXBQYXRoSWQgPSAnY2xpcCcgKyBpZCgpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5jbGlwUGF0aCA9IGB1cmwoIyR7dGhpcy5jbGlwUGF0aElkfSlgO1xuICB9XG5cbiAgdXBkYXRlVGltZWxpbmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGltZWxpbmUpIHtcbiAgICAgIHRoaXMudGltZWxpbmVXaWR0aCA9IHRoaXMuZGltcy53aWR0aDtcbiAgICAgIHRoaXMudGltZWxpbmVYRG9tYWluID0gdGhpcy5nZXRYRG9tYWluKCk7XG4gICAgICB0aGlzLnRpbWVsaW5lWFNjYWxlID0gdGhpcy5nZXRYU2NhbGUodGhpcy50aW1lbGluZVhEb21haW4sIHRoaXMudGltZWxpbmVXaWR0aCk7XG4gICAgICB0aGlzLnRpbWVsaW5lWVNjYWxlID0gdGhpcy5nZXRZU2NhbGUodGhpcy55RG9tYWluLCB0aGlzLnRpbWVsaW5lSGVpZ2h0KTtcbiAgICAgIHRoaXMudGltZWxpbmVUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy5kaW1zLnhPZmZzZXR9LCAkey10aGlzLm1hcmdpblsyXX0pYDtcbiAgICB9XG4gIH1cblxuICBnZXRYRG9tYWluKCk6IGFueVtdIHtcbiAgICBsZXQgdmFsdWVzID0gZ2V0VW5pcXVlWERvbWFpblZhbHVlcyh0aGlzLnJlc3VsdHMpO1xuXG4gICAgdGhpcy5zY2FsZVR5cGUgPSBnZXRTY2FsZVR5cGUodmFsdWVzKTtcbiAgICBsZXQgZG9tYWluID0gW107XG5cbiAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XG4gICAgICB2YWx1ZXMgPSB2YWx1ZXMubWFwKHYgPT4gTnVtYmVyKHYpKTtcbiAgICB9XG5cbiAgICBsZXQgbWluO1xuICAgIGxldCBtYXg7XG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScgfHwgdGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XG4gICAgICBtaW4gPSB0aGlzLnhTY2FsZU1pbiA/IHRoaXMueFNjYWxlTWluIDogTWF0aC5taW4oLi4udmFsdWVzKTtcblxuICAgICAgbWF4ID0gdGhpcy54U2NhbGVNYXggPyB0aGlzLnhTY2FsZU1heCA6IE1hdGgubWF4KC4uLnZhbHVlcyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcbiAgICAgIGRvbWFpbiA9IFtuZXcgRGF0ZShtaW4pLCBuZXcgRGF0ZShtYXgpXTtcbiAgICAgIHRoaXMueFNldCA9IFsuLi52YWx1ZXNdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgY29uc3QgYURhdGUgPSBhLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgYkRhdGUgPSBiLmdldFRpbWUoKTtcbiAgICAgICAgaWYgKGFEYXRlID4gYkRhdGUpIHJldHVybiAxO1xuICAgICAgICBpZiAoYkRhdGUgPiBhRGF0ZSkgcmV0dXJuIC0xO1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XG4gICAgICBkb21haW4gPSBbbWluLCBtYXhdO1xuICAgICAgLy8gVXNlIGNvbXBhcmUgZnVuY3Rpb24gdG8gc29ydCBudW1iZXJzIG51bWVyaWNhbGx5XG4gICAgICB0aGlzLnhTZXQgPSBbLi4udmFsdWVzXS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbWFpbiA9IHZhbHVlcztcbiAgICAgIHRoaXMueFNldCA9IHZhbHVlcztcbiAgICB9XG5cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgZ2V0WURvbWFpbigpOiBhbnlbXSB7XG4gICAgY29uc3QgZG9tYWluID0gW107XG5cbiAgICBmb3IgKGNvbnN0IHJlc3VsdHMgb2YgdGhpcy5yZXN1bHRzKSB7XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgcmVzdWx0cy5zZXJpZXMpIHtcbiAgICAgICAgaWYgKCFkb21haW4uaW5jbHVkZXMoZC52YWx1ZSkpIHtcbiAgICAgICAgICBkb21haW4ucHVzaChkLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlcyA9IFsuLi5kb21haW5dO1xuICAgIGlmICghdGhpcy5hdXRvU2NhbGUpIHtcbiAgICAgIHZhbHVlcy5wdXNoKDApO1xuICAgIH1cbiAgICBpZiAodGhpcy5iYXNlVmFsdWUgIT09ICdhdXRvJykge1xuICAgICAgdmFsdWVzLnB1c2godGhpcy5iYXNlVmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IG1pbiA9IHRoaXMueVNjYWxlTWluID8gdGhpcy55U2NhbGVNaW4gOiBNYXRoLm1pbiguLi52YWx1ZXMpO1xuXG4gICAgY29uc3QgbWF4ID0gdGhpcy55U2NhbGVNYXggPyB0aGlzLnlTY2FsZU1heCA6IE1hdGgubWF4KC4uLnZhbHVlcyk7XG5cbiAgICByZXR1cm4gW21pbiwgbWF4XTtcbiAgfVxuXG4gIGdldFNlcmllc0RvbWFpbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLm5hbWUpO1xuICB9XG5cbiAgZ2V0WFNjYWxlKGRvbWFpbiwgd2lkdGgpOiBhbnkge1xuICAgIGxldCBzY2FsZTtcblxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICBzY2FsZSA9IHNjYWxlVGltZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XG4gICAgICBzY2FsZSA9IHNjYWxlTGluZWFyKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICBzY2FsZSA9IHNjYWxlUG9pbnQoKS5wYWRkaW5nKDAuMSk7XG4gICAgfVxuXG4gICAgc2NhbGUucmFuZ2UoWzAsIHdpZHRoXSkuZG9tYWluKGRvbWFpbik7XG5cbiAgICByZXR1cm4gdGhpcy5yb3VuZERvbWFpbnMgPyBzY2FsZS5uaWNlKCkgOiBzY2FsZTtcbiAgfVxuXG4gIGdldFlTY2FsZShkb21haW4sIGhlaWdodCk6IGFueSB7XG4gICAgY29uc3Qgc2NhbGUgPSBzY2FsZUxpbmVhcigpLnJhbmdlKFtoZWlnaHQsIDBdKS5kb21haW4oZG9tYWluKTtcbiAgICByZXR1cm4gdGhpcy5yb3VuZERvbWFpbnMgPyBzY2FsZS5uaWNlKCkgOiBzY2FsZTtcbiAgfVxuXG4gIGdldFNjYWxlVHlwZSh2YWx1ZXMpOiBzdHJpbmcge1xuICAgIGxldCBkYXRlID0gdHJ1ZTtcbiAgICBsZXQgbnVtID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgaWYgKCF0aGlzLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgZGF0ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgbnVtID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIHJldHVybiAndGltZSc7XG4gICAgfVxuXG4gICAgaWYgKG51bSkge1xuICAgICAgcmV0dXJuICdsaW5lYXInO1xuICAgIH1cblxuICAgIHJldHVybiAnb3JkaW5hbCc7XG4gIH1cblxuICBpc0RhdGUodmFsdWUpOiBib29sZWFuIHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVEb21haW4oZG9tYWluKTogdm9pZCB7XG4gICAgdGhpcy5maWx0ZXJlZERvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLnhEb21haW4gPSB0aGlzLmZpbHRlcmVkRG9tYWluO1xuICAgIHRoaXMueFNjYWxlID0gdGhpcy5nZXRYU2NhbGUodGhpcy54RG9tYWluLCB0aGlzLmRpbXMud2lkdGgpO1xuICB9XG5cbiAgdXBkYXRlSG92ZXJlZFZlcnRpY2FsKGl0ZW0pOiB2b2lkIHtcbiAgICB0aGlzLmhvdmVyZWRWZXJ0aWNhbCA9IGl0ZW0udmFsdWU7XG4gICAgdGhpcy5kZWFjdGl2YXRlQWxsKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgaGlkZUNpcmNsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5ob3ZlcmVkVmVydGljYWwgPSBudWxsO1xuICAgIHRoaXMuZGVhY3RpdmF0ZUFsbCgpO1xuICB9XG5cbiAgb25DbGljayhkYXRhLCBzZXJpZXM/KTogdm9pZCB7XG4gICAgaWYgKHNlcmllcykge1xuICAgICAgZGF0YS5zZXJpZXMgPSBzZXJpZXMubmFtZTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdC5lbWl0KGRhdGEpO1xuICB9XG5cbiAgdHJhY2tCeShpbmRleCwgaXRlbSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAgfVxuXG4gIHNldENvbG9ycygpOiB2b2lkIHtcbiAgICBsZXQgZG9tYWluO1xuICAgIGlmICh0aGlzLnNjaGVtZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgZG9tYWluID0gdGhpcy5zZXJpZXNEb21haW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbWFpbiA9IHRoaXMueURvbWFpbjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgdGhpcy5zY2hlbWVUeXBlLCBkb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcbiAgfVxuXG4gIGdldExlZ2VuZE9wdGlvbnMoKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIHNjYWxlVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxuICAgICAgY29sb3JzOiB1bmRlZmluZWQsXG4gICAgICBkb21haW46IFtdLFxuICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXG4gICAgfTtcbiAgICBpZiAob3B0cy5zY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgb3B0cy5kb21haW4gPSB0aGlzLnNlcmllc0RvbWFpbjtcbiAgICAgIG9wdHMuY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgICBvcHRzLnRpdGxlID0gdGhpcy5sZWdlbmRUaXRsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy5kb21haW4gPSB0aGlzLnlEb21haW47XG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzLnNjYWxlO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfVxuXG4gIHVwZGF0ZVlBeGlzV2lkdGgoeyB3aWR0aCB9KTogdm9pZCB7XG4gICAgdGhpcy55QXhpc1dpZHRoID0gd2lkdGg7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZVhBeGlzSGVpZ2h0KHsgaGVpZ2h0IH0pOiB2b2lkIHtcbiAgICB0aGlzLnhBeGlzSGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBvbkFjdGl2YXRlKGl0ZW0pIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZEluZGV4KGQgPT4ge1xuICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lICYmIGQudmFsdWUgPT09IGl0ZW0udmFsdWU7XG4gICAgfSk7XG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2l0ZW0sIC4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIG9uRGVhY3RpdmF0ZShpdGVtKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xuXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogaXRlbSwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xuICB9XG5cbiAgZGVhY3RpdmF0ZUFsbCgpIHtcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuYWN0aXZlRW50cmllcykge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZW50cnksIGVudHJpZXM6IFtdIH0pO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbXTtcbiAgfVxufVxuIl19