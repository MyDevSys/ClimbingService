import { FetchBase } from "../base";
import { cookies } from "next/headers";

// サーバーコンポーネントのデータフェッチクラス
export class ServerFetch extends FetchBase {
  constructor() {
    super();
  }

  // cookie情報を設定するメソッドのオーバーライド
  addCookieHeader() {
    return { Cookie: cookies().toString() };
  }
}

const serverFetch = new ServerFetch();
export default serverFetch;
