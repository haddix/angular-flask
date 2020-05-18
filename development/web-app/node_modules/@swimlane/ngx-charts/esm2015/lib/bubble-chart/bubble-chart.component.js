import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, HostListener, ViewEncapsulation, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleLinear } from 'd3-scale';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { getScaleType } from '../common/domain.helper';
import { getDomain, getScale } from './bubble-chart.utils';
import { id } from '../utils/id';
let BubbleChartComponent = class BubbleChartComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.showGridLines = true;
        this.legend = false;
        this.legendTitle = 'Legend';
        this.legendPosition = 'right';
        this.xAxis = true;
        this.yAxis = true;
        this.trimXAxisTicks = true;
        this.trimYAxisTicks = true;
        this.rotateXAxisTicks = true;
        this.maxXAxisTickLength = 16;
        this.maxYAxisTickLength = 16;
        this.roundDomains = false;
        this.maxRadius = 10;
        this.minRadius = 3;
        this.schemeType = 'ordinal';
        this.tooltipDisabled = false;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.scaleType = 'linear';
        this.margin = [10, 20, 10, 20];
        this.bubblePadding = [0, 0, 0, 0];
        this.xAxisHeight = 0;
        this.yAxisWidth = 0;
        this.activeEntries = [];
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
        this.seriesDomain = this.results.map(d => d.name);
        this.rDomain = this.getRDomain();
        this.xDomain = this.getXDomain();
        this.yDomain = this.getYDomain();
        this.transform = `translate(${this.dims.xOffset},${this.margin[0]})`;
        const colorDomain = this.schemeType === 'ordinal' ? this.seriesDomain : this.rDomain;
        this.colors = new ColorHelper(this.scheme, this.schemeType, colorDomain, this.customColors);
        this.data = this.results;
        this.minRadius = Math.max(this.minRadius, 1);
        this.maxRadius = Math.max(this.maxRadius, 1);
        this.rScale = this.getRScale(this.rDomain, [this.minRadius, this.maxRadius]);
        this.bubblePadding = [0, 0, 0, 0];
        this.setScales();
        this.bubblePadding = this.getBubblePadding();
        this.setScales();
        this.legendOptions = this.getLegendOptions();
        this.clipPathId = 'clip' + id().toString();
        this.clipPath = `url(#${this.clipPathId})`;
    }
    hideCircles() {
        this.deactivateAll();
    }
    onClick(data, series) {
        if (series) {
            data.series = series.name;
        }
        this.select.emit(data);
    }
    getBubblePadding() {
        let yMin = 0;
        let xMin = 0;
        let yMax = this.dims.height;
        let xMax = this.dims.width;
        for (const s of this.data) {
            for (const d of s.series) {
                const r = this.rScale(d.r);
                const cx = this.xScaleType === 'linear' ? this.xScale(Number(d.x)) : this.xScale(d.x);
                const cy = this.yScaleType === 'linear' ? this.yScale(Number(d.y)) : this.yScale(d.y);
                xMin = Math.max(r - cx, xMin);
                yMin = Math.max(r - cy, yMin);
                yMax = Math.max(cy + r, yMax);
                xMax = Math.max(cx + r, xMax);
            }
        }
        xMax = Math.max(xMax - this.dims.width, 0);
        yMax = Math.max(yMax - this.dims.height, 0);
        return [yMin, xMax, yMax, xMin];
    }
    setScales() {
        let width = this.dims.width;
        if (this.xScaleMin === undefined && this.xScaleMax === undefined) {
            width = width - this.bubblePadding[1];
        }
        let height = this.dims.height;
        if (this.yScaleMin === undefined && this.yScaleMax === undefined) {
            height = height - this.bubblePadding[2];
        }
        this.xScale = this.getXScale(this.xDomain, width);
        this.yScale = this.getYScale(this.yDomain, height);
    }
    getYScale(domain, height) {
        return getScale(domain, [height, this.bubblePadding[0]], this.yScaleType, this.roundDomains);
    }
    getXScale(domain, width) {
        return getScale(domain, [this.bubblePadding[3], width], this.xScaleType, this.roundDomains);
    }
    getRScale(domain, range) {
        const scale = scaleLinear().range(range).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    }
    getLegendOptions() {
        const opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            position: this.legendPosition,
            title: undefined
        };
        if (opts.scaleType === 'ordinal') {
            opts.domain = this.seriesDomain;
            opts.colors = this.colors;
            opts.title = this.legendTitle;
        }
        else {
            opts.domain = this.rDomain;
            opts.colors = this.colors.scale;
        }
        return opts;
    }
    getXDomain() {
        const values = [];
        for (const results of this.results) {
            for (const d of results.series) {
                if (!values.includes(d.x)) {
                    values.push(d.x);
                }
            }
        }
        this.xScaleType = getScaleType(values);
        return getDomain(values, this.xScaleType, this.autoScale, this.xScaleMin, this.xScaleMax);
    }
    getYDomain() {
        const values = [];
        for (const results of this.results) {
            for (const d of results.series) {
                if (!values.includes(d.y)) {
                    values.push(d.y);
                }
            }
        }
        this.yScaleType = getScaleType(values);
        return getDomain(values, this.yScaleType, this.autoScale, this.yScaleMin, this.yScaleMax);
    }
    getRDomain() {
        let min = Infinity;
        let max = -Infinity;
        for (const results of this.results) {
            for (const d of results.series) {
                const value = Number(d.r) || 1;
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
        return [min, max];
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
            return d.name === item.name;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = [item, ...this.activeEntries];
        this.activate.emit({ value: item, entries: this.activeEntries });
    }
    onDeactivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name;
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
    trackBy(index, item) {
        return item.name;
    }
};
__decorate([
    Input()
], BubbleChartComponent.prototype, "showGridLines", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "legend", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "legendTitle", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "legendPosition", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "xAxis", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "yAxis", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "showXAxisLabel", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "showYAxisLabel", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "xAxisLabel", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "yAxisLabel", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "trimXAxisTicks", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "trimYAxisTicks", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "rotateXAxisTicks", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "maxXAxisTickLength", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "maxYAxisTickLength", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "xAxisTickFormatting", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "yAxisTickFormatting", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "xAxisTicks", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "yAxisTicks", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "roundDomains", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "maxRadius", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "minRadius", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "autoScale", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "schemeType", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "tooltipDisabled", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "xScaleMin", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "xScaleMax", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "yScaleMin", void 0);
__decorate([
    Input()
], BubbleChartComponent.prototype, "yScaleMax", void 0);
__decorate([
    Output()
], BubbleChartComponent.prototype, "activate", void 0);
__decorate([
    Output()
], BubbleChartComponent.prototype, "deactivate", void 0);
__decorate([
    ContentChild('tooltipTemplate')
], BubbleChartComponent.prototype, "tooltipTemplate", void 0);
__decorate([
    HostListener('mouseleave')
], BubbleChartComponent.prototype, "hideCircles", null);
BubbleChartComponent = __decorate([
    Component({
        selector: 'ngx-charts-bubble-chart',
        template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [activeEntries]="activeEntries"
      [legendOptions]="legendOptions"
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
      <svg:g [attr.transform]="transform" class="bubble-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [showGridLines]="showGridLines"
          [dims]="dims"
          [xScale]="xScale"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        />
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [showGridLines]="showGridLines"
          [yScale]="yScale"
          [dims]="dims"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        />
        <svg:rect
          class="bubble-chart-area"
          x="0"
          y="0"
          [attr.width]="dims.width"
          [attr.height]="dims.height"
          style="fill: rgb(255, 0, 0); opacity: 0; cursor: 'auto';"
          (mouseenter)="deactivateAll()"
        />
        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of data; trackBy: trackBy" [@animationState]="'active'">
            <svg:g
              ngx-charts-bubble-series
              [xScale]="xScale"
              [yScale]="yScale"
              [rScale]="rScale"
              [xScaleType]="xScaleType"
              [yScaleType]="yScaleType"
              [xAxisLabel]="xAxisLabel"
              [yAxisLabel]="yAxisLabel"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntries"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="tooltipTemplate"
              (select)="onClick($event, series)"
              (activate)="onActivate($event)"
              (deactivate)="onDeactivate($event)"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        animations: [
            trigger('animationState', [
                transition(':leave', [
                    style({
                        opacity: 1
                    }),
                    animate(500, style({
                        opacity: 0
                    }))
                ])
            ])
        ],
        styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}"]
    })
], BubbleChartComponent);
export { BubbleChartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnViYmxlLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL2J1YmJsZS1jaGFydC9idWJibGUtY2hhcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFlBQVksRUFDWixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUV2QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsdUJBQXVCLEVBQWtCLE1BQU0sa0NBQWtDLENBQUM7QUFDM0YsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzNELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUEyR2pDLElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQXFCLFNBQVEsa0JBQWtCO0lBQTVEOztRQUNXLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBQzlCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixnQkFBVyxHQUFXLFFBQVEsQ0FBQztRQUMvQixtQkFBYyxHQUFXLE9BQU8sQ0FBQztRQUNqQyxVQUFLLEdBQVksSUFBSSxDQUFDO1FBQ3RCLFVBQUssR0FBWSxJQUFJLENBQUM7UUFLdEIsbUJBQWMsR0FB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QUFJLENBQUMsS0FBSyxDQUFDO1FBRTNCLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUN6QixLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3hCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQy9CO1NBQ0Y7UUFFRCxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFL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QztRQUNULFFBQVEsRUFBRSx5QkFBeUI7UUFDbkMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1GVDtRQUVELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1FBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1FBQ3JDLFVBQVUsRUFBRTtZQUNWLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDeEIsVUFBVSxDQUFDLFFBQVEsRUFBRTtvQkFDbkIsS0FBSyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxDQUFDO3FCQUNYLENBQUM7b0JBQ0YsT0FBTyxDQUNMLEdBQUcsRUFDSCxLQUFLLENBQUM7d0JBQ0osT0FBTyxFQUFFLENBQUM7cUJBQ1gsQ0FBQyxDQUNIO2lCQUNGLENBQUM7YUFDSCxDQUFDO1NBQ0g7O0tBQ0YsQ0FBQztHQUNXLG9CQUFvQixDQStSaEM7U0EvUlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb250ZW50Q2hpbGQsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdHJpZ2dlciwgc3R5bGUsIGFuaW1hdGUsIHRyYW5zaXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IHNjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuXG5pbXBvcnQgeyBCYXNlQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQnO1xuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcbmltcG9ydCB7IGdldFNjYWxlVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9kb21haW4uaGVscGVyJztcbmltcG9ydCB7IGdldERvbWFpbiwgZ2V0U2NhbGUgfSBmcm9tICcuL2J1YmJsZS1jaGFydC51dGlscyc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1idWJibGUtY2hhcnQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZ3gtY2hhcnRzLWNoYXJ0XG4gICAgICBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIlxuICAgICAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcbiAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxuICAgICAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcbiAgICAgIChsZWdlbmRMYWJlbENsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gICAgICAobGVnZW5kTGFiZWxBY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxuICAgICAgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPHN2ZzpkZWZzPlxuICAgICAgICA8c3ZnOmNsaXBQYXRoIFthdHRyLmlkXT1cImNsaXBQYXRoSWRcIj5cbiAgICAgICAgICA8c3ZnOnJlY3RcbiAgICAgICAgICAgIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKyAxMFwiXG4gICAgICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKyAxMFwiXG4gICAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZSgtNSwgLTUpJ1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zdmc6Y2xpcFBhdGg+XG4gICAgICA8L3N2ZzpkZWZzPlxuICAgICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiBjbGFzcz1cImJ1YmJsZS1jaGFydCBjaGFydFwiPlxuICAgICAgICA8c3ZnOmdcbiAgICAgICAgICBuZ3gtY2hhcnRzLXgtYXhpc1xuICAgICAgICAgICpuZ0lmPVwieEF4aXNcIlxuICAgICAgICAgIFtzaG93R3JpZExpbmVzXT1cInNob3dHcmlkTGluZXNcIlxuICAgICAgICAgIFtkaW1zXT1cImRpbXNcIlxuICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcbiAgICAgICAgICBbc2hvd0xhYmVsXT1cInNob3dYQXhpc0xhYmVsXCJcbiAgICAgICAgICBbbGFiZWxUZXh0XT1cInhBeGlzTGFiZWxcIlxuICAgICAgICAgIFt0cmltVGlja3NdPVwidHJpbVhBeGlzVGlja3NcIlxuICAgICAgICAgIFtyb3RhdGVUaWNrc109XCJyb3RhdGVYQXhpc1RpY2tzXCJcbiAgICAgICAgICBbbWF4VGlja0xlbmd0aF09XCJtYXhYQXhpc1RpY2tMZW5ndGhcIlxuICAgICAgICAgIFt0aWNrRm9ybWF0dGluZ109XCJ4QXhpc1RpY2tGb3JtYXR0aW5nXCJcbiAgICAgICAgICBbdGlja3NdPVwieEF4aXNUaWNrc1wiXG4gICAgICAgICAgKGRpbWVuc2lvbnNDaGFuZ2VkKT1cInVwZGF0ZVhBeGlzSGVpZ2h0KCRldmVudClcIlxuICAgICAgICAvPlxuICAgICAgICA8c3ZnOmdcbiAgICAgICAgICBuZ3gtY2hhcnRzLXktYXhpc1xuICAgICAgICAgICpuZ0lmPVwieUF4aXNcIlxuICAgICAgICAgIFtzaG93R3JpZExpbmVzXT1cInNob3dHcmlkTGluZXNcIlxuICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcbiAgICAgICAgICBbZGltc109XCJkaW1zXCJcbiAgICAgICAgICBbc2hvd0xhYmVsXT1cInNob3dZQXhpc0xhYmVsXCJcbiAgICAgICAgICBbbGFiZWxUZXh0XT1cInlBeGlzTGFiZWxcIlxuICAgICAgICAgIFt0cmltVGlja3NdPVwidHJpbVlBeGlzVGlja3NcIlxuICAgICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFlBeGlzVGlja0xlbmd0aFwiXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInlBeGlzVGlja0Zvcm1hdHRpbmdcIlxuICAgICAgICAgIFt0aWNrc109XCJ5QXhpc1RpY2tzXCJcbiAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwidXBkYXRlWUF4aXNXaWR0aCgkZXZlbnQpXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHN2ZzpyZWN0XG4gICAgICAgICAgY2xhc3M9XCJidWJibGUtY2hhcnQtYXJlYVwiXG4gICAgICAgICAgeD1cIjBcIlxuICAgICAgICAgIHk9XCIwXCJcbiAgICAgICAgICBbYXR0ci53aWR0aF09XCJkaW1zLndpZHRoXCJcbiAgICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHRcIlxuICAgICAgICAgIHN0eWxlPVwiZmlsbDogcmdiKDI1NSwgMCwgMCk7IG9wYWNpdHk6IDA7IGN1cnNvcjogJ2F1dG8nO1wiXG4gICAgICAgICAgKG1vdXNlZW50ZXIpPVwiZGVhY3RpdmF0ZUFsbCgpXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHN2ZzpnIFthdHRyLmNsaXAtcGF0aF09XCJjbGlwUGF0aFwiPlxuICAgICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgc2VyaWVzIG9mIGRhdGE7IHRyYWNrQnk6IHRyYWNrQnlcIiBbQGFuaW1hdGlvblN0YXRlXT1cIidhY3RpdmUnXCI+XG4gICAgICAgICAgICA8c3ZnOmdcbiAgICAgICAgICAgICAgbmd4LWNoYXJ0cy1idWJibGUtc2VyaWVzXG4gICAgICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcbiAgICAgICAgICAgICAgW3lTY2FsZV09XCJ5U2NhbGVcIlxuICAgICAgICAgICAgICBbclNjYWxlXT1cInJTY2FsZVwiXG4gICAgICAgICAgICAgIFt4U2NhbGVUeXBlXT1cInhTY2FsZVR5cGVcIlxuICAgICAgICAgICAgICBbeVNjYWxlVHlwZV09XCJ5U2NhbGVUeXBlXCJcbiAgICAgICAgICAgICAgW3hBeGlzTGFiZWxdPVwieEF4aXNMYWJlbFwiXG4gICAgICAgICAgICAgIFt5QXhpc0xhYmVsXT1cInlBeGlzTGFiZWxcIlxuICAgICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXG4gICAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXG4gICAgICAgICAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxuICAgICAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXG4gICAgICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgKHNlbGVjdCk9XCJvbkNsaWNrKCRldmVudCwgc2VyaWVzKVwiXG4gICAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxuICAgICAgICAgICAgICAoZGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3ZnOmc+XG4gICAgICAgIDwvc3ZnOmc+XG4gICAgICA8L3N2ZzpnPlxuICAgIDwvbmd4LWNoYXJ0cy1jaGFydD5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4uL2NvbW1vbi9iYXNlLWNoYXJ0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignYW5pbWF0aW9uU3RhdGUnLCBbXG4gICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbXG4gICAgICAgIHN0eWxlKHtcbiAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgIH0pLFxuICAgICAgICBhbmltYXRlKFxuICAgICAgICAgIDUwMCxcbiAgICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgXSlcbiAgICBdKVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEJ1YmJsZUNoYXJ0Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IHtcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGxlZ2VuZCA9IGZhbHNlO1xuICBASW5wdXQoKSBsZWdlbmRUaXRsZTogc3RyaW5nID0gJ0xlZ2VuZCc7XG4gIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBzdHJpbmcgPSAncmlnaHQnO1xuICBASW5wdXQoKSB4QXhpczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHlBeGlzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgc2hvd1hBeGlzTGFiZWw6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNob3dZQXhpc0xhYmVsOiBib29sZWFuO1xuICBASW5wdXQoKSB4QXhpc0xhYmVsOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHlBeGlzTGFiZWw6IHN0cmluZztcbiAgQElucHV0KCkgdHJpbVhBeGlzVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSB0cmltWUF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHJvdGF0ZVhBeGlzVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBtYXhYQXhpc1RpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xuICBASW5wdXQoKSBtYXhZQXhpc1RpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xuICBASW5wdXQoKSB4QXhpc1RpY2tGb3JtYXR0aW5nOiBhbnk7XG4gIEBJbnB1dCgpIHlBeGlzVGlja0Zvcm1hdHRpbmc6IGFueTtcbiAgQElucHV0KCkgeEF4aXNUaWNrczogYW55W107XG4gIEBJbnB1dCgpIHlBeGlzVGlja3M6IGFueVtdO1xuICBASW5wdXQoKSByb3VuZERvbWFpbnM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgbWF4UmFkaXVzID0gMTA7XG4gIEBJbnB1dCgpIG1pblJhZGl1cyA9IDM7XG4gIEBJbnB1dCgpIGF1dG9TY2FsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgc2NoZW1lVHlwZSA9ICdvcmRpbmFsJztcbiAgQElucHV0KCkgdG9vbHRpcERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHhTY2FsZU1pbjogYW55O1xuICBASW5wdXQoKSB4U2NhbGVNYXg6IGFueTtcbiAgQElucHV0KCkgeVNjYWxlTWluOiBhbnk7XG4gIEBJbnB1dCgpIHlTY2FsZU1heDogYW55O1xuXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAQ29udGVudENoaWxkKCd0b29sdGlwVGVtcGxhdGUnKSB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZGltczogVmlld0RpbWVuc2lvbnM7XG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XG4gIHNjYWxlVHlwZSA9ICdsaW5lYXInO1xuICBtYXJnaW4gPSBbMTAsIDIwLCAxMCwgMjBdO1xuICBidWJibGVQYWRkaW5nID0gWzAsIDAsIDAsIDBdO1xuICBkYXRhOiBhbnk7XG5cbiAgbGVnZW5kT3B0aW9uczogYW55O1xuICB0cmFuc2Zvcm06IHN0cmluZztcblxuICBjbGlwUGF0aDogc3RyaW5nO1xuICBjbGlwUGF0aElkOiBzdHJpbmc7XG5cbiAgc2VyaWVzRG9tYWluOiBhbnlbXTtcbiAgeERvbWFpbjogYW55W107XG4gIHlEb21haW46IGFueVtdO1xuICByRG9tYWluOiBudW1iZXJbXTtcblxuICB4U2NhbGVUeXBlOiBzdHJpbmc7XG4gIHlTY2FsZVR5cGU6IHN0cmluZztcblxuICB5U2NhbGU6IGFueTtcbiAgeFNjYWxlOiBhbnk7XG4gIHJTY2FsZTogYW55O1xuXG4gIHhBeGlzSGVpZ2h0OiBudW1iZXIgPSAwO1xuICB5QXhpc1dpZHRoOiBudW1iZXIgPSAwO1xuXG4gIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXG4gICAgICBzaG93WEF4aXM6IHRoaXMueEF4aXMsXG4gICAgICBzaG93WUF4aXM6IHRoaXMueUF4aXMsXG4gICAgICB4QXhpc0hlaWdodDogdGhpcy54QXhpc0hlaWdodCxcbiAgICAgIHlBeGlzV2lkdGg6IHRoaXMueUF4aXNXaWR0aCxcbiAgICAgIHNob3dYTGFiZWw6IHRoaXMuc2hvd1hBeGlzTGFiZWwsXG4gICAgICBzaG93WUxhYmVsOiB0aGlzLnNob3dZQXhpc0xhYmVsLFxuICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmQsXG4gICAgICBsZWdlbmRUeXBlOiB0aGlzLnNjaGVtZVR5cGUsXG4gICAgICBsZWdlbmRQb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvblxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXJpZXNEb21haW4gPSB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC5uYW1lKTtcbiAgICB0aGlzLnJEb21haW4gPSB0aGlzLmdldFJEb21haW4oKTtcbiAgICB0aGlzLnhEb21haW4gPSB0aGlzLmdldFhEb21haW4oKTtcbiAgICB0aGlzLnlEb21haW4gPSB0aGlzLmdldFlEb21haW4oKTtcblxuICAgIHRoaXMudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMuZGltcy54T2Zmc2V0fSwke3RoaXMubWFyZ2luWzBdfSlgO1xuXG4gICAgY29uc3QgY29sb3JEb21haW4gPSB0aGlzLnNjaGVtZVR5cGUgPT09ICdvcmRpbmFsJyA/IHRoaXMuc2VyaWVzRG9tYWluIDogdGhpcy5yRG9tYWluO1xuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCB0aGlzLnNjaGVtZVR5cGUsIGNvbG9yRG9tYWluLCB0aGlzLmN1c3RvbUNvbG9ycyk7XG5cbiAgICB0aGlzLmRhdGEgPSB0aGlzLnJlc3VsdHM7XG5cbiAgICB0aGlzLm1pblJhZGl1cyA9IE1hdGgubWF4KHRoaXMubWluUmFkaXVzLCAxKTtcbiAgICB0aGlzLm1heFJhZGl1cyA9IE1hdGgubWF4KHRoaXMubWF4UmFkaXVzLCAxKTtcblxuICAgIHRoaXMuclNjYWxlID0gdGhpcy5nZXRSU2NhbGUodGhpcy5yRG9tYWluLCBbdGhpcy5taW5SYWRpdXMsIHRoaXMubWF4UmFkaXVzXSk7XG5cbiAgICB0aGlzLmJ1YmJsZVBhZGRpbmcgPSBbMCwgMCwgMCwgMF07XG4gICAgdGhpcy5zZXRTY2FsZXMoKTtcblxuICAgIHRoaXMuYnViYmxlUGFkZGluZyA9IHRoaXMuZ2V0QnViYmxlUGFkZGluZygpO1xuICAgIHRoaXMuc2V0U2NhbGVzKCk7XG5cbiAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcblxuICAgIHRoaXMuY2xpcFBhdGhJZCA9ICdjbGlwJyArIGlkKCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmNsaXBQYXRoID0gYHVybCgjJHt0aGlzLmNsaXBQYXRoSWR9KWA7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgaGlkZUNpcmNsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5kZWFjdGl2YXRlQWxsKCk7XG4gIH1cblxuICBvbkNsaWNrKGRhdGEsIHNlcmllcz8pOiB2b2lkIHtcbiAgICBpZiAoc2VyaWVzKSB7XG4gICAgICBkYXRhLnNlcmllcyA9IHNlcmllcy5uYW1lO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF0YSk7XG4gIH1cblxuICBnZXRCdWJibGVQYWRkaW5nKCkge1xuICAgIGxldCB5TWluID0gMDtcbiAgICBsZXQgeE1pbiA9IDA7XG4gICAgbGV0IHlNYXggPSB0aGlzLmRpbXMuaGVpZ2h0O1xuICAgIGxldCB4TWF4ID0gdGhpcy5kaW1zLndpZHRoO1xuXG4gICAgZm9yIChjb25zdCBzIG9mIHRoaXMuZGF0YSkge1xuICAgICAgZm9yIChjb25zdCBkIG9mIHMuc2VyaWVzKSB7XG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLnJTY2FsZShkLnIpO1xuICAgICAgICBjb25zdCBjeCA9IHRoaXMueFNjYWxlVHlwZSA9PT0gJ2xpbmVhcicgPyB0aGlzLnhTY2FsZShOdW1iZXIoZC54KSkgOiB0aGlzLnhTY2FsZShkLngpO1xuICAgICAgICBjb25zdCBjeSA9IHRoaXMueVNjYWxlVHlwZSA9PT0gJ2xpbmVhcicgPyB0aGlzLnlTY2FsZShOdW1iZXIoZC55KSkgOiB0aGlzLnlTY2FsZShkLnkpO1xuICAgICAgICB4TWluID0gTWF0aC5tYXgociAtIGN4LCB4TWluKTtcbiAgICAgICAgeU1pbiA9IE1hdGgubWF4KHIgLSBjeSwgeU1pbik7XG4gICAgICAgIHlNYXggPSBNYXRoLm1heChjeSArIHIsIHlNYXgpO1xuICAgICAgICB4TWF4ID0gTWF0aC5tYXgoY3ggKyByLCB4TWF4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB4TWF4ID0gTWF0aC5tYXgoeE1heCAtIHRoaXMuZGltcy53aWR0aCwgMCk7XG4gICAgeU1heCA9IE1hdGgubWF4KHlNYXggLSB0aGlzLmRpbXMuaGVpZ2h0LCAwKTtcblxuICAgIHJldHVybiBbeU1pbiwgeE1heCwgeU1heCwgeE1pbl07XG4gIH1cblxuICBzZXRTY2FsZXMoKSB7XG4gICAgbGV0IHdpZHRoID0gdGhpcy5kaW1zLndpZHRoO1xuICAgIGlmICh0aGlzLnhTY2FsZU1pbiA9PT0gdW5kZWZpbmVkICYmIHRoaXMueFNjYWxlTWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHdpZHRoID0gd2lkdGggLSB0aGlzLmJ1YmJsZVBhZGRpbmdbMV07XG4gICAgfVxuICAgIGxldCBoZWlnaHQgPSB0aGlzLmRpbXMuaGVpZ2h0O1xuICAgIGlmICh0aGlzLnlTY2FsZU1pbiA9PT0gdW5kZWZpbmVkICYmIHRoaXMueVNjYWxlTWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGhlaWdodCA9IGhlaWdodCAtIHRoaXMuYnViYmxlUGFkZGluZ1syXTtcbiAgICB9XG4gICAgdGhpcy54U2NhbGUgPSB0aGlzLmdldFhTY2FsZSh0aGlzLnhEb21haW4sIHdpZHRoKTtcbiAgICB0aGlzLnlTY2FsZSA9IHRoaXMuZ2V0WVNjYWxlKHRoaXMueURvbWFpbiwgaGVpZ2h0KTtcbiAgfVxuXG4gIGdldFlTY2FsZShkb21haW4sIGhlaWdodCk6IGFueSB7XG4gICAgcmV0dXJuIGdldFNjYWxlKGRvbWFpbiwgW2hlaWdodCwgdGhpcy5idWJibGVQYWRkaW5nWzBdXSwgdGhpcy55U2NhbGVUeXBlLCB0aGlzLnJvdW5kRG9tYWlucyk7XG4gIH1cblxuICBnZXRYU2NhbGUoZG9tYWluLCB3aWR0aCk6IGFueSB7XG4gICAgcmV0dXJuIGdldFNjYWxlKGRvbWFpbiwgW3RoaXMuYnViYmxlUGFkZGluZ1szXSwgd2lkdGhdLCB0aGlzLnhTY2FsZVR5cGUsIHRoaXMucm91bmREb21haW5zKTtcbiAgfVxuXG4gIGdldFJTY2FsZShkb21haW4sIHJhbmdlKTogYW55IHtcbiAgICBjb25zdCBzY2FsZSA9IHNjYWxlTGluZWFyKCkucmFuZ2UocmFuZ2UpLmRvbWFpbihkb21haW4pO1xuXG4gICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XG4gIH1cblxuICBnZXRMZWdlbmRPcHRpb25zKCk6IGFueSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIHNjYWxlVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxuICAgICAgY29sb3JzOiB1bmRlZmluZWQsXG4gICAgICBkb21haW46IFtdLFxuICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb24sXG4gICAgICB0aXRsZTogdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIGlmIChvcHRzLnNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICBvcHRzLmRvbWFpbiA9IHRoaXMuc2VyaWVzRG9tYWluO1xuICAgICAgb3B0cy5jb2xvcnMgPSB0aGlzLmNvbG9ycztcbiAgICAgIG9wdHMudGl0bGUgPSB0aGlzLmxlZ2VuZFRpdGxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLmRvbWFpbiA9IHRoaXMuckRvbWFpbjtcbiAgICAgIG9wdHMuY29sb3JzID0gdGhpcy5jb2xvcnMuc2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cblxuICBnZXRYRG9tYWluKCk6IGFueVtdIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgcmVzdWx0cyBvZiB0aGlzLnJlc3VsdHMpIHtcbiAgICAgIGZvciAoY29uc3QgZCBvZiByZXN1bHRzLnNlcmllcykge1xuICAgICAgICBpZiAoIXZhbHVlcy5pbmNsdWRlcyhkLngpKSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2goZC54KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMueFNjYWxlVHlwZSA9IGdldFNjYWxlVHlwZSh2YWx1ZXMpO1xuICAgIHJldHVybiBnZXREb21haW4odmFsdWVzLCB0aGlzLnhTY2FsZVR5cGUsIHRoaXMuYXV0b1NjYWxlLCB0aGlzLnhTY2FsZU1pbiwgdGhpcy54U2NhbGVNYXgpO1xuICB9XG5cbiAgZ2V0WURvbWFpbigpOiBhbnlbXSB7XG4gICAgY29uc3QgdmFsdWVzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IHJlc3VsdHMgb2YgdGhpcy5yZXN1bHRzKSB7XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgcmVzdWx0cy5zZXJpZXMpIHtcbiAgICAgICAgaWYgKCF2YWx1ZXMuaW5jbHVkZXMoZC55KSkge1xuICAgICAgICAgIHZhbHVlcy5wdXNoKGQueSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnlTY2FsZVR5cGUgPSBnZXRTY2FsZVR5cGUodmFsdWVzKTtcbiAgICByZXR1cm4gZ2V0RG9tYWluKHZhbHVlcywgdGhpcy55U2NhbGVUeXBlLCB0aGlzLmF1dG9TY2FsZSwgdGhpcy55U2NhbGVNaW4sIHRoaXMueVNjYWxlTWF4KTtcbiAgfVxuXG4gIGdldFJEb21haW4oKTogbnVtYmVyW10ge1xuICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgZm9yIChjb25zdCByZXN1bHRzIG9mIHRoaXMucmVzdWx0cykge1xuICAgICAgZm9yIChjb25zdCBkIG9mIHJlc3VsdHMuc2VyaWVzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyKGQucikgfHwgMTtcbiAgICAgICAgbWluID0gTWF0aC5taW4obWluLCB2YWx1ZSk7XG4gICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbbWluLCBtYXhdO1xuICB9XG5cbiAgdXBkYXRlWUF4aXNXaWR0aCh7IHdpZHRoIH0pOiB2b2lkIHtcbiAgICB0aGlzLnlBeGlzV2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgdXBkYXRlWEF4aXNIZWlnaHQoeyBoZWlnaHQgfSk6IHZvaWQge1xuICAgIHRoaXMueEF4aXNIZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uQWN0aXZhdGUoaXRlbSk6IHZvaWQge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWU7XG4gICAgfSk7XG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2l0ZW0sIC4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIG9uRGVhY3RpdmF0ZShpdGVtKTogdm9pZCB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcblxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIGRlYWN0aXZhdGVBbGwoKSB7XG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmFjdGl2ZUVudHJpZXMpIHtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGVudHJ5LCBlbnRyaWVzOiBbXSB9KTtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW107XG4gIH1cblxuICB0cmFja0J5KGluZGV4LCBpdGVtKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaXRlbS5uYW1lO1xuICB9XG59XG4iXX0=