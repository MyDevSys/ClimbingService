import { defineConfig } from "playwright/test";

export default defineConfig({
  // テストのタイムアウト
  timeout: 60000,

  // 並列実行ワーカー数の設定
  workers: 3,

  // 共通設定
  use: {
    // ヘッドレスモード
    headless: true,

    // ブラウザの表示サイズ
    viewport: { width: 1920, height: 1080 },

    // スクリーンショットの保存
    screenshot: "off",

    // テスト対象のベースURL
    baseURL: "https://climbing-service.com",
  },

  // 試験失敗時のリトライ回数(試験回数：初回+リトライ回数)
  retries: 2,

  // 試験対象のブラウザエンジンの設定
  projects: [
    {
      name: "Chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "Firefox",
      use: { browserName: "firefox" },
    },
    {
      name: "WebKit",
      use: { browserName: "webkit" },
    },
  ],

  // レポートの設定
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
});
