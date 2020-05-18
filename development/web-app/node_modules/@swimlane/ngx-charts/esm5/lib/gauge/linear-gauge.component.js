import { __decorate, __extends } from "tslib";
import { Component, Input, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { scaleLinear } from 'd3-scale';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
var LinearGaugeComponent = /** @class */ (function (_super) {
    __extends(LinearGaugeComponent, _super);
    function LinearGaugeComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.min = 0;
        _this.max = 100;
        _this.value = 0;
        _this.margin = [10, 20, 10, 20];
        _this.valueResizeScale = 1;
        _this.unitsResizeScale = 1;
        _this.valueTextTransform = '';
        _this.valueTranslate = '';
        _this.unitsTextTransform = '';
        _this.unitsTranslate = '';
        return _this;
    }
    LinearGaugeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        _super.prototype.ngAfterViewInit.call(this);
        setTimeout(function () {
            _this.scaleText('value');
            _this.scaleText('units');
        });
    };
    LinearGaugeComponent.prototype.update = function () {
        var _this = this;
        _super.prototype.update.call(this);
        this.hasPreviousValue = this.previousValue !== undefined;
        this.max = Math.max(this.max, this.value);
        this.min = Math.min(this.min, this.value);
        if (this.hasPreviousValue) {
            this.max = Math.max(this.max, this.previousValue);
            this.min = Math.min(this.min, this.previousValue);
        }
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin
        });
        this.valueDomain = this.getValueDomain();
        this.valueScale = this.getValueScale();
        this.displayValue = this.getDisplayValue();
        this.setColors();
        var xOffset = this.margin[3] + this.dims.width / 2;
        var yOffset = this.margin[0] + this.dims.height / 2;
        this.transform = "translate(" + xOffset + ", " + yOffset + ")";
        this.transformLine = "translate(" + (this.margin[3] + this.valueScale(this.previousValue)) + ", " + yOffset + ")";
        this.valueTranslate = "translate(0, -15)";
        this.unitsTranslate = "translate(0, 15)";
        setTimeout(function () { return _this.scaleText('value'); }, 50);
        setTimeout(function () { return _this.scaleText('units'); }, 50);
    };
    LinearGaugeComponent.prototype.getValueDomain = function () {
        return [this.min, this.max];
    };
    LinearGaugeComponent.prototype.getValueScale = function () {
        return scaleLinear().range([0, this.dims.width]).domain(this.valueDomain);
    };
    LinearGaugeComponent.prototype.getDisplayValue = function () {
        if (this.valueFormatting) {
            return this.valueFormatting(this.value);
        }
        return this.value.toLocaleString();
    };
    LinearGaugeComponent.prototype.scaleText = function (element, repeat) {
        var _this = this;
        if (repeat === void 0) { repeat = true; }
        var el;
        var resizeScale;
        if (element === 'value') {
            el = this.valueTextEl;
            resizeScale = this.valueResizeScale;
        }
        else {
            el = this.unitsTextEl;
            resizeScale = this.unitsResizeScale;
        }
        var _a = el.nativeElement.getBoundingClientRect(), width = _a.width, height = _a.height;
        if (width === 0 || height === 0)
            return;
        var oldScale = resizeScale;
        var availableWidth = this.dims.width;
        var availableHeight = Math.max(this.dims.height / 2 - 15, 0);
        var resizeScaleWidth = Math.floor((availableWidth / (width / resizeScale)) * 100) / 100;
        var resizeScaleHeight = Math.floor((availableHeight / (height / resizeScale)) * 100) / 100;
        resizeScale = Math.min(resizeScaleHeight, resizeScaleWidth);
        if (resizeScale !== oldScale) {
            if (element === 'value') {
                this.valueResizeScale = resizeScale;
                this.valueTextTransform = "scale(" + resizeScale + ", " + resizeScale + ")";
            }
            else {
                this.unitsResizeScale = resizeScale;
                this.unitsTextTransform = "scale(" + resizeScale + ", " + resizeScale + ")";
            }
            this.cd.markForCheck();
            if (repeat) {
                setTimeout(function () {
                    _this.scaleText(element, false);
                }, 50);
            }
        }
    };
    LinearGaugeComponent.prototype.onClick = function () {
        this.select.emit({
            name: 'Value',
            value: this.value
        });
    };
    LinearGaugeComponent.prototype.setColors = function () {
        this.colors = new ColorHelper(this.scheme, 'ordinal', [this.value], this.customColors);
    };
    __decorate([
        Input()
    ], LinearGaugeComponent.prototype, "min", void 0);
    __decorate([
        Input()
    ], LinearGaugeComponent.prototype, "max", void 0);
    __decorate([
        Input()
    ], LinearGaugeComponent.prototype, "value", void 0);
    __decorate([
        Input()
    ], LinearGaugeComponent.prototype, "units", void 0);
    __decorate([
        Input()
    ], LinearGaugeComponent.prototype, "previousValue", void 0);
    __decorate([
        Input()
    ], LinearGaugeComponent.prototype, "valueFormatting", void 0);
    __decorate([
        ViewChild('valueTextEl')
    ], LinearGaugeComponent.prototype, "valueTextEl", void 0);
    __decorate([
        ViewChild('unitsTextEl')
    ], LinearGaugeComponent.prototype, "unitsTextEl", void 0);
    LinearGaugeComponent = __decorate([
        Component({
            selector: 'ngx-charts-linear-gauge',
            template: "\n    <ngx-charts-chart [view]=\"[width, height]\" [showLegend]=\"false\" [animations]=\"animations\" (click)=\"onClick()\">\n      <svg:g class=\"linear-gauge chart\">\n        <svg:g\n          ngx-charts-bar\n          class=\"background-bar\"\n          [width]=\"dims.width\"\n          [height]=\"3\"\n          [x]=\"margin[3]\"\n          [y]=\"dims.height / 2 + margin[0] - 2\"\n          [data]=\"{}\"\n          [orientation]=\"'horizontal'\"\n          [roundEdges]=\"true\"\n          [animations]=\"animations\"\n        ></svg:g>\n        <svg:g\n          ngx-charts-bar\n          [width]=\"valueScale(value)\"\n          [height]=\"3\"\n          [x]=\"margin[3]\"\n          [y]=\"dims.height / 2 + margin[0] - 2\"\n          [fill]=\"colors.getColor(units)\"\n          [data]=\"{}\"\n          [orientation]=\"'horizontal'\"\n          [roundEdges]=\"true\"\n          [animations]=\"animations\"\n        ></svg:g>\n\n        <svg:line\n          *ngIf=\"hasPreviousValue\"\n          [attr.transform]=\"transformLine\"\n          x1=\"0\"\n          y1=\"5\"\n          x2=\"0\"\n          y2=\"15\"\n          [attr.stroke]=\"colors.getColor(units)\"\n        />\n\n        <svg:line\n          *ngIf=\"hasPreviousValue\"\n          [attr.transform]=\"transformLine\"\n          x1=\"0\"\n          y1=\"-5\"\n          x2=\"0\"\n          y2=\"-15\"\n          [attr.stroke]=\"colors.getColor(units)\"\n        />\n\n        <svg:g [attr.transform]=\"transform\">\n          <svg:g [attr.transform]=\"valueTranslate\">\n            <svg:text\n              #valueTextEl\n              class=\"value\"\n              [style.textAnchor]=\"'middle'\"\n              [attr.transform]=\"valueTextTransform\"\n              alignment-baseline=\"after-edge\"\n            >\n              {{ displayValue }}\n            </svg:text>\n          </svg:g>\n\n          <svg:g [attr.transform]=\"unitsTranslate\">\n            <svg:text\n              #unitsTextEl\n              class=\"units\"\n              [style.textAnchor]=\"'middle'\"\n              [attr.transform]=\"unitsTextTransform\"\n              alignment-baseline=\"before-edge\"\n            >\n              {{ units }}\n            </svg:text>\n          </svg:g>\n        </svg:g>\n      </svg:g>\n    </ngx-charts-chart>\n  ",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:0}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:0}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{transition:opacity .1s ease-in-out;opacity:.2}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{stroke:#ddd;stroke-width:1;fill:none}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-width:1;stroke-dasharray:5;stroke-dashoffset:5}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill-opacity:.05;fill:#000}.ngx-charts .gridline-path-dotted{stroke:#ddd;stroke-width:1;fill:none;stroke-dasharray:1,20;stroke-dashoffset:3}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}", ".linear-gauge{cursor:pointer}.linear-gauge .background-bar path{fill:rgba(0,0,0,.05)}.linear-gauge .units{fill:#666}"]
        })
    ], LinearGaugeComponent);
    return LinearGaugeComponent;
}(BaseChartComponent));
export { LinearGaugeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZWFyLWdhdWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL2dhdWdlL2xpbmVhci1nYXVnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUVMLFNBQVMsRUFFVCxpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdkMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDcEUsT0FBTyxFQUFFLHVCQUF1QixFQUFrQixNQUFNLGtDQUFrQyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQW9GckQ7SUFBMEMsd0NBQWtCO0lBQTVEO1FBQUEscUVBcUlDO1FBcElVLFNBQUcsR0FBVyxDQUFDLENBQUM7UUFDaEIsU0FBRyxHQUFXLEdBQUcsQ0FBQztRQUNsQixXQUFLLEdBQVcsQ0FBQyxDQUFDO1FBYzNCLFlBQU0sR0FBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR2pDLHNCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixzQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFDN0Isd0JBQWtCLEdBQVcsRUFBRSxDQUFDO1FBQ2hDLG9CQUFjLEdBQVcsRUFBRSxDQUFDO1FBQzVCLHdCQUFrQixHQUFXLEVBQUUsQ0FBQztRQUNoQyxvQkFBYyxHQUFXLEVBQUUsQ0FBQzs7SUE0RzlCLENBQUM7SUF4R0MsOENBQWUsR0FBZjtRQUFBLGlCQU1DO1FBTEMsaUJBQU0sZUFBZSxXQUFFLENBQUM7UUFDeEIsVUFBVSxDQUFDO1lBQ1QsS0FBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4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QUFLLEVBQUU7cURBQWlCO0lBQ2hCO1FBQVIsS0FBSyxFQUFFO3FEQUFtQjtJQUNsQjtRQUFSLEtBQUssRUFBRTt1REFBbUI7SUFDbEI7UUFBUixLQUFLLEVBQUU7dURBQWU7SUFDZDtRQUFSLEtBQUssRUFBRTsrREFBZTtJQUNkO1FBQVIsS0FBSyxFQUFFO2lFQUFzQjtJQUVKO1FBQXpCLFNBQVMsQ0FBQyxhQUFhLENBQUM7NkRBQXlCO0lBQ3hCO1FBQXpCLFNBQVMsQ0FBQyxhQUFhLENBQUM7NkRBQXlCO0lBVHZDLG9CQUFvQjtRQWxGaEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxRQUFRLEVBQUUseXdFQTJFVDtZQUVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztTQUNoRCxDQUFDO09BQ1csb0JBQW9CLENBcUloQztJQUFELDJCQUFDO0NBQUEsQUFySUQsQ0FBMEMsa0JBQWtCLEdBcUkzRDtTQXJJWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBWaWV3Q2hpbGQsXG4gIEFmdGVyVmlld0luaXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHNjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuXG5pbXBvcnQgeyBCYXNlQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQnO1xuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1saW5lYXItZ2F1Z2UnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZ3gtY2hhcnRzLWNoYXJ0IFt2aWV3XT1cIlt3aWR0aCwgaGVpZ2h0XVwiIFtzaG93TGVnZW5kXT1cImZhbHNlXCIgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiIChjbGljayk9XCJvbkNsaWNrKClcIj5cbiAgICAgIDxzdmc6ZyBjbGFzcz1cImxpbmVhci1nYXVnZSBjaGFydFwiPlxuICAgICAgICA8c3ZnOmdcbiAgICAgICAgICBuZ3gtY2hhcnRzLWJhclxuICAgICAgICAgIGNsYXNzPVwiYmFja2dyb3VuZC1iYXJcIlxuICAgICAgICAgIFt3aWR0aF09XCJkaW1zLndpZHRoXCJcbiAgICAgICAgICBbaGVpZ2h0XT1cIjNcIlxuICAgICAgICAgIFt4XT1cIm1hcmdpblszXVwiXG4gICAgICAgICAgW3ldPVwiZGltcy5oZWlnaHQgLyAyICsgbWFyZ2luWzBdIC0gMlwiXG4gICAgICAgICAgW2RhdGFdPVwie31cIlxuICAgICAgICAgIFtvcmllbnRhdGlvbl09XCInaG9yaXpvbnRhbCdcIlxuICAgICAgICAgIFtyb3VuZEVkZ2VzXT1cInRydWVcIlxuICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxuICAgICAgICA+PC9zdmc6Zz5cbiAgICAgICAgPHN2ZzpnXG4gICAgICAgICAgbmd4LWNoYXJ0cy1iYXJcbiAgICAgICAgICBbd2lkdGhdPVwidmFsdWVTY2FsZSh2YWx1ZSlcIlxuICAgICAgICAgIFtoZWlnaHRdPVwiM1wiXG4gICAgICAgICAgW3hdPVwibWFyZ2luWzNdXCJcbiAgICAgICAgICBbeV09XCJkaW1zLmhlaWdodCAvIDIgKyBtYXJnaW5bMF0gLSAyXCJcbiAgICAgICAgICBbZmlsbF09XCJjb2xvcnMuZ2V0Q29sb3IodW5pdHMpXCJcbiAgICAgICAgICBbZGF0YV09XCJ7fVwiXG4gICAgICAgICAgW29yaWVudGF0aW9uXT1cIidob3Jpem9udGFsJ1wiXG4gICAgICAgICAgW3JvdW5kRWRnZXNdPVwidHJ1ZVwiXG4gICAgICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXG4gICAgICAgID48L3N2ZzpnPlxuXG4gICAgICAgIDxzdmc6bGluZVxuICAgICAgICAgICpuZ0lmPVwiaGFzUHJldmlvdXNWYWx1ZVwiXG4gICAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybUxpbmVcIlxuICAgICAgICAgIHgxPVwiMFwiXG4gICAgICAgICAgeTE9XCI1XCJcbiAgICAgICAgICB4Mj1cIjBcIlxuICAgICAgICAgIHkyPVwiMTVcIlxuICAgICAgICAgIFthdHRyLnN0cm9rZV09XCJjb2xvcnMuZ2V0Q29sb3IodW5pdHMpXCJcbiAgICAgICAgLz5cblxuICAgICAgICA8c3ZnOmxpbmVcbiAgICAgICAgICAqbmdJZj1cImhhc1ByZXZpb3VzVmFsdWVcIlxuICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1MaW5lXCJcbiAgICAgICAgICB4MT1cIjBcIlxuICAgICAgICAgIHkxPVwiLTVcIlxuICAgICAgICAgIHgyPVwiMFwiXG4gICAgICAgICAgeTI9XCItMTVcIlxuICAgICAgICAgIFthdHRyLnN0cm9rZV09XCJjb2xvcnMuZ2V0Q29sb3IodW5pdHMpXCJcbiAgICAgICAgLz5cblxuICAgICAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiPlxuICAgICAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidmFsdWVUcmFuc2xhdGVcIj5cbiAgICAgICAgICAgIDxzdmc6dGV4dFxuICAgICAgICAgICAgICAjdmFsdWVUZXh0RWxcbiAgICAgICAgICAgICAgY2xhc3M9XCJ2YWx1ZVwiXG4gICAgICAgICAgICAgIFtzdHlsZS50ZXh0QW5jaG9yXT1cIidtaWRkbGUnXCJcbiAgICAgICAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInZhbHVlVGV4dFRyYW5zZm9ybVwiXG4gICAgICAgICAgICAgIGFsaWdubWVudC1iYXNlbGluZT1cImFmdGVyLWVkZ2VcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7eyBkaXNwbGF5VmFsdWUgfX1cbiAgICAgICAgICAgIDwvc3ZnOnRleHQ+XG4gICAgICAgICAgPC9zdmc6Zz5cblxuICAgICAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidW5pdHNUcmFuc2xhdGVcIj5cbiAgICAgICAgICAgIDxzdmc6dGV4dFxuICAgICAgICAgICAgICAjdW5pdHNUZXh0RWxcbiAgICAgICAgICAgICAgY2xhc3M9XCJ1bml0c1wiXG4gICAgICAgICAgICAgIFtzdHlsZS50ZXh0QW5jaG9yXT1cIidtaWRkbGUnXCJcbiAgICAgICAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInVuaXRzVGV4dFRyYW5zZm9ybVwiXG4gICAgICAgICAgICAgIGFsaWdubWVudC1iYXNlbGluZT1cImJlZm9yZS1lZGdlXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3sgdW5pdHMgfX1cbiAgICAgICAgICAgIDwvc3ZnOnRleHQ+XG4gICAgICAgICAgPC9zdmc6Zz5cbiAgICAgICAgPC9zdmc6Zz5cbiAgICAgIDwvc3ZnOmc+XG4gICAgPC9uZ3gtY2hhcnRzLWNoYXJ0PlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50LnNjc3MnLCAnLi9saW5lYXItZ2F1Z2UuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTGluZWFyR2F1Z2VDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSBtYXg6IG51bWJlciA9IDEwMDtcbiAgQElucHV0KCkgdmFsdWU6IG51bWJlciA9IDA7XG4gIEBJbnB1dCgpIHVuaXRzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByZXZpb3VzVmFsdWU7XG4gIEBJbnB1dCgpIHZhbHVlRm9ybWF0dGluZzogYW55O1xuXG4gIEBWaWV3Q2hpbGQoJ3ZhbHVlVGV4dEVsJykgdmFsdWVUZXh0RWw6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3VuaXRzVGV4dEVsJykgdW5pdHNUZXh0RWw6IEVsZW1lbnRSZWY7XG5cbiAgZGltczogVmlld0RpbWVuc2lvbnM7XG4gIHZhbHVlRG9tYWluOiBhbnk7XG4gIHZhbHVlU2NhbGU6IGFueTtcblxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xuICB0cmFuc2Zvcm06IHN0cmluZztcbiAgbWFyZ2luOiBhbnlbXSA9IFsxMCwgMjAsIDEwLCAyMF07XG4gIHRyYW5zZm9ybUxpbmU6IHN0cmluZztcblxuICB2YWx1ZVJlc2l6ZVNjYWxlOiBudW1iZXIgPSAxO1xuICB1bml0c1Jlc2l6ZVNjYWxlOiBudW1iZXIgPSAxO1xuICB2YWx1ZVRleHRUcmFuc2Zvcm06IHN0cmluZyA9ICcnO1xuICB2YWx1ZVRyYW5zbGF0ZTogc3RyaW5nID0gJyc7XG4gIHVuaXRzVGV4dFRyYW5zZm9ybTogc3RyaW5nID0gJyc7XG4gIHVuaXRzVHJhbnNsYXRlOiBzdHJpbmcgPSAnJztcbiAgZGlzcGxheVZhbHVlOiBzdHJpbmc7XG4gIGhhc1ByZXZpb3VzVmFsdWU6IGJvb2xlYW47XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zY2FsZVRleHQoJ3ZhbHVlJyk7XG4gICAgICB0aGlzLnNjYWxlVGV4dCgndW5pdHMnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBzdXBlci51cGRhdGUoKTtcblxuICAgIHRoaXMuaGFzUHJldmlvdXNWYWx1ZSA9IHRoaXMucHJldmlvdXNWYWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIHRoaXMubWF4ID0gTWF0aC5tYXgodGhpcy5tYXgsIHRoaXMudmFsdWUpO1xuICAgIHRoaXMubWluID0gTWF0aC5taW4odGhpcy5taW4sIHRoaXMudmFsdWUpO1xuICAgIGlmICh0aGlzLmhhc1ByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMubWF4ID0gTWF0aC5tYXgodGhpcy5tYXgsIHRoaXMucHJldmlvdXNWYWx1ZSk7XG4gICAgICB0aGlzLm1pbiA9IE1hdGgubWluKHRoaXMubWluLCB0aGlzLnByZXZpb3VzVmFsdWUpO1xuICAgIH1cblxuICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luXG4gICAgfSk7XG5cbiAgICB0aGlzLnZhbHVlRG9tYWluID0gdGhpcy5nZXRWYWx1ZURvbWFpbigpO1xuICAgIHRoaXMudmFsdWVTY2FsZSA9IHRoaXMuZ2V0VmFsdWVTY2FsZSgpO1xuICAgIHRoaXMuZGlzcGxheVZhbHVlID0gdGhpcy5nZXREaXNwbGF5VmFsdWUoKTtcblxuICAgIHRoaXMuc2V0Q29sb3JzKCk7XG5cbiAgICBjb25zdCB4T2Zmc2V0ID0gdGhpcy5tYXJnaW5bM10gKyB0aGlzLmRpbXMud2lkdGggLyAyO1xuICAgIGNvbnN0IHlPZmZzZXQgPSB0aGlzLm1hcmdpblswXSArIHRoaXMuZGltcy5oZWlnaHQgLyAyO1xuXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eE9mZnNldH0sICR7eU9mZnNldH0pYDtcbiAgICB0aGlzLnRyYW5zZm9ybUxpbmUgPSBgdHJhbnNsYXRlKCR7dGhpcy5tYXJnaW5bM10gKyB0aGlzLnZhbHVlU2NhbGUodGhpcy5wcmV2aW91c1ZhbHVlKX0sICR7eU9mZnNldH0pYDtcbiAgICB0aGlzLnZhbHVlVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgwLCAtMTUpYDtcbiAgICB0aGlzLnVuaXRzVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgwLCAxNSlgO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zY2FsZVRleHQoJ3ZhbHVlJyksIDUwKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2NhbGVUZXh0KCd1bml0cycpLCA1MCk7XG4gIH1cblxuICBnZXRWYWx1ZURvbWFpbigpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFt0aGlzLm1pbiwgdGhpcy5tYXhdO1xuICB9XG5cbiAgZ2V0VmFsdWVTY2FsZSgpOiBhbnkge1xuICAgIHJldHVybiBzY2FsZUxpbmVhcigpLnJhbmdlKFswLCB0aGlzLmRpbXMud2lkdGhdKS5kb21haW4odGhpcy52YWx1ZURvbWFpbik7XG4gIH1cblxuICBnZXREaXNwbGF5VmFsdWUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy52YWx1ZUZvcm1hdHRpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlRm9ybWF0dGluZyh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudmFsdWUudG9Mb2NhbGVTdHJpbmcoKTtcbiAgfVxuXG4gIHNjYWxlVGV4dChlbGVtZW50LCByZXBlYXQ6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgbGV0IGVsO1xuICAgIGxldCByZXNpemVTY2FsZTtcbiAgICBpZiAoZWxlbWVudCA9PT0gJ3ZhbHVlJykge1xuICAgICAgZWwgPSB0aGlzLnZhbHVlVGV4dEVsO1xuICAgICAgcmVzaXplU2NhbGUgPSB0aGlzLnZhbHVlUmVzaXplU2NhbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsID0gdGhpcy51bml0c1RleHRFbDtcbiAgICAgIHJlc2l6ZVNjYWxlID0gdGhpcy51bml0c1Jlc2l6ZVNjYWxlO1xuICAgIH1cblxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAod2lkdGggPT09IDAgfHwgaGVpZ2h0ID09PSAwKSByZXR1cm47XG4gICAgY29uc3Qgb2xkU2NhbGUgPSByZXNpemVTY2FsZTtcbiAgICBjb25zdCBhdmFpbGFibGVXaWR0aCA9IHRoaXMuZGltcy53aWR0aDtcbiAgICBjb25zdCBhdmFpbGFibGVIZWlnaHQgPSBNYXRoLm1heCh0aGlzLmRpbXMuaGVpZ2h0IC8gMiAtIDE1LCAwKTtcbiAgICBjb25zdCByZXNpemVTY2FsZVdpZHRoID0gTWF0aC5mbG9vcigoYXZhaWxhYmxlV2lkdGggLyAod2lkdGggLyByZXNpemVTY2FsZSkpICogMTAwKSAvIDEwMDtcbiAgICBjb25zdCByZXNpemVTY2FsZUhlaWdodCA9IE1hdGguZmxvb3IoKGF2YWlsYWJsZUhlaWdodCAvIChoZWlnaHQgLyByZXNpemVTY2FsZSkpICogMTAwKSAvIDEwMDtcbiAgICByZXNpemVTY2FsZSA9IE1hdGgubWluKHJlc2l6ZVNjYWxlSGVpZ2h0LCByZXNpemVTY2FsZVdpZHRoKTtcblxuICAgIGlmIChyZXNpemVTY2FsZSAhPT0gb2xkU2NhbGUpIHtcbiAgICAgIGlmIChlbGVtZW50ID09PSAndmFsdWUnKSB7XG4gICAgICAgIHRoaXMudmFsdWVSZXNpemVTY2FsZSA9IHJlc2l6ZVNjYWxlO1xuICAgICAgICB0aGlzLnZhbHVlVGV4dFRyYW5zZm9ybSA9IGBzY2FsZSgke3Jlc2l6ZVNjYWxlfSwgJHtyZXNpemVTY2FsZX0pYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudW5pdHNSZXNpemVTY2FsZSA9IHJlc2l6ZVNjYWxlO1xuICAgICAgICB0aGlzLnVuaXRzVGV4dFRyYW5zZm9ybSA9IGBzY2FsZSgke3Jlc2l6ZVNjYWxlfSwgJHtyZXNpemVTY2FsZX0pYDtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2NhbGVUZXh0KGVsZW1lbnQsIGZhbHNlKTtcbiAgICAgICAgfSwgNTApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3QuZW1pdCh7XG4gICAgICBuYW1lOiAnVmFsdWUnLFxuICAgICAgdmFsdWU6IHRoaXMudmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHNldENvbG9ycygpOiB2b2lkIHtcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgJ29yZGluYWwnLCBbdGhpcy52YWx1ZV0sIHRoaXMuY3VzdG9tQ29sb3JzKTtcbiAgfVxufVxuIl19