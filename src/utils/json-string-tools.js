var jsonStringEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\\': '\\\\',
    '\'': '&#39;'
};
var jsonStringUnescapeMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&#39;': '\''
};
export function jsonStringEscape(str) {
    return str.replace(/[&\<\>\\']/g, function (e) { return jsonStringEscapeMap[e]; });
}
export function jsonStringUnescape(str) {
    return str.replace(/(&amp;)|(&lt;)|(&gt;)|(&#39;)/g, function (e) { return jsonStringUnescapeMap[e]; });
}
