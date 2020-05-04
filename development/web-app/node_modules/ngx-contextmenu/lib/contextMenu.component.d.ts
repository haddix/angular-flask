import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, QueryList } from '@angular/core';
import { ContextMenuItemDirective } from './contextMenu.item.directive';
import { IContextMenuOptions } from './contextMenu.options';
import { ContextMenuService, IContextMenuClickEvent, CloseContextMenuEvent } from './contextMenu.service';
export interface ILinkConfig {
    click: (item: any, $event?: MouseEvent) => void;
    enabled?: (item: any) => boolean;
    html: (item: any) => string;
}
export interface MouseLocation {
    left?: string;
    marginLeft?: string;
    marginTop?: string;
    top?: string;
}
export declare class ContextMenuComponent implements OnDestroy {
    private _contextMenuService;
    private changeDetector;
    private elementRef;
    private options;
    menuClass: string;
    autoFocus: boolean;
    useBootstrap4: boolean;
    disabled: boolean;
    close: EventEmitter<CloseContextMenuEvent>;
    open: EventEmitter<IContextMenuClickEvent>;
    menuItems: QueryList<ContextMenuItemDirective>;
    menuElement: ElementRef;
    visibleMenuItems: ContextMenuItemDirective[];
    links: ILinkConfig[];
    item: any;
    event: MouseEvent | KeyboardEvent;
    private subscription;
    constructor(_contextMenuService: ContextMenuService, changeDetector: ChangeDetectorRef, elementRef: ElementRef, options: IContextMenuOptions);
    ngOnDestroy(): void;
    onMenuEvent(menuEvent: IContextMenuClickEvent): void;
    isMenuItemVisible(menuItem: ContextMenuItemDirective): boolean;
    setVisibleMenuItems(): void;
    evaluateIfFunction(value: any): any;
}
