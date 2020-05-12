import { __read, __spread, __values } from "tslib";
import { getterForProp } from './column-prop-getters';
import { SortType } from '../types/sort.type';
import { SortDirection } from '../types/sort-direction.type';
/**
 * Gets the next sort direction
 */
export function nextSortDir(sortType, current) {
    if (sortType === SortType.single) {
        if (current === SortDirection.asc) {
            return SortDirection.desc;
        }
        else {
            return SortDirection.asc;
        }
    }
    else {
        if (!current) {
            return SortDirection.asc;
        }
        else if (current === SortDirection.asc) {
            return SortDirection.desc;
        }
        else if (current === SortDirection.desc) {
            return undefined;
        }
        // avoid TS7030: Not all code paths return a value.
        return undefined;
    }
}
/**
 * Adapted from fueld-ui on 6/216
 * https://github.com/FuelInteractive/fuel-ui/tree/master/src/pipes/OrderBy
 */
export function orderByComparator(a, b) {
    if (a === null || typeof a === 'undefined')
        a = 0;
    if (b === null || typeof b === 'undefined')
        b = 0;
    if (a instanceof Date && b instanceof Date) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
    }
    else if (isNaN(parseFloat(a)) || !isFinite(a) || isNaN(parseFloat(b)) || !isFinite(b)) {
        // Convert to string in case of a=0 or b=0
        a = String(a);
        b = String(b);
        // Isn't a number so lowercase the string to properly compare
        if (a.toLowerCase() < b.toLowerCase())
            return -1;
        if (a.toLowerCase() > b.toLowerCase())
            return 1;
    }
    else {
        // Parse strings as numbers to compare properly
        if (parseFloat(a) < parseFloat(b))
            return -1;
        if (parseFloat(a) > parseFloat(b))
            return 1;
    }
    // equal each other
    return 0;
}
/**
 * creates a shallow copy of the `rows` input and returns the sorted copy. this function
 * does not sort the `rows` argument in place
 */
export function sortRows(rows, columns, dirs) {
    if (!rows)
        return [];
    if (!dirs || !dirs.length || !columns)
        return __spread(rows);
    /**
     * record the row ordering of results from prior sort operations (if applicable)
     * this is necessary to guarantee stable sorting behavior
     */
    var rowToIndexMap = new Map();
    rows.forEach(function (row, index) { return rowToIndexMap.set(row, index); });
    var temp = __spread(rows);
    var cols = columns.reduce(function (obj, col) {
        if (col.comparator && typeof col.comparator === 'function') {
            obj[col.prop] = col.comparator;
        }
        return obj;
    }, {});
    // cache valueGetter and compareFn so that they
    // do not need to be looked-up in the sort function body
    var cachedDirs = dirs.map(function (dir) {
        var prop = dir.prop;
        return {
            prop: prop,
            dir: dir.dir,
            valueGetter: getterForProp(prop),
            compareFn: cols[prop] || orderByComparator
        };
    });
    return temp.sort(function (rowA, rowB) {
        var e_1, _a;
        try {
            for (var cachedDirs_1 = __values(cachedDirs), cachedDirs_1_1 = cachedDirs_1.next(); !cachedDirs_1_1.done; cachedDirs_1_1 = cachedDirs_1.next()) {
                var cachedDir = cachedDirs_1_1.value;
                // Get property and valuegetters for column to be sorted
                var prop = cachedDir.prop, valueGetter = cachedDir.valueGetter;
                // Get A and B cell values from rows based on properties of the columns
                var propA = valueGetter(rowA, prop);
                var propB = valueGetter(rowB, prop);
                // Compare function gets five parameters:
                // Two cell values to be compared as propA and propB
                // Two rows corresponding to the cells as rowA and rowB
                // Direction of the sort for this column as SortDirection
                // Compare can be a standard JS comparison function (a,b) => -1|0|1
                // as additional parameters are silently ignored. The whole row and sort
                // direction enable more complex sort logic.
                var comparison = cachedDir.dir !== SortDirection.desc
                    ? cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir)
                    : -cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir);
                // Don't return 0 yet in case of needing to sort by next property
                if (comparison !== 0)
                    return comparison;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cachedDirs_1_1 && !cachedDirs_1_1.done && (_a = cachedDirs_1.return)) _a.call(cachedDirs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!(rowToIndexMap.has(rowA) && rowToIndexMap.has(rowB)))
            return 0;
        /**
         * all else being equal, preserve original order of the rows (stable sort)
         */
        return rowToIndexMap.get(rowA) < rowToIndexMap.get(rowB) ? -1 : 1;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRTdEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxRQUFrQixFQUFFLE9BQXNCO0lBQ3BFLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDaEMsSUFBSSxPQUFPLEtBQUssYUFBYSxDQUFDLEdBQUcsRUFBRTtZQUNqQyxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUM7U0FDM0I7YUFBTTtZQUNMLE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQztTQUMxQjtLQUNGO1NBQU07UUFDTCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDO1NBQzFCO2FBQU0sSUFBSSxPQUFPLEtBQUssYUFBYSxDQUFDLEdBQUcsRUFBRTtZQUN4QyxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUM7U0FDM0I7YUFBTSxJQUFJLE9BQU8sS0FBSyxhQUFhLENBQUMsSUFBSSxFQUFFO1lBQ3pDLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsbURBQW1EO1FBQ25ELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxDQUFNLEVBQUUsQ0FBTTtJQUM5QyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztRQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLE9B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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0dGVyRm9yUHJvcCB9IGZyb20gJy4vY29sdW1uLXByb3AtZ2V0dGVycyc7XG5pbXBvcnQgeyBTb3J0VHlwZSB9IGZyb20gJy4uL3R5cGVzL3NvcnQudHlwZSc7XG5pbXBvcnQgeyBTb3J0RGlyZWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvc29ydC1kaXJlY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBTb3J0UHJvcERpciB9IGZyb20gJy4uL3R5cGVzL3NvcnQtcHJvcC1kaXIudHlwZSc7XG4vKipcbiAqIEdldHMgdGhlIG5leHQgc29ydCBkaXJlY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5leHRTb3J0RGlyKHNvcnRUeXBlOiBTb3J0VHlwZSwgY3VycmVudDogU29ydERpcmVjdGlvbik6IFNvcnREaXJlY3Rpb24gfCB1bmRlZmluZWQge1xuICBpZiAoc29ydFR5cGUgPT09IFNvcnRUeXBlLnNpbmdsZSkge1xuICAgIGlmIChjdXJyZW50ID09PSBTb3J0RGlyZWN0aW9uLmFzYykge1xuICAgICAgcmV0dXJuIFNvcnREaXJlY3Rpb24uZGVzYztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFNvcnREaXJlY3Rpb24uYXNjO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIWN1cnJlbnQpIHtcbiAgICAgIHJldHVybiBTb3J0RGlyZWN0aW9uLmFzYztcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnQgPT09IFNvcnREaXJlY3Rpb24uYXNjKSB7XG4gICAgICByZXR1cm4gU29ydERpcmVjdGlvbi5kZXNjO1xuICAgIH0gZWxzZSBpZiAoY3VycmVudCA9PT0gU29ydERpcmVjdGlvbi5kZXNjKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBhdm9pZCBUUzcwMzA6IE5vdCBhbGwgY29kZSBwYXRocyByZXR1cm4gYSB2YWx1ZS5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQWRhcHRlZCBmcm9tIGZ1ZWxkLXVpIG9uIDYvMjE2XG4gKiBodHRwczovL2dpdGh1Yi5jb20vRnVlbEludGVyYWN0aXZlL2Z1ZWwtdWkvdHJlZS9tYXN0ZXIvc3JjL3BpcGVzL09yZGVyQnlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9yZGVyQnlDb21wYXJhdG9yKGE6IGFueSwgYjogYW55KTogbnVtYmVyIHtcbiAgaWYgKGEgPT09IG51bGwgfHwgdHlwZW9mIGEgPT09ICd1bmRlZmluZWQnKSBhID0gMDtcbiAgaWYgKGIgPT09IG51bGwgfHwgdHlwZW9mIGIgPT09ICd1bmRlZmluZWQnKSBiID0gMDtcbiAgaWYgKGEgaW5zdGFuY2VvZiBEYXRlICYmIGIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgaWYgKGEgPCBiKSByZXR1cm4gLTE7XG4gICAgaWYgKGEgPiBiKSByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChpc05hTihwYXJzZUZsb2F0KGEpKSB8fCAhaXNGaW5pdGUoYSkgfHwgaXNOYU4ocGFyc2VGbG9hdChiKSkgfHwgIWlzRmluaXRlKGIpKSB7XG4gICAgLy8gQ29udmVydCB0byBzdHJpbmcgaW4gY2FzZSBvZiBhPTAgb3IgYj0wXG4gICAgYSA9IFN0cmluZyhhKTtcbiAgICBiID0gU3RyaW5nKGIpO1xuICAgIC8vIElzbid0IGEgbnVtYmVyIHNvIGxvd2VyY2FzZSB0aGUgc3RyaW5nIHRvIHByb3Blcmx5IGNvbXBhcmVcbiAgICBpZiAoYS50b0xvd2VyQ2FzZSgpIDwgYi50b0xvd2VyQ2FzZSgpKSByZXR1cm4gLTE7XG4gICAgaWYgKGEudG9Mb3dlckNhc2UoKSA+IGIudG9Mb3dlckNhc2UoKSkgcmV0dXJuIDE7XG4gIH0gZWxzZSB7XG4gICAgLy8gUGFyc2Ugc3RyaW5ncyBhcyBudW1iZXJzIHRvIGNvbXBhcmUgcHJvcGVybHlcbiAgICBpZiAocGFyc2VGbG9hdChhKSA8IHBhcnNlRmxvYXQoYikpIHJldHVybiAtMTtcbiAgICBpZiAocGFyc2VGbG9hdChhKSA+IHBhcnNlRmxvYXQoYikpIHJldHVybiAxO1xuICB9XG5cbiAgLy8gZXF1YWwgZWFjaCBvdGhlclxuICByZXR1cm4gMDtcbn1cblxuLyoqXG4gKiBjcmVhdGVzIGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBgcm93c2AgaW5wdXQgYW5kIHJldHVybnMgdGhlIHNvcnRlZCBjb3B5LiB0aGlzIGZ1bmN0aW9uXG4gKiBkb2VzIG5vdCBzb3J0IHRoZSBgcm93c2AgYXJndW1lbnQgaW4gcGxhY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRSb3dzKHJvd3M6IGFueVtdLCBjb2x1bW5zOiBhbnlbXSwgZGlyczogU29ydFByb3BEaXJbXSk6IGFueVtdIHtcbiAgaWYgKCFyb3dzKSByZXR1cm4gW107XG4gIGlmICghZGlycyB8fCAhZGlycy5sZW5ndGggfHwgIWNvbHVtbnMpIHJldHVybiBbLi4ucm93c107XG5cbiAgLyoqXG4gICAqIHJlY29yZCB0aGUgcm93IG9yZGVyaW5nIG9mIHJlc3VsdHMgZnJvbSBwcmlvciBzb3J0IG9wZXJhdGlvbnMgKGlmIGFwcGxpY2FibGUpXG4gICAqIHRoaXMgaXMgbmVjZXNzYXJ5IHRvIGd1YXJhbnRlZSBzdGFibGUgc29ydGluZyBiZWhhdmlvclxuICAgKi9cbiAgY29uc3Qgcm93VG9JbmRleE1hcCA9IG5ldyBNYXA8YW55LCBudW1iZXI+KCk7XG4gIHJvd3MuZm9yRWFjaCgocm93LCBpbmRleCkgPT4gcm93VG9JbmRleE1hcC5zZXQocm93LCBpbmRleCkpO1xuXG4gIGNvbnN0IHRlbXAgPSBbLi4ucm93c107XG4gIGNvbnN0IGNvbHMgPSBjb2x1bW5zLnJlZHVjZSgob2JqLCBjb2wpID0+IHtcbiAgICBpZiAoY29sLmNvbXBhcmF0b3IgJiYgdHlwZW9mIGNvbC5jb21wYXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvYmpbY29sLnByb3BdID0gY29sLmNvbXBhcmF0b3I7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcblxuICAvLyBjYWNoZSB2YWx1ZUdldHRlciBhbmQgY29tcGFyZUZuIHNvIHRoYXQgdGhleVxuICAvLyBkbyBub3QgbmVlZCB0byBiZSBsb29rZWQtdXAgaW4gdGhlIHNvcnQgZnVuY3Rpb24gYm9keVxuICBjb25zdCBjYWNoZWREaXJzID0gZGlycy5tYXAoZGlyID0+IHtcbiAgICBjb25zdCBwcm9wID0gZGlyLnByb3A7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3AsXG4gICAgICBkaXI6IGRpci5kaXIsXG4gICAgICB2YWx1ZUdldHRlcjogZ2V0dGVyRm9yUHJvcChwcm9wKSxcbiAgICAgIGNvbXBhcmVGbjogY29sc1twcm9wXSB8fCBvcmRlckJ5Q29tcGFyYXRvclxuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiB0ZW1wLnNvcnQoZnVuY3Rpb24gKHJvd0E6IGFueSwgcm93QjogYW55KSB7XG4gICAgZm9yIChjb25zdCBjYWNoZWREaXIgb2YgY2FjaGVkRGlycykge1xuICAgICAgLy8gR2V0IHByb3BlcnR5IGFuZCB2YWx1ZWdldHRlcnMgZm9yIGNvbHVtbiB0byBiZSBzb3J0ZWRcbiAgICAgIGNvbnN0IHsgcHJvcCwgdmFsdWVHZXR0ZXIgfSA9IGNhY2hlZERpcjtcbiAgICAgIC8vIEdldCBBIGFuZCBCIGNlbGwgdmFsdWVzIGZyb20gcm93cyBiYXNlZCBvbiBwcm9wZXJ0aWVzIG9mIHRoZSBjb2x1bW5zXG4gICAgICBjb25zdCBwcm9wQSA9IHZhbHVlR2V0dGVyKHJvd0EsIHByb3ApO1xuICAgICAgY29uc3QgcHJvcEIgPSB2YWx1ZUdldHRlcihyb3dCLCBwcm9wKTtcblxuICAgICAgLy8gQ29tcGFyZSBmdW5jdGlvbiBnZXRzIGZpdmUgcGFyYW1ldGVyczpcbiAgICAgIC8vIFR3byBjZWxsIHZhbHVlcyB0byBiZSBjb21wYXJlZCBhcyBwcm9wQSBhbmQgcHJvcEJcbiAgICAgIC8vIFR3byByb3dzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGNlbGxzIGFzIHJvd0EgYW5kIHJvd0JcbiAgICAgIC8vIERpcmVjdGlvbiBvZiB0aGUgc29ydCBmb3IgdGhpcyBjb2x1bW4gYXMgU29ydERpcmVjdGlvblxuICAgICAgLy8gQ29tcGFyZSBjYW4gYmUgYSBzdGFuZGFyZCBKUyBjb21wYXJpc29uIGZ1bmN0aW9uIChhLGIpID0+IC0xfDB8MVxuICAgICAgLy8gYXMgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIGFyZSBzaWxlbnRseSBpZ25vcmVkLiBUaGUgd2hvbGUgcm93IGFuZCBzb3J0XG4gICAgICAvLyBkaXJlY3Rpb24gZW5hYmxlIG1vcmUgY29tcGxleCBzb3J0IGxvZ2ljLlxuICAgICAgY29uc3QgY29tcGFyaXNvbiA9XG4gICAgICAgIGNhY2hlZERpci5kaXIgIT09IFNvcnREaXJlY3Rpb24uZGVzY1xuICAgICAgICAgID8gY2FjaGVkRGlyLmNvbXBhcmVGbihwcm9wQSwgcHJvcEIsIHJvd0EsIHJvd0IsIGNhY2hlZERpci5kaXIpXG4gICAgICAgICAgOiAtY2FjaGVkRGlyLmNvbXBhcmVGbihwcm9wQSwgcHJvcEIsIHJvd0EsIHJvd0IsIGNhY2hlZERpci5kaXIpO1xuXG4gICAgICAvLyBEb24ndCByZXR1cm4gMCB5ZXQgaW4gY2FzZSBvZiBuZWVkaW5nIHRvIHNvcnQgYnkgbmV4dCBwcm9wZXJ0eVxuICAgICAgaWYgKGNvbXBhcmlzb24gIT09IDApIHJldHVybiBjb21wYXJpc29uO1xuICAgIH1cblxuICAgIGlmICghKHJvd1RvSW5kZXhNYXAuaGFzKHJvd0EpICYmIHJvd1RvSW5kZXhNYXAuaGFzKHJvd0IpKSkgcmV0dXJuIDA7XG5cbiAgICAvKipcbiAgICAgKiBhbGwgZWxzZSBiZWluZyBlcXVhbCwgcHJlc2VydmUgb3JpZ2luYWwgb3JkZXIgb2YgdGhlIHJvd3MgKHN0YWJsZSBzb3J0KVxuICAgICAqL1xuICAgIHJldHVybiByb3dUb0luZGV4TWFwLmdldChyb3dBKSA8IHJvd1RvSW5kZXhNYXAuZ2V0KHJvd0IpID8gLTEgOiAxO1xuICB9KTtcbn1cbiJdfQ==