/**
 * Always returns the empty string ''
 */
export function emptyStringGetter() {
    return '';
}
/**
 * Returns the appropriate getter function for this kind of prop.
 * If prop == null, returns the emptyStringGetter.
 */
export function getterForProp(prop) {
    if (prop == null) {
        return emptyStringGetter;
    }
    if (typeof prop === 'number') {
        return numericIndexGetter;
    }
    else {
        // deep or simple
        if (prop.indexOf('.') !== -1) {
            return deepValueGetter;
        }
        else {
            return shallowValueGetter;
        }
    }
}
/**
 * Returns the value at this numeric index.
 * @param row array of values
 * @param index numeric index
 * @returns any or '' if invalid index
 */
export function numericIndexGetter(row, index) {
    if (row == null) {
        return '';
    }
    // mimic behavior of deepValueGetter
    if (!row || index == null) {
        return row;
    }
    var value = row[index];
    if (value == null) {
        return '';
    }
    return value;
}
/**
 * Returns the value of a field.
 * (more efficient than deepValueGetter)
 * @param obj object containing the field
 * @param fieldName field name string
 */
export function shallowValueGetter(obj, fieldName) {
    if (obj == null) {
        return '';
    }
    if (!obj || !fieldName) {
        return obj;
    }
    var value = obj[fieldName];
    if (value == null) {
        return '';
    }
    return value;
}
/**
 * Returns a deep object given a string. zoo['animal.type']
 */
