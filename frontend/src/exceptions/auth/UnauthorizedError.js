// 認証エラーを表す例外クラス
export class UnauthorizedError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "UnauthorizedError";
    this.response = response;
  }
}
