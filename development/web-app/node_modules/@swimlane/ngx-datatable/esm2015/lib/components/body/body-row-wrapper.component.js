import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, HostListener, DoCheck, ChangeDetectionStrategy, KeyValueDiffer, ChangeDetectorRef, KeyValueDiffers } from '@angular/core';
let DataTableRowWrapperComponent = class DataTableRowWrapperComponent {
    constructor(cd, differs) {
        this.cd = cd;
        this.differs = differs;
        this.rowContextmenu = new EventEmitter(false);
        this.groupContext = {
            group: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this.rowContext = {
            row: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this._expanded = false;
        this.rowDiffer = differs.find({}).create();
    }
    set rowIndex(val) {
        this._rowIndex = val;
        this.rowContext.rowIndex = val;
        this.groupContext.rowIndex = val;
        this.cd.markForCheck();
    }
    get rowIndex() {
        return this._rowIndex;
    }
    set expanded(val) {
        this._expanded = val;
        this.groupContext.expanded = val;
        this.rowContext.expanded = val;
        this.cd.markForCheck();
    }
    get expanded() {
        return this._expanded;
    }
    ngDoCheck() {
        if (this.rowDiffer.diff(this.row)) {
            this.rowContext.row = this.row;
            this.groupContext.group = this.row;
            this.cd.markForCheck();
        }
    }
    onContextmenu($event) {
        this.rowContextmenu.emit({ event: $event, row: this.row });
    }
    getGroupHeaderStyle() {
        const styles = {};
        styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
        styles['backface-visibility'] = 'hidden';
        styles['width'] = this.innerWidth;
        return styles;
    }
};
DataTableRowWrapperComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: KeyValueDiffers }
];
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "innerWidth", void 0);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "rowDetail", void 0);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "groupHeader", void 0);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "offsetX", void 0);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "detailRowHeight", void 0);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "row", void 0);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "groupedRows", void 0);
__decorate([
    Output()
], DataTableRowWrapperComponent.prototype, "rowContextmenu", void 0);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "rowIndex", null);
__decorate([
    Input()
], DataTableRowWrapperComponent.prototype, "expanded", null);
__decorate([
    HostListener('contextmenu', ['$event'])
], DataTableRowWrapperComponent.prototype, "onContextmenu", null);
DataTableRowWrapperComponent = __decorate([
    Component({
        selector: 'datatable-row-wrapper',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `
    <div *ngIf="groupHeader && groupHeader.template" class="datatable-group-header" [ngStyle]="getGroupHeaderStyle()">
      <ng-template
        *ngIf="groupHeader && groupHeader.template"
        [ngTemplateOutlet]="groupHeader.template"
        [ngTemplateOutletContext]="groupContext"
      >
      </ng-template>
    </div>
    <ng-content *ngIf="(groupHeader && groupHeader.template && expanded) || !groupHeader || !groupHeader.template">
    </ng-content>
    <div
      *ngIf="rowDetail && rowDetail.template && expanded"
      [style.height.px]="detailRowHeight"
      class="datatable-row-detail"
    >
      <ng-template
        *ngIf="rowDetail && rowDetail.template"
        [ngTemplateOutlet]="rowDetail.template"
        [ngTemplateOutletContext]="rowContext"
      >
      </ng-template>
    </div>
  `,
        host: {
            class: 'datatable-row-wrapper'
        }
    })
], DataTableRowWrapperComponent);
export { DataTableRowWrapperComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osWUFBWSxFQUNaLE9BQU8sRUFDUCx1QkFBdUIsRUFDdkIsY0FBYyxFQUNkLGlCQUFpQixFQUNqQixlQUFlLEVBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBaUN2QixJQUFhLDRCQUE0QixHQUF6QyxNQUFhLDRCQUE0QjtJQWdEdkMsWUFBb0IsRUFBcUIsRUFBVSxPQUF3QjtRQUF2RCxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBeENqRSxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFrQyxLQUFLLENBQUMsQ0FBQztRQXdCcEYsaUJBQVksR0FBUTtZQUNsQixLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3hCLENBQUM7UUFFRixlQUFVLEdBQVE7WUFDaEIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDO1FBR00sY0FBUyxHQUFZLEtBQUssQ0FBQztRQUlqQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQXhDUSxJQUFJLFFBQVEsQ0FBQyxHQUFXO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDakMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFUSxJQUFJLFFBQVEsQ0FBQyxHQUFZO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDL0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFzQkQsU0FBUztRQUNQLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUdELGFBQWEsQ0FBQyxNQUFrQjtRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxtQkFBbUI7UUFDakIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUM7UUFDdEUsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsUUFBUSxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBRWxDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRixDQUFBOztZQTFCeUIsaUJBQWlCO1lBQW1CLGVBQWU7O0FBL0NsRTtJQUFSLEtBQUssRUFBRTtnRUFBb0I7QUFDbkI7SUFBUixLQUFLLEVBQUU7K0RBQWdCO0FBQ2Y7SUFBUixLQUFLLEVBQUU7aUVBQWtCO0FBQ2pCO0lBQVIsS0FBSyxFQUFFOzZEQUFpQjtBQUNoQjtJQUFSLEtBQUssRUFBRTtxRUFBc0I7QUFDckI7SUFBUixLQUFLLEVBQUU7eURBQVU7QUFDVDtJQUFSLEtBQUssRUFBRTtpRUFBa0I7QUFDaEI7SUFBVCxNQUFNLEVBQUU7b0VBQTJFO0FBRTNFO0lBQVIsS0FBSyxFQUFFOzREQUtQO0FBTVE7SUFBUixLQUFLLEVBQUU7NERBS1A7QUFtQ0Q7SUFEQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7aUVBR3ZDO0FBL0RVLDRCQUE0QjtJQS9CeEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLHVCQUF1QjtRQUNqQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtRQUMvQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJUO1FBQ0QsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLHVCQUF1QjtTQUMvQjtLQUNGLENBQUM7R0FDVyw0QkFBNEIsQ0EwRXhDO1NBMUVZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIERvQ2hlY2ssXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBLZXlWYWx1ZURpZmZlcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEtleVZhbHVlRGlmZmVyc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZGF0YXRhYmxlLXJvdy13cmFwcGVyJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiAqbmdJZj1cImdyb3VwSGVhZGVyICYmIGdyb3VwSGVhZGVyLnRlbXBsYXRlXCIgY2xhc3M9XCJkYXRhdGFibGUtZ3JvdXAtaGVhZGVyXCIgW25nU3R5bGVdPVwiZ2V0R3JvdXBIZWFkZXJTdHlsZSgpXCI+XG4gICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgKm5nSWY9XCJncm91cEhlYWRlciAmJiBncm91cEhlYWRlci50ZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImdyb3VwSGVhZGVyLnRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImdyb3VwQ29udGV4dFwiXG4gICAgICA+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICAgIDxuZy1jb250ZW50ICpuZ0lmPVwiKGdyb3VwSGVhZGVyICYmIGdyb3VwSGVhZGVyLnRlbXBsYXRlICYmIGV4cGFuZGVkKSB8fCAhZ3JvdXBIZWFkZXIgfHwgIWdyb3VwSGVhZGVyLnRlbXBsYXRlXCI+XG4gICAgPC9uZy1jb250ZW50PlxuICAgIDxkaXZcbiAgICAgICpuZ0lmPVwicm93RGV0YWlsICYmIHJvd0RldGFpbC50ZW1wbGF0ZSAmJiBleHBhbmRlZFwiXG4gICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cImRldGFpbFJvd0hlaWdodFwiXG4gICAgICBjbGFzcz1cImRhdGF0YWJsZS1yb3ctZGV0YWlsXCJcbiAgICA+XG4gICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgKm5nSWY9XCJyb3dEZXRhaWwgJiYgcm93RGV0YWlsLnRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwicm93RGV0YWlsLnRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInJvd0NvbnRleHRcIlxuICAgICAgPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnZGF0YXRhYmxlLXJvdy13cmFwcGVyJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZVJvd1dyYXBwZXJDb21wb25lbnQgaW1wbGVtZW50cyBEb0NoZWNrIHtcbiAgQElucHV0KCkgaW5uZXJXaWR0aDogbnVtYmVyO1xuICBASW5wdXQoKSByb3dEZXRhaWw6IGFueTtcbiAgQElucHV0KCkgZ3JvdXBIZWFkZXI6IGFueTtcbiAgQElucHV0KCkgb2Zmc2V0WDogbnVtYmVyO1xuICBASW5wdXQoKSBkZXRhaWxSb3dIZWlnaHQ6IGFueTtcbiAgQElucHV0KCkgcm93OiBhbnk7XG4gIEBJbnB1dCgpIGdyb3VwZWRSb3dzOiBhbnk7XG4gIEBPdXRwdXQoKSByb3dDb250ZXh0bWVudSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogTW91c2VFdmVudDsgcm93OiBhbnkgfT4oZmFsc2UpO1xuXG4gIEBJbnB1dCgpIHNldCByb3dJbmRleCh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX3Jvd0luZGV4ID0gdmFsO1xuICAgIHRoaXMucm93Q29udGV4dC5yb3dJbmRleCA9IHZhbDtcbiAgICB0aGlzLmdyb3VwQ29udGV4dC5yb3dJbmRleCA9IHZhbDtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IHJvd0luZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd0luZGV4O1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGV4cGFuZGVkKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuX2V4cGFuZGVkID0gdmFsO1xuICAgIHRoaXMuZ3JvdXBDb250ZXh0LmV4cGFuZGVkID0gdmFsO1xuICAgIHRoaXMucm93Q29udGV4dC5leHBhbmRlZCA9IHZhbDtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9leHBhbmRlZDtcbiAgfVxuXG4gIGdyb3VwQ29udGV4dDogYW55ID0ge1xuICAgIGdyb3VwOiB0aGlzLnJvdyxcbiAgICBleHBhbmRlZDogdGhpcy5leHBhbmRlZCxcbiAgICByb3dJbmRleDogdGhpcy5yb3dJbmRleFxuICB9O1xuXG4gIHJvd0NvbnRleHQ6IGFueSA9IHtcbiAgICByb3c6IHRoaXMucm93LFxuICAgIGV4cGFuZGVkOiB0aGlzLmV4cGFuZGVkLFxuICAgIHJvd0luZGV4OiB0aGlzLnJvd0luZGV4XG4gIH07XG5cbiAgcHJpdmF0ZSByb3dEaWZmZXI6IEtleVZhbHVlRGlmZmVyPHt9LCB7fT47XG4gIHByaXZhdGUgX2V4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX3Jvd0luZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzKSB7XG4gICAgdGhpcy5yb3dEaWZmZXIgPSBkaWZmZXJzLmZpbmQoe30pLmNyZWF0ZSgpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvd0RpZmZlci5kaWZmKHRoaXMucm93KSkge1xuICAgICAgdGhpcy5yb3dDb250ZXh0LnJvdyA9IHRoaXMucm93O1xuICAgICAgdGhpcy5ncm91cENvbnRleHQuZ3JvdXAgPSB0aGlzLnJvdztcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnLCBbJyRldmVudCddKVxuICBvbkNvbnRleHRtZW51KCRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMucm93Q29udGV4dG1lbnUuZW1pdCh7IGV2ZW50OiAkZXZlbnQsIHJvdzogdGhpcy5yb3cgfSk7XG4gIH1cblxuICBnZXRHcm91cEhlYWRlclN0eWxlKCk6IGFueSB7XG4gICAgY29uc3Qgc3R5bGVzID0ge307XG5cbiAgICBzdHlsZXNbJ3RyYW5zZm9ybSddID0gJ3RyYW5zbGF0ZTNkKCcgKyB0aGlzLm9mZnNldFggKyAncHgsIDBweCwgMHB4KSc7XG4gICAgc3R5bGVzWydiYWNrZmFjZS12aXNpYmlsaXR5J10gPSAnaGlkZGVuJztcbiAgICBzdHlsZXNbJ3dpZHRoJ10gPSB0aGlzLmlubmVyV2lkdGg7XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG59XG4iXX0=