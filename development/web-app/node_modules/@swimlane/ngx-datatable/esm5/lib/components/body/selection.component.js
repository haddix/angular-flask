import { __decorate, __read, __spread } from "tslib";
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SelectionType } from '../../types/selection.type';
import { selectRowsBetween, selectRows } from '../../utils/selection';
import { Keys } from '../../utils/keys';
var DataTableSelectionComponent = /** @class */ (function () {
    function DataTableSelectionComponent() {
        this.activate = new EventEmitter();
        this.select = new EventEmitter();
    }
    DataTableSelectionComponent.prototype.selectRow = function (event, index, row) {
        var _a;
        if (!this.selectEnabled)
            return;
        var chkbox = this.selectionType === SelectionType.checkbox;
        var multi = this.selectionType === SelectionType.multi;
        var multiClick = this.selectionType === SelectionType.multiClick;
        var selected = [];
        if (multi || chkbox || multiClick) {
            if (event.shiftKey) {
                selected = selectRowsBetween([], this.rows, index, this.prevIndex, this.getRowSelectedIdx.bind(this));
            }
            else if (event.ctrlKey || event.metaKey || multiClick || chkbox) {
                selected = selectRows(__spread(this.selected), row, this.getRowSelectedIdx.bind(this));
            }
            else {
                selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
            }
        }
        else {
            selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
        }
        if (typeof this.selectCheck === 'function') {
            selected = selected.filter(this.selectCheck.bind(this));
        }
        this.selected.splice(0, this.selected.length);
        (_a = this.selected).push.apply(_a, __spread(selected));
        this.prevIndex = index;
        this.select.emit({
            selected: selected
        });
    };
    DataTableSelectionComponent.prototype.onActivate = function (model, index) {
        var type = model.type, event = model.event, row = model.row;
        var chkbox = this.selectionType === SelectionType.checkbox;
        var select = (!chkbox && (type === 'click' || type === 'dblclick')) || (chkbox && type === 'checkbox');
        if (select) {
            this.selectRow(event, index, row);
        }
        else if (type === 'keydown') {
            if (event.keyCode === Keys.return) {
                this.selectRow(event, index, row);
            }
            else {
                this.onKeyboardFocus(model);
            }
        }
        this.activate.emit(model);
    };
    DataTableSelectionComponent.prototype.onKeyboardFocus = function (model) {
        var keyCode = model.event.keyCode;
        var shouldFocus = keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.right || keyCode === Keys.left;
        if (shouldFocus) {
            var isCellSelection = this.selectionType === SelectionType.cell;
            if (!model.cellElement || !isCellSelection) {
                this.focusRow(model.rowElement, keyCode);
            }
            else if (isCellSelection) {
                this.focusCell(model.cellElement, model.rowElement, keyCode, model.cellIndex);
            }
        }
    };
    DataTableSelectionComponent.prototype.focusRow = function (rowElement, keyCode) {
        var nextRowElement = this.getPrevNextRow(rowElement, keyCode);
        if (nextRowElement)
            nextRowElement.focus();
    };
    DataTableSelectionComponent.prototype.getPrevNextRow = function (rowElement, keyCode) {
        var parentElement = rowElement.parentElement;
        if (parentElement) {
            var focusElement = void 0;
            if (keyCode === Keys.up) {
                focusElement = parentElement.previousElementSibling;
            }
            else if (keyCode === Keys.down) {
                focusElement = parentElement.nextElementSibling;
            }
            if (focusElement && focusElement.children.length) {
                return focusElement.children[0];
            }
        }
    };
    DataTableSelectionComponent.prototype.focusCell = function (cellElement, rowElement, keyCode, cellIndex) {
        var nextCellElement;
        if (keyCode === Keys.left) {
            nextCellElement = cellElement.previousElementSibling;
        }
        else if (keyCode === Keys.right) {
            nextCellElement = cellElement.nextElementSibling;
        }
        else if (keyCode === Keys.up || keyCode === Keys.down) {
            var nextRowElement = this.getPrevNextRow(rowElement, keyCode);
            if (nextRowElement) {
                var children = nextRowElement.getElementsByClassName('datatable-body-cell');
                if (children.length)
                    nextCellElement = children[cellIndex];
            }
        }
        if (nextCellElement)
            nextCellElement.focus();
    };
    DataTableSelectionComponent.prototype.getRowSelected = function (row) {
        return this.getRowSelectedIdx(row, this.selected) > -1;
    };
    DataTableSelectionComponent.prototype.getRowSelectedIdx = function (row, selected) {
        var _this = this;
        if (!selected || !selected.length)
            return -1;
        var rowId = this.rowIdentity(row);
        return selected.findIndex(function (r) {
            var id = _this.rowIdentity(r);
            return id === rowId;
        });
    };
    __decorate([
        Input()
    ], DataTableSelectionComponent.prototype, "rows", void 0);
    __decorate([
        Input()
    ], DataTableSelectionComponent.prototype, "selected", void 0);
    __decorate([
        Input()
    ], DataTableSelectionComponent.prototype, "selectEnabled", void 0);
    __decorate([
        Input()
    ], DataTableSelectionComponent.prototype, "selectionType", void 0);
    __decorate([
        Input()
    ], DataTableSelectionComponent.prototype, "rowIdentity", void 0);
    __decorate([
        Input()
    ], DataTableSelectionComponent.prototype, "selectCheck", void 0);
    __decorate([
        Output()
    ], DataTableSelectionComponent.prototype, "activate", void 0);
    __decorate([
        Output()
    ], DataTableSelectionComponent.prototype, "select", void 0);
    DataTableSelectionComponent = __decorate([
        Component({
            selector: 'datatable-selection',
            template: " <ng-content></ng-content> ",
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], DataTableSelectionComponent);
    return DataTableSelectionComponent;
}());
export { DataTableSelectionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYm9keS9zZWxlY3Rpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBZ0J4QztJQUFBO1FBUVksYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQTJIM0QsQ0FBQztJQXZIQywrQ0FBUyxHQUFULFVBQVUsS0FBaUMsRUFBRSxLQUFhLEVBQUUsR0FBUTs7UUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO1lBQUUsT0FBTztRQUVoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDN0QsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQ3pELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLFVBQVUsQ0FBQztRQUNuRSxJQUFJLFFBQVEsR0FBVSxFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLElBQUksTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUNqQyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xCLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxFQUFF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SUFBTSxFQUFFLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixPQUFPLEVBQUUsS0FBSyxLQUFLLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBbElRO1FBQVIsS0FBSyxFQUFFOzZEQUFhO0lBQ1o7UUFBUixLQUFLLEVBQUU7aUVBQWlCO0lBQ2hCO1FBQVIsS0FBSyxFQUFFO3NFQUF3QjtJQUN2QjtRQUFSLEtBQUssRUFBRTtzRUFBOEI7SUFDN0I7UUFBUixLQUFLLEVBQUU7b0VBQWtCO0lBQ2pCO1FBQVIsS0FBSyxFQUFFO29FQUFrQjtJQUVoQjtRQUFULE1BQU0sRUFBRTtpRUFBa0Q7SUFDakQ7UUFBVCxNQUFNLEVBQUU7K0RBQWdEO0lBVDlDLDJCQUEyQjtRQUx2QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFFBQVEsRUFBRSw2QkFBNkI7WUFDdkMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07U0FDaEQsQ0FBQztPQUNXLDJCQUEyQixDQW9JdkM7SUFBRCxrQ0FBQztDQUFBLEFBcElELElBb0lDO1NBcElZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL3NlbGVjdGlvbi50eXBlJztcbmltcG9ydCB7IHNlbGVjdFJvd3NCZXR3ZWVuLCBzZWxlY3RSb3dzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc2VsZWN0aW9uJztcbmltcG9ydCB7IEtleXMgfSBmcm9tICcuLi8uLi91dGlscy9rZXlzJztcblxuZXhwb3J0IGludGVyZmFjZSBNb2RlbCB7XG4gIHR5cGU6IHN0cmluZztcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50O1xuICByb3c6IGFueTtcbiAgcm93RWxlbWVudDogYW55O1xuICBjZWxsRWxlbWVudDogYW55O1xuICBjZWxsSW5kZXg6IG51bWJlcjtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZGF0YXRhYmxlLXNlbGVjdGlvbicsXG4gIHRlbXBsYXRlOiBgIDxuZy1jb250ZW50PjwvbmctY29udGVudD4gYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlU2VsZWN0aW9uQ29tcG9uZW50IHtcbiAgQElucHV0KCkgcm93czogYW55W107XG4gIEBJbnB1dCgpIHNlbGVjdGVkOiBhbnlbXTtcbiAgQElucHV0KCkgc2VsZWN0RW5hYmxlZDogYm9vbGVhbjtcbiAgQElucHV0KCkgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZTtcbiAgQElucHV0KCkgcm93SWRlbnRpdHk6IGFueTtcbiAgQElucHV0KCkgc2VsZWN0Q2hlY2s6IGFueTtcblxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcmV2SW5kZXg6IG51bWJlcjtcblxuICBzZWxlY3RSb3coZXZlbnQ6IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50LCBpbmRleDogbnVtYmVyLCByb3c6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RFbmFibGVkKSByZXR1cm47XG5cbiAgICBjb25zdCBjaGtib3ggPSB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuY2hlY2tib3g7XG4gICAgY29uc3QgbXVsdGkgPSB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUubXVsdGk7XG4gICAgY29uc3QgbXVsdGlDbGljayA9IHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5tdWx0aUNsaWNrO1xuICAgIGxldCBzZWxlY3RlZDogYW55W10gPSBbXTtcblxuICAgIGlmIChtdWx0aSB8fCBjaGtib3ggfHwgbXVsdGlDbGljaykge1xuICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHNlbGVjdGVkID0gc2VsZWN0Um93c0JldHdlZW4oW10sIHRoaXMucm93cywgaW5kZXgsIHRoaXMucHJldkluZGV4LCB0aGlzLmdldFJvd1NlbGVjdGVkSWR4LmJpbmQodGhpcykpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkgfHwgbXVsdGlDbGljayB8fCBjaGtib3gpIHtcbiAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3RSb3dzKFsuLi50aGlzLnNlbGVjdGVkXSwgcm93LCB0aGlzLmdldFJvd1NlbGVjdGVkSWR4LmJpbmQodGhpcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZWN0ZWQgPSBzZWxlY3RSb3dzKFtdLCByb3csIHRoaXMuZ2V0Um93U2VsZWN0ZWRJZHguYmluZCh0aGlzKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkID0gc2VsZWN0Um93cyhbXSwgcm93LCB0aGlzLmdldFJvd1NlbGVjdGVkSWR4LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3RDaGVjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2VsZWN0ZWQgPSBzZWxlY3RlZC5maWx0ZXIodGhpcy5zZWxlY3RDaGVjay5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGVkLnNwbGljZSgwLCB0aGlzLnNlbGVjdGVkLmxlbmd0aCk7XG4gICAgdGhpcy5zZWxlY3RlZC5wdXNoKC4uLnNlbGVjdGVkKTtcblxuICAgIHRoaXMucHJldkluZGV4ID0gaW5kZXg7XG5cbiAgICB0aGlzLnNlbGVjdC5lbWl0KHtcbiAgICAgIHNlbGVjdGVkXG4gICAgfSk7XG4gIH1cblxuICBvbkFjdGl2YXRlKG1vZGVsOiBNb2RlbCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHsgdHlwZSwgZXZlbnQsIHJvdyB9ID0gbW9kZWw7XG4gICAgY29uc3QgY2hrYm94ID0gdGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLmNoZWNrYm94O1xuICAgIGNvbnN0IHNlbGVjdCA9ICghY2hrYm94ICYmICh0eXBlID09PSAnY2xpY2snIHx8IHR5cGUgPT09ICdkYmxjbGljaycpKSB8fCAoY2hrYm94ICYmIHR5cGUgPT09ICdjaGVja2JveCcpO1xuXG4gICAgaWYgKHNlbGVjdCkge1xuICAgICAgdGhpcy5zZWxlY3RSb3coZXZlbnQsIGluZGV4LCByb3cpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2tleWRvd24nKSB7XG4gICAgICBpZiAoKDxLZXlib2FyZEV2ZW50PmV2ZW50KS5rZXlDb2RlID09PSBLZXlzLnJldHVybikge1xuICAgICAgICB0aGlzLnNlbGVjdFJvdyhldmVudCwgaW5kZXgsIHJvdyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uS2V5Ym9hcmRGb2N1cyhtb2RlbCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdChtb2RlbCk7XG4gIH1cblxuICBvbktleWJvYXJkRm9jdXMobW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgY29uc3QgeyBrZXlDb2RlIH0gPSA8S2V5Ym9hcmRFdmVudD5tb2RlbC5ldmVudDtcbiAgICBjb25zdCBzaG91bGRGb2N1cyA9IGtleUNvZGUgPT09IEtleXMudXAgfHwga2V5Q29kZSA9PT0gS2V5cy5kb3duIHx8IGtleUNvZGUgPT09IEtleXMucmlnaHQgfHwga2V5Q29kZSA9PT0gS2V5cy5sZWZ0O1xuXG4gICAgaWYgKHNob3VsZEZvY3VzKSB7XG4gICAgICBjb25zdCBpc0NlbGxTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuY2VsbDtcblxuICAgICAgaWYgKCFtb2RlbC5jZWxsRWxlbWVudCB8fCAhaXNDZWxsU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZm9jdXNSb3cobW9kZWwucm93RWxlbWVudCwga2V5Q29kZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzQ2VsbFNlbGVjdGlvbikge1xuICAgICAgICB0aGlzLmZvY3VzQ2VsbChtb2RlbC5jZWxsRWxlbWVudCwgbW9kZWwucm93RWxlbWVudCwga2V5Q29kZSwgbW9kZWwuY2VsbEluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb2N1c1Jvdyhyb3dFbGVtZW50OiBhbnksIGtleUNvZGU6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IG5leHRSb3dFbGVtZW50ID0gdGhpcy5nZXRQcmV2TmV4dFJvdyhyb3dFbGVtZW50LCBrZXlDb2RlKTtcbiAgICBpZiAobmV4dFJvd0VsZW1lbnQpIG5leHRSb3dFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBnZXRQcmV2TmV4dFJvdyhyb3dFbGVtZW50OiBhbnksIGtleUNvZGU6IG51bWJlcik6IGFueSB7XG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IHJvd0VsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICAgIGlmIChwYXJlbnRFbGVtZW50KSB7XG4gICAgICBsZXQgZm9jdXNFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICAgIGlmIChrZXlDb2RlID09PSBLZXlzLnVwKSB7XG4gICAgICAgIGZvY3VzRWxlbWVudCA9IHBhcmVudEVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5cy5kb3duKSB7XG4gICAgICAgIGZvY3VzRWxlbWVudCA9IHBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgfVxuXG4gICAgICBpZiAoZm9jdXNFbGVtZW50ICYmIGZvY3VzRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZvY3VzRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb2N1c0NlbGwoY2VsbEVsZW1lbnQ6IGFueSwgcm93RWxlbWVudDogYW55LCBrZXlDb2RlOiBudW1iZXIsIGNlbGxJbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgbGV0IG5leHRDZWxsRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAoa2V5Q29kZSA9PT0gS2V5cy5sZWZ0KSB7XG4gICAgICBuZXh0Q2VsbEVsZW1lbnQgPSBjZWxsRWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5cy5yaWdodCkge1xuICAgICAgbmV4dENlbGxFbGVtZW50ID0gY2VsbEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5cy51cCB8fCBrZXlDb2RlID09PSBLZXlzLmRvd24pIHtcbiAgICAgIGNvbnN0IG5leHRSb3dFbGVtZW50ID0gdGhpcy5nZXRQcmV2TmV4dFJvdyhyb3dFbGVtZW50LCBrZXlDb2RlKTtcbiAgICAgIGlmIChuZXh0Um93RWxlbWVudCkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IG5leHRSb3dFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RhdGF0YWJsZS1ib2R5LWNlbGwnKTtcbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCkgbmV4dENlbGxFbGVtZW50ID0gY2hpbGRyZW5bY2VsbEluZGV4XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmV4dENlbGxFbGVtZW50KSBuZXh0Q2VsbEVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGdldFJvd1NlbGVjdGVkKHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Um93U2VsZWN0ZWRJZHgocm93LCB0aGlzLnNlbGVjdGVkKSA+IC0xO1xuICB9XG5cbiAgZ2V0Um93U2VsZWN0ZWRJZHgocm93OiBhbnksIHNlbGVjdGVkOiBhbnlbXSk6IG51bWJlciB7XG4gICAgaWYgKCFzZWxlY3RlZCB8fCAhc2VsZWN0ZWQubGVuZ3RoKSByZXR1cm4gLTE7XG5cbiAgICBjb25zdCByb3dJZCA9IHRoaXMucm93SWRlbnRpdHkocm93KTtcbiAgICByZXR1cm4gc2VsZWN0ZWQuZmluZEluZGV4KHIgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnJvd0lkZW50aXR5KHIpO1xuICAgICAgcmV0dXJuIGlkID09PSByb3dJZDtcbiAgICB9KTtcbiAgfVxufVxuIl19