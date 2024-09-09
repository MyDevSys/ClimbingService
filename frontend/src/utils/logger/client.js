// クライアントサイド用のログ出力用関数
const log = (() => {
  const isDevelopment = process.env.NODE_ENV === "development";

  // ログに埋め込む日付情報を返す関数
  const getFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2); // 月を2桁に
    const day = ("0" + now.getDate()).slice(-2); // 日を2桁に
    const hours = ("0" + now.getHours()).slice(-2); // 時間を2桁に
    const minutes = ("0" + now.getMinutes()).slice(-2); // 分を2桁に
    const seconds = ("0" + now.getSeconds()).slice(-2); // 秒を2桁に
    const milliseconds = ("00" + now.getMilliseconds()).slice(-3); // ミリ秒を3桁に

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // info情報のログを出力する関数(開発時のみ出力)
  const info = (message) => {
    if (isDevelopment) {
      console.info(`[${getFormattedDate()}] [INFO] ${message}`);
    }
  };

  // warning情報のログを出力する関数(開発時のみ出力)
  const warn = (message) => {
    if (isDevelopment) {
      console.warn(`[${getFormattedDate()}] [WARN] ${message}`);
    }
  };

  // error情報のログを出力する関数(開発時のみ出力)
  const error = (message) => {
    if (isDevelopment) {
      console.error(`[${getFormattedDate()}] [ERROR] ${message}`);
    }
  };

  return { info, warn, error };
})();

export { log };
