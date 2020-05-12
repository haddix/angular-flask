import { __values } from "tslib";
/**
 * Returns the columns by pin.
 */
export function columnsByPin(cols) {
    var e_1, _a;
    var ret = {
        left: [],
        center: [],
        right: []
    };
    if (cols) {
        try {
            for (var cols_1 = __values(cols), cols_1_1 = cols_1.next(); !cols_1_1.done; cols_1_1 = cols_1.next()) {
                var col = cols_1_1.value;
                if (col.frozenLeft) {
                    ret.left.push(col);
                }
                else if (col.frozenRight) {
                    ret.right.push(col);
                }
                else {
                    ret.center.push(col);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cols_1_1 && !cols_1_1.done && (_a = cols_1.return)) _a.call(cols_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return ret;
}
/**
 * Returns the widths of all group sets of a column
 */
export function columnGroupWidths(groups, all) {
    return {
        left: columnTotalWidth(groups.left),
        center: columnTotalWidth(groups.center),
        right: columnTotalWidth(groups.right),
        total: Math.floor(columnTotalWidth(all))
    };
}
/**
 * Calculates the total width of all columns and their groups
 */
export function columnTotalWidth(columns, prop) {
    var e_2, _a;
    var totalWidth = 0;
    if (columns) {
        try {
            for (var columns_1 = __values(columns), columns_1_1 = columns_1.next(); !columns_1_1.done; columns_1_1 = columns_1.next()) {
                var c = columns_1_1.value;
                var has = prop && c[prop];
                var width = has ? c[prop] : c.width;
                totalWidth = totalWidth + parseFloat(width);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (columns_1_1 && !columns_1_1.done && (_a = columns_1.return)) _a.call(columns_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return totalWidth;
}
/**
 * Calculates the total width of all columns and their groups
 */
export function columnsTotalWidth(columns, prop) {
    var e_3, _a;
    var totalWidth = 0;
    try {
        for (var columns_2 = __values(columns), columns_2_1 = columns_2.next(); !columns_2_1.done; columns_2_1 = columns_2.next()) {
            var column = columns_2_1.value;
            var has = prop && column[prop];
            totalWidth = totalWidth + (has ? column[prop] : column.width);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (columns_2_1 && !columns_2_1.done && (_a = columns_2.return)) _a.call(columns_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return totalWidth;
}
export function columnsByPinArr(val) {
    var colsByPinArr = [];
    var colsByPin = columnsByPin(val);
    colsByPinArr.push({ type: 'left', columns: colsByPin['left'] });
    colsByPinArr.push({ type: 'center', columns: colsByPin['center'] });
    colsByPinArr.push({ type: 'right', columns: colsByPin['right'] });
    return colsByPinArr;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvdXRpbHMvY29sdW1uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsSUFBVzs7SUFDdEMsSUFBTSxHQUFHLEdBQTJDO1FBQ2xELElBQUksRUFBRSxFQUFFO1FBQ1IsTUFBTSxFQUFFLEVBQUU7UUFDVixLQUFLLEVBQUUsRUFBRTtLQUNWLENBQUM7SUFFRixJQUFJLElBQUksRUFBRTs7WUFDUixLQUFrQixJQUFBLFNBQUEsU0FBQSxJQUFJLENBQUEsMEJBQUEsNENBQUU7Z0JBQW5CLElBQU0sR0FBRyxpQkFBQTtnQkFDWixJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7b0JBQ2xCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNwQjtxQkFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUU7b0JBQzFCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNyQjtxQkFBTTtvQkFDTCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7YUFDRjs7Ozs7Ozs7O0tBQ0Y7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxNQUFXLEVBQUUsR0FBUTtJQUNyRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDbkMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdkMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDckMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDekMsQ0FBQztBQUNKLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxPQUFjLEVBQUUsSUFBYTs7SUFDNUQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBRW5CLElBQUksT0FBTyxFQUFFOztZQUNYLEtBQWdCLElBQUEsWUFBQSxTQUFBLE9BQU8sQ0FBQSxnQ0FBQSxxREFBRTtnQkFBcEIsSUFBTSxDQUFDLG9CQUFBO2dCQUNWLElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUN0QyxVQUFVLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM3Qzs7Ozs7Ozs7O0tBQ0Y7SUFFRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsT0FBWSxFQUFFLElBQVU7O0lBQ3hELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQzs7UUFFbkIsS0FBcUIsSUFBQSxZQUFBLFNBQUEsT0FBTyxDQUFBLGdDQUFBLHFEQUFFO1lBQXpCLElBQU0sTUFBTSxvQkFBQTtZQUNmLElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsVUFBVSxHQUFHLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0Q7Ozs7Ozs7OztJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUFDLEdBQVE7SUFDdEMsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLElBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVwQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwRSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVsRSxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXR1cm5zIHRoZSBjb2x1bW5zIGJ5IHBpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbHVtbnNCeVBpbihjb2xzOiBhbnlbXSkge1xuICBjb25zdCByZXQ6IHsgbGVmdDogYW55OyBjZW50ZXI6IGFueTsgcmlnaHQ6IGFueSB9ID0ge1xuICAgIGxlZnQ6IFtdLFxuICAgIGNlbnRlcjogW10sXG4gICAgcmlnaHQ6IFtdXG4gIH07XG5cbiAgaWYgKGNvbHMpIHtcbiAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XG4gICAgICBpZiAoY29sLmZyb3plbkxlZnQpIHtcbiAgICAgICAgcmV0LmxlZnQucHVzaChjb2wpO1xuICAgICAgfSBlbHNlIGlmIChjb2wuZnJvemVuUmlnaHQpIHtcbiAgICAgICAgcmV0LnJpZ2h0LnB1c2goY29sKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldC5jZW50ZXIucHVzaChjb2wpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgd2lkdGhzIG9mIGFsbCBncm91cCBzZXRzIG9mIGEgY29sdW1uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2x1bW5Hcm91cFdpZHRocyhncm91cHM6IGFueSwgYWxsOiBhbnkpIHtcbiAgcmV0dXJuIHtcbiAgICBsZWZ0OiBjb2x1bW5Ub3RhbFdpZHRoKGdyb3Vwcy5sZWZ0KSxcbiAgICBjZW50ZXI6IGNvbHVtblRvdGFsV2lkdGgoZ3JvdXBzLmNlbnRlciksXG4gICAgcmlnaHQ6IGNvbHVtblRvdGFsV2lkdGgoZ3JvdXBzLnJpZ2h0KSxcbiAgICB0b3RhbDogTWF0aC5mbG9vcihjb2x1bW5Ub3RhbFdpZHRoKGFsbCkpXG4gIH07XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdG90YWwgd2lkdGggb2YgYWxsIGNvbHVtbnMgYW5kIHRoZWlyIGdyb3Vwc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29sdW1uVG90YWxXaWR0aChjb2x1bW5zOiBhbnlbXSwgcHJvcD86IHN0cmluZykge1xuICBsZXQgdG90YWxXaWR0aCA9IDA7XG5cbiAgaWYgKGNvbHVtbnMpIHtcbiAgICBmb3IgKGNvbnN0IGMgb2YgY29sdW1ucykge1xuICAgICAgY29uc3QgaGFzID0gcHJvcCAmJiBjW3Byb3BdO1xuICAgICAgY29uc3Qgd2lkdGggPSBoYXMgPyBjW3Byb3BdIDogYy53aWR0aDtcbiAgICAgIHRvdGFsV2lkdGggPSB0b3RhbFdpZHRoICsgcGFyc2VGbG9hdCh3aWR0aCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRvdGFsV2lkdGg7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdG90YWwgd2lkdGggb2YgYWxsIGNvbHVtbnMgYW5kIHRoZWlyIGdyb3Vwc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29sdW1uc1RvdGFsV2lkdGgoY29sdW1uczogYW55LCBwcm9wPzogYW55KSB7XG4gIGxldCB0b3RhbFdpZHRoID0gMDtcblxuICBmb3IgKGNvbnN0IGNvbHVtbiBvZiBjb2x1bW5zKSB7XG4gICAgY29uc3QgaGFzID0gcHJvcCAmJiBjb2x1bW5bcHJvcF07XG4gICAgdG90YWxXaWR0aCA9IHRvdGFsV2lkdGggKyAoaGFzID8gY29sdW1uW3Byb3BdIDogY29sdW1uLndpZHRoKTtcbiAgfVxuXG4gIHJldHVybiB0b3RhbFdpZHRoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29sdW1uc0J5UGluQXJyKHZhbDogYW55KSB7XG4gIGNvbnN0IGNvbHNCeVBpbkFyciA9IFtdO1xuICBjb25zdCBjb2xzQnlQaW4gPSBjb2x1bW5zQnlQaW4odmFsKTtcblxuICBjb2xzQnlQaW5BcnIucHVzaCh7IHR5cGU6ICdsZWZ0JywgY29sdW1uczogY29sc0J5UGluWydsZWZ0J10gfSk7XG4gIGNvbHNCeVBpbkFyci5wdXNoKHsgdHlwZTogJ2NlbnRlcicsIGNvbHVtbnM6IGNvbHNCeVBpblsnY2VudGVyJ10gfSk7XG4gIGNvbHNCeVBpbkFyci5wdXNoKHsgdHlwZTogJ3JpZ2h0JywgY29sdW1uczogY29sc0J5UGluWydyaWdodCddIH0pO1xuXG4gIHJldHVybiBjb2xzQnlQaW5BcnI7XG59XG4iXX0=