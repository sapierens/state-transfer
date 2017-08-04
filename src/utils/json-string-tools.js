var jsonStringEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\\': '\\\\'
};
var jsonStringUnescapeMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&'
};
export function jsonStringEscape(str) {
    return str.replace(/[&\<\>\\]/g, function (e) { return jsonStringEscapeMap[e]; });
}
export function jsonStringUnescape(str) {
    return str.replace(/(&amp;)|(&lt;)|(&gt;)/g, function (e) { return jsonStringUnescapeMap[e]; });
}
