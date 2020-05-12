import { __decorate } from "tslib";
import { Component, Input, ElementRef, Output, EventEmitter, Renderer2, NgZone, OnInit, OnDestroy, HostBinding, ChangeDetectionStrategy } from '@angular/core';
var ScrollerComponent = /** @class */ (function () {
    function ScrollerComponent(ngZone, element, renderer) {
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.scrollbarV = false;
        this.scrollbarH = false;
        this.scroll = new EventEmitter();
        this.scrollYPos = 0;
        this.scrollXPos = 0;
        this.prevScrollYPos = 0;
        this.prevScrollXPos = 0;
        this._scrollEventListener = null;
        this.element = element.nativeElement;
    }
    ScrollerComponent.prototype.ngOnInit = function () {
        // manual bind so we don't always listen
        if (this.scrollbarV || this.scrollbarH) {
            var renderer = this.renderer;
            this.parentElement = renderer.parentNode(renderer.parentNode(this.element));
            this._scrollEventListener = this.onScrolled.bind(this);
            this.parentElement.addEventListener('scroll', this._scrollEventListener);
        }
    };
    ScrollerComponent.prototype.ngOnDestroy = function () {
        if (this._scrollEventListener) {
            this.parentElement.removeEventListener('scroll', this._scrollEventListener);
            this._scrollEventListener = null;
        }
    };
    ScrollerComponent.prototype.setOffset = function (offsetY) {
        if (this.parentElement) {
            this.parentElement.scrollTop = offsetY;
        }
    };
    ScrollerComponent.prototype.onScrolled = function (event) {
        var _this = this;
        var dom = event.currentTarget;
        requestAnimationFrame(function () {
            _this.scrollYPos = dom.scrollTop;
            _this.scrollXPos = dom.scrollLeft;
            _this.updateOffset();
        });
    };
    ScrollerComponent.prototype.updateOffset = function () {
        var direction;
        if (this.scrollYPos < this.prevScrollYPos) {
            direction = 'down';
        }
        else if (this.scrollYPos > this.prevScrollYPos) {
            direction = 'up';
        }
        this.scroll.emit({
            direction: direction,
            scrollYPos: this.scrollYPos,
            scrollXPos: this.scrollXPos
        });
        this.prevScrollYPos = this.scrollYPos;
        this.prevScrollXPos = this.scrollXPos;
    };
    ScrollerComponent.ctorParameters = function () { return [
        { type: NgZone },
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    __decorate([
        Input()
    ], ScrollerComponent.prototype, "scrollbarV", void 0);
    __decorate([
        Input()
    ], ScrollerComponent.prototype, "scrollbarH", void 0);
    __decorate([
        HostBinding('style.height.px'),
        Input()
    ], ScrollerComponent.prototype, "scrollHeight", void 0);
    __decorate([
        HostBinding('style.width.px'),
        Input()
    ], ScrollerComponent.prototype, "scrollWidth", void 0);
    __decorate([
        Output()
    ], ScrollerComponent.prototype, "scroll", void 0);
    ScrollerComponent = __decorate([
        Component({
            selector: 'datatable-scroller',
            template: " <ng-content></ng-content> ",
            host: {
                class: 'datatable-scroll'
            },
            changeDetection: ChangeDetectionStrategy.OnPush
        })
    ], ScrollerComponent);
    return ScrollerComponent;
}());
export { ScrollerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ib2R5L3Njcm9sbGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsVUFBVSxFQUNWLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCx1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFZdkI7SUF3QkUsMkJBQW9CLE1BQWMsRUFBRSxPQUFtQixFQUFVLFFBQW1CO1FBQWhFLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBK0IsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQXZCM0UsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixlQUFVLEdBQVksS0FBSyxDQUFDO1FBVTNCLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV6RCxlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFDM0IsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFLbkIseUJBQW9CLEdBQVEsSUFBSSxDQUFDO1FBR3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsb0NBQVEsR0FBUjtRQUNFLHdDQUF3QztRQUN4QyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN0QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQy9CLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUMxRTtJQUNILENBQUM7SUFFRCx1Q0FBVyxHQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCxxQ0FBUyxHQUFULFVBQVUsT0FBZTtRQUN2QixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVELHNDQUFVLEdBQVYsVUFBVyxLQUFpQjtRQUE1QixpQkFPQztRQU5DLElBQU0sR0FBRyxHQUFxQixLQUFLLENBQUMsYUFBYSxDQUFDO1FBQ2xELHFCQUFxQixDQUFDO1lBQ3BCLEtBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUNoQyxLQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDakMsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdDQUFZLEdBQVo7UUFDRSxJQUFJLFNBQWlCLENBQUM7UUFDdEIsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDekMsU0FBUyxHQUFHLE1BQU0sQ0FBQztTQUNwQjthQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ2hELFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDbEI7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLFNBQVMsV0FBQTtZQUNULFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN4QyxDQUFDOztnQkFwRDJCLE1BQU07Z0JBQVcsVUFBVTtnQkFBb0IsU0FBUzs7SUF2QjNFO1FBQVIsS0FBSyxFQUFFO3lEQUE2QjtJQUM1QjtRQUFSLEtBQUssRUFBRTt5REFBNkI7SUFJckM7UUFGQyxXQUFXLENBQUMsaUJBQWlCLENBQUM7UUFDOUIsS0FBSyxFQUFFOzJEQUNhO0lBSXJCO1FBRkMsV0FBVyxDQUFDLGdCQUFnQixDQUFDO1FBQzdCLEtBQUssRUFBRTswREFDWTtJQUVWO1FBQVQsTUFBTSxFQUFFO3FEQUFnRDtJQVo5QyxpQkFBaUI7UUFSN0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixRQUFRLEVBQUUsNkJBQTZCO1lBQ3ZDLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsa0JBQWtCO2FBQzFCO1lBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07U0FDaEQsQ0FBQztPQUNXLGlCQUFpQixDQTZFN0I7SUFBRCx3QkFBQztDQUFBLEFBN0VELElBNkVDO1NBN0VZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIEVsZW1lbnRSZWYsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjIsXG4gIE5nWm9uZSxcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIEhvc3RCaW5kaW5nLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTW91c2VFdmVudCB9IGZyb20gJy4uLy4uL2V2ZW50cyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RhdGF0YWJsZS1zY3JvbGxlcicsXG4gIHRlbXBsYXRlOiBgIDxuZy1jb250ZW50PjwvbmctY29udGVudD4gYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnZGF0YXRhYmxlLXNjcm9sbCdcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIHNjcm9sbGJhclY6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgc2Nyb2xsYmFySDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0LnB4JylcbiAgQElucHV0KClcbiAgc2Nyb2xsSGVpZ2h0OiBudW1iZXI7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aC5weCcpXG4gIEBJbnB1dCgpXG4gIHNjcm9sbFdpZHRoOiBudW1iZXI7XG5cbiAgQE91dHB1dCgpIHNjcm9sbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgc2Nyb2xsWVBvczogbnVtYmVyID0gMDtcbiAgc2Nyb2xsWFBvczogbnVtYmVyID0gMDtcbiAgcHJldlNjcm9sbFlQb3M6IG51bWJlciA9IDA7XG4gIHByZXZTY3JvbGxYUG9zOiBudW1iZXIgPSAwO1xuICBlbGVtZW50OiBhbnk7XG4gIHBhcmVudEVsZW1lbnQ6IGFueTtcbiAgb25TY3JvbGxMaXN0ZW5lcjogYW55O1xuXG4gIHByaXZhdGUgX3Njcm9sbEV2ZW50TGlzdGVuZXI6IGFueSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gbWFudWFsIGJpbmQgc28gd2UgZG9uJ3QgYWx3YXlzIGxpc3RlblxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgfHwgdGhpcy5zY3JvbGxiYXJIKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMucmVuZGVyZXI7XG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQgPSByZW5kZXJlci5wYXJlbnROb2RlKHJlbmRlcmVyLnBhcmVudE5vZGUodGhpcy5lbGVtZW50KSk7XG4gICAgICB0aGlzLl9zY3JvbGxFdmVudExpc3RlbmVyID0gdGhpcy5vblNjcm9sbGVkLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5fc2Nyb2xsRXZlbnRMaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3Njcm9sbEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRoaXMucGFyZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLl9zY3JvbGxFdmVudExpc3RlbmVyKTtcbiAgICAgIHRoaXMuX3Njcm9sbEV2ZW50TGlzdGVuZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNldE9mZnNldChvZmZzZXRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wID0gb2Zmc2V0WTtcbiAgICB9XG4gIH1cblxuICBvblNjcm9sbGVkKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgZG9tOiBFbGVtZW50ID0gPEVsZW1lbnQ+ZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxZUG9zID0gZG9tLnNjcm9sbFRvcDtcbiAgICAgIHRoaXMuc2Nyb2xsWFBvcyA9IGRvbS5zY3JvbGxMZWZ0O1xuICAgICAgdGhpcy51cGRhdGVPZmZzZXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZU9mZnNldCgpOiB2b2lkIHtcbiAgICBsZXQgZGlyZWN0aW9uOiBzdHJpbmc7XG4gICAgaWYgKHRoaXMuc2Nyb2xsWVBvcyA8IHRoaXMucHJldlNjcm9sbFlQb3MpIHtcbiAgICAgIGRpcmVjdGlvbiA9ICdkb3duJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2Nyb2xsWVBvcyA+IHRoaXMucHJldlNjcm9sbFlQb3MpIHtcbiAgICAgIGRpcmVjdGlvbiA9ICd1cCc7XG4gICAgfVxuXG4gICAgdGhpcy5zY3JvbGwuZW1pdCh7XG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBzY3JvbGxZUG9zOiB0aGlzLnNjcm9sbFlQb3MsXG4gICAgICBzY3JvbGxYUG9zOiB0aGlzLnNjcm9sbFhQb3NcbiAgICB9KTtcblxuICAgIHRoaXMucHJldlNjcm9sbFlQb3MgPSB0aGlzLnNjcm9sbFlQb3M7XG4gICAgdGhpcy5wcmV2U2Nyb2xsWFBvcyA9IHRoaXMuc2Nyb2xsWFBvcztcbiAgfVxufVxuIl19