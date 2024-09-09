import { NextResponse } from "next/server";
import { URL_PATH } from "@data/constants";
import { QUERY_NAME } from "@data/constants";

// ログイン画面にリダイレクトする関数
function redirectLoginPage(req) {
  const url = req.nextUrl.clone();
  // ログインページのURLパスの設定
  url.pathname = URL_PATH.LOGIN;
  // リクエスト先URLパスの取得
  const { pathname } = req.nextUrl;

  if (pathname !== "/") {
    // ログイン後にリクエスト先URLにリダイレクトするためにリクエスト先URLをクエリパラメータに設定
    const pathnameSearch = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    url.search = `?${QUERY_NAME.REDIRECT}=${encodeURIComponent(pathnameSearch)}${req.nextUrl.hash}`;
  }

  // ログインページにリダイレクト
  return NextResponse.redirect(url);
}

// next.jsのミドルウェア関数
export async function middleware(request) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const user_id = request.cookies.get("user_id")?.value;

  // アクセストークンとリフレッシュトークンが存在しない場合、ログインページにリダイレクト
  if ((!accessToken && !refreshToken) || !user_id) {
    return redirectLoginPage(request);
  }

  // cookieから取得したユーザーIDを独自ヘッダーに設定したレスポンスを作成
  const headers = new Headers(request.headers);
  headers.set("x-user-id", user_id);
  const modifiedReq = new Request(request.url, {
    method: request.method,
    headers: headers,
    body: request.body,
  });

  // 次のミドルウェアにレスポンスを渡す
  return NextResponse.next(modifiedReq);
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: ["/", "/activities/:path*", "/users/:path*"],
};
