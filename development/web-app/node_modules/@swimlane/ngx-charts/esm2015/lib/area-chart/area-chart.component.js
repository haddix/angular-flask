import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ViewEncapsulation, HostListener, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { scaleLinear, scalePoint, scaleTime } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { id } from '../utils/id';
import { getUniqueXDomainValues, getScaleType } from '../common/domain.helper';
let AreaChartComponent = class AreaChartComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.legendTitle = 'Legend';
        this.legendPosition = 'right';
        this.baseValue = 'auto';
        this.showGridLines = true;
        this.curve = curveLinear;
        this.activeEntries = [];
        this.trimXAxisTicks = true;
        this.trimYAxisTicks = true;
        this.rotateXAxisTicks = true;
        this.maxXAxisTickLength = 16;
        this.maxYAxisTickLength = 16;
        this.roundDomains = false;
        this.tooltipDisabled = false;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.margin = [10, 20, 10, 20];
        this.xAxisHeight = 0;
        this.yAxisWidth = 0;
        this.timelineHeight = 50;
        this.timelinePadding = 10;
    }
    update() {
        super.update();
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
        this.transform = `translate(${this.dims.xOffset}, ${this.margin[0]})`;
        this.clipPathId = 'clip' + id().toString();
        this.clipPath = `url(#${this.clipPathId})`;
    }
    updateTimeline() {
        if (this.timeline) {
            this.timelineWidth = this.dims.width;
            this.timelineXDomain = this.getXDomain();
            this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
            this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
            this.timelineTransform = `translate(${this.dims.xOffset}, ${-this.margin[2]})`;
        }
    }
    getXDomain() {
        let values = getUniqueXDomainValues(this.results);
        this.scaleType = getScaleType(values);
        let domain = [];
        if (this.scaleType === 'linear') {
            values = values.map(v => Number(v));
        }
        let min;
        let max;
        if (this.scaleType === 'time' || this.scaleType === 'linear') {
            min = this.xScaleMin ? this.xScaleMin : Math.min(...values);
            max = this.xScaleMax ? this.xScaleMax : Math.max(...values);
        }
        if (this.scaleType === 'time') {
            domain = [new Date(min), new Date(max)];
            this.xSet = [...values].sort((a, b) => {
                const aDate = a.getTime();
                const bDate = b.getTime();
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
            this.xSet = [...values].sort((a, b) => a - b);
        }
        else {
            domain = values;
            this.xSet = values;
        }
        return domain;
    }
    getYDomain() {
        const domain = [];
        for (const results of this.results) {
            for (const d of results.series) {
                if (!domain.includes(d.value)) {
                    domain.push(d.value);
                }
            }
        }
        const values = [...domain];
        if (!this.autoScale) {
            values.push(0);
        }
        if (this.baseValue !== 'auto') {
            values.push(this.baseValue);
        }
        const min = this.yScaleMin ? this.yScaleMin : Math.min(...values);
        const max = this.yScaleMax ? this.yScaleMax : Math.max(...values);
        return [min, max];
    }
    getSeriesDomain() {
        return this.results.map(d => d.name);
    }
    getXScale(domain, width) {
        let scale;
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
    }
    getYScale(domain, height) {
        const scale = scaleLinear().range([height, 0]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    }
    getScaleType(values) {
        let date = true;
        let num = true;
        for (const value of values) {
            if (!this.isDate(value)) {
                date = false;
            }
            if (typeof value !== 'number') {
                num = false;
            }
        }
        if (date) {
            return 'time';
        }
        if (num) {
            return 'linear';
        }
        return 'ordinal';
    }
    isDate(value) {
        if (value instanceof Date) {
            return true;
        }
        return false;
    }
    updateDomain(domain) {
        this.filteredDomain = domain;
        this.xDomain = this.filteredDomain;
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
    }
    updateHoveredVertical(item) {
        this.hoveredVertical = item.value;
        this.deactivateAll();
    }
    hideCircles() {
        this.hoveredVertical = null;
        this.deactivateAll();
    }
    onClick(data, series) {
        if (series) {
            data.series = series.name;
        }
        this.select.emit(data);
    }
    trackBy(index, item) {
        return item.name;
    }
    setColors() {
        let domain;
        if (this.schemeType === 'ordinal') {
            domain = this.seriesDomain;
        }
        else {
            domain = this.yDomain;
        }
        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    }
    getLegendOptions() {
        const opts = {
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
    }
    updateYAxisWidth({ width }) {
        this.yAxisWidth = width;
        this.update();
    }
    updateXAxisHeight({ height }) {
        this.xAxisHeight = height;
        this.update();
    }
    onActivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = [item, ...this.activeEntries];
        this.activate.emit({ value: item, entries: this.activeEntries });
    }
    onDeactivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    }
    deactivateAll() {
        this.activeEntries = [...this.activeEntries];
        for (const entry of this.activeEntries) {
            this.deactivate.emit({ value: entry, entries: [] });
        }
        this.activeEntries = [];
    }
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
        template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
    >
      <svg:defs>
        <svg:clipPath [attr.id]="clipPathId">
          <svg:rect
            [attr.width]="dims.width + 10"
            [attr.height]="dims.height + 10"
            [attr.transform]="'translate(-5, -5)'"
          />
        </svg:clipPath>
      </svg:defs>
      <svg:g [attr.transform]="transform" class="area-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of results; trackBy: trackBy">
            <svg:g
              ngx-charts-area-series
              [xScale]="xScale"
              [yScale]="yScale"
              [baseValue]="baseValue"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntries"
              [scaleType]="scaleType"
              [gradient]="gradient"
              [curve]="curve"
              [animations]="animations"
            />
          </svg:g>

          <svg:g *ngIf="!tooltipDisabled" (mouseleave)="hideCircles()">
            <svg:g
              ngx-charts-tooltip-area
              [dims]="dims"
              [xSet]="xSet"
              [xScale]="xScale"
              [yScale]="yScale"
              [results]="results"
              [colors]="colors"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="seriesTooltipTemplate"
              (hover)="updateHoveredVertical($event)"
            />

            <svg:g *ngFor="let series of results">
              <svg:g
                ngx-charts-circle-series
                [xScale]="xScale"
                [yScale]="yScale"
                [colors]="colors"
                [activeEntries]="activeEntries"
                [data]="series"
                [scaleType]="scaleType"
                [visibleValue]="hoveredVertical"
                [tooltipDisabled]="tooltipDisabled"
                [tooltipTemplate]="tooltipTemplate"
                (select)="onClick($event, series)"
                (activate)="onActivate($event)"
                (deactivate)="onDeactivate($event)"
              />
            </svg:g>
          </svg:g>
        </svg:g>
      </svg:g>
      <svg:g
        ngx-charts-timeline
        *ngIf="timeline && scaleType != 'ordinal'"
        [attr.transform]="timelineTransform"
        [results]="results"
        [view]="[timelineWidth, height]"
        [height]="timelineHeight"
        [scheme]="scheme"
        [customColors]="customColors"
        [legend]="legend"
        [scaleType]="scaleType"
        (onDomainChange)="updateDomain($event)"
      >
        <svg:g *ngFor="let series of results; trackBy: trackBy">
          <svg:g
            ngx-charts-area-series
            [xScale]="timelineXScale"
            [yScale]="timelineYScale"
            [baseValue]="baseValue"
            [colors]="colors"
            [data]="series"
            [scaleType]="scaleType"
            [gradient]="gradient"
            [curve]="curve"
            [animations]="animations"
          />
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}"]
    })
], AreaChartComponent);
export { AreaChartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9hcmVhLWNoYXJ0L2FyZWEtY2hhcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUV2QyxPQUFPLEVBQUUsdUJBQXVCLEVBQWtCLE1BQU0sa0NBQWtDLENBQUM7QUFDM0YsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDakMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBMkkvRSxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFtQixTQUFRLGtCQUFrQjtJQUExRDs7UUFFVyxnQkFBVyxHQUFXLFFBQVEsQ0FBQztRQUMvQixtQkFBYyxHQUFXLE9BQU8sQ0FBQztRQUlqQyxjQUFTLEdBQVEsTUFBTSxDQUFDO1FBUXhCLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBQzlCLFVBQUssR0FBUSxXQUFXLENBQUM7UUFDekIsa0JBQWEsR0FBVSxFQUFFLENBQUM7UUFFMUIsbUJBQWMsR0FBWSxJQUFJLENBQUM7UUFDL0IsbUJBQWMsR0FBWSxJQUFJLENBQUM7UUFDL0IscUJBQWdCLEdBQVks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LENBdVY5QjtTQXZWWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEhvc3RMaXN0ZW5lcixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbnRlbnRDaGlsZCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBzY2FsZUxpbmVhciwgc2NhbGVQb2ludCwgc2NhbGVUaW1lIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgY3VydmVMaW5lYXIgfSBmcm9tICdkMy1zaGFwZSc7XG5cbmltcG9ydCB7IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zLCBWaWV3RGltZW5zaW9ucyB9IGZyb20gJy4uL2NvbW1vbi92aWV3LWRpbWVuc2lvbnMuaGVscGVyJztcbmltcG9ydCB7IENvbG9ySGVscGVyIH0gZnJvbSAnLi4vY29tbW9uL2NvbG9yLmhlbHBlcic7XG5pbXBvcnQgeyBCYXNlQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XG5pbXBvcnQgeyBnZXRVbmlxdWVYRG9tYWluVmFsdWVzLCBnZXRTY2FsZVR5cGUgfSBmcm9tICcuLi9jb21tb24vZG9tYWluLmhlbHBlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1jaGFydHMtYXJlYS1jaGFydCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5neC1jaGFydHMtY2hhcnRcbiAgICAgIFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiXG4gICAgICBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIlxuICAgICAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXG4gICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcbiAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxuICAgICAgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcbiAgICAgIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgICAobGVnZW5kTGFiZWxEZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICA+XG4gICAgICA8c3ZnOmRlZnM+XG4gICAgICAgIDxzdmc6Y2xpcFBhdGggW2F0dHIuaWRdPVwiY2xpcFBhdGhJZFwiPlxuICAgICAgICAgIDxzdmc6cmVjdFxuICAgICAgICAgICAgW2F0dHIud2lkdGhdPVwiZGltcy53aWR0aCArIDEwXCJcbiAgICAgICAgICAgIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodCArIDEwXCJcbiAgICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCIndHJhbnNsYXRlKC01LCAtNSknXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L3N2ZzpjbGlwUGF0aD5cbiAgICAgIDwvc3ZnOmRlZnM+XG4gICAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiIGNsYXNzPVwiYXJlYS1jaGFydCBjaGFydFwiPlxuICAgICAgICA8c3ZnOmdcbiAgICAgICAgICBuZ3gtY2hhcnRzLXgtYXhpc1xuICAgICAgICAgICpuZ0lmPVwieEF4aXNcIlxuICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcbiAgICAgICAgICBbZGltc109XCJkaW1zXCJcbiAgICAgICAgICBbc2hvd0dyaWRMaW5lc109XCJzaG93R3JpZExpbmVzXCJcbiAgICAgICAgICBbc2hvd0xhYmVsXT1cInNob3dYQXhpc0xhYmVsXCJcbiAgICAgICAgICBbbGFiZWxUZXh0XT1cInhBeGlzTGFiZWxcIlxuICAgICAgICAgIFt0cmltVGlja3NdPVwidHJpbVhBeGlzVGlja3NcIlxuICAgICAgICAgIFtyb3RhdGVUaWNrc109XCJyb3RhdGVYQXhpc1RpY2tzXCJcbiAgICAgICAgICBbbWF4VGlja0xlbmd0aF09XCJtYXhYQXhpc1RpY2tMZW5ndGhcIlxuICAgICAgICAgIFt0aWNrRm9ybWF0dGluZ109XCJ4QXhpc1RpY2tGb3JtYXR0aW5nXCJcbiAgICAgICAgICBbdGlja3NdPVwieEF4aXNUaWNrc1wiXG4gICAgICAgICAgKGRpbWVuc2lvbnNDaGFuZ2VkKT1cInVwZGF0ZVhBeGlzSGVpZ2h0KCRldmVudClcIlxuICAgICAgICA+PC9zdmc6Zz5cbiAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgbmd4LWNoYXJ0cy15LWF4aXNcbiAgICAgICAgICAqbmdJZj1cInlBeGlzXCJcbiAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXG4gICAgICAgICAgW2RpbXNdPVwiZGltc1wiXG4gICAgICAgICAgW3Nob3dHcmlkTGluZXNdPVwic2hvd0dyaWRMaW5lc1wiXG4gICAgICAgICAgW3Nob3dMYWJlbF09XCJzaG93WUF4aXNMYWJlbFwiXG4gICAgICAgICAgW2xhYmVsVGV4dF09XCJ5QXhpc0xhYmVsXCJcbiAgICAgICAgICBbdHJpbVRpY2tzXT1cInRyaW1ZQXhpc1RpY2tzXCJcbiAgICAgICAgICBbbWF4VGlja0xlbmd0aF09XCJtYXhZQXhpc1RpY2tMZW5ndGhcIlxuICAgICAgICAgIFt0aWNrRm9ybWF0dGluZ109XCJ5QXhpc1RpY2tGb3JtYXR0aW5nXCJcbiAgICAgICAgICBbdGlja3NdPVwieUF4aXNUaWNrc1wiXG4gICAgICAgICAgKGRpbWVuc2lvbnNDaGFuZ2VkKT1cInVwZGF0ZVlBeGlzV2lkdGgoJGV2ZW50KVwiXG4gICAgICAgID48L3N2ZzpnPlxuICAgICAgICA8c3ZnOmcgW2F0dHIuY2xpcC1wYXRoXT1cImNsaXBQYXRoXCI+XG4gICAgICAgICAgPHN2ZzpnICpuZ0Zvcj1cImxldCBzZXJpZXMgb2YgcmVzdWx0czsgdHJhY2tCeTogdHJhY2tCeVwiPlxuICAgICAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgICAgIG5neC1jaGFydHMtYXJlYS1zZXJpZXNcbiAgICAgICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxuICAgICAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXG4gICAgICAgICAgICAgIFtiYXNlVmFsdWVdPVwiYmFzZVZhbHVlXCJcbiAgICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxuICAgICAgICAgICAgICBbZGF0YV09XCJzZXJpZXNcIlxuICAgICAgICAgICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcbiAgICAgICAgICAgICAgW3NjYWxlVHlwZV09XCJzY2FsZVR5cGVcIlxuICAgICAgICAgICAgICBbZ3JhZGllbnRdPVwiZ3JhZGllbnRcIlxuICAgICAgICAgICAgICBbY3VydmVdPVwiY3VydmVcIlxuICAgICAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zdmc6Zz5cblxuICAgICAgICAgIDxzdmc6ZyAqbmdJZj1cIiF0b29sdGlwRGlzYWJsZWRcIiAobW91c2VsZWF2ZSk9XCJoaWRlQ2lyY2xlcygpXCI+XG4gICAgICAgICAgICA8c3ZnOmdcbiAgICAgICAgICAgICAgbmd4LWNoYXJ0cy10b29sdGlwLWFyZWFcbiAgICAgICAgICAgICAgW2RpbXNdPVwiZGltc1wiXG4gICAgICAgICAgICAgIFt4U2V0XT1cInhTZXRcIlxuICAgICAgICAgICAgICBbeFNjYWxlXT1cInhTY2FsZVwiXG4gICAgICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcbiAgICAgICAgICAgICAgW3Jlc3VsdHNdPVwicmVzdWx0c1wiXG4gICAgICAgICAgICAgIFtjb2xvcnNdPVwiY29sb3JzXCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBEaXNhYmxlZF09XCJ0b29sdGlwRGlzYWJsZWRcIlxuICAgICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInNlcmllc1Rvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIChob3Zlcik9XCJ1cGRhdGVIb3ZlcmVkVmVydGljYWwoJGV2ZW50KVwiXG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHNlcmllcyBvZiByZXN1bHRzXCI+XG4gICAgICAgICAgICAgIDxzdmc6Z1xuICAgICAgICAgICAgICAgIG5neC1jaGFydHMtY2lyY2xlLXNlcmllc1xuICAgICAgICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcbiAgICAgICAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXG4gICAgICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxuICAgICAgICAgICAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxuICAgICAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXG4gICAgICAgICAgICAgICAgW3NjYWxlVHlwZV09XCJzY2FsZVR5cGVcIlxuICAgICAgICAgICAgICAgIFt2aXNpYmxlVmFsdWVdPVwiaG92ZXJlZFZlcnRpY2FsXCJcbiAgICAgICAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIChzZWxlY3QpPVwib25DbGljaygkZXZlbnQsIHNlcmllcylcIlxuICAgICAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChkZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvc3ZnOmc+XG4gICAgICAgICAgPC9zdmc6Zz5cbiAgICAgICAgPC9zdmc6Zz5cbiAgICAgIDwvc3ZnOmc+XG4gICAgICA8c3ZnOmdcbiAgICAgICAgbmd4LWNoYXJ0cy10aW1lbGluZVxuICAgICAgICAqbmdJZj1cInRpbWVsaW5lICYmIHNjYWxlVHlwZSAhPSAnb3JkaW5hbCdcIlxuICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidGltZWxpbmVUcmFuc2Zvcm1cIlxuICAgICAgICBbcmVzdWx0c109XCJyZXN1bHRzXCJcbiAgICAgICAgW3ZpZXddPVwiW3RpbWVsaW5lV2lkdGgsIGhlaWdodF1cIlxuICAgICAgICBbaGVpZ2h0XT1cInRpbWVsaW5lSGVpZ2h0XCJcbiAgICAgICAgW3NjaGVtZV09XCJzY2hlbWVcIlxuICAgICAgICBbY3VzdG9tQ29sb3JzXT1cImN1c3RvbUNvbG9yc1wiXG4gICAgICAgIFtsZWdlbmRdPVwibGVnZW5kXCJcbiAgICAgICAgW3NjYWxlVHlwZV09XCJzY2FsZVR5cGVcIlxuICAgICAgICAob25Eb21haW5DaGFuZ2UpPVwidXBkYXRlRG9tYWluKCRldmVudClcIlxuICAgICAgPlxuICAgICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHNlcmllcyBvZiByZXN1bHRzOyB0cmFja0J5OiB0cmFja0J5XCI+XG4gICAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgICBuZ3gtY2hhcnRzLWFyZWEtc2VyaWVzXG4gICAgICAgICAgICBbeFNjYWxlXT1cInRpbWVsaW5lWFNjYWxlXCJcbiAgICAgICAgICAgIFt5U2NhbGVdPVwidGltZWxpbmVZU2NhbGVcIlxuICAgICAgICAgICAgW2Jhc2VWYWx1ZV09XCJiYXNlVmFsdWVcIlxuICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxuICAgICAgICAgICAgW2RhdGFdPVwic2VyaWVzXCJcbiAgICAgICAgICAgIFtzY2FsZVR5cGVdPVwic2NhbGVUeXBlXCJcbiAgICAgICAgICAgIFtncmFkaWVudF09XCJncmFkaWVudFwiXG4gICAgICAgICAgICBbY3VydmVdPVwiY3VydmVcIlxuICAgICAgICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zdmc6Zz5cbiAgICAgIDwvc3ZnOmc+XG4gICAgPC9uZ3gtY2hhcnRzLWNoYXJ0PlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3R5bGVVcmxzOiBbJy4uL2NvbW1vbi9iYXNlLWNoYXJ0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgQXJlYUNoYXJ0Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IHtcbiAgQElucHV0KCkgbGVnZW5kO1xuICBASW5wdXQoKSBsZWdlbmRUaXRsZTogc3RyaW5nID0gJ0xlZ2VuZCc7XG4gIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBzdHJpbmcgPSAncmlnaHQnO1xuICBASW5wdXQoKSBzdGF0ZTtcbiAgQElucHV0KCkgeEF4aXM7XG4gIEBJbnB1dCgpIHlBeGlzO1xuICBASW5wdXQoKSBiYXNlVmFsdWU6IGFueSA9ICdhdXRvJztcbiAgQElucHV0KCkgYXV0b1NjYWxlO1xuICBASW5wdXQoKSBzaG93WEF4aXNMYWJlbDtcbiAgQElucHV0KCkgc2hvd1lBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHhBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHlBeGlzTGFiZWw7XG4gIEBJbnB1dCgpIHRpbWVsaW5lO1xuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbjtcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGN1cnZlOiBhbnkgPSBjdXJ2ZUxpbmVhcjtcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcbiAgQElucHV0KCkgc2NoZW1lVHlwZTogc3RyaW5nO1xuICBASW5wdXQoKSB0cmltWEF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHRyaW1ZQXhpc1RpY2tzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgcm90YXRlWEF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIG1heFhBeGlzVGlja0xlbmd0aDogbnVtYmVyID0gMTY7XG4gIEBJbnB1dCgpIG1heFlBeGlzVGlja0xlbmd0aDogbnVtYmVyID0gMTY7XG4gIEBJbnB1dCgpIHhBeGlzVGlja0Zvcm1hdHRpbmc6IGFueTtcbiAgQElucHV0KCkgeUF4aXNUaWNrRm9ybWF0dGluZzogYW55O1xuICBASW5wdXQoKSB4QXhpc1RpY2tzOiBhbnlbXTtcbiAgQElucHV0KCkgeUF4aXNUaWNrczogYW55W107XG4gIEBJbnB1dCgpIHJvdW5kRG9tYWluczogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSB0b29sdGlwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgeFNjYWxlTWluOiBhbnk7XG4gIEBJbnB1dCgpIHhTY2FsZU1heDogYW55O1xuICBASW5wdXQoKSB5U2NhbGVNaW46IG51bWJlcjtcbiAgQElucHV0KCkgeVNjYWxlTWF4OiBudW1iZXI7XG5cbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBDb250ZW50Q2hpbGQoJ3Rvb2x0aXBUZW1wbGF0ZScpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZCgnc2VyaWVzVG9vbHRpcFRlbXBsYXRlJykgc2VyaWVzVG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xuICB4U2V0OiBhbnk7XG4gIHhEb21haW46IGFueTtcbiAgeURvbWFpbjogYW55O1xuICBzZXJpZXNEb21haW46IGFueTtcbiAgeFNjYWxlOiBhbnk7XG4gIHlTY2FsZTogYW55O1xuICB0cmFuc2Zvcm06IHN0cmluZztcbiAgY29sb3JzOiBDb2xvckhlbHBlcjtcbiAgY2xpcFBhdGhJZDogc3RyaW5nO1xuICBjbGlwUGF0aDogc3RyaW5nO1xuICBzY2FsZVR5cGU6IHN0cmluZztcbiAgc2VyaWVzOiBhbnk7XG4gIG1hcmdpbiA9IFsxMCwgMjAsIDEwLCAyMF07XG4gIGhvdmVyZWRWZXJ0aWNhbDogYW55OyAvLyB0aGUgdmFsdWUgb2YgdGhlIHggYXhpcyB0aGF0IGlzIGhvdmVyZWQgb3ZlclxuICB4QXhpc0hlaWdodDogbnVtYmVyID0gMDtcbiAgeUF4aXNXaWR0aDogbnVtYmVyID0gMDtcbiAgZmlsdGVyZWREb21haW46IGFueTtcbiAgbGVnZW5kT3B0aW9uczogYW55O1xuXG4gIHRpbWVsaW5lV2lkdGg6IGFueTtcbiAgdGltZWxpbmVIZWlnaHQ6IG51bWJlciA9IDUwO1xuICB0aW1lbGluZVhTY2FsZTogYW55O1xuICB0aW1lbGluZVlTY2FsZTogYW55O1xuICB0aW1lbGluZVhEb21haW46IGFueTtcbiAgdGltZWxpbmVUcmFuc2Zvcm06IGFueTtcbiAgdGltZWxpbmVQYWRkaW5nOiBudW1iZXIgPSAxMDtcblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgc3VwZXIudXBkYXRlKCk7XG5cbiAgICB0aGlzLmRpbXMgPSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyh7XG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBtYXJnaW5zOiB0aGlzLm1hcmdpbixcbiAgICAgIHNob3dYQXhpczogdGhpcy54QXhpcyxcbiAgICAgIHNob3dZQXhpczogdGhpcy55QXhpcyxcbiAgICAgIHhBeGlzSGVpZ2h0OiB0aGlzLnhBeGlzSGVpZ2h0LFxuICAgICAgeUF4aXNXaWR0aDogdGhpcy55QXhpc1dpZHRoLFxuICAgICAgc2hvd1hMYWJlbDogdGhpcy5zaG93WEF4aXNMYWJlbCxcbiAgICAgIHNob3dZTGFiZWw6IHRoaXMuc2hvd1lBeGlzTGFiZWwsXG4gICAgICBzaG93TGVnZW5kOiB0aGlzLmxlZ2VuZCxcbiAgICAgIGxlZ2VuZFR5cGU6IHRoaXMuc2NoZW1lVHlwZSxcbiAgICAgIGxlZ2VuZFBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy50aW1lbGluZSkge1xuICAgICAgdGhpcy5kaW1zLmhlaWdodCAtPSB0aGlzLnRpbWVsaW5lSGVpZ2h0ICsgdGhpcy5tYXJnaW5bMl0gKyB0aGlzLnRpbWVsaW5lUGFkZGluZztcbiAgICB9XG5cbiAgICB0aGlzLnhEb21haW4gPSB0aGlzLmdldFhEb21haW4oKTtcbiAgICBpZiAodGhpcy5maWx0ZXJlZERvbWFpbikge1xuICAgICAgdGhpcy54RG9tYWluID0gdGhpcy5maWx0ZXJlZERvbWFpbjtcbiAgICB9XG5cbiAgICB0aGlzLnlEb21haW4gPSB0aGlzLmdldFlEb21haW4oKTtcbiAgICB0aGlzLnNlcmllc0RvbWFpbiA9IHRoaXMuZ2V0U2VyaWVzRG9tYWluKCk7XG5cbiAgICB0aGlzLnhTY2FsZSA9IHRoaXMuZ2V0WFNjYWxlKHRoaXMueERvbWFpbiwgdGhpcy5kaW1zLndpZHRoKTtcbiAgICB0aGlzLnlTY2FsZSA9IHRoaXMuZ2V0WVNjYWxlKHRoaXMueURvbWFpbiwgdGhpcy5kaW1zLmhlaWdodCk7XG5cbiAgICB0aGlzLnVwZGF0ZVRpbWVsaW5lKCk7XG5cbiAgICB0aGlzLnNldENvbG9ycygpO1xuICAgIHRoaXMubGVnZW5kT3B0aW9ucyA9IHRoaXMuZ2V0TGVnZW5kT3B0aW9ucygpO1xuXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy5kaW1zLnhPZmZzZXR9LCAke3RoaXMubWFyZ2luWzBdfSlgO1xuXG4gICAgdGhpcy5jbGlwUGF0aElkID0gJ2NsaXAnICsgaWQoKS50b1N0cmluZygpO1xuICAgIHRoaXMuY2xpcFBhdGggPSBgdXJsKCMke3RoaXMuY2xpcFBhdGhJZH0pYDtcbiAgfVxuXG4gIHVwZGF0ZVRpbWVsaW5lKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRpbWVsaW5lKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lV2lkdGggPSB0aGlzLmRpbXMud2lkdGg7XG4gICAgICB0aGlzLnRpbWVsaW5lWERvbWFpbiA9IHRoaXMuZ2V0WERvbWFpbigpO1xuICAgICAgdGhpcy50aW1lbGluZVhTY2FsZSA9IHRoaXMuZ2V0WFNjYWxlKHRoaXMudGltZWxpbmVYRG9tYWluLCB0aGlzLnRpbWVsaW5lV2lkdGgpO1xuICAgICAgdGhpcy50aW1lbGluZVlTY2FsZSA9IHRoaXMuZ2V0WVNjYWxlKHRoaXMueURvbWFpbiwgdGhpcy50aW1lbGluZUhlaWdodCk7XG4gICAgICB0aGlzLnRpbWVsaW5lVHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMuZGltcy54T2Zmc2V0fSwgJHstdGhpcy5tYXJnaW5bMl19KWA7XG4gICAgfVxuICB9XG5cbiAgZ2V0WERvbWFpbigpOiBhbnlbXSB7XG4gICAgbGV0IHZhbHVlcyA9IGdldFVuaXF1ZVhEb21haW5WYWx1ZXModGhpcy5yZXN1bHRzKTtcblxuICAgIHRoaXMuc2NhbGVUeXBlID0gZ2V0U2NhbGVUeXBlKHZhbHVlcyk7XG4gICAgbGV0IGRvbWFpbiA9IFtdO1xuXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xuICAgICAgdmFsdWVzID0gdmFsdWVzLm1hcCh2ID0+IE51bWJlcih2KSk7XG4gICAgfVxuXG4gICAgbGV0IG1pbjtcbiAgICBsZXQgbWF4O1xuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnIHx8IHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xuICAgICAgbWluID0gdGhpcy54U2NhbGVNaW4gPyB0aGlzLnhTY2FsZU1pbiA6IE1hdGgubWluKC4uLnZhbHVlcyk7XG5cbiAgICAgIG1heCA9IHRoaXMueFNjYWxlTWF4ID8gdGhpcy54U2NhbGVNYXggOiBNYXRoLm1heCguLi52YWx1ZXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICBkb21haW4gPSBbbmV3IERhdGUobWluKSwgbmV3IERhdGUobWF4KV07XG4gICAgICB0aGlzLnhTZXQgPSBbLi4udmFsdWVzXS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFEYXRlID0gYS5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IGJEYXRlID0gYi5nZXRUaW1lKCk7XG4gICAgICAgIGlmIChhRGF0ZSA+IGJEYXRlKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGJEYXRlID4gYURhdGUpIHJldHVybiAtMTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xuICAgICAgZG9tYWluID0gW21pbiwgbWF4XTtcbiAgICAgIC8vIFVzZSBjb21wYXJlIGZ1bmN0aW9uIHRvIHNvcnQgbnVtYmVycyBudW1lcmljYWxseVxuICAgICAgdGhpcy54U2V0ID0gWy4uLnZhbHVlc10uc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb21haW4gPSB2YWx1ZXM7XG4gICAgICB0aGlzLnhTZXQgPSB2YWx1ZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIGdldFlEb21haW4oKTogYW55W10ge1xuICAgIGNvbnN0IGRvbWFpbiA9IFtdO1xuXG4gICAgZm9yIChjb25zdCByZXN1bHRzIG9mIHRoaXMucmVzdWx0cykge1xuICAgICAgZm9yIChjb25zdCBkIG9mIHJlc3VsdHMuc2VyaWVzKSB7XG4gICAgICAgIGlmICghZG9tYWluLmluY2x1ZGVzKGQudmFsdWUpKSB7XG4gICAgICAgICAgZG9tYWluLnB1c2goZC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZXMgPSBbLi4uZG9tYWluXTtcbiAgICBpZiAoIXRoaXMuYXV0b1NjYWxlKSB7XG4gICAgICB2YWx1ZXMucHVzaCgwKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYmFzZVZhbHVlICE9PSAnYXV0bycpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHRoaXMuYmFzZVZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCBtaW4gPSB0aGlzLnlTY2FsZU1pbiA/IHRoaXMueVNjYWxlTWluIDogTWF0aC5taW4oLi4udmFsdWVzKTtcblxuICAgIGNvbnN0IG1heCA9IHRoaXMueVNjYWxlTWF4ID8gdGhpcy55U2NhbGVNYXggOiBNYXRoLm1heCguLi52YWx1ZXMpO1xuXG4gICAgcmV0dXJuIFttaW4sIG1heF07XG4gIH1cblxuICBnZXRTZXJpZXNEb21haW4oKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC5uYW1lKTtcbiAgfVxuXG4gIGdldFhTY2FsZShkb21haW4sIHdpZHRoKTogYW55IHtcbiAgICBsZXQgc2NhbGU7XG5cbiAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xuICAgICAgc2NhbGUgPSBzY2FsZVRpbWUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xuICAgICAgc2NhbGUgPSBzY2FsZUxpbmVhcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgc2NhbGUgPSBzY2FsZVBvaW50KCkucGFkZGluZygwLjEpO1xuICAgIH1cblxuICAgIHNjYWxlLnJhbmdlKFswLCB3aWR0aF0pLmRvbWFpbihkb21haW4pO1xuXG4gICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XG4gIH1cblxuICBnZXRZU2NhbGUoZG9tYWluLCBoZWlnaHQpOiBhbnkge1xuICAgIGNvbnN0IHNjYWxlID0gc2NhbGVMaW5lYXIoKS5yYW5nZShbaGVpZ2h0LCAwXSkuZG9tYWluKGRvbWFpbik7XG4gICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XG4gIH1cblxuICBnZXRTY2FsZVR5cGUodmFsdWVzKTogc3RyaW5nIHtcbiAgICBsZXQgZGF0ZSA9IHRydWU7XG4gICAgbGV0IG51bSA9IHRydWU7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIGlmICghdGhpcy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIGRhdGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgIG51bSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRlKSB7XG4gICAgICByZXR1cm4gJ3RpbWUnO1xuICAgIH1cblxuICAgIGlmIChudW0pIHtcbiAgICAgIHJldHVybiAnbGluZWFyJztcbiAgICB9XG5cbiAgICByZXR1cm4gJ29yZGluYWwnO1xuICB9XG5cbiAgaXNEYXRlKHZhbHVlKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdXBkYXRlRG9tYWluKGRvbWFpbik6IHZvaWQge1xuICAgIHRoaXMuZmlsdGVyZWREb21haW4gPSBkb21haW47XG4gICAgdGhpcy54RG9tYWluID0gdGhpcy5maWx0ZXJlZERvbWFpbjtcbiAgICB0aGlzLnhTY2FsZSA9IHRoaXMuZ2V0WFNjYWxlKHRoaXMueERvbWFpbiwgdGhpcy5kaW1zLndpZHRoKTtcbiAgfVxuXG4gIHVwZGF0ZUhvdmVyZWRWZXJ0aWNhbChpdGVtKTogdm9pZCB7XG4gICAgdGhpcy5ob3ZlcmVkVmVydGljYWwgPSBpdGVtLnZhbHVlO1xuICAgIHRoaXMuZGVhY3RpdmF0ZUFsbCgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIGhpZGVDaXJjbGVzKCk6IHZvaWQge1xuICAgIHRoaXMuaG92ZXJlZFZlcnRpY2FsID0gbnVsbDtcbiAgICB0aGlzLmRlYWN0aXZhdGVBbGwoKTtcbiAgfVxuXG4gIG9uQ2xpY2soZGF0YSwgc2VyaWVzPyk6IHZvaWQge1xuICAgIGlmIChzZXJpZXMpIHtcbiAgICAgIGRhdGEuc2VyaWVzID0gc2VyaWVzLm5hbWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3QuZW1pdChkYXRhKTtcbiAgfVxuXG4gIHRyYWNrQnkoaW5kZXgsIGl0ZW0pOiBzdHJpbmcge1xuICAgIHJldHVybiBpdGVtLm5hbWU7XG4gIH1cblxuICBzZXRDb2xvcnMoKTogdm9pZCB7XG4gICAgbGV0IGRvbWFpbjtcbiAgICBpZiAodGhpcy5zY2hlbWVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgIGRvbWFpbiA9IHRoaXMuc2VyaWVzRG9tYWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb21haW4gPSB0aGlzLnlEb21haW47XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsIHRoaXMuc2NoZW1lVHlwZSwgZG9tYWluLCB0aGlzLmN1c3RvbUNvbG9ycyk7XG4gIH1cblxuICBnZXRMZWdlbmRPcHRpb25zKCkge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBzY2FsZVR5cGU6IHRoaXMuc2NoZW1lVHlwZSxcbiAgICAgIGNvbG9yczogdW5kZWZpbmVkLFxuICAgICAgZG9tYWluOiBbXSxcbiAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICBwb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvblxuICAgIH07XG4gICAgaWYgKG9wdHMuc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgIG9wdHMuZG9tYWluID0gdGhpcy5zZXJpZXNEb21haW47XG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzO1xuICAgICAgb3B0cy50aXRsZSA9IHRoaXMubGVnZW5kVGl0bGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMuZG9tYWluID0gdGhpcy55RG9tYWluO1xuICAgICAgb3B0cy5jb2xvcnMgPSB0aGlzLmNvbG9ycy5zY2FsZTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxuICB1cGRhdGVZQXhpc1dpZHRoKHsgd2lkdGggfSk6IHZvaWQge1xuICAgIHRoaXMueUF4aXNXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGVYQXhpc0hlaWdodCh7IGhlaWdodCB9KTogdm9pZCB7XG4gICAgdGhpcy54QXhpc0hlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25BY3RpdmF0ZShpdGVtKSB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlO1xuICAgIH0pO1xuICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtpdGVtLCAuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XG4gIH1cblxuICBvbkRlYWN0aXZhdGUoaXRlbSkge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcblxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIGRlYWN0aXZhdGVBbGwoKSB7XG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmFjdGl2ZUVudHJpZXMpIHtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGVudHJ5LCBlbnRyaWVzOiBbXSB9KTtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW107XG4gIH1cbn1cbiJdfQ==