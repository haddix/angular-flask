import { __decorate } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { arc } from 'd3-shape';
import { trimLabel } from '../common/trim-label.helper';
var PieLabelComponent = /** @class */ (function () {
    function PieLabelComponent() {
        this.animations = true;
        this.labelTrim = true;
        this.labelTrimSize = 10;
        this.isIE = /(edge|msie|trident)/i.test(navigator.userAgent);
        this.trimLabel = trimLabel;
    }
    PieLabelComponent.prototype.ngOnChanges = function (changes) {
        this.update();
    };
    PieLabelComponent.prototype.update = function () {
        var startRadius = this.radius;
        if (this.explodeSlices) {
            startRadius = (this.radius * this.value) / this.max;
        }
        var innerArc = arc().innerRadius(startRadius).outerRadius(startRadius);
        // Calculate innerPos then scale outer position to match label position
        var innerPos = innerArc.centroid(this.data);
        var scale = this.data.pos[1] / innerPos[1];
        if (this.data.pos[1] === 0 || innerPos[1] === 0) {
            scale = 1;
        }
        var outerPos = [scale * innerPos[0], scale * innerPos[1]];
        this.line = "M" + innerPos + "L" + outerPos + "L" + this.data.pos;
    };
    Object.defineProperty(PieLabelComponent.prototype, "textX", {
        get: function () {
            return this.data.pos[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieLabelComponent.prototype, "textY", {
        get: function () {
            return this.data.pos[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieLabelComponent.prototype, "styleTransform", {
        get: function () {
            return this.isIE ? null : "translate3d(" + this.textX + "px," + this.textY + "px, 0)";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieLabelComponent.prototype, "attrTransform", {
        get: function () {
            return !this.isIE ? null : "translate(" + this.textX + "," + this.textY + ")";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieLabelComponent.prototype, "textTransition", {
        get: function () {
            return this.isIE || !this.animations ? null : 'transform 0.75s';
        },
        enumerable: true,
        configurable: true
    });
    PieLabelComponent.prototype.textAnchor = function () {
        return this.midAngle(this.data) < Math.PI ? 'start' : 'end';
    };
    PieLabelComponent.prototype.midAngle = function (d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
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
            template: "\n    <title>{{ label }}</title>\n    <svg:g [attr.transform]=\"attrTransform\" [style.transform]=\"styleTransform\" [style.transition]=\"textTransition\">\n      <svg:text\n        class=\"pie-label\"\n        [class.animation]=\"animations\"\n        dy=\".35em\"\n        [style.textAnchor]=\"textAnchor()\"\n        [style.shapeRendering]=\"'crispEdges'\"\n      >\n        {{ labelTrim ? trimLabel(label, labelTrimSize) : label }}\n      </svg:text>\n    </svg:g>\n    <svg:path\n      [attr.d]=\"line\"\n      [attr.stroke]=\"color\"\n      fill=\"none\"\n      class=\"pie-label-line line\"\n      [class.animation]=\"animations\"\n    ></svg:path>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], PieLabelComponent);
    return PieLabelComponent;
}());
export { PieLabelComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWxhYmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL3BpZS1jaGFydC9waWUtbGFiZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUEyQnhEO0lBaUJFO1FBVFMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixjQUFTLEdBQVksSUFBSSxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBS25CLFNBQUksR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBR3ZFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCx1Q0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxrQ0FBTSxHQUFOO1FBQ0UsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNyRDtRQUVELElBQU0sUUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFekUsdUVBQXVFO1FBQ3ZFLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFB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ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFyYyB9IGZyb20gJ2QzLXNoYXBlJztcblxuaW1wb3J0IHsgdHJpbUxhYmVsIH0gZnJvbSAnLi4vY29tbW9uL3RyaW0tbGFiZWwuaGVscGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXBpZS1sYWJlbF0nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDx0aXRsZT57eyBsYWJlbCB9fTwvdGl0bGU+XG4gICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJhdHRyVHJhbnNmb3JtXCIgW3N0eWxlLnRyYW5zZm9ybV09XCJzdHlsZVRyYW5zZm9ybVwiIFtzdHlsZS50cmFuc2l0aW9uXT1cInRleHRUcmFuc2l0aW9uXCI+XG4gICAgICA8c3ZnOnRleHRcbiAgICAgICAgY2xhc3M9XCJwaWUtbGFiZWxcIlxuICAgICAgICBbY2xhc3MuYW5pbWF0aW9uXT1cImFuaW1hdGlvbnNcIlxuICAgICAgICBkeT1cIi4zNWVtXCJcbiAgICAgICAgW3N0eWxlLnRleHRBbmNob3JdPVwidGV4dEFuY2hvcigpXCJcbiAgICAgICAgW3N0eWxlLnNoYXBlUmVuZGVyaW5nXT1cIidjcmlzcEVkZ2VzJ1wiXG4gICAgICA+XG4gICAgICAgIHt7IGxhYmVsVHJpbSA/IHRyaW1MYWJlbChsYWJlbCwgbGFiZWxUcmltU2l6ZSkgOiBsYWJlbCB9fVxuICAgICAgPC9zdmc6dGV4dD5cbiAgICA8L3N2ZzpnPlxuICAgIDxzdmc6cGF0aFxuICAgICAgW2F0dHIuZF09XCJsaW5lXCJcbiAgICAgIFthdHRyLnN0cm9rZV09XCJjb2xvclwiXG4gICAgICBmaWxsPVwibm9uZVwiXG4gICAgICBjbGFzcz1cInBpZS1sYWJlbC1saW5lIGxpbmVcIlxuICAgICAgW2NsYXNzLmFuaW1hdGlvbl09XCJhbmltYXRpb25zXCJcbiAgICA+PC9zdmc6cGF0aD5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgUGllTGFiZWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBkYXRhO1xuICBASW5wdXQoKSByYWRpdXM7XG4gIEBJbnB1dCgpIGxhYmVsO1xuICBASW5wdXQoKSBjb2xvcjtcbiAgQElucHV0KCkgbWF4O1xuICBASW5wdXQoKSB2YWx1ZTtcbiAgQElucHV0KCkgZXhwbG9kZVNsaWNlcztcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGxhYmVsVHJpbTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGxhYmVsVHJpbVNpemU6IG51bWJlciA9IDEwO1xuXG4gIHRyaW1MYWJlbDogKGxhYmVsOiBzdHJpbmcsIG1heD86IG51bWJlcikgPT4gc3RyaW5nO1xuICBsaW5lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBpc0lFID0gLyhlZGdlfG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudHJpbUxhYmVsID0gdHJpbUxhYmVsO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgbGV0IHN0YXJ0UmFkaXVzID0gdGhpcy5yYWRpdXM7XG4gICAgaWYgKHRoaXMuZXhwbG9kZVNsaWNlcykge1xuICAgICAgc3RhcnRSYWRpdXMgPSAodGhpcy5yYWRpdXMgKiB0aGlzLnZhbHVlKSAvIHRoaXMubWF4O1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVyQXJjID0gYXJjKCkuaW5uZXJSYWRpdXMoc3RhcnRSYWRpdXMpLm91dGVyUmFkaXVzKHN0YXJ0UmFkaXVzKTtcblxuICAgIC8vIENhbGN1bGF0ZSBpbm5lclBvcyB0aGVuIHNjYWxlIG91dGVyIHBvc2l0aW9uIHRvIG1hdGNoIGxhYmVsIHBvc2l0aW9uXG4gICAgY29uc3QgaW5uZXJQb3MgPSBpbm5lckFyYy5jZW50cm9pZCh0aGlzLmRhdGEpO1xuXG4gICAgbGV0IHNjYWxlID0gdGhpcy5kYXRhLnBvc1sxXSAvIGlubmVyUG9zWzFdO1xuICAgIGlmICh0aGlzLmRhdGEucG9zWzFdID09PSAwIHx8IGlubmVyUG9zWzFdID09PSAwKSB7XG4gICAgICBzY2FsZSA9IDE7XG4gICAgfVxuICAgIGNvbnN0IG91dGVyUG9zID0gW3NjYWxlICogaW5uZXJQb3NbMF0sIHNjYWxlICogaW5uZXJQb3NbMV1dO1xuXG4gICAgdGhpcy5saW5lID0gYE0ke2lubmVyUG9zfUwke291dGVyUG9zfUwke3RoaXMuZGF0YS5wb3N9YDtcbiAgfVxuXG4gIGdldCB0ZXh0WCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmRhdGEucG9zWzBdO1xuICB9XG5cbiAgZ2V0IHRleHRZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5wb3NbMV07XG4gIH1cblxuICBnZXQgc3R5bGVUcmFuc2Zvcm0oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pc0lFID8gbnVsbCA6IGB0cmFuc2xhdGUzZCgke3RoaXMudGV4dFh9cHgsJHt0aGlzLnRleHRZfXB4LCAwKWA7XG4gIH1cblxuICBnZXQgYXR0clRyYW5zZm9ybSgpOiBzdHJpbmcge1xuICAgIHJldHVybiAhdGhpcy5pc0lFID8gbnVsbCA6IGB0cmFuc2xhdGUoJHt0aGlzLnRleHRYfSwke3RoaXMudGV4dFl9KWA7XG4gIH1cblxuICBnZXQgdGV4dFRyYW5zaXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pc0lFIHx8ICF0aGlzLmFuaW1hdGlvbnMgPyBudWxsIDogJ3RyYW5zZm9ybSAwLjc1cyc7XG4gIH1cblxuICB0ZXh0QW5jaG9yKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMubWlkQW5nbGUodGhpcy5kYXRhKSA8IE1hdGguUEkgPyAnc3RhcnQnIDogJ2VuZCc7XG4gIH1cblxuICBtaWRBbmdsZShkKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZC5zdGFydEFuZ2xlICsgKGQuZW5kQW5nbGUgLSBkLnN0YXJ0QW5nbGUpIC8gMjtcbiAgfVxufVxuIl19