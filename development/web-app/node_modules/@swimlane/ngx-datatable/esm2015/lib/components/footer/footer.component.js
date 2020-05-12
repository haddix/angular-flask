import { __decorate } from "tslib";
import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
let DataTableFooterComponent = class DataTableFooterComponent {
    constructor() {
        this.selectedCount = 0;
        this.page = new EventEmitter();
    }
    get isVisible() {
        return this.rowCount / this.pageSize > 1;
    }
    get curPage() {
        return this.offset + 1;
    }
};
__decorate([
    Input()
], DataTableFooterComponent.prototype, "footerHeight", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "rowCount", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "pageSize", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "offset", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "pagerLeftArrowIcon", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "pagerRightArrowIcon", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "pagerPreviousIcon", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "pagerNextIcon", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "totalMessage", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "footerTemplate", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "selectedCount", void 0);
__decorate([
    Input()
], DataTableFooterComponent.prototype, "selectedMessage", void 0);
__decorate([
    Output()
], DataTableFooterComponent.prototype, "page", void 0);
DataTableFooterComponent = __decorate([
    Component({
        selector: 'datatable-footer',
        template: `
    <div
      class="datatable-footer-inner"
      [ngClass]="{ 'selected-count': selectedMessage }"
      [style.height.px]="footerHeight"
    >
      <ng-template
        *ngIf="footerTemplate"
        [ngTemplateOutlet]="footerTemplate.template"
        [ngTemplateOutletContext]="{
          rowCount: rowCount,
          pageSize: pageSize,
          selectedCount: selectedCount,
          curPage: curPage,
          offset: offset
        }"
      >
      </ng-template>
      <div class="page-count" *ngIf="!footerTemplate">
        <span *ngIf="selectedMessage"> {{ selectedCount?.toLocaleString() }} {{ selectedMessage }} / </span>
        {{ rowCount?.toLocaleString() }} {{ totalMessage }}
      </div>
      <datatable-pager
        *ngIf="!footerTemplate"
        [pagerLeftArrowIcon]="pagerLeftArrowIcon"
        [pagerRightArrowIcon]="pagerRightArrowIcon"
        [pagerPreviousIcon]="pagerPreviousIcon"
        [pagerNextIcon]="pagerNextIcon"
        [page]="curPage"
        [size]="pageSize"
        [count]="rowCount"
        [hidden]="!isVisible"
        (change)="page.emit($event)"
      >
      </datatable-pager>
    </div>
  `,
        host: {
            class: 'datatable-footer'
        },
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], DataTableFooterComponent);
export { DataTableFooterComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUE4Q2hHLElBQWEsd0JBQXdCLEdBQXJDLE1BQWEsd0JBQXdCO0lBQXJDO1FBWVcsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFHekIsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBU3pELENBQUM7SUFQQyxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztDQUNGLENBQUE7QUF2QlU7SUFBUixLQUFLLEVBQUU7OERBQXNCO0FBQ3JCO0lBQVIsS0FBSyxFQUFFOzBEQUFrQjtBQUNqQjtJQUFSLEtBQUssRUFBRTswREFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7d0RBQWdCO0FBQ2Y7SUFBUixLQUFLLEVBQUU7b0VBQTRCO0FBQzNCO0lBQVIsS0FBSyxFQUFFO3FFQUE2QjtBQUM1QjtJQUFSLEtBQUssRUFBRTttRUFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7K0RBQXVCO0FBQ3RCO0lBQVIsS0FBSyxFQUFFOzhEQUFzQjtBQUNyQjtJQUFSLEtBQUssRUFBRTtnRUFBMEM7QUFFekM7SUFBUixLQUFLLEVBQUU7K0RBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFO2lFQUFtQztBQUVqQztJQUFULE1BQU0sRUFBRTtzREFBOEM7QUFmNUMsd0JBQXdCO0lBNUNwQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0NUO1FBQ0QsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLGtCQUFrQjtTQUMxQjtRQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO0tBQ2hELENBQUM7R0FDVyx3QkFBd0IsQ0F3QnBDO1NBeEJZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YXRhYmxlRm9vdGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9mb290ZXIuZGlyZWN0aXZlJztcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RhdGF0YWJsZS1mb290ZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiZGF0YXRhYmxlLWZvb3Rlci1pbm5lclwiXG4gICAgICBbbmdDbGFzc109XCJ7ICdzZWxlY3RlZC1jb3VudCc6IHNlbGVjdGVkTWVzc2FnZSB9XCJcbiAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiZm9vdGVySGVpZ2h0XCJcbiAgICA+XG4gICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgKm5nSWY9XCJmb290ZXJUZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvb3RlclRlbXBsYXRlLnRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgICByb3dDb3VudDogcm93Q291bnQsXG4gICAgICAgICAgcGFnZVNpemU6IHBhZ2VTaXplLFxuICAgICAgICAgIHNlbGVjdGVkQ291bnQ6IHNlbGVjdGVkQ291bnQsXG4gICAgICAgICAgY3VyUGFnZTogY3VyUGFnZSxcbiAgICAgICAgICBvZmZzZXQ6IG9mZnNldFxuICAgICAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8ZGl2IGNsYXNzPVwicGFnZS1jb3VudFwiICpuZ0lmPVwiIWZvb3RlclRlbXBsYXRlXCI+XG4gICAgICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWRNZXNzYWdlXCI+IHt7IHNlbGVjdGVkQ291bnQ/LnRvTG9jYWxlU3RyaW5nKCkgfX0ge3sgc2VsZWN0ZWRNZXNzYWdlIH19IC8gPC9zcGFuPlxuICAgICAgICB7eyByb3dDb3VudD8udG9Mb2NhbGVTdHJpbmcoKSB9fSB7eyB0b3RhbE1lc3NhZ2UgfX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRhdGF0YWJsZS1wYWdlclxuICAgICAgICAqbmdJZj1cIiFmb290ZXJUZW1wbGF0ZVwiXG4gICAgICAgIFtwYWdlckxlZnRBcnJvd0ljb25dPVwicGFnZXJMZWZ0QXJyb3dJY29uXCJcbiAgICAgICAgW3BhZ2VyUmlnaHRBcnJvd0ljb25dPVwicGFnZXJSaWdodEFycm93SWNvblwiXG4gICAgICAgIFtwYWdlclByZXZpb3VzSWNvbl09XCJwYWdlclByZXZpb3VzSWNvblwiXG4gICAgICAgIFtwYWdlck5leHRJY29uXT1cInBhZ2VyTmV4dEljb25cIlxuICAgICAgICBbcGFnZV09XCJjdXJQYWdlXCJcbiAgICAgICAgW3NpemVdPVwicGFnZVNpemVcIlxuICAgICAgICBbY291bnRdPVwicm93Q291bnRcIlxuICAgICAgICBbaGlkZGVuXT1cIiFpc1Zpc2libGVcIlxuICAgICAgICAoY2hhbmdlKT1cInBhZ2UuZW1pdCgkZXZlbnQpXCJcbiAgICAgID5cbiAgICAgIDwvZGF0YXRhYmxlLXBhZ2VyPlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdkYXRhdGFibGUtZm9vdGVyJ1xuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVGb290ZXJDb21wb25lbnQge1xuICBASW5wdXQoKSBmb290ZXJIZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgcm93Q291bnQ6IG51bWJlcjtcbiAgQElucHV0KCkgcGFnZVNpemU6IG51bWJlcjtcbiAgQElucHV0KCkgb2Zmc2V0OiBudW1iZXI7XG4gIEBJbnB1dCgpIHBhZ2VyTGVmdEFycm93SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBwYWdlclJpZ2h0QXJyb3dJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBhZ2VyUHJldmlvdXNJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBhZ2VyTmV4dEljb246IHN0cmluZztcbiAgQElucHV0KCkgdG90YWxNZXNzYWdlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGZvb3RlclRlbXBsYXRlOiBEYXRhdGFibGVGb290ZXJEaXJlY3RpdmU7XG5cbiAgQElucHV0KCkgc2VsZWN0ZWRDb3VudDogbnVtYmVyID0gMDtcbiAgQElucHV0KCkgc2VsZWN0ZWRNZXNzYWdlOiBzdHJpbmcgfCBib29sZWFuO1xuXG4gIEBPdXRwdXQoKSBwYWdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJvd0NvdW50IC8gdGhpcy5wYWdlU2l6ZSA+IDE7XG4gIH1cblxuICBnZXQgY3VyUGFnZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9mZnNldCArIDE7XG4gIH1cbn1cbiJdfQ==