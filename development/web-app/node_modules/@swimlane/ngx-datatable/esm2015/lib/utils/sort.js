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
        return [...rows];
    /**
     * record the row ordering of results from prior sort operations (if applicable)
     * this is necessary to guarantee stable sorting behavior
     */
    const rowToIndexMap = new Map();
    rows.forEach((row, index) => rowToIndexMap.set(row, index));
    const temp = [...rows];
    const cols = columns.reduce((obj, col) => {
        if (col.comparator && typeof col.comparator === 'function') {
            obj[col.prop] = col.comparator;
        }
        return obj;
    }, {});
    // cache valueGetter and compareFn so that they
    // do not need to be looked-up in the sort function body
    const cachedDirs = dirs.map(dir => {
        const prop = dir.prop;
        return {
            prop,
            dir: dir.dir,
            valueGetter: getterForProp(prop),
            compareFn: cols[prop] || orderByComparator
        };
    });
    return temp.sort(function (rowA, rowB) {
        for (const cachedDir of cachedDirs) {
            // Get property and valuegetters for column to be sorted
            const { prop, valueGetter } = cachedDir;
            // Get A and B cell values from rows based on properties of the columns
            const propA = valueGetter(rowA, prop);
            const propB = valueGetter(rowB, prop);
            // Compare function gets five parameters:
            // Two cell values to be compared as propA and propB
            // Two rows corresponding to the cells as rowA and rowB
            // Direction of the sort for this column as SortDirection
            // Compare can be a standard JS comparison function (a,b) => -1|0|1
            // as additional parameters are silently ignored. The whole row and sort
            // direction enable more complex sort logic.
            const comparison = cachedDir.dir !== SortDirection.desc
                ? cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir)
                : -cachedDir.compareFn(propA, propB, rowA, rowB, cachedDir.dir);
            // Don't return 0 yet in case of needing to sort by next property
            if (comparison !== 0)
                return comparison;
        }
        if (!(rowToIndexMap.has(rowA) && rowToIndexMap.has(rowB)))
            return 0;
        /**
         * all else being equal, preserve original order of the rows (stable sort)
         */
        return rowToIndexMap.get(rowA) < rowToIndexMap.get(rowB) ? -1 : 1;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFN0Q7O0dBRUc7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLFFBQWtCLEVBQUUsT0FBc0I7SUFDcEUsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNoQyxJQUFJLE9BQU8sS0FBSyxhQUFhLENBQUMsR0FBRyxFQUFFO1lBQ2pDLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztTQUMzQjthQUFNO1lBQ0wsT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDO1NBQzFCO0tBQ0Y7U0FBTTtRQUNMLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUM7U0FDMUI7YUFBTSxJQUFJLE9BQU8sS0FBSyxhQUFhLENBQUMsR0FBRyxFQUFFO1lBQ3hDLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztTQUMzQjthQUFNLElBQUksT0FBTyxLQUFLLGFBQWEsQ0FBQyxJQUFJLEVBQUU7WUFDekMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxtREFBbUQ7UUFDbkQsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUFDLENBQU0sRUFBRSxDQUFNO0lBQzlDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXO1FBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsRCxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssV0FBVztRQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUU7UUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3JCO1NBQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3ZGLDBDQUEwQztRQUMxQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLDZEQUE2RDtRQUM3RCxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQUUsT0FBTyxDQUFDLENBQUM7S0FDakQ7U0FBTTtRQUNMLCtDQUErQztRQUMvQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7S0FDN0M7SUFFRCxtQkFBbUI7SUFDbkIsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxJQUFXLEVBQUUsT0FBYyxFQUFFLElBQW1CO0lBQ3ZFLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFDckIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFeEQ7OztPQUdHO0lBQ0gsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUU1RCxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUN2QyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksT0FBTyxHQUFHLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRTtZQUMxRCxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDaEM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLCtDQUErQztJQUMvQyx3REFBd0Q7SUFDeEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNoQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3RCLE9BQU87WUFDTCxJQUFJO1lBQ0osR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ1osV0FBVyxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUM7WUFDaEMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUI7U0FDM0MsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBUyxFQUFFLElBQVM7UUFDN0MsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUU7WUFDbEMsd0RBQXdEO1lBQ3hELE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsU0FBUyxDQUFDO1lBQ3hDLHVFQUF1RTtZQUN2RSxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFdEMseUNBQXlDO1lBQ3pDLG9EQUFvRDtZQUNwRCx1REFBdUQ7WUFDdkQseURBQXlEO1lBQ3pELG1FQUFtRTtZQUNuRSx3RUFBd0U7WUFDeEUsNENBQTRDO1lBQzVDLE1BQU0sVUFBVSxHQUNkLFNBQVMsQ0FBQyxHQUFHLEtBQUssYUFBYSxDQUFDLElBQUk7Z0JBQ2xDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDO2dCQUM5RCxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFcEUsaUVBQWlFO1lBQ2pFLElBQUksVUFBVSxLQUFLLENBQUM7Z0JBQUUsT0FBTyxVQUFVLENBQUM7U0FDekM7UUFFRCxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUVwRTs7V0FFRztRQUNILE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldHRlckZvclByb3AgfSBmcm9tICcuL2NvbHVtbi1wcm9wLWdldHRlcnMnO1xuaW1wb3J0IHsgU29ydFR5cGUgfSBmcm9tICcuLi90eXBlcy9zb3J0LnR5cGUnO1xuaW1wb3J0IHsgU29ydERpcmVjdGlvbiB9IGZyb20gJy4uL3R5cGVzL3NvcnQtZGlyZWN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgU29ydFByb3BEaXIgfSBmcm9tICcuLi90eXBlcy9zb3J0LXByb3AtZGlyLnR5cGUnO1xuLyoqXG4gKiBHZXRzIHRoZSBuZXh0IHNvcnQgZGlyZWN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXh0U29ydERpcihzb3J0VHlwZTogU29ydFR5cGUsIGN1cnJlbnQ6IFNvcnREaXJlY3Rpb24pOiBTb3J0RGlyZWN0aW9uIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHNvcnRUeXBlID09PSBTb3J0VHlwZS5zaW5nbGUpIHtcbiAgICBpZiAoY3VycmVudCA9PT0gU29ydERpcmVjdGlvbi5hc2MpIHtcbiAgICAgIHJldHVybiBTb3J0RGlyZWN0aW9uLmRlc2M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTb3J0RGlyZWN0aW9uLmFzYztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFjdXJyZW50KSB7XG4gICAgICByZXR1cm4gU29ydERpcmVjdGlvbi5hc2M7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50ID09PSBTb3J0RGlyZWN0aW9uLmFzYykge1xuICAgICAgcmV0dXJuIFNvcnREaXJlY3Rpb24uZGVzYztcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnQgPT09IFNvcnREaXJlY3Rpb24uZGVzYykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gYXZvaWQgVFM3MDMwOiBOb3QgYWxsIGNvZGUgcGF0aHMgcmV0dXJuIGEgdmFsdWUuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIEFkYXB0ZWQgZnJvbSBmdWVsZC11aSBvbiA2LzIxNlxuICogaHR0cHM6Ly9naXRodWIuY29tL0Z1ZWxJbnRlcmFjdGl2ZS9mdWVsLXVpL3RyZWUvbWFzdGVyL3NyYy9waXBlcy9PcmRlckJ5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcmRlckJ5Q29tcGFyYXRvcihhOiBhbnksIGI6IGFueSk6IG51bWJlciB7XG4gIGlmIChhID09PSBudWxsIHx8IHR5cGVvZiBhID09PSAndW5kZWZpbmVkJykgYSA9IDA7XG4gIGlmIChiID09PSBudWxsIHx8IHR5cGVvZiBiID09PSAndW5kZWZpbmVkJykgYiA9IDA7XG4gIGlmIChhIGluc3RhbmNlb2YgRGF0ZSAmJiBiIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIGlmIChhIDwgYikgcmV0dXJuIC0xO1xuICAgIGlmIChhID4gYikgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoaXNOYU4ocGFyc2VGbG9hdChhKSkgfHwgIWlzRmluaXRlKGEpIHx8IGlzTmFOKHBhcnNlRmxvYXQoYikpIHx8ICFpc0Zpbml0ZShiKSkge1xuICAgIC8vIENvbnZlcnQgdG8gc3RyaW5nIGluIGNhc2Ugb2YgYT0wIG9yIGI9MFxuICAgIGEgPSBTdHJpbmcoYSk7XG4gICAgYiA9IFN0cmluZyhiKTtcbiAgICAvLyBJc24ndCBhIG51bWJlciBzbyBsb3dlcmNhc2UgdGhlIHN0cmluZyB0byBwcm9wZXJseSBjb21wYXJlXG4gICAgaWYgKGEudG9Mb3dlckNhc2UoKSA8IGIudG9Mb3dlckNhc2UoKSkgcmV0dXJuIC0xO1xuICAgIGlmIChhLnRvTG93ZXJDYXNlKCkgPiBiLnRvTG93ZXJDYXNlKCkpIHJldHVybiAxO1xuICB9IGVsc2Uge1xuICAgIC8vIFBhcnNlIHN0cmluZ3MgYXMgbnVtYmVycyB0byBjb21wYXJlIHByb3Blcmx5XG4gICAgaWYgKHBhcnNlRmxvYXQoYSkgPCBwYXJzZUZsb2F0KGIpKSByZXR1cm4gLTE7XG4gICAgaWYgKHBhcnNlRmxvYXQoYSkgPiBwYXJzZUZsb2F0KGIpKSByZXR1cm4gMTtcbiAgfVxuXG4gIC8vIGVxdWFsIGVhY2ggb3RoZXJcbiAgcmV0dXJuIDA7XG59XG5cbi8qKlxuICogY3JlYXRlcyBhIHNoYWxsb3cgY29weSBvZiB0aGUgYHJvd3NgIGlucHV0IGFuZCByZXR1cm5zIHRoZSBzb3J0ZWQgY29weS4gdGhpcyBmdW5jdGlvblxuICogZG9lcyBub3Qgc29ydCB0aGUgYHJvd3NgIGFyZ3VtZW50IGluIHBsYWNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0Um93cyhyb3dzOiBhbnlbXSwgY29sdW1uczogYW55W10sIGRpcnM6IFNvcnRQcm9wRGlyW10pOiBhbnlbXSB7XG4gIGlmICghcm93cykgcmV0dXJuIFtdO1xuICBpZiAoIWRpcnMgfHwgIWRpcnMubGVuZ3RoIHx8ICFjb2x1bW5zKSByZXR1cm4gWy4uLnJvd3NdO1xuXG4gIC8qKlxuICAgKiByZWNvcmQgdGhlIHJvdyBvcmRlcmluZyBvZiByZXN1bHRzIGZyb20gcHJpb3Igc29ydCBvcGVyYXRpb25zIChpZiBhcHBsaWNhYmxlKVxuICAgKiB0aGlzIGlzIG5lY2Vzc2FyeSB0byBndWFyYW50ZWUgc3RhYmxlIHNvcnRpbmcgYmVoYXZpb3JcbiAgICovXG4gIGNvbnN0IHJvd1RvSW5kZXhNYXAgPSBuZXcgTWFwPGFueSwgbnVtYmVyPigpO1xuICByb3dzLmZvckVhY2goKHJvdywgaW5kZXgpID0+IHJvd1RvSW5kZXhNYXAuc2V0KHJvdywgaW5kZXgpKTtcblxuICBjb25zdCB0ZW1wID0gWy4uLnJvd3NdO1xuICBjb25zdCBjb2xzID0gY29sdW1ucy5yZWR1Y2UoKG9iaiwgY29sKSA9PiB7XG4gICAgaWYgKGNvbC5jb21wYXJhdG9yICYmIHR5cGVvZiBjb2wuY29tcGFyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb2JqW2NvbC5wcm9wXSA9IGNvbC5jb21wYXJhdG9yO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG5cbiAgLy8gY2FjaGUgdmFsdWVHZXR0ZXIgYW5kIGNvbXBhcmVGbiBzbyB0aGF0IHRoZXlcbiAgLy8gZG8gbm90IG5lZWQgdG8gYmUgbG9va2VkLXVwIGluIHRoZSBzb3J0IGZ1bmN0aW9uIGJvZHlcbiAgY29uc3QgY2FjaGVkRGlycyA9IGRpcnMubWFwKGRpciA9PiB7XG4gICAgY29uc3QgcHJvcCA9IGRpci5wcm9wO1xuICAgIHJldHVybiB7XG4gICAgICBwcm9wLFxuICAgICAgZGlyOiBkaXIuZGlyLFxuICAgICAgdmFsdWVHZXR0ZXI6IGdldHRlckZvclByb3AocHJvcCksXG4gICAgICBjb21wYXJlRm46IGNvbHNbcHJvcF0gfHwgb3JkZXJCeUNvbXBhcmF0b3JcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gdGVtcC5zb3J0KGZ1bmN0aW9uIChyb3dBOiBhbnksIHJvd0I6IGFueSkge1xuICAgIGZvciAoY29uc3QgY2FjaGVkRGlyIG9mIGNhY2hlZERpcnMpIHtcbiAgICAgIC8vIEdldCBwcm9wZXJ0eSBhbmQgdmFsdWVnZXR0ZXJzIGZvciBjb2x1bW4gdG8gYmUgc29ydGVkXG4gICAgICBjb25zdCB7IHByb3AsIHZhbHVlR2V0dGVyIH0gPSBjYWNoZWREaXI7XG4gICAgICAvLyBHZXQgQSBhbmQgQiBjZWxsIHZhbHVlcyBmcm9tIHJvd3MgYmFzZWQgb24gcHJvcGVydGllcyBvZiB0aGUgY29sdW1uc1xuICAgICAgY29uc3QgcHJvcEEgPSB2YWx1ZUdldHRlcihyb3dBLCBwcm9wKTtcbiAgICAgIGNvbnN0IHByb3BCID0gdmFsdWVHZXR0ZXIocm93QiwgcHJvcCk7XG5cbiAgICAgIC8vIENvbXBhcmUgZnVuY3Rpb24gZ2V0cyBmaXZlIHBhcmFtZXRlcnM6XG4gICAgICAvLyBUd28gY2VsbCB2YWx1ZXMgdG8gYmUgY29tcGFyZWQgYXMgcHJvcEEgYW5kIHByb3BCXG4gICAgICAvLyBUd28gcm93cyBjb3JyZXNwb25kaW5nIHRvIHRoZSBjZWxscyBhcyByb3dBIGFuZCByb3dCXG4gICAgICAvLyBEaXJlY3Rpb24gb2YgdGhlIHNvcnQgZm9yIHRoaXMgY29sdW1uIGFzIFNvcnREaXJlY3Rpb25cbiAgICAgIC8vIENvbXBhcmUgY2FuIGJlIGEgc3RhbmRhcmQgSlMgY29tcGFyaXNvbiBmdW5jdGlvbiAoYSxiKSA9PiAtMXwwfDFcbiAgICAgIC8vIGFzIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBhcmUgc2lsZW50bHkgaWdub3JlZC4gVGhlIHdob2xlIHJvdyBhbmQgc29ydFxuICAgICAgLy8gZGlyZWN0aW9uIGVuYWJsZSBtb3JlIGNvbXBsZXggc29ydCBsb2dpYy5cbiAgICAgIGNvbnN0IGNvbXBhcmlzb24gPVxuICAgICAgICBjYWNoZWREaXIuZGlyICE9PSBTb3J0RGlyZWN0aW9uLmRlc2NcbiAgICAgICAgICA/IGNhY2hlZERpci5jb21wYXJlRm4ocHJvcEEsIHByb3BCLCByb3dBLCByb3dCLCBjYWNoZWREaXIuZGlyKVxuICAgICAgICAgIDogLWNhY2hlZERpci5jb21wYXJlRm4ocHJvcEEsIHByb3BCLCByb3dBLCByb3dCLCBjYWNoZWREaXIuZGlyKTtcblxuICAgICAgLy8gRG9uJ3QgcmV0dXJuIDAgeWV0IGluIGNhc2Ugb2YgbmVlZGluZyB0byBzb3J0IGJ5IG5leHQgcHJvcGVydHlcbiAgICAgIGlmIChjb21wYXJpc29uICE9PSAwKSByZXR1cm4gY29tcGFyaXNvbjtcbiAgICB9XG5cbiAgICBpZiAoIShyb3dUb0luZGV4TWFwLmhhcyhyb3dBKSAmJiByb3dUb0luZGV4TWFwLmhhcyhyb3dCKSkpIHJldHVybiAwO1xuXG4gICAgLyoqXG4gICAgICogYWxsIGVsc2UgYmVpbmcgZXF1YWwsIHByZXNlcnZlIG9yaWdpbmFsIG9yZGVyIG9mIHRoZSByb3dzIChzdGFibGUgc29ydClcbiAgICAgKi9cbiAgICByZXR1cm4gcm93VG9JbmRleE1hcC5nZXQocm93QSkgPCByb3dUb0luZGV4TWFwLmdldChyb3dCKSA/IC0xIDogMTtcbiAgfSk7XG59XG4iXX0=