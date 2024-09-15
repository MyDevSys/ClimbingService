"use server";

import { apiLogger } from "@utils/logger/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// ログアウトのためにcookieを削除するAPI
export async function POST(request) {
  // リクエスト処理の開始時間を記録（アクセスログ用）
  const startTime = performance.now();

  // レスポンスの作成
  const responseBody = { message: "Logged out" };
  const response = NextResponse.json(responseBody);

  // cookieの無効処理
  response.cookies.set("access_token", "", {
    path: "/",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    maxAge: -1,
  });
  response.cookies.set("refresh_token", "", {
    path: "/",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    maxAge: -1,
  });
  response.cookies.set("user_id", "", {
    path: "/",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    maxAge: -1,
  });
  response.cookies.set("csrftoken", "", {
    path: "/",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    maxAge: -1,
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

  // レスポンスの応答
  return response;
}
