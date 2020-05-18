import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ElementRef, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { interpolate } from 'd3-interpolate';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';
import { id } from '../utils/id';
let PieArcComponent = class PieArcComponent {
    constructor(element) {
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
    ngOnChanges(changes) {
        this.update();
    }
    getGradient() {
        return this.gradient ? this.gradientFill : this.fill;
    }
    getPointerEvents() {
        return this.pointerEvents ? 'auto' : 'none';
    }
    update() {
        const calc = this.calculateArc();
        this.startOpacity = 0.5;
        this.radialGradientId = 'linearGrad' + id().toString();
        this.gradientFill = `url(#${this.radialGradientId})`;
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
    }
    calculateArc() {
        let outerRadius = this.outerRadius;
        if (this.explodeSlices && this.innerRadius === 0) {
            outerRadius = (this.outerRadius * this.value) / this.max;
        }
        return arc().innerRadius(this.innerRadius).outerRadius(outerRadius).cornerRadius(this.cornerRadius);
    }
    loadAnimation() {
        const node = select(this.element)
            .selectAll('.arc')
            .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);
        const calc = this.calculateArc();
        node
            .transition()
            .attrTween('d', function (d) {
            this._current = this._current || d;
            const copyOfD = Object.assign({}, d);
            copyOfD.endAngle = copyOfD.startAngle;
            const interpolater = interpolate(copyOfD, copyOfD);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        })
            .transition()
            .duration(750)
            .attrTween('d', function (d) {
            this._current = this._current || d;
            const interpolater = interpolate(this._current, d);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        });
    }
    updateAnimation() {
        const node = select(this.element)
            .selectAll('.arc')
            .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);
        const calc = this.calculateArc();
        node
            .transition()
            .duration(750)
            .attrTween('d', function (d) {
            this._current = this._current || d;
            const interpolater = interpolate(this._current, d);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        });
    }
    onClick() {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => this.select.emit(this.data), 200);
    }
    onDblClick(event) {
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(this._timeout);
        this.dblclick.emit({
            data: this.data,
            nativeEvent: event
        });
    }
};
PieArcComponent.ctorParameters = () => [
    { type: ElementRef }
];
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
        template: `
    <svg:g class="arc-group">
      <svg:defs *ngIf="gradient">
        <svg:g
          ngx-charts-svg-radial-gradient
          [color]="fill"
          orientation="vertical"
          [name]="radialGradientId"
          [startOpacity]="startOpacity"
        />
      </svg:defs>
      <svg:path
        [attr.d]="path"
        class="arc"
        [class.active]="isActive"
        [attr.fill]="getGradient()"
        (click)="onClick()"
        (dblclick)="onDblClick($event)"
        (mouseenter)="activate.emit(data)"
        (mouseleave)="deactivate.emit(data)"
        [style.pointer-events]="getPointerEvents()"
      />
    </svg:g>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], PieArcComponent);
export { PieArcComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWFyYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9waWUtY2hhcnQvcGllLWFyYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLGFBQWEsRUFDYixTQUFTLEVBQ1QsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFL0IsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQWdDakMsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZTtJQThCMUIsWUFBWSxPQUFtQjtRQTVCdEIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixhQUFRLEdBQVcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFHL0IsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFJekIsa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFDL0IsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixZQUFPLEdBQVksSUFBSSxDQUFDO1FBQ3hCLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBQzlCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFFekIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFReEMsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFJM0IsSUFB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O0FBQ3hCO0lBQVIsS0FBSyxFQUFFO3NEQUErQjtBQUM5QjtJQUFSLEtBQUssRUFBRTtpREFBMkI7QUFFekI7SUFBVCxNQUFNLEVBQUU7K0NBQTZCO0FBQzVCO0lBQVQsTUFBTSxFQUFFO2lEQUErQjtBQUM5QjtJQUFULE1BQU0sRUFBRTttREFBaUM7QUFDaEM7SUFBVCxNQUFNLEVBQUU7aURBQStCO0FBbkI3QixlQUFlO0lBNUIzQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1QlQ7UUFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtLQUNoRCxDQUFDO0dBQ1csZUFBZSxDQTJJM0I7U0EzSVksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPbkNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaW50ZXJwb2xhdGUgfSBmcm9tICdkMy1pbnRlcnBvbGF0ZSc7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgYXJjIH0gZnJvbSAnZDMtc2hhcGUnO1xuXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcbi8qIHRzbGludDpkaXNhYmxlICovXG5pbXBvcnQgeyBNb3VzZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnRzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXBpZS1hcmNdJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3ZnOmcgY2xhc3M9XCJhcmMtZ3JvdXBcIj5cbiAgICAgIDxzdmc6ZGVmcyAqbmdJZj1cImdyYWRpZW50XCI+XG4gICAgICAgIDxzdmc6Z1xuICAgICAgICAgIG5neC1jaGFydHMtc3ZnLXJhZGlhbC1ncmFkaWVudFxuICAgICAgICAgIFtjb2xvcl09XCJmaWxsXCJcbiAgICAgICAgICBvcmllbnRhdGlvbj1cInZlcnRpY2FsXCJcbiAgICAgICAgICBbbmFtZV09XCJyYWRpYWxHcmFkaWVudElkXCJcbiAgICAgICAgICBbc3RhcnRPcGFjaXR5XT1cInN0YXJ0T3BhY2l0eVwiXG4gICAgICAgIC8+XG4gICAgICA8L3N2ZzpkZWZzPlxuICAgICAgPHN2ZzpwYXRoXG4gICAgICAgIFthdHRyLmRdPVwicGF0aFwiXG4gICAgICAgIGNsYXNzPVwiYXJjXCJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZVwiXG4gICAgICAgIFthdHRyLmZpbGxdPVwiZ2V0R3JhZGllbnQoKVwiXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKClcIlxuICAgICAgICAoZGJsY2xpY2spPVwib25EYmxDbGljaygkZXZlbnQpXCJcbiAgICAgICAgKG1vdXNlZW50ZXIpPVwiYWN0aXZhdGUuZW1pdChkYXRhKVwiXG4gICAgICAgIChtb3VzZWxlYXZlKT1cImRlYWN0aXZhdGUuZW1pdChkYXRhKVwiXG4gICAgICAgIFtzdHlsZS5wb2ludGVyLWV2ZW50c109XCJnZXRQb2ludGVyRXZlbnRzKClcIlxuICAgICAgLz5cbiAgICA8L3N2ZzpnPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQaWVBcmNDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBmaWxsO1xuICBASW5wdXQoKSBzdGFydEFuZ2xlOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSBlbmRBbmdsZTogbnVtYmVyID0gTWF0aC5QSSAqIDI7XG4gIEBJbnB1dCgpIGlubmVyUmFkaXVzO1xuICBASW5wdXQoKSBvdXRlclJhZGl1cztcbiAgQElucHV0KCkgY29ybmVyUmFkaXVzOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSB2YWx1ZTtcbiAgQElucHV0KCkgbWF4O1xuICBASW5wdXQoKSBkYXRhO1xuICBASW5wdXQoKSBleHBsb2RlU2xpY2VzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGdyYWRpZW50OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGFuaW1hdGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBwb2ludGVyRXZlbnRzOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGJsY2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHBhdGg6IGFueTtcbiAgc3RhcnRPcGFjaXR5OiBudW1iZXI7XG4gIHJhZGlhbEdyYWRpZW50SWQ6IHN0cmluZztcbiAgbGluZWFyR3JhZGllbnRJZDogc3RyaW5nO1xuICBncmFkaWVudEZpbGw6IHN0cmluZztcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfdGltZW91dDtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBnZXRHcmFkaWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFkaWVudCA/IHRoaXMuZ3JhZGllbnRGaWxsIDogdGhpcy5maWxsO1xuICB9XG5cbiAgZ2V0UG9pbnRlckV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludGVyRXZlbnRzID8gJ2F1dG8nIDogJ25vbmUnO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbGMgPSB0aGlzLmNhbGN1bGF0ZUFyYygpO1xuICAgIHRoaXMuc3RhcnRPcGFjaXR5ID0gMC41O1xuICAgIHRoaXMucmFkaWFsR3JhZGllbnRJZCA9ICdsaW5lYXJHcmFkJyArIGlkKCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmdyYWRpZW50RmlsbCA9IGB1cmwoIyR7dGhpcy5yYWRpYWxHcmFkaWVudElkfSlgO1xuXG4gICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVBbmltYXRpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9hZEFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXRoID0gY2FsYy5zdGFydEFuZ2xlKHRoaXMuc3RhcnRBbmdsZSkuZW5kQW5nbGUodGhpcy5lbmRBbmdsZSkoKTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVBcmMoKTogYW55IHtcbiAgICBsZXQgb3V0ZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzO1xuICAgIGlmICh0aGlzLmV4cGxvZGVTbGljZXMgJiYgdGhpcy5pbm5lclJhZGl1cyA9PT0gMCkge1xuICAgICAgb3V0ZXJSYWRpdXMgPSAodGhpcy5vdXRlclJhZGl1cyAqIHRoaXMudmFsdWUpIC8gdGhpcy5tYXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyYygpLmlubmVyUmFkaXVzKHRoaXMuaW5uZXJSYWRpdXMpLm91dGVyUmFkaXVzKG91dGVyUmFkaXVzKS5jb3JuZXJSYWRpdXModGhpcy5jb3JuZXJSYWRpdXMpO1xuICB9XG5cbiAgbG9hZEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudClcbiAgICAgIC5zZWxlY3RBbGwoJy5hcmMnKVxuICAgICAgLmRhdGEoW3sgc3RhcnRBbmdsZTogdGhpcy5zdGFydEFuZ2xlLCBlbmRBbmdsZTogdGhpcy5lbmRBbmdsZSB9XSk7XG5cbiAgICBjb25zdCBjYWxjID0gdGhpcy5jYWxjdWxhdGVBcmMoKTtcblxuICAgIG5vZGVcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5hdHRyVHdlZW4oJ2QnLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAoPGFueT50aGlzKS5fY3VycmVudCA9ICg8YW55PnRoaXMpLl9jdXJyZW50IHx8IGQ7XG4gICAgICAgIGNvbnN0IGNvcHlPZkQgPSBPYmplY3QuYXNzaWduKHt9LCBkKTtcbiAgICAgICAgY29weU9mRC5lbmRBbmdsZSA9IGNvcHlPZkQuc3RhcnRBbmdsZTtcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVyID0gaW50ZXJwb2xhdGUoY29weU9mRCwgY29weU9mRCk7XG4gICAgICAgICg8YW55PnRoaXMpLl9jdXJyZW50ID0gaW50ZXJwb2xhdGVyKDApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gY2FsYyhpbnRlcnBvbGF0ZXIodCkpO1xuICAgICAgICB9O1xuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbig3NTApXG4gICAgICAuYXR0clR3ZWVuKCdkJywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgKDxhbnk+dGhpcykuX2N1cnJlbnQgPSAoPGFueT50aGlzKS5fY3VycmVudCB8fCBkO1xuICAgICAgICBjb25zdCBpbnRlcnBvbGF0ZXIgPSBpbnRlcnBvbGF0ZSgoPGFueT50aGlzKS5fY3VycmVudCwgZCk7XG4gICAgICAgICg8YW55PnRoaXMpLl9jdXJyZW50ID0gaW50ZXJwb2xhdGVyKDApO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gY2FsYyhpbnRlcnBvbGF0ZXIodCkpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH1cblxuICB1cGRhdGVBbmltYXRpb24oKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZSA9IHNlbGVjdCh0aGlzLmVsZW1lbnQpXG4gICAgICAuc2VsZWN0QWxsKCcuYXJjJylcbiAgICAgIC5kYXRhKFt7IHN0YXJ0QW5nbGU6IHRoaXMuc3RhcnRBbmdsZSwgZW5kQW5nbGU6IHRoaXMuZW5kQW5nbGUgfV0pO1xuXG4gICAgY29uc3QgY2FsYyA9IHRoaXMuY2FsY3VsYXRlQXJjKCk7XG5cbiAgICBub2RlXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oNzUwKVxuICAgICAgLmF0dHJUd2VlbignZCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICg8YW55PnRoaXMpLl9jdXJyZW50ID0gKDxhbnk+dGhpcykuX2N1cnJlbnQgfHwgZDtcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVyID0gaW50ZXJwb2xhdGUoKDxhbnk+dGhpcykuX2N1cnJlbnQsIGQpO1xuICAgICAgICAoPGFueT50aGlzKS5fY3VycmVudCA9IGludGVycG9sYXRlcigwKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGMoaW50ZXJwb2xhdGVyKHQpKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb25DbGljaygpOiB2b2lkIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCk7XG4gICAgdGhpcy5fdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZWxlY3QuZW1pdCh0aGlzLmRhdGEpLCAyMDApO1xuICB9XG5cbiAgb25EYmxDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXQpO1xuXG4gICAgdGhpcy5kYmxjbGljay5lbWl0KHtcbiAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgIG5hdGl2ZUV2ZW50OiBldmVudFxuICAgIH0pO1xuICB9XG59XG4iXX0=