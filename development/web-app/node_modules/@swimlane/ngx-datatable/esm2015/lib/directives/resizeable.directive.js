import { __decorate } from "tslib";
import { Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
let ResizeableDirective = class ResizeableDirective {
    constructor(element, renderer) {
        this.renderer = renderer;
        this.resizeEnabled = true;
        this.resize = new EventEmitter();
        this.resizing = false;
        this.element = element.nativeElement;
    }
    ngAfterViewInit() {
        const renderer2 = this.renderer;
        this.resizeHandle = renderer2.createElement('span');
        if (this.resizeEnabled) {
            renderer2.addClass(this.resizeHandle, 'resize-handle');
        }
        else {
            renderer2.addClass(this.resizeHandle, 'resize-handle--not-resizable');
        }
        renderer2.appendChild(this.element, this.resizeHandle);
    }
    ngOnDestroy() {
        this._destroySubscription();
        if (this.renderer.destroyNode) {
            this.renderer.destroyNode(this.resizeHandle);
        }
        else if (this.resizeHandle) {
            this.renderer.removeChild(this.renderer.parentNode(this.resizeHandle), this.resizeHandle);
        }
    }
    onMouseup() {
        this.resizing = false;
        if (this.subscription && !this.subscription.closed) {
            this._destroySubscription();
            this.resize.emit(this.element.clientWidth);
        }
    }
    onMousedown(event) {
        const isHandle = event.target.classList.contains('resize-handle');
        const initialWidth = this.element.clientWidth;
        const mouseDownScreenX = event.screenX;
        if (isHandle) {
            event.stopPropagation();
            this.resizing = true;
            const mouseup = fromEvent(document, 'mouseup');
            this.subscription = mouseup.subscribe((ev) => this.onMouseup());
            const mouseMoveSub = fromEvent(document, 'mousemove')
                .pipe(takeUntil(mouseup))
                .subscribe((e) => this.move(e, initialWidth, mouseDownScreenX));
            this.subscription.add(mouseMoveSub);
        }
    }
    move(event, initialWidth, mouseDownScreenX) {
        const movementX = event.screenX - mouseDownScreenX;
        const newWidth = initialWidth + movementX;
        const overMinWidth = !this.minWidth || newWidth >= this.minWidth;
        const underMaxWidth = !this.maxWidth || newWidth <= this.maxWidth;
        if (overMinWidth && underMaxWidth) {
            this.element.style.width = `${newWidth}px`;
        }
    }
    _destroySubscription() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
};
ResizeableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
__decorate([
    Input()
], ResizeableDirective.prototype, "resizeEnabled", void 0);
__decorate([
    Input()
], ResizeableDirective.prototype, "minWidth", void 0);
__decorate([
    Input()
], ResizeableDirective.prototype, "maxWidth", void 0);
__decorate([
    Output()
], ResizeableDirective.prototype, "resize", void 0);
__decorate([
    HostListener('mousedown', ['$event'])
], ResizeableDirective.prototype, "onMousedown", null);
ResizeableDirective = __decorate([
    Directive({
        selector: '[resizeable]',
        host: {
            '[class.resizeable]': 'resizeEnabled'
        }
    })
], ResizeableDirective);
export { ResizeableDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL3Jlc2l6ZWFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFnQixTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBUTNDLElBQWEsbUJBQW1CLEdBQWhDLE1BQWEsbUJBQW1CO0lBWTlCLFlBQVksT0FBbUIsRUFBVSxRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBWG5ELGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBSTdCLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUl6RCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBSXhCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsZUFBZTtRQUNiLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDeEQ7YUFBTTtZQUNMLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsU0FB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QUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7U0FDL0I7SUFDSCxDQUFDO0NBQ0YsQ0FBQTs7WUF4RXNCLFVBQVU7WUFBb0IsU0FBUzs7QUFYbkQ7SUFBUixLQUFLLEVBQUU7MERBQStCO0FBQzlCO0lBQVIsS0FBSyxFQUFFO3FEQUFrQjtBQUNqQjtJQUFSLEtBQUssRUFBRTtxREFBa0I7QUFFaEI7SUFBVCxNQUFNLEVBQUU7bURBQWdEO0FBeUN6RDtJQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztzREFtQnJDO0FBaEVVLG1CQUFtQjtJQU4vQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYztRQUN4QixJQUFJLEVBQUU7WUFDSixvQkFBb0IsRUFBRSxlQUFlO1NBQ3RDO0tBQ0YsQ0FBQztHQUNXLG1CQUFtQixDQW9GL0I7U0FwRlksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25EZXN0cm95LFxuICBBZnRlclZpZXdJbml0LFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcmVzaXplYWJsZV0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5yZXNpemVhYmxlXSc6ICdyZXNpemVFbmFibGVkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6ZWFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSByZXNpemVFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbWluV2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgbWF4V2lkdGg6IG51bWJlcjtcblxuICBAT3V0cHV0KCkgcmVzaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHJlc2l6aW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgcmVzaXplSGFuZGxlOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgcmVuZGVyZXIyID0gdGhpcy5yZW5kZXJlcjtcbiAgICB0aGlzLnJlc2l6ZUhhbmRsZSA9IHJlbmRlcmVyMi5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgaWYgKHRoaXMucmVzaXplRW5hYmxlZCkge1xuICAgICAgcmVuZGVyZXIyLmFkZENsYXNzKHRoaXMucmVzaXplSGFuZGxlLCAncmVzaXplLWhhbmRsZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW5kZXJlcjIuYWRkQ2xhc3ModGhpcy5yZXNpemVIYW5kbGUsICdyZXNpemUtaGFuZGxlLS1ub3QtcmVzaXphYmxlJyk7XG4gICAgfVxuICAgIHJlbmRlcmVyMi5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQsIHRoaXMucmVzaXplSGFuZGxlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2Rlc3Ryb3lTdWJzY3JpcHRpb24oKTtcbiAgICBpZiAodGhpcy5yZW5kZXJlci5kZXN0cm95Tm9kZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5kZXN0cm95Tm9kZSh0aGlzLnJlc2l6ZUhhbmRsZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnJlc2l6ZUhhbmRsZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnJlbmRlcmVyLnBhcmVudE5vZGUodGhpcy5yZXNpemVIYW5kbGUpLCB0aGlzLnJlc2l6ZUhhbmRsZSk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZXVwKCk6IHZvaWQge1xuICAgIHRoaXMucmVzaXppbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbiAmJiAhdGhpcy5zdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICB0aGlzLl9kZXN0cm95U3Vic2NyaXB0aW9uKCk7XG4gICAgICB0aGlzLnJlc2l6ZS5lbWl0KHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBpc0hhbmRsZSA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ3Jlc2l6ZS1oYW5kbGUnKTtcbiAgICBjb25zdCBpbml0aWFsV2lkdGggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgY29uc3QgbW91c2VEb3duU2NyZWVuWCA9IGV2ZW50LnNjcmVlblg7XG5cbiAgICBpZiAoaXNIYW5kbGUpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5yZXNpemluZyA9IHRydWU7XG5cbiAgICAgIGNvbnN0IG1vdXNldXAgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJyk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG1vdXNldXAuc3Vic2NyaWJlKChldjogTW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNldXAoKSk7XG5cbiAgICAgIGNvbnN0IG1vdXNlTW92ZVN1YiA9IGZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbW92ZScpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbChtb3VzZXVwKSlcbiAgICAgICAgLnN1YnNjcmliZSgoZTogTW91c2VFdmVudCkgPT4gdGhpcy5tb3ZlKGUsIGluaXRpYWxXaWR0aCwgbW91c2VEb3duU2NyZWVuWCkpO1xuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQobW91c2VNb3ZlU3ViKTtcbiAgICB9XG4gIH1cblxuICBtb3ZlKGV2ZW50OiBNb3VzZUV2ZW50LCBpbml0aWFsV2lkdGg6IG51bWJlciwgbW91c2VEb3duU2NyZWVuWDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgbW92ZW1lbnRYID0gZXZlbnQuc2NyZWVuWCAtIG1vdXNlRG93blNjcmVlblg7XG4gICAgY29uc3QgbmV3V2lkdGggPSBpbml0aWFsV2lkdGggKyBtb3ZlbWVudFg7XG5cbiAgICBjb25zdCBvdmVyTWluV2lkdGggPSAhdGhpcy5taW5XaWR0aCB8fCBuZXdXaWR0aCA+PSB0aGlzLm1pbldpZHRoO1xuICAgIGNvbnN0IHVuZGVyTWF4V2lkdGggPSAhdGhpcy5tYXhXaWR0aCB8fCBuZXdXaWR0aCA8PSB0aGlzLm1heFdpZHRoO1xuXG4gICAgaWYgKG92ZXJNaW5XaWR0aCAmJiB1bmRlck1heFdpZHRoKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHtuZXdXaWR0aH1weGA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZGVzdHJveVN1YnNjcmlwdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==