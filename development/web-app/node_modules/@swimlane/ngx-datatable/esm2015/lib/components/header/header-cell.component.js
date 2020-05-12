import { __decorate } from "tslib";
import { Component, Input, EventEmitter, Output, HostBinding, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SelectionType } from '../../types/selection.type';
import { nextSortDir } from '../../utils/sort';
import { SortDirection } from '../../types/sort-direction.type';
let DataTableHeaderCellComponent = class DataTableHeaderCellComponent {
    constructor(cd) {
        this.cd = cd;
        this.sort = new EventEmitter();
        this.select = new EventEmitter();
        this.columnContextmenu = new EventEmitter(false);
        this.sortFn = this.onSort.bind(this);
        this.selectFn = this.select.emit.bind(this.select);
        this.cellContext = {
            column: this.column,
            sortDir: this.sortDir,
            sortFn: this.sortFn,
            allRowsSelected: this.allRowsSelected,
            selectFn: this.selectFn
        };
    }
    set allRowsSelected(value) {
        this._allRowsSelected = value;
        this.cellContext.allRowsSelected = value;
    }
    get allRowsSelected() {
        return this._allRowsSelected;
    }
    set column(column) {
        this._column = column;
        this.cellContext.column = column;
        this.cd.markForCheck();
    }
    get column() {
        return this._column;
    }
    set sorts(val) {
        this._sorts = val;
        this.sortDir = this.calcSortDir(val);
        this.cellContext.sortDir = this.sortDir;
        this.sortClass = this.calcSortClass(this.sortDir);
        this.cd.markForCheck();
    }
    get sorts() {
        return this._sorts;
    }
    get columnCssClasses() {
        let cls = 'datatable-header-cell';
        if (this.column.sortable)
            cls += ' sortable';
        if (this.column.resizeable)
            cls += ' resizeable';
        if (this.column.headerClass) {
            if (typeof this.column.headerClass === 'string') {
                cls += ' ' + this.column.headerClass;
            }
            else if (typeof this.column.headerClass === 'function') {
                const res = this.column.headerClass({
                    column: this.column
                });
                if (typeof res === 'string') {
                    cls += res;
                }
                else if (typeof res === 'object') {
                    const keys = Object.keys(res);
                    for (const k of keys) {
                        if (res[k] === true)
                            cls += ` ${k}`;
                    }
                }
            }
        }
        const sortDir = this.sortDir;
        if (sortDir) {
            cls += ` sort-active sort-${sortDir}`;
        }
        return cls;
    }
    get name() {
        // guaranteed to have a value by setColumnDefaults() in column-helper.ts
        return this.column.headerTemplate === undefined ? this.column.name : undefined;
    }
    get minWidth() {
        return this.column.minWidth;
    }
    get maxWidth() {
        return this.column.maxWidth;
    }
    get width() {
        return this.column.width;
    }
    get isCheckboxable() {
        return this.column.checkboxable && this.column.headerCheckboxable && this.selectionType === SelectionType.checkbox;
    }
    onContextmenu($event) {
        this.columnContextmenu.emit({ event: $event, column: this.column });
    }
    calcSortDir(sorts) {
        if (sorts && this.column) {
            const sort = sorts.find((s) => {
                return s.prop === this.column.prop;
            });
            if (sort)
                return sort.dir;
        }
    }
    onSort() {
        if (!this.column.sortable)
            return;
        const newValue = nextSortDir(this.sortType, this.sortDir);
        this.sort.emit({
            column: this.column,
            prevValue: this.sortDir,
            newValue
        });
    }
    calcSortClass(sortDir) {
        if (sortDir === SortDirection.asc) {
            return `sort-btn sort-asc ${this.sortAscendingIcon}`;
        }
        else if (sortDir === SortDirection.desc) {
            return `sort-btn sort-desc ${this.sortDescendingIcon}`;
        }
        else {
            return `sort-btn`;
        }
    }
};
DataTableHeaderCellComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "sortType", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "sortAscendingIcon", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "sortDescendingIcon", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "isTarget", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "targetMarkerTemplate", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "targetMarkerContext", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "allRowsSelected", null);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "selectionType", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "column", null);
__decorate([
    HostBinding('style.height.px'),
    Input()
], DataTableHeaderCellComponent.prototype, "headerHeight", void 0);
__decorate([
    Input()
], DataTableHeaderCellComponent.prototype, "sorts", null);
__decorate([
    Output()
], DataTableHeaderCellComponent.prototype, "sort", void 0);
__decorate([
    Output()
], DataTableHeaderCellComponent.prototype, "select", void 0);
__decorate([
    Output()
], DataTableHeaderCellComponent.prototype, "columnContextmenu", void 0);
__decorate([
    HostBinding('class')
], DataTableHeaderCellComponent.prototype, "columnCssClasses", null);
__decorate([
    HostBinding('attr.title')
], DataTableHeaderCellComponent.prototype, "name", null);
__decorate([
    HostBinding('style.minWidth.px')
], DataTableHeaderCellComponent.prototype, "minWidth", null);
__decorate([
    HostBinding('style.maxWidth.px')
], DataTableHeaderCellComponent.prototype, "maxWidth", null);
__decorate([
    HostBinding('style.width.px')
], DataTableHeaderCellComponent.prototype, "width", null);
__decorate([
    HostListener('contextmenu', ['$event'])
], DataTableHeaderCellComponent.prototype, "onContextmenu", null);
DataTableHeaderCellComponent = __decorate([
    Component({
        selector: 'datatable-header-cell',
        template: `
    <div class="datatable-header-cell-template-wrap">
      <ng-template
        *ngIf="isTarget"
        [ngTemplateOutlet]="targetMarkerTemplate"
        [ngTemplateOutletContext]="targetMarkerContext"
      >
      </ng-template>
      <label *ngIf="isCheckboxable" class="datatable-checkbox">
        <input type="checkbox" [checked]="allRowsSelected" (change)="select.emit(!allRowsSelected)" />
      </label>
      <span *ngIf="!column.headerTemplate" class="datatable-header-cell-wrapper">
        <span class="datatable-header-cell-label draggable" (click)="onSort()" [innerHTML]="name"> </span>
      </span>
      <ng-template
        *ngIf="column.headerTemplate"
        [ngTemplateOutlet]="column.headerTemplate"
        [ngTemplateOutletContext]="cellContext"
      >
      </ng-template>
      <span (click)="onSort()" [class]="sortClass"> </span>
    </div>
  `,
        host: {
            class: 'datatable-header-cell'
        },
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], DataTableHeaderCellComponent);
export { DataTableHeaderCellComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWNlbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLWNlbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxZQUFZLEVBQ1osTUFBTSxFQUNOLFdBQVcsRUFDWCxZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFM0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQWdDaEUsSUFBYSw0QkFBNEIsR0FBekMsTUFBYSw0QkFBNEI7SUE2SHZDLFlBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBOUUvQixTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0MsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQy9DLHNCQUFpQixHQUFHLElBQUksWUFBWSxDQUFxQyxLQUFLLENBQUMsQ0FBQztRQTREMUYsV0FBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR2hDLGFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLGdCQUFXLEdBQVE7WUFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1lBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDO0lBSzBDLENBQUM7SUFsSHBDLElBQUksZUFBZSxDQUFDLEtBQUs7UUFDaEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDM0MsQ0FBQztJQUNELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBSVEsSUFBSSxNQUFNLENBQUMsTUFBbUI7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBTVEsSUFBSSxLQUFLLENBQUMsR0FBVTtRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBT0QsSUFBSSxnQkFBZ0I7UUFDbEIsSUFBSSxHQUFHLEdBQUcsdUJBQXVCLENBQUM7UUFFbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFBRSxHQUFHLElBQUksV0FBVyxDQUFDO1FBQzdDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO1lBQUUsR0FBRyxJQUFJLGFBQWEsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO1lBQzNCLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7Z0JBQy9DLEdBQUcsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7YUFDdEM7aUJBQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRTtnQkFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7b0JBQ2xDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDcEIsQ0FBQyxDQUFDO2dCQUVILElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO29CQUMzQixHQUFHLElBQUksR0FBRyxDQUFDO2lCQUNaO3FCQUFNLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO29CQUNsQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM5QixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTt3QkFDcEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTs0QkFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQztxQkFDckM7aUJBQ0Y7YUFDRjtTQUNGO1FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLE9BQU8sRUFBRTtZQUNYLEdBQUcsSUFBSSxxQkFBcUIsT0FBTyxFQUFFLENBQUM7U0FDdkM7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFHRCxJQUFJLElBQUk7UUFDTix3RUFBd0U7UUFDeEUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDakYsQ0FBQztJQUdELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUdELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUdELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ3JILENBQUM7SUFxQkQsYUFBYSxDQUFDLE1BQWtCO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQVk7UUFDdEIsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN4QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7Z0JBQ2pDLE9BQU8sQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksSUFBSTtnQkFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFBRSxPQUFPO1FBRWxDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNiLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDdkIsUUFBUTtTQUNULENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxhQUFhLENBQUMsT0FBc0I7UUFDbEMsSUFBSSxPQUFPLEtBQUssYUFBYSxDQUFDLEdBQUcsRUFBRTtZQUNqQyxPQUFPLHFCQUFxQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUN0RDthQUFNLElBQUksT0FBTyxLQUFLLGFBQWEsQ0FBQyxJQUFJLEVBQUU7WUFDekMsT0FBTyxzQkFBc0IsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7U0FDeEQ7YUFBTTtZQUNMLE9BQU8sVUFBVSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztDQUNGLENBQUE7O1lBckN5QixpQkFBaUI7O0FBNUhoQztJQUFSLEtBQUssRUFBRTs4REFBb0I7QUFDbkI7SUFBUixLQUFLLEVBQUU7dUVBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFO3dFQUE0QjtBQUUzQjtJQUFSLEtBQUssRUFBRTs4REFBbUI7QUFDbEI7SUFBUixLQUFLLEVBQUU7MEVBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFO3lFQUEwQjtBQUl6QjtJQUFSLEtBQUssRUFBRTttRUFHUDtBQUtRO0lBQVIsS0FBSyxFQUFFO21FQUE4QjtBQUU3QjtJQUFSLEtBQUssRUFBRTswREFJUDtBQVFEO0lBRkMsV0FBVyxDQUFDLGlCQUFpQixDQUFDO0lBQzlCLEtBQUssRUFBRTtrRUFDYTtBQUVaO0lBQVIsS0FBSyxFQUFFO3lEQU1QO0FBTVM7SUFBVCxNQUFNLEVBQUU7MERBQThDO0FBQzdDO0lBQVQsTUFBTSxFQUFFOzREQUFnRDtBQUMvQztJQUFULE1BQU0sRUFBRTt1RUFBaUY7QUFHMUY7SUFEQyxXQUFXLENBQUMsT0FBTyxDQUFDO29FQStCcEI7QUFHRDtJQURDLFdBQVcsQ0FBQyxZQUFZLENBQUM7d0RBSXpCO0FBR0Q7SUFEQyxXQUFXLENBQUMsbUJBQW1CLENBQUM7NERBR2hDO0FBR0Q7SUFEQyxXQUFXLENBQUMsbUJBQW1CLENBQUM7NERBR2hDO0FBR0Q7SUFEQyxXQUFXLENBQUMsZ0JBQWdCLENBQUM7eURBRzdCO0FBeUJEO0lBREMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lFQUd2QztBQWxJVSw0QkFBNEI7SUE5QnhDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSx1QkFBdUI7UUFDakMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JUO1FBQ0QsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLHVCQUF1QjtTQUMvQjtRQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO0tBQ2hELENBQUM7R0FDVyw0QkFBNEIsQ0FrS3hDO1NBbEtZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTb3J0VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL3NvcnQudHlwZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvc2VsZWN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgVGFibGVDb2x1bW4gfSBmcm9tICcuLi8uLi90eXBlcy90YWJsZS1jb2x1bW4udHlwZSc7XG5pbXBvcnQgeyBuZXh0U29ydERpciB9IGZyb20gJy4uLy4uL3V0aWxzL3NvcnQnO1xuaW1wb3J0IHsgU29ydERpcmVjdGlvbiB9IGZyb20gJy4uLy4uL3R5cGVzL3NvcnQtZGlyZWN0aW9uLnR5cGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtaGVhZGVyLWNlbGwnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJkYXRhdGFibGUtaGVhZGVyLWNlbGwtdGVtcGxhdGUtd3JhcFwiPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwiaXNUYXJnZXRcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0YXJnZXRNYXJrZXJUZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ0YXJnZXRNYXJrZXJDb250ZXh0XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8bGFiZWwgKm5nSWY9XCJpc0NoZWNrYm94YWJsZVwiIGNsYXNzPVwiZGF0YXRhYmxlLWNoZWNrYm94XCI+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBbY2hlY2tlZF09XCJhbGxSb3dzU2VsZWN0ZWRcIiAoY2hhbmdlKT1cInNlbGVjdC5lbWl0KCFhbGxSb3dzU2VsZWN0ZWQpXCIgLz5cbiAgICAgIDwvbGFiZWw+XG4gICAgICA8c3BhbiAqbmdJZj1cIiFjb2x1bW4uaGVhZGVyVGVtcGxhdGVcIiBjbGFzcz1cImRhdGF0YWJsZS1oZWFkZXItY2VsbC13cmFwcGVyXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0YXRhYmxlLWhlYWRlci1jZWxsLWxhYmVsIGRyYWdnYWJsZVwiIChjbGljayk9XCJvblNvcnQoKVwiIFtpbm5lckhUTUxdPVwibmFtZVwiPiA8L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgKm5nSWY9XCJjb2x1bW4uaGVhZGVyVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb2x1bW4uaGVhZGVyVGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiY2VsbENvbnRleHRcIlxuICAgICAgPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxzcGFuIChjbGljayk9XCJvblNvcnQoKVwiIFtjbGFzc109XCJzb3J0Q2xhc3NcIj4gPC9zcGFuPlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdkYXRhdGFibGUtaGVhZGVyLWNlbGwnXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZUhlYWRlckNlbGxDb21wb25lbnQge1xuICBASW5wdXQoKSBzb3J0VHlwZTogU29ydFR5cGU7XG4gIEBJbnB1dCgpIHNvcnRBc2NlbmRpbmdJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNvcnREZXNjZW5kaW5nSWNvbjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGlzVGFyZ2V0OiBib29sZWFuO1xuICBASW5wdXQoKSB0YXJnZXRNYXJrZXJUZW1wbGF0ZTogYW55O1xuICBASW5wdXQoKSB0YXJnZXRNYXJrZXJDb250ZXh0OiBhbnk7XG5cbiAgX2FsbFJvd3NTZWxlY3RlZDogYm9vbGVhbjtcblxuICBASW5wdXQoKSBzZXQgYWxsUm93c1NlbGVjdGVkKHZhbHVlKSB7XG4gICAgdGhpcy5fYWxsUm93c1NlbGVjdGVkID0gdmFsdWU7XG4gICAgdGhpcy5jZWxsQ29udGV4dC5hbGxSb3dzU2VsZWN0ZWQgPSB2YWx1ZTtcbiAgfVxuICBnZXQgYWxsUm93c1NlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9hbGxSb3dzU2VsZWN0ZWQ7XG4gIH1cblxuICBASW5wdXQoKSBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlO1xuXG4gIEBJbnB1dCgpIHNldCBjb2x1bW4oY29sdW1uOiBUYWJsZUNvbHVtbikge1xuICAgIHRoaXMuX2NvbHVtbiA9IGNvbHVtbjtcbiAgICB0aGlzLmNlbGxDb250ZXh0LmNvbHVtbiA9IGNvbHVtbjtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGNvbHVtbigpOiBUYWJsZUNvbHVtbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbjtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0LnB4JylcbiAgQElucHV0KClcbiAgaGVhZGVySGVpZ2h0OiBudW1iZXI7XG5cbiAgQElucHV0KCkgc2V0IHNvcnRzKHZhbDogYW55W10pIHtcbiAgICB0aGlzLl9zb3J0cyA9IHZhbDtcbiAgICB0aGlzLnNvcnREaXIgPSB0aGlzLmNhbGNTb3J0RGlyKHZhbCk7XG4gICAgdGhpcy5jZWxsQ29udGV4dC5zb3J0RGlyID0gdGhpcy5zb3J0RGlyO1xuICAgIHRoaXMuc29ydENsYXNzID0gdGhpcy5jYWxjU29ydENsYXNzKHRoaXMuc29ydERpcik7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBzb3J0cygpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnRzO1xuICB9XG5cbiAgQE91dHB1dCgpIHNvcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGNvbHVtbkNvbnRleHRtZW51ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBNb3VzZUV2ZW50OyBjb2x1bW46IGFueSB9PihmYWxzZSk7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBjb2x1bW5Dc3NDbGFzc2VzKCk6IGFueSB7XG4gICAgbGV0IGNscyA9ICdkYXRhdGFibGUtaGVhZGVyLWNlbGwnO1xuXG4gICAgaWYgKHRoaXMuY29sdW1uLnNvcnRhYmxlKSBjbHMgKz0gJyBzb3J0YWJsZSc7XG4gICAgaWYgKHRoaXMuY29sdW1uLnJlc2l6ZWFibGUpIGNscyArPSAnIHJlc2l6ZWFibGUnO1xuICAgIGlmICh0aGlzLmNvbHVtbi5oZWFkZXJDbGFzcykge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmNvbHVtbi5oZWFkZXJDbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY2xzICs9ICcgJyArIHRoaXMuY29sdW1uLmhlYWRlckNsYXNzO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5jb2x1bW4uaGVhZGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5jb2x1bW4uaGVhZGVyQ2xhc3Moe1xuICAgICAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY2xzICs9IHJlcztcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXMpO1xuICAgICAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgICAgICAgICBpZiAocmVzW2tdID09PSB0cnVlKSBjbHMgKz0gYCAke2t9YDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzb3J0RGlyID0gdGhpcy5zb3J0RGlyO1xuICAgIGlmIChzb3J0RGlyKSB7XG4gICAgICBjbHMgKz0gYCBzb3J0LWFjdGl2ZSBzb3J0LSR7c29ydERpcn1gO1xuICAgIH1cblxuICAgIHJldHVybiBjbHM7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2F0dHIudGl0bGUnKVxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIC8vIGd1YXJhbnRlZWQgdG8gaGF2ZSBhIHZhbHVlIGJ5IHNldENvbHVtbkRlZmF1bHRzKCkgaW4gY29sdW1uLWhlbHBlci50c1xuICAgIHJldHVybiB0aGlzLmNvbHVtbi5oZWFkZXJUZW1wbGF0ZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5jb2x1bW4ubmFtZSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUubWluV2lkdGgucHgnKVxuICBnZXQgbWluV2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW4ubWluV2lkdGg7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1heFdpZHRoLnB4JylcbiAgZ2V0IG1heFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uLm1heFdpZHRoO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aC5weCcpXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbi53aWR0aDtcbiAgfVxuXG4gIGdldCBpc0NoZWNrYm94YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW4uY2hlY2tib3hhYmxlICYmIHRoaXMuY29sdW1uLmhlYWRlckNoZWNrYm94YWJsZSAmJiB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuY2hlY2tib3g7XG4gIH1cblxuICBzb3J0Rm4gPSB0aGlzLm9uU29ydC5iaW5kKHRoaXMpO1xuICBzb3J0Q2xhc3M6IHN0cmluZztcbiAgc29ydERpcjogU29ydERpcmVjdGlvbjtcbiAgc2VsZWN0Rm4gPSB0aGlzLnNlbGVjdC5lbWl0LmJpbmQodGhpcy5zZWxlY3QpO1xuXG4gIGNlbGxDb250ZXh0OiBhbnkgPSB7XG4gICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICBzb3J0RGlyOiB0aGlzLnNvcnREaXIsXG4gICAgc29ydEZuOiB0aGlzLnNvcnRGbixcbiAgICBhbGxSb3dzU2VsZWN0ZWQ6IHRoaXMuYWxsUm93c1NlbGVjdGVkLFxuICAgIHNlbGVjdEZuOiB0aGlzLnNlbGVjdEZuXG4gIH07XG5cbiAgcHJpdmF0ZSBfY29sdW1uOiBUYWJsZUNvbHVtbjtcbiAgcHJpdmF0ZSBfc29ydHM6IGFueVtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgWyckZXZlbnQnXSlcbiAgb25Db250ZXh0bWVudSgkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNvbHVtbkNvbnRleHRtZW51LmVtaXQoeyBldmVudDogJGV2ZW50LCBjb2x1bW46IHRoaXMuY29sdW1uIH0pO1xuICB9XG5cbiAgY2FsY1NvcnREaXIoc29ydHM6IGFueVtdKTogYW55IHtcbiAgICBpZiAoc29ydHMgJiYgdGhpcy5jb2x1bW4pIHtcbiAgICAgIGNvbnN0IHNvcnQgPSBzb3J0cy5maW5kKChzOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHMucHJvcCA9PT0gdGhpcy5jb2x1bW4ucHJvcDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoc29ydCkgcmV0dXJuIHNvcnQuZGlyO1xuICAgIH1cbiAgfVxuXG4gIG9uU29ydCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY29sdW1uLnNvcnRhYmxlKSByZXR1cm47XG5cbiAgICBjb25zdCBuZXdWYWx1ZSA9IG5leHRTb3J0RGlyKHRoaXMuc29ydFR5cGUsIHRoaXMuc29ydERpcik7XG4gICAgdGhpcy5zb3J0LmVtaXQoe1xuICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgIHByZXZWYWx1ZTogdGhpcy5zb3J0RGlyLFxuICAgICAgbmV3VmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGNTb3J0Q2xhc3Moc29ydERpcjogU29ydERpcmVjdGlvbik6IHN0cmluZyB7XG4gICAgaWYgKHNvcnREaXIgPT09IFNvcnREaXJlY3Rpb24uYXNjKSB7XG4gICAgICByZXR1cm4gYHNvcnQtYnRuIHNvcnQtYXNjICR7dGhpcy5zb3J0QXNjZW5kaW5nSWNvbn1gO1xuICAgIH0gZWxzZSBpZiAoc29ydERpciA9PT0gU29ydERpcmVjdGlvbi5kZXNjKSB7XG4gICAgICByZXR1cm4gYHNvcnQtYnRuIHNvcnQtZGVzYyAke3RoaXMuc29ydERlc2NlbmRpbmdJY29ufWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgc29ydC1idG5gO1xuICAgIH1cbiAgfVxufVxuIl19