import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
let DataTablePagerComponent = class DataTablePagerComponent {
    constructor() {
        this.change = new EventEmitter();
        this._count = 0;
        this._page = 1;
        this._size = 0;
    }
    set size(val) {
        this._size = val;
        this.pages = this.calcPages();
    }
    get size() {
        return this._size;
    }
    set count(val) {
        this._count = val;
        this.pages = this.calcPages();
    }
    get count() {
        return this._count;
    }
    set page(val) {
        this._page = val;
        this.pages = this.calcPages();
    }
    get page() {
        return this._page;
    }
    get totalPages() {
        const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
        return Math.max(count || 0, 1);
    }
    canPrevious() {
        return this.page > 1;
    }
    canNext() {
        return this.page < this.totalPages;
    }
    prevPage() {
        this.selectPage(this.page - 1);
    }
    nextPage() {
        this.selectPage(this.page + 1);
    }
    selectPage(page) {
        if (page > 0 && page <= this.totalPages && page !== this.page) {
            this.page = page;
            this.change.emit({
                page
            });
        }
    }
    calcPages(page) {
        const pages = [];
        let startPage = 1;
        let endPage = this.totalPages;
        const maxSize = 5;
        const isMaxSized = maxSize < this.totalPages;
        page = page || this.page;
        if (isMaxSized) {
            startPage = page - Math.floor(maxSize / 2);
            endPage = page + Math.floor(maxSize / 2);
            if (startPage < 1) {
                startPage = 1;
                endPage = Math.min(startPage + maxSize - 1, this.totalPages);
            }
            else if (endPage > this.totalPages) {
                startPage = Math.max(this.totalPages - maxSize + 1, 1);
                endPage = this.totalPages;
            }
        }
        for (let num = startPage; num <= endPage; num++) {
            pages.push({
                number: num,
                text: num
            });
        }
        return pages;
    }
};
__decorate([
    Input()
], DataTablePagerComponent.prototype, "pagerLeftArrowIcon", void 0);
__decorate([
    Input()
], DataTablePagerComponent.prototype, "pagerRightArrowIcon", void 0);
__decorate([
    Input()
], DataTablePagerComponent.prototype, "pagerPreviousIcon", void 0);
__decorate([
    Input()
], DataTablePagerComponent.prototype, "pagerNextIcon", void 0);
__decorate([
    Input()
], DataTablePagerComponent.prototype, "size", null);
__decorate([
    Input()
], DataTablePagerComponent.prototype, "count", null);
__decorate([
    Input()
], DataTablePagerComponent.prototype, "page", null);
__decorate([
    Output()
], DataTablePagerComponent.prototype, "change", void 0);
DataTablePagerComponent = __decorate([
    Component({
        selector: 'datatable-pager',
        template: `
    <ul class="pager">
      <li [class.disabled]="!canPrevious()">
        <a role="button" aria-label="go to first page" href="javascript:void(0)" (click)="selectPage(1)">
          <i class="{{ pagerPreviousIcon }}"></i>
        </a>
      </li>
      <li [class.disabled]="!canPrevious()">
        <a role="button" aria-label="go to previous page" href="javascript:void(0)" (click)="prevPage()">
          <i class="{{ pagerLeftArrowIcon }}"></i>
        </a>
      </li>
      <li
        role="button"
        [attr.aria-label]="'page ' + pg.number"
        class="pages"
        *ngFor="let pg of pages"
        [class.active]="pg.number === page"
      >
        <a href="javascript:void(0)" (click)="selectPage(pg.number)">
          {{ pg.text }}
        </a>
      </li>
      <li [class.disabled]="!canNext()">
        <a role="button" aria-label="go to next page" href="javascript:void(0)" (click)="nextPage()">
          <i class="{{ pagerRightArrowIcon }}"></i>
        </a>
      </li>
      <li [class.disabled]="!canNext()">
        <a role="button" aria-label="go to last page" href="javascript:void(0)" (click)="selectPage(totalPages)">
          <i class="{{ pagerNextIcon }}"></i>
        </a>
      </li>
    </ul>
  `,
        host: {
            class: 'datatable-pager'
        },
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], DataTablePagerComponent);
export { DataTablePagerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9mb290ZXIvcGFnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBNENoRyxJQUFhLHVCQUF1QixHQUFwQyxNQUFhLHVCQUF1QjtJQUFwQztRQXlDWSxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFekQsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFVBQUssR0FBVyxDQUFDLENBQUM7SUE0RHBCLENBQUM7SUFsR0MsSUFBSSxJQUFJLENBQUMsR0FBVztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFHRCxJQUFJLEtBQUssQ0FBQyxHQUFXO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUdELElBQUksSUFBSSxDQUFDLEdBQVc7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJ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QUssRUFBRTtvRUFBNkI7QUFDNUI7SUFBUixLQUFLLEVBQUU7a0VBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFOzhEQUF1QjtBQUcvQjtJQURDLEtBQUssRUFBRTttREFJUDtBQU9EO0lBREMsS0FBSyxFQUFFO29EQUlQO0FBT0Q7SUFEQyxLQUFLLEVBQUU7bURBSVA7QUFXUztJQUFULE1BQU0sRUFBRTt1REFBZ0Q7QUF6QzlDLHVCQUF1QjtJQTFDbkMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGlCQUFpQjtRQUMzQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ1Q7UUFDRCxJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUUsaUJBQWlCO1NBQ3pCO1FBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07S0FDaEQsQ0FBQztHQUNXLHVCQUF1QixDQXlHbkM7U0F6R1ksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RhdGF0YWJsZS1wYWdlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwicGFnZXJcIj5cbiAgICAgIDxsaSBbY2xhc3MuZGlzYWJsZWRdPVwiIWNhblByZXZpb3VzKClcIj5cbiAgICAgICAgPGEgcm9sZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9XCJnbyB0byBmaXJzdCBwYWdlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIChjbGljayk9XCJzZWxlY3RQYWdlKDEpXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJ7eyBwYWdlclByZXZpb3VzSWNvbiB9fVwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaSBbY2xhc3MuZGlzYWJsZWRdPVwiIWNhblByZXZpb3VzKClcIj5cbiAgICAgICAgPGEgcm9sZT1cImJ1dHRvblwiIGFyaWEtbGFiZWw9XCJnbyB0byBwcmV2aW91cyBwYWdlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIChjbGljayk9XCJwcmV2UGFnZSgpXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJ7eyBwYWdlckxlZnRBcnJvd0ljb24gfX1cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8bGlcbiAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiJ3BhZ2UgJyArIHBnLm51bWJlclwiXG4gICAgICAgIGNsYXNzPVwicGFnZXNcIlxuICAgICAgICAqbmdGb3I9XCJsZXQgcGcgb2YgcGFnZXNcIlxuICAgICAgICBbY2xhc3MuYWN0aXZlXT1cInBnLm51bWJlciA9PT0gcGFnZVwiXG4gICAgICA+XG4gICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiAoY2xpY2spPVwic2VsZWN0UGFnZShwZy5udW1iZXIpXCI+XG4gICAgICAgICAge3sgcGcudGV4dCB9fVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIFtjbGFzcy5kaXNhYmxlZF09XCIhY2FuTmV4dCgpXCI+XG4gICAgICAgIDxhIHJvbGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPVwiZ28gdG8gbmV4dCBwYWdlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIChjbGljayk9XCJuZXh0UGFnZSgpXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJ7eyBwYWdlclJpZ2h0QXJyb3dJY29uIH19XCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIFtjbGFzcy5kaXNhYmxlZF09XCIhY2FuTmV4dCgpXCI+XG4gICAgICAgIDxhIHJvbGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPVwiZ28gdG8gbGFzdCBwYWdlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIChjbGljayk9XCJzZWxlY3RQYWdlKHRvdGFsUGFnZXMpXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJ7eyBwYWdlck5leHRJY29uIH19XCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ2RhdGF0YWJsZS1wYWdlcidcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlUGFnZXJDb21wb25lbnQge1xuICBASW5wdXQoKSBwYWdlckxlZnRBcnJvd0ljb246IHN0cmluZztcbiAgQElucHV0KCkgcGFnZXJSaWdodEFycm93SWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBwYWdlclByZXZpb3VzSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKSBwYWdlck5leHRJY29uOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IHNpemUodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9zaXplID0gdmFsO1xuICAgIHRoaXMucGFnZXMgPSB0aGlzLmNhbGNQYWdlcygpO1xuICB9XG5cbiAgZ2V0IHNpemUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBjb3VudCh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX2NvdW50ID0gdmFsO1xuICAgIHRoaXMucGFnZXMgPSB0aGlzLmNhbGNQYWdlcygpO1xuICB9XG5cbiAgZ2V0IGNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50O1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHBhZ2UodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wYWdlID0gdmFsO1xuICAgIHRoaXMucGFnZXMgPSB0aGlzLmNhbGNQYWdlcygpO1xuICB9XG5cbiAgZ2V0IHBhZ2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZTtcbiAgfVxuXG4gIGdldCB0b3RhbFBhZ2VzKCk6IG51bWJlciB7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLnNpemUgPCAxID8gMSA6IE1hdGguY2VpbCh0aGlzLmNvdW50IC8gdGhpcy5zaXplKTtcbiAgICByZXR1cm4gTWF0aC5tYXgoY291bnQgfHwgMCwgMSk7XG4gIH1cblxuICBAT3V0cHV0KCkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBfY291bnQ6IG51bWJlciA9IDA7XG4gIF9wYWdlOiBudW1iZXIgPSAxO1xuICBfc2l6ZTogbnVtYmVyID0gMDtcbiAgcGFnZXM6IGFueTtcblxuICBjYW5QcmV2aW91cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlID4gMTtcbiAgfVxuXG4gIGNhbk5leHQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFnZSA8IHRoaXMudG90YWxQYWdlcztcbiAgfVxuXG4gIHByZXZQYWdlKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0UGFnZSh0aGlzLnBhZ2UgLSAxKTtcbiAgfVxuXG4gIG5leHRQYWdlKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0UGFnZSh0aGlzLnBhZ2UgKyAxKTtcbiAgfVxuXG4gIHNlbGVjdFBhZ2UocGFnZTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHBhZ2UgPiAwICYmIHBhZ2UgPD0gdGhpcy50b3RhbFBhZ2VzICYmIHBhZ2UgIT09IHRoaXMucGFnZSkge1xuICAgICAgdGhpcy5wYWdlID0gcGFnZTtcblxuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgIHBhZ2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNhbGNQYWdlcyhwYWdlPzogbnVtYmVyKTogYW55W10ge1xuICAgIGNvbnN0IHBhZ2VzID0gW107XG4gICAgbGV0IHN0YXJ0UGFnZSA9IDE7XG4gICAgbGV0IGVuZFBhZ2UgPSB0aGlzLnRvdGFsUGFnZXM7XG4gICAgY29uc3QgbWF4U2l6ZSA9IDU7XG4gICAgY29uc3QgaXNNYXhTaXplZCA9IG1heFNpemUgPCB0aGlzLnRvdGFsUGFnZXM7XG5cbiAgICBwYWdlID0gcGFnZSB8fCB0aGlzLnBhZ2U7XG5cbiAgICBpZiAoaXNNYXhTaXplZCkge1xuICAgICAgc3RhcnRQYWdlID0gcGFnZSAtIE1hdGguZmxvb3IobWF4U2l6ZSAvIDIpO1xuICAgICAgZW5kUGFnZSA9IHBhZ2UgKyBNYXRoLmZsb29yKG1heFNpemUgLyAyKTtcblxuICAgICAgaWYgKHN0YXJ0UGFnZSA8IDEpIHtcbiAgICAgICAgc3RhcnRQYWdlID0gMTtcbiAgICAgICAgZW5kUGFnZSA9IE1hdGgubWluKHN0YXJ0UGFnZSArIG1heFNpemUgLSAxLCB0aGlzLnRvdGFsUGFnZXMpO1xuICAgICAgfSBlbHNlIGlmIChlbmRQYWdlID4gdGhpcy50b3RhbFBhZ2VzKSB7XG4gICAgICAgIHN0YXJ0UGFnZSA9IE1hdGgubWF4KHRoaXMudG90YWxQYWdlcyAtIG1heFNpemUgKyAxLCAxKTtcbiAgICAgICAgZW5kUGFnZSA9IHRoaXMudG90YWxQYWdlcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBudW0gPSBzdGFydFBhZ2U7IG51bSA8PSBlbmRQYWdlOyBudW0rKykge1xuICAgICAgcGFnZXMucHVzaCh7XG4gICAgICAgIG51bWJlcjogbnVtLFxuICAgICAgICB0ZXh0OiA8c3RyaW5nPig8YW55Pm51bSlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwYWdlcztcbiAgfVxufVxuIl19