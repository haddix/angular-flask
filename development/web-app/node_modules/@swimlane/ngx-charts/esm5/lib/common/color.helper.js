import { __read, __spread, __values } from "tslib";
import { range } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal, scaleQuantile } from 'd3-scale';
import { colorSets } from '../utils/color-sets';
var ColorHelper = /** @class */ (function () {
    function ColorHelper(scheme, type, domain, customColors) {
        if (typeof scheme === 'string') {
            scheme = colorSets.find(function (cs) {
                return cs.name === scheme;
            });
        }
        this.colorDomain = scheme.domain;
        this.scaleType = type;
        this.domain = domain;
        this.customColors = customColors;
        this.scale = this.generateColorScheme(scheme, type, this.domain);
    }
    ColorHelper.prototype.generateColorScheme = function (scheme, type, domain) {
        if (typeof scheme === 'string') {
            scheme = colorSets.find(function (cs) {
                return cs.name === scheme;
            });
        }
        var colorScale;
        if (type === 'quantile') {
            colorScale = scaleQuantile().range(scheme.domain).domain(domain);
        }
        else if (type === 'ordinal') {
            colorScale = scaleOrdinal().range(scheme.domain).domain(domain);
        }
        else if (type === 'linear') {
            // linear schemes must have at least 2 colors
            var colorDomain = __spread(scheme.domain);
            if (colorDomain.length === 1) {
                colorDomain.push(colorDomain[0]);
                this.colorDomain = colorDomain;
            }
            var points = range(0, 1, 1.0 / colorDomain.length);
            colorScale = scaleLinear().domain(points).range(colorDomain);
        }
        return colorScale;
    };
    ColorHelper.prototype.getColor = function (value) {
        if (value === undefined || value === null) {
            throw new Error('Value can not be null');
        }
        if (this.scaleType === 'linear') {
            var valueScale = scaleLinear().domain(this.domain).range([0, 1]);
            return this.scale(valueScale(value));
        }
        else {
            if (typeof this.customColors === 'function') {
                return this.customColors(value);
            }
            var formattedValue_1 = value.toString();
            var found = void 0; // todo type customColors
            if (this.customColors && this.customColors.length > 0) {
                found = this.customColors.find(function (mapping) {
                    return mapping.name.toLowerCase() === formattedValue_1.toLowerCase();
                });
            }
            if (found) {
                return found.value;
            }
            else {
                return this.scale(value);
            }
        }
    };
    ColorHelper.prototype.getLinearGradientStops = function (value, start) {
        var e_1, _a;
        if (start === undefined) {
            start = this.domain[0];
        }
        var valueScale = scaleLinear().domain(this.domain).range([0, 1]);
        var colorValueScale = scaleBand().domain(this.colorDomain).range([0, 1]);
        var endColor = this.getColor(value);
        // generate the stops
        var startVal = valueScale(start);
        var startColor = this.getColor(start);
        var endVal = valueScale(value);
        var i = 1;
        var currentVal = startVal;
        var stops = [];
        stops.push({
            color: startColor,
            offset: startVal,
            originalOffset: startVal,
            opacity: 1
        });
        while (currentVal < endVal && i < this.colorDomain.length) {
            var color = this.colorDomain[i];
            var offset = colorValueScale(color);
            if (offset <= startVal) {
                i++;
                continue;
            }
            if (offset.toFixed(4) >= (endVal - colorValueScale.bandwidth()).toFixed(4)) {
                break;
            }
            stops.push({
                color: color,
                offset: offset,
                opacity: 1
            });
            currentVal = offset;
            i++;
        }
        if (stops[stops.length - 1].offset < 100) {
            stops.push({
                color: endColor,
                offset: endVal,
                opacity: 1
            });
        }
        if (endVal === startVal) {
            stops[0].offset = 0;
            stops[1].offset = 100;
        }
        else {
            // normalize the offsets into percentages
            if (stops[stops.length - 1].offset !== 100) {
                try {
                    for (var stops_1 = __values(stops), stops_1_1 = stops_1.next(); !stops_1_1.done; stops_1_1 = stops_1.next()) {
                        var s = stops_1_1.value;
                        s.offset = ((s.offset - startVal) / (endVal - startVal)) * 100;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (stops_1_1 && !stops_1_1.done && (_a = stops_1.return)) _a.call(stops_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
        return stops;
    };
    return ColorHelper;
}());
export { ColorHelper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuaGVscGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvY29tbW9uL2NvbG9yLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNqQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRS9FLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVoRDtJQU9FLHFCQUFZLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFlBQWE7UUFDN0MsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDOUIsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxFQUFFO2dCQUN4QixPQUFPLEVBQUUsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFFakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELHlDQUFtQixHQUFuQixVQUFvQixNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU07UUFDdEMsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDOUIsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxFQUFFO2dCQUN4QixPQUFP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LE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQWxKRCxJQWtKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJhbmdlIH0gZnJvbSAnZDMtYXJyYXknO1xuaW1wb3J0IHsgc2NhbGVCYW5kLCBzY2FsZUxpbmVhciwgc2NhbGVPcmRpbmFsLCBzY2FsZVF1YW50aWxlIH0gZnJvbSAnZDMtc2NhbGUnO1xuXG5pbXBvcnQgeyBjb2xvclNldHMgfSBmcm9tICcuLi91dGlscy9jb2xvci1zZXRzJztcblxuZXhwb3J0IGNsYXNzIENvbG9ySGVscGVyIHtcbiAgc2NhbGU6IGFueTtcbiAgc2NhbGVUeXBlOiBhbnk7XG4gIGNvbG9yRG9tYWluOiBhbnlbXTtcbiAgZG9tYWluOiBhbnk7XG4gIGN1c3RvbUNvbG9yczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHNjaGVtZSwgdHlwZSwgZG9tYWluLCBjdXN0b21Db2xvcnM/KSB7XG4gICAgaWYgKHR5cGVvZiBzY2hlbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzY2hlbWUgPSBjb2xvclNldHMuZmluZChjcyA9PiB7XG4gICAgICAgIHJldHVybiBjcy5uYW1lID09PSBzY2hlbWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5jb2xvckRvbWFpbiA9IHNjaGVtZS5kb21haW47XG4gICAgdGhpcy5zY2FsZVR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuY3VzdG9tQ29sb3JzID0gY3VzdG9tQ29sb3JzO1xuXG4gICAgdGhpcy5zY2FsZSA9IHRoaXMuZ2VuZXJhdGVDb2xvclNjaGVtZShzY2hlbWUsIHR5cGUsIHRoaXMuZG9tYWluKTtcbiAgfVxuXG4gIGdlbmVyYXRlQ29sb3JTY2hlbWUoc2NoZW1lLCB0eXBlLCBkb21haW4pIHtcbiAgICBpZiAodHlwZW9mIHNjaGVtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNjaGVtZSA9IGNvbG9yU2V0cy5maW5kKGNzID0+IHtcbiAgICAgICAgcmV0dXJuIGNzLm5hbWUgPT09IHNjaGVtZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBsZXQgY29sb3JTY2FsZTtcbiAgICBpZiAodHlwZSA9PT0gJ3F1YW50aWxlJykge1xuICAgICAgY29sb3JTY2FsZSA9IHNjYWxlUXVhbnRpbGUoKS5yYW5nZShzY2hlbWUuZG9tYWluKS5kb21haW4oZG9tYWluKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgY29sb3JTY2FsZSA9IHNjYWxlT3JkaW5hbCgpLnJhbmdlKHNjaGVtZS5kb21haW4pLmRvbWFpbihkb21haW4pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2xpbmVhcicpIHtcbiAgICAgIC8vIGxpbmVhciBzY2hlbWVzIG11c3QgaGF2ZSBhdCBsZWFzdCAyIGNvbG9yc1xuICAgICAgY29uc3QgY29sb3JEb21haW4gPSBbLi4uc2NoZW1lLmRvbWFpbl07XG4gICAgICBpZiAoY29sb3JEb21haW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbG9yRG9tYWluLnB1c2goY29sb3JEb21haW5bMF0pO1xuICAgICAgICB0aGlzLmNvbG9yRG9tYWluID0gY29sb3JEb21haW47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBvaW50cyA9IHJhbmdlKDAsIDEsIDEuMCAvIGNvbG9yRG9tYWluLmxlbmd0aCk7XG4gICAgICBjb2xvclNjYWxlID0gc2NhbGVMaW5lYXIoKS5kb21haW4ocG9pbnRzKS5yYW5nZShjb2xvckRvbWFpbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9yU2NhbGU7XG4gIH1cblxuICBnZXRDb2xvcih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIGNhbiBub3QgYmUgbnVsbCcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XG4gICAgICBjb25zdCB2YWx1ZVNjYWxlID0gc2NhbGVMaW5lYXIoKS5kb21haW4odGhpcy5kb21haW4pLnJhbmdlKFswLCAxXSk7XG5cbiAgICAgIHJldHVybiB0aGlzLnNjYWxlKHZhbHVlU2NhbGUodmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmN1c3RvbUNvbG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21Db2xvcnModmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmb3JtYXR0ZWRWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICBsZXQgZm91bmQ6IGFueTsgLy8gdG9kbyB0eXBlIGN1c3RvbUNvbG9yc1xuICAgICAgaWYgKHRoaXMuY3VzdG9tQ29sb3JzICYmIHRoaXMuY3VzdG9tQ29sb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm91bmQgPSB0aGlzLmN1c3RvbUNvbG9ycy5maW5kKG1hcHBpbmcgPT4ge1xuICAgICAgICAgIHJldHVybiBtYXBwaW5nLm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gZm9ybWF0dGVkVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICByZXR1cm4gZm91bmQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TGluZWFyR3JhZGllbnRTdG9wcyh2YWx1ZSwgc3RhcnQpIHtcbiAgICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RhcnQgPSB0aGlzLmRvbWFpblswXTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZVNjYWxlID0gc2NhbGVMaW5lYXIoKS5kb21haW4odGhpcy5kb21haW4pLnJhbmdlKFswLCAxXSk7XG5cbiAgICBjb25zdCBjb2xvclZhbHVlU2NhbGUgPSBzY2FsZUJhbmQoKS5kb21haW4odGhpcy5jb2xvckRvbWFpbikucmFuZ2UoWzAsIDFdKTtcblxuICAgIGNvbnN0IGVuZENvbG9yID0gdGhpcy5nZXRDb2xvcih2YWx1ZSk7XG5cbiAgICAvLyBnZW5lcmF0ZSB0aGUgc3RvcHNcbiAgICBjb25zdCBzdGFydFZhbCA9IHZhbHVlU2NhbGUoc3RhcnQpO1xuICAgIGNvbnN0IHN0YXJ0Q29sb3IgPSB0aGlzLmdldENvbG9yKHN0YXJ0KTtcblxuICAgIGNvbnN0IGVuZFZhbCA9IHZhbHVlU2NhbGUodmFsdWUpO1xuICAgIGxldCBpID0gMTtcbiAgICBsZXQgY3VycmVudFZhbCA9IHN0YXJ0VmFsO1xuICAgIGNvbnN0IHN0b3BzID0gW107XG5cbiAgICBzdG9wcy5wdXNoKHtcbiAgICAgIGNvbG9yOiBzdGFydENvbG9yLFxuICAgICAgb2Zmc2V0OiBzdGFydFZhbCxcbiAgICAgIG9yaWdpbmFsT2Zmc2V0OiBzdGFydFZhbCxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9KTtcblxuICAgIHdoaWxlIChjdXJyZW50VmFsIDwgZW5kVmFsICYmIGkgPCB0aGlzLmNvbG9yRG9tYWluLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yRG9tYWluW2ldO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gY29sb3JWYWx1ZVNjYWxlKGNvbG9yKTtcbiAgICAgIGlmIChvZmZzZXQgPD0gc3RhcnRWYWwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9mZnNldC50b0ZpeGVkKDQpID49IChlbmRWYWwgLSBjb2xvclZhbHVlU2NhbGUuYmFuZHdpZHRoKCkpLnRvRml4ZWQoNCkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHN0b3BzLnB1c2goe1xuICAgICAgICBjb2xvcixcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KTtcbiAgICAgIGN1cnJlbnRWYWwgPSBvZmZzZXQ7XG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKHN0b3BzW3N0b3BzLmxlbmd0aCAtIDFdLm9mZnNldCA8IDEwMCkge1xuICAgICAgc3RvcHMucHVzaCh7XG4gICAgICAgIGNvbG9yOiBlbmRDb2xvcixcbiAgICAgICAgb2Zmc2V0OiBlbmRWYWwsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChlbmRWYWwgPT09IHN0YXJ0VmFsKSB7XG4gICAgICBzdG9wc1swXS5vZmZzZXQgPSAwO1xuICAgICAgc3RvcHNbMV0ub2Zmc2V0ID0gMTAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3JtYWxpemUgdGhlIG9mZnNldHMgaW50byBwZXJjZW50YWdlc1xuICAgICAgaWYgKHN0b3BzW3N0b3BzLmxlbmd0aCAtIDFdLm9mZnNldCAhPT0gMTAwKSB7XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiBzdG9wcykge1xuICAgICAgICAgIHMub2Zmc2V0ID0gKChzLm9mZnNldCAtIHN0YXJ0VmFsKSAvIChlbmRWYWwgLSBzdGFydFZhbCkpICogMTAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3BzO1xuICB9XG59XG4iXX0=