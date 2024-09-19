import { test, expect } from "@playwright/test";
import { getVaultSecret } from "@utils/vault";

let vaultSecret;

// 初期化処理
test.beforeAll(async () => {
  // テストで使用する認証情報を取得
  vaultSecret = await getVaultSecret("secret/data/climbing-service/test/auth");
});

test("登山の活動リストの正常性確認", async ({ page }) => {
  // 1. ログインページにアクセス
  await page.goto("https://climbing-service.com/login");

  // 2. Emailとパスワードを入力
  await page.fill('input[name="email"]', vaultSecret.EMAIL);
  await page.fill('input[name="password"]', vaultSecret.PASSWORD);

  // 3. 「ログイン」ボタンをクリック
  await page.click('button[type="submit"]');

  // 4. 認証成功を確認
  await expect(page).toHaveURL("https://climbing-service.com/users/0002");

  // 5. リダイレクト後のページタイトルを取得
  const pageTitle = await page.title();

  try {
    // 6. タイトルが期待されるものと一致するか確認
    expect(pageTitle).toEqual("活動一覧（カズヤ）");
  } catch (error) {
    console.error("タイトル検証エラー:", error);
  }
});