export function deepValueGetter(obj, path) {
    if (obj == null) {
        return '';
    }
    if (!obj || !path) {
        return obj;
    }
    // check if path matches a root-level field
    // { "a.b.c": 123 }
    var current = obj[path];
    if (current !== undefined) {
        return current;
    }
    current = obj;
    var split = path.split('.');
    if (split.length) {
        for (var i = 0; i < split.length; i++) {
            current = current[split[i]];
            // if found undefined, return empty string
            if (current === undefined || current === null) {
                return '';
            }
        }
    }
    return current;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXByb3AtZ2V0dGVycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2NvbHVtbi1wcm9wLWdldHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCO0lBQy9CLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsSUFBcUI7SUFDakQsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2hCLE9BQU8saUJBQWlCLENBQUM7S0FDMUI7SUFFRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM1QixPQUFPLGtCQUFrQixDQUFDO0tBQzNCO1NBQU07UUFDTCxpQkFBaUI7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sZUFBZSxDQUFDO1NBQ3hCO2FBQU07WUFDTCxPQUFPLGtCQUFrQixDQUFDO1NBQzNCO0tBQ0Y7QUFDSCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsR0FBVSxFQUFFLEtBQWE7SUFDMUQsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ2YsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELG9DQUFvQztJQUNwQyxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDekIsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVELElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLEdBQVEsRUFBRSxTQUFpQjtJQUM1RCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDZixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUN0QixPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtRQUNqQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsZUFBZSxDQUFDLEdBQVEsRUFBRSxJQUFZO0lBQ3BELElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtRQUNmLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2pCLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRCwyQ0FBMkM7SUFDM0MsbUJBQW1CO0lBQ25CLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7UUFDekIsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFFRCxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ2QsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU5QixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1QiwwQ0FBMEM7WUFDMUMsSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQzdDLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRjtLQUNGO0lBRUQsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRhYmxlQ29sdW1uUHJvcCB9IGZyb20gJy4uL3R5cGVzL3RhYmxlLWNvbHVtbi50eXBlJztcblxuLy8gbWF5YmUgcmVuYW1lIHRoaXMgZmlsZSB0byBwcm9wLWdldHRlcnMudHNcblxuZXhwb3J0IHR5cGUgVmFsdWVHZXR0ZXIgPSAob2JqOiBhbnksIHByb3A6IFRhYmxlQ29sdW1uUHJvcCkgPT4gYW55O1xuXG4vKipcbiAqIEFsd2F5cyByZXR1cm5zIHRoZSBlbXB0eSBzdHJpbmcgJydcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5U3RyaW5nR2V0dGVyKCk6IHN0cmluZyB7XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIHRoaXMga2luZCBvZiBwcm9wLlxuICogSWYgcHJvcCA9PSBudWxsLCByZXR1cm5zIHRoZSBlbXB0eVN0cmluZ0dldHRlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldHRlckZvclByb3AocHJvcDogVGFibGVDb2x1bW5Qcm9wKTogVmFsdWVHZXR0ZXIge1xuICBpZiAocHJvcCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVtcHR5U3RyaW5nR2V0dGVyO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBwcm9wID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBudW1lcmljSW5kZXhHZXR0ZXI7XG4gIH0gZWxzZSB7XG4gICAgLy8gZGVlcCBvciBzaW1wbGVcbiAgICBpZiAocHJvcC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gZGVlcFZhbHVlR2V0dGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2hhbGxvd1ZhbHVlR2V0dGVyO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHZhbHVlIGF0IHRoaXMgbnVtZXJpYyBpbmRleC5cbiAqIEBwYXJhbSByb3cgYXJyYXkgb2YgdmFsdWVzXG4gKiBAcGFyYW0gaW5kZXggbnVtZXJpYyBpbmRleFxuICogQHJldHVybnMgYW55IG9yICcnIGlmIGludmFsaWQgaW5kZXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG51bWVyaWNJbmRleEdldHRlcihyb3c6IGFueVtdLCBpbmRleDogbnVtYmVyKTogYW55IHtcbiAgaWYgKHJvdyA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIC8vIG1pbWljIGJlaGF2aW9yIG9mIGRlZXBWYWx1ZUdldHRlclxuICBpZiAoIXJvdyB8fCBpbmRleCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHJvdztcbiAgfVxuXG4gIGNvbnN0IHZhbHVlID0gcm93W2luZGV4XTtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgZmllbGQuXG4gKiAobW9yZSBlZmZpY2llbnQgdGhhbiBkZWVwVmFsdWVHZXR0ZXIpXG4gKiBAcGFyYW0gb2JqIG9iamVjdCBjb250YWluaW5nIHRoZSBmaWVsZFxuICogQHBhcmFtIGZpZWxkTmFtZSBmaWVsZCBuYW1lIHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2hhbGxvd1ZhbHVlR2V0dGVyKG9iajogYW55LCBmaWVsZE5hbWU6IHN0cmluZyk6IGFueSB7XG4gIGlmIChvYmogPT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAoIW9iaiB8fCAhZmllbGROYW1lKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGNvbnN0IHZhbHVlID0gb2JqW2ZpZWxkTmFtZV07XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZGVlcCBvYmplY3QgZ2l2ZW4gYSBzdHJpbmcuIHpvb1snYW5pbWFsLnR5cGUnXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcFZhbHVlR2V0dGVyKG9iajogYW55LCBwYXRoOiBzdHJpbmcpOiBhbnkge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKCFvYmogfHwgIXBhdGgpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgLy8gY2hlY2sgaWYgcGF0aCBtYXRjaGVzIGEgcm9vdC1sZXZlbCBmaWVsZFxuICAvLyB7IFwiYS5iLmNcIjogMTIzIH1cbiAgbGV0IGN1cnJlbnQgPSBvYmpbcGF0aF07XG4gIGlmIChjdXJyZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gY3VycmVudDtcbiAgfVxuXG4gIGN1cnJlbnQgPSBvYmo7XG4gIGNvbnN0IHNwbGl0ID0gcGF0aC5zcGxpdCgnLicpO1xuXG4gIGlmIChzcGxpdC5sZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudFtzcGxpdFtpXV07XG5cbiAgICAgIC8vIGlmIGZvdW5kIHVuZGVmaW5lZCwgcmV0dXJuIGVtcHR5IHN0cmluZ1xuICAgICAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCB8fCBjdXJyZW50ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudDtcbn1cbiJdfQ==