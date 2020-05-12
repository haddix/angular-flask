import { __read, __spread } from "tslib";
import { getterForProp } from './column-prop-getters';
export function optionalGetterForProp(prop) {
    return prop && (function (row) { return getterForProp(prop)(row, prop); });
}
/**
 * This functions rearrange items by their parents
 * Also sets the level value to each of the items
 *
 * Note: Expecting each item has a property called parentId
 * Note: This algorithm will fail if a list has two or more items with same ID
 * NOTE: This algorithm will fail if there is a deadlock of relationship
 *
 * For example,
 *
 * Input
 *
 * id -> parent
 * 1  -> 0
 * 2  -> 0
 * 3  -> 1
 * 4  -> 1
 * 5  -> 2
 * 7  -> 8
 * 6  -> 3
 *
 *
 * Output
 * id -> level
 * 1      -> 0
 * --3    -> 1
 * ----6  -> 2
 * --4    -> 1
 * 2      -> 0
 * --5    -> 1
 * 7     -> 8
 *
 *
 * @param rows
 *
 */
export function groupRowsByParents(rows, from, to) {
    if (from && to) {
        var nodeById = {};
        var l = rows.length;
        var node = null;
        nodeById[0] = new TreeNode(); // that's the root node
        var uniqIDs = rows.reduce(function (arr, item) {
            var toValue = to(item);
            if (arr.indexOf(toValue) === -1) {
                arr.push(toValue);
            }
            return arr;
        }, []);
        for (var i = 0; i < l; i++) {
            // make TreeNode objects for each item
            nodeById[to(rows[i])] = new TreeNode(rows[i]);
        }
        for (var i = 0; i < l; i++) {
            // link all TreeNode objects
            node = nodeById[to(rows[i])];
            var parent_1 = 0;
            var fromValue = from(node.row);
            if (!!fromValue && uniqIDs.indexOf(fromValue) > -1) {
                parent_1 = fromValue;
            }
            node.parent = nodeById[parent_1];
            node.row['level'] = node.parent.row['level'] + 1;
            node.parent.children.push(node);
        }
        var resolvedRows_1 = [];
        nodeById[0].flatten(function () {
            resolvedRows_1 = __spread(resolvedRows_1, [this.row]);
        }, true);
        return resolvedRows_1;
    }
    else {
        return rows;
    }
}
var TreeNode = /** @class */ (function () {
    function TreeNode(row) {
        if (row === void 0) { row = null; }
        if (!row) {
            row = {
                level: -1,
                treeStatus: 'expanded'
            };
        }
        this.row = row;
        this.parent = null;
        this.children = [];
    }
    TreeNode.prototype.flatten = function (f, recursive) {
        if (this.row['treeStatus'] === 'expanded') {
            for (var i = 0, l = this.children.length; i < l; i++) {
                var child = this.children[i];
                f.apply(child, Array.prototype.slice.call(arguments, 2));
                if (recursive)
                    child.flatten.apply(child, arguments);
            }
        }
    };
    return TreeNode;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUl0RCxNQUFNLFVBQVUscUJBQXFCLENBQUMsSUFBcUI7SUFDekQsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUNHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLElBQVcsRUFBRSxJQUEwQixFQUFFLEVBQXdCO0lBQ2xHLElBQUksSUFBSSxJQUFJLEVBQUUsRUFBRTtRQUNkLElBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFvQixJQUFJLENBQUM7UUFFakMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7UUFFckQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxJQUFJO1lBQ3BDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbkI7WUFDRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLEtB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cm9wLWdldHRlcnMnO1xuaW1wb3J0IHsgVGFibGVDb2x1bW5Qcm9wIH0gZnJvbSAnLi4vdHlwZXMvdGFibGUtY29sdW1uLnR5cGUnO1xuXG5leHBvcnQgdHlwZSBPcHRpb25hbFZhbHVlR2V0dGVyID0gKHJvdzogYW55KSA9PiBhbnkgfCB1bmRlZmluZWQ7XG5leHBvcnQgZnVuY3Rpb24gb3B0aW9uYWxHZXR0ZXJGb3JQcm9wKHByb3A6IFRhYmxlQ29sdW1uUHJvcCk6IE9wdGlvbmFsVmFsdWVHZXR0ZXIge1xuICByZXR1cm4gcHJvcCAmJiAocm93ID0+IGdldHRlckZvclByb3AocHJvcCkocm93LCBwcm9wKSk7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbnMgcmVhcnJhbmdlIGl0ZW1zIGJ5IHRoZWlyIHBhcmVudHNcbiAqIEFsc28gc2V0cyB0aGUgbGV2ZWwgdmFsdWUgdG8gZWFjaCBvZiB0aGUgaXRlbXNcbiAqXG4gKiBOb3RlOiBFeHBlY3RpbmcgZWFjaCBpdGVtIGhhcyBhIHByb3BlcnR5IGNhbGxlZCBwYXJlbnRJZFxuICogTm90ZTogVGhpcyBhbGdvcml0aG0gd2lsbCBmYWlsIGlmIGEgbGlzdCBoYXMgdHdvIG9yIG1vcmUgaXRlbXMgd2l0aCBzYW1lIElEXG4gKiBOT1RFOiBUaGlzIGFsZ29yaXRobSB3aWxsIGZhaWwgaWYgdGhlcmUgaXMgYSBkZWFkbG9jayBvZiByZWxhdGlvbnNoaXBcbiAqXG4gKiBGb3IgZXhhbXBsZSxcbiAqXG4gKiBJbnB1dFxuICpcbiAqIGlkIC0+IHBhcmVudFxuICogMSAgLT4gMFxuICogMiAgLT4gMFxuICogMyAgLT4gMVxuICogNCAgLT4gMVxuICogNSAgLT4gMlxuICogNyAgLT4gOFxuICogNiAgLT4gM1xuICpcbiAqXG4gKiBPdXRwdXRcbiAqIGlkIC0+IGxldmVsXG4gKiAxICAgICAgLT4gMFxuICogLS0zICAgIC0+IDFcbiAqIC0tLS02ICAtPiAyXG4gKiAtLTQgICAgLT4gMVxuICogMiAgICAgIC0+IDBcbiAqIC0tNSAgICAtPiAxXG4gKiA3ICAgICAtPiA4XG4gKlxuICpcbiAqIEBwYXJhbSByb3dzXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBSb3dzQnlQYXJlbnRzKHJvd3M6IGFueVtdLCBmcm9tPzogT3B0aW9uYWxWYWx1ZUdldHRlciwgdG8/OiBPcHRpb25hbFZhbHVlR2V0dGVyKTogYW55W10ge1xuICBpZiAoZnJvbSAmJiB0bykge1xuICAgIGNvbnN0IG5vZGVCeUlkID0ge307XG4gICAgY29uc3QgbCA9IHJvd3MubGVuZ3RoO1xuICAgIGxldCBub2RlOiBUcmVlTm9kZSB8IG51bGwgPSBudWxsO1xuXG4gICAgbm9kZUJ5SWRbMF0gPSBuZXcgVHJlZU5vZGUoKTsgLy8gdGhhdCdzIHRoZSByb290IG5vZGVcblxuICAgIGNvbnN0IHVuaXFJRHMgPSByb3dzLnJlZHVjZSgoYXJyLCBpdGVtKSA9PiB7XG4gICAgICBjb25zdCB0b1ZhbHVlID0gdG8oaXRlbSk7XG4gICAgICBpZiAoYXJyLmluZGV4T2YodG9WYWx1ZSkgPT09IC0xKSB7XG4gICAgICAgIGFyci5wdXNoKHRvVmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFycjtcbiAgICB9LCBbXSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgLy8gbWFrZSBUcmVlTm9kZSBvYmplY3RzIGZvciBlYWNoIGl0ZW1cbiAgICAgIG5vZGVCeUlkW3RvKHJvd3NbaV0pXSA9IG5ldyBUcmVlTm9kZShyb3dzW2ldKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgLy8gbGluayBhbGwgVHJlZU5vZGUgb2JqZWN0c1xuICAgICAgbm9kZSA9IG5vZGVCeUlkW3RvKHJvd3NbaV0pXTtcbiAgICAgIGxldCBwYXJlbnQgPSAwO1xuICAgICAgY29uc3QgZnJvbVZhbHVlID0gZnJvbShub2RlLnJvdyk7XG4gICAgICBpZiAoISFmcm9tVmFsdWUgJiYgdW5pcUlEcy5pbmRleE9mKGZyb21WYWx1ZSkgPiAtMSkge1xuICAgICAgICBwYXJlbnQgPSBmcm9tVmFsdWU7XG4gICAgICB9XG4gICAgICBub2RlLnBhcmVudCA9IG5vZGVCeUlkW3BhcmVudF07XG4gICAgICBub2RlLnJvd1snbGV2ZWwnXSA9IG5vZGUucGFyZW50LnJvd1snbGV2ZWwnXSArIDE7XG4gICAgICBub2RlLnBhcmVudC5jaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgIH1cblxuICAgIGxldCByZXNvbHZlZFJvd3M6IGFueVtdID0gW107XG4gICAgbm9kZUJ5SWRbMF0uZmxhdHRlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXNvbHZlZFJvd3MgPSBbLi4ucmVzb2x2ZWRSb3dzLCB0aGlzLnJvd107XG4gICAgfSwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gcmVzb2x2ZWRSb3dzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByb3dzO1xuICB9XG59XG5cbmNsYXNzIFRyZWVOb2RlIHtcbiAgcHVibGljIHJvdzogYW55O1xuICBwdWJsaWMgcGFyZW50OiBhbnk7XG4gIHB1YmxpYyBjaGlsZHJlbjogYW55W107XG5cbiAgY29uc3RydWN0b3Iocm93OiBhbnkgfCBudWxsID0gbnVsbCkge1xuICAgIGlmICghcm93KSB7XG4gICAgICByb3cgPSB7XG4gICAgICAgIGxldmVsOiAtMSxcbiAgICAgICAgdHJlZVN0YXR1czogJ2V4cGFuZGVkJ1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIGZsYXR0ZW4oZjogYW55LCByZWN1cnNpdmU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5yb3dbJ3RyZWVTdGF0dXMnXSA9PT0gJ2V4cGFuZGVkJykge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgIGYuYXBwbHkoY2hpbGQsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpO1xuICAgICAgICBpZiAocmVjdXJzaXZlKSBjaGlsZC5mbGF0dGVuLmFwcGx5KGNoaWxkLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19