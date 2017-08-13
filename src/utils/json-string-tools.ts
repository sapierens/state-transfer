const jsonStringEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '\\': '\\\\',
  '\'': '&#39;'
};

const jsonStringUnescapeMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&#39;': '\''
};

export function jsonStringEscape(str: string): string {
  return str.replace(/[&\<\>\\']/g, e => jsonStringEscapeMap[e]);
}

export function jsonStringUnescape(str: string): string {
  return str.replace(/(&amp;)|(&lt;)|(&gt;)|(&#39;)/g, e => jsonStringUnescapeMap[e]);
}
