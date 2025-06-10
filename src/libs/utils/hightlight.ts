export function syntaxHighlight(
  stringedJson: string,
  styles: {
    readonly [key: string]: string;
  }
) {
  if (!stringedJson) {
    return '';
  } // no JSON from response

  const clearedStringedJson = stringedJson
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return clearedStringedJson.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match: string) {
      let cls = styles.number; // default to number class
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = styles.key;
        } else {
          cls = styles.string;
        }
      } else if (/true|false/.test(match)) {
        cls = styles.boolean;
      } else if (/null/.test(match)) {
        cls = styles.null;
      }

      return `<span class="${cls}">${match}</span>`;
    }
  );
}
