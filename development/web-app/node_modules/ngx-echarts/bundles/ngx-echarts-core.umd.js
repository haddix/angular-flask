(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('echarts/lib/echarts')) :
    typeof define === 'function' && define.amd ? define('ngx-echarts/core', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', 'echarts/lib/echarts'], factory) :
    (global = global || self, factory((global['ngx-echarts'] = global['ngx-echarts'] || {}, global['ngx-echarts'].core = {}), global.ng.core, global.rxjs, global.rxjs.operators, global['echarts/lib/echarts']));
}(this, function (exports, core, rxjs, operators, echarts) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var ChangeFilter = /** @class */ (function () {
        function ChangeFilter(_changes) {
            this._changes = _changes;
        }
        /**
         * @param {?} changes
         * @return {?}
         */
        ChangeFilter.of = /**
         * @param {?} changes
         * @return {?}
         */
        function (changes) {
            return new ChangeFilter(changes);
        };
        /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        ChangeFilter.prototype.notEmpty = /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        function (key) {
            if (this._changes[key]) {
                /** @type {?} */
                var value = this._changes[key].currentValue;
                if (value !== undefined && value !== null) {
                    return rxjs.of(value);
                }
            }
            return rxjs.EMPTY;
        };
        /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        ChangeFilter.prototype.has = /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        function (key) {
            if (this._changes[key]) {
                /** @type {?} */
                var value = this._changes[key].currentValue;
                return rxjs.of(value);
            }
            return rxjs.EMPTY;
        };
        /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        ChangeFilter.prototype.notFirst = /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        function (key) {
            if (this._changes[key] && !this._changes[key].isFirstChange()) {
                /** @type {?} */
                var value = this._changes[key].currentValue;
                return rxjs.of(value);
            }
            return rxjs.EMPTY;
        };
        /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        ChangeFilter.prototype.notFirstAndEmpty = /**
         * @template T
         * @param {?} key
         * @return {?}
         */
        function (key) {
            if (this._changes[key] && !this._changes[key].isFirstChange()) {
                /** @type {?} */
                var value = this._changes[key].currentValue;
                if (value !== undefined && value !== null) {
                    return rxjs.of(value);
                }
            }
            return rxjs.EMPTY;
        };
        return ChangeFilter;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        ChangeFilter.prototype._changes;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxEchartsCoreDirective = /** @class */ (function () {
        function NgxEchartsCoreDirective(el, ngZone) {
            this.el = el;
            this.ngZone = ngZone;
            this.autoResize = true;
            this.loadingType = 'default';
            this.detectEventChanges = true; // deprecated, left for compatibility reasons to avoid triggering major version
            // deprecated, left for compatibility reasons to avoid triggering major version
            // ngx-echarts events
            this.chartInit = new core.EventEmitter();
            // echarts mouse events
            this.chartClick = this.createLazyEvent('click');
            this.chartDblClick = this.createLazyEvent('dblclick');
            this.chartMouseDown = this.createLazyEvent('mousedown');
            this.chartMouseMove = this.createLazyEvent('mousemove');
            this.chartMouseUp = this.createLazyEvent('mouseup');
            this.chartMouseOver = this.createLazyEvent('mouseover');
            this.chartMouseOut = this.createLazyEvent('mouseout');
            this.chartGlobalOut = this.createLazyEvent('globalout');
            this.chartContextMenu = this.createLazyEvent('contextmenu');
            // echarts mouse events
            this.chartLegendSelectChanged = this.createLazyEvent('legendselectchanged');
            this.chartLegendSelected = this.createLazyEvent('legendselected');
            this.chartLegendUnselected = this.createLazyEvent('legendunselected');
            this.chartLegendScroll = this.createLazyEvent('legendscroll');
            this.chartDataZoom = this.createLazyEvent('datazoom');
            this.chartDataRangeSelected = this.createLazyEvent('datarangeselected');
            this.chartTimelineChanged = this.createLazyEvent('timelinechanged');
            this.chartTimelinePlayChanged = this.createLazyEvent('timelineplaychanged');
            this.chartRestore = this.createLazyEvent('restore');
            this.chartDataViewChanged = this.createLazyEvent('dataviewchanged');
            this.chartMagicTypeChanged = this.createLazyEvent('magictypechanged');
            this.chartPieSelectChanged = this.createLazyEvent('pieselectchanged');
            this.chartPieSelected = this.createLazyEvent('pieselected');
            this.chartPieUnselected = this.createLazyEvent('pieunselected');
            this.chartMapSelectChanged = this.createLazyEvent('mapselectchanged');
            this.chartMapSelected = this.createLazyEvent('mapselected');
            this.chartMapUnselected = this.createLazyEvent('mapunselected');
            this.chartAxisAreaSelected = this.createLazyEvent('axisareaselected');
            this.chartFocusNodeAdjacency = this.createLazyEvent('focusnodeadjacency');
            this.chartUnfocusNodeAdjacency = this.createLazyEvent('unfocusnodeadjacency');
            this.chartBrush = this.createLazyEvent('brush');
            this.chartBrushSelected = this.createLazyEvent('brushselected');
            this.chartRendered = this.createLazyEvent('rendered');
            this.chartFinished = this.createLazyEvent('finished');
            this.currentOffsetWidth = 0;
            this.currentOffsetHeight = 0;
        }
        /**
         * @param {?} changes
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
        function (changes) {
            var _this = this;
            /** @type {?} */
            var filter = ChangeFilter.of(changes);
            filter.notFirstAndEmpty('options').subscribe((/**
             * @param {?} opt
             * @return {?}
             */
            function (opt) { return _this.onOptionsChange(opt); }));
            filter.notFirstAndEmpty('merge').subscribe((/**
             * @param {?} opt
             * @return {?}
             */
            function (opt) { return _this.setOption(opt); }));
            filter.has('loading').subscribe((/**
             * @param {?} v
             * @return {?}
             */
            function (v) { return _this.toggleLoading(!!v); }));
            filter.notFirst('theme').subscribe((/**
             * @return {?}
             */
            function () { return _this.refreshChart(); }));
        };
        /**
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this.resizeSub = rxjs.fromEvent(window, 'resize').pipe(operators.debounceTime(50)).subscribe((/**
             * @return {?}
             */
            function () {
                if (_this.autoResize && window.innerWidth !== _this.currentWindowWidth) {
                    _this.currentWindowWidth = window.innerWidth;
                    _this.currentOffsetWidth = _this.el.nativeElement.offsetWidth;
                    _this.currentOffsetHeight = _this.el.nativeElement.offsetHeight;
                    _this.resize();
                }
            }));
        };
        /**
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            if (this.resizeSub) {
                this.resizeSub.unsubscribe();
            }
            this.dispose();
        };
        /**
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.ngDoCheck = /**
         * @return {?}
         */
        function () {
            // No heavy work in DoCheck!
            if (this.chart && this.autoResize) {
                /** @type {?} */
                var offsetWidth = this.el.nativeElement.offsetWidth;
                /** @type {?} */
                var offsetHeight = this.el.nativeElement.offsetHeight;
                if (this.currentOffsetWidth !== offsetWidth || this.currentOffsetHeight !== offsetHeight) {
                    this.currentOffsetWidth = offsetWidth;
                    this.currentOffsetHeight = offsetHeight;
                    this.resize();
                }
            }
        };
        /**
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.ngAfterViewInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            setTimeout((/**
             * @return {?}
             */
            function () { return _this.initChart(); }));
        };
        /**
         * @private
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.dispose = /**
         * @private
         * @return {?}
         */
        function () {
            if (this.chart) {
                this.chart.dispose();
                this.chart = null;
            }
        };
        /**
         * @private
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.resize = /**
         * @private
         * @return {?}
         */
        function () {
            if (this.chart) {
                this.chart.resize();
            }
        };
        /**
         * @private
         * @param {?} loading
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.toggleLoading = /**
         * @private
         * @param {?} loading
         * @return {?}
         */
        function (loading) {
            if (this.chart) {
                loading ? this.chart.showLoading(this.loadingType, this.loadingOpts) : this.chart.hideLoading();
            }
        };
        /**
         * @private
         * @param {?} option
         * @param {?=} opts
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.setOption = /**
         * @private
         * @param {?} option
         * @param {?=} opts
         * @return {?}
         */
        function (option, opts) {
            if (this.chart) {
                this.chart.setOption(option, opts);
            }
        };
        /**
         * @private
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.refreshChart = /**
         * @private
         * @return {?}
         */
        function () {
            this.dispose();
            this.initChart();
        };
        /**
         * @private
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.createChart = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            this.currentWindowWidth = window.innerWidth;
            this.currentOffsetWidth = this.el.nativeElement.offsetWidth;
            this.currentOffsetHeight = this.el.nativeElement.offsetHeight;
            /** @type {?} */
            var dom = this.el.nativeElement;
            if (window && window.getComputedStyle) {
                /** @type {?} */
                var prop = window.getComputedStyle(dom, null).getPropertyValue('height');
                if ((!prop || prop === '0px') &&
                    (!dom.style.height || dom.style.height === '0px')) {
                    dom.style.height = '400px';
                }
            }
            return this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () { return echarts.init(dom, _this.theme, _this.initOpts); }));
        };
        /**
         * @private
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.initChart = /**
         * @private
         * @return {?}
         */
        function () {
            this.onOptionsChange(this.options);
            if (this.merge && this.chart) {
                this.setOption(this.merge);
            }
        };
        /**
         * @private
         * @param {?} opt
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.onOptionsChange = /**
         * @private
         * @param {?} opt
         * @return {?}
         */
        function (opt) {
            if (opt) {
                if (!this.chart) {
                    this.chart = this.createChart();
                    this.chartInit.emit(this.chart);
                }
                this.chart.setOption(this.options, true);
            }
        };
        // allows to lazily bind to only those events that are requested through the `@Output` by parent components
        // see https://stackoverflow.com/questions/51787972/optimal-reentering-the-ngzone-from-eventemitter-event for more info
        // allows to lazily bind to only those events that are requested through the `@Output` by parent components
        // see https://stackoverflow.com/questions/51787972/optimal-reentering-the-ngzone-from-eventemitter-event for more info
        /**
         * @private
         * @template T
         * @param {?} eventName
         * @return {?}
         */
        NgxEchartsCoreDirective.prototype.createLazyEvent = 
        // allows to lazily bind to only those events that are requested through the `@Output` by parent components
        // see https://stackoverflow.com/questions/51787972/optimal-reentering-the-ngzone-from-eventemitter-event for more info
        /**
         * @private
         * @template T
         * @param {?} eventName
         * @return {?}
         */
        function (eventName) {
            var _this = this;
            return (/** @type {?} */ (this.chartInit.pipe(operators.switchMap((/**
             * @param {?} chart
             * @return {?}
             */
            function (chart) { return new rxjs.Observable((/**
             * @param {?} observer
             * @return {?}
             */
            function (observer) {
                chart.on(eventName, (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.ngZone.run((/**
                 * @return {?}
                 */
                function () { return observer.next(data); })); }));
                return (/**
                 * @return {?}
                 */
                function () { return chart.off(eventName); });
            })); })))));
        };
        NgxEchartsCoreDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: 'echarts, [echarts]',
                    },] }
        ];
        /** @nocollapse */
        NgxEchartsCoreDirective.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.NgZone }
        ]; };
        NgxEchartsCoreDirective.propDecorators = {
            options: [{ type: core.Input }],
            theme: [{ type: core.Input }],
            loading: [{ type: core.Input }],
            initOpts: [{ type: core.Input }],
            merge: [{ type: core.Input }],
            autoResize: [{ type: core.Input }],
            loadingType: [{ type: core.Input }],
            loadingOpts: [{ type: core.Input }],
            detectEventChanges: [{ type: core.Input }],
            chartInit: [{ type: core.Output }],
            chartClick: [{ type: core.Output }],
            chartDblClick: [{ type: core.Output }],
            chartMouseDown: [{ type: core.Output }],
            chartMouseMove: [{ type: core.Output }],
            chartMouseUp: [{ type: core.Output }],
            chartMouseOver: [{ type: core.Output }],
            chartMouseOut: [{ type: core.Output }],
            chartGlobalOut: [{ type: core.Output }],
            chartContextMenu: [{ type: core.Output }],
            chartLegendSelectChanged: [{ type: core.Output }],
            chartLegendSelected: [{ type: core.Output }],
            chartLegendUnselected: [{ type: core.Output }],
            chartLegendScroll: [{ type: core.Output }],
            chartDataZoom: [{ type: core.Output }],
            chartDataRangeSelected: [{ type: core.Output }],
            chartTimelineChanged: [{ type: core.Output }],
            chartTimelinePlayChanged: [{ type: core.Output }],
            chartRestore: [{ type: core.Output }],
            chartDataViewChanged: [{ type: core.Output }],
            chartMagicTypeChanged: [{ type: core.Output }],
            chartPieSelectChanged: [{ type: core.Output }],
            chartPieSelected: [{ type: core.Output }],
            chartPieUnselected: [{ type: core.Output }],
            chartMapSelectChanged: [{ type: core.Output }],
            chartMapSelected: [{ type: core.Output }],
            chartMapUnselected: [{ type: core.Output }],
            chartAxisAreaSelected: [{ type: core.Output }],
            chartFocusNodeAdjacency: [{ type: core.Output }],
            chartUnfocusNodeAdjacency: [{ type: core.Output }],
            chartBrush: [{ type: core.Output }],
            chartBrushSelected: [{ type: core.Output }],
            chartRendered: [{ type: core.Output }],
            chartFinished: [{ type: core.Output }]
        };
        return NgxEchartsCoreDirective;
    }());
    if (false) {
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.options;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.theme;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.loading;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.initOpts;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.merge;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.autoResize;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.loadingType;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.loadingOpts;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.detectEventChanges;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartInit;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartClick;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartDblClick;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMouseDown;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMouseMove;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMouseUp;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMouseOver;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMouseOut;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartGlobalOut;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartContextMenu;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartLegendSelectChanged;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartLegendSelected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartLegendUnselected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartLegendScroll;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartDataZoom;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartDataRangeSelected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartTimelineChanged;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartTimelinePlayChanged;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartRestore;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartDataViewChanged;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMagicTypeChanged;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartPieSelectChanged;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartPieSelected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartPieUnselected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMapSelectChanged;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMapSelected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartMapUnselected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartAxisAreaSelected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartFocusNodeAdjacency;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartUnfocusNodeAdjacency;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartBrush;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartBrushSelected;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartRendered;
        /** @type {?} */
        NgxEchartsCoreDirective.prototype.chartFinished;
        /**
         * @type {?}
         * @private
         */
        NgxEchartsCoreDirective.prototype.chart;
        /**
         * @type {?}
         * @private
         */
        NgxEchartsCoreDirective.prototype.currentOffsetWidth;
        /**
         * @type {?}
         * @private
         */
        NgxEchartsCoreDirective.prototype.currentOffsetHeight;
        /**
         * @type {?}
         * @private
         */
        NgxEchartsCoreDirective.prototype.currentWindowWidth;
        /**
         * @type {?}
         * @private
         */
        NgxEchartsCoreDirective.prototype.resizeSub;
        /**
         * @type {?}
         * @private
         */
        NgxEchartsCoreDirective.prototype.el;
        /**
         * @type {?}
         * @private
         */
        NgxEchartsCoreDirective.prototype.ngZone;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxEchartsCoreModule = /** @class */ (function () {
        function NgxEchartsCoreModule() {
        }
        NgxEchartsCoreModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [],
                        declarations: [
                            NgxEchartsCoreDirective
                        ],
                        exports: [
                            NgxEchartsCoreDirective
                        ]
                    },] }
        ];
        return NgxEchartsCoreModule;
    }());

    exports.NgxEchartsCoreModule = NgxEchartsCoreModule;
    exports.ɵa = NgxEchartsCoreDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-echarts-core.umd.js.map
