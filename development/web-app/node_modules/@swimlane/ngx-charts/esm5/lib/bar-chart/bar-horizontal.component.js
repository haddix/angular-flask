import { __decorate, __extends, __read, __spread } from "tslib";
import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { scaleBand, scaleLinear } from 'd3-scale';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
var BarHorizontalComponent = /** @class */ (function (_super) {
    __extends(BarHorizontalComponent, _super);
    function BarHorizontalComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.legend = false;
        _this.legendTitle = 'Legend';
        _this.legendPosition = 'right';
        _this.tooltipDisabled = false;
        _this.showGridLines = true;
        _this.activeEntries = [];
        _this.trimXAxisTicks = true;
        _this.trimYAxisTicks = true;
        _this.rotateXAxisTicks = true;
        _this.maxXAxisTickLength = 16;
        _this.maxYAxisTickLength = 16;
        _this.barPadding = 8;
        _this.roundDomains = false;
        _this.roundEdges = true;
        _this.showDataLabel = false;
        _this.noBarWhenZero = true;
        _this.activate = new EventEmitter();
        _this.deactivate = new EventEmitter();
        _this.margin = [10, 20, 10, 20];
        _this.xAxisHeight = 0;
        _this.yAxisWidth = 0;
        _this.dataLabelMaxWidth = { negative: 0, positive: 0 };
        return _this;
    }
    BarHorizontalComponent.prototype.update = function () {
        _super.prototype.update.call(this);
        if (!this.showDataLabel) {
            this.dataLabelMaxWidth = { negative: 0, positive: 0 };
        }
        this.margin = [10, 20 + this.dataLabelMaxWidth.positive, 10, 20 + this.dataLabelMaxWidth.negative];
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
        this.formatDates();
        this.xScale = this.getXScale();
        this.yScale = this.getYScale();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.transform = "translate(" + this.dims.xOffset + " , " + this.margin[0] + ")";
    };
    BarHorizontalComponent.prototype.getXScale = function () {
        this.xDomain = this.getXDomain();
        var scale = scaleLinear().range([0, this.dims.width]).domain(this.xDomain);
        return this.roundDomains ? scale.nice() : scale;
    };
    BarHorizontalComponent.prototype.getYScale = function () {
        this.yDomain = this.getYDomain();
        var spacing = this.yDomain.length / (this.dims.height / this.barPadding + 1);
        return scaleBand().rangeRound([0, this.dims.height]).paddingInner(spacing).domain(this.yDomain);
    };
    BarHorizontalComponent.prototype.getXDomain = function () {
        var values = this.results.map(function (d) { return d.value; });
        var min = this.xScaleMin ? Math.min.apply(Math, __spread([this.xScaleMin], values)) : Math.min.apply(Math, __spread([0], values));
        var max = this.xScaleMax ? Math.max.apply(Math, __spread([this.xScaleMax], values)) : Math.max.apply(Math, __spread([0], values));
        return [min, max];
    };
    BarHorizontalComponent.prototype.getYDomain = function () {
        return this.results.map(function (d) { return d.label; });
    };
    BarHorizontalComponent.prototype.onClick = function (data) {
        this.select.emit(data);
    };
    BarHorizontalComponent.prototype.setColors = function () {
        var domain;
        if (this.schemeType === 'ordinal') {
            domain = this.yDomain;
        }
        else {
            domain = this.xDomain;
        }
        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    };
    BarHorizontalComponent.prototype.getLegendOptions = function () {
        var opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            title: undefined,
            position: this.legendPosition
        };
        if (opts.scaleType === 'ordinal') {
            opts.domain = this.yDomain;
            opts.colors = this.colors;
            opts.title = this.legendTitle;
        }
        else {
            opts.domain = this.xDomain;
            opts.colors = this.colors.scale;
        }
        return opts;
    };
    BarHorizontalComponent.prototype.updateYAxisWidth = function (_a) {
        var width = _a.width;
        this.yAxisWidth = width;
        this.update();
    };
    BarHorizontalComponent.prototype.updateXAxisHeight = function (_a) {
        var height = _a.height;
        this.xAxisHeight = height;
        this.update();
    };
    BarHorizontalComponent.prototype.onDataLabelMaxWidthChanged = function (event) {
        var _this = this;
        if (event.size.negative) {
            this.dataLabelMaxWidth.negative = Math.max(this.dataLabelMaxWidth.negative, event.size.width);
        }
        else {
            this.dataLabelMaxWidth.positive = Math.max(this.dataLabelMaxWidth.positive, event.size.width);
        }
        if (event.index === this.results.length - 1) {
            setTimeout(function () { return _this.update(); });
        }
    };
    BarHorizontalComponent.prototype.onActivate = function (item, fromLegend) {
        if (fromLegend === void 0) { fromLegend = false; }
        item = this.results.find(function (d) {
            if (fromLegend) {
                return d.label === item.name;
            }
            else {
                return d.name === item.name;
            }
        });
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value && d.series === item.series;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = __spread([item], this.activeEntries);
        this.activate.emit({ value: item, entries: this.activeEntries });
    };
    BarHorizontalComponent.prototype.onDeactivate = function (item, fromLegend) {
        if (fromLegend === void 0) { fromLegend = false; }
        item = this.results.find(function (d) {
            if (fromLegend) {
                return d.label === item.name;
            }
            else {
                return d.name === item.name;
            }
        });
        var idx = this.activeEntries.findIndex(function (d) {
            return d.name === item.name && d.value === item.value && d.series === item.series;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = __spread(this.activeEntries);
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    };
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "legend", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "legendTitle", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "legendPosition", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "xAxis", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "yAxis", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "showXAxisLabel", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "showYAxisLabel", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "xAxisLabel", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "yAxisLabel", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "gradient", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "showGridLines", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "activeEntries", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "schemeType", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "trimXAxisTicks", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "trimYAxisTicks", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "rotateXAxisTicks", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "maxXAxisTickLength", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "maxYAxisTickLength", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "xAxisTickFormatting", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "yAxisTickFormatting", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "xAxisTicks", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "yAxisTicks", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "barPadding", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "roundDomains", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "roundEdges", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "xScaleMax", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "xScaleMin", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "showDataLabel", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "dataLabelFormatting", void 0);
    __decorate([
        Input()
    ], BarHorizontalComponent.prototype, "noBarWhenZero", void 0);
    __decorate([
        Output()
    ], BarHorizontalComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], BarHorizontalComponent.prototype, "deactivate", void 0);
    __decorate([
        ContentChild('tooltipTemplate')
    ], BarHorizontalComponent.prototype, "tooltipTemplate", void 0);
    BarHorizontalComponent = __decorate([
        Component({
            selector: 'ngx-charts-bar-horizontal',
            template: "\n    <ngx-charts-chart\n      [view]=\"[width, height]\"\n      [showLegend]=\"legend\"\n      [legendOptions]=\"legendOptions\"\n      [activeEntries]=\"activeEntries\"\n      [animations]=\"animations\"\n      (legendLabelClick)=\"onClick($event)\"\n      (legendLabelActivate)=\"onActivate($event, true)\"\n      (legendLabelDeactivate)=\"onDeactivate($event, true)\"\n    >\n      <svg:g [attr.transform]=\"transform\" class=\"bar-chart chart\">\n        <svg:g\n          ngx-charts-x-axis\n          *ngIf=\"xAxis\"\n          [xScale]=\"xScale\"\n          [dims]=\"dims\"\n          [showGridLines]=\"showGridLines\"\n          [showLabel]=\"showXAxisLabel\"\n          [labelText]=\"xAxisLabel\"\n          [trimTicks]=\"trimXAxisTicks\"\n          [rotateTicks]=\"rotateXAxisTicks\"\n          [maxTickLength]=\"maxXAxisTickLength\"\n          [tickFormatting]=\"xAxisTickFormatting\"\n          [ticks]=\"xAxisTicks\"\n          (dimensionsChanged)=\"updateXAxisHeight($event)\"\n        ></svg:g>\n        <svg:g\n          ngx-charts-y-axis\n          *ngIf=\"yAxis\"\n          [yScale]=\"yScale\"\n          [dims]=\"dims\"\n          [showLabel]=\"showYAxisLabel\"\n          [labelText]=\"yAxisLabel\"\n          [trimTicks]=\"trimYAxisTicks\"\n          [maxTickLength]=\"maxYAxisTickLength\"\n          [tickFormatting]=\"yAxisTickFormatting\"\n          [ticks]=\"yAxisTicks\"\n          [yAxisOffset]=\"dataLabelMaxWidth.negative\"\n          (dimensionsChanged)=\"updateYAxisWidth($event)\"\n        ></svg:g>\n        <svg:g\n          ngx-charts-series-horizontal\n          [xScale]=\"xScale\"\n          [yScale]=\"yScale\"\n          [colors]=\"colors\"\n          [series]=\"results\"\n          [dims]=\"dims\"\n          [gradient]=\"gradient\"\n          [tooltipDisabled]=\"tooltipDisabled\"\n          [tooltipTemplate]=\"tooltipTemplate\"\n          [activeEntries]=\"activeEntries\"\n          [roundEdges]=\"roundEdges\"\n          [animations]=\"animations\"\n          [showDataLabel]=\"showDataLabel\"\n          [dataLabelFormatting]=\"dataLabelFormatting\"\n          [noBarWhenZero]=\"noBarWhenZero\"\n          (select)=\"onClick($event)\"\n          (activate)=\"onActivate($event)\"\n          (deactivate)=\"onDeactivate($event)\"\n          (dataLabelWidthChanged)=\"onDataLabelMaxWidthChanged($event)\"\n        ></svg:g>\n      </svg:g>\n    </ngx-charts-chart>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None,
            styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}"]
        })
    ], BarHorizontalComponent);
    return BarHorizontalComponent;
}(BaseChartComponent));
export { BarHorizontalComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLWhvcml6b250YWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvYmFyLWNoYXJ0L2Jhci1ob3Jpem9udGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVsRCxPQUFPLEVBQUUsdUJBQXVCLEVBQWtCLE1BQU0sa0NBQWtDLENBQUM7QUFDM0YsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBeUVwRTtJQUE0QywwQ0FBa0I7SUFBOUQ7UUFBQSxxRUErTUM7UUE5TVUsWUFBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGlCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLG9CQUFjLEdBQVcsT0FBTyxDQUFDO1FBT2pDLHFCQUFlLEdBQVksS0FBSyxDQUFDO1FBRWpDLG1CQUFhLEdBQVksSUFBSSxDQUFDO1FBQzlCLG1CQUFhLEdBQVUsRUFBRSxDQUFDO1FBRTFCLG9CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLG9CQUFjLEdBQVksSUFBSSxDQUFDO1FBQy9CLHNCQUFnQixHQUFZLElBQUksQ0FBQztRQUNqQyx3QkFBa0IsR0FBVyxFQUFFLENBQUM7UUFDaEMsd0JBQWtCLEdBQVcsRUFBRSxDQUFDO1FBS2hDLGdCQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2Ysa0JBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsZ0JBQVUsR0FBWSxJQUFJLENBQUM7UUFHM0IsbUJBQWEsR0FBWSxLQUFL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QUNsQjtRQUFSLEtBQUssRUFBRTs4REFBbUI7SUFDbEI7UUFBUixLQUFLLEVBQUU7OERBQWdCO0lBQ2Y7UUFBUixLQUFLLEVBQUU7Z0VBQStCO0lBQzlCO1FBQVIsS0FBSyxFQUFFOzhEQUE0QjtJQUMzQjtRQUFSLEtBQUssRUFBRTs2REFBbUI7SUFDbEI7UUFBUixLQUFLLEVBQUU7NkRBQW1CO0lBQ2xCO1FBQVIsS0FBSyxFQUFFO2lFQUFnQztJQUMvQjtRQUFSLEtBQUssRUFBRTt1RUFBMEI7SUFDekI7UUFBUixLQUFLLEVBQUU7aUVBQStCO0lBRTdCO1FBQVQsTUFBTSxFQUFFOzREQUFrRDtJQUNqRDtRQUFULE1BQU0sRUFBRTs4REFBb0Q7SUFFNUI7UUFBaEMsWUFBWSxDQUFDLGlCQUFpQixDQUFDO21FQUFtQztJQXBDeEQsc0JBQXNCO1FBdkVsQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsMkJBQTJCO1lBQ3JDLFFBQVEsRUFBRSxpM0VBZ0VUO1lBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFFL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O1NBQ3RDLENBQUM7T0FDVyxzQkFBc0IsQ0ErTWxDO0lBQUQsNkJBQUM7Q0FBQSxBQS9NRCxDQUE0QyxrQkFBa0IsR0ErTTdEO1NBL01ZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbnRlbnRDaGlsZCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBzY2FsZUJhbmQsIHNjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuXG5pbXBvcnQgeyBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucywgVmlld0RpbWVuc2lvbnMgfSBmcm9tICcuLi9jb21tb24vdmlldy1kaW1lbnNpb25zLmhlbHBlcic7XG5pbXBvcnQgeyBDb2xvckhlbHBlciB9IGZyb20gJy4uL2NvbW1vbi9jb2xvci5oZWxwZXInO1xuaW1wb3J0IHsgQmFzZUNoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1iYXItaG9yaXpvbnRhbCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5neC1jaGFydHMtY2hhcnRcbiAgICAgIFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiXG4gICAgICBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIlxuICAgICAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXG4gICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcbiAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxuICAgICAgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcbiAgICAgIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50LCB0cnVlKVwiXG4gICAgICAobGVnZW5kTGFiZWxEZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQsIHRydWUpXCJcbiAgICA+XG4gICAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiIGNsYXNzPVwiYmFyLWNoYXJ0IGNoYXJ0XCI+XG4gICAgICAgIDxzdmc6Z1xuICAgICAgICAgIG5neC1jaGFydHMteC1heGlzXG4gICAgICAgICAgKm5nSWY9XCJ4QXhpc1wiXG4gICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxuICAgICAgICAgIFtkaW1zXT1cImRpbXNcIlxuICAgICAgICAgIFtzaG93R3JpZExpbmVzXT1cInNob3dHcmlkTGluZXNcIlxuICAgICAgICAgIFtzaG93TGFiZWxdPVwic2hvd1hBeGlzTGFiZWxcIlxuICAgICAgICAgIFtsYWJlbFRleHRdPVwieEF4aXNMYWJlbFwiXG4gICAgICAgICAgW3RyaW1UaWNrc109XCJ0cmltWEF4aXNUaWNrc1wiXG4gICAgICAgICAgW3JvdGF0ZVRpY2tzXT1cInJvdGF0ZVhBeGlzVGlja3NcIlxuICAgICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFhBeGlzVGlja0xlbmd0aFwiXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInhBeGlzVGlja0Zvcm1hdHRpbmdcIlxuICAgICAgICAgIFt0aWNrc109XCJ4QXhpc1RpY2tzXCJcbiAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwidXBkYXRlWEF4aXNIZWlnaHQoJGV2ZW50KVwiXG4gICAgICAgID48L3N2ZzpnPlxuICAgICAgICA8c3ZnOmdcbiAgICAgICAgICBuZ3gtY2hhcnRzLXktYXhpc1xuICAgICAgICAgICpuZ0lmPVwieUF4aXNcIlxuICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcbiAgICAgICAgICBbZGltc109XCJkaW1zXCJcbiAgICAgICAgICBbc2hvd0xhYmVsXT1cInNob3dZQXhpc0xhYmVsXCJcbiAgICAgICAgICBbbGFiZWxUZXh0XT1cInlBeGlzTGFiZWxcIlxuICAgICAgICAgIFt0cmltVGlja3NdPVwidHJpbVlBeGlzVGlja3NcIlxuICAgICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFlBeGlzVGlja0xlbmd0aFwiXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInlBeGlzVGlja0Zvcm1hdHRpbmdcIlxuICAgICAgICAgIFt0aWNrc109XCJ5QXhpc1RpY2tzXCJcbiAgICAgICAgICBbeUF4aXNPZmZzZXRdPVwiZGF0YUxhYmVsTWF4V2lkdGgubmVnYXRpdmVcIlxuICAgICAgICAgIChkaW1lbnNpb25zQ2hhbmdlZCk9XCJ1cGRhdGVZQXhpc1dpZHRoKCRldmVudClcIlxuICAgICAgICA+PC9zdmc6Zz5cbiAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgbmd4LWNoYXJ0cy1zZXJpZXMtaG9yaXpvbnRhbFxuICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcbiAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXG4gICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxuICAgICAgICAgIFtzZXJpZXNdPVwicmVzdWx0c1wiXG4gICAgICAgICAgW2RpbXNdPVwiZGltc1wiXG4gICAgICAgICAgW2dyYWRpZW50XT1cImdyYWRpZW50XCJcbiAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXG4gICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxuICAgICAgICAgIFtyb3VuZEVkZ2VzXT1cInJvdW5kRWRnZXNcIlxuICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxuICAgICAgICAgIFtzaG93RGF0YUxhYmVsXT1cInNob3dEYXRhTGFiZWxcIlxuICAgICAgICAgIFtkYXRhTGFiZWxGb3JtYXR0aW5nXT1cImRhdGFMYWJlbEZvcm1hdHRpbmdcIlxuICAgICAgICAgIFtub0JhcldoZW5aZXJvXT1cIm5vQmFyV2hlblplcm9cIlxuICAgICAgICAgIChzZWxlY3QpPVwib25DbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAoYWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICAgICAgICAoZGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgICAgICAgKGRhdGFMYWJlbFdpZHRoQ2hhbmdlZCk9XCJvbkRhdGFMYWJlbE1heFdpZHRoQ2hhbmdlZCgkZXZlbnQpXCJcbiAgICAgICAgPjwvc3ZnOmc+XG4gICAgICA8L3N2ZzpnPlxuICAgIDwvbmd4LWNoYXJ0cy1jaGFydD5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0eWxlVXJsczogWycuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEJhckhvcml6b250YWxDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQge1xuICBASW5wdXQoKSBsZWdlbmQgPSBmYWxzZTtcbiAgQElucHV0KCkgbGVnZW5kVGl0bGU6IHN0cmluZyA9ICdMZWdlbmQnO1xuICBASW5wdXQoKSBsZWdlbmRQb3NpdGlvbjogc3RyaW5nID0gJ3JpZ2h0JztcbiAgQElucHV0KCkgeEF4aXM7XG4gIEBJbnB1dCgpIHlBeGlzO1xuICBASW5wdXQoKSBzaG93WEF4aXNMYWJlbDtcbiAgQElucHV0KCkgc2hvd1lBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHhBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHlBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbjtcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XG4gIEBJbnB1dCgpIHNjaGVtZVR5cGU6IHN0cmluZztcbiAgQElucHV0KCkgdHJpbVhBeGlzVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSB0cmltWUF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHJvdGF0ZVhBeGlzVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBtYXhYQXhpc1RpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xuICBASW5wdXQoKSBtYXhZQXhpc1RpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xuICBASW5wdXQoKSB4QXhpc1RpY2tGb3JtYXR0aW5nOiBhbnk7XG4gIEBJbnB1dCgpIHlBeGlzVGlja0Zvcm1hdHRpbmc6IGFueTtcbiAgQElucHV0KCkgeEF4aXNUaWNrczogYW55W107XG4gIEBJbnB1dCgpIHlBeGlzVGlja3M6IGFueVtdO1xuICBASW5wdXQoKSBiYXJQYWRkaW5nID0gODtcbiAgQElucHV0KCkgcm91bmREb21haW5zOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJvdW5kRWRnZXM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSB4U2NhbGVNYXg6IG51bWJlcjtcbiAgQElucHV0KCkgeFNjYWxlTWluOiBudW1iZXI7XG4gIEBJbnB1dCgpIHNob3dEYXRhTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgZGF0YUxhYmVsRm9ybWF0dGluZzogYW55O1xuICBASW5wdXQoKSBub0JhcldoZW5aZXJvOiBib29sZWFuID0gdHJ1ZTtcblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQENvbnRlbnRDaGlsZCgndG9vbHRpcFRlbXBsYXRlJykgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xuICB5U2NhbGU6IGFueTtcbiAgeFNjYWxlOiBhbnk7XG4gIHhEb21haW46IGFueTtcbiAgeURvbWFpbjogYW55O1xuICB0cmFuc2Zvcm06IHN0cmluZztcbiAgY29sb3JzOiBDb2xvckhlbHBlcjtcbiAgbWFyZ2luID0gWzEwLCAyMCwgMTAsIDIwXTtcbiAgeEF4aXNIZWlnaHQ6IG51bWJlciA9IDA7XG4gIHlBeGlzV2lkdGg6IG51bWJlciA9IDA7XG4gIGxlZ2VuZE9wdGlvbnM6IGFueTtcbiAgZGF0YUxhYmVsTWF4V2lkdGg6IGFueSA9IHsgbmVnYXRpdmU6IDAsIHBvc2l0aXZlOiAwIH07XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuXG4gICAgaWYgKCF0aGlzLnNob3dEYXRhTGFiZWwpIHtcbiAgICAgIHRoaXMuZGF0YUxhYmVsTWF4V2lkdGggPSB7IG5lZ2F0aXZlOiAwLCBwb3NpdGl2ZTogMCB9O1xuICAgIH1cblxuICAgIHRoaXMubWFyZ2luID0gWzEwLCAyMCArIHRoaXMuZGF0YUxhYmVsTWF4V2lkdGgucG9zaXRpdmUsIDEwLCAyMCArIHRoaXMuZGF0YUxhYmVsTWF4V2lkdGgubmVnYXRpdmVdO1xuXG4gICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXG4gICAgICBzaG93WEF4aXM6IHRoaXMueEF4aXMsXG4gICAgICBzaG93WUF4aXM6IHRoaXMueUF4aXMsXG4gICAgICB4QXhpc0hlaWdodDogdGhpcy54QXhpc0hlaWdodCxcbiAgICAgIHlBeGlzV2lkdGg6IHRoaXMueUF4aXNXaWR0aCxcbiAgICAgIHNob3dYTGFiZWw6IHRoaXMuc2hvd1hBeGlzTGFiZWwsXG4gICAgICBzaG93WUxhYmVsOiB0aGlzLnNob3dZQXhpc0xhYmVsLFxuICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmQsXG4gICAgICBsZWdlbmRUeXBlOiB0aGlzLnNjaGVtZVR5cGUsXG4gICAgICBsZWdlbmRQb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvblxuICAgIH0pO1xuXG4gICAgdGhpcy5mb3JtYXREYXRlcygpO1xuXG4gICAgdGhpcy54U2NhbGUgPSB0aGlzLmdldFhTY2FsZSgpO1xuICAgIHRoaXMueVNjYWxlID0gdGhpcy5nZXRZU2NhbGUoKTtcblxuICAgIHRoaXMuc2V0Q29sb3JzKCk7XG4gICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XG5cbiAgICB0aGlzLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0aGlzLmRpbXMueE9mZnNldH0gLCAke3RoaXMubWFyZ2luWzBdfSlgO1xuICB9XG5cbiAgZ2V0WFNjYWxlKCk6IGFueSB7XG4gICAgdGhpcy54RG9tYWluID0gdGhpcy5nZXRYRG9tYWluKCk7XG5cbiAgICBjb25zdCBzY2FsZSA9IHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMuZGltcy53aWR0aF0pLmRvbWFpbih0aGlzLnhEb21haW4pO1xuXG4gICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XG4gIH1cblxuICBnZXRZU2NhbGUoKTogYW55IHtcbiAgICB0aGlzLnlEb21haW4gPSB0aGlzLmdldFlEb21haW4oKTtcbiAgICBjb25zdCBzcGFjaW5nID0gdGhpcy55RG9tYWluLmxlbmd0aCAvICh0aGlzLmRpbXMuaGVpZ2h0IC8gdGhpcy5iYXJQYWRkaW5nICsgMSk7XG5cbiAgICByZXR1cm4gc2NhbGVCYW5kKCkucmFuZ2VSb3VuZChbMCwgdGhpcy5kaW1zLmhlaWdodF0pLnBhZGRpbmdJbm5lcihzcGFjaW5nKS5kb21haW4odGhpcy55RG9tYWluKTtcbiAgfVxuXG4gIGdldFhEb21haW4oKTogYW55W10ge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLnZhbHVlKTtcbiAgICBjb25zdCBtaW4gPSB0aGlzLnhTY2FsZU1pbiA/IE1hdGgubWluKHRoaXMueFNjYWxlTWluLCAuLi52YWx1ZXMpIDogTWF0aC5taW4oMCwgLi4udmFsdWVzKTtcblxuICAgIGNvbnN0IG1heCA9IHRoaXMueFNjYWxlTWF4ID8gTWF0aC5tYXgodGhpcy54U2NhbGVNYXgsIC4uLnZhbHVlcykgOiBNYXRoLm1heCgwLCAuLi52YWx1ZXMpO1xuICAgIHJldHVybiBbbWluLCBtYXhdO1xuICB9XG5cbiAgZ2V0WURvbWFpbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLmxhYmVsKTtcbiAgfVxuXG4gIG9uQ2xpY2soZGF0YSk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF0YSk7XG4gIH1cblxuICBzZXRDb2xvcnMoKTogdm9pZCB7XG4gICAgbGV0IGRvbWFpbjtcbiAgICBpZiAodGhpcy5zY2hlbWVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgIGRvbWFpbiA9IHRoaXMueURvbWFpbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9tYWluID0gdGhpcy54RG9tYWluO1xuICAgIH1cblxuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCB0aGlzLnNjaGVtZVR5cGUsIGRvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xuICB9XG5cbiAgZ2V0TGVnZW5kT3B0aW9ucygpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgc2NhbGVUeXBlOiB0aGlzLnNjaGVtZVR5cGUsXG4gICAgICBjb2xvcnM6IHVuZGVmaW5lZCxcbiAgICAgIGRvbWFpbjogW10sXG4gICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cbiAgICB9O1xuICAgIGlmIChvcHRzLnNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICBvcHRzLmRvbWFpbiA9IHRoaXMueURvbWFpbjtcbiAgICAgIG9wdHMuY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgICBvcHRzLnRpdGxlID0gdGhpcy5sZWdlbmRUaXRsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy5kb21haW4gPSB0aGlzLnhEb21haW47XG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzLnNjYWxlO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRzO1xuICB9XG5cbiAgdXBkYXRlWUF4aXNXaWR0aCh7IHdpZHRoIH0pOiB2b2lkIHtcbiAgICB0aGlzLnlBeGlzV2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlWEF4aXNIZWlnaHQoeyBoZWlnaHQgfSk6IHZvaWQge1xuICAgIHRoaXMueEF4aXNIZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uRGF0YUxhYmVsTWF4V2lkdGhDaGFuZ2VkKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnNpemUubmVnYXRpdmUpIHtcbiAgICAgIHRoaXMuZGF0YUxhYmVsTWF4V2lkdGgubmVnYXRpdmUgPSBNYXRoLm1heCh0aGlzLmRhdGFMYWJlbE1heFdpZHRoLm5lZ2F0aXZlLCBldmVudC5zaXplLndpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhTGFiZWxNYXhXaWR0aC5wb3NpdGl2ZSA9IE1hdGgubWF4KHRoaXMuZGF0YUxhYmVsTWF4V2lkdGgucG9zaXRpdmUsIGV2ZW50LnNpemUud2lkdGgpO1xuICAgIH1cbiAgICBpZiAoZXZlbnQuaW5kZXggPT09IHRoaXMucmVzdWx0cy5sZW5ndGggLSAxKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlKCkpO1xuICAgIH1cbiAgfVxuXG4gIG9uQWN0aXZhdGUoaXRlbSwgZnJvbUxlZ2VuZCA9IGZhbHNlKSB7XG4gICAgaXRlbSA9IHRoaXMucmVzdWx0cy5maW5kKGQgPT4ge1xuICAgICAgaWYgKGZyb21MZWdlbmQpIHtcbiAgICAgICAgcmV0dXJuIGQubGFiZWwgPT09IGl0ZW0ubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZSAmJiBkLnNlcmllcyA9PT0gaXRlbS5zZXJpZXM7XG4gICAgfSk7XG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2l0ZW0sIC4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIG9uRGVhY3RpdmF0ZShpdGVtLCBmcm9tTGVnZW5kID0gZmFsc2UpIHtcbiAgICBpdGVtID0gdGhpcy5yZXN1bHRzLmZpbmQoZCA9PiB7XG4gICAgICBpZiAoZnJvbUxlZ2VuZCkge1xuICAgICAgICByZXR1cm4gZC5sYWJlbCA9PT0gaXRlbS5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlICYmIGQuc2VyaWVzID09PSBpdGVtLnNlcmllcztcbiAgICB9KTtcblxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcblxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxufVxuIl19