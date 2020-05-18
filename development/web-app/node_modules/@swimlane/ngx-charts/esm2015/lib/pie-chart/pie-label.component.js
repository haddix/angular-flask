import { __decorate } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { arc } from 'd3-shape';
import { trimLabel } from '../common/trim-label.helper';
let PieLabelComponent = class PieLabelComponent {
    constructor() {
        this.animations = true;
        this.labelTrim = true;
        this.labelTrimSize = 10;
        this.isIE = /(edge|msie|trident)/i.test(navigator.userAgent);
        this.trimLabel = trimLabel;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        let startRadius = this.radius;
        if (this.explodeSlices) {
            startRadius = (this.radius * this.value) / this.max;
        }
        const innerArc = arc().innerRadius(startRadius).outerRadius(startRadius);
        // Calculate innerPos then scale outer position to match label position
        const innerPos = innerArc.centroid(this.data);
        let scale = this.data.pos[1] / innerPos[1];
        if (this.data.pos[1] === 0 || innerPos[1] === 0) {
            scale = 1;
        }
        const outerPos = [scale * innerPos[0], scale * innerPos[1]];
        this.line = `M${innerPos}L${outerPos}L${this.data.pos}`;
    }
    get textX() {
        return this.data.pos[0];
    }
    get textY() {
        return this.data.pos[1];
    }
    get styleTransform() {
        return this.isIE ? null : `translate3d(${this.textX}px,${this.textY}px, 0)`;
    }
    get attrTransform() {
        return !this.isIE ? null : `translate(${this.textX},${this.textY})`;
    }
    get textTransition() {
        return this.isIE || !this.animations ? null : 'transform 0.75s';
    }
    textAnchor() {
        return this.midAngle(this.data) < Math.PI ? 'start' : 'end';
    }
    midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
};
__decorate([
    Input()
], PieLabelComponent.prototype, "data", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "radius", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "label", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "color", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "max", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "value", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "explodeSlices", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "animations", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "labelTrim", void 0);
__decorate([
    Input()
], PieLabelComponent.prototype, "labelTrimSize", void 0);
PieLabelComponent = __decorate([
    Component({
        selector: 'g[ngx-charts-pie-label]',
        template: `
    <title>{{ label }}</title>
    <svg:g [attr.transform]="attrTransform" [style.transform]="styleTransform" [style.transition]="textTransition">
      <svg:text
        class="pie-label"
        [class.animation]="animations"
        dy=".35em"
        [style.textAnchor]="textAnchor()"
        [style.shapeRendering]="'crispEdges'"
      >
        {{ labelTrim ? trimLabel(label, labelTrimSize) : label }}
      </svg:text>
    </svg:g>
    <svg:path
      [attr.d]="line"
      [attr.stroke]="color"
      fill="none"
      class="pie-label-line line"
      [class.animation]="animations"
    ></svg:path>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], PieLabelComponent);
export { PieLabelComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWxhYmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL3BpZS1jaGFydC9waWUtbGFiZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUEyQnhELElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0lBaUI1QjtRQVRTLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0IsY0FBUyxHQUFZLElBQUksQ0FBQztRQUMxQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUtuQixTQUFJLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUd2RSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDckQ7UUFFRCxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXpFLHVFQUF1RTtRQUN2RSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMvQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ1g7UUFDRCxNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUQsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxJQUFJLENBQUMsS0FBSyxNQUFNLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQztJQUM5RSxDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztJQUN0RSxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7SUFDbEUsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzlELENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBQztRQUNSLE9BQU8sQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0YsQ0FBQTtBQXZFVTtJQUFSLEtBQUssRUFBRTsrQ0FBTTtBQUNMO0lBQVIsS0FBSyxFQUFFO2lEQUFRO0FBQ1A7SUFBUixLQUFLLEVBQUU7Z0RBQU87QUFDTjtJQUFSLEtBQUssRUFBRTtnREFBTztBQUNOO0lBQVIsS0FBSyxFQUFFOzhDQUFLO0FBQ0o7SUFBUixLQUFLLEVBQUU7Z0RBQU87QUFDTjtJQUFSLEtBQUssRUFBRTt3REFBZTtBQUNkO0lBQVIsS0FBSyxFQUFFO3FEQUE0QjtBQUMzQjtJQUFSLEtBQUssRUFBRTtvREFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7d0RBQTRCO0FBVnpCLGlCQUFpQjtJQXpCN0IsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLHlCQUF5QjtRQUNuQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JUO1FBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07S0FDaEQsQ0FBQztHQUNXLGlCQUFpQixDQXdFN0I7U0F4RVksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgYXJjIH0gZnJvbSAnZDMtc2hhcGUnO1xuXG5pbXBvcnQgeyB0cmltTGFiZWwgfSBmcm9tICcuLi9jb21tb24vdHJpbS1sYWJlbC5oZWxwZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtcGllLWxhYmVsXScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHRpdGxlPnt7IGxhYmVsIH19PC90aXRsZT5cbiAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cImF0dHJUcmFuc2Zvcm1cIiBbc3R5bGUudHJhbnNmb3JtXT1cInN0eWxlVHJhbnNmb3JtXCIgW3N0eWxlLnRyYW5zaXRpb25dPVwidGV4dFRyYW5zaXRpb25cIj5cbiAgICAgIDxzdmc6dGV4dFxuICAgICAgICBjbGFzcz1cInBpZS1sYWJlbFwiXG4gICAgICAgIFtjbGFzcy5hbmltYXRpb25dPVwiYW5pbWF0aW9uc1wiXG4gICAgICAgIGR5PVwiLjM1ZW1cIlxuICAgICAgICBbc3R5bGUudGV4dEFuY2hvcl09XCJ0ZXh0QW5jaG9yKClcIlxuICAgICAgICBbc3R5bGUuc2hhcGVSZW5kZXJpbmddPVwiJ2NyaXNwRWRnZXMnXCJcbiAgICAgID5cbiAgICAgICAge3sgbGFiZWxUcmltID8gdHJpbUxhYmVsKGxhYmVsLCBsYWJlbFRyaW1TaXplKSA6IGxhYmVsIH19XG4gICAgICA8L3N2Zzp0ZXh0PlxuICAgIDwvc3ZnOmc+XG4gICAgPHN2ZzpwYXRoXG4gICAgICBbYXR0ci5kXT1cImxpbmVcIlxuICAgICAgW2F0dHIuc3Ryb2tlXT1cImNvbG9yXCJcbiAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgIGNsYXNzPVwicGllLWxhYmVsLWxpbmUgbGluZVwiXG4gICAgICBbY2xhc3MuYW5pbWF0aW9uXT1cImFuaW1hdGlvbnNcIlxuICAgID48L3N2ZzpwYXRoPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQaWVMYWJlbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGRhdGE7XG4gIEBJbnB1dCgpIHJhZGl1cztcbiAgQElucHV0KCkgbGFiZWw7XG4gIEBJbnB1dCgpIGNvbG9yO1xuICBASW5wdXQoKSBtYXg7XG4gIEBJbnB1dCgpIHZhbHVlO1xuICBASW5wdXQoKSBleHBsb2RlU2xpY2VzO1xuICBASW5wdXQoKSBhbmltYXRpb25zOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbGFiZWxUcmltOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbGFiZWxUcmltU2l6ZTogbnVtYmVyID0gMTA7XG5cbiAgdHJpbUxhYmVsOiAobGFiZWw6IHN0cmluZywgbWF4PzogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIGxpbmU6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGlzSUUgPSAvKGVkZ2V8bXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50cmltTGFiZWwgPSB0cmltTGFiZWw7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBsZXQgc3RhcnRSYWRpdXMgPSB0aGlzLnJhZGl1cztcbiAgICBpZiAodGhpcy5leHBsb2RlU2xpY2VzKSB7XG4gICAgICBzdGFydFJhZGl1cyA9ICh0aGlzLnJhZGl1cyAqIHRoaXMudmFsdWUpIC8gdGhpcy5tYXg7XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJBcmMgPSBhcmMoKS5pbm5lclJhZGl1cyhzdGFydFJhZGl1cykub3V0ZXJSYWRpdXMoc3RhcnRSYWRpdXMpO1xuXG4gICAgLy8gQ2FsY3VsYXRlIGlubmVyUG9zIHRoZW4gc2NhbGUgb3V0ZXIgcG9zaXRpb24gdG8gbWF0Y2ggbGFiZWwgcG9zaXRpb25cbiAgICBjb25zdCBpbm5lclBvcyA9IGlubmVyQXJjLmNlbnRyb2lkKHRoaXMuZGF0YSk7XG5cbiAgICBsZXQgc2NhbGUgPSB0aGlzLmRhdGEucG9zWzFdIC8gaW5uZXJQb3NbMV07XG4gICAgaWYgKHRoaXMuZGF0YS5wb3NbMV0gPT09IDAgfHwgaW5uZXJQb3NbMV0gPT09IDApIHtcbiAgICAgIHNjYWxlID0gMTtcbiAgICB9XG4gICAgY29uc3Qgb3V0ZXJQb3MgPSBbc2NhbGUgKiBpbm5lclBvc1swXSwgc2NhbGUgKiBpbm5lclBvc1sxXV07XG5cbiAgICB0aGlzLmxpbmUgPSBgTSR7aW5uZXJQb3N9TCR7b3V0ZXJQb3N9TCR7dGhpcy5kYXRhLnBvc31gO1xuICB9XG5cbiAgZ2V0IHRleHRYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5wb3NbMF07XG4gIH1cblxuICBnZXQgdGV4dFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLnBvc1sxXTtcbiAgfVxuXG4gIGdldCBzdHlsZVRyYW5zZm9ybSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlzSUUgPyBudWxsIDogYHRyYW5zbGF0ZTNkKCR7dGhpcy50ZXh0WH1weCwke3RoaXMudGV4dFl9cHgsIDApYDtcbiAgfVxuXG4gIGdldCBhdHRyVHJhbnNmb3JtKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICF0aGlzLmlzSUUgPyBudWxsIDogYHRyYW5zbGF0ZSgke3RoaXMudGV4dFh9LCR7dGhpcy50ZXh0WX0pYDtcbiAgfVxuXG4gIGdldCB0ZXh0VHJhbnNpdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlzSUUgfHwgIXRoaXMuYW5pbWF0aW9ucyA/IG51bGwgOiAndHJhbnNmb3JtIDAuNzVzJztcbiAgfVxuXG4gIHRleHRBbmNob3IoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5taWRBbmdsZSh0aGlzLmRhdGEpIDwgTWF0aC5QSSA/ICdzdGFydCcgOiAnZW5kJztcbiAgfVxuXG4gIG1pZEFuZ2xlKGQpOiBudW1iZXIge1xuICAgIHJldHVybiBkLnN0YXJ0QW5nbGUgKyAoZC5lbmRBbmdsZSAtIGQuc3RhcnRBbmdsZSkgLyAyO1xuICB9XG59XG4iXX0=