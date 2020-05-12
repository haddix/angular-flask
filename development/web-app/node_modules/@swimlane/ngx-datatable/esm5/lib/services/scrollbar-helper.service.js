import { __decorate, __param } from "tslib";
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
/**
 * Gets the width of the scrollbar.  Nesc for windows
 * http://stackoverflow.com/a/13382873/888165
 */
var ScrollbarHelper = /** @class */ (function () {
    function ScrollbarHelper(document) {
        this.document = document;
        this.width = this.getWidth();
    }
    ScrollbarHelper.prototype.getWidth = function () {
        var outer = this.document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar';
        this.document.body.appendChild(outer);
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = 'scroll';
        var inner = this.document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return widthNoScroll - widthWithScroll;
    };
    ScrollbarHelper.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    ScrollbarHelper = __decorate([
        Injectable(),
        __param(0, Inject(DOCUMENT))
    ], ScrollbarHelper);
    return ScrollbarHelper;
}());
export { ScrollbarHelper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsYmFyLWhlbHBlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvc2Nyb2xsYmFyLWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFM0M7OztHQUdHO0FBRUg7SUFHRSx5QkFBc0MsUUFBYTtRQUFiLGFBQVEsR0FBUixRQUFRLENBQUs7UUFGbkQsVUFBSyxHQUFXLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUVzQixDQUFDO0lBRXZELGtDQUFRLEdBQVI7UUFDRSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQzVCLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQztRQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUN4QyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFaEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQzNCLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFekIsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUMxQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVwQyxPQUFPLGFBQWEsR0FBRyxlQUFlLENBQUM7SUFDekMsQ0FBQzs7Z0RBcEJZLE1BQU0sU0FBQyxRQUFROztJQUhqQixlQUFlO1FBRDNCLFVBQVUsRUFBRTtRQUlFLFdBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BSGxCLGVBQWUsQ0F3QjNCO0lBQUQsc0JBQUM7Q0FBQSxBQXhCRCxJQXdCQztTQXhCWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogR2V0cyB0aGUgd2lkdGggb2YgdGhlIHNjcm9sbGJhci4gIE5lc2MgZm9yIHdpbmRvd3NcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzMzgyODczLzg4ODE2NVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2Nyb2xsYmFySGVscGVyIHtcbiAgd2lkdGg6IG51bWJlciA9IHRoaXMuZ2V0V2lkdGgoKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnkpIHt9XG5cbiAgZ2V0V2lkdGgoKTogbnVtYmVyIHtcbiAgICBjb25zdCBvdXRlciA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3V0ZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIG91dGVyLnN0eWxlLndpZHRoID0gJzEwMHB4JztcbiAgICBvdXRlci5zdHlsZS5tc092ZXJmbG93U3R5bGUgPSAnc2Nyb2xsYmFyJztcbiAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3V0ZXIpO1xuXG4gICAgY29uc3Qgd2lkdGhOb1Njcm9sbCA9IG91dGVyLm9mZnNldFdpZHRoO1xuICAgIG91dGVyLnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG5cbiAgICBjb25zdCBpbm5lciA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaW5uZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgb3V0ZXIuYXBwZW5kQ2hpbGQoaW5uZXIpO1xuXG4gICAgY29uc3Qgd2lkdGhXaXRoU2Nyb2xsID0gaW5uZXIub2Zmc2V0V2lkdGg7XG4gICAgb3V0ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvdXRlcik7XG5cbiAgICByZXR1cm4gd2lkdGhOb1Njcm9sbCAtIHdpZHRoV2l0aFNjcm9sbDtcbiAgfVxufVxuIl19