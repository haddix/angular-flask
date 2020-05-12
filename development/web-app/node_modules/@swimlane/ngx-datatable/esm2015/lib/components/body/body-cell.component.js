import { __decorate } from "tslib";
import { Component, Input, PipeTransform, HostBinding, ViewChild, ChangeDetectorRef, Output, EventEmitter, HostListener, ElementRef, ViewContainerRef, OnDestroy, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import { SortDirection } from '../../types/sort-direction.type';
import { Keys } from '../../utils/keys';
let DataTableBodyCellComponent = class DataTableBodyCellComponent {
    constructor(element, cd) {
        this.cd = cd;
        this.activate = new EventEmitter();
        this.treeAction = new EventEmitter();
        this.isFocused = false;
        this.onCheckboxChangeFn = this.onCheckboxChange.bind(this);
        this.activateFn = this.activate.emit.bind(this.activate);
        this.cellContext = {
            onCheckboxChangeFn: this.onCheckboxChangeFn,
            activateFn: this.activateFn,
            row: this.row,
            group: this.group,
            value: this.value,
            column: this.column,
            rowHeight: this.rowHeight,
            isSelected: this.isSelected,
            rowIndex: this.rowIndex,
            treeStatus: this.treeStatus,
            onTreeAction: this.onTreeAction.bind(this)
        };
        this._element = element.nativeElement;
    }
    set group(group) {
        this._group = group;
        this.cellContext.group = group;
        this.checkValueUpdates();
        this.cd.markForCheck();
    }
    get group() {
        return this._group;
    }
    set rowHeight(val) {
        this._rowHeight = val;
        this.cellContext.rowHeight = val;
        this.checkValueUpdates();
        this.cd.markForCheck();
    }
    get rowHeight() {
        return this._rowHeight;
    }
    set isSelected(val) {
        this._isSelected = val;
        this.cellContext.isSelected = val;
        this.cd.markForCheck();
    }
    get isSelected() {
        return this._isSelected;
    }
    set expanded(val) {
        this._expanded = val;
        this.cellContext.expanded = val;
        this.cd.markForCheck();
    }
    get expanded() {
        return this._expanded;
    }
    set rowIndex(val) {
        this._rowIndex = val;
        this.cellContext.rowIndex = val;
        this.checkValueUpdates();
        this.cd.markForCheck();
    }
    get rowIndex() {
        return this._rowIndex;
    }
    set column(column) {
        this._column = column;
        this.cellContext.column = column;
        this.checkValueUpdates();
        this.cd.markForCheck();
    }
    get column() {
        return this._column;
    }
    set row(row) {
        this._row = row;
        this.cellContext.row = row;
        this.checkValueUpdates();
        this.cd.markForCheck();
    }
    get row() {
        return this._row;
    }
    set sorts(val) {
        this._sorts = val;
        this.calcSortDir = this.calcSortDir(val);
    }
    get sorts() {
        return this._sorts;
    }
    set treeStatus(status) {
        if (status !== 'collapsed' && status !== 'expanded' && status !== 'loading' && status !== 'disabled') {
            this._treeStatus = 'collapsed';
        }
        else {
            this._treeStatus = status;
        }
        this.cellContext.treeStatus = this._treeStatus;
        this.checkValueUpdates();
        this.cd.markForCheck();
    }
    get treeStatus() {
        return this._treeStatus;
    }
    get columnCssClasses() {
        let cls = 'datatable-body-cell';
        if (this.column.cellClass) {
            if (typeof this.column.cellClass === 'string') {
                cls += ' ' + this.column.cellClass;
            }
            else if (typeof this.column.cellClass === 'function') {
                const res = this.column.cellClass({
                    row: this.row,
                    group: this.group,
                    column: this.column,
                    value: this.value,
                    rowHeight: this.rowHeight
                });
                if (typeof res === 'string') {
                    cls += ' ' + res;
                }
                else if (typeof res === 'object') {
                    const keys = Object.keys(res);
                    for (const k of keys) {
                        if (res[k] === true) {
                            cls += ` ${k}`;
                        }
                    }
                }
            }
        }
        if (!this.sortDir) {
            cls += ' sort-active';
        }
        if (this.isFocused) {
            cls += ' active';
        }
        if (this.sortDir === SortDirection.asc) {
            cls += ' sort-asc';
        }
        if (this.sortDir === SortDirection.desc) {
            cls += ' sort-desc';
        }
        return cls;
    }
    get width() {
        return this.column.width;
    }
    get minWidth() {
        return this.column.minWidth;
    }
    get maxWidth() {
        return this.column.maxWidth;
    }
    get height() {
        const height = this.rowHeight;
        if (isNaN(height)) {
            return height;
        }
        return height + 'px';
    }
    ngDoCheck() {
        this.checkValueUpdates();
    }
    ngOnDestroy() {
        if (this.cellTemplate) {
            this.cellTemplate.clear();
        }
    }
    checkValueUpdates() {
        let value = '';
        if (!this.row || !this.column) {
            value = '';
        }
        else {
            const val = this.column.$$valueGetter(this.row, this.column.prop);
            const userPipe = this.column.pipe;
            if (userPipe) {
                value = userPipe.transform(val);
            }
            else if (value !== undefined) {
                value = val;
            }
        }
        if (this.value !== value) {
            this.value = value;
            this.cellContext.value = value;
            this.sanitizedValue = value !== null && value !== undefined ? this.stripHtml(value) : value;
            this.cd.markForCheck();
        }
    }
    onFocus() {
        this.isFocused = true;
    }
    onBlur() {
        this.isFocused = false;
    }
    onClick(event) {
        this.activate.emit({
            type: 'click',
            event,
            row: this.row,
            group: this.group,
            rowHeight: this.rowHeight,
            column: this.column,
            value: this.value,
            cellElement: this._element
        });
    }
    onDblClick(event) {
        this.activate.emit({
            type: 'dblclick',
            event,
            row: this.row,
            group: this.group,
            rowHeight: this.rowHeight,
            column: this.column,
            value: this.value,
            cellElement: this._element
        });
    }
    onKeyDown(event) {
        const keyCode = event.keyCode;
        const isTargetCell = event.target === this._element;
        const isAction = keyCode === Keys.return ||
            keyCode === Keys.down ||
            keyCode === Keys.up ||
            keyCode === Keys.left ||
            keyCode === Keys.right;
        if (isAction && isTargetCell) {
            event.preventDefault();
            event.stopPropagation();
            this.activate.emit({
                type: 'keydown',
                event,
                row: this.row,
                group: this.group,
                rowHeight: this.rowHeight,
                column: this.column,
                value: this.value,
                cellElement: this._element
            });
        }
    }
    onCheckboxChange(event) {
        this.activate.emit({
            type: 'checkbox',
            event,
            row: this.row,
            group: this.group,
            rowHeight: this.rowHeight,
            column: this.column,
            value: this.value,
            cellElement: this._element,
            treeStatus: 'collapsed'
        });
    }
    calcSortDir(sorts) {
        if (!sorts) {
            return;
        }
        const sort = sorts.find((s) => {
            return s.prop === this.column.prop;
        });
        if (sort) {
            return sort.dir;
        }
    }
    stripHtml(html) {
        if (!html.replace) {
            return html;
        }
        return html.replace(/<\/?[^>]+(>|$)/g, '');
    }
    onTreeAction() {
        this.treeAction.emit(this.row);
    }
    calcLeftMargin(column, row) {
        const levelIndent = column.treeLevelIndent != null ? column.treeLevelIndent : 50;
        return column.isTreeColumn ? row.level * levelIndent : 0;
    }
};
DataTableBodyCellComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "displayCheck", void 0);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "group", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "rowHeight", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "isSelected", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "expanded", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "rowIndex", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "column", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "row", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "sorts", null);
__decorate([
    Input()
], DataTableBodyCellComponent.prototype, "treeStatus", null);
__decorate([
    Output()
], DataTableBodyCellComponent.prototype, "activate", void 0);
__decorate([
    Output()
], DataTableBodyCellComponent.prototype, "treeAction", void 0);
__decorate([
    ViewChild('cellTemplate', { read: ViewContainerRef, static: true })
], DataTableBodyCellComponent.prototype, "cellTemplate", void 0);
__decorate([
    HostBinding('class')
], DataTableBodyCellComponent.prototype, "columnCssClasses", null);
__decorate([
    HostBinding('style.width.px')
], DataTableBodyCellComponent.prototype, "width", null);
__decorate([
    HostBinding('style.minWidth.px')
], DataTableBodyCellComponent.prototype, "minWidth", null);
__decorate([
    HostBinding('style.maxWidth.px')
], DataTableBodyCellComponent.prototype, "maxWidth", null);
__decorate([
    HostBinding('style.height')
], DataTableBodyCellComponent.prototype, "height", null);
__decorate([
    HostListener('focus')
], DataTableBodyCellComponent.prototype, "onFocus", null);
__decorate([
    HostListener('blur')
], DataTableBodyCellComponent.prototype, "onBlur", null);
__decorate([
    HostListener('click', ['$event'])
], DataTableBodyCellComponent.prototype, "onClick", null);
__decorate([
    HostListener('dblclick', ['$event'])
], DataTableBodyCellComponent.prototype, "onDblClick", null);
__decorate([
    HostListener('keydown', ['$event'])
], DataTableBodyCellComponent.prototype, "onKeyDown", null);
DataTableBodyCellComponent = __decorate([
    Component({
        selector: 'datatable-body-cell',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `
    <div class="datatable-body-cell-label" [style.margin-left.px]="calcLeftMargin(column, row)">
      <label
        *ngIf="column.checkboxable && (!displayCheck || displayCheck(row, column, value))"
        class="datatable-checkbox"
      >
        <input type="checkbox" [checked]="isSelected" (click)="onCheckboxChange($event)" />
      </label>
      <ng-container *ngIf="column.isTreeColumn">
        <button
          *ngIf="!column.treeToggleTemplate"
          class="datatable-tree-button"
          [disabled]="treeStatus === 'disabled'"
          (click)="onTreeAction()"
        >
          <span>
            <i *ngIf="treeStatus === 'loading'" class="icon datatable-icon-collapse"></i>
            <i *ngIf="treeStatus === 'collapsed'" class="icon datatable-icon-up"></i>
            <i *ngIf="treeStatus === 'expanded' || treeStatus === 'disabled'" class="icon datatable-icon-down"></i>
          </span>
        </button>
        <ng-template
          *ngIf="column.treeToggleTemplate"
          [ngTemplateOutlet]="column.treeToggleTemplate"
          [ngTemplateOutletContext]="{ cellContext: cellContext }"
        >
        </ng-template>
      </ng-container>

      <span *ngIf="!column.cellTemplate" [title]="sanitizedValue" [innerHTML]="value"> </span>
      <ng-template
        #cellTemplate
        *ngIf="column.cellTemplate"
        [ngTemplateOutlet]="column.cellTemplate"
        [ngTemplateOutletContext]="cellContext"
      >
      </ng-template>
    </div>
  `
    })
], DataTableBodyCellComponent);
export { DataTableBodyCellComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYm9keS9ib2R5LWNlbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxhQUFhLEVBQ2IsV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osVUFBVSxFQUNWLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsT0FBTyxFQUNQLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDaEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBK0N4QyxJQUFhLDBCQUEwQixHQUF2QyxNQUFhLDBCQUEwQjtJQWdOckMsWUFBWSxPQUFtQixFQUFVLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBMUdwRCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBMkU3RCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLHVCQUFrQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsZUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEQsZ0JBQVcsR0FBUTtZQUNqQixrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCO1lBQzNDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixLQUFL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QUM7eURBR3JCO0FBR0Q7SUFEQyxZQUFZLENBQUMsTUFBTSxDQUFDO3dEQUdwQjtBQUdEO0lBREMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3lEQVlqQztBQUdEO0lBREMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzREQVlwQztBQUdEO0lBREMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzJEQTJCbkM7QUF2VFUsMEJBQTBCO0lBM0N0QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUscUJBQXFCO1FBQy9CLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1FBQy9DLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ1Q7S0FDRixDQUFDO0dBQ1csMEJBQTBCLENBb1d0QztTQXBXWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBQaXBlVHJhbnNmb3JtLFxuICBIb3N0QmluZGluZyxcbiAgVmlld0NoaWxkLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgRWxlbWVudFJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgT25EZXN0cm95LFxuICBEb0NoZWNrLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVGFibGVDb2x1bW4gfSBmcm9tICcuLi8uLi90eXBlcy90YWJsZS1jb2x1bW4udHlwZSc7XG5pbXBvcnQgeyBTb3J0RGlyZWN0aW9uIH0gZnJvbSAnLi4vLi4vdHlwZXMvc29ydC1kaXJlY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMva2V5cyc7XG5cbmV4cG9ydCB0eXBlIFRyZWVTdGF0dXMgPSAnY29sbGFwc2VkJyB8ICdleHBhbmRlZCcgfCAnbG9hZGluZycgfCAnZGlzYWJsZWQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtYm9keS1jZWxsJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImRhdGF0YWJsZS1ib2R5LWNlbGwtbGFiZWxcIiBbc3R5bGUubWFyZ2luLWxlZnQucHhdPVwiY2FsY0xlZnRNYXJnaW4oY29sdW1uLCByb3cpXCI+XG4gICAgICA8bGFiZWxcbiAgICAgICAgKm5nSWY9XCJjb2x1bW4uY2hlY2tib3hhYmxlICYmICghZGlzcGxheUNoZWNrIHx8IGRpc3BsYXlDaGVjayhyb3csIGNvbHVtbiwgdmFsdWUpKVwiXG4gICAgICAgIGNsYXNzPVwiZGF0YXRhYmxlLWNoZWNrYm94XCJcbiAgICAgID5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIFtjaGVja2VkXT1cImlzU2VsZWN0ZWRcIiAoY2xpY2spPVwib25DaGVja2JveENoYW5nZSgkZXZlbnQpXCIgLz5cbiAgICAgIDwvbGFiZWw+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLmlzVHJlZUNvbHVtblwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgKm5nSWY9XCIhY29sdW1uLnRyZWVUb2dnbGVUZW1wbGF0ZVwiXG4gICAgICAgICAgY2xhc3M9XCJkYXRhdGFibGUtdHJlZS1idXR0b25cIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJ0cmVlU3RhdHVzID09PSAnZGlzYWJsZWQnXCJcbiAgICAgICAgICAoY2xpY2spPVwib25UcmVlQWN0aW9uKClcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8aSAqbmdJZj1cInRyZWVTdGF0dXMgPT09ICdsb2FkaW5nJ1wiIGNsYXNzPVwiaWNvbiBkYXRhdGFibGUtaWNvbi1jb2xsYXBzZVwiPjwvaT5cbiAgICAgICAgICAgIDxpICpuZ0lmPVwidHJlZVN0YXR1cyA9PT0gJ2NvbGxhcHNlZCdcIiBjbGFzcz1cImljb24gZGF0YXRhYmxlLWljb24tdXBcIj48L2k+XG4gICAgICAgICAgICA8aSAqbmdJZj1cInRyZWVTdGF0dXMgPT09ICdleHBhbmRlZCcgfHwgdHJlZVN0YXR1cyA9PT0gJ2Rpc2FibGVkJ1wiIGNsYXNzPVwiaWNvbiBkYXRhdGFibGUtaWNvbi1kb3duXCI+PC9pPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICpuZ0lmPVwiY29sdW1uLnRyZWVUb2dnbGVUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29sdW1uLnRyZWVUb2dnbGVUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgY2VsbENvbnRleHQ6IGNlbGxDb250ZXh0IH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgPHNwYW4gKm5nSWY9XCIhY29sdW1uLmNlbGxUZW1wbGF0ZVwiIFt0aXRsZV09XCJzYW5pdGl6ZWRWYWx1ZVwiIFtpbm5lckhUTUxdPVwidmFsdWVcIj4gPC9zcGFuPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICNjZWxsVGVtcGxhdGVcbiAgICAgICAgKm5nSWY9XCJjb2x1bW4uY2VsbFRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29sdW1uLmNlbGxUZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJjZWxsQ29udGV4dFwiXG4gICAgICA+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZUJvZHlDZWxsQ29tcG9uZW50IGltcGxlbWVudHMgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgZGlzcGxheUNoZWNrOiAocm93OiBhbnksIGNvbHVtbj86IFRhYmxlQ29sdW1uLCB2YWx1ZT86IGFueSkgPT4gYm9vbGVhbjtcblxuICBASW5wdXQoKSBzZXQgZ3JvdXAoZ3JvdXA6IGFueSkge1xuICAgIHRoaXMuX2dyb3VwID0gZ3JvdXA7XG4gICAgdGhpcy5jZWxsQ29udGV4dC5ncm91cCA9IGdyb3VwO1xuICAgIHRoaXMuY2hlY2tWYWx1ZVVwZGF0ZXMoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGdyb3VwKCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cDtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCByb3dIZWlnaHQodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yb3dIZWlnaHQgPSB2YWw7XG4gICAgdGhpcy5jZWxsQ29udGV4dC5yb3dIZWlnaHQgPSB2YWw7XG4gICAgdGhpcy5jaGVja1ZhbHVlVXBkYXRlcygpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgcm93SGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9yb3dIZWlnaHQ7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgaXNTZWxlY3RlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pc1NlbGVjdGVkID0gdmFsO1xuICAgIHRoaXMuY2VsbENvbnRleHQuaXNTZWxlY3RlZCA9IHZhbDtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGlzU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2VsZWN0ZWQ7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgZXhwYW5kZWQodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZXhwYW5kZWQgPSB2YWw7XG4gICAgdGhpcy5jZWxsQ29udGV4dC5leHBhbmRlZCA9IHZhbDtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9leHBhbmRlZDtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCByb3dJbmRleCh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX3Jvd0luZGV4ID0gdmFsO1xuICAgIHRoaXMuY2VsbENvbnRleHQucm93SW5kZXggPSB2YWw7XG4gICAgdGhpcy5jaGVja1ZhbHVlVXBkYXRlcygpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgcm93SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcm93SW5kZXg7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgY29sdW1uKGNvbHVtbjogVGFibGVDb2x1bW4pIHtcbiAgICB0aGlzLl9jb2x1bW4gPSBjb2x1bW47XG4gICAgdGhpcy5jZWxsQ29udGV4dC5jb2x1bW4gPSBjb2x1bW47XG4gICAgdGhpcy5jaGVja1ZhbHVlVXBkYXRlcygpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgY29sdW1uKCk6IFRhYmxlQ29sdW1uIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IHJvdyhyb3c6IGFueSkge1xuICAgIHRoaXMuX3JvdyA9IHJvdztcbiAgICB0aGlzLmNlbGxDb250ZXh0LnJvdyA9IHJvdztcbiAgICB0aGlzLmNoZWNrVmFsdWVVcGRhdGVzKCk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCByb3coKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fcm93O1xuICB9XG5cbiAgQElucHV0KCkgc2V0IHNvcnRzKHZhbDogYW55W10pIHtcbiAgICB0aGlzLl9zb3J0cyA9IHZhbDtcbiAgICB0aGlzLmNhbGNTb3J0RGlyID0gdGhpcy5jYWxjU29ydERpcih2YWwpO1xuICB9XG5cbiAgZ2V0IHNvcnRzKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydHM7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgdHJlZVN0YXR1cyhzdGF0dXM6IFRyZWVTdGF0dXMpIHtcbiAgICBpZiAoc3RhdHVzICE9PSAnY29sbGFwc2VkJyAmJiBzdGF0dXMgIT09ICdleHBhbmRlZCcgJiYgc3RhdHVzICE9PSAnbG9hZGluZycgJiYgc3RhdHVzICE9PSAnZGlzYWJsZWQnKSB7XG4gICAgICB0aGlzLl90cmVlU3RhdHVzID0gJ2NvbGxhcHNlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RyZWVTdGF0dXMgPSBzdGF0dXM7XG4gICAgfVxuICAgIHRoaXMuY2VsbENvbnRleHQudHJlZVN0YXR1cyA9IHRoaXMuX3RyZWVTdGF0dXM7XG4gICAgdGhpcy5jaGVja1ZhbHVlVXBkYXRlcygpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBnZXQgdHJlZVN0YXR1cygpOiBUcmVlU3RhdHVzIHtcbiAgICByZXR1cm4gdGhpcy5fdHJlZVN0YXR1cztcbiAgfVxuXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQE91dHB1dCgpIHRyZWVBY3Rpb246IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2NlbGxUZW1wbGF0ZScsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIGNlbGxUZW1wbGF0ZTogVmlld0NvbnRhaW5lclJlZjtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGNvbHVtbkNzc0NsYXNzZXMoKTogYW55IHtcbiAgICBsZXQgY2xzID0gJ2RhdGF0YWJsZS1ib2R5LWNlbGwnO1xuICAgIGlmICh0aGlzLmNvbHVtbi5jZWxsQ2xhc3MpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5jb2x1bW4uY2VsbENsYXNzID09PSAnc3RyaW5nJykge1xuICAgICAgICBjbHMgKz0gJyAnICsgdGhpcy5jb2x1bW4uY2VsbENsYXNzO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5jb2x1bW4uY2VsbENsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMuY29sdW1uLmNlbGxDbGFzcyh7XG4gICAgICAgICAgcm93OiB0aGlzLnJvdyxcbiAgICAgICAgICBncm91cDogdGhpcy5ncm91cCxcbiAgICAgICAgICBjb2x1bW46IHRoaXMuY29sdW1uLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY2xzICs9ICcgJyArIHJlcztcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXMpO1xuICAgICAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgICAgICAgICBpZiAocmVzW2tdID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGNscyArPSBgICR7a31gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXRoaXMuc29ydERpcikge1xuICAgICAgY2xzICs9ICcgc29ydC1hY3RpdmUnO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0ZvY3VzZWQpIHtcbiAgICAgIGNscyArPSAnIGFjdGl2ZSc7XG4gICAgfVxuICAgIGlmICh0aGlzLnNvcnREaXIgPT09IFNvcnREaXJlY3Rpb24uYXNjKSB7XG4gICAgICBjbHMgKz0gJyBzb3J0LWFzYyc7XG4gICAgfVxuICAgIGlmICh0aGlzLnNvcnREaXIgPT09IFNvcnREaXJlY3Rpb24uZGVzYykge1xuICAgICAgY2xzICs9ICcgc29ydC1kZXNjJztcbiAgICB9XG5cbiAgICByZXR1cm4gY2xzO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aC5weCcpXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbi53aWR0aDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUubWluV2lkdGgucHgnKVxuICBnZXQgbWluV2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW4ubWluV2lkdGg7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1heFdpZHRoLnB4JylcbiAgZ2V0IG1heFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uLm1heFdpZHRoO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxuICBnZXQgaGVpZ2h0KCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5yb3dIZWlnaHQ7XG4gICAgaWYgKGlzTmFOKGhlaWdodCkpIHtcbiAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuICAgIHJldHVybiBoZWlnaHQgKyAncHgnO1xuICB9XG5cbiAgc2FuaXRpemVkVmFsdWU6IGFueTtcbiAgdmFsdWU6IGFueTtcbiAgc29ydERpcjogU29ydERpcmVjdGlvbjtcbiAgaXNGb2N1c2VkID0gZmFsc2U7XG4gIG9uQ2hlY2tib3hDaGFuZ2VGbiA9IHRoaXMub25DaGVja2JveENoYW5nZS5iaW5kKHRoaXMpO1xuICBhY3RpdmF0ZUZuID0gdGhpcy5hY3RpdmF0ZS5lbWl0LmJpbmQodGhpcy5hY3RpdmF0ZSk7XG5cbiAgY2VsbENvbnRleHQ6IGFueSA9IHtcbiAgICBvbkNoZWNrYm94Q2hhbmdlRm46IHRoaXMub25DaGVja2JveENoYW5nZUZuLFxuICAgIGFjdGl2YXRlRm46IHRoaXMuYWN0aXZhdGVGbixcbiAgICByb3c6IHRoaXMucm93LFxuICAgIGdyb3VwOiB0aGlzLmdyb3VwLFxuICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgIGNvbHVtbjogdGhpcy5jb2x1bW4sXG4gICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICBpc1NlbGVjdGVkOiB0aGlzLmlzU2VsZWN0ZWQsXG4gICAgcm93SW5kZXg6IHRoaXMucm93SW5kZXgsXG4gICAgdHJlZVN0YXR1czogdGhpcy50cmVlU3RhdHVzLFxuICAgIG9uVHJlZUFjdGlvbjogdGhpcy5vblRyZWVBY3Rpb24uYmluZCh0aGlzKVxuICB9O1xuXG4gIHByaXZhdGUgX2lzU2VsZWN0ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX3NvcnRzOiBhbnlbXTtcbiAgcHJpdmF0ZSBfY29sdW1uOiBUYWJsZUNvbHVtbjtcbiAgcHJpdmF0ZSBfcm93OiBhbnk7XG4gIHByaXZhdGUgX2dyb3VwOiBhbnk7XG4gIHByaXZhdGUgX3Jvd0hlaWdodDogbnVtYmVyO1xuICBwcml2YXRlIF9yb3dJbmRleDogbnVtYmVyO1xuICBwcml2YXRlIF9leHBhbmRlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfZWxlbWVudDogYW55O1xuICBwcml2YXRlIF90cmVlU3RhdHVzOiBUcmVlU3RhdHVzO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrVmFsdWVVcGRhdGVzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jZWxsVGVtcGxhdGUpIHtcbiAgICAgIHRoaXMuY2VsbFRlbXBsYXRlLmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tWYWx1ZVVwZGF0ZXMoKTogdm9pZCB7XG4gICAgbGV0IHZhbHVlID0gJyc7XG5cbiAgICBpZiAoIXRoaXMucm93IHx8ICF0aGlzLmNvbHVtbikge1xuICAgICAgdmFsdWUgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdmFsID0gdGhpcy5jb2x1bW4uJCR2YWx1ZUdldHRlcih0aGlzLnJvdywgdGhpcy5jb2x1bW4ucHJvcCk7XG4gICAgICBjb25zdCB1c2VyUGlwZTogUGlwZVRyYW5zZm9ybSA9IHRoaXMuY29sdW1uLnBpcGU7XG5cbiAgICAgIGlmICh1c2VyUGlwZSkge1xuICAgICAgICB2YWx1ZSA9IHVzZXJQaXBlLnRyYW5zZm9ybSh2YWwpO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhbHVlID0gdmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5jZWxsQ29udGV4dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5zYW5pdGl6ZWRWYWx1ZSA9IHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyB0aGlzLnN0cmlwSHRtbCh2YWx1ZSkgOiB2YWx1ZTtcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKVxuICBvbkZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvbkJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7XG4gICAgICB0eXBlOiAnY2xpY2snLFxuICAgICAgZXZlbnQsXG4gICAgICByb3c6IHRoaXMucm93LFxuICAgICAgZ3JvdXA6IHRoaXMuZ3JvdXAsXG4gICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgY2VsbEVsZW1lbnQ6IHRoaXMuX2VsZW1lbnRcbiAgICB9KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RibGNsaWNrJywgWyckZXZlbnQnXSlcbiAgb25EYmxDbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7XG4gICAgICB0eXBlOiAnZGJsY2xpY2snLFxuICAgICAgZXZlbnQsXG4gICAgICByb3c6IHRoaXMucm93LFxuICAgICAgZ3JvdXA6IHRoaXMuZ3JvdXAsXG4gICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgY2VsbEVsZW1lbnQ6IHRoaXMuX2VsZW1lbnRcbiAgICB9KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBpc1RhcmdldENlbGwgPSBldmVudC50YXJnZXQgPT09IHRoaXMuX2VsZW1lbnQ7XG5cbiAgICBjb25zdCBpc0FjdGlvbiA9XG4gICAgICBrZXlDb2RlID09PSBLZXlzLnJldHVybiB8fFxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5kb3duIHx8XG4gICAgICBrZXlDb2RlID09PSBLZXlzLnVwIHx8XG4gICAgICBrZXlDb2RlID09PSBLZXlzLmxlZnQgfHxcbiAgICAgIGtleUNvZGUgPT09IEtleXMucmlnaHQ7XG5cbiAgICBpZiAoaXNBY3Rpb24gJiYgaXNUYXJnZXRDZWxsKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7XG4gICAgICAgIHR5cGU6ICdrZXlkb3duJyxcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIHJvdzogdGhpcy5yb3csXG4gICAgICAgIGdyb3VwOiB0aGlzLmdyb3VwLFxuICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICBjb2x1bW46IHRoaXMuY29sdW1uLFxuICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcbiAgICAgICAgY2VsbEVsZW1lbnQ6IHRoaXMuX2VsZW1lbnRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2hlY2tib3hDaGFuZ2UoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7XG4gICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgZXZlbnQsXG4gICAgICByb3c6IHRoaXMucm93LFxuICAgICAgZ3JvdXA6IHRoaXMuZ3JvdXAsXG4gICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgY2VsbEVsZW1lbnQ6IHRoaXMuX2VsZW1lbnQsXG4gICAgICB0cmVlU3RhdHVzOiAnY29sbGFwc2VkJ1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY1NvcnREaXIoc29ydHM6IGFueVtdKTogYW55IHtcbiAgICBpZiAoIXNvcnRzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc29ydCA9IHNvcnRzLmZpbmQoKHM6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIHMucHJvcCA9PT0gdGhpcy5jb2x1bW4ucHJvcDtcbiAgICB9KTtcblxuICAgIGlmIChzb3J0KSB7XG4gICAgICByZXR1cm4gc29ydC5kaXI7XG4gICAgfVxuICB9XG5cbiAgc3RyaXBIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCFodG1sLnJlcGxhY2UpIHtcbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC88XFwvP1tePl0rKD58JCkvZywgJycpO1xuICB9XG5cbiAgb25UcmVlQWN0aW9uKCkge1xuICAgIHRoaXMudHJlZUFjdGlvbi5lbWl0KHRoaXMucm93KTtcbiAgfVxuXG4gIGNhbGNMZWZ0TWFyZ2luKGNvbHVtbjogYW55LCByb3c6IGFueSkge1xuICAgIGNvbnN0IGxldmVsSW5kZW50ID0gY29sdW1uLnRyZWVMZXZlbEluZGVudCAhPSBudWxsID8gY29sdW1uLnRyZWVMZXZlbEluZGVudCA6IDUwO1xuICAgIHJldHVybiBjb2x1bW4uaXNUcmVlQ29sdW1uID8gcm93LmxldmVsICogbGV2ZWxJbmRlbnQgOiAwO1xuICB9XG59XG4iXX0=