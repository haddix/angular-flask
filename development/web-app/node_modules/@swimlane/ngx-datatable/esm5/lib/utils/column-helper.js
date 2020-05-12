import { __values } from "tslib";
import { camelCase, deCamelCase } from './camel-case';
import { id } from './id';
import { getterForProp } from './column-prop-getters';
/**
 * Sets the column defaults
 */
export function setColumnDefaults(columns) {
    var e_1, _a;
    if (!columns)
        return;
    // Only one column should hold the tree view
    // Thus if multiple columns are provided with
    // isTreeColumn as true we take only the first one
    var treeColumnFound = false;
    try {
        for (var columns_1 = __values(columns), columns_1_1 = columns_1.next(); !columns_1_1.done; columns_1_1 = columns_1.next()) {
            var column = columns_1_1.value;
            if (!column.$$id) {
                column.$$id = id();
            }
            // prop can be numeric; zero is valid not a missing prop
            // translate name => prop
            if (isNullOrUndefined(column.prop) && column.name) {
                column.prop = camelCase(column.name);
            }
            if (!column.$$valueGetter) {
                column.$$valueGetter = getterForProp(column.prop);
            }
            // format props if no name passed
            if (!isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
                column.name = deCamelCase(String(column.prop));
            }
            if (isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
                column.name = ''; // Fixes IE and Edge displaying `null`
            }
            if (!column.hasOwnProperty('resizeable')) {
                column.resizeable = true;
            }
            if (!column.hasOwnProperty('sortable')) {
                column.sortable = true;
            }
            if (!column.hasOwnProperty('draggable')) {
                column.draggable = true;
            }
            if (!column.hasOwnProperty('canAutoResize')) {
                column.canAutoResize = true;
            }
            if (!column.hasOwnProperty('width')) {
                column.width = 150;
            }
            if (!column.hasOwnProperty('isTreeColumn')) {
                column.isTreeColumn = false;
            }
            else {
                if (column.isTreeColumn && !treeColumnFound) {
                    // If the first column with isTreeColumn is true found
                    // we mark that treeCoulmn is found
                    treeColumnFound = true;
                }
                else {
                    // After that isTreeColumn property for any other column
                    // will be set as false
                    column.isTreeColumn = false;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (columns_1_1 && !columns_1_1.done && (_a = columns_1.return)) _a.call(columns_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
/**
 * Translates templates definitions to objects
 */
export function translateTemplates(templates) {
    var e_2, _a, e_3, _b;
    var result = [];
    try {
        for (var templates_1 = __values(templates), templates_1_1 = templates_1.next(); !templates_1_1.done; templates_1_1 = templates_1.next()) {
            var temp = templates_1_1.value;
            var col = {};
            var props = Object.getOwnPropertyNames(temp);
            try {
                for (var props_1 = (e_3 = void 0, __values(props)), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
                    var prop = props_1_1.value;
                    col[prop] = temp[prop];
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (props_1_1 && !props_1_1.done && (_b = props_1.return)) _b.call(props_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (temp.headerTemplate) {
                col.headerTemplate = temp.headerTemplate;
            }
            if (temp.cellTemplate) {
                col.cellTemplate = temp.cellTemplate;
            }
            if (temp.summaryFunc) {
                col.summaryFunc = temp.summaryFunc;
            }
            if (temp.summaryTemplate) {
                col.summaryTemplate = temp.summaryTemplate;
            }
            result.push(col);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (templates_1_1 && !templates_1_1.done && (_a = templates_1.return)) _a.call(templates_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2NvbHVtbi1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBSXREOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUFDLE9BQXNCOztJQUN0RCxJQUFJLENBQUMsT0FBTztRQUFFLE9BQU87SUFFckIsNENBQTRDO0lBQzVDLDZDQUE2QztJQUM3QyxrREFBa0Q7SUFDbEQsSUFBSSxlQUFlLEdBQVksS0FBSyxDQUFDOztRQUVyQyxLQUFxQixJQUFBLFlBQUEsU0FBQSxPQUFPLENBQUEsZ0NBQUEscURBQUU7WUFBekIsSUFBTSxNQUFNLG9CQUFBO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUM7YUFDcEI7WUFFRCx3REFBd0Q7WUFDeEQseUJBQXlCO1lBQ3pCLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pELE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QztZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUN6QixNQUFNLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbkQ7WUFFRCxpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJ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LGVBQWUsRUFBRTtnQkFDeEIsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO2FBQzVDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQjs7Ozs7Ozs7O0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNhbWVsQ2FzZSwgZGVDYW1lbENhc2UgfSBmcm9tICcuL2NhbWVsLWNhc2UnO1xuaW1wb3J0IHsgaWQgfSBmcm9tICcuL2lkJztcbmltcG9ydCB7IGdldHRlckZvclByb3AgfSBmcm9tICcuL2NvbHVtbi1wcm9wLWdldHRlcnMnO1xuaW1wb3J0IHsgVGFibGVDb2x1bW4gfSBmcm9tICcuLi90eXBlcy90YWJsZS1jb2x1bW4udHlwZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmUgfSBmcm9tICcuLi9jb21wb25lbnRzL2NvbHVtbnMvY29sdW1uLmRpcmVjdGl2ZSc7XG5cbi8qKlxuICogU2V0cyB0aGUgY29sdW1uIGRlZmF1bHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb2x1bW5EZWZhdWx0cyhjb2x1bW5zOiBUYWJsZUNvbHVtbltdKSB7XG4gIGlmICghY29sdW1ucykgcmV0dXJuO1xuXG4gIC8vIE9ubHkgb25lIGNvbHVtbiBzaG91bGQgaG9sZCB0aGUgdHJlZSB2aWV3XG4gIC8vIFRodXMgaWYgbXVsdGlwbGUgY29sdW1ucyBhcmUgcHJvdmlkZWQgd2l0aFxuICAvLyBpc1RyZWVDb2x1bW4gYXMgdHJ1ZSB3ZSB0YWtlIG9ubHkgdGhlIGZpcnN0IG9uZVxuICBsZXQgdHJlZUNvbHVtbkZvdW5kOiBib29sZWFuID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBjb2x1bW4gb2YgY29sdW1ucykge1xuICAgIGlmICghY29sdW1uLiQkaWQpIHtcbiAgICAgIGNvbHVtbi4kJGlkID0gaWQoKTtcbiAgICB9XG5cbiAgICAvLyBwcm9wIGNhbiBiZSBudW1lcmljOyB6ZXJvIGlzIHZhbGlkIG5vdCBhIG1pc3NpbmcgcHJvcFxuICAgIC8vIHRyYW5zbGF0ZSBuYW1lID0+IHByb3BcbiAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQoY29sdW1uLnByb3ApICYmIGNvbHVtbi5uYW1lKSB7XG4gICAgICBjb2x1bW4ucHJvcCA9IGNhbWVsQ2FzZShjb2x1bW4ubmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKCFjb2x1bW4uJCR2YWx1ZUdldHRlcikge1xuICAgICAgY29sdW1uLiQkdmFsdWVHZXR0ZXIgPSBnZXR0ZXJGb3JQcm9wKGNvbHVtbi5wcm9wKTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgcHJvcHMgaWYgbm8gbmFtZSBwYXNzZWRcbiAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKGNvbHVtbi5wcm9wKSAmJiBpc051bGxPclVuZGVmaW5lZChjb2x1bW4ubmFtZSkpIHtcbiAgICAgIGNvbHVtbi5uYW1lID0gZGVDYW1lbENhc2UoU3RyaW5nKGNvbHVtbi5wcm9wKSk7XG4gICAgfVxuXG4gICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKGNvbHVtbi5wcm9wKSAmJiBpc051bGxPclVuZGVmaW5lZChjb2x1bW4ubmFtZSkpIHtcbiAgICAgIGNvbHVtbi5uYW1lID0gJyc7IC8vIEZpeGVzIElFIGFuZCBFZGdlIGRpc3BsYXlpbmcgYG51bGxgXG4gICAgfVxuXG4gICAgaWYgKCFjb2x1bW4uaGFzT3duUHJvcGVydHkoJ3Jlc2l6ZWFibGUnKSkge1xuICAgICAgY29sdW1uLnJlc2l6ZWFibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghY29sdW1uLmhhc093blByb3BlcnR5KCdzb3J0YWJsZScpKSB7XG4gICAgICBjb2x1bW4uc29ydGFibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghY29sdW1uLmhhc093blByb3BlcnR5KCdkcmFnZ2FibGUnKSkge1xuICAgICAgY29sdW1uLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFjb2x1bW4uaGFzT3duUHJvcGVydHkoJ2NhbkF1dG9SZXNpemUnKSkge1xuICAgICAgY29sdW1uLmNhbkF1dG9SZXNpemUgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghY29sdW1uLmhhc093blByb3BlcnR5KCd3aWR0aCcpKSB7XG4gICAgICBjb2x1bW4ud2lkdGggPSAxNTA7XG4gICAgfVxuXG4gICAgaWYgKCFjb2x1bW4uaGFzT3duUHJvcGVydHkoJ2lzVHJlZUNvbHVtbicpKSB7XG4gICAgICBjb2x1bW4uaXNUcmVlQ29sdW1uID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjb2x1bW4uaXNUcmVlQ29sdW1uICYmICF0cmVlQ29sdW1uRm91bmQpIHtcbiAgICAgICAgLy8gSWYgdGhlIGZpcnN0IGNvbHVtbiB3aXRoIGlzVHJlZUNvbHVtbiBpcyB0cnVlIGZvdW5kXG4gICAgICAgIC8vIHdlIG1hcmsgdGhhdCB0cmVlQ291bG1uIGlzIGZvdW5kXG4gICAgICAgIHRyZWVDb2x1bW5Gb3VuZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBZnRlciB0aGF0IGlzVHJlZUNvbHVtbiBwcm9wZXJ0eSBmb3IgYW55IG90aGVyIGNvbHVtblxuICAgICAgICAvLyB3aWxsIGJlIHNldCBhcyBmYWxzZVxuICAgICAgICBjb2x1bW4uaXNUcmVlQ29sdW1uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZDxUPih2YWx1ZTogVCB8IG51bGwgfCB1bmRlZmluZWQpOiB2YWx1ZSBpcyBudWxsIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlcyB0ZW1wbGF0ZXMgZGVmaW5pdGlvbnMgdG8gb2JqZWN0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlVGVtcGxhdGVzKHRlbXBsYXRlczogRGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlW10pOiBhbnlbXSB7XG4gIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcbiAgZm9yIChjb25zdCB0ZW1wIG9mIHRlbXBsYXRlcykge1xuICAgIGNvbnN0IGNvbDogYW55ID0ge307XG5cbiAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlbXApO1xuICAgIGZvciAoY29uc3QgcHJvcCBvZiBwcm9wcykge1xuICAgICAgY29sW3Byb3BdID0gdGVtcFtwcm9wXTtcbiAgICB9XG5cbiAgICBpZiAodGVtcC5oZWFkZXJUZW1wbGF0ZSkge1xuICAgICAgY29sLmhlYWRlclRlbXBsYXRlID0gdGVtcC5oZWFkZXJUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBpZiAodGVtcC5jZWxsVGVtcGxhdGUpIHtcbiAgICAgIGNvbC5jZWxsVGVtcGxhdGUgPSB0ZW1wLmNlbGxUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBpZiAodGVtcC5zdW1tYXJ5RnVuYykge1xuICAgICAgY29sLnN1bW1hcnlGdW5jID0gdGVtcC5zdW1tYXJ5RnVuYztcbiAgICB9XG5cbiAgICBpZiAodGVtcC5zdW1tYXJ5VGVtcGxhdGUpIHtcbiAgICAgIGNvbC5zdW1tYXJ5VGVtcGxhdGUgPSB0ZW1wLnN1bW1hcnlUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICByZXN1bHQucHVzaChjb2wpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==