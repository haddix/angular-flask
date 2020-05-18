import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { reduceTicks } from './ticks.helper';
var XAxisTicksComponent = /** @class */ (function () {
    function XAxisTicksComponent() {
        this.tickArguments = [5];
        this.tickStroke = '#ccc';
        this.trimTicks = true;
        this.maxTickLength = 16;
        this.showGridLines = false;
        this.rotateTicks = true;
        this.dimensionsChanged = new EventEmitter();
        this.verticalSpacing = 20;
        this.rotateLabels = false;
        this.innerTickSize = 6;
        this.outerTickSize = 6;
        this.tickPadding = 3;
        this.textAnchor = 'middle';
        this.maxTicksLength = 0;
        this.maxAllowedLength = 16;
        this.height = 0;
    }
    XAxisTicksComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    XAxisTicksComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.updateDims(); });
    };
    XAxisTicksComponent.prototype.updateDims = function () {
        var _this = this;
        var height = parseInt(this.ticksElement.nativeElement.getBoundingClientRect().height, 10);
        if (height !== this.height) {
            this.height = height;
            this.dimensionsChanged.emit({ height: height });
            setTimeout(function () { return _this.updateDims(); });
        }
    };
    XAxisTicksComponent.prototype.update = function () {
        var _this = this;
        var scale = this.scale;
        this.ticks = this.getTicks();
        if (this.tickFormatting) {
            this.tickFormat = this.tickFormatting;
        }
        else if (scale.tickFormat) {
            this.tickFormat = scale.tickFormat.apply(scale, this.tickArguments);
        }
        else {
            this.tickFormat = function (d) {
                if (d.constructor.name === 'Date') {
                    return d.toLocaleDateString();
                }
                return d.toLocaleString();
            };
        }
        var angle = this.rotateTicks ? this.getRotationAngle(this.ticks) : null;
        this.adjustedScale = this.scale.bandwidth
            ? function (d) {
                return this.scale(d) + this.scale.bandwidth() * 0.5;
            }
            : this.scale;
        this.textTransform = '';
        if (angle && angle !== 0) {
            this.textTransform = "rotate(" + angle + ")";
            this.textAnchor = 'end';
            this.verticalSpacing = 10;
        }
        else {
            this.textAnchor = 'middle';
        }
        setTimeout(function () { return _this.updateDims(); });
    };
    XAxisTicksComponent.prototype.getRotationAngle = function (ticks) {
        var angle = 0;
        this.maxTicksLength = 0;
        for (var i = 0; i < ticks.length; i++) {
            var tick = this.tickFormat(ticks[i]).toString();
            var tickLength = tick.length;
            if (this.trimTicks) {
                tickLength = this.tickTrim(tick).length;
            }
            if (tickLength > this.maxTicksLength) {
                this.maxTicksLength = tickLength;
            }
        }
        var len = Math.min(this.maxTicksLength, this.maxAllowedLength);
        var charWidth = 8; // need to measure this
        var wordWidth = len * charWidth;
        var baseWidth = wordWidth;
        var maxBaseWidth = Math.floor(this.width / ticks.length);
        // calculate optimal angle
        while (baseWidth > maxBaseWidth && angle > -90) {
            angle -= 30;
            baseWidth = Math.cos(angle * (Math.PI / 180)) * wordWidth;
        }
        return angle;
    };
    XAxisTicksComponent.prototype.getTicks = function () {
        var ticks;
        var maxTicks = this.getMaxTicks(20);
        var maxScaleTicks = this.getMaxTicks(100);
        if (this.tickValues) {
            ticks = this.tickValues;
        }
        else if (this.scale.ticks) {
            ticks = this.scale.ticks.apply(this.scale, [maxScaleTicks]);
        }
        else {
            ticks = this.scale.domain();
            ticks = reduceTicks(ticks, maxTicks);
        }
        return ticks;
    };
    XAxisTicksComponent.prototype.getMaxTicks = function (tickWidth) {
        return Math.floor(this.width / tickWidth);
    };
    XAxisTicksComponent.prototype.tickTransform = function (tick) {
        return 'translate(' + this.adjustedScale(tick) + ',' + this.verticalSpacing + ')';
    };
    XAxisTicksComponent.prototype.gridLineTransform = function () {
        return "translate(0," + (-this.verticalSpacing - 5) + ")";
    };
    XAxisTicksComponent.prototype.tickTrim = function (label) {
        return this.trimTicks ? trimLabel(label, this.maxTickLength) : label;
    };
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "scale", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "orient", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "tickArguments", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "tickValues", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "tickStroke", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "trimTicks", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "maxTickLength", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "tickFormatting", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "showGridLines", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "gridLineHeight", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "width", void 0);
    __decorate([
        Input()
    ], XAxisTicksComponent.prototype, "rotateTicks", void 0);
    __decorate([
        Output()
    ], XAxisTicksComponent.prototype, "dimensionsChanged", void 0);
    __decorate([
        ViewChild('ticksel')
    ], XAxisTicksComponent.prototype, "ticksElement", void 0);
    XAxisTicksComponent = __decorate([
        Component({
            selector: 'g[ngx-charts-x-axis-ticks]',
            template: "\n    <svg:g #ticksel>\n      <svg:g *ngFor=\"let tick of ticks\" class=\"tick\" [attr.transform]=\"tickTransform(tick)\">\n        <title>{{ tickFormat(tick) }}</title>\n        <svg:text\n          stroke-width=\"0.01\"\n          [attr.text-anchor]=\"textAnchor\"\n          [attr.transform]=\"textTransform\"\n          [style.font-size]=\"'12px'\"\n        >\n          {{ tickTrim(tickFormat(tick)) }}\n        </svg:text>\n      </svg:g>\n    </svg:g>\n\n    <svg:g *ngFor=\"let tick of ticks\" [attr.transform]=\"tickTransform(tick)\">\n      <svg:g *ngIf=\"showGridLines\" [attr.transform]=\"gridLineTransform()\">\n        <svg:line class=\"gridline-path gridline-path-vertical\" [attr.y1]=\"-gridLineHeight\" y2=\"0\" />\n      </svg:g>\n    </svg:g>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], XAxisTicksComponent);
    return XAxisTicksComponent;
}());
export { XAxisTicksComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieC1heGlzLXRpY2tzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL2NvbW1vbi9heGVzL3gtYXhpcy10aWNrcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBR1osU0FBUyxFQUdULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBMkI3QztJQUFBO1FBR1csa0JBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLGVBQVUsR0FBRyxNQUFNLENBQUM7UUFDcEIsY0FBUyxHQUFZLElBQUksQ0FBQztRQUMxQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUUzQixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUd0QixnQkFBVyxHQUFZLElBQUksQ0FBQztRQUUzQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBQzdCLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBQzlCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGVBQVUsR0FBVyxRQUFRLENBQUM7UUFDOUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFDM0IscUJBQWdCLEdBQVcsRUFBRSxDQUFDO1FBSzlCLFdBQU0sR0FBVyxDQUFDLENBQUM7SUF5SHJCLENBQUM7SUFySEMseUNBQVcsR0FBWCxVQUFZLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsNkNB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SyxDQUFDO0lBQ3ZFLENBQUM7SUFuSlE7UUFBUixLQUFLLEVBQUU7c0RBQU87SUFDTjtRQUFSLEtBQUssRUFBRTt1REFBUTtJQUNQO1FBQVIsS0FBSyxFQUFFOzhEQUFxQjtJQUNwQjtRQUFSLEtBQUssRUFBRTsyREFBbUI7SUFDbEI7UUFBUixLQUFLLEVBQUU7MkRBQXFCO0lBQ3BCO1FBQVIsS0FBSyxFQUFFOzBEQUEyQjtJQUMxQjtRQUFSLEtBQUssRUFBRTs4REFBNEI7SUFDM0I7UUFBUixLQUFLLEVBQUU7K0RBQWdCO0lBQ2Y7UUFBUixLQUFLLEVBQUU7OERBQXVCO0lBQ3RCO1FBQVIsS0FBSyxFQUFFOytEQUFnQjtJQUNmO1FBQVIsS0FBSyxFQUFFO3NEQUFPO0lBQ047UUFBUixLQUFLLEVBQUU7NERBQTZCO0lBRTNCO1FBQVQsTUFBTSxFQUFFO2tFQUF3QztJQWdCM0I7UUFBckIsU0FBUyxDQUFDLFNBQVMsQ0FBQzs2REFBMEI7SUE5QnBDLG1CQUFtQjtRQXpCL0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDRCQUE0QjtZQUN0QyxRQUFRLEVBQUUsK3ZCQW9CVDtZQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7T0FDVyxtQkFBbUIsQ0FxSi9CO0lBQUQsMEJBQUM7Q0FBQSxBQXJKRCxJQXFKQztTQXJKWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25DaGFuZ2VzLFxuICBFbGVtZW50UmVmLFxuICBWaWV3Q2hpbGQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdHJpbUxhYmVsIH0gZnJvbSAnLi4vdHJpbS1sYWJlbC5oZWxwZXInO1xuaW1wb3J0IHsgcmVkdWNlVGlja3MgfSBmcm9tICcuL3RpY2tzLmhlbHBlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy14LWF4aXMtdGlja3NdJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3ZnOmcgI3RpY2tzZWw+XG4gICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHRpY2sgb2YgdGlja3NcIiBjbGFzcz1cInRpY2tcIiBbYXR0ci50cmFuc2Zvcm1dPVwidGlja1RyYW5zZm9ybSh0aWNrKVwiPlxuICAgICAgICA8dGl0bGU+e3sgdGlja0Zvcm1hdCh0aWNrKSB9fTwvdGl0bGU+XG4gICAgICAgIDxzdmc6dGV4dFxuICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjAuMDFcIlxuICAgICAgICAgIFthdHRyLnRleHQtYW5jaG9yXT1cInRleHRBbmNob3JcIlxuICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0ZXh0VHJhbnNmb3JtXCJcbiAgICAgICAgICBbc3R5bGUuZm9udC1zaXplXT1cIicxMnB4J1wiXG4gICAgICAgID5cbiAgICAgICAgICB7eyB0aWNrVHJpbSh0aWNrRm9ybWF0KHRpY2spKSB9fVxuICAgICAgICA8L3N2Zzp0ZXh0PlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuXG4gICAgPHN2ZzpnICpuZ0Zvcj1cImxldCB0aWNrIG9mIHRpY2tzXCIgW2F0dHIudHJhbnNmb3JtXT1cInRpY2tUcmFuc2Zvcm0odGljaylcIj5cbiAgICAgIDxzdmc6ZyAqbmdJZj1cInNob3dHcmlkTGluZXNcIiBbYXR0ci50cmFuc2Zvcm1dPVwiZ3JpZExpbmVUcmFuc2Zvcm0oKVwiPlxuICAgICAgICA8c3ZnOmxpbmUgY2xhc3M9XCJncmlkbGluZS1wYXRoIGdyaWRsaW5lLXBhdGgtdmVydGljYWxcIiBbYXR0ci55MV09XCItZ3JpZExpbmVIZWlnaHRcIiB5Mj1cIjBcIiAvPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2ZzpnPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBYQXhpc1RpY2tzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgc2NhbGU7XG4gIEBJbnB1dCgpIG9yaWVudDtcbiAgQElucHV0KCkgdGlja0FyZ3VtZW50cyA9IFs1XTtcbiAgQElucHV0KCkgdGlja1ZhbHVlczogYW55W107XG4gIEBJbnB1dCgpIHRpY2tTdHJva2UgPSAnI2NjYyc7XG4gIEBJbnB1dCgpIHRyaW1UaWNrczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIG1heFRpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xuICBASW5wdXQoKSB0aWNrRm9ybWF0dGluZztcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lcyA9IGZhbHNlO1xuICBASW5wdXQoKSBncmlkTGluZUhlaWdodDtcbiAgQElucHV0KCkgd2lkdGg7XG4gIEBJbnB1dCgpIHJvdGF0ZVRpY2tzOiBib29sZWFuID0gdHJ1ZTtcblxuICBAT3V0cHV0KCkgZGltZW5zaW9uc0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgdmVydGljYWxTcGFjaW5nOiBudW1iZXIgPSAyMDtcbiAgcm90YXRlTGFiZWxzOiBib29sZWFuID0gZmFsc2U7XG4gIGlubmVyVGlja1NpemU6IG51bWJlciA9IDY7XG4gIG91dGVyVGlja1NpemU6IG51bWJlciA9IDY7XG4gIHRpY2tQYWRkaW5nOiBudW1iZXIgPSAzO1xuICB0ZXh0QW5jaG9yOiBzdHJpbmcgPSAnbWlkZGxlJztcbiAgbWF4VGlja3NMZW5ndGg6IG51bWJlciA9IDA7XG4gIG1heEFsbG93ZWRMZW5ndGg6IG51bWJlciA9IDE2O1xuICBhZGp1c3RlZFNjYWxlOiBhbnk7XG4gIHRleHRUcmFuc2Zvcm06IGFueTtcbiAgdGlja3M6IGFueTtcbiAgdGlja0Zvcm1hdDogKG86IGFueSkgPT4gYW55O1xuICBoZWlnaHQ6IG51bWJlciA9IDA7XG5cbiAgQFZpZXdDaGlsZCgndGlja3NlbCcpIHRpY2tzRWxlbWVudDogRWxlbWVudFJlZjtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcbiAgfVxuXG4gIHVwZGF0ZURpbXMoKTogdm9pZCB7XG4gICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VJbnQodGhpcy50aWNrc0VsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsIDEwKTtcbiAgICBpZiAoaGVpZ2h0ICE9PSB0aGlzLmhlaWdodCkge1xuICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICB0aGlzLmRpbWVuc2lvbnNDaGFuZ2VkLmVtaXQoeyBoZWlnaHQgfSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnNjYWxlO1xuICAgIHRoaXMudGlja3MgPSB0aGlzLmdldFRpY2tzKCk7XG5cbiAgICBpZiAodGhpcy50aWNrRm9ybWF0dGluZykge1xuICAgICAgdGhpcy50aWNrRm9ybWF0ID0gdGhpcy50aWNrRm9ybWF0dGluZztcbiAgICB9IGVsc2UgaWYgKHNjYWxlLnRpY2tGb3JtYXQpIHtcbiAgICAgIHRoaXMudGlja0Zvcm1hdCA9IHNjYWxlLnRpY2tGb3JtYXQuYXBwbHkoc2NhbGUsIHRoaXMudGlja0FyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGlja0Zvcm1hdCA9IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIGlmIChkLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdEYXRlJykge1xuICAgICAgICAgIHJldHVybiBkLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5yb3RhdGVUaWNrcyA/IHRoaXMuZ2V0Um90YXRpb25BbmdsZSh0aGlzLnRpY2tzKSA6IG51bGw7XG5cbiAgICB0aGlzLmFkanVzdGVkU2NhbGUgPSB0aGlzLnNjYWxlLmJhbmR3aWR0aFxuICAgICAgPyBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNjYWxlKGQpICsgdGhpcy5zY2FsZS5iYW5kd2lkdGgoKSAqIDAuNTtcbiAgICAgICAgfVxuICAgICAgOiB0aGlzLnNjYWxlO1xuXG4gICAgdGhpcy50ZXh0VHJhbnNmb3JtID0gJyc7XG4gICAgaWYgKGFuZ2xlICYmIGFuZ2xlICE9PSAwKSB7XG4gICAgICB0aGlzLnRleHRUcmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9KWA7XG4gICAgICB0aGlzLnRleHRBbmNob3IgPSAnZW5kJztcbiAgICAgIHRoaXMudmVydGljYWxTcGFjaW5nID0gMTA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGV4dEFuY2hvciA9ICdtaWRkbGUnO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVEaW1zKCkpO1xuICB9XG5cbiAgZ2V0Um90YXRpb25BbmdsZSh0aWNrcyk6IG51bWJlciB7XG4gICAgbGV0IGFuZ2xlID0gMDtcbiAgICB0aGlzLm1heFRpY2tzTGVuZ3RoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB0aWNrID0gdGhpcy50aWNrRm9ybWF0KHRpY2tzW2ldKS50b1N0cmluZygpO1xuICAgICAgbGV0IHRpY2tMZW5ndGggPSB0aWNrLmxlbmd0aDtcbiAgICAgIGlmICh0aGlzLnRyaW1UaWNrcykge1xuICAgICAgICB0aWNrTGVuZ3RoID0gdGhpcy50aWNrVHJpbSh0aWNrKS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aWNrTGVuZ3RoID4gdGhpcy5tYXhUaWNrc0xlbmd0aCkge1xuICAgICAgICB0aGlzLm1heFRpY2tzTGVuZ3RoID0gdGlja0xlbmd0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBsZW4gPSBNYXRoLm1pbih0aGlzLm1heFRpY2tzTGVuZ3RoLCB0aGlzLm1heEFsbG93ZWRMZW5ndGgpO1xuICAgIGNvbnN0IGNoYXJXaWR0aCA9IDg7IC8vIG5lZWQgdG8gbWVhc3VyZSB0aGlzXG4gICAgY29uc3Qgd29yZFdpZHRoID0gbGVuICogY2hhcldpZHRoO1xuXG4gICAgbGV0IGJhc2VXaWR0aCA9IHdvcmRXaWR0aDtcbiAgICBjb25zdCBtYXhCYXNlV2lkdGggPSBNYXRoLmZsb29yKHRoaXMud2lkdGggLyB0aWNrcy5sZW5ndGgpO1xuXG4gICAgLy8gY2FsY3VsYXRlIG9wdGltYWwgYW5nbGVcbiAgICB3aGlsZSAoYmFzZVdpZHRoID4gbWF4QmFzZVdpZHRoICYmIGFuZ2xlID4gLTkwKSB7XG4gICAgICBhbmdsZSAtPSAzMDtcbiAgICAgIGJhc2VXaWR0aCA9IE1hdGguY29zKGFuZ2xlICogKE1hdGguUEkgLyAxODApKSAqIHdvcmRXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gYW5nbGU7XG4gIH1cblxuICBnZXRUaWNrcygpIHtcbiAgICBsZXQgdGlja3M7XG4gICAgY29uc3QgbWF4VGlja3MgPSB0aGlzLmdldE1heFRpY2tzKDIwKTtcbiAgICBjb25zdCBtYXhTY2FsZVRpY2tzID0gdGhpcy5nZXRNYXhUaWNrcygxMDApO1xuXG4gICAgaWYgKHRoaXMudGlja1ZhbHVlcykge1xuICAgICAgdGlja3MgPSB0aGlzLnRpY2tWYWx1ZXM7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlLnRpY2tzKSB7XG4gICAgICB0aWNrcyA9IHRoaXMuc2NhbGUudGlja3MuYXBwbHkodGhpcy5zY2FsZSwgW21heFNjYWxlVGlja3NdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGlja3MgPSB0aGlzLnNjYWxlLmRvbWFpbigpO1xuICAgICAgdGlja3MgPSByZWR1Y2VUaWNrcyh0aWNrcywgbWF4VGlja3MpO1xuICAgIH1cblxuICAgIHJldHVybiB0aWNrcztcbiAgfVxuXG4gIGdldE1heFRpY2tzKHRpY2tXaWR0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLndpZHRoIC8gdGlja1dpZHRoKTtcbiAgfVxuXG4gIHRpY2tUcmFuc2Zvcm0odGljayk6IHN0cmluZyB7XG4gICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHRoaXMuYWRqdXN0ZWRTY2FsZSh0aWNrKSArICcsJyArIHRoaXMudmVydGljYWxTcGFjaW5nICsgJyknO1xuICB9XG5cbiAgZ3JpZExpbmVUcmFuc2Zvcm0oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYHRyYW5zbGF0ZSgwLCR7LXRoaXMudmVydGljYWxTcGFjaW5nIC0gNX0pYDtcbiAgfVxuXG4gIHRpY2tUcmltKGxhYmVsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRyaW1UaWNrcyA/IHRyaW1MYWJlbChsYWJlbCwgdGhpcy5tYXhUaWNrTGVuZ3RoKSA6IGxhYmVsO1xuICB9XG59XG4iXX0=