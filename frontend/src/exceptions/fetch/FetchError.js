// データフェッチ時にエラーが発生した際の例外を表す例外クラス
export class FetchError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "FetchError";
    this.response = response;
  }
}
