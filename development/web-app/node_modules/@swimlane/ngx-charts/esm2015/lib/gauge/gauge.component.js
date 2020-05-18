import { __decorate } from "tslib";
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation, ContentChild } from '@angular/core';
import { scaleLinear } from 'd3-scale';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
let GaugeComponent = class GaugeComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.legend = false;
        this.legendTitle = 'Legend';
        this.legendPosition = 'right';
        this.min = 0;
        this.max = 100;
        this.bigSegments = 10;
        this.smallSegments = 5;
        this.showAxis = true;
        this.startAngle = -120;
        this.angleSpan = 240;
        this.activeEntries = [];
        this.tooltipDisabled = false;
        this.showText = true;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.resizeScale = 1;
        this.rotation = '';
        this.textTransform = 'scale(1, 1)';
        this.cornerRadius = 10;
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        setTimeout(() => this.scaleText());
    }
    update() {
        super.update();
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
        const xOffset = this.margin[3] + this.dims.width / 2;
        const yOffset = this.margin[0] + this.dims.height / 2;
        this.transform = `translate(${xOffset}, ${yOffset})`;
        this.rotation = `rotate(${this.startAngle})`;
        setTimeout(() => this.scaleText(), 50);
    }
    getArcs() {
        const arcs = [];
        const availableRadius = this.outerRadius * 0.7;
        const radiusPerArc = Math.min(availableRadius / this.results.length, 10);
        const arcWidth = radiusPerArc * 0.7;
        this.textRadius = this.outerRadius - this.results.length * radiusPerArc;
        this.cornerRadius = Math.floor(arcWidth / 2);
        let i = 0;
        for (const d of this.results) {
            const outerRadius = this.outerRadius - i * radiusPerArc;
            const innerRadius = outerRadius - arcWidth;
            const backgroundArc = {
                endAngle: (this.angleSpan * Math.PI) / 180,
                innerRadius,
                outerRadius,
                data: {
                    value: this.max,
                    name: d.name
                }
            };
            const valueArc = {
                endAngle: (Math.min(this.valueScale(d.value), this.angleSpan) * Math.PI) / 180,
                innerRadius,
                outerRadius,
                data: {
                    value: d.value,
                    name: d.name
                }
            };
            const arc = {
                backgroundArc,
                valueArc
            };
            arcs.push(arc);
            i++;
        }
        return arcs;
    }
    getDomain() {
        return this.results.map(d => d.name);
    }
    getValueDomain() {
        const values = this.results.map(d => d.value);
        const dataMin = Math.min(...values);
        const dataMax = Math.max(...values);
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
    }
    getValueScale() {
        return scaleLinear().range([0, this.angleSpan]).nice().domain(this.valueDomain);
    }
    getDisplayValue() {
        const value = this.results.map(d => d.value).reduce((a, b) => a + b, 0);
        if (this.textValue && 0 !== this.textValue.length) {
            return this.textValue.toLocaleString();
        }
        if (this.valueFormatting) {
            return this.valueFormatting(value);
        }
        return value.toLocaleString();
    }
    scaleText(repeat = true) {
        if (!this.showText) {
            return;
        }
        const { width } = this.textEl.nativeElement.getBoundingClientRect();
        const oldScale = this.resizeScale;
        if (width === 0) {
            this.resizeScale = 1;
        }
        else {
            const availableSpace = this.textRadius;
            this.resizeScale = Math.floor((availableSpace / (width / this.resizeScale)) * 100) / 100;
        }
        if (this.resizeScale !== oldScale) {
            this.textTransform = `scale(${this.resizeScale}, ${this.resizeScale})`;
            this.cd.markForCheck();
            if (repeat) {
                setTimeout(() => this.scaleText(false), 50);
            }
        }
    }
    onClick(data) {
        this.select.emit(data);
    }
    getLegendOptions() {
        return {
            scaleType: 'ordinal',
            colors: this.colors,
            domain: this.domain,
            title: this.legendTitle,
            position: this.legendPosition
        };
    }
    setColors() {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
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
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.name === d.name && entry.series === d.series;
        });
        return item !== undefined;
    }
    trackBy(index, item) {
        return item.valueArc.data.name;
    }
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
      <svg:g [attr.transform]="transform" class="gauge chart">
        <svg:g *ngFor="let arc of arcs; trackBy: trackBy" [attr.transform]="rotation">
          <svg:g
            ngx-charts-gauge-arc
            [backgroundArc]="arc.backgroundArc"
            [valueArc]="arc.valueArc"
            [cornerRadius]="cornerRadius"
            [colors]="colors"
            [isActive]="isActive(arc.valueArc.data)"
            [tooltipDisabled]="tooltipDisabled"
            [tooltipTemplate]="tooltipTemplate"
            [valueFormatting]="valueFormatting"
            [animations]="animations"
            (select)="onClick($event)"
            (activate)="onActivate($event)"
            (deactivate)="onDeactivate($event)"
          ></svg:g>
        </svg:g>

        <svg:g
          ngx-charts-gauge-axis
          *ngIf="showAxis"
          [bigSegments]="bigSegments"
          [smallSegments]="smallSegments"
          [min]="min"
          [max]="max"
          [radius]="outerRadius"
          [angleSpan]="angleSpan"
          [valueScale]="valueScale"
          [startAngle]="startAngle"
          [tickFormatting]="axisTickFormatting"
        ></svg:g>

        <svg:text
          #textEl
          *ngIf="showText"
          [style.textAnchor]="'middle'"
          [attr.transform]="textTransform"
          alignment-baseline="central"
        >
          <tspan x="0" dy="0">{{ displayValue }}</tspan>
          <tspan x="0" dy="1.2em">{{ units }}</tspan>
        </svg:text>
      </svg:g>
    </ngx-charts-chart>
  `,
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}", ".gauge .background-arc path{fill:rgba(0,0,0,.05)}.gauge .gauge-tick path{stroke:#666}.gauge .gauge-tick text{font-size:12px;fill:#666;font-weight:700}.gauge .gauge-tick-large path{stroke-width:2px}.gauge .gauge-tick-small path{stroke-width:1px}"]
    })
], GaugeComponent);
export { GaugeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1Z2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvZ2F1Z2UvZ2F1Z2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCxTQUFTLEVBRVQsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFDTixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXZDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSx1QkFBdUIsRUFBa0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFpRXJELElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWUsU0FBUSxrQkFBa0I7SUFBdEQ7O1FBQ1csV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLG1CQUFjLEdBQVcsT0FBTyxDQUFDO1FBQ2pDLFFBQUcsR0FBVyxDQUFDLENBQUM7UUFDaEIsUUFBRyxHQUFXLEdBQUcsQ0FBQztRQUdsQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUUxQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLGVBQVUsR0FBVyxDQUFDLEdBQUcsQ0FBQztRQUMxQixjQUFTLEdBQVcsR0FBRyxDQUFDO1FBQ3hCLGtCQUFhLEdBQVUsRUFBRSxDQUFDO1FBRTFCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBRWpDLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFLeEIsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGVBQVUsR0FBc0IsSUFBSSxZ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dURBQWtDO0FBQ2pDO0lBQVIsS0FBSyxFQUFFO3VEQUF5QztBQUN4QztJQUFSLEtBQUssRUFBRTtnREFBMEI7QUFHekI7SUFBUixLQUFLLEVBQUU7OENBQWU7QUFFYjtJQUFULE1BQU0sRUFBRTtnREFBa0Q7QUFDakQ7SUFBVCxNQUFNLEVBQUU7a0RBQW9EO0FBRTVCO0lBQWhDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQzt1REFBbUM7QUFFOUM7SUFBcEIsU0FBUyxDQUFDLFFBQVEsQ0FBQzs4Q0FBb0I7QUE1QjdCLGNBQWM7SUEvRDFCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxrQkFBa0I7UUFDNUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdEVDtRQUVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1FBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztLQUNoRCxDQUFDO0dBQ1csY0FBYyxDQXlRMUI7U0F6UVksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIFZpZXdDaGlsZCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ29udGVudENoaWxkLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHNjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuXG5pbXBvcnQgeyBCYXNlQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQnO1xuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1nYXVnZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5neC1jaGFydHMtY2hhcnRcbiAgICAgIFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiXG4gICAgICBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIlxuICAgICAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXG4gICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcbiAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxuICAgICAgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcbiAgICAgIChsZWdlbmRMYWJlbEFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiXG4gICAgICAobGVnZW5kTGFiZWxEZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCJcbiAgICA+XG4gICAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiIGNsYXNzPVwiZ2F1Z2UgY2hhcnRcIj5cbiAgICAgICAgPHN2ZzpnICpuZ0Zvcj1cImxldCBhcmMgb2YgYXJjczsgdHJhY2tCeTogdHJhY2tCeVwiIFthdHRyLnRyYW5zZm9ybV09XCJyb3RhdGlvblwiPlxuICAgICAgICAgIDxzdmc6Z1xuICAgICAgICAgICAgbmd4LWNoYXJ0cy1nYXVnZS1hcmNcbiAgICAgICAgICAgIFtiYWNrZ3JvdW5kQXJjXT1cImFyYy5iYWNrZ3JvdW5kQXJjXCJcbiAgICAgICAgICAgIFt2YWx1ZUFyY109XCJhcmMudmFsdWVBcmNcIlxuICAgICAgICAgICAgW2Nvcm5lclJhZGl1c109XCJjb3JuZXJSYWRpdXNcIlxuICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxuICAgICAgICAgICAgW2lzQWN0aXZlXT1cImlzQWN0aXZlKGFyYy52YWx1ZUFyYy5kYXRhKVwiXG4gICAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXG4gICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICAgICAgICBbdmFsdWVGb3JtYXR0aW5nXT1cInZhbHVlRm9ybWF0dGluZ1wiXG4gICAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcbiAgICAgICAgICAgIChzZWxlY3QpPVwib25DbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxuICAgICAgICAgICAgKGRlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIlxuICAgICAgICAgID48L3N2ZzpnPlxuICAgICAgICA8L3N2ZzpnPlxuXG4gICAgICAgIDxzdmc6Z1xuICAgICAgICAgIG5neC1jaGFydHMtZ2F1Z2UtYXhpc1xuICAgICAgICAgICpuZ0lmPVwic2hvd0F4aXNcIlxuICAgICAgICAgIFtiaWdTZWdtZW50c109XCJiaWdTZWdtZW50c1wiXG4gICAgICAgICAgW3NtYWxsU2VnbWVudHNdPVwic21hbGxTZWdtZW50c1wiXG4gICAgICAgICAgW21pbl09XCJtaW5cIlxuICAgICAgICAgIFttYXhdPVwibWF4XCJcbiAgICAgICAgICBbcmFkaXVzXT1cIm91dGVyUmFkaXVzXCJcbiAgICAgICAgICBbYW5nbGVTcGFuXT1cImFuZ2xlU3BhblwiXG4gICAgICAgICAgW3ZhbHVlU2NhbGVdPVwidmFsdWVTY2FsZVwiXG4gICAgICAgICAgW3N0YXJ0QW5nbGVdPVwic3RhcnRBbmdsZVwiXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cImF4aXNUaWNrRm9ybWF0dGluZ1wiXG4gICAgICAgID48L3N2ZzpnPlxuXG4gICAgICAgIDxzdmc6dGV4dFxuICAgICAgICAgICN0ZXh0RWxcbiAgICAgICAgICAqbmdJZj1cInNob3dUZXh0XCJcbiAgICAgICAgICBbc3R5bGUudGV4dEFuY2hvcl09XCInbWlkZGxlJ1wiXG4gICAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInRleHRUcmFuc2Zvcm1cIlxuICAgICAgICAgIGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIlxuICAgICAgICA+XG4gICAgICAgICAgPHRzcGFuIHg9XCIwXCIgZHk9XCIwXCI+e3sgZGlzcGxheVZhbHVlIH19PC90c3Bhbj5cbiAgICAgICAgICA8dHNwYW4geD1cIjBcIiBkeT1cIjEuMmVtXCI+e3sgdW5pdHMgfX08L3RzcGFuPlxuICAgICAgICA8L3N2Zzp0ZXh0PlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L25neC1jaGFydHMtY2hhcnQ+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQuc2NzcycsICcuL2dhdWdlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIEdhdWdlQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIGxlZ2VuZCA9IGZhbHNlO1xuICBASW5wdXQoKSBsZWdlbmRUaXRsZTogc3RyaW5nID0gJ0xlZ2VuZCc7XG4gIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBzdHJpbmcgPSAncmlnaHQnO1xuICBASW5wdXQoKSBtaW46IG51bWJlciA9IDA7XG4gIEBJbnB1dCgpIG1heDogbnVtYmVyID0gMTAwO1xuICBASW5wdXQoKSB0ZXh0VmFsdWU6IHN0cmluZztcbiAgQElucHV0KCkgdW5pdHM6IHN0cmluZztcbiAgQElucHV0KCkgYmlnU2VnbWVudHM6IG51bWJlciA9IDEwO1xuICBASW5wdXQoKSBzbWFsbFNlZ21lbnRzOiBudW1iZXIgPSA1O1xuICBASW5wdXQoKSByZXN1bHRzOiBhbnlbXTtcbiAgQElucHV0KCkgc2hvd0F4aXM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBzdGFydEFuZ2xlOiBudW1iZXIgPSAtMTIwO1xuICBASW5wdXQoKSBhbmdsZVNwYW46IG51bWJlciA9IDI0MDtcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcbiAgQElucHV0KCkgYXhpc1RpY2tGb3JtYXR0aW5nOiBhbnk7XG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSB2YWx1ZUZvcm1hdHRpbmc6ICh2YWx1ZTogYW55KSA9PiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNob3dUZXh0OiBib29sZWFuID0gdHJ1ZTtcblxuICAvLyBTcGVjaWZ5IG1hcmdpbnNcbiAgQElucHV0KCkgbWFyZ2luOiBhbnlbXTtcblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQENvbnRlbnRDaGlsZCgndG9vbHRpcFRlbXBsYXRlJykgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBWaWV3Q2hpbGQoJ3RleHRFbCcpIHRleHRFbDogRWxlbWVudFJlZjtcblxuICBkaW1zOiBWaWV3RGltZW5zaW9ucztcbiAgZG9tYWluOiBhbnlbXTtcbiAgdmFsdWVEb21haW46IGFueTtcbiAgdmFsdWVTY2FsZTogYW55O1xuXG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XG4gIHRyYW5zZm9ybTogc3RyaW5nO1xuXG4gIG91dGVyUmFkaXVzOiBudW1iZXI7XG4gIHRleHRSYWRpdXM6IG51bWJlcjsgLy8gbWF4IGF2YWlsYWJsZSByYWRpdXMgZm9yIHRoZSB0ZXh0XG4gIHJlc2l6ZVNjYWxlOiBudW1iZXIgPSAxO1xuICByb3RhdGlvbjogc3RyaW5nID0gJyc7XG4gIHRleHRUcmFuc2Zvcm06IHN0cmluZyA9ICdzY2FsZSgxLCAxKSc7XG4gIGNvcm5lclJhZGl1czogbnVtYmVyID0gMTA7XG4gIGFyY3M6IGFueVtdO1xuICBkaXNwbGF5VmFsdWU6IHN0cmluZztcbiAgbGVnZW5kT3B0aW9uczogYW55O1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2NhbGVUZXh0KCkpO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuXG4gICAgaWYgKCF0aGlzLnNob3dBeGlzKSB7XG4gICAgICBpZiAoIXRoaXMubWFyZ2luKSB7XG4gICAgICAgIHRoaXMubWFyZ2luID0gWzEwLCAyMCwgMTAsIDIwXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLm1hcmdpbikge1xuICAgICAgICB0aGlzLm1hcmdpbiA9IFs2MCwgMTAwLCA2MCwgMTAwXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBtYWtlIHRoZSBzdGFydGluZyBhbmdsZSBwb3NpdGl2ZVxuICAgIGlmICh0aGlzLnN0YXJ0QW5nbGUgPCAwKSB7XG4gICAgICB0aGlzLnN0YXJ0QW5nbGUgPSAodGhpcy5zdGFydEFuZ2xlICUgMzYwKSArIDM2MDtcbiAgICB9XG5cbiAgICB0aGlzLmFuZ2xlU3BhbiA9IE1hdGgubWluKHRoaXMuYW5nbGVTcGFuLCAzNjApO1xuXG4gICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXG4gICAgICBzaG93TGVnZW5kOiB0aGlzLmxlZ2VuZCxcbiAgICAgIGxlZ2VuZFBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXG4gICAgfSk7XG5cbiAgICB0aGlzLmRvbWFpbiA9IHRoaXMuZ2V0RG9tYWluKCk7XG4gICAgdGhpcy52YWx1ZURvbWFpbiA9IHRoaXMuZ2V0VmFsdWVEb21haW4oKTtcbiAgICB0aGlzLnZhbHVlU2NhbGUgPSB0aGlzLmdldFZhbHVlU2NhbGUoKTtcbiAgICB0aGlzLmRpc3BsYXlWYWx1ZSA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlKCk7XG5cbiAgICB0aGlzLm91dGVyUmFkaXVzID0gTWF0aC5taW4odGhpcy5kaW1zLndpZHRoLCB0aGlzLmRpbXMuaGVpZ2h0KSAvIDI7XG5cbiAgICB0aGlzLmFyY3MgPSB0aGlzLmdldEFyY3MoKTtcblxuICAgIHRoaXMuc2V0Q29sb3JzKCk7XG4gICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XG5cbiAgICBjb25zdCB4T2Zmc2V0ID0gdGhpcy5tYXJnaW5bM10gKyB0aGlzLmRpbXMud2lkdGggLyAyO1xuICAgIGNvbnN0IHlPZmZzZXQgPSB0aGlzLm1hcmdpblswXSArIHRoaXMuZGltcy5oZWlnaHQgLyAyO1xuXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eE9mZnNldH0sICR7eU9mZnNldH0pYDtcbiAgICB0aGlzLnJvdGF0aW9uID0gYHJvdGF0ZSgke3RoaXMuc3RhcnRBbmdsZX0pYDtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2NhbGVUZXh0KCksIDUwKTtcbiAgfVxuXG4gIGdldEFyY3MoKTogYW55W10ge1xuICAgIGNvbnN0IGFyY3MgPSBbXTtcblxuICAgIGNvbnN0IGF2YWlsYWJsZVJhZGl1cyA9IHRoaXMub3V0ZXJSYWRpdXMgKiAwLjc7XG5cbiAgICBjb25zdCByYWRpdXNQZXJBcmMgPSBNYXRoLm1pbihhdmFpbGFibGVSYWRpdXMgLyB0aGlzLnJlc3VsdHMubGVuZ3RoLCAxMCk7XG4gICAgY29uc3QgYXJjV2lkdGggPSByYWRpdXNQZXJBcmMgKiAwLjc7XG4gICAgdGhpcy50ZXh0UmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cyAtIHRoaXMucmVzdWx0cy5sZW5ndGggKiByYWRpdXNQZXJBcmM7XG4gICAgdGhpcy5jb3JuZXJSYWRpdXMgPSBNYXRoLmZsb29yKGFyY1dpZHRoIC8gMik7XG5cbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBkIG9mIHRoaXMucmVzdWx0cykge1xuICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzIC0gaSAqIHJhZGl1c1BlckFyYztcbiAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gb3V0ZXJSYWRpdXMgLSBhcmNXaWR0aDtcblxuICAgICAgY29uc3QgYmFja2dyb3VuZEFyYyA9IHtcbiAgICAgICAgZW5kQW5nbGU6ICh0aGlzLmFuZ2xlU3BhbiAqIE1hdGguUEkpIC8gMTgwLFxuICAgICAgICBpbm5lclJhZGl1cyxcbiAgICAgICAgb3V0ZXJSYWRpdXMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tYXgsXG4gICAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHZhbHVlQXJjID0ge1xuICAgICAgICBlbmRBbmdsZTogKE1hdGgubWluKHRoaXMudmFsdWVTY2FsZShkLnZhbHVlKSwgdGhpcy5hbmdsZVNwYW4pICogTWF0aC5QSSkgLyAxODAsXG4gICAgICAgIGlubmVyUmFkaXVzLFxuICAgICAgICBvdXRlclJhZGl1cyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHZhbHVlOiBkLnZhbHVlLFxuICAgICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBhcmMgPSB7XG4gICAgICAgIGJhY2tncm91bmRBcmMsXG4gICAgICAgIHZhbHVlQXJjXG4gICAgICB9O1xuXG4gICAgICBhcmNzLnB1c2goYXJjKTtcbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4gYXJjcztcbiAgfVxuXG4gIGdldERvbWFpbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLm5hbWUpO1xuICB9XG5cbiAgZ2V0VmFsdWVEb21haW4oKTogYW55W10ge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLnZhbHVlKTtcbiAgICBjb25zdCBkYXRhTWluID0gTWF0aC5taW4oLi4udmFsdWVzKTtcbiAgICBjb25zdCBkYXRhTWF4ID0gTWF0aC5tYXgoLi4udmFsdWVzKTtcblxuICAgIGlmICh0aGlzLm1pbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm1pbiA9IE1hdGgubWluKHRoaXMubWluLCBkYXRhTWluKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW4gPSBkYXRhTWluO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1heCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm1heCA9IE1hdGgubWF4KHRoaXMubWF4LCBkYXRhTWF4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXggPSBkYXRhTWF4O1xuICAgIH1cblxuICAgIHJldHVybiBbdGhpcy5taW4sIHRoaXMubWF4XTtcbiAgfVxuXG4gIGdldFZhbHVlU2NhbGUoKTogYW55IHtcbiAgICByZXR1cm4gc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgdGhpcy5hbmdsZVNwYW5dKS5uaWNlKCkuZG9tYWluKHRoaXMudmFsdWVEb21haW4pO1xuICB9XG5cbiAgZ2V0RGlzcGxheVZhbHVlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC52YWx1ZSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG5cbiAgICBpZiAodGhpcy50ZXh0VmFsdWUgJiYgMCAhPT0gdGhpcy50ZXh0VmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0VmFsdWUudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy52YWx1ZUZvcm1hdHRpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlRm9ybWF0dGluZyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlLnRvTG9jYWxlU3RyaW5nKCk7XG4gIH1cblxuICBzY2FsZVRleHQocmVwZWF0OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zaG93VGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB7IHdpZHRoIH0gPSB0aGlzLnRleHRFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG9sZFNjYWxlID0gdGhpcy5yZXNpemVTY2FsZTtcblxuICAgIGlmICh3aWR0aCA9PT0gMCkge1xuICAgICAgdGhpcy5yZXNpemVTY2FsZSA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZVNwYWNlID0gdGhpcy50ZXh0UmFkaXVzO1xuICAgICAgdGhpcy5yZXNpemVTY2FsZSA9IE1hdGguZmxvb3IoKGF2YWlsYWJsZVNwYWNlIC8gKHdpZHRoIC8gdGhpcy5yZXNpemVTY2FsZSkpICogMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXNpemVTY2FsZSAhPT0gb2xkU2NhbGUpIHtcbiAgICAgIHRoaXMudGV4dFRyYW5zZm9ybSA9IGBzY2FsZSgke3RoaXMucmVzaXplU2NhbGV9LCAke3RoaXMucmVzaXplU2NhbGV9KWA7XG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgaWYgKHJlcGVhdCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2NhbGVUZXh0KGZhbHNlKSwgNTApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2soZGF0YSk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF0YSk7XG4gIH1cblxuICBnZXRMZWdlbmRPcHRpb25zKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjYWxlVHlwZTogJ29yZGluYWwnLFxuICAgICAgY29sb3JzOiB0aGlzLmNvbG9ycyxcbiAgICAgIGRvbWFpbjogdGhpcy5kb21haW4sXG4gICAgICB0aXRsZTogdGhpcy5sZWdlbmRUaXRsZSxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXG4gICAgfTtcbiAgfVxuXG4gIHNldENvbG9ycygpOiB2b2lkIHtcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgJ29yZGluYWwnLCB0aGlzLmRvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xuICB9XG5cbiAgb25BY3RpdmF0ZShpdGVtKTogdm9pZCB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlO1xuICAgIH0pO1xuICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtpdGVtLCAuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XG4gIH1cblxuICBvbkRlYWN0aXZhdGUoaXRlbSk6IHZvaWQge1xuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcblxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcbiAgfVxuXG4gIGlzQWN0aXZlKGVudHJ5KTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZUVudHJpZXMpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmQoZCA9PiB7XG4gICAgICByZXR1cm4gZW50cnkubmFtZSA9PT0gZC5uYW1lICYmIGVudHJ5LnNlcmllcyA9PT0gZC5zZXJpZXM7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHRyYWNrQnkoaW5kZXgsIGl0ZW0pOiBzdHJpbmcge1xuICAgIHJldHVybiBpdGVtLnZhbHVlQXJjLmRhdGEubmFtZTtcbiAgfVxufVxuIl19