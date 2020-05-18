import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ElementRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { select } from 'd3-selection';
import { invertColor } from '../utils/color-utils';
import { trimLabel } from '../common/trim-label.helper';
import { escapeLabel } from '../common/label.helper';
import { id } from '../utils/id';
var TreeMapCellComponent = /** @class */ (function () {
    function TreeMapCellComponent(element) {
        this.gradient = false;
        this.animations = true;
        this.select = new EventEmitter();
        this.initialized = false;
        this.element = element.nativeElement;
    }
    TreeMapCellComponent.prototype.ngOnChanges = function () {
        this.update();
        this.valueFormatting = this.valueFormatting || (function (value) { return value.toLocaleString(); });
        var labelFormatting = this.labelFormatting || (function (cell) { return escapeLabel(trimLabel(cell.label, 55)); });
        var cellData = {
            data: this.data,
            label: this.label,
            value: this.value
        };
        this.formattedValue = this.valueFormatting(cellData.value);
        this.formattedLabel = labelFormatting(cellData);
        this.gradientId = 'grad' + id().toString();
        this.gradientUrl = "url(#" + this.gradientId + ")";
        this.gradientStops = this.getGradientStops();
    };
    TreeMapCellComponent.prototype.update = function () {
        if (this.initialized) {
            this.animateToCurrentForm();
        }
        else {
            if (this.animations) {
                this.loadAnimation();
            }
            this.initialized = true;
        }
    };
    TreeMapCellComponent.prototype.loadAnimation = function () {
        var node = select(this.element).select('.cell');
        node.attr('opacity', 0).attr('x', this.x).attr('y', this.y);
        this.animateToCurrentForm();
    };
    TreeMapCellComponent.prototype.getTextColor = function () {
        return invertColor(this.fill);
    };
    TreeMapCellComponent.prototype.animateToCurrentForm = function () {
        var node = select(this.element).select('.cell');
        if (this.animations) {
            node
                .transition()
                .duration(750)
                .attr('opacity', 1)
                .attr('x', this.x)
                .attr('y', this.y)
                .attr('width', this.width)
                .attr('height', this.height);
        }
        else {
            node.attr('opacity', 1).attr('x', this.x).attr('y', this.y).attr('width', this.width).attr('height', this.height);
        }
    };
    TreeMapCellComponent.prototype.onClick = function () {
        this.select.emit(this.data);
    };
    TreeMapCellComponent.prototype.getGradientStops = function () {
        return [
            {
                offset: 0,
                color: this.fill,
                opacity: 0.3
            },
            {
                offset: 100,
                color: this.fill,
                opacity: 1
            }
        ];
    };
    TreeMapCellComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "data", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "fill", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "x", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "y", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "width", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "height", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "label", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "value", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "valueType", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "valueFormatting", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "labelFormatting", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "gradient", void 0);
    __decorate([
        Input()
    ], TreeMapCellComponent.prototype, "animations", void 0);
    __decorate([
        Output()
    ], TreeMapCellComponent.prototype, "select", void 0);
    TreeMapCellComponent = __decorate([
        Component({
            selector: 'g[ngx-charts-tree-map-cell]',
            template: "\n    <svg:g>\n      <defs *ngIf=\"gradient\">\n        <svg:g ngx-charts-svg-linear-gradient orientation=\"vertical\" [name]=\"gradientId\" [stops]=\"gradientStops\" />\n      </defs>\n      <svg:rect\n        [attr.fill]=\"gradient ? gradientUrl : fill\"\n        [attr.width]=\"width\"\n        [attr.height]=\"height\"\n        [attr.x]=\"x\"\n        [attr.y]=\"y\"\n        [style.cursor]=\"'pointer'\"\n        class=\"cell\"\n        (click)=\"onClick()\"\n      />\n      <svg:foreignObject\n        *ngIf=\"width >= 70 && height >= 35\"\n        [attr.x]=\"x\"\n        [attr.y]=\"y\"\n        [attr.width]=\"width\"\n        [attr.height]=\"height\"\n        class=\"treemap-label\"\n        [style.pointer-events]=\"'none'\"\n      >\n        <xhtml:p [style.color]=\"getTextColor()\" [style.height]=\"height + 'px'\" [style.width]=\"width + 'px'\">\n          <xhtml:span class=\"treemap-label\" [innerHTML]=\"formattedLabel\"> </xhtml:span>\n          <xhtml:br />\n          <xhtml:span\n            *ngIf=\"animations\"\n            class=\"treemap-val\"\n            ngx-charts-count-up\n            [countTo]=\"value\"\n            [valueFormatting]=\"valueFormatting\"\n          >\n          </xhtml:span>\n          <xhtml:span *ngIf=\"!animations\" class=\"treemap-val\">\n            {{ formattedValue }}\n          </xhtml:span>\n        </xhtml:p>\n      </svg:foreignObject>\n    </svg:g>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], TreeMapCellComponent);
    return TreeMapCellComponent;
}());
export { TreeMapCellComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tYXAtY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi90cmVlLW1hcC90cmVlLW1hcC1jZWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQWdEakM7SUEyQkUsOEJBQVksT0FBbUI7UUFmdEIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBVXRDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsMENBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUF0QixDQUFzQixDQUFDLENBQUM7UUFDakYsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9B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LElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCwrQ0FBZ0IsR0FBaEI7UUFDRSxPQUFPO1lBQ0w7Z0JBQ0UsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNoQixPQUFPLEVBQUUsR0FBRzthQUNiO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNoQixPQUFPLEVBQUUsQ0FBQzthQUNYO1NBQ0YsQ0FBQztJQUNKLENBQUM7O2dCQWpGb0IsVUFBVTs7SUExQnRCO1FBQVIsS0FBSyxFQUFFO3NEQUFNO0lBQ0w7UUFBUixLQUFLLEVBQUU7c0RBQU07SUFDTDtRQUFSLEtBQUssRUFBRTttREFBRztJQUNGO1FBQVIsS0FBSyxFQUFFO21EQUFHO0lBQ0Y7UUFBUixLQUFLLEVBQUU7dURBQU87SUFDTjtRQUFSLEtBQUssRUFBRTt3REFBUTtJQUNQO1FBQVIsS0FBSyxFQUFFO3VEQUFPO0lBQ047UUFBUixLQUFLLEVBQUU7dURBQU87SUFDTjtRQUFSLEtBQUssRUFBRTsyREFBVztJQUNWO1FBQVIsS0FBSyxFQUFFO2lFQUFzQjtJQUNyQjtRQUFSLEtBQUssRUFBRTtpRUFBc0I7SUFDckI7UUFBUixLQUFLLEVBQUU7MERBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFOzREQUE0QjtJQUUxQjtRQUFULE1BQU0sRUFBRTt3REFBNkI7SUFmM0Isb0JBQW9CO1FBOUNoQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsNkJBQTZCO1lBQ3ZDLFFBQVEsRUFBRSw0NENBeUNUO1lBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07U0FDaEQsQ0FBQztPQUNXLG9CQUFvQixDQTZHaEM7SUFBRCwyQkFBQztDQUFBLEFBN0dELElBNkdDO1NBN0dZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuXG5pbXBvcnQgeyBpbnZlcnRDb2xvciB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7IHRyaW1MYWJlbCB9IGZyb20gJy4uL2NvbW1vbi90cmltLWxhYmVsLmhlbHBlcic7XG5pbXBvcnQgeyBlc2NhcGVMYWJlbCB9IGZyb20gJy4uL2NvbW1vbi9sYWJlbC5oZWxwZXInO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy10cmVlLW1hcC1jZWxsXScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHN2ZzpnPlxuICAgICAgPGRlZnMgKm5nSWY9XCJncmFkaWVudFwiPlxuICAgICAgICA8c3ZnOmcgbmd4LWNoYXJ0cy1zdmctbGluZWFyLWdyYWRpZW50IG9yaWVudGF0aW9uPVwidmVydGljYWxcIiBbbmFtZV09XCJncmFkaWVudElkXCIgW3N0b3BzXT1cImdyYWRpZW50U3RvcHNcIiAvPlxuICAgICAgPC9kZWZzPlxuICAgICAgPHN2ZzpyZWN0XG4gICAgICAgIFthdHRyLmZpbGxdPVwiZ3JhZGllbnQgPyBncmFkaWVudFVybCA6IGZpbGxcIlxuICAgICAgICBbYXR0ci53aWR0aF09XCJ3aWR0aFwiXG4gICAgICAgIFthdHRyLmhlaWdodF09XCJoZWlnaHRcIlxuICAgICAgICBbYXR0ci54XT1cInhcIlxuICAgICAgICBbYXR0ci55XT1cInlcIlxuICAgICAgICBbc3R5bGUuY3Vyc29yXT1cIidwb2ludGVyJ1wiXG4gICAgICAgIGNsYXNzPVwiY2VsbFwiXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKClcIlxuICAgICAgLz5cbiAgICAgIDxzdmc6Zm9yZWlnbk9iamVjdFxuICAgICAgICAqbmdJZj1cIndpZHRoID49IDcwICYmIGhlaWdodCA+PSAzNVwiXG4gICAgICAgIFthdHRyLnhdPVwieFwiXG4gICAgICAgIFthdHRyLnldPVwieVwiXG4gICAgICAgIFthdHRyLndpZHRoXT1cIndpZHRoXCJcbiAgICAgICAgW2F0dHIuaGVpZ2h0XT1cImhlaWdodFwiXG4gICAgICAgIGNsYXNzPVwidHJlZW1hcC1sYWJlbFwiXG4gICAgICAgIFtzdHlsZS5wb2ludGVyLWV2ZW50c109XCInbm9uZSdcIlxuICAgICAgPlxuICAgICAgICA8eGh0bWw6cCBbc3R5bGUuY29sb3JdPVwiZ2V0VGV4dENvbG9yKClcIiBbc3R5bGUuaGVpZ2h0XT1cImhlaWdodCArICdweCdcIiBbc3R5bGUud2lkdGhdPVwid2lkdGggKyAncHgnXCI+XG4gICAgICAgICAgPHhodG1sOnNwYW4gY2xhc3M9XCJ0cmVlbWFwLWxhYmVsXCIgW2lubmVySFRNTF09XCJmb3JtYXR0ZWRMYWJlbFwiPiA8L3hodG1sOnNwYW4+XG4gICAgICAgICAgPHhodG1sOmJyIC8+XG4gICAgICAgICAgPHhodG1sOnNwYW5cbiAgICAgICAgICAgICpuZ0lmPVwiYW5pbWF0aW9uc1wiXG4gICAgICAgICAgICBjbGFzcz1cInRyZWVtYXAtdmFsXCJcbiAgICAgICAgICAgIG5neC1jaGFydHMtY291bnQtdXBcbiAgICAgICAgICAgIFtjb3VudFRvXT1cInZhbHVlXCJcbiAgICAgICAgICAgIFt2YWx1ZUZvcm1hdHRpbmddPVwidmFsdWVGb3JtYXR0aW5nXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPC94aHRtbDpzcGFuPlxuICAgICAgICAgIDx4aHRtbDpzcGFuICpuZ0lmPVwiIWFuaW1hdGlvbnNcIiBjbGFzcz1cInRyZWVtYXAtdmFsXCI+XG4gICAgICAgICAgICB7eyBmb3JtYXR0ZWRWYWx1ZSB9fVxuICAgICAgICAgIDwveGh0bWw6c3Bhbj5cbiAgICAgICAgPC94aHRtbDpwPlxuICAgICAgPC9zdmc6Zm9yZWlnbk9iamVjdD5cbiAgICA8L3N2ZzpnPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBUcmVlTWFwQ2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGRhdGE7XG4gIEBJbnB1dCgpIGZpbGw7XG4gIEBJbnB1dCgpIHg7XG4gIEBJbnB1dCgpIHk7XG4gIEBJbnB1dCgpIHdpZHRoO1xuICBASW5wdXQoKSBoZWlnaHQ7XG4gIEBJbnB1dCgpIGxhYmVsO1xuICBASW5wdXQoKSB2YWx1ZTtcbiAgQElucHV0KCkgdmFsdWVUeXBlO1xuICBASW5wdXQoKSB2YWx1ZUZvcm1hdHRpbmc6IGFueTtcbiAgQElucHV0KCkgbGFiZWxGb3JtYXR0aW5nOiBhbnk7XG4gIEBJbnB1dCgpIGdyYWRpZW50OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGFuaW1hdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZ3JhZGllbnRTdG9wczogYW55W107XG4gIGdyYWRpZW50SWQ6IHN0cmluZztcbiAgZ3JhZGllbnRVcmw6IHN0cmluZztcblxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XG4gIGZvcm1hdHRlZExhYmVsOiBzdHJpbmc7XG4gIGZvcm1hdHRlZFZhbHVlOiBzdHJpbmc7XG4gIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICB0aGlzLnZhbHVlRm9ybWF0dGluZyA9IHRoaXMudmFsdWVGb3JtYXR0aW5nIHx8ICh2YWx1ZSA9PiB2YWx1ZS50b0xvY2FsZVN0cmluZygpKTtcbiAgICBjb25zdCBsYWJlbEZvcm1hdHRpbmcgPSB0aGlzLmxhYmVsRm9ybWF0dGluZyB8fCAoY2VsbCA9PiBlc2NhcGVMYWJlbCh0cmltTGFiZWwoY2VsbC5sYWJlbCwgNTUpKSk7XG5cbiAgICBjb25zdCBjZWxsRGF0YSA9IHtcbiAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgdmFsdWU6IHRoaXMudmFsdWVcbiAgICB9O1xuXG4gICAgdGhpcy5mb3JtYXR0ZWRWYWx1ZSA9IHRoaXMudmFsdWVGb3JtYXR0aW5nKGNlbGxEYXRhLnZhbHVlKTtcbiAgICB0aGlzLmZvcm1hdHRlZExhYmVsID0gbGFiZWxGb3JtYXR0aW5nKGNlbGxEYXRhKTtcblxuICAgIHRoaXMuZ3JhZGllbnRJZCA9ICdncmFkJyArIGlkKCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmdyYWRpZW50VXJsID0gYHVybCgjJHt0aGlzLmdyYWRpZW50SWR9KWA7XG4gICAgdGhpcy5ncmFkaWVudFN0b3BzID0gdGhpcy5nZXRHcmFkaWVudFN0b3BzKCk7XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuYW5pbWF0ZVRvQ3VycmVudEZvcm0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9ucykge1xuICAgICAgICB0aGlzLmxvYWRBbmltYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRBbmltYXRpb24oKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZSA9IHNlbGVjdCh0aGlzLmVsZW1lbnQpLnNlbGVjdCgnLmNlbGwnKTtcblxuICAgIG5vZGUuYXR0cignb3BhY2l0eScsIDApLmF0dHIoJ3gnLCB0aGlzLngpLmF0dHIoJ3knLCB0aGlzLnkpO1xuXG4gICAgdGhpcy5hbmltYXRlVG9DdXJyZW50Rm9ybSgpO1xuICB9XG5cbiAgZ2V0VGV4dENvbG9yKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGludmVydENvbG9yKHRoaXMuZmlsbCk7XG4gIH1cblxuICBhbmltYXRlVG9DdXJyZW50Rm9ybSgpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudCkuc2VsZWN0KCcuY2VsbCcpO1xuXG4gICAgaWYgKHRoaXMuYW5pbWF0aW9ucykge1xuICAgICAgbm9kZVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5kdXJhdGlvbig3NTApXG4gICAgICAgIC5hdHRyKCdvcGFjaXR5JywgMSlcbiAgICAgICAgLmF0dHIoJ3gnLCB0aGlzLngpXG4gICAgICAgIC5hdHRyKCd5JywgdGhpcy55KVxuICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmF0dHIoJ29wYWNpdHknLCAxKS5hdHRyKCd4JywgdGhpcy54KS5hdHRyKCd5JywgdGhpcy55KS5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBvbkNsaWNrKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0LmVtaXQodGhpcy5kYXRhKTtcbiAgfVxuXG4gIGdldEdyYWRpZW50U3RvcHMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBjb2xvcjogdGhpcy5maWxsLFxuICAgICAgICBvcGFjaXR5OiAwLjNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9mZnNldDogMTAwLFxuICAgICAgICBjb2xvcjogdGhpcy5maWxsLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9XG4gICAgXTtcbiAgfVxufVxuIl19