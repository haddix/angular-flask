import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ElementRef, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { interpolate } from 'd3-interpolate';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';
import { id } from '../utils/id';
var PieArcComponent = /** @class */ (function () {
    function PieArcComponent(element) {
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.cornerRadius = 0;
        this.explodeSlices = false;
        this.gradient = false;
        this.animate = true;
        this.pointerEvents = true;
        this.isActive = false;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.dblclick = new EventEmitter();
        this.initialized = false;
        this.element = element.nativeElement;
    }
    PieArcComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    PieArcComponent.prototype.getGradient = function () {
        return this.gradient ? this.gradientFill : this.fill;
    };
    PieArcComponent.prototype.getPointerEvents = function () {
        return this.pointerEvents ? 'auto' : 'none';
    };
    PieArcComponent.prototype.update = function () {
        var calc = this.calculateArc();
        this.startOpacity = 0.5;
        this.radialGradientId = 'linearGrad' + id().toString();
        this.gradientFill = "url(#" + this.radialGradientId + ")";
        if (this.animate) {
            if (this.initialized) {
                this.updateAnimation();
            }
            else {
                this.loadAnimation();
                this.initialized = true;
            }
        }
        else {
            this.path = calc.startAngle(this.startAngle).endAngle(this.endAngle)();
        }
    };
    PieArcComponent.prototype.calculateArc = function () {
        var outerRadius = this.outerRadius;
        if (this.explodeSlices && this.innerRadius === 0) {
            outerRadius = (this.outerRadius * this.value) / this.max;
        }
        return arc().innerRadius(this.innerRadius).outerRadius(outerRadius).cornerRadius(this.cornerRadius);
    };
    PieArcComponent.prototype.loadAnimation = function () {
        var node = select(this.element)
            .selectAll('.arc')
            .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);
        var calc = this.calculateArc();
        node
            .transition()
            .attrTween('d', function (d) {
            this._current = this._current || d;
            var copyOfD = Object.assign({}, d);
            copyOfD.endAngle = copyOfD.startAngle;
            var interpolater = interpolate(copyOfD, copyOfD);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        })
            .transition()
            .duration(750)
            .attrTween('d', function (d) {
            this._current = this._current || d;
            var interpolater = interpolate(this._current, d);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        });
    };
    PieArcComponent.prototype.updateAnimation = function () {
        var node = select(this.element)
            .selectAll('.arc')
            .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);
        var calc = this.calculateArc();
        node
            .transition()
            .duration(750)
            .attrTween('d', function (d) {
            this._current = this._current || d;
            var interpolater = interpolate(this._current, d);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        });
    };
    PieArcComponent.prototype.onClick = function () {
        var _this = this;
        clearTimeout(this._timeout);
        this._timeout = setTimeout(function () { return _this.select.emit(_this.data); }, 200);
    };
    PieArcComponent.prototype.onDblClick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(this._timeout);
        this.dblclick.emit({
            data: this.data,
            nativeEvent: event
        });
    };
    PieArcComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], PieArcComponent.prototype, "fill", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "startAngle", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "endAngle", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "innerRadius", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "outerRadius", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "cornerRadius", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "value", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "max", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "data", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "explodeSlices", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "gradient", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "animate", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "pointerEvents", void 0);
    __decorate([
        Input()
    ], PieArcComponent.prototype, "isActive", void 0);
    __decorate([
        Output()
    ], PieArcComponent.prototype, "select", void 0);
    __decorate([
        Output()
    ], PieArcComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], PieArcComponent.prototype, "deactivate", void 0);
    __decorate([
        Output()
    ], PieArcComponent.prototype, "dblclick", void 0);
    PieArcComponent = __decorate([
        Component({
            selector: 'g[ngx-charts-pie-arc]',
            template: "\n    <svg:g class=\"arc-group\">\n      <svg:defs *ngIf=\"gradient\">\n        <svg:g\n          ngx-charts-svg-radial-gradient\n          [color]=\"fill\"\n          orientation=\"vertical\"\n          [name]=\"radialGradientId\"\n          [startOpacity]=\"startOpacity\"\n        />\n      </svg:defs>\n      <svg:path\n        [attr.d]=\"path\"\n        class=\"arc\"\n        [class.active]=\"isActive\"\n        [attr.fill]=\"getGradient()\"\n        (click)=\"onClick()\"\n        (dblclick)=\"onDblClick($event)\"\n        (mouseenter)=\"activate.emit(data)\"\n        (mouseleave)=\"deactivate.emit(data)\"\n        [style.pointer-events]=\"getPointerEvents()\"\n      />\n    </svg:g>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], PieArcComponent);
    return PieArcComponent;
}());
export { PieArcComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWFyYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9waWUtY2hhcnQvcGllLWFyYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLGFBQWEsRUFDYixTQUFTLEVBQ1QsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFL0IsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQWdDakM7SUE4QkUseUJBQVksT0FBbUI7UUE1QnRCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsYUFBUSxHQUFXLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRy9CLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBSXpCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsWUFBTyxHQUFZLElBQUksQ0FBQztRQUN4QixrQkFBYSxHQUFZLElBQUksQ0FBQztRQUM5QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBRXpCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzVCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBUXhDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBSTNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFD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QUU7cURBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFO29EQUF5QjtJQUN4QjtRQUFSLEtBQUssRUFBRTswREFBK0I7SUFDOUI7UUFBUixLQUFLLEVBQUU7cURBQTJCO0lBRXpCO1FBQVQsTUFBTSxFQUFFO21EQUE2QjtJQUM1QjtRQUFULE1BQU0sRUFBRTtxREFBK0I7SUFDOUI7UUFBVCxNQUFNLEVBQUU7dURBQWlDO0lBQ2hDO1FBQVQsTUFBTSxFQUFFO3FEQUErQjtJQW5CN0IsZUFBZTtRQTVCM0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxRQUFRLEVBQUUsNnJCQXVCVDtZQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7T0FDVyxlQUFlLENBMkkzQjtJQUFELHNCQUFDO0NBQUEsQUEzSUQsSUEySUM7U0EzSVksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPbkNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaW50ZXJwb2xhdGUgfSBmcm9tICdkMy1pbnRlcnBvbGF0ZSc7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgYXJjIH0gZnJvbSAnZDMtc2hhcGUnO1xuXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcbi8qIHRzbGludDpkaXNhYmxlICovXG5pbXBvcnQgeyBNb3VzZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnRzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXBpZS1hcmNdJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3ZnOmcgY2xhc3M9XCJhcmMtZ3JvdXBcIj5cbiAgICAgIDxzdmc6ZGVmcyAqbmdJZj1cImdyYWRpZW50XCI+XG4gICAgICAgIDxzdmc6Z1xuICAgICAgICAgIG5neC1jaGFydHMtc3ZnLXJhZGlhbC1ncmFkaWVudFxuICAgICAgICAgIFtjb2xvcl09XCJmaWxsXCJcbiAgICAgICAgICBvcmllbnRhdGlvbj1cInZlcnRpY2FsXCJcbiAgICAgICAgICBbbmFtZV09XCJyYWRpYWxHcmFkaWVudElkXCJcbiAgICAgICAgICBbc3RhcnRPcGFjaXR5XT1cInN0YXJ0T3BhY2l0eVwiXG4gICAgICAgIC8+XG4gICAgICA8L3N2ZzpkZWZzPlxuICAgICAgPHN2ZzpwYXRoXG4gICAgICAgIFthdHRyLmRdPVwicGF0aFwiXG4gICAgICAgIGNsYXNzPVwiYXJjXCJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZVwiXG4gICAgICAgIFthdHRyLmZpbGxdPVwiZ2V0R3JhZGllbnQoKVwiXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKClcIlxuICAgICAgICAoZGJsY2xpY2spPVwib25EYmxDbGljaygkZXZlbnQpXCJcbiAgICAgICAgKG1vdXNlZW50ZXIpPVwiYWN0aXZhdGUuZW1pdChkYXRhKVwiXG4gICAgICAgIChtb3VzZWxlYXZlKT1cImRlYWN0aXZhdGUuZW1pdChkYXRhKVwiXG4gICAgICAgIFtzdHlsZS5wb2ludGVyLWV2ZW50c109XCJnZXRQb2ludGVyRXZlbnRzKClcIlxuICAgICAgLz5cbiAgICA8L3N2ZzpnPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQaWVBcmNDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBmaWxsO1xuICBASW5wdXQoKSBzdGFydEFuZ2xlOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSBlbmRBbmdsZTogbnVtYmVyID0gTWF0aC5QSSAqIDI7XG4gIEBJbnB1dCgpIGlubmVyUmFkaXVzO1xuICBASW5wdXQoKSBvdXRlclJhZGl1cztcbiAgQElucHV0KCkgY29ybmVyUmFkaXVzOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSB2YWx1ZTtcbiAgQElucHV0KCkgbWF4O1xuICBASW5wdXQoKSBkYXRhO1xuICBASW5wdXQoKSBleHBsb2RlU2xpY2VzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGdyYWRpZW50OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGFuaW1hdGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBwb2ludGVyRXZlbnRzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGJsY2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHBhdGg6IGFueTtcbiAgc3RhcnRPcGFjaXR5OiBudW1iZXI7XG4gIHJhZGlhbEdyYWRpZW50SWQ6IHN0cmluZztcbiAgbGluZWFyR3JhZGllbnRJZDogc3RyaW5nO1xuICBncmFkaWVudEZpbGw6IHN0cmluZztcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfdGltZW91dDtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBnZXRHcmFkaWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFkaWVudCA/IHRoaXMuZ3JhZGllbnRGaWxsIDogdGhpcy5maWxsO1xuICB9XG5cbiAgZ2V0UG9pbnRlckV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludGVyRXZlbnRzID8gJ2F1dG8nIDogJ25vbmUnO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbGMgPSB0aGlzLmNhbGN1bGF0ZUFyYygpO1xuICAgIHRoaXMuc3RhcnRPcGFjaXR5ID0gMC41O1xuICAgIHRoaXMucmFkaWFsR3JhZGllbnRJZCA9ICdsaW5lYXJHcmFkJyArIGlkKCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmdyYWRpZW50RmlsbCA9IGB1cmwoIyR7dGhpcy5yYWRpYWxHcmFkaWVudElkfSlgO1xuXG4gICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9hZEFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXRoID0gY2FsYy5zdGFydEFuZ2xlKHRoaXMuc3RhcnRBbmdsZSkuZW5kQW5nbGUodGhpcy5lbmRBbmdsZSkoKTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVBcmMoKTogYW55IHtcbiAgICBsZXQgb3V0ZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzO1xuICAgIGlmICh0aGlzLmV4cGxvZGVTbGljZXMgJiYgdGhpcy5pbm5lclJhZGl1cyA9PT0gMCkge1xuICAgICAgb3V0ZXJSYWRpdXMgPSAodGhpcy5vdXRlclJhZGl1cyAqIHRoaXMudmFsdWUpIC8gdGhpcy5tYXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyYygpLmlubmVyUmFkaXVzKHRoaXMuaW5uZXJSYWRpdXMpLm91dGVyUmFkaXVzKG91dGVyUmFkaXVzKS5jb3JuZXJSYWRpdXModGhpcy5jb3JuZXJSYWRpdXMpO1xuICB9XG5cbiAgbG9hZEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudClcbiAgICAgIC5zZWxlY3RBbGwoJy5hcmMnKVxuICAgICAgLmRhdGEoW3sgc3RhcnRBbmdsZTogdGhpcy5zdGFydEFuZ2xlLCBlbmRBbmdsZTogdGhpcy5lbmRBbmdsZSB9XSk7XG5cbiAgICBjb25zdCBjYWxjID0gdGhpcy5jYWxjdWxhdGVBcmMoKTtcblxuICAgIG5vZGVcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5hdHRyVHdlZW4oJ2QnLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAoPGFueT50aGlzKS5fY3VycmVudCA9ICg8YW55PnRoaXMpLl9jdXJyZW50IHx8IGQ7XG4gICAgICAgIGNvbnN0IGNvcHlPZkQgPSBPYmplY3QuYXNzaWduKHt9LCBkKTtcbiAgICAgICAgY29weU9mRC5lbmRBbmdsZSA9IGNvcHlPZkQuc3RhcnRBbmdsZTtcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVyID0gaW50ZXJwb2xhdGUoY29weU9mRCwgY29weU9mRCk7XG4gICAgICAgICg8YW55PnRoaXMpLl9jdXJyZW50ID0gaW50ZXJwb2xhdGVyKDApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gY2FsYyhpbnRlcnBvbGF0ZXIodCkpO1xuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbig3NTApXG4gICAgICAuYXR0clR3ZWVuKCdkJywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgKDxhbnk+dGhpcykuX2N1cnJlbnQgPSAoPGFueT50aGlzKS5fY3VycmVudCB8fCBkO1xuICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZXIgPSBpbnRlcnBvbGF0ZSgoPGFueT50aGlzKS5fY3VycmVudCwgZCk7XG4gICAgICAgICg8YW55PnRoaXMpLl9jdXJyZW50ID0gaW50ZXJwb2xhdGVyKDApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gY2FsYyhpbnRlcnBvbGF0ZXIodCkpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH1cblxuICB1cGRhdGVBbmltYXRpb24oKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZSA9IHNlbGVjdCh0aGlzLmVsZW1lbnQpXG4gICAgICAuc2VsZWN0QWxsKCcuYXJjJylcbiAgICAgIC5kYXRhKFt7IHN0YXJ0QW5nbGU6IHRoaXMuc3RhcnRBbmdsZSwgZW5kQW5nbGU6IHRoaXMuZW5kQW5nbGUgfV0pO1xuXG4gICAgY29uc3QgY2FsYyA9IHRoaXMuY2FsY3VsYXRlQXJjKCk7XG5cbiAgICBub2RlXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgLmF0dHJUd2VlbignZCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICg8YW55PnRoaXMpLl9jdXJyZW50ID0gKDxhbnk+dGhpcykuX2N1cnJlbnQgfHwgZDtcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVyID0gaW50ZXJwb2xhdGUoKDxhbnk+dGhpcykuX2N1cnJlbnQsIGQpO1xuICAgICAgICAoPGFueT50aGlzKS5fY3VycmVudCA9IGludGVycG9sYXRlcigwKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGMoaW50ZXJwb2xhdGVyKHQpKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb25DbGljaygpOiB2b2lkIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCk7XG4gICAgdGhpcy5fdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZWxlY3QuZW1pdCh0aGlzLmRhdGEpLCAyMDApO1xuICB9XG5cbiAgb25EYmxDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXQpO1xuXG4gICAgdGhpcy5kYmxjbGljay5lbWl0KHtcbiAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgIG5hdGl2ZUV2ZW50OiBldmVudFxuICAgIH0pO1xuICB9XG59XG4iXX0=