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
let CountUpDirective = class CountUpDirective {
    constructor(cd, element) {
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
    set countDecimals(val) {
        this._countDecimals = val;
    }
    get countDecimals() {
        if (this._countDecimals)
            return this._countDecimals;
        return decimalChecker(this.countTo);
    }
    set countTo(val) {
        this._countTo = parseFloat(val);
        this.start();
    }
    get countTo() {
        return this._countTo;
    }
    set countFrom(val) {
        this._countFrom = parseFloat(val);
        this.start();
    }
    get countFrom() {
        return this._countFrom;
    }
    ngOnDestroy() {
        cancelAnimationFrame(this.animationReq);
    }
    start() {
        cancelAnimationFrame(this.animationReq);
        const valueFormatting = this.valueFormatting || (value => `${this.countPrefix}${value.toLocaleString()}${this.countSuffix}`);
        const callback = ({ value, progress, finished }) => {
            this.value = valueFormatting(value);
            this.cd.markForCheck();
            if (!finished)
                this.countChange.emit({ value: this.value, progress });
            if (finished)
                this.countFinish.emit({ value: this.value, progress });
        };
        this.animationReq = count(this.countFrom, this.countTo, this.countDecimals, this.countDuration, callback);
    }
};
CountUpDirective.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef }
];
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
        template: ` {{ value }} `
    })
], CountUpDirective);
export { CountUpDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvY29tbW9uL2NvdW50L2NvdW50LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pILE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkQ7Ozs7Ozs7O0dBUUc7QUFLSCxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQWtEM0IsWUFBb0IsRUFBcUIsRUFBRSxPQUFtQjtRQUExQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQWpEaEMsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFDekIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFpQ3hCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFJM0MsVUFBSyxHQUFRLEVBQUUsQ0FBQztRQUtSLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO1FBQzNCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUc3QixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDN0MsQ0FBQztJQTdDRCxJQUFJLGFBQWEsQ0FBQyxHQUFXO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDZixJQUFJLElBQUksQ0FBQyxjQUFjO1lBQUUsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3BELE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBR0QsSUFBSSxPQUFPLENBQUMsR0FBRztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUdELElBQUksU0FBUyxDQUFDLEdBQUc7UUFDZixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFvQkQsV0FBVztRQUNULG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSztRQUNILG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV4QyxNQUFNLGVBQWUsR0FDbkIsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxjQUFjLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUV2RyxNQUFNLFFBQVEsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQ2pELElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLElBQUksUUFBUTtnQkFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1RyxDQUFDO0NBQ0YsQ0FBQTs7WUF2QnlCLGlCQUFpQjtZQUFXLFVBQVU7O0FBakRyRDtJQUFSLEtBQUssRUFBRTt1REFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7cURBQTBCO0FBQ3pCO0lBQVIsS0FBSyxFQUFFO3FEQUEwQjtBQUN6QjtJQUFSLEtBQUssRUFBRTt5REFBc0I7QUFHOUI7SUFEQyxLQUFLLEVBQUU7cURBR1A7QUFRRDtJQURDLEtBQUssRUFBRTsrQ0FJUDtBQU9EO0lBREMsS0FBSyxFQUFFO2lEQUlQO0FBTVM7SUFBVCxNQUFNLEVBQUU7cURBQWtDO0FBQ2pDO0lBQVQsTUFBTSxFQUFFO3FEQUFrQztBQXJDaEMsZ0JBQWdCO0lBSjVCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSx1QkFBdUI7UUFDakMsUUFBUSxFQUFFLGVBQWU7S0FDMUIsQ0FBQztHQUNXLGdCQUFnQixDQXlFNUI7U0F6RVksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdG9yUmVmLCBPbkRlc3Ryb3ksIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvdW50LCBkZWNpbWFsQ2hlY2tlciB9IGZyb20gJy4vY291bnQuaGVscGVyJztcblxuLyoqXG4gKiBDb3VudCB1cCBjb21wb25lbnRcbiAqXG4gKiBMb29zZWx5IGluc3BpcmVkIGJ5OlxuICogIC0gaHR0cHM6Ly9naXRodWIuY29tL2l6dXBldC9hbmd1bGFyMi1jb3VudG9cbiAqICAtIGh0dHBzOi8vaW5vcmdhbmlrLmdpdGh1Yi5pby9jb3VudFVwLmpzL1xuICpcbiAqIEBleHBvcnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW25neC1jaGFydHMtY291bnQtdXBdJyxcbiAgdGVtcGxhdGU6IGAge3sgdmFsdWUgfX0gYFxufSlcbmV4cG9ydCBjbGFzcyBDb3VudFVwRGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgQElucHV0KCkgY291bnREdXJhdGlvbjogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgY291bnRQcmVmaXg6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBjb3VudFN1ZmZpeDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHZhbHVlRm9ybWF0dGluZzogYW55O1xuXG4gIEBJbnB1dCgpXG4gIHNldCBjb3VudERlY2ltYWxzKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fY291bnREZWNpbWFscyA9IHZhbDtcbiAgfVxuXG4gIGdldCBjb3VudERlY2ltYWxzKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX2NvdW50RGVjaW1hbHMpIHJldHVybiB0aGlzLl9jb3VudERlY2ltYWxzO1xuICAgIHJldHVybiBkZWNpbWFsQ2hlY2tlcih0aGlzLmNvdW50VG8pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNvdW50VG8odmFsKSB7XG4gICAgdGhpcy5fY291bnRUbyA9IHBhcnNlRmxvYXQodmFsKTtcbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBnZXQgY291bnRUbygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9jb3VudFRvO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNvdW50RnJvbSh2YWwpIHtcbiAgICB0aGlzLl9jb3VudEZyb20gPSBwYXJzZUZsb2F0KHZhbCk7XG4gICAgdGhpcy5zdGFydCgpO1xuICB9XG5cbiAgZ2V0IGNvdW50RnJvbSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9jb3VudEZyb207XG4gIH1cblxuICBAT3V0cHV0KCkgY291bnRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBjb3VudEZpbmlzaCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBuYXRpdmVFbGVtZW50OiBhbnk7XG5cbiAgdmFsdWU6IGFueSA9ICcnO1xuICBmb3JtYXR0ZWRWYWx1ZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgYW5pbWF0aW9uUmVxOiBhbnk7XG5cbiAgcHJpdmF0ZSBfY291bnREZWNpbWFsczogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBfY291bnRUbzogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBfY291bnRGcm9tOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5uYXRpdmVFbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25SZXEpO1xuICB9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25SZXEpO1xuXG4gICAgY29uc3QgdmFsdWVGb3JtYXR0aW5nID1cbiAgICAgIHRoaXMudmFsdWVGb3JtYXR0aW5nIHx8ICh2YWx1ZSA9PiBgJHt0aGlzLmNvdW50UHJlZml4fSR7dmFsdWUudG9Mb2NhbGVTdHJpbmcoKX0ke3RoaXMuY291bnRTdWZmaXh9YCk7XG5cbiAgICBjb25zdCBjYWxsYmFjayA9ICh7IHZhbHVlLCBwcm9ncmVzcywgZmluaXNoZWQgfSkgPT4ge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlRm9ybWF0dGluZyh2YWx1ZSk7XG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgaWYgKCFmaW5pc2hlZCkgdGhpcy5jb3VudENoYW5nZS5lbWl0KHsgdmFsdWU6IHRoaXMudmFsdWUsIHByb2dyZXNzIH0pO1xuICAgICAgaWYgKGZpbmlzaGVkKSB0aGlzLmNvdW50RmluaXNoLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSwgcHJvZ3Jlc3MgfSk7XG4gICAgfTtcblxuICAgIHRoaXMuYW5pbWF0aW9uUmVxID0gY291bnQodGhpcy5jb3VudEZyb20sIHRoaXMuY291bnRUbywgdGhpcy5jb3VudERlY2ltYWxzLCB0aGlzLmNvdW50RHVyYXRpb24sIGNhbGxiYWNrKTtcbiAgfVxufVxuIl19