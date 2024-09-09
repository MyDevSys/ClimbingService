import { apiLogger } from "@utils/logger/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

//指定されたcookie情報を元にレスポンスにset-cookieを付与するAPI
export async function POST(request) {
  // リクエスト処理の開始時間を記録（アクセスログ用）
  const startTime = performance.now();

  // リクエストのcookie情報を取得
  const { setCookies } = await request.json();

  // レスポンスを作成
  const responseBody = { message: "set cookie successful" };
  const response = NextResponse.json(responseBody);

  // set-cookieヘッダーの設定
  setCookies.forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.attributes.httponly,
      secure: cookie.attributes.secure,
      path: cookie.attributes.path,
      sameSite: cookie.attributes.samesite,
      expires: new Date(cookie.attributes.expires),
      domain: cookie.attributes.domain,
      maxAge: parseInt(cookie.attributes["max-age"]),
    });
  });

  // リクエストの処理時間を取得（アクセスログ用）
  const duration = performance.now() - startTime;

  // リクエストのAPIパスを取得（アクセスログ用）
  const { pathname } = new URL(request.url);

  // クライアントのIPアドレスを取得（アクセスログ用）
  const clientIp = request.headers.get("x-forwarded-for") || null;

  // レスポンスボディのサイズを計算（アクセスログ用）
  const responseSize = JSON.stringify(responseBody).length;

  // アクセスログの出力
  apiLogger.info(
    `${request.method} ${pathname} ${StatusCodes.OK} ${clientIp || "unknown"} ${responseSize} ${duration.toFixed(3)}`,
  );

  // レスポンスを送信
  return response;
}
