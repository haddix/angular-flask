import { __decorate, __extends, __read, __spread, __values } from "tslib";
import { Component, Input, Output, EventEmitter, HostListener, ViewEncapsulation, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { scaleLinear, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { id } from '../utils/id';
import { getUniqueXDomainValues, getScaleType } from '../common/domain.helper';
var AreaChartNormalizedComponent = /** @class */ (function (_super) {
    __extends(AreaChartNormalizedComponent, _super);
    function AreaChartNormalizedComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.legend = false;
        _this.legendTitle = 'Legend';
        _this.legendPosition = 'right';
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
    AreaChartNormalizedComponent.prototype.update = function () {
        var _this = this;
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
        var _loop_1 = function (i) {
            var e_1, _a, e_2, _b;
            var val = this_1.xSet[i];
            var d0 = 0;
            var total = 0;
            try {
                for (var _c = (e_1 = void 0, __values(this_1.results)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var group = _d.value;
                    var d = group.series.find(function (item) {
                        var a = item.name;
                        var b = val;
                        if (_this.scaleType === 'time') {
                            a = a.valueOf();
                            b = b.valueOf();
                        }
                        return a === b;
                    });
                    if (d) {
                        total += d.value;
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
            try {
                for (var _e = (e_2 = void 0, __values(this_1.results)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var group = _f.value;
                    var d = group.series.find(function (item) {
                        var a = item.name;
                        var b = val;
                        if (_this.scaleType === 'time') {
                            a = a.valueOf();
                            b = b.valueOf();
                        }
                        return a === b;
                    });
                    if (d) {
                        d.d0 = d0;
                        d.d1 = d0 + d.value;
                        d0 += d.value;
                    }
                    else {
                        d = {
                            name: val,
                            value: 0,
                            d0: d0,
                            d1: d0
                        };
                        group.series.push(d);
                    }
                    if (total > 0) {
                        d.d0 = (d.d0 * 100) / total;
                        d.d1 = (d.d1 * 100) / total;
                    }
                    else {
                        d.d0 = 0;
                        d.d1 = 0;
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
        };
        var this_1 = this;
        for (var i = 0; i < this.xSet.length; i++) {
            _loop_1(i);
        }
        this.updateTimeline();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.transform = "translate(" + this.dims.xOffset + " , " + this.margin[0] + ")";
        this.clipPathId = 'clip' + id().toString();
        this.clipPath = "url(#" + this.clipPathId + ")";
    };
    AreaChartNormalizedComponent.prototype.updateTimeline = function () {
        if (this.timeline) {
            this.timelineWidth = this.dims.width;
            this.timelineXDomain = this.getXDomain();
            this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
            this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
            this.timelineTransform = "translate(" + this.dims.xOffset + ", " + -this.margin[2] + ")";
        }
    };
    AreaChartNormalizedComponent.prototype.getXDomain = function () {
        var values = getUniqueXDomainValues(this.results);
        this.scaleType = getScaleType(values);
        var domain = [];
        if (this.scaleType === 'time') {
            var min = Math.min.apply(Math, __spread(values));
            var max = Math.max.apply(Math, __spread(values));
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
            values = values.map(function (v) { return Number(v); });
            var min = Math.min.apply(Math, __spread(values));
            var max = Math.max.apply(Math, __spread(values));
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
    AreaChartNormalizedComponent.prototype.getYDomain = function () {
        return [0, 100];
    };
    AreaChartNormalizedComponent.prototype.getSeriesDomain = function () {
        return this.results.map(function (d) { return d.name; });
    };
    AreaChartNormalizedComponent.prototype.getXScale = function (domain, width) {
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
    AreaChartNormalizedComponent.prototype.getYScale = function (domain, height) {
        var scale = scaleLinear().range([height, 0]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    };
    AreaChartNormalizedComponent.prototype.updateDomain = function (domain) {
        this.filteredDomain = domain;
        this.xDomain = this.filteredDomain;
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
    };
    AreaChartNormalizedComponent.prototype.updateHoveredVertical = function (item) {
        this.hoveredVertical = item.value;
        this.deactivateAll();
    };
    AreaChartNormalizedComponent.prototype.hideCircles = function () {
        this.hoveredVertical = null;
        this.deactivateAll();
    };
    AreaChartNormalizedComponent.prototype.onClick = function (data, series) {
        if (series) {
            data.series = series.name;
        }
        this.select.emit(data);
    };
    AreaChartNormalizedComponent.prototype.trackBy = function (index, item) {
        return item.name;
    };
    AreaChartNormalizedComponent.prototype.setColors = function () {
        var domain;
        if (this.schemeType === 'ordinal') {
            domain = this.seriesDomain;
        }
        else {
            domain = this.yDomain;
        }
        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    };
    AreaChartNormalizedComponent.prototype.getLegendOptions = function () {
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
    AreaChartNormalizedComponent.prototype.updateYAxisWidth = function (_a) {
        var width = _a.width;
        this.yAxisWidth = width;
        this.update();
    };
    AreaChartNormalizedComponent.prototype.updateXAxisHeight = function (_a) {
        var height = _a.height;
        this.xAxisHeight = height;
        this.update();
    };
    AreaChartNormalizedComponent.prototype.onActivate = function (item) {
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = __spread([item], this.activeEntries);
        this.activate.emit({ value: item, entries: this.activeEntries });
    };
    AreaChartNormalizedComponent.prototype.onDeactivate = function (item) {
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = __spread(this.activeEntries);
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    };
    AreaChartNormalizedComponent.prototype.deactivateAll = function () {
        var e_3, _a;
        this.activeEntries = __spread(this.activeEntries);
        try {
            for (var _b = __values(this.activeEntries), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                this.deactivate.emit({ value: entry, entries: [] });
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.activeEntries = [];
    };
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "legend", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "legendTitle", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "legendPosition", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "xAxis", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "yAxis", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "showXAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "showYAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "xAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "yAxisLabel", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "timeline", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "gradient", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "showGridLines", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "curve", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "activeEntries", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "schemeType", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "trimXAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "trimYAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "rotateXAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "maxXAxisTickLength", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "maxYAxisTickLength", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "xAxisTickFormatting", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "yAxisTickFormatting", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "xAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "yAxisTicks", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "roundDomains", void 0);
    __decorate([
        Input()
    ], AreaChartNormalizedComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Output()
    ], AreaChartNormalizedComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], AreaChartNormalizedComponent.prototype, "deactivate", void 0);
    __decorate([
        ContentChild('tooltipTemplate')
    ], AreaChartNormalizedComponent.prototype, "tooltipTemplate", void 0);
    __decorate([
        ContentChild('seriesTooltipTemplate')
    ], AreaChartNormalizedComponent.prototype, "seriesTooltipTemplate", void 0);
    __decorate([
        HostListener('mouseleave')
    ], AreaChartNormalizedComponent.prototype, "hideCircles", null);
    AreaChartNormalizedComponent = __decorate([
        Component({
            selector: 'ngx-charts-area-chart-normalized',
            template: "\n    <ngx-charts-chart\n      [view]=\"[width, height]\"\n      [showLegend]=\"legend\"\n      [legendOptions]=\"legendOptions\"\n      [activeEntries]=\"activeEntries\"\n      [animations]=\"animations\"\n      (legendLabelClick)=\"onClick($event)\"\n      (legendLabelActivate)=\"onActivate($event)\"\n      (legendLabelDeactivate)=\"onDeactivate($event)\"\n    >\n      <svg:defs>\n        <svg:clipPath [attr.id]=\"clipPathId\">\n          <svg:rect\n            [attr.width]=\"dims.width + 10\"\n            [attr.height]=\"dims.height + 10\"\n            [attr.transform]=\"'translate(-5, -5)'\"\n          />\n        </svg:clipPath>\n      </svg:defs>\n      <svg:g [attr.transform]=\"transform\" class=\"area-chart chart\">\n        <svg:g\n          ngx-charts-x-axis\n          *ngIf=\"xAxis\"\n          [xScale]=\"xScale\"\n          [dims]=\"dims\"\n          [showGridLines]=\"showGridLines\"\n          [showLabel]=\"showXAxisLabel\"\n          [labelText]=\"xAxisLabel\"\n          [trimTicks]=\"trimXAxisTicks\"\n          [rotateTicks]=\"rotateXAxisTicks\"\n          [maxTickLength]=\"maxXAxisTickLength\"\n          [tickFormatting]=\"xAxisTickFormatting\"\n          [ticks]=\"xAxisTicks\"\n          (dimensionsChanged)=\"updateXAxisHeight($event)\"\n        ></svg:g>\n        <svg:g\n          ngx-charts-y-axis\n          *ngIf=\"yAxis\"\n          [yScale]=\"yScale\"\n          [dims]=\"dims\"\n          [showGridLines]=\"showGridLines\"\n          [showLabel]=\"showYAxisLabel\"\n          [labelText]=\"yAxisLabel\"\n          [trimTicks]=\"trimYAxisTicks\"\n          [maxTickLength]=\"maxYAxisTickLength\"\n          [tickFormatting]=\"yAxisTickFormatting\"\n          [ticks]=\"yAxisTicks\"\n          (dimensionsChanged)=\"updateYAxisWidth($event)\"\n        ></svg:g>\n        <svg:g [attr.clip-path]=\"clipPath\">\n          <svg:g *ngFor=\"let series of results; trackBy: trackBy\">\n            <svg:g\n              ngx-charts-area-series\n              [xScale]=\"xScale\"\n              [yScale]=\"yScale\"\n              [colors]=\"colors\"\n              [data]=\"series\"\n              [scaleType]=\"scaleType\"\n              [activeEntries]=\"activeEntries\"\n              [gradient]=\"gradient\"\n              normalized=\"true\"\n              [curve]=\"curve\"\n              [animations]=\"animations\"\n            />\n          </svg:g>\n\n          <svg:g *ngIf=\"!tooltipDisabled\" (mouseleave)=\"hideCircles()\">\n            <svg:g\n              ngx-charts-tooltip-area\n              [dims]=\"dims\"\n              [xSet]=\"xSet\"\n              [xScale]=\"xScale\"\n              [yScale]=\"yScale\"\n              [results]=\"results\"\n              [colors]=\"colors\"\n              [showPercentage]=\"true\"\n              [tooltipDisabled]=\"tooltipDisabled\"\n              [tooltipTemplate]=\"seriesTooltipTemplate\"\n              (hover)=\"updateHoveredVertical($event)\"\n            />\n\n            <svg:g *ngFor=\"let series of results\">\n              <svg:g\n                ngx-charts-circle-series\n                type=\"stacked\"\n                [xScale]=\"xScale\"\n                [yScale]=\"yScale\"\n                [colors]=\"colors\"\n                [activeEntries]=\"activeEntries\"\n                [data]=\"series\"\n                [scaleType]=\"scaleType\"\n                [visibleValue]=\"hoveredVertical\"\n                [tooltipDisabled]=\"tooltipDisabled\"\n                [tooltipTemplate]=\"tooltipTemplate\"\n                (select)=\"onClick($event, series)\"\n                (activate)=\"onActivate($event)\"\n                (deactivate)=\"onDeactivate($event)\"\n              />\n            </svg:g>\n          </svg:g>\n        </svg:g>\n      </svg:g>\n      <svg:g\n        ngx-charts-timeline\n        *ngIf=\"timeline && scaleType != 'ordinal'\"\n        [attr.transform]=\"timelineTransform\"\n        [results]=\"results\"\n        [view]=\"[timelineWidth, height]\"\n        [height]=\"timelineHeight\"\n        [scheme]=\"scheme\"\n        [customColors]=\"customColors\"\n        [legend]=\"legend\"\n        [scaleType]=\"scaleType\"\n        (onDomainChange)=\"updateDomain($event)\"\n      >\n        <svg:g *ngFor=\"let series of results; trackBy: trackBy\">\n          <svg:g\n            ngx-charts-area-series\n            [xScale]=\"timelineXScale\"\n            [yScale]=\"timelineYScale\"\n            [colors]=\"colors\"\n            [data]=\"series\"\n            [scaleType]=\"scaleType\"\n            [gradient]=\"gradient\"\n            normalized=\"true\"\n            [curve]=\"curve\"\n            [animations]=\"animations\"\n          />\n        </svg:g>\n      </svg:g>\n    </ngx-charts-chart>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None,
            styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}"]
        })
    ], AreaChartNormalizedComponent);
    return AreaChartNormalizedComponent;
}(BaseChartComponent));
export { AreaChartNormalizedComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS1jaGFydC1ub3JtYWxpemVkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL2FyZWEtY2hhcnQvYXJlYS1jaGFydC1ub3JtYWxpemVkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2QixZQUFZLEVBRWIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdkMsT0FBTyxFQUFFLHVCQUF1QixFQUFrQixNQUFNLGtDQUFrQyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQTZJL0U7SUFBa0QsZ0RBQWtCO0lBQXBFO1FBQUEscUVBMlVDO1FBMVVVLFlBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixpQkFBVyxHQUFXLFFBQVEsQ0FBQztRQUMvQixvQkFBYyxHQUFXLE9BQU8sQ0FBQztRQVNqQyxtQkFBYSxHQUFZLElBQUksQ0FBQztRQUM5QixXQUFLLEdBQVEsV0FBVyxDQUFDO1FBQ3pCLG1CQUFhLEdBQVUsRUFBRSxDQUFDO1FBRTFCLG9CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLG9CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLHNCQUFnQixH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QUFDLFlBQVksQ0FBQzttRUFJMUI7SUF2UFUsNEJBQTRCO1FBM0l4QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0NBQWtDO1lBQzVDLFFBQVEsRUFBRSw4b0pBb0lUO1lBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFFL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O1NBQ3RDLENBQUM7T0FDVyw0QkFBNEIsQ0EyVXhDO0lBQUQsbUNBQUM7Q0FBQSxBQTNVRCxDQUFrRCxrQkFBa0IsR0EyVW5FO1NBM1VZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29udGVudENoaWxkLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHNjYWxlTGluZWFyLCBzY2FsZVBvaW50LCBzY2FsZVRpbWUgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBjdXJ2ZUxpbmVhciB9IGZyb20gJ2QzLXNoYXBlJztcblxuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcbmltcG9ydCB7IEJhc2VDaGFydENvbXBvbmVudCB9IGZyb20gJy4uL2NvbW1vbi9iYXNlLWNoYXJ0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcbmltcG9ydCB7IGdldFVuaXF1ZVhEb21haW5WYWx1ZXMsIGdldFNjYWxlVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9kb21haW4uaGVscGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1hcmVhLWNoYXJ0LW5vcm1hbGl6ZWQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZ3gtY2hhcnRzLWNoYXJ0XG4gICAgICBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIlxuICAgICAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcbiAgICAgIFtsZWdlbmRPcHRpb25zXT1cImxlZ2VuZE9wdGlvbnNcIlxuICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcbiAgICAgIChsZWdlbmRMYWJlbENsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gICAgICAobGVnZW5kTGFiZWxBY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxuICAgICAgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPHN2ZzpkZWZzPlxuICAgICAgICA8c3ZnOmNsaXBQYXRoIFthdHRyLmlkXT1cImNsaXBQYXRoSWRcIj5cbiAgICAgICAgICA8c3ZnOnJlY3RcbiAgICAgICAgICAgIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKyAxMFwiXG4gICAgICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKyAxMFwiXG4gICAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZSgtNSwgLTUpJ1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zdmc6Y2xpcFBhdGg+XG4gICAgICA8L3N2ZzpkZWZzPlxuICAgICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiBjbGFzcz1cImFyZWEtY2hhcnQgY2hhcnRcIj5cbiAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgbmd4LWNoYXJ0cy14LWF4aXNcbiAgICAgICAgICAqbmdJZj1cInhBeGlzXCJcbiAgICAgICAgICBbeFNjYWxlXT1cInhTY2FsZVwiXG4gICAgICAgICAgW2RpbXNdPVwiZGltc1wiXG4gICAgICAgICAgW3Nob3dHcmlkTGluZXNdPVwic2hvd0dyaWRMaW5lc1wiXG4gICAgICAgICAgW3Nob3dMYWJlbF09XCJzaG93WEF4aXNMYWJlbFwiXG4gICAgICAgICAgW2xhYmVsVGV4dF09XCJ4QXhpc0xhYmVsXCJcbiAgICAgICAgICBbdHJpbVRpY2tzXT1cInRyaW1YQXhpc1RpY2tzXCJcbiAgICAgICAgICBbcm90YXRlVGlja3NdPVwicm90YXRlWEF4aXNUaWNrc1wiXG4gICAgICAgICAgW21heFRpY2tMZW5ndGhdPVwibWF4WEF4aXNUaWNrTGVuZ3RoXCJcbiAgICAgICAgICBbdGlja0Zvcm1hdHRpbmddPVwieEF4aXNUaWNrRm9ybWF0dGluZ1wiXG4gICAgICAgICAgW3RpY2tzXT1cInhBeGlzVGlja3NcIlxuICAgICAgICAgIChkaW1lbnNpb25zQ2hhbmdlZCk9XCJ1cGRhdGVYQXhpc0hlaWdodCgkZXZlbnQpXCJcbiAgICAgICAgPjwvc3ZnOmc+XG4gICAgICAgIDxzdmc6Z1xuICAgICAgICAgIG5neC1jaGFydHMteS1heGlzXG4gICAgICAgICAgKm5nSWY9XCJ5QXhpc1wiXG4gICAgICAgICAgW3lTY2FsZV09XCJ5U2NhbGVcIlxuICAgICAgICAgIFtkaW1zXT1cImRpbXNcIlxuICAgICAgICAgIFtzaG93R3JpZExpbmVzXT1cInNob3dHcmlkTGluZXNcIlxuICAgICAgICAgIFtzaG93TGFiZWxdPVwic2hvd1lBeGlzTGFiZWxcIlxuICAgICAgICAgIFtsYWJlbFRleHRdPVwieUF4aXNMYWJlbFwiXG4gICAgICAgICAgW3RyaW1UaWNrc109XCJ0cmltWUF4aXNUaWNrc1wiXG4gICAgICAgICAgW21heFRpY2tMZW5ndGhdPVwibWF4WUF4aXNUaWNrTGVuZ3RoXCJcbiAgICAgICAgICBbdGlja0Zvcm1hdHRpbmddPVwieUF4aXNUaWNrRm9ybWF0dGluZ1wiXG4gICAgICAgICAgW3RpY2tzXT1cInlBeGlzVGlja3NcIlxuICAgICAgICAgIChkaW1lbnNpb25zQ2hhbmdlZCk9XCJ1cGRhdGVZQXhpc1dpZHRoKCRldmVudClcIlxuICAgICAgICA+PC9zdmc6Zz5cbiAgICAgICAgPHN2ZzpnIFthdHRyLmNsaXAtcGF0aF09XCJjbGlwUGF0aFwiPlxuICAgICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgc2VyaWVzIG9mIHJlc3VsdHM7IHRyYWNrQnk6IHRyYWNrQnlcIj5cbiAgICAgICAgICAgIDxzdmc6Z1xuICAgICAgICAgICAgICBuZ3gtY2hhcnRzLWFyZWEtc2VyaWVzXG4gICAgICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcbiAgICAgICAgICAgICAgW3lTY2FsZV09XCJ5U2NhbGVcIlxuICAgICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXG4gICAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXG4gICAgICAgICAgICAgIFtzY2FsZVR5cGVdPVwic2NhbGVUeXBlXCJcbiAgICAgICAgICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXG4gICAgICAgICAgICAgIFtncmFkaWVudF09XCJncmFkaWVudFwiXG4gICAgICAgICAgICAgIG5vcm1hbGl6ZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgICAgW2N1cnZlXT1cImN1cnZlXCJcbiAgICAgICAgICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3ZnOmc+XG5cbiAgICAgICAgICA8c3ZnOmcgKm5nSWY9XCIhdG9vbHRpcERpc2FibGVkXCIgKG1vdXNlbGVhdmUpPVwiaGlkZUNpcmNsZXMoKVwiPlxuICAgICAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgICAgIG5neC1jaGFydHMtdG9vbHRpcC1hcmVhXG4gICAgICAgICAgICAgIFtkaW1zXT1cImRpbXNcIlxuICAgICAgICAgICAgICBbeFNldF09XCJ4U2V0XCJcbiAgICAgICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxuICAgICAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXG4gICAgICAgICAgICAgIFtyZXN1bHRzXT1cInJlc3VsdHNcIlxuICAgICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXG4gICAgICAgICAgICAgIFtzaG93UGVyY2VudGFnZV09XCJ0cnVlXCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBEaXNhYmxlZF09XCJ0b29sdGlwRGlzYWJsZWRcIlxuICAgICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInNlcmllc1Rvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIChob3Zlcik9XCJ1cGRhdGVIb3ZlcmVkVmVydGljYWwoJGV2ZW50KVwiXG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHNlcmllcyBvZiByZXN1bHRzXCI+XG4gICAgICAgICAgICAgIDxzdmc6Z1xuICAgICAgICAgICAgICAgIG5neC1jaGFydHMtY2lyY2xlLXNlcmllc1xuICAgICAgICAgICAgICAgIHR5cGU9XCJzdGFja2VkXCJcbiAgICAgICAgICAgICAgICBbeFNjYWxlXT1cInhTY2FsZVwiXG4gICAgICAgICAgICAgICAgW3lTY2FsZV09XCJ5U2NhbGVcIlxuICAgICAgICAgICAgICAgIFtjb2xvcnNdPVwiY29sb3JzXCJcbiAgICAgICAgICAgICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcbiAgICAgICAgICAgICAgICBbZGF0YV09XCJzZXJpZXNcIlxuICAgICAgICAgICAgICAgIFtzY2FsZVR5cGVdPVwic2NhbGVUeXBlXCJcbiAgICAgICAgICAgICAgICBbdmlzaWJsZVZhbHVlXT1cImhvdmVyZWRWZXJ0aWNhbFwiXG4gICAgICAgICAgICAgICAgW3Rvb2x0aXBEaXNhYmxlZF09XCJ0b29sdGlwRGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAoc2VsZWN0KT1cIm9uQ2xpY2soJGV2ZW50LCBzZXJpZXMpXCJcbiAgICAgICAgICAgICAgICAoYWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoZGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L3N2ZzpnPlxuICAgICAgICAgIDwvc3ZnOmc+XG4gICAgICAgIDwvc3ZnOmc+XG4gICAgICA8L3N2ZzpnPlxuICAgICAgPHN2ZzpnXG4gICAgICAgIG5neC1jaGFydHMtdGltZWxpbmVcbiAgICAgICAgKm5nSWY9XCJ0aW1lbGluZSAmJiBzY2FsZVR5cGUgIT0gJ29yZGluYWwnXCJcbiAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInRpbWVsaW5lVHJhbnNmb3JtXCJcbiAgICAgICAgW3Jlc3VsdHNdPVwicmVzdWx0c1wiXG4gICAgICAgIFt2aWV3XT1cIlt0aW1lbGluZVdpZHRoLCBoZWlnaHRdXCJcbiAgICAgICAgW2hlaWdodF09XCJ0aW1lbGluZUhlaWdodFwiXG4gICAgICAgIFtzY2hlbWVdPVwic2NoZW1lXCJcbiAgICAgICAgW2N1c3RvbUNvbG9yc109XCJjdXN0b21Db2xvcnNcIlxuICAgICAgICBbbGVnZW5kXT1cImxlZ2VuZFwiXG4gICAgICAgIFtzY2FsZVR5cGVdPVwic2NhbGVUeXBlXCJcbiAgICAgICAgKG9uRG9tYWluQ2hhbmdlKT1cInVwZGF0ZURvbWFpbigkZXZlbnQpXCJcbiAgICAgID5cbiAgICAgICAgPHN2ZzpnICpuZ0Zvcj1cImxldCBzZXJpZXMgb2YgcmVzdWx0czsgdHJhY2tCeTogdHJhY2tCeVwiPlxuICAgICAgICAgIDxzdmc6Z1xuICAgICAgICAgICAgbmd4LWNoYXJ0cy1hcmVhLXNlcmllc1xuICAgICAgICAgICAgW3hTY2FsZV09XCJ0aW1lbGluZVhTY2FsZVwiXG4gICAgICAgICAgICBbeVNjYWxlXT1cInRpbWVsaW5lWVNjYWxlXCJcbiAgICAgICAgICAgIFtjb2xvcnNdPVwiY29sb3JzXCJcbiAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXG4gICAgICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXG4gICAgICAgICAgICBbZ3JhZGllbnRdPVwiZ3JhZGllbnRcIlxuICAgICAgICAgICAgbm9ybWFsaXplZD1cInRydWVcIlxuICAgICAgICAgICAgW2N1cnZlXT1cImN1cnZlXCJcbiAgICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3ZnOmc+XG4gICAgICA8L3N2ZzpnPlxuICAgIDwvbmd4LWNoYXJ0cy1jaGFydD5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0eWxlVXJsczogWycuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEFyZWFDaGFydE5vcm1hbGl6ZWRDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQge1xuICBASW5wdXQoKSBsZWdlbmQgPSBmYWxzZTtcbiAgQElucHV0KCkgbGVnZW5kVGl0bGU6IHN0cmluZyA9ICdMZWdlbmQnO1xuICBASW5wdXQoKSBsZWdlbmRQb3NpdGlvbjogc3RyaW5nID0gJ3JpZ2h0JztcbiAgQElucHV0KCkgeEF4aXM7XG4gIEBJbnB1dCgpIHlBeGlzO1xuICBASW5wdXQoKSBzaG93WEF4aXNMYWJlbDtcbiAgQElucHV0KCkgc2hvd1lBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHhBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHlBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHRpbWVsaW5lO1xuICBASW5wdXQoKSBncmFkaWVudDtcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGN1cnZlOiBhbnkgPSBjdXJ2ZUxpbmVhcjtcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcbiAgQElucHV0KCkgc2NoZW1lVHlwZTogc3RyaW5nO1xuICBASW5wdXQoKSB0cmltWEF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHRyaW1ZQXhpc1RpY2tzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgcm90YXRlWEF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIG1heFhBeGlzVGlja0xlbmd0aDogbnVtYmVyID0gMTY7XG4gIEBJbnB1dCgpIG1heFlBeGlzVGlja0xlbmd0aDogbnVtYmVyID0gMTY7XG4gIEBJbnB1dCgpIHhBeGlzVGlja0Zvcm1hdHRpbmc6IGFueTtcbiAgQElucHV0KCkgeUF4aXNUaWNrRm9ybWF0dGluZzogYW55O1xuICBASW5wdXQoKSB4QXhpc1RpY2tzOiBhbnlbXTtcbiAgQElucHV0KCkgeUF4aXNUaWNrczogYW55W107XG4gIEBJbnB1dCgpIHJvdW5kRG9tYWluczogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSB0b29sdGlwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQENvbnRlbnRDaGlsZCgndG9vbHRpcFRlbXBsYXRlJykgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKCdzZXJpZXNUb29sdGlwVGVtcGxhdGUnKSBzZXJpZXNUb29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZGltczogVmlld0RpbWVuc2lvbnM7XG4gIHNjYWxlVHlwZTogc3RyaW5nO1xuICB4RG9tYWluOiBhbnlbXTtcbiAgeFNldDogYW55W107IC8vIHRoZSBzZXQgb2YgYWxsIHZhbHVlcyBvbiB0aGUgWCBBeGlzXG4gIHlEb21haW46IGFueVtdO1xuICBzZXJpZXNEb21haW46IGFueTtcbiAgeFNjYWxlOiBhbnk7XG4gIHlTY2FsZTogYW55O1xuICB0cmFuc2Zvcm06IHN0cmluZztcbiAgY2xpcFBhdGhJZDogc3RyaW5nO1xuICBjbGlwUGF0aDogc3RyaW5nO1xuICBjb2xvcnM6IENvbG9ySGVscGVyO1xuICBtYXJnaW4gPSBbMTAsIDIwLCAxMCwgMjBdO1xuICB0b29sdGlwQXJlYXM6IGFueVtdO1xuICBob3ZlcmVkVmVydGljYWw6IGFueTsgLy8gdGhlIHZhbHVlIG9mIHRoZSB4IGF4aXMgdGhhdCBpcyBob3ZlcmVkIG92ZXJcbiAgeEF4aXNIZWlnaHQ6IG51bWJlciA9IDA7XG4gIHlBeGlzV2lkdGg6IG51bWJlciA9IDA7XG4gIGZpbHRlcmVkRG9tYWluOiBhbnk7XG4gIGxlZ2VuZE9wdGlvbnM6IGFueTtcblxuICB0aW1lbGluZVdpZHRoOiBhbnk7XG4gIHRpbWVsaW5lSGVpZ2h0OiBudW1iZXIgPSA1MDtcbiAgdGltZWxpbmVYU2NhbGU6IGFueTtcbiAgdGltZWxpbmVZU2NhbGU6IGFueTtcbiAgdGltZWxpbmVYRG9tYWluOiBhbnk7XG4gIHRpbWVsaW5lVHJhbnNmb3JtOiBhbnk7XG4gIHRpbWVsaW5lUGFkZGluZzogbnVtYmVyID0gMTA7XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXG4gICAgICBzaG93WEF4aXM6IHRoaXMueEF4aXMsXG4gICAgICBzaG93WUF4aXM6IHRoaXMueUF4aXMsXG4gICAgICB4QXhpc0hlaWdodDogdGhpcy54QXhpc0hlaWdodCxcbiAgICAgIHlBeGlzV2lkdGg6IHRoaXMueUF4aXNXaWR0aCxcbiAgICAgIHNob3dYTGFiZWw6IHRoaXMuc2hvd1hBeGlzTGFiZWwsXG4gICAgICBzaG93WUxhYmVsOiB0aGlzLnNob3dZQXhpc0xhYmVsLFxuICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmQsXG4gICAgICBsZWdlbmRUeXBlOiB0aGlzLnNjaGVtZVR5cGUsXG4gICAgICBsZWdlbmRQb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvblxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMudGltZWxpbmUpIHtcbiAgICAgIHRoaXMuZGltcy5oZWlnaHQgLT0gdGhpcy50aW1lbGluZUhlaWdodCArIHRoaXMubWFyZ2luWzJdICsgdGhpcy50aW1lbGluZVBhZGRpbmc7XG4gICAgfVxuXG4gICAgdGhpcy54RG9tYWluID0gdGhpcy5nZXRYRG9tYWluKCk7XG4gICAgaWYgKHRoaXMuZmlsdGVyZWREb21haW4pIHtcbiAgICAgIHRoaXMueERvbWFpbiA9IHRoaXMuZmlsdGVyZWREb21haW47XG4gICAgfVxuXG4gICAgdGhpcy55RG9tYWluID0gdGhpcy5nZXRZRG9tYWluKCk7XG4gICAgdGhpcy5zZXJpZXNEb21haW4gPSB0aGlzLmdldFNlcmllc0RvbWFpbigpO1xuXG4gICAgdGhpcy54U2NhbGUgPSB0aGlzLmdldFhTY2FsZSh0aGlzLnhEb21haW4sIHRoaXMuZGltcy53aWR0aCk7XG4gICAgdGhpcy55U2NhbGUgPSB0aGlzLmdldFlTY2FsZSh0aGlzLnlEb21haW4sIHRoaXMuZGltcy5oZWlnaHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnhTZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZhbCA9IHRoaXMueFNldFtpXTtcbiAgICAgIGxldCBkMCA9IDA7XG5cbiAgICAgIGxldCB0b3RhbCA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGdyb3VwIG9mIHRoaXMucmVzdWx0cykge1xuICAgICAgICBjb25zdCBkID0gZ3JvdXAuc2VyaWVzLmZpbmQoaXRlbSA9PiB7XG4gICAgICAgICAgbGV0IGEgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgbGV0IGIgPSB2YWw7XG4gICAgICAgICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcbiAgICAgICAgICAgIGEgPSBhLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIGIgPSBiLnZhbHVlT2YoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgIHRvdGFsICs9IGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBncm91cCBvZiB0aGlzLnJlc3VsdHMpIHtcbiAgICAgICAgbGV0IGQgPSBncm91cC5zZXJpZXMuZmluZChpdGVtID0+IHtcbiAgICAgICAgICBsZXQgYSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICBsZXQgYiA9IHZhbDtcbiAgICAgICAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xuICAgICAgICAgICAgYSA9IGEudmFsdWVPZigpO1xuICAgICAgICAgICAgYiA9IGIudmFsdWVPZigpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICBkLmQwID0gZDA7XG4gICAgICAgICAgZC5kMSA9IGQwICsgZC52YWx1ZTtcbiAgICAgICAgICBkMCArPSBkLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGQgPSB7XG4gICAgICAgICAgICBuYW1lOiB2YWwsXG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIGQwLFxuICAgICAgICAgICAgZDE6IGQwXG4gICAgICAgICAgfTtcbiAgICAgICAgICBncm91cC5zZXJpZXMucHVzaChkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3RhbCA+IDApIHtcbiAgICAgICAgICBkLmQwID0gKGQuZDAgKiAxMDApIC8gdG90YWw7XG4gICAgICAgICAgZC5kMSA9IChkLmQxICogMTAwKSAvIHRvdGFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGQuZDAgPSAwO1xuICAgICAgICAgIGQuZDEgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVUaW1lbGluZSgpO1xuXG4gICAgdGhpcy5zZXRDb2xvcnMoKTtcbiAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcblxuICAgIHRoaXMudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMuZGltcy54T2Zmc2V0fSAsICR7dGhpcy5tYXJnaW5bMF19KWA7XG5cbiAgICB0aGlzLmNsaXBQYXRoSWQgPSAnY2xpcCcgKyBpZCgpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5jbGlwUGF0aCA9IGB1cmwoIyR7dGhpcy5jbGlwUGF0aElkfSlgO1xuICB9XG5cbiAgdXBkYXRlVGltZWxpbmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGltZWxpbmUpIHtcbiAgICAgIHRoaXMudGltZWxpbmVXaWR0aCA9IHRoaXMuZGltcy53aWR0aDtcbiAgICAgIHRoaXMudGltZWxpbmVYRG9tYWluID0gdGhpcy5nZXRYRG9tYWluKCk7XG4gICAgICB0aGlzLnRpbWVsaW5lWFNjYWxlID0gdGhpcy5nZXRYU2NhbGUodGhpcy50aW1lbGluZVhEb21haW4sIHRoaXMudGltZWxpbmVXaWR0aCk7XG4gICAgICB0aGlzLnRpbWVsaW5lWVNjYWxlID0gdGhpcy5nZXRZU2NhbGUodGhpcy55RG9tYWluLCB0aGlzLnRpbWVsaW5lSGVpZ2h0KTtcbiAgICAgIHRoaXMudGltZWxpbmVUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy5kaW1zLnhPZmZzZXR9LCAkey10aGlzLm1hcmdpblsyXX0pYDtcbiAgICB9XG4gIH1cblxuICBnZXRYRG9tYWluKCk6IGFueVtdIHtcbiAgICBsZXQgdmFsdWVzID0gZ2V0VW5pcXVlWERvbWFpblZhbHVlcyh0aGlzLnJlc3VsdHMpO1xuXG4gICAgdGhpcy5zY2FsZVR5cGUgPSBnZXRTY2FsZVR5cGUodmFsdWVzKTtcbiAgICBsZXQgZG9tYWluID0gW107XG5cbiAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xuICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udmFsdWVzKTtcbiAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XG4gICAgICBkb21haW4gPSBbbmV3IERhdGUobWluKSwgbmV3IERhdGUobWF4KV07XG4gICAgICB0aGlzLnhTZXQgPSBbLi4udmFsdWVzXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFEYXRlID0gYS5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IGJEYXRlID0gYi5nZXRUaW1lKCk7XG4gICAgICAgIGlmIChhRGF0ZSA+IGJEYXRlKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGJEYXRlID4gYURhdGUpIHJldHVybiAtMTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xuICAgICAgdmFsdWVzID0gdmFsdWVzLm1hcCh2ID0+IE51bWJlcih2KSk7XG4gICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbiguLi52YWx1ZXMpO1xuICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udmFsdWVzKTtcbiAgICAgIGRvbWFpbiA9IFttaW4sIG1heF07XG4gICAgICAvLyBVc2UgY29tcGFyZSBmdW5jdGlvbiB0byBzb3J0IG51bWJlcnMgbnVtZXJpY2FsbHlcbiAgICAgIHRoaXMueFNldCA9IFsuLi52YWx1ZXNdLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9tYWluID0gdmFsdWVzO1xuICAgICAgdGhpcy54U2V0ID0gdmFsdWVzO1xuICAgIH1cblxuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICBnZXRZRG9tYWluKCk6IGFueVtdIHtcbiAgICByZXR1cm4gWzAsIDEwMF07XG4gIH1cblxuICBnZXRTZXJpZXNEb21haW4oKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC5uYW1lKTtcbiAgfVxuXG4gIGdldFhTY2FsZShkb21haW4sIHdpZHRoKTogYW55IHtcbiAgICBsZXQgc2NhbGU7XG5cbiAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xuICAgICAgc2NhbGUgPSBzY2FsZVRpbWUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xuICAgICAgc2NhbGUgPSBzY2FsZUxpbmVhcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgc2NhbGUgPSBzY2FsZVBvaW50KCkucGFkZGluZygwLjEpO1xuICAgIH1cblxuICAgIHNjYWxlLnJhbmdlKFswLCB3aWR0aF0pLmRvbWFpbihkb21haW4pO1xuXG4gICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XG4gIH1cblxuICBnZXRZU2NhbGUoZG9tYWluLCBoZWlnaHQpOiBhbnkge1xuICAgIGNvbnN0IHNjYWxlID0gc2NhbGVMaW5lYXIoKS5yYW5nZShbaGVpZ2h0LCAwXSkuZG9tYWluKGRvbWFpbik7XG4gICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XG4gIH1cblxuICB1cGRhdGVEb21haW4oZG9tYWluKTogdm9pZCB7XG4gICAgdGhpcy5maWx0ZXJlZERvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLnhEb21haW4gPSB0aGlzLmZpbHRlcmVkRG9tYWluO1xuICAgIHRoaXMueFNjYWxlID0gdGhpcy5nZXRYU2NhbGUodGhpcy54RG9tYWluLCB0aGlzLmRpbXMud2lkdGgpO1xuICB9XG5cbiAgdXBkYXRlSG92ZXJlZFZlcnRpY2FsKGl0ZW0pOiB2b2lkIHtcbiAgICB0aGlzLmhvdmVyZWRWZXJ0aWNhbCA9IGl0ZW0udmFsdWU7XG4gICAgdGhpcy5kZWFjdGl2YXRlQWxsKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgaGlkZUNpcmNsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5ob3ZlcmVkVmVydGljYWwgPSBudWxsO1xuICAgIHRoaXMuZGVhY3RpdmF0ZUFsbCgpO1xuICB9XG5cbiAgb25DbGljayhkYXRhLCBzZXJpZXM/KTogdm9pZCB7XG4gICAgaWYgKHNlcmllcykge1xuICAgICAgZGF0YS5zZXJpZXMgPSBzZXJpZXMubmFtZTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdC5lbWl0KGRhdGEpO1xuICB9XG5cbiAgdHJhY2tCeShpbmRleCwgaXRlbSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAgfVxuXG4gIHNldENvbG9ycygpOiB2b2lkIHtcbiAgICBsZXQgZG9tYWluO1xuICAgIGlmICh0aGlzLnNjaGVtZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgZG9tYWluID0gdGhpcy5zZXJpZXNEb21haW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbWFpbiA9IHRoaXMueURvbWFpbjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgdGhpcy5zY2hlbWVUeXBlLCBkb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcbiAgfVxuXG4gIGdldExlZ2VuZE9wdGlvbnMoKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIHNjYWxlVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxuICAgICAgY29sb3JzOiB1bmRlZmluZWQsXG4gICAgICBkb21haW46IFtdLFxuICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXG4gICAgfTtcbiAgICBpZiAob3B0cy5zY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgb3B0cy5kb21haW4gPSB0aGlzLnNlcmllc0RvbWFpbjtcbiAgICAgIG9wdHMuY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgICBvcHRzLnRpdGxlID0gdGhpcy5sZWdlbmRUaXRsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy5kb21haW4gPSB0aGlzLnlEb21haW47XG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzLnNjYWxlO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfVxuXG4gIHVwZGF0ZVlBeGlzV2lkdGgoeyB3aWR0aCB9KTogdm9pZCB7XG4gICAgdGhpcy55QXhpc1dpZHRoID0gd2lkdGg7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZVhBeGlzSGVpZ2h0KHsgaGVpZ2h0IH0pOiB2b2lkIHtcbiAgICB0aGlzLnhBeGlzSGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBvbkFjdGl2YXRlKGl0ZW0pIHtcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZEluZGV4KGQgPT4ge1xuICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lICYmIGQudmFsdWUgPT09IGl0ZW0udmFsdWU7XG4gICAgfSk7XG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2l0ZW0sIC4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIG9uRGVhY3RpdmF0ZShpdGVtKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xuXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogaXRlbSwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xuICB9XG5cbiAgZGVhY3RpdmF0ZUFsbCgpIHtcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuYWN0aXZlRW50cmllcykge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogZW50cnksIGVudHJpZXM6IFtdIH0pO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbXTtcbiAgfVxufVxuIl19