import { camelCase, deCamelCase } from './camel-case';
import { id } from './id';
import { getterForProp } from './column-prop-getters';
/**
 * Sets the column defaults
 */
export function setColumnDefaults(columns) {
    if (!columns)
        return;
    // Only one column should hold the tree view
    // Thus if multiple columns are provided with
    // isTreeColumn as true we take only the first one
    let treeColumnFound = false;
    for (const column of columns) {
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
export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
/**
 * Translates templates definitions to objects
 */
export function translateTemplates(templates) {
    const result = [];
    for (const temp of templates) {
        const col = {};
        const props = Object.getOwnPropertyNames(temp);
        for (const prop of props) {
            col[prop] = temp[prop];
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
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2NvbHVtbi1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEQsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFJdEQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsT0FBc0I7SUFDdEQsSUFBSSxDQUFDLE9BQU87UUFBRSxPQUFPO0lBRXJCLDRDQUE0QztJQUM1Qyw2Q0FBNkM7SUFDN0Msa0RBQWtEO0lBQ2xELElBQUksZUFBZSxHQUFZLEtBQUssQ0FBQztJQUVyQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtZQUNoQixNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDO1NBQ3BCO1FBRUQsd0RBQXdEO1FBQ3hELHlCQUF5QjtRQUN6QixJQUFJLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2pELE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QztRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUVELGlDQUFpQztRQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJ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dGVudCI6WyJpbXBvcnQgeyBjYW1lbENhc2UsIGRlQ2FtZWxDYXNlIH0gZnJvbSAnLi9jYW1lbC1jYXNlJztcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi9pZCc7XG5pbXBvcnQgeyBnZXR0ZXJGb3JQcm9wIH0gZnJvbSAnLi9jb2x1bW4tcHJvcC1nZXR0ZXJzJztcbmltcG9ydCB7IFRhYmxlQ29sdW1uIH0gZnJvbSAnLi4vdHlwZXMvdGFibGUtY29sdW1uLnR5cGUnO1xuaW1wb3J0IHsgRGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb2x1bW5zL2NvbHVtbi5kaXJlY3RpdmUnO1xuXG4vKipcbiAqIFNldHMgdGhlIGNvbHVtbiBkZWZhdWx0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29sdW1uRGVmYXVsdHMoY29sdW1uczogVGFibGVDb2x1bW5bXSkge1xuICBpZiAoIWNvbHVtbnMpIHJldHVybjtcblxuICAvLyBPbmx5IG9uZSBjb2x1bW4gc2hvdWxkIGhvbGQgdGhlIHRyZWUgdmlld1xuICAvLyBUaHVzIGlmIG11bHRpcGxlIGNvbHVtbnMgYXJlIHByb3ZpZGVkIHdpdGhcbiAgLy8gaXNUcmVlQ29sdW1uIGFzIHRydWUgd2UgdGFrZSBvbmx5IHRoZSBmaXJzdCBvbmVcbiAgbGV0IHRyZWVDb2x1bW5Gb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGZvciAoY29uc3QgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICBpZiAoIWNvbHVtbi4kJGlkKSB7XG4gICAgICBjb2x1bW4uJCRpZCA9IGlkKCk7XG4gICAgfVxuXG4gICAgLy8gcHJvcCBjYW4gYmUgbnVtZXJpYzsgemVybyBpcyB2YWxpZCBub3QgYSBtaXNzaW5nIHByb3BcbiAgICAvLyB0cmFuc2xhdGUgbmFtZSA9PiBwcm9wXG4gICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKGNvbHVtbi5wcm9wKSAmJiBjb2x1bW4ubmFtZSkge1xuICAgICAgY29sdW1uLnByb3AgPSBjYW1lbENhc2UoY29sdW1uLm5hbWUpO1xuICAgIH1cblxuICAgIGlmICghY29sdW1uLiQkdmFsdWVHZXR0ZXIpIHtcbiAgICAgIGNvbHVtbi4kJHZhbHVlR2V0dGVyID0gZ2V0dGVyRm9yUHJvcChjb2x1bW4ucHJvcCk7XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IHByb3BzIGlmIG5vIG5hbWUgcGFzc2VkXG4gICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChjb2x1bW4ucHJvcCkgJiYgaXNOdWxsT3JVbmRlZmluZWQoY29sdW1uLm5hbWUpKSB7XG4gICAgICBjb2x1bW4ubmFtZSA9IGRlQ2FtZWxDYXNlKFN0cmluZyhjb2x1bW4ucHJvcCkpO1xuICAgIH1cblxuICAgIGlmIChpc051bGxPclVuZGVmaW5lZChjb2x1bW4ucHJvcCkgJiYgaXNOdWxsT3JVbmRlZmluZWQoY29sdW1uLm5hbWUpKSB7XG4gICAgICBjb2x1bW4ubmFtZSA9ICcnOyAvLyBGaXhlcyBJRSBhbmQgRWRnZSBkaXNwbGF5aW5nIGBudWxsYFxuICAgIH1cblxuICAgIGlmICghY29sdW1uLmhhc093blByb3BlcnR5KCdyZXNpemVhYmxlJykpIHtcbiAgICAgIGNvbHVtbi5yZXNpemVhYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbHVtbi5oYXNPd25Qcm9wZXJ0eSgnc29ydGFibGUnKSkge1xuICAgICAgY29sdW1uLnNvcnRhYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbHVtbi5oYXNPd25Qcm9wZXJ0eSgnZHJhZ2dhYmxlJykpIHtcbiAgICAgIGNvbHVtbi5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghY29sdW1uLmhhc093blByb3BlcnR5KCdjYW5BdXRvUmVzaXplJykpIHtcbiAgICAgIGNvbHVtbi5jYW5BdXRvUmVzaXplID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbHVtbi5oYXNPd25Qcm9wZXJ0eSgnd2lkdGgnKSkge1xuICAgICAgY29sdW1uLndpZHRoID0gMTUwO1xuICAgIH1cblxuICAgIGlmICghY29sdW1uLmhhc093blByb3BlcnR5KCdpc1RyZWVDb2x1bW4nKSkge1xuICAgICAgY29sdW1uLmlzVHJlZUNvbHVtbiA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29sdW1uLmlzVHJlZUNvbHVtbiAmJiAhdHJlZUNvbHVtbkZvdW5kKSB7XG4gICAgICAgIC8vIElmIHRoZSBmaXJzdCBjb2x1bW4gd2l0aCBpc1RyZWVDb2x1bW4gaXMgdHJ1ZSBmb3VuZFxuICAgICAgICAvLyB3ZSBtYXJrIHRoYXQgdHJlZUNvdWxtbiBpcyBmb3VuZFxuICAgICAgICB0cmVlQ29sdW1uRm91bmQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQWZ0ZXIgdGhhdCBpc1RyZWVDb2x1bW4gcHJvcGVydHkgZm9yIGFueSBvdGhlciBjb2x1bW5cbiAgICAgICAgLy8gd2lsbCBiZSBzZXQgYXMgZmFsc2VcbiAgICAgICAgY29sdW1uLmlzVHJlZUNvbHVtbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQ8VD4odmFsdWU6IFQgfCBudWxsIHwgdW5kZWZpbmVkKTogdmFsdWUgaXMgbnVsbCB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZXMgdGVtcGxhdGVzIGRlZmluaXRpb25zIHRvIG9iamVjdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZVRlbXBsYXRlcyh0ZW1wbGF0ZXM6IERhdGFUYWJsZUNvbHVtbkRpcmVjdGl2ZVtdKTogYW55W10ge1xuICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG4gIGZvciAoY29uc3QgdGVtcCBvZiB0ZW1wbGF0ZXMpIHtcbiAgICBjb25zdCBjb2w6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZW1wKTtcbiAgICBmb3IgKGNvbnN0IHByb3Agb2YgcHJvcHMpIHtcbiAgICAgIGNvbFtwcm9wXSA9IHRlbXBbcHJvcF07XG4gICAgfVxuXG4gICAgaWYgKHRlbXAuaGVhZGVyVGVtcGxhdGUpIHtcbiAgICAgIGNvbC5oZWFkZXJUZW1wbGF0ZSA9IHRlbXAuaGVhZGVyVGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaWYgKHRlbXAuY2VsbFRlbXBsYXRlKSB7XG4gICAgICBjb2wuY2VsbFRlbXBsYXRlID0gdGVtcC5jZWxsVGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaWYgKHRlbXAuc3VtbWFyeUZ1bmMpIHtcbiAgICAgIGNvbC5zdW1tYXJ5RnVuYyA9IHRlbXAuc3VtbWFyeUZ1bmM7XG4gICAgfVxuXG4gICAgaWYgKHRlbXAuc3VtbWFyeVRlbXBsYXRlKSB7XG4gICAgICBjb2wuc3VtbWFyeVRlbXBsYXRlID0gdGVtcC5zdW1tYXJ5VGVtcGxhdGU7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2goY29sKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=