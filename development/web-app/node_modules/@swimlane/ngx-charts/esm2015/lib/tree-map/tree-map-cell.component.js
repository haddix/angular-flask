import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ElementRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { select } from 'd3-selection';
import { invertColor } from '../utils/color-utils';
import { trimLabel } from '../common/trim-label.helper';
import { escapeLabel } from '../common/label.helper';
import { id } from '../utils/id';
let TreeMapCellComponent = class TreeMapCellComponent {
    constructor(element) {
        this.gradient = false;
        this.animations = true;
        this.select = new EventEmitter();
        this.initialized = false;
        this.element = element.nativeElement;
    }
    ngOnChanges() {
        this.update();
        this.valueFormatting = this.valueFormatting || (value => value.toLocaleString());
        const labelFormatting = this.labelFormatting || (cell => escapeLabel(trimLabel(cell.label, 55)));
        const cellData = {
            data: this.data,
            label: this.label,
            value: this.value
        };
        this.formattedValue = this.valueFormatting(cellData.value);
        this.formattedLabel = labelFormatting(cellData);
        this.gradientId = 'grad' + id().toString();
        this.gradientUrl = `url(#${this.gradientId})`;
        this.gradientStops = this.getGradientStops();
    }
    update() {
        if (this.initialized) {
            this.animateToCurrentForm();
        }
        else {
            if (this.animations) {
                this.loadAnimation();
            }
            this.initialized = true;
        }
    }
    loadAnimation() {
        const node = select(this.element).select('.cell');
        node.attr('opacity', 0).attr('x', this.x).attr('y', this.y);
        this.animateToCurrentForm();
    }
    getTextColor() {
        return invertColor(this.fill);
    }
    animateToCurrentForm() {
        const node = select(this.element).select('.cell');
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
    }
    onClick() {
        this.select.emit(this.data);
    }
    getGradientStops() {
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
    }
};
TreeMapCellComponent.ctorParameters = () => [
    { type: ElementRef }
];
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
        template: `
    <svg:g>
      <defs *ngIf="gradient">
        <svg:g ngx-charts-svg-linear-gradient orientation="vertical" [name]="gradientId" [stops]="gradientStops" />
      </defs>
      <svg:rect
        [attr.fill]="gradient ? gradientUrl : fill"
        [attr.width]="width"
        [attr.height]="height"
        [attr.x]="x"
        [attr.y]="y"
        [style.cursor]="'pointer'"
        class="cell"
        (click)="onClick()"
      />
      <svg:foreignObject
        *ngIf="width >= 70 && height >= 35"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="width"
        [attr.height]="height"
        class="treemap-label"
        [style.pointer-events]="'none'"
      >
        <xhtml:p [style.color]="getTextColor()" [style.height]="height + 'px'" [style.width]="width + 'px'">
          <xhtml:span class="treemap-label" [innerHTML]="formattedLabel"> </xhtml:span>
          <xhtml:br />
          <xhtml:span
            *ngIf="animations"
            class="treemap-val"
            ngx-charts-count-up
            [countTo]="value"
            [valueFormatting]="valueFormatting"
          >
          </xhtml:span>
          <xhtml:span *ngIf="!animations" class="treemap-val">
            {{ formattedValue }}
          </xhtml:span>
        </xhtml:p>
      </svg:foreignObject>
    </svg:g>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], TreeMapCellComponent);
export { TreeMapCellComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tYXAtY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi90cmVlLW1hcC90cmVlLW1hcC1jZWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQWdEakMsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUEyQi9CLFlBQVksT0FBbUI7UUFmdEIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBVXRDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDakYsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLElBQUks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RUQsZ0JBQWdCO1FBQ2QsT0FBTztZQUNMO2dCQUNFLE1BQU0sRUFBRSxDQUFDO2dCQUNULEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDaEIsT0FBTyxFQUFFLEdBQUc7YUFDYjtZQUNEO2dCQUNFLE1BQU0sRUFBRSxHQUFHO2dCQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDaEIsT0FBTyxFQUFFLENBQUM7YUFDWDtTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQTs7WUFsRnNCLFVBQVU7O0FBMUJ0QjtJQUFSLEtBQUssRUFBRTtrREFBTTtBQUNMO0lBQVIsS0FBSyxFQUFFO2tEQUFNO0FBQ0w7SUFBUixLQUFLLEVBQUU7K0NBQUc7QUFDRjtJQUFSLEtBQUssRUFBRTsrQ0FBRztBQUNGO0lBQVIsS0FBSyxFQUFFO21EQUFPO0FBQ047SUFBUixLQUFLLEVBQUU7b0RBQVE7QUFDUDtJQUFSLEtBQUssRUFBRTttREFBTztBQUNOO0lBQVIsS0FBSyxFQUFFO21EQUFPO0FBQ047SUFBUixLQUFLLEVBQUU7dURBQVc7QUFDVjtJQUFSLEtBQUssRUFBRTs2REFBc0I7QUFDckI7SUFBUixLQUFLLEVBQUU7NkRBQXNCO0FBQ3JCO0lBQVIsS0FBSyxFQUFFO3NEQUEyQjtBQUMxQjtJQUFSLEtBQUssRUFBRTt3REFBNEI7QUFFMUI7SUFBVCxNQUFNLEVBQUU7b0RBQTZCO0FBZjNCLG9CQUFvQjtJQTlDaEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLDZCQUE2QjtRQUN2QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNUO1FBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07S0FDaEQsQ0FBQztHQUNXLG9CQUFvQixDQTZHaEM7U0E3R1ksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYsIE9uQ2hhbmdlcywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5cbmltcG9ydCB7IGludmVydENvbG9yIH0gZnJvbSAnLi4vdXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IHsgdHJpbUxhYmVsIH0gZnJvbSAnLi4vY29tbW9uL3RyaW0tbGFiZWwuaGVscGVyJztcbmltcG9ydCB7IGVzY2FwZUxhYmVsIH0gZnJvbSAnLi4vY29tbW9uL2xhYmVsLmhlbHBlcic7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXRyZWUtbWFwLWNlbGxdJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3ZnOmc+XG4gICAgICA8ZGVmcyAqbmdJZj1cImdyYWRpZW50XCI+XG4gICAgICAgIDxzdmc6ZyBuZ3gtY2hhcnRzLXN2Zy1saW5lYXItZ3JhZGllbnQgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiIFtuYW1lXT1cImdyYWRpZW50SWRcIiBbc3RvcHNdPVwiZ3JhZGllbnRTdG9wc1wiIC8+XG4gICAgICA8L2RlZnM+XG4gICAgICA8c3ZnOnJlY3RcbiAgICAgICAgW2F0dHIuZmlsbF09XCJncmFkaWVudCA/IGdyYWRpZW50VXJsIDogZmlsbFwiXG4gICAgICAgIFthdHRyLndpZHRoXT1cIndpZHRoXCJcbiAgICAgICAgW2F0dHIuaGVpZ2h0XT1cImhlaWdodFwiXG4gICAgICAgIFthdHRyLnhdPVwieFwiXG4gICAgICAgIFthdHRyLnldPVwieVwiXG4gICAgICAgIFtzdHlsZS5jdXJzb3JdPVwiJ3BvaW50ZXInXCJcbiAgICAgICAgY2xhc3M9XCJjZWxsXCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2soKVwiXG4gICAgICAvPlxuICAgICAgPHN2Zzpmb3JlaWduT2JqZWN0XG4gICAgICAgICpuZ0lmPVwid2lkdGggPj0gNzAgJiYgaGVpZ2h0ID49IDM1XCJcbiAgICAgICAgW2F0dHIueF09XCJ4XCJcbiAgICAgICAgW2F0dHIueV09XCJ5XCJcbiAgICAgICAgW2F0dHIud2lkdGhdPVwid2lkdGhcIlxuICAgICAgICBbYXR0ci5oZWlnaHRdPVwiaGVpZ2h0XCJcbiAgICAgICAgY2xhc3M9XCJ0cmVlbWFwLWxhYmVsXCJcbiAgICAgICAgW3N0eWxlLnBvaW50ZXItZXZlbnRzXT1cIidub25lJ1wiXG4gICAgICA+XG4gICAgICAgIDx4aHRtbDpwIFtzdHlsZS5jb2xvcl09XCJnZXRUZXh0Q29sb3IoKVwiIFtzdHlsZS5oZWlnaHRdPVwiaGVpZ2h0ICsgJ3B4J1wiIFtzdHlsZS53aWR0aF09XCJ3aWR0aCArICdweCdcIj5cbiAgICAgICAgICA8eGh0bWw6c3BhbiBjbGFzcz1cInRyZWVtYXAtbGFiZWxcIiBbaW5uZXJIVE1MXT1cImZvcm1hdHRlZExhYmVsXCI+IDwveGh0bWw6c3Bhbj5cbiAgICAgICAgICA8eGh0bWw6YnIgLz5cbiAgICAgICAgICA8eGh0bWw6c3BhblxuICAgICAgICAgICAgKm5nSWY9XCJhbmltYXRpb25zXCJcbiAgICAgICAgICAgIGNsYXNzPVwidHJlZW1hcC12YWxcIlxuICAgICAgICAgICAgbmd4LWNoYXJ0cy1jb3VudC11cFxuICAgICAgICAgICAgW2NvdW50VG9dPVwidmFsdWVcIlxuICAgICAgICAgICAgW3ZhbHVlRm9ybWF0dGluZ109XCJ2YWx1ZUZvcm1hdHRpbmdcIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L3hodG1sOnNwYW4+XG4gICAgICAgICAgPHhodG1sOnNwYW4gKm5nSWY9XCIhYW5pbWF0aW9uc1wiIGNsYXNzPVwidHJlZW1hcC12YWxcIj5cbiAgICAgICAgICAgIHt7IGZvcm1hdHRlZFZhbHVlIH19XG4gICAgICAgICAgPC94aHRtbDpzcGFuPlxuICAgICAgICA8L3hodG1sOnA+XG4gICAgICA8L3N2Zzpmb3JlaWduT2JqZWN0PlxuICAgIDwvc3ZnOmc+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFRyZWVNYXBDZWxsQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgZGF0YTtcbiAgQElucHV0KCkgZmlsbDtcbiAgQElucHV0KCkgeDtcbiAgQElucHV0KCkgeTtcbiAgQElucHV0KCkgd2lkdGg7XG4gIEBJbnB1dCgpIGhlaWdodDtcbiAgQElucHV0KCkgbGFiZWw7XG4gIEBJbnB1dCgpIHZhbHVlO1xuICBASW5wdXQoKSB2YWx1ZVR5cGU7XG4gIEBJbnB1dCgpIHZhbHVlRm9ybWF0dGluZzogYW55O1xuICBASW5wdXQoKSBsYWJlbEZvcm1hdHRpbmc6IGFueTtcbiAgQElucHV0KCkgZ3JhZGllbnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XG5cbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBncmFkaWVudFN0b3BzOiBhbnlbXTtcbiAgZ3JhZGllbnRJZDogc3RyaW5nO1xuICBncmFkaWVudFVybDogc3RyaW5nO1xuXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICB0cmFuc2Zvcm06IHN0cmluZztcbiAgZm9ybWF0dGVkTGFiZWw6IHN0cmluZztcbiAgZm9ybWF0dGVkVmFsdWU6IHN0cmluZztcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGUoKTtcblxuICAgIHRoaXMudmFsdWVGb3JtYXR0aW5nID0gdGhpcy52YWx1ZUZvcm1hdHRpbmcgfHwgKHZhbHVlID0+IHZhbHVlLnRvTG9jYWxlU3RyaW5nKCkpO1xuICAgIGNvbnN0IGxhYmVsRm9ybWF0dGluZyA9IHRoaXMubGFiZWxGb3JtYXR0aW5nIHx8IChjZWxsID0+IGVzY2FwZUxhYmVsKHRyaW1MYWJlbChjZWxsLmxhYmVsLCA1NSkpKTtcblxuICAgIGNvbnN0IGNlbGxEYXRhID0ge1xuICAgICAgZGF0YTogdGhpcy5kYXRhLFxuICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZVxuICAgIH07XG5cbiAgICB0aGlzLmZvcm1hdHRlZFZhbHVlID0gdGhpcy52YWx1ZUZvcm1hdHRpbmcoY2VsbERhdGEudmFsdWUpO1xuICAgIHRoaXMuZm9ybWF0dGVkTGFiZWwgPSBsYWJlbEZvcm1hdHRpbmcoY2VsbERhdGEpO1xuXG4gICAgdGhpcy5ncmFkaWVudElkID0gJ2dyYWQnICsgaWQoKS50b1N0cmluZygpO1xuICAgIHRoaXMuZ3JhZGllbnRVcmwgPSBgdXJsKCMke3RoaXMuZ3JhZGllbnRJZH0pYDtcbiAgICB0aGlzLmdyYWRpZW50U3RvcHMgPSB0aGlzLmdldEdyYWRpZW50U3RvcHMoKTtcbiAgfVxuXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5hbmltYXRlVG9DdXJyZW50Rm9ybSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5hbmltYXRpb25zKSB7XG4gICAgICAgIHRoaXMubG9hZEFuaW1hdGlvbigpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgbG9hZEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudCkuc2VsZWN0KCcuY2VsbCcpO1xuXG4gICAgbm9kZS5hdHRyKCdvcGFjaXR5JywgMCkuYXR0cigneCcsIHRoaXMueCkuYXR0cigneScsIHRoaXMueSk7XG5cbiAgICB0aGlzLmFuaW1hdGVUb0N1cnJlbnRGb3JtKCk7XG4gIH1cblxuICBnZXRUZXh0Q29sb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW52ZXJ0Q29sb3IodGhpcy5maWxsKTtcbiAgfVxuXG4gIGFuaW1hdGVUb0N1cnJlbnRGb3JtKCk6IHZvaWQge1xuICAgIGNvbnN0IG5vZGUgPSBzZWxlY3QodGhpcy5lbGVtZW50KS5zZWxlY3QoJy5jZWxsJyk7XG5cbiAgICBpZiAodGhpcy5hbmltYXRpb25zKSB7XG4gICAgICBub2RlXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgICAgLmF0dHIoJ29wYWNpdHknLCAxKVxuICAgICAgICAuYXR0cigneCcsIHRoaXMueClcbiAgICAgICAgLmF0dHIoJ3knLCB0aGlzLnkpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuYXR0cignb3BhY2l0eScsIDEpLmF0dHIoJ3gnLCB0aGlzLngpLmF0dHIoJ3knLCB0aGlzLnkpLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aCkuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3QuZW1pdCh0aGlzLmRhdGEpO1xuICB9XG5cbiAgZ2V0R3JhZGllbnRTdG9wcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBvZmZzZXQ6IDAsXG4gICAgICAgIGNvbG9yOiB0aGlzLmZpbGwsXG4gICAgICAgIG9wYWNpdHk6IDAuM1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb2Zmc2V0OiAxMDAsXG4gICAgICAgIGNvbG9yOiB0aGlzLmZpbGwsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH1cbiAgICBdO1xuICB9XG59XG4iXX0=