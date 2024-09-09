// set-cookieヘッダーの内容をパースする関数
export function parseSetCookieHeader(header) {
  if (header) {
    // expiresのカンマを一時的に置き換え
    const tempHeader = header.replace(/(expires=[^;]+)/gi, (match) => {
      return match.replace(/,/g, "__COMMA__");
    });

    // カンマでクッキーを分割
    const cookiesArray = tempHeader.split(/,\s*(?=[^,]+=)/);

    return cookiesArray.map((cookieStr) => {
      // セミコロンで区切って各部分を分割
      const parts = cookieStr.split(";").map((part) => part.trim());

      // cookie名と値を取得
      const [name, value] = parts[0].split("=");

      // cookieの属性を取得
      const attributes = parts.slice(1).reduce((acc, attr) => {
        const [key, val] = attr.split("=");
        const fixedVal = val ? val.replace(/__COMMA__/g, ",").trim() : true;
        acc[key.trim().toLowerCase()] = fixedVal;
        return acc;
      }, {});

      return {
        name: name.trim(),
        value: value.trim(),
        attributes,
      };
    });
  }

  return null;
}
