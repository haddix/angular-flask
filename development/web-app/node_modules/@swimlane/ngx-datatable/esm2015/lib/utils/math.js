import { columnsByPin, columnsTotalWidth } from './column';
/**
 * Calculates the Total Flex Grow
 */
export function getTotalFlexGrow(columns) {
    let totalFlexGrow = 0;
    for (const c of columns) {
        totalFlexGrow += c.flexGrow || 0;
    }
    return totalFlexGrow;
}
/**
 * Adjusts the column widths.
 * Inspired by: https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableWidthHelper.js
 */
export function adjustColumnWidths(allColumns, expectedWidth) {
    const columnsWidth = columnsTotalWidth(allColumns);
    const totalFlexGrow = getTotalFlexGrow(allColumns);
    const colsByGroup = columnsByPin(allColumns);
    if (columnsWidth !== expectedWidth) {
        scaleColumns(colsByGroup, expectedWidth, totalFlexGrow);
    }
}
/**
 * Resizes columns based on the flexGrow property, while respecting manually set widths
 */
function scaleColumns(colsByGroup, maxWidth, totalFlexGrow) {
    // calculate total width and flexgrow points for coulumns that can be resized
    for (const attr in colsByGroup) {
        for (const column of colsByGroup[attr]) {
            if (!column.canAutoResize) {
                maxWidth -= column.width;
                totalFlexGrow -= column.flexGrow ? column.flexGrow : 0;
            }
            else {
                column.width = 0;
            }
        }
    }
    const hasMinWidth = {};
    let remainingWidth = maxWidth;
    // resize columns until no width is left to be distributed
    do {
        const widthPerFlexPoint = remainingWidth / totalFlexGrow;
        remainingWidth = 0;
        for (const attr in colsByGroup) {
            for (const column of colsByGroup[attr]) {
                // if the column can be resize and it hasn't reached its minimum width yet
                if (column.canAutoResize && !hasMinWidth[column.prop]) {
                    const newWidth = column.width + column.flexGrow * widthPerFlexPoint;
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
export function forceFillColumnWidths(allColumns, expectedWidth, startIdx, allowBleed, defaultColWidth = 300) {
    const columnsToResize = allColumns.slice(startIdx + 1, allColumns.length).filter(c => {
        return c.canAutoResize !== false;
    });
    for (const column of columnsToResize) {
        if (!column.$$oldWidth) {
            column.$$oldWidth = column.width;
        }
    }
    let additionWidthPerColumn = 0;
    let exceedsWindow = false;
    let contentWidth = getContentWidth(allColumns, defaultColWidth);
    let remainingWidth = expectedWidth - contentWidth;
    const columnsProcessed = [];
    const remainingWidthLimit = 1; // when to stop
    // This loop takes care of the
    do {
        additionWidthPerColumn = remainingWidth / columnsToResize.length;
        exceedsWindow = contentWidth >= expectedWidth;
        for (const column of columnsToResize) {
            if (exceedsWindow && allowBleed) {
                column.width = column.$$oldWidth || column.width || defaultColWidth;
            }
            else {
                const newSize = (column.width || defaultColWidth) + additionWidthPerColumn;
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
        contentWidth = getContentWidth(allColumns);
        remainingWidth = expectedWidth - contentWidth;
        removeProcessedColumns(columnsToResize, columnsProcessed);
    } while (remainingWidth > remainingWidthLimit && columnsToResize.length !== 0);
}
/**
 * Remove the processed columns from the current active columns.
 */
function removeProcessedColumns(columnsToResize, columnsProcessed) {
    for (const column of columnsProcessed) {
        const index = columnsToResize.indexOf(column);
        columnsToResize.splice(index, 1);
    }
}
/**
 * Gets the width of the columns
 */
function getContentWidth(allColumns, defaultColWidth = 300) {
    let contentWidth = 0;
    for (const column of allColumns) {
        contentWidth += column.width || defaultColWidth;
    }
    return contentWidth;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL21hdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUzRDs7R0FFRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxPQUFjO0lBQzdDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztJQUV0QixLQUFLLE1BQU0sQ0FBQyxJQUFJLE9BQU8sRUFBRTtRQUN2QixhQUFhLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUM7S0FDbEM7SUFFRCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLFVBQWUsRUFBRSxhQUFrQjtJQUNwRSxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRCxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRCxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFN0MsSUFBSSxZQUFZLEtBQUssYUFBYSxFQUFFO1FBQ2xDLFlBQVksQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQ3pEO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxZQUFZLENBQUMsV0FBZ0IsRUFBRSxRQUFhLEVBQUUsYUFBa0I7SUFDdkUsNkVBQTZFO0lBQzdFLEtBQUssTUFBTSxJQUFJLElBQUksV0FBVyxFQUFFO1FBQzlCLEtBQUssTUFBTSxNQUFNLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUN6QixRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FB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QUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNsQztBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLFVBQWUsRUFBRSxrQkFBMEIsR0FBRztJQUNyRSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7SUFFckIsS0FBSyxNQUFNLE1BQU0sSUFBSSxVQUFVLEVBQUU7UUFDL0IsWUFBWSxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksZUFBZSxDQUFDO0tBQ2pEO0lBRUQsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbHVtbnNCeVBpbiwgY29sdW1uc1RvdGFsV2lkdGggfSBmcm9tICcuL2NvbHVtbic7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgVG90YWwgRmxleCBHcm93XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3RhbEZsZXhHcm93KGNvbHVtbnM6IGFueVtdKSB7XG4gIGxldCB0b3RhbEZsZXhHcm93ID0gMDtcblxuICBmb3IgKGNvbnN0IGMgb2YgY29sdW1ucykge1xuICAgIHRvdGFsRmxleEdyb3cgKz0gYy5mbGV4R3JvdyB8fCAwO1xuICB9XG5cbiAgcmV0dXJuIHRvdGFsRmxleEdyb3c7XG59XG5cbi8qKlxuICogQWRqdXN0cyB0aGUgY29sdW1uIHdpZHRocy5cbiAqIEluc3BpcmVkIGJ5OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZml4ZWQtZGF0YS10YWJsZS9ibG9iL21hc3Rlci9zcmMvRml4ZWREYXRhVGFibGVXaWR0aEhlbHBlci5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYWRqdXN0Q29sdW1uV2lkdGhzKGFsbENvbHVtbnM6IGFueSwgZXhwZWN0ZWRXaWR0aDogYW55KSB7XG4gIGNvbnN0IGNvbHVtbnNXaWR0aCA9IGNvbHVtbnNUb3RhbFdpZHRoKGFsbENvbHVtbnMpO1xuICBjb25zdCB0b3RhbEZsZXhHcm93ID0gZ2V0VG90YWxGbGV4R3JvdyhhbGxDb2x1bW5zKTtcbiAgY29uc3QgY29sc0J5R3JvdXAgPSBjb2x1bW5zQnlQaW4oYWxsQ29sdW1ucyk7XG5cbiAgaWYgKGNvbHVtbnNXaWR0aCAhPT0gZXhwZWN0ZWRXaWR0aCkge1xuICAgIHNjYWxlQ29sdW1ucyhjb2xzQnlHcm91cCwgZXhwZWN0ZWRXaWR0aCwgdG90YWxGbGV4R3Jvdyk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNpemVzIGNvbHVtbnMgYmFzZWQgb24gdGhlIGZsZXhHcm93IHByb3BlcnR5LCB3aGlsZSByZXNwZWN0aW5nIG1hbnVhbGx5IHNldCB3aWR0aHNcbiAqL1xuZnVuY3Rpb24gc2NhbGVDb2x1bW5zKGNvbHNCeUdyb3VwOiBhbnksIG1heFdpZHRoOiBhbnksIHRvdGFsRmxleEdyb3c6IGFueSkge1xuICAvLyBjYWxjdWxhdGUgdG90YWwgd2lkdGggYW5kIGZsZXhncm93IHBvaW50cyBmb3IgY291bHVtbnMgdGhhdCBjYW4gYmUgcmVzaXplZFxuICBmb3IgKGNvbnN0IGF0dHIgaW4gY29sc0J5R3JvdXApIHtcbiAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2xzQnlHcm91cFthdHRyXSkge1xuICAgICAgaWYgKCFjb2x1bW4uY2FuQXV0b1Jlc2l6ZSkge1xuICAgICAgICBtYXhXaWR0aCAtPSBjb2x1bW4ud2lkdGg7XG4gICAgICAgIHRvdGFsRmxleEdyb3cgLT0gY29sdW1uLmZsZXhHcm93ID8gY29sdW1uLmZsZXhHcm93IDogMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtbi53aWR0aCA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFzTWluV2lkdGggPSB7fTtcbiAgbGV0IHJlbWFpbmluZ1dpZHRoID0gbWF4V2lkdGg7XG5cbiAgLy8gcmVzaXplIGNvbHVtbnMgdW50aWwgbm8gd2lkdGggaXMgbGVmdCB0byBiZSBkaXN0cmlidXRlZFxuICBkbyB7XG4gICAgY29uc3Qgd2lkdGhQZXJGbGV4UG9pbnQgPSByZW1haW5pbmdXaWR0aCAvIHRvdGFsRmxleEdyb3c7XG4gICAgcmVtYWluaW5nV2lkdGggPSAwO1xuXG4gICAgZm9yIChjb25zdCBhdHRyIGluIGNvbHNCeUdyb3VwKSB7XG4gICAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2xzQnlHcm91cFthdHRyXSkge1xuICAgICAgICAvLyBpZiB0aGUgY29sdW1uIGNhbiBiZSByZXNpemUgYW5kIGl0IGhhc24ndCByZWFjaGVkIGl0cyBtaW5pbXVtIHdpZHRoIHlldFxuICAgICAgICBpZiAoY29sdW1uLmNhbkF1dG9SZXNpemUgJiYgIWhhc01pbldpZHRoW2NvbHVtbi5wcm9wXSkge1xuICAgICAgICAgIGNvbnN0IG5ld1dpZHRoID0gY29sdW1uLndpZHRoICsgY29sdW1uLmZsZXhHcm93ICogd2lkdGhQZXJGbGV4UG9pbnQ7XG4gICAgICAgICAgaWYgKGNvbHVtbi5taW5XaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5ld1dpZHRoIDwgY29sdW1uLm1pbldpZHRoKSB7XG4gICAgICAgICAgICByZW1haW5pbmdXaWR0aCArPSBuZXdXaWR0aCAtIGNvbHVtbi5taW5XaWR0aDtcbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IGNvbHVtbi5taW5XaWR0aDtcbiAgICAgICAgICAgIGhhc01pbldpZHRoW2NvbHVtbi5wcm9wXSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IG5ld1dpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAocmVtYWluaW5nV2lkdGggIT09IDApO1xufVxuXG4vKipcbiAqIEZvcmNlcyB0aGUgd2lkdGggb2YgdGhlIGNvbHVtbnMgdG9cbiAqIGRpc3RyaWJ1dGUgZXF1YWxseSBidXQgb3ZlcmZsb3dpbmcgd2hlbiBuZWNlc3NhcnlcbiAqXG4gKiBSdWxlczpcbiAqXG4gKiAgLSBJZiBjb21iaW5lZCB3aXRocyBhcmUgbGVzcyB0aGFuIHRoZSB0b3RhbCB3aWR0aCBvZiB0aGUgZ3JpZCxcbiAqICAgIHByb3BvcnRpb24gdGhlIHdpZHRocyBnaXZlbiB0aGUgbWluIC8gbWF4IC8gbm9ybWFsIHdpZHRocyB0byBmaWxsIHRoZSB3aWR0aC5cbiAqXG4gKiAgLSBJZiB0aGUgY29tYmluZWQgd2lkdGhzLCBleGNlZWQgdGhlIHRvdGFsIHdpZHRoIG9mIHRoZSBncmlkLFxuICogICAgdXNlIHRoZSBzdGFuZGFyZCB3aWR0aHMuXG4gKlxuICogIC0gSWYgYSBjb2x1bW4gaXMgcmVzaXplZCwgaXQgc2hvdWxkIGFsd2F5cyB1c2UgdGhhdCB3aWR0aFxuICpcbiAqICAtIFRoZSBwcm9wb3J0aW9uYWwgd2lkdGhzIHNob3VsZCBuZXZlciBmYWxsIGJlbG93IG1pbiBzaXplIGlmIHNwZWNpZmllZC5cbiAqXG4gKiAgLSBJZiB0aGUgZ3JpZCBzdGFydHMgb2ZmIHNtYWxsIGJ1dCB0aGVuIGJlY29tZXMgZ3JlYXRlciB0aGFuIHRoZSBzaXplICggKyAvIC0gKVxuICogICAgdGhlIHdpZHRoIHNob3VsZCB1c2UgdGhlIG9yaWdpbmFsIHdpZHRoOyBub3QgdGhlIG5ld2x5IHByb3BvcnRpb25lZCB3aWR0aHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUZpbGxDb2x1bW5XaWR0aHMoXG4gIGFsbENvbHVtbnM6IGFueVtdLFxuICBleHBlY3RlZFdpZHRoOiBudW1iZXIsXG4gIHN0YXJ0SWR4OiBudW1iZXIsXG4gIGFsbG93QmxlZWQ6IGJvb2xlYW4sXG4gIGRlZmF1bHRDb2xXaWR0aDogbnVtYmVyID0gMzAwXG4pIHtcbiAgY29uc3QgY29sdW1uc1RvUmVzaXplID0gYWxsQ29sdW1ucy5zbGljZShzdGFydElkeCArIDEsIGFsbENvbHVtbnMubGVuZ3RoKS5maWx0ZXIoYyA9PiB7XG4gICAgcmV0dXJuIGMuY2FuQXV0b1Jlc2l6ZSAhPT0gZmFsc2U7XG4gIH0pO1xuXG4gIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnNUb1Jlc2l6ZSkge1xuICAgIGlmICghY29sdW1uLiQkb2xkV2lkdGgpIHtcbiAgICAgIGNvbHVtbi4kJG9sZFdpZHRoID0gY29sdW1uLndpZHRoO1xuICAgIH1cbiAgfVxuXG4gIGxldCBhZGRpdGlvbldpZHRoUGVyQ29sdW1uID0gMDtcbiAgbGV0IGV4Y2VlZHNXaW5kb3cgPSBmYWxzZTtcbiAgbGV0IGNvbnRlbnRXaWR0aCA9IGdldENvbnRlbnRXaWR0aChhbGxDb2x1bW5zLCBkZWZhdWx0Q29sV2lkdGgpO1xuICBsZXQgcmVtYWluaW5nV2lkdGggPSBleHBlY3RlZFdpZHRoIC0gY29udGVudFdpZHRoO1xuICBjb25zdCBjb2x1bW5zUHJvY2Vzc2VkOiBhbnlbXSA9IFtdO1xuICBjb25zdCByZW1haW5pbmdXaWR0aExpbWl0ID0gMTsgLy8gd2hlbiB0byBzdG9wXG5cbiAgLy8gVGhpcyBsb29wIHRha2VzIGNhcmUgb2YgdGhlXG4gIGRvIHtcbiAgICBhZGRpdGlvbldpZHRoUGVyQ29sdW1uID0gcmVtYWluaW5nV2lkdGggLyBjb2x1bW5zVG9SZXNpemUubGVuZ3RoO1xuICAgIGV4Y2VlZHNXaW5kb3cgPSBjb250ZW50V2lkdGggPj0gZXhwZWN0ZWRXaWR0aDtcblxuICAgIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnNUb1Jlc2l6ZSkge1xuICAgICAgaWYgKGV4Y2VlZHNXaW5kb3cgJiYgYWxsb3dCbGVlZCkge1xuICAgICAgICBjb2x1bW4ud2lkdGggPSBjb2x1bW4uJCRvbGRXaWR0aCB8fCBjb2x1bW4ud2lkdGggfHwgZGVmYXVsdENvbFdpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbmV3U2l6ZSA9IChjb2x1bW4ud2lkdGggfHwgZGVmYXVsdENvbFdpZHRoKSArIGFkZGl0aW9uV2lkdGhQZXJDb2x1bW47XG5cbiAgICAgICAgaWYgKGNvbHVtbi5taW5XaWR0aCAmJiBuZXdTaXplIDwgY29sdW1uLm1pbldpZHRoKSB7XG4gICAgICAgICAgY29sdW1uLndpZHRoID0gY29sdW1uLm1pbldpZHRoO1xuICAgICAgICAgIGNvbHVtbnNQcm9jZXNzZWQucHVzaChjb2x1bW4pO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbHVtbi5tYXhXaWR0aCAmJiBuZXdTaXplID4gY29sdW1uLm1heFdpZHRoKSB7XG4gICAgICAgICAgY29sdW1uLndpZHRoID0gY29sdW1uLm1heFdpZHRoO1xuICAgICAgICAgIGNvbHVtbnNQcm9jZXNzZWQucHVzaChjb2x1bW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbHVtbi53aWR0aCA9IG5ld1NpemU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29sdW1uLndpZHRoID0gTWF0aC5tYXgoMCwgY29sdW1uLndpZHRoKTtcbiAgICB9XG5cbiAgICBjb250ZW50V2lkdGggPSBnZXRDb250ZW50V2lkdGgoYWxsQ29sdW1ucyk7XG4gICAgcmVtYWluaW5nV2lkdGggPSBleHBlY3RlZFdpZHRoIC0gY29udGVudFdpZHRoO1xuICAgIHJlbW92ZVByb2Nlc3NlZENvbHVtbnMoY29sdW1uc1RvUmVzaXplLCBjb2x1bW5zUHJvY2Vzc2VkKTtcbiAgfSB3aGlsZSAocmVtYWluaW5nV2lkdGggPiByZW1haW5pbmdXaWR0aExpbWl0ICYmIGNvbHVtbnNUb1Jlc2l6ZS5sZW5ndGggIT09IDApO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgcHJvY2Vzc2VkIGNvbHVtbnMgZnJvbSB0aGUgY3VycmVudCBhY3RpdmUgY29sdW1ucy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUHJvY2Vzc2VkQ29sdW1ucyhjb2x1bW5zVG9SZXNpemU6IGFueVtdLCBjb2x1bW5zUHJvY2Vzc2VkOiBhbnlbXSkge1xuICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2x1bW5zUHJvY2Vzc2VkKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb2x1bW5zVG9SZXNpemUuaW5kZXhPZihjb2x1bW4pO1xuICAgIGNvbHVtbnNUb1Jlc2l6ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbi8qKlxuICogR2V0cyB0aGUgd2lkdGggb2YgdGhlIGNvbHVtbnNcbiAqL1xuZnVuY3Rpb24gZ2V0Q29udGVudFdpZHRoKGFsbENvbHVtbnM6IGFueSwgZGVmYXVsdENvbFdpZHRoOiBudW1iZXIgPSAzMDApOiBudW1iZXIge1xuICBsZXQgY29udGVudFdpZHRoID0gMDtcblxuICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBhbGxDb2x1bW5zKSB7XG4gICAgY29udGVudFdpZHRoICs9IGNvbHVtbi53aWR0aCB8fCBkZWZhdWx0Q29sV2lkdGg7XG4gIH1cblxuICByZXR1cm4gY29udGVudFdpZHRoO1xufVxuIl19