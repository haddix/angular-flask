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
    return str.replace(/([A-Z])/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZWwtY2FzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2NhbWVsLWNhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBQyxHQUFXO0lBQ25DLDBDQUEwQztJQUMxQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6Qyx5Q0FBeUM7SUFDekMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFOUMsa0RBQWtEO0lBQ2xELEdBQUcsR0FBRyxHQUFHO1NBQ04sT0FBTyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQztTQUN2QyxJQUFJLEVBQUU7U0FDTixXQUFXLEVBQUUsQ0FBQztJQUVqQixxREFBcUQ7SUFDckQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDekQsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxHQUFXO0lBQ3JDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ25HLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnZlcnRzIHN0cmluZ3MgZnJvbSBzb21ldGhpbmcgdG8gY2FtZWwgY2FzZVxuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDQyNTI4Ny9jb252ZXJ0LWRhc2gtc2VwYXJhdGVkLXN0cmluZy10by1jYW1lbGNhc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsQ2FzZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFJlcGxhY2Ugc3BlY2lhbCBjaGFyYWN0ZXJzIHdpdGggYSBzcGFjZVxuICBzdHIgPSBzdHIucmVwbGFjZSgvW15hLXpBLVowLTkgXS9nLCAnICcpO1xuICAvLyBwdXQgYSBzcGFjZSBiZWZvcmUgYW4gdXBwZXJjYXNlIGxldHRlclxuICBzdHIgPSBzdHIucmVwbGFjZSgvKFthLXpdKD89W0EtWl0pKS9nLCAnJDEgJyk7XG5cbiAgLy8gTG93ZXIgY2FzZSBmaXJzdCBjaGFyYWN0ZXIgYW5kIHNvbWUgb3RoZXIgc3R1ZmZcbiAgc3RyID0gc3RyXG4gICAgLnJlcGxhY2UoLyhbXmEtekEtWjAtOSBdKXxeWzAtOV0rL2csICcnKVxuICAgIC50cmltKClcbiAgICAudG9Mb3dlckNhc2UoKTtcblxuICAvLyB1cHBlcmNhc2UgY2hhcmFjdGVycyBwcmVjZWRlZCBieSBhIHNwYWNlIG9yIG51bWJlclxuICBzdHIgPSBzdHIucmVwbGFjZSgvKFsgMC05XSspKFthLXpBLVpdKS9nLCBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgIHJldHVybiBiLnRyaW0oKSArIGMudG9VcHBlckNhc2UoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBzdHJpbmdzIGZyb20gY2FtZWwgY2FzZSB0byB3b3Jkc1xuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MjI1NDA3L2NvbnZlcnQtY2FtZWxjYXNldGV4dC10by1jYW1lbC1jYXNlLXRleHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlQ2FtZWxDYXNlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIG1hdGNoID0+IGAgJHttYXRjaH1gKS5yZXBsYWNlKC9eLi8sIG1hdGNoID0+IG1hdGNoLnRvVXBwZXJDYXNlKCkpO1xufVxuIl19