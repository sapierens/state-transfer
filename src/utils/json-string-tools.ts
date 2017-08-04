const jsonStringEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '\\': '\\\\'
};

const jsonStringUnescapeMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&'
};

export function jsonStringEscape(str: string): string {
  return str.replace(/[&\<\>\\]/g, e => jsonStringEscapeMap[e]);
}

export function jsonStringUnescape(str: string): string {
  return str.replace(/(&amp;)|(&lt;)|(&gt;)/g, e => jsonStringUnescapeMap[e]);
}
