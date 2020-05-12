import { __values } from "tslib";
import { columnsByPin, columnsTotalWidth } from './column';
/**
 * Calculates the Total Flex Grow
 */
export function getTotalFlexGrow(columns) {
    var e_1, _a;
    var totalFlexGrow = 0;
    try {
        for (var columns_1 = __values(columns), columns_1_1 = columns_1.next(); !columns_1_1.done; columns_1_1 = columns_1.next()) {
            var c = columns_1_1.value;
            totalFlexGrow += c.flexGrow || 0;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (columns_1_1 && !columns_1_1.done && (_a = columns_1.return)) _a.call(columns_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return totalFlexGrow;
}
/**
 * Adjusts the column widths.
 * Inspired by: https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableWidthHelper.js
 */
export function adjustColumnWidths(allColumns, expectedWidth) {
    var columnsWidth = columnsTotalWidth(allColumns);
    var totalFlexGrow = getTotalFlexGrow(allColumns);
    var colsByGroup = columnsByPin(allColumns);
    if (columnsWidth !== expectedWidth) {
        scaleColumns(colsByGroup, expectedWidth, totalFlexGrow);
    }
}
/**
 * Resizes columns based on the flexGrow property, while respecting manually set widths
 */
function scaleColumns(colsByGroup, maxWidth, totalFlexGrow) {
    var e_2, _a, e_3, _b;
    // calculate total width and flexgrow points for coulumns that can be resized
    for (var attr in colsByGroup) {
        try {
            for (var _c = (e_2 = void 0, __values(colsByGroup[attr])), _d = _c.next(); !_d.done; _d = _c.next()) {
                var column = _d.value;
                if (!column.canAutoResize) {
                    maxWidth -= column.width;
                    totalFlexGrow -= column.flexGrow ? column.flexGrow : 0;
                }
                else {
                    column.width = 0;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    var hasMinWidth = {};
    var remainingWidth = maxWidth;
    // resize columns until no width is left to be distributed
    do {
        var widthPerFlexPoint = remainingWidth / totalFlexGrow;
        remainingWidth = 0;
        for (var attr in colsByGroup) {
            try {
                for (var _e = (e_3 = void 0, __values(colsByGroup[attr])), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var column = _f.value;
                    // if the column can be resize and it hasn't reached its minimum width yet
                    if (column.canAutoResize && !hasMinWidth[column.prop]) {
                        var newWidth = column.width + column.flexGrow * widthPerFlexPoint;
                        if (column.minWidth !== undefined && newWidth < column.minWidth) {
                            remainingWidth += newWidth - column.minWidth;
                            column.width = column.minWidth;
                            hasMinWidth[column.prop] = true;
                        }
                        else {
                            column.width = newWidth;
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    } while (remainingWidth !== 0);
}
/**
 * Forces the width of the columns to
 * distribute equally but overflowing when necessary
 *
 * Rules:
 *
 *  - If combined withs are less than the total width of the grid,
 *    proportion the widths given the min / max / normal widths to fill the width.
 *
 *  - If the combined widths, exceed the total width of the grid,
 *    use the standard widths.
 *
 *  - If a column is resized, it should always use that width
 *
 *  - The proportional widths should never fall below min size if specified.
 *
 *  - If the grid starts off small but then becomes greater than the size ( + / - )
 *    the width should use the original width; not the newly proportioned widths.
 */
export function forceFillColumnWidths(allColumns, expectedWidth, startIdx, allowBleed, defaultColWidth) {
    var e_4, _a, e_5, _b;
    if (defaultColWidth === void 0) { defaultColWidth = 300; }
    var columnsToResize = allColumns.slice(startIdx + 1, allColumns.length).filter(function (c) {
        return c.canAutoResize !== false;
    });
    try {
        for (var columnsToResize_1 = __values(columnsToResize), columnsToResize_1_1 = columnsToResize_1.next(); !columnsToResize_1_1.done; columnsToResize_1_1 = columnsToResize_1.next()) {
            var column = columnsToResize_1_1.value;
            if (!column.$$oldWidth) {
                column.$$oldWidth = column.width;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (columnsToResize_1_1 && !columnsToResize_1_1.done && (_a = columnsToResize_1.return)) _a.call(columnsToResize_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    var additionWidthPerColumn = 0;
    var exceedsWindow = false;
    var contentWidth = getContentWidth(allColumns, defaultColWidth);
    var remainingWidth = expectedWidth - contentWidth;
    var columnsProcessed = [];
    var remainingWidthLimit = 1; // when to stop
    // This loop takes care of the
    do {
        additionWidthPerColumn = remainingWidth / columnsToResize.length;
        exceedsWindow = contentWidth >= expectedWidth;
        try {
            for (var columnsToResize_2 = (e_5 = void 0, __values(columnsToResize)), columnsToResize_2_1 = columnsToResize_2.next(); !columnsToResize_2_1.done; columnsToResize_2_1 = columnsToResize_2.next()) {
                var column = columnsToResize_2_1.value;
                if (exceedsWindow && allowBleed) {
                    column.width = column.$$oldWidth || column.width || defaultColWidth;
                }
                else {
                    var newSize = (column.width || defaultColWidth) + additionWidthPerColumn;
                    if (column.minWidth && newSize < column.minWidth) {
                        column.width = column.minWidth;
                        columnsProcessed.push(column);
                    }
                    else if (column.maxWidth && newSize > column.maxWidth) {
                        column.width = column.maxWidth;
                        columnsProcessed.push(column);
                    }
                    else {
                        column.width = newSize;
                    }
                }
                column.width = Math.max(0, column.width);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (columnsToResize_2_1 && !columnsToResize_2_1.done && (_b = columnsToResize_2.return)) _b.call(columnsToResize_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        contentWidth = getContentWidth(allColumns);
        remainingWidth = expectedWidth - contentWidth;
        removeProcessedColumns(columnsToResize, columnsProcessed);
    } while (remainingWidth > remainingWidthLimit && columnsToResize.length !== 0);
}
/**
 * Remove the processed columns from the current active columns.
 */
function removeProcessedColumns(columnsToResize, columnsProcessed) {
    var e_6, _a;
    try {
        for (var columnsProcessed_1 = __values(columnsProcessed), columnsProcessed_1_1 = columnsProcessed_1.next(); !columnsProcessed_1_1.done; columnsProcessed_1_1 = columnsProcessed_1.next()) {
            var column = columnsProcessed_1_1.value;
            var index = columnsToResize.indexOf(column);
            columnsToResize.splice(index, 1);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (columnsProcessed_1_1 && !columnsProcessed_1_1.done && (_a = columnsProcessed_1.return)) _a.call(columnsProcessed_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
}
/**
 * Gets the width of the columns
 */
function getContentWidth(allColumns, defaultColWidth) {
    var e_7, _a;
    if (defaultColWidth === void 0) { defaultColWidth = 300; }
    var contentWidth = 0;
    try {
        for (var allColumns_1 = __values(allColumns), allColumns_1_1 = allColumns_1.next(); !allColumns_1_1.done; allColumns_1_1 = allColumns_1.next()) {
            var column = allColumns_1_1.value;
            contentWidth += column.width || defaultColWidth;
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (allColumns_1_1 && !allColumns_1_1.done && (_a = allColumns_1.return)) _a.call(allColumns_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return contentWidth;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL21hdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFM0Q7O0dBRUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsT0FBYzs7SUFDN0MsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDOztRQUV0QixLQUFnQixJQUFBLFlBQUEsU0FBQSxPQUFPLENBQUEsZ0NBQUEscURBQUU7WUFBcEIsSUFBTSxDQUFDLG9CQUFBO1lBQ1YsYUFBYSxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDO1NBQ2xDOzs7Ozs7Ozs7SUFFRCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLFVBQWUsRUFBRSxhQUFrQjtJQUNwRSxJQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRCxJQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRCxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFN0MsSUFBSSxZQUFZLEtBQUssYUFBYSxFQUFFO1FBQ2xDLFlBQVksQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQ3pEO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxZQUFZLENBQUMsV0FBZ0IsRUFBRSxRQUFhLEVBQUUsYUFBa0I7O0lBQ3ZFLDZFQUE2RTtJQUM3RSxLQUFLLElBQU0sSUFBSSxJQUFJLFdBQVcsRUFBRTs7WUFDOUIsS0FBcUIsSUFBQSxvQkFBQSxTQUFBLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFBLGdCQUFBLDRCQUFFO2dCQUFu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QUFnQixDQUFDLENBQUM7S0FDM0QsUUFBUSxjQUFjLEdBQUcsbUJBQW1CLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDakYsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxzQkFBc0IsQ0FBQyxlQUFzQixFQUFFLGdCQUF1Qjs7O1FBQzdFLEtBQXFCLElBQUEscUJBQUEsU0FBQSxnQkFBZ0IsQ0FBQSxrREFBQSxnRkFBRTtZQUFsQyxJQUFNLE1BQU0sNkJBQUE7WUFDZixJQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2xDOzs7Ozs7Ozs7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxVQUFlLEVBQUUsZUFBNkI7O0lBQTdCLGdDQUFBLEVBQUEscUJBQTZCO0lBQ3JFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQzs7UUFFckIsS0FBcUIsSUFBQSxlQUFBLFNBQUEsVUFBVSxDQUFBLHNDQUFBLDhEQUFFO1lBQTVCLElBQU0sTUFBTSx1QkFBQTtZQUNmLFlBQVksSUFBSSxNQUFNLENBQUMsS0FBSyxJQUFJLGVBQWUsQ0FBQztTQUNqRDs7Ozs7Ozs7O0lBRUQsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbHVtbnNCeVBpbiwgY29sdW1uc1RvdGFsV2lkdGggfSBmcm9tICcuL2NvbHVtbic7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgVG90YWwgRmxleCBHcm93XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3RhbEZsZXhHcm93KGNvbHVtbnM6IGFueVtdKSB7XG4gIGxldCB0b3RhbEZsZXhHcm93ID0gMDtcblxuICBmb3IgKGNvbnN0IGMgb2YgY29sdW1ucykge1xuICAgIHRvdGFsRmxleEdyb3cgKz0gYy5mbGV4R3JvdyB8fCAwO1xuICB9XG5cbiAgcmV0dXJuIHRvdGFsRmxleEdyb3c7XG59XG5cbi8qKlxuICogQWRqdXN0cyB0aGUgY29sdW1uIHdpZHRocy5cbiAqIEluc3BpcmVkIGJ5OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZml4ZWQtZGF0YS10YWJsZS9ibG9iL21hc3Rlci9zcmMvRml4ZWREYXRhVGFibGVXaWR0aEhlbHBlci5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRqdXN0Q29sdW1uV2lkdGhzKGFsbENvbHVtbnM6IGFueSwgZXhwZWN0ZWRXaWR0aDogYW55KSB7XG4gIGNvbnN0IGNvbHVtbnNXaWR0aCA9IGNvbHVtbnNUb3RhbFdpZHRoKGFsbENvbHVtbnMpO1xuICBjb25zdCB0b3RhbEZsZXhHcm93ID0gZ2V0VG90YWxGbGV4R3JvdyhhbGxDb2x1bW5zKTtcbiAgY29uc3QgY29sc0J5R3JvdXAgPSBjb2x1bW5zQnlQaW4oYWxsQ29sdW1ucyk7XG5cbiAgaWYgKGNvbHVtbnNXaWR0aCAhPT0gZXhwZWN0ZWRXaWR0aCkge1xuICAgIHNjYWxlQ29sdW1ucyhjb2xzQnlHcm91cCwgZXhwZWN0ZWRXaWR0aCwgdG90YWxGbGV4R3Jvdyk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNpemVzIGNvbHVtbnMgYmFzZWQgb24gdGhlIGZsZXhHcm93IHByb3BlcnR5LCB3aGlsZSByZXNwZWN0aW5nIG1hbnVhbGx5IHNldCB3aWR0aHNcbiAqL1xuZnVuY3Rpb24gc2NhbGVDb2x1bW5zKGNvbHNCeUdyb3VwOiBhbnksIG1heFdpZHRoOiBhbnksIHRvdGFsRmxleEdyb3c6IGFueSkge1xuICAvLyBjYWxjdWxhdGUgdG90YWwgd2lkdGggYW5kIGZsZXhncm93IHBvaW50cyBmb3IgY291bHVtbnMgdGhhdCBjYW4gYmUgcmVzaXplZFxuICBmb3IgKGNvbnN0IGF0dHIgaW4gY29sc0J5R3JvdXApIHtcbiAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2xzQnlHcm91cFthdHRyXSkge1xuICAgICAgaWYgKCFjb2x1bW4uY2FuQXV0b1Jlc2l6ZSkge1xuICAgICAgICBtYXhXaWR0aCAtPSBjb2x1bW4ud2lkdGg7XG4gICAgICAgIHRvdGFsRmxleEdyb3cgLT0gY29sdW1uLmZsZXhHcm93ID8gY29sdW1uLmZsZXhHcm93IDogMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtbi53aWR0aCA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFzTWluV2lkdGggPSB7fTtcbiAgbGV0IHJlbWFpbmluZ1dpZHRoID0gbWF4V2lkdGg7XG5cbiAgLy8gcmVzaXplIGNvbHVtbnMgdW50aWwgbm8gd2lkdGggaXMgbGVmdCB0byBiZSBkaXN0cmlidXRlZFxuICBkbyB7XG4gICAgY29uc3Qgd2lkdGhQZXJGbGV4UG9pbnQgPSByZW1haW5pbmdXaWR0aCAvIHRvdGFsRmxleEdyb3c7XG4gICAgcmVtYWluaW5nV2lkdGggPSAwO1xuXG4gICAgZm9yIChjb25zdCBhdHRyIGluIGNvbHNCeUdyb3VwKSB7XG4gICAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2xzQnlHcm91cFthdHRyXSkge1xuICAgICAgICAvLyBpZiB0aGUgY29sdW1uIGNhbiBiZSByZXNpemUgYW5kIGl0IGhhc24ndCByZWFjaGVkIGl0cyBtaW5pbXVtIHdpZHRoIHlldFxuICAgICAgICBpZiAoY29sdW1uLmNhbkF1dG9SZXNpemUgJiYgIWhhc01pbldpZHRoW2NvbHVtbi5wcm9wXSkge1xuICAgICAgICAgIGNvbnN0IG5ld1dpZHRoID0gY29sdW1uLndpZHRoICsgY29sdW1uLmZsZXhHcm93ICogd2lkdGhQZXJGbGV4UG9pbnQ7XG4gICAgICAgICAgaWYgKGNvbHVtbi5taW5XaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5ld1dpZHRoIDwgY29sdW1uLm1pbldpZHRoKSB7XG4gICAgICAgICAgICByZW1haW5pbmdXaWR0aCArPSBuZXdXaWR0aCAtIGNvbHVtbi5taW5XaWR0aDtcbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IGNvbHVtbi5taW5XaWR0aDtcbiAgICAgICAgICAgIGhhc01pbldpZHRoW2NvbHVtbi5wcm9wXSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IG5ld1dpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAocmVtYWluaW5nV2lkdGggIT09IDApO1xufVxuXG4vKipcbiAqIEZvcmNlcyB0aGUgd2lkdGggb2YgdGhlIGNvbHVtbnMgdG9cbiAqIGRpc3RyaWJ1dGUgZXF1YWxseSBidXQgb3ZlcmZsb3dpbmcgd2hlbiBuZWNlc3NhcnlcbiAqXG4gKiBSdWxlczpcbiAqXG4gKiAgLSBJZiBjb21iaW5lZCB3aXRocyBhcmUgbGVzcyB0aGFuIHRoZSB0b3RhbCB3aWR0aCBvZiB0aGUgZ3JpZCxcbiAqICAgIHByb3BvcnRpb24gdGhlIHdpZHRocyBnaXZlbiB0aGUgbWluIC8gbWF4IC8gbm9ybWFsIHdpZHRocyB0byBmaWxsIHRoZSB3aWR0aC5cbiAqXG4gKiAgLSBJZiB0aGUgY29tYmluZWQgd2lkdGhzLCBleGNlZWQgdGhlIHRvdGFsIHdpZHRoIG9mIHRoZSBncmlkLFxuICogICAgdXNlIHRoZSBzdGFuZGFyZCB3aWR0aHMuXG4gKlxuICogIC0gSWYgYSBjb2x1bW4gaXMgcmVzaXplZCwgaXQgc2hvdWxkIGFsd2F5cyB1c2UgdGhhdCB3aWR0aFxuICpcbiAqICAtIFRoZSBwcm9wb3J0aW9uYWwgd2lkdGhzIHNob3VsZCBuZXZlciBmYWxsIGJlbG93IG1pbiBzaXplIGlmIHNwZWNpZmllZC5cbiAqXG4gKiAgLSBJZiB0aGUgZ3JpZCBzdGFydHMgb2ZmIHNtYWxsIGJ1dCB0aGVuIGJlY29tZXMgZ3JlYXRlciB0aGFuIHRoZSBzaXplICggKyAvIC0gKVxuICogICAgdGhlIHdpZHRoIHNob3VsZCB1c2UgdGhlIG9yaWdpbmFsIHdpZHRoOyBub3QgdGhlIG5ld2x5IHByb3BvcnRpb25lZCB3aWR0aHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUZpbGxDb2x1bW5XaWR0aHMoXG4gIGFsbENvbHVtbnM6IGFueVtdLFxuICBleHBlY3RlZFdpZHRoOiBudW1iZXIsXG4gIHN0YXJ0SWR4OiBudW1iZXIsXG4gIGFsbG93QmxlZWQ6IGJvb2xlYW4sXG4gIGRlZmF1bHRDb2xXaWR0aDogbnVtYmVyID0gMzAwXG4pIHtcbiAgY29uc3QgY29sdW1uc1RvUmVzaXplID0gYWxsQ29sdW1ucy5zbGljZShzdGFydElkeCArIDEsIGFsbENvbHVtbnMubGVuZ3RoKS5maWx0ZXIoYyA9PiB7XG4gICAgcmV0dXJuIGMuY2FuQXV0b1Jlc2l6ZSAhPT0gZmFsc2U7XG4gIH0pO1xuXG4gIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnNUb1Jlc2l6ZSkge1xuICAgIGlmICghY29sdW1uLiQkb2xkV2lkdGgpIHtcbiAgICAgIGNvbHVtbi4kJG9sZFdpZHRoID0gY29sdW1uLndpZHRoO1xuICAgIH1cbiAgfVxuXG4gIGxldCBhZGRpdGlvbldpZHRoUGVyQ29sdW1uID0gMDtcbiAgbGV0IGV4Y2VlZHNXaW5kb3cgPSBmYWxzZTtcbiAgbGV0IGNvbnRlbnRXaWR0aCA9IGdldENvbnRlbnRXaWR0aChhbGxDb2x1bW5zLCBkZWZhdWx0Q29sV2lkdGgpO1xuICBsZXQgcmVtYWluaW5nV2lkdGggPSBleHBlY3RlZFdpZHRoIC0gY29udGVudFdpZHRoO1xuICBjb25zdCBjb2x1bW5zUHJvY2Vzc2VkOiBhbnlbXSA9IFtdO1xuICBjb25zdCByZW1haW5pbmdXaWR0aExpbWl0ID0gMTsgLy8gd2hlbiB0byBzdG9wXG5cbiAgLy8gVGhpcyBsb29wIHRha2VzIGNhcmUgb2YgdGhlXG4gIGRvIHtcbiAgICBhZGRpdGlvbldpZHRoUGVyQ29sdW1uID0gcmVtYWluaW5nV2lkdGggLyBjb2x1bW5zVG9SZXNpemUubGVuZ3RoO1xuICAgIGV4Y2VlZHNXaW5kb3cgPSBjb250ZW50V2lkdGggPj0gZXhwZWN0ZWRXaWR0aDtcblxuICAgIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnNUb1Jlc2l6ZSkge1xuICAgICAgaWYgKGV4Y2VlZHNXaW5kb3cgJiYgYWxsb3dCbGVlZCkge1xuICAgICAgICBjb2x1bW4ud2lkdGggPSBjb2x1bW4uJCRvbGRXaWR0aCB8fCBjb2x1bW4ud2lkdGggfHwgZGVmYXVsdENvbFdpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbmV3U2l6ZSA9IChjb2x1bW4ud2lkdGggfHwgZGVmYXVsdENvbFdpZHRoKSArIGFkZGl0aW9uV2lkdGhQZXJDb2x1bW47XG5cbiAgICAgICAgaWYgKGNvbHVtbi5taW5XaWR0aCAmJiBuZXdTaXplIDwgY29sdW1uLm1pbldpZHRoKSB7XG4gICAgICAgICAgY29sdW1uLndpZHRoID0gY29sdW1uLm1pbldpZHRoO1xuICAgICAgICAgIGNvbHVtbnNQcm9jZXNzZWQucHVzaChjb2x1bW4pO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbHVtbi5tYXhXaWR0aCAmJiBuZXdTaXplID4gY29sdW1uLm1heFdpZHRoKSB7XG4gICAgICAgICAgY29sdW1uLndpZHRoID0gY29sdW1uLm1heFdpZHRoO1xuICAgICAgICAgIGNvbHVtbnNQcm9jZXNzZWQucHVzaChjb2x1bW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbHVtbi53aWR0aCA9IG5ld1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29sdW1uLndpZHRoID0gTWF0aC5tYXgoMCwgY29sdW1uLndpZHRoKTtcbiAgICB9XG5cbiAgICBjb250ZW50V2lkdGggPSBnZXRDb250ZW50V2lkdGgoYWxsQ29sdW1ucyk7XG4gICAgcmVtYWluaW5nV2lkdGggPSBleHBlY3RlZFdpZHRoIC0gY29udGVudFdpZHRoO1xuICAgIHJlbW92ZVByb2Nlc3NlZENvbHVtbnMoY29sdW1uc1RvUmVzaXplLCBjb2x1bW5zUHJvY2Vzc2VkKTtcbiAgfSB3aGlsZSAocmVtYWluaW5nV2lkdGggPiByZW1haW5pbmdXaWR0aExpbWl0ICYmIGNvbHVtbnNUb1Jlc2l6ZS5sZW5ndGggIT09IDApO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgcHJvY2Vzc2VkIGNvbHVtbnMgZnJvbSB0aGUgY3VycmVudCBhY3RpdmUgY29sdW1ucy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUHJvY2Vzc2VkQ29sdW1ucyhjb2x1bW5zVG9SZXNpemU6IGFueVtdLCBjb2x1bW5zUHJvY2Vzc2VkOiBhbnlbXSkge1xuICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2x1bW5zUHJvY2Vzc2VkKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb2x1bW5zVG9SZXNpemUuaW5kZXhPZihjb2x1bW4pO1xuICAgIGNvbHVtbnNUb1Jlc2l6ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbi8qKlxuICogR2V0cyB0aGUgd2lkdGggb2YgdGhlIGNvbHVtbnNcbiAqL1xuZnVuY3Rpb24gZ2V0Q29udGVudFdpZHRoKGFsbENvbHVtbnM6IGFueSwgZGVmYXVsdENvbFdpZHRoOiBudW1iZXIgPSAzMDApOiBudW1iZXIge1xuICBsZXQgY29udGVudFdpZHRoID0gMDtcblxuICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBhbGxDb2x1bW5zKSB7XG4gICAgY29udGVudFdpZHRoICs9IGNvbHVtbi53aWR0aCB8fCBkZWZhdWx0Q29sV2lkdGg7XG4gIH1cblxuICByZXR1cm4gY29udGVudFdpZHRoO1xufVxuIl19