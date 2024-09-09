// リクエストにアクセストークンが存在しない場合の例外を現す例外クラス
export class NoAccessTokenError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "NoAccessTokenError";
    this.response = response;
  }
}
