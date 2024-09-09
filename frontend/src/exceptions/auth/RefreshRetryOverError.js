// リフレッシュトークンによるアクセストークの払い出し処理がリトライオーバした場合の例外を現す例外クラス
export class RefreshRetryOverError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "RefreshRetryOverError";
    this.response = response;
  }
}
