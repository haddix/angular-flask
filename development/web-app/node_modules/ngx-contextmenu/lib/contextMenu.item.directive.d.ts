import { Highlightable } from '@angular/cdk/a11y';
import { ElementRef, EventEmitter, TemplateRef } from '@angular/core';
export declare class ContextMenuItemDirective implements Highlightable {
    template: TemplateRef<{
        item: any;
    }>;
    elementRef: ElementRef;
    subMenu: any;
    divider: boolean;
    enabled: boolean | ((item: any) => boolean);
    passive: boolean;
    visible: boolean | ((item: any) => boolean);
    execute: EventEmitter<{
        event: Event;
        item: any;
    }>;
    currentItem: any;
    isActive: boolean;
    readonly disabled: boolean;
    constructor(template: TemplateRef<{
        item: any;
    }>, elementRef: ElementRef);
    evaluateIfFunction(value: any, item: any): any;
    setActiveStyles(): void;
    setInactiveStyles(): void;
    triggerExecute(item: any, $event?: MouseEvent | KeyboardEvent): void;
}
