import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { count, decimalChecker } from './count.helper';
/**
 * Count up component
 *
 * Loosely inspired by:
 *  - https://github.com/izupet/angular2-counto
 *  - https://inorganik.github.io/countUp.js/
 *
 * @export
 */
var CountUpDirective = /** @class */ (function () {
    function CountUpDirective(cd, element) {
        this.cd = cd;
        this.countDuration = 1;
        this.countPrefix = '';
        this.countSuffix = '';
        this.countChange = new EventEmitter();
        this.countFinish = new EventEmitter();
        this.value = '';
        this._countDecimals = 0;
        this._countTo = 0;
        this._countFrom = 0;
        this.nativeElement = element.nativeElement;
    }
    Object.defineProperty(CountUpDirective.prototype, "countDecimals", {
        get: function () {
            if (this._countDecimals)
                return this._countDecimals;
            return decimalChecker(this.countTo);
        },
        set: function (val) {
            this._countDecimals = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CountUpDirective.prototype, "countTo", {
        get: function () {
            return this._countTo;
        },
        set: function (val) {
            this._countTo = parseFloat(val);
            this.start();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CountUpDirective.prototype, "countFrom", {
        get: function () {
            return this._countFrom;
        },
        set: function (val) {
            this._countFrom = parseFloat(val);
            this.start();
        },
        enumerable: true,
        configurable: true
    });
    CountUpDirective.prototype.ngOnDestroy = function () {
        cancelAnimationFrame(this.animationReq);
    };
    CountUpDirective.prototype.start = function () {
        var _this = this;
        cancelAnimationFrame(this.animationReq);
        var valueFormatting = this.valueFormatting || (function (value) { return "" + _this.countPrefix + value.toLocaleString() + _this.countSuffix; });
        var callback = function (_a) {
            var value = _a.value, progress = _a.progress, finished = _a.finished;
            _this.value = valueFormatting(value);
            _this.cd.markForCheck();
            if (!finished)
                _this.countChange.emit({ value: _this.value, progress: progress });
            if (finished)
                _this.countFinish.emit({ value: _this.value, progress: progress });
        };
        this.animationReq = count(this.countFrom, this.countTo, this.countDecimals, this.countDuration, callback);
    };
    CountUpDirective.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], CountUpDirective.prototype, "countDuration", void 0);
    __decorate([
        Input()
    ], CountUpDirective.prototype, "countPrefix", void 0);
    __decorate([
        Input()
    ], CountUpDirective.prototype, "countSuffix", void 0);
    __decorate([
        Input()
    ], CountUpDirective.prototype, "valueFormatting", void 0);
    __decorate([
        Input()
    ], CountUpDirective.prototype, "countDecimals", null);
    __decorate([
        Input()
    ], CountUpDirective.prototype, "countTo", null);
    __decorate([
        Input()
    ], CountUpDirective.prototype, "countFrom", null);
    __decorate([
        Output()
    ], CountUpDirective.prototype, "countChange", void 0);
    __decorate([
        Output()
    ], CountUpDirective.prototype, "countFinish", void 0);
    CountUpDirective = __decorate([
        Component({
            selector: '[ngx-charts-count-up]',
            template: " {{ value }} "
        })
    ], CountUpDirective);
    return CountUpDirective;
}());
export { CountUpDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvY29tbW9uL2NvdW50L2NvdW50LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pILE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkQ7Ozs7Ozs7O0dBUUc7QUFLSDtJQWtERSwwQkFBb0IsRUFBcUIsRUFBRSxPQUFtQjtRQUExQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQWpEaEMsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFDekIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFpQ3hCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFJM0MsVUFBSyxHQUFRLEVBQUUsQ0FBQztRQUtSLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO1FBQzNCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUc3QixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDN0MsQ0FBQztJQTdDRCxzQkFBSSwyQ0FBYTthQUlqQjtZQUNFLElBQUksSUFBSSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3BELE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxDQUFDO2FBUEQsVUFBa0IsR0FBVztZQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUM1QixDQUFDOzs7T0FBQTtJQVFELHNCQUFJLHFDQUFPO2FBS1g7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQVBELFVBQVksR0FBRztZQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLENBQUM7OztPQUFBO0lBT0Qsc0JBQUksdUNBQVM7YUFLYjtZQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDO2FBUEQsVUFBYyxHQUFHO1lBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsQ0FBQzs7O09BQUE7SUF3QkQsc0NBQVcsR0FBWDtRQUNFLG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsZ0NBQUssR0FBTDtRQUFBLGlCQWNDO1FBYkMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXhDLElBQU0sZUFBZSxHQUNuQixJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFHLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGNBQWMsRUFBRSxHQUFHLEtBQUksQ0FBQyxXQUFhLEVBQWpFLENBQWlFLENBQUMsQ0FBQztRQUV2RyxJQUFNLFFBQVEsR0FBRyxVQUFDLEVBQTZCO2dCQUEzQixnQkFBSyxFQUFFLHNCQUFRLEVBQUUsc0JBQVE7WUFDM0MsS0FBSSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUTtnQkFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsVUFBQSxFQUFFLENBQUMsQ0FBQztZQUN0RSxJQUFJLFFBQVE7Z0JBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSSxDQUFDLEtBQUssRUFBRSxRQUFRLFVBQUEsRUFBRSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1RyxDQUFDOztnQkF0QnVCLGlCQUFpQjtnQkFBVyxVQUFVOztJQWpEckQ7UUFBUixLQUFLLEVBQUU7MkRBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFO3lEQUEwQjtJQUN6QjtRQUFSLEtBQUssRUFBRTt5REFBMEI7SUFDekI7UUFBUixLQUFLLEVBQUU7NkRBQXNCO0lBRzlCO1FBREMsS0FBSyxFQUFFO3lEQUdQO0lBUUQ7UUFEQyxLQUFLLEVBQUU7bURBSVA7SUFPRDtRQURDLEtBQUssRUFBRTtxREFJUDtJQU1TO1FBQVQsTUFBTSxFQUFFO3lEQUFrQztJQUNqQztRQUFULE1BQU0sRUFBRTt5REFBa0M7SUFyQ2hDLGdCQUFnQjtRQUo1QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLFFBQVEsRUFBRSxlQUFlO1NBQzFCLENBQUM7T0FDVyxnQkFBZ0IsQ0F5RTVCO0lBQUQsdUJBQUM7Q0FBQSxBQXpFRCxJQXlFQztTQXpFWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE9uRGVzdHJveSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY291bnQsIGRlY2ltYWxDaGVja2VyIH0gZnJvbSAnLi9jb3VudC5oZWxwZXInO1xuXG4vKipcbiAqIENvdW50IHVwIGNvbXBvbmVudFxuICpcbiAqIExvb3NlbHkgaW5zcGlyZWQgYnk6XG4gKiAgLSBodHRwczovL2dpdGh1Yi5jb20vaXp1cGV0L2FuZ3VsYXIyLWNvdW50b1xuICogIC0gaHR0cHM6Ly9pbm9yZ2FuaWsuZ2l0aHViLmlvL2NvdW50VXAuanMvXG4gKlxuICogQGV4cG9ydFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbmd4LWNoYXJ0cy1jb3VudC11cF0nLFxuICB0ZW1wbGF0ZTogYCB7eyB2YWx1ZSB9fSBgXG59KVxuZXhwb3J0IGNsYXNzIENvdW50VXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBjb3VudER1cmF0aW9uOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBjb3VudFByZWZpeDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIGNvdW50U3VmZml4OiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgdmFsdWVGb3JtYXR0aW5nOiBhbnk7XG5cbiAgQElucHV0KClcbiAgc2V0IGNvdW50RGVjaW1hbHModmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jb3VudERlY2ltYWxzID0gdmFsO1xuICB9XG5cbiAgZ2V0IGNvdW50RGVjaW1hbHMoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fY291bnREZWNpbWFscykgcmV0dXJuIHRoaXMuX2NvdW50RGVjaW1hbHM7XG4gICAgcmV0dXJuIGRlY2ltYWxDaGVja2VyKHRoaXMuY291bnRUbyk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY291bnRUbyh2YWwpIHtcbiAgICB0aGlzLl9jb3VudFRvID0gcGFyc2VGbG9hdCh2YWwpO1xuICAgIHRoaXMuc3RhcnQoKTtcbiAgfVxuXG4gIGdldCBjb3VudFRvKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50VG87XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY291bnRGcm9tKHZhbCkge1xuICAgIHRoaXMuX2NvdW50RnJvbSA9IHBhcnNlRmxvYXQodmFsKTtcbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBnZXQgY291bnRGcm9tKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50RnJvbTtcbiAgfVxuXG4gIEBPdXRwdXQoKSBjb3VudENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGNvdW50RmluaXNoID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIG5hdGl2ZUVsZW1lbnQ6IGFueTtcblxuICB2YWx1ZTogYW55ID0gJyc7XG4gIGZvcm1hdHRlZFZhbHVlOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBhbmltYXRpb25SZXE6IGFueTtcblxuICBwcml2YXRlIF9jb3VudERlY2ltYWxzOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIF9jb3VudFRvOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIF9jb3VudEZyb206IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLm5hdGl2ZUVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvblJlcSk7XG4gIH1cblxuICBzdGFydCgpOiB2b2lkIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvblJlcSk7XG5cbiAgICBjb25zdCB2YWx1ZUZvcm1hdHRpbmcgPVxuICAgICAgdGhpcy52YWx1ZUZvcm1hdHRpbmcgfHwgKHZhbHVlID0+IGAke3RoaXMuY291bnRQcmVmaXh9JHt2YWx1ZS50b0xvY2FsZVN0cmluZygpfSR7dGhpcy5jb3VudFN1ZmZpeH1gKTtcblxuICAgIGNvbnN0IGNhbGxiYWNrID0gKHsgdmFsdWUsIHByb2dyZXNzLCBmaW5pc2hlZCB9KSA9PiB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWVGb3JtYXR0aW5nKHZhbHVlKTtcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICBpZiAoIWZpbmlzaGVkKSB0aGlzLmNvdW50Q2hhbmdlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSwgcHJvZ3Jlc3MgfSk7XG4gICAgICBpZiAoZmluaXNoZWQpIHRoaXMuY291bnRGaW5pc2guZW1pdCh7IHZhbHVlOiB0aGlzLnZhbHVlLCBwcm9ncmVzcyB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5hbmltYXRpb25SZXEgPSBjb3VudCh0aGlzLmNvdW50RnJvbSwgdGhpcy5jb3VudFRvLCB0aGlzLmNvdW50RGVjaW1hbHMsIHRoaXMuY291bnREdXJhdGlvbiwgY2FsbGJhY2spO1xuICB9XG59XG4iXX0=