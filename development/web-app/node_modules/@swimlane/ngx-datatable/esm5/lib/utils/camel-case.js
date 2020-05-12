/**
 * Converts strings from something to camel case
 * http://stackoverflow.com/questions/10425287/convert-dash-separated-string-to-camelcase
 */
export function camelCase(str) {
    // Replace special characters with a space
    str = str.replace(/[^a-zA-Z0-9 ]/g, ' ');
    // put a space before an uppercase letter
    str = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
    // Lower case first character and some other stuff
    str = str
        .replace(/([^a-zA-Z0-9 ])|^[0-9]+/g, '')
        .trim()
        .toLowerCase();
    // uppercase characters preceded by a space or number
    str = str.replace(/([ 0-9]+)([a-zA-Z])/g, function (a, b, c) {
        return b.trim() + c.toUpperCase();
    });
    return str;
}
/**
 * Converts strings from camel case to words
 * http://stackoverflow.com/questions/7225407/convert-camelcasetext-to-camel-case-text
 */
export function deCamelCase(str) {
    return str.replace(/([A-Z])/g, function (match) { return " " + match; }).replace(/^./, function (match) { return match.toUpperCase(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZWwtY2FzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2NhbWVsLWNhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBQyxHQUFXO0lBQ25DLDBDQUEwQztJQUMxQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6Qyx5Q0FBeUM7SUFDekMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFOUMsa0RBQWtEO0lBQ2xELEdBQUcsR0FBRyxHQUFHO1NBQ04sT0FBTyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQztTQUN2QyxJQUFJLEVBQUU7U0FDTixXQUFXLEVBQUUsQ0FBQztJQUVqQixxREFBcUQ7SUFDckQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDekQsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxHQUFXO0lBQ3JDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxNQUFJLEtBQU8sRUFBWCxDQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFuQixDQUFtQixDQUFDLENBQUM7QUFDbkcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udmVydHMgc3RyaW5ncyBmcm9tIHNvbWV0aGluZyB0byBjYW1lbCBjYXNlXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNDI1Mjg3L2NvbnZlcnQtZGFzaC1zZXBhcmF0ZWQtc3RyaW5nLXRvLWNhbWVsY2FzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FtZWxDYXNlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gUmVwbGFjZSBzcGVjaWFsIGNoYXJhY3RlcnMgd2l0aCBhIHNwYWNlXG4gIHN0ciA9IHN0ci5yZXBsYWNlKC9bXmEtekEtWjAtOSBdL2csICcgJyk7XG4gIC8vIHB1dCBhIHNwYWNlIGJlZm9yZSBhbiB1cHBlcmNhc2UgbGV0dGVyXG4gIHN0ciA9IHN0ci5yZXBsYWNlKC8oW2Etel0oPz1bQS1aXSkpL2csICckMSAnKTtcblxuICAvLyBMb3dlciBjYXNlIGZpcnN0IGNoYXJhY3RlciBhbmQgc29tZSBvdGhlciBzdHVmZlxuICBzdHIgPSBzdHJcbiAgICAucmVwbGFjZSgvKFteYS16QS1aMC05IF0pfF5bMC05XSsvZywgJycpXG4gICAgLnRyaW0oKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xuXG4gIC8vIHVwcGVyY2FzZSBjaGFyYWN0ZXJzIHByZWNlZGVkIGJ5IGEgc3BhY2Ugb3IgbnVtYmVyXG4gIHN0ciA9IHN0ci5yZXBsYWNlKC8oWyAwLTldKykoW2EtekEtWl0pL2csIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgcmV0dXJuIGIudHJpbSgpICsgYy50b1VwcGVyQ2FzZSgpO1xuICB9KTtcblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHN0cmluZ3MgZnJvbSBjYW1lbCBjYXNlIHRvIHdvcmRzXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzcyMjU0MDcvY29udmVydC1jYW1lbGNhc2V0ZXh0LXRvLWNhbWVsLWNhc2UtdGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVDYW1lbENhc2Uoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgbWF0Y2ggPT4gYCAke21hdGNofWApLnJlcGxhY2UoL14uLywgbWF0Y2ggPT4gbWF0Y2gudG9VcHBlckNhc2UoKSk7XG59XG4iXX0=