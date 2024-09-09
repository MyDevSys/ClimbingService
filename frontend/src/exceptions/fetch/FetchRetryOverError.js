// データフェッチがリトライオーバーした際の例外を表す例外クラス
export class FetchRetryOverError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "FetchRetryOverError";
    this.response = response;
  }
}
