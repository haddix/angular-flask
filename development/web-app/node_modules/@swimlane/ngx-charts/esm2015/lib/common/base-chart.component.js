import { __decorate } from "tslib";
import { ElementRef, NgZone, ChangeDetectorRef, Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VisibilityObserver } from '../utils/visibility-observer';
let BaseChartComponent = class BaseChartComponent {
    constructor(chartElement, zone, cd) {
        this.chartElement = chartElement;
        this.zone = zone;
        this.cd = cd;
        this.scheme = 'cool';
        this.schemeType = 'ordinal';
        this.animations = true;
        this.select = new EventEmitter();
    }
    ngAfterViewInit() {
        this.bindWindowResizeEvent();
        // listen for visibility of the element for hidden by default scenario
        this.visibilityObserver = new VisibilityObserver(this.chartElement, this.zone);
        this.visibilityObserver.visible.subscribe(this.update.bind(this));
    }
    ngOnDestroy() {
        this.unbindEvents();
        if (this.visibilityObserver) {
            this.visibilityObserver.visible.unsubscribe();
            this.visibilityObserver.destroy();
        }
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        if (this.results) {
            this.results = this.cloneData(this.results);
        }
        else {
            this.results = [];
        }
        if (this.view) {
            this.width = this.view[0];
            this.height = this.view[1];
        }
        else {
            const dims = this.getContainerDims();
            if (dims) {
                this.width = dims.width;
                this.height = dims.height;
            }
        }
        // default values if width or height are 0 or undefined
        if (!this.width) {
            this.width = 600;
        }
        if (!this.height) {
            this.height = 400;
        }
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        if (this.cd) {
            this.cd.markForCheck();
        }
    }
    getContainerDims() {
        let width;
        let height;
        const hostElem = this.chartElement.nativeElement;
        if (hostElem.parentNode !== null) {
            // Get the container dimensions
            const dims = hostElem.parentNode.getBoundingClientRect();
            width = dims.width;
            height = dims.height;
        }
        if (width && height) {
            return { width, height };
        }
        return null;
    }
    /**
     * Converts all date objects that appear as name
     * into formatted date strings
     */
    formatDates() {
        for (let i = 0; i < this.results.length; i++) {
            const g = this.results[i];
            g.label = g.name;
            if (g.label instanceof Date) {
                g.label = g.label.toLocaleDateString();
            }
            if (g.series) {
                for (let j = 0; j < g.series.length; j++) {
                    const d = g.series[j];
                    d.label = d.name;
                    if (d.label instanceof Date) {
                        d.label = d.label.toLocaleDateString();
                    }
                }
            }
        }
    }
    unbindEvents() {
        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }
    bindWindowResizeEvent() {
        const source = observableFromEvent(window, 'resize');
        const subscription = source.pipe(debounceTime(200)).subscribe(e => {
            this.update();
            if (this.cd) {
                this.cd.markForCheck();
            }
        });
        this.resizeSubscription = subscription;
    }
    /**
     * Clones the data into a new object
     *
     * @memberOf BaseChart
     */
    cloneData(data) {
        const results = [];
        for (const item of data) {
            const copy = {
                name: item['name']
            };
            if (item['value'] !== undefined) {
                copy['value'] = item['value'];
            }
            if (item['series'] !== undefined) {
                copy['series'] = [];
                for (const seriesItem of item['series']) {
                    const seriesItemCopy = Object.assign({}, seriesItem);
                    copy['series'].push(seriesItemCopy);
                }
            }
            if (item['extra'] !== undefined) {
                copy['extra'] = JSON.parse(JSON.stringify(item['extra']));
            }
            results.push(copy);
        }
        return results;
    }
};
BaseChartComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], BaseChartComponent.prototype, "results", void 0);
__decorate([
    Input()
], BaseChartComponent.prototype, "view", void 0);
__decorate([
    Input()
], BaseChartComponent.prototype, "scheme", void 0);
__decorate([
    Input()
], BaseChartComponent.prototype, "schemeType", void 0);
__decorate([
    Input()
], BaseChartComponent.prototype, "customColors", void 0);
__decorate([
    Input()
], BaseChartComponent.prototype, "animations", void 0);
__decorate([
    Output()
], BaseChartComponent.prototype, "select", void 0);
BaseChartComponent = __decorate([
    Component({
        selector: 'base-chart',
        template: ` <div></div> `
    })
], BaseChartComponent);
export { BaseChartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osYUFBYSxFQUNiLFNBQVMsRUFDVCxTQUFTLEVBQ1QsYUFBYSxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBTWxFLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBZTdCLFlBQXNCLFlBQXdCLEVBQVksSUFBWSxFQUFZLEVBQXFCO1FBQWpGLGlCQUFZLEdBQVosWUFBWSxDQUFZO1FBQVksU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFZLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBWjlGLFdBQU0sR0FBUSxNQUFNLENBQUM7UUFDckIsZUFBVSxHQUFXLFNBQVMsQ0FBQztRQUUvQixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBT29FLENBQUM7SUFFM0csZUFBZTtRQUNiLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRTdCLHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FB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QUFFO21EQUFjO0FBQ2I7SUFBUixLQUFLLEVBQUU7Z0RBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFO2tEQUFzQjtBQUNyQjtJQUFSLEtBQUssRUFBRTtzREFBZ0M7QUFDL0I7SUFBUixLQUFLLEVBQUU7d0RBQW1CO0FBQ2xCO0lBQVIsS0FBSyxFQUFFO3NEQUE0QjtBQUUxQjtJQUFULE1BQU0sRUFBRTtrREFBNkI7QUFSM0Isa0JBQWtCO0lBSjlCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFFBQVEsRUFBRSxlQUFlO0tBQzFCLENBQUM7R0FDVyxrQkFBa0IsQ0FzSzlCO1NBdEtZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkRlc3Ryb3ksXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgZnJvbUV2ZW50IGFzIG9ic2VydmFibGVGcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFZpc2liaWxpdHlPYnNlcnZlciB9IGZyb20gJy4uL3V0aWxzL3Zpc2liaWxpdHktb2JzZXJ2ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdiYXNlLWNoYXJ0JyxcbiAgdGVtcGxhdGU6IGAgPGRpdj48L2Rpdj4gYFxufSlcbmV4cG9ydCBjbGFzcyBCYXNlQ2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIHJlc3VsdHM6IGFueTtcbiAgQElucHV0KCkgdmlldzogW251bWJlciwgbnVtYmVyXTtcbiAgQElucHV0KCkgc2NoZW1lOiBhbnkgPSAnY29vbCc7XG4gIEBJbnB1dCgpIHNjaGVtZVR5cGU6IHN0cmluZyA9ICdvcmRpbmFsJztcbiAgQElucHV0KCkgY3VzdG9tQ29sb3JzOiBhbnk7XG4gIEBJbnB1dCgpIGFuaW1hdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHJlc2l6ZVN1YnNjcmlwdGlvbjogYW55O1xuICB2aXNpYmlsaXR5T2JzZXJ2ZXI6IFZpc2liaWxpdHlPYnNlcnZlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY2hhcnRFbGVtZW50OiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgem9uZTogTmdab25lLCBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmJpbmRXaW5kb3dSZXNpemVFdmVudCgpO1xuXG4gICAgLy8gbGlzdGVuIGZvciB2aXNpYmlsaXR5IG9mIHRoZSBlbGVtZW50IGZvciBoaWRkZW4gYnkgZGVmYXVsdCBzY2VuYXJpb1xuICAgIHRoaXMudmlzaWJpbGl0eU9ic2VydmVyID0gbmV3IFZpc2liaWxpdHlPYnNlcnZlcih0aGlzLmNoYXJ0RWxlbWVudCwgdGhpcy56b25lKTtcbiAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci52aXNpYmxlLnN1YnNjcmliZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eU9ic2VydmVyKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci52aXNpYmxlLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVzdWx0cykge1xuICAgICAgdGhpcy5yZXN1bHRzID0gdGhpcy5jbG9uZURhdGEodGhpcy5yZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXN1bHRzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmlldykge1xuICAgICAgdGhpcy53aWR0aCA9IHRoaXMudmlld1swXTtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy52aWV3WzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkaW1zID0gdGhpcy5nZXRDb250YWluZXJEaW1zKCk7XG4gICAgICBpZiAoZGltcykge1xuICAgICAgICB0aGlzLndpZHRoID0gZGltcy53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkaW1zLmhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWZhdWx0IHZhbHVlcyBpZiB3aWR0aCBvciBoZWlnaHQgYXJlIDAgb3IgdW5kZWZpbmVkXG4gICAgaWYgKCF0aGlzLndpZHRoKSB7XG4gICAgICB0aGlzLndpZHRoID0gNjAwO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oZWlnaHQpIHtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gNDAwO1xuICAgIH1cblxuICAgIHRoaXMud2lkdGggPSBNYXRoLmZsb29yKHRoaXMud2lkdGgpO1xuICAgIHRoaXMuaGVpZ2h0ID0gTWF0aC5mbG9vcih0aGlzLmhlaWdodCk7XG5cbiAgICBpZiAodGhpcy5jZCkge1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb250YWluZXJEaW1zKCk6IGFueSB7XG4gICAgbGV0IHdpZHRoO1xuICAgIGxldCBoZWlnaHQ7XG4gICAgY29uc3QgaG9zdEVsZW0gPSB0aGlzLmNoYXJ0RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKGhvc3RFbGVtLnBhcmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgIC8vIEdldCB0aGUgY29udGFpbmVyIGRpbWVuc2lvbnNcbiAgICAgIGNvbnN0IGRpbXMgPSBob3N0RWxlbS5wYXJlbnROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgd2lkdGggPSBkaW1zLndpZHRoO1xuICAgICAgaGVpZ2h0ID0gZGltcy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKHdpZHRoICYmIGhlaWdodCkge1xuICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFsbCBkYXRlIG9iamVjdHMgdGhhdCBhcHBlYXIgYXMgbmFtZVxuICAgKiBpbnRvIGZvcm1hdHRlZCBkYXRlIHN0cmluZ3NcbiAgICovXG4gIGZvcm1hdERhdGVzKCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBnID0gdGhpcy5yZXN1bHRzW2ldO1xuICAgICAgZy5sYWJlbCA9IGcubmFtZTtcbiAgICAgIGlmIChnLmxhYmVsIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBnLmxhYmVsID0gZy5sYWJlbC50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGcuc2VyaWVzKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZy5zZXJpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBkID0gZy5zZXJpZXNbal07XG4gICAgICAgICAgZC5sYWJlbCA9IGQubmFtZTtcbiAgICAgICAgICBpZiAoZC5sYWJlbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIGQubGFiZWwgPSBkLmxhYmVsLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1bmJpbmRFdmVudHMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVzaXplU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYmluZFdpbmRvd1Jlc2l6ZUV2ZW50KCk6IHZvaWQge1xuICAgIGNvbnN0IHNvdXJjZSA9IG9ic2VydmFibGVGcm9tRXZlbnQod2luZG93LCAncmVzaXplJyk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnBpcGUoZGVib3VuY2VUaW1lKDIwMCkpLnN1YnNjcmliZShlID0+IHtcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICBpZiAodGhpcy5jZCkge1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb25lcyB0aGUgZGF0YSBpbnRvIGEgbmV3IG9iamVjdFxuICAgKlxuICAgKiBAbWVtYmVyT2YgQmFzZUNoYXJ0XG4gICAqL1xuICBwcml2YXRlIGNsb25lRGF0YShkYXRhKTogYW55IHtcbiAgICBjb25zdCByZXN1bHRzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YSkge1xuICAgICAgY29uc3QgY29weSA9IHtcbiAgICAgICAgbmFtZTogaXRlbVsnbmFtZSddXG4gICAgICB9O1xuXG4gICAgICBpZiAoaXRlbVsndmFsdWUnXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvcHlbJ3ZhbHVlJ10gPSBpdGVtWyd2YWx1ZSddO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsnc2VyaWVzJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb3B5WydzZXJpZXMnXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlcmllc0l0ZW0gb2YgaXRlbVsnc2VyaWVzJ10pIHtcbiAgICAgICAgICBjb25zdCBzZXJpZXNJdGVtQ29weSA9IE9iamVjdC5hc3NpZ24oe30sIHNlcmllc0l0ZW0pO1xuICAgICAgICAgIGNvcHlbJ3NlcmllcyddLnB1c2goc2VyaWVzSXRlbUNvcHkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWydleHRyYSddICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29weVsnZXh0cmEnXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaXRlbVsnZXh0cmEnXSkpO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRzLnB1c2goY29weSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbn1cbiJdfQ==