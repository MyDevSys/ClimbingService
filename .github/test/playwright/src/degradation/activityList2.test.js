import { test, expect } from "@playwright/test";

test("活動リスト：テーブルのソート/フィルタ", async ({ page }) => {
  const EMAIL = "user1@example.com";
  const PASSWORD = "qnusxt2q";

  // ログインページにアクセス
  await page.goto("/login");

  // Emailとパスワードを入力
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);

  //「ログイン」ボタンをクリック
  await page.click('button[type="submit"]');

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // 登山記録タブをクリック
  await page.locator('[class*="UsersId__Tab__Link"]').nth(1).click();
  await page.waitForLoadState("networkidle");

  // テーブルの１行目のロケータ
  const firstTableRowLocator = 'tr[data-item-index="0"]';

  // テーブルのカラムヘッダーのロケーター
  const columnLocators = [
    '[class*="column__mountain"]',
    '[class*="column__prefecture"]',
    '[class*="column__climbCount"]',
    '[class*="column__elevation"]',
  ];

  // テーブルヘッダーのテキスト
  const tableHeaderTexts = ["山名71 座", "都道府県3 県", "登頂回数80 回", "標高"];

  // テーブルヘッダーのテキスト
  const tableHeaderTextsFilterSaga = ["山名15 座", "都道府県2 県", "登頂回数16 回", "標高"];

  // 各テーブルカラムを昇順/降順ソートした際の１行目の結果
  const expectTexts = [
    "雷山(福岡、佐賀)雷山福岡、佐賀1955 m",
    "愛嶽山(福岡)愛嶽山福岡1437 m",
    "九千部山(福岡、佐賀)九千部山福岡、佐賀2847 m",
    "中岳(大分)中岳大分11,791 m",
    "宝満山(福岡)宝満山福岡5829 m",
    "中岳(大分)中岳大分11,791 m",
    "中岳(大分)中岳大分11,791 m",
    "吉見岳(福岡)吉見岳福岡1158 m",
  ];

  // 各テーブルカラムを昇順/降順ソートした際のURL
  const expectUrls = [
    "/users/0002?tab=achievements&field=mountain_name_ruby&direction=desc#tabs",
    "/users/0002?tab=achievements&field=mountain_name_ruby&direction=asc#tabs",
    "/users/0002?tab=achievements&field=prefecture_name_ruby&direction=desc#tabs",
    "/users/0002?tab=achievements&field=prefecture_name_ruby&direction=asc#tabs",
    "/users/0002?tab=achievements&field=climbCount&direction=desc#tabs",
    "/users/0002?tab=achievements&field=climbCount&direction=asc#tabs",
    "/users/0002?tab=achievements&field=elevation&direction=desc#tabs",
    "/users/0002?tab=achievements&field=elevation&direction=asc#tabs",
  ];

  // ソート前の1行目のテーブルの内容の確認
  const firstContent = await page.locator(firstTableRowLocator).textContent();
  expect(firstContent).toEqual("宝満山(福岡)宝満山福岡5829 m");

  // 各テーブルカラムを昇順/降順ソートした際の１行目の結果とURLを確認
  for (let i = 0; i < tableHeaderTexts.length; i++) {
    for (let j = 0; j < 2; j++) {
      await page.getByRole("button", { name: tableHeaderTexts[i] }).click();
      const textContent = await page.locator(firstTableRowLocator).textContent();
      expect(textContent).toEqual(expectTexts[2 * i + j]);
      await expect(page).toHaveURL(expectUrls[2 * i + j]);
    }
  }

  // リロード後のテーブルの１行目の確認
  await page.reload();
  await page.waitForLoadState("networkidle");
  let reloadContent = await page.locator(firstTableRowLocator).textContent();
  expect(reloadContent).toEqual("吉見岳(福岡)吉見岳福岡1158 m");

  // フィルタ―前のテーブルヘッダーの確認
  for (let index = 0; index < columnLocators.length; index++) {
    const textContent = await page.locator(columnLocators[index]).textContent();
    expect(textContent).toEqual(tableHeaderTexts[index]);
  }

  // 日本地図の佐賀をクリック
  const sagLocator = "path#saga";
  await page.locator(sagLocator).click();

  // 佐賀でフィルタ―した場合のテーブルヘッダー、テーブルの１行目、URLの確認
  for (let index = 0; index < columnLocators.length; index++) {
    const textContent = await page.locator(columnLocators[index]).textContent();
    expect(textContent).toEqual(tableHeaderTextsFilterSaga[index]);
  }

  await expect(page).toHaveURL(
    "/users/0002?tab=achievements&field=elevation&direction=asc&prefecture_names=%E4%BD%90%E8%B3%80#tabs",
  );

  // リロード後のテーブルの１行目の確認
  await page.reload();
  await page.waitForLoadState("networkidle");
  reloadContent = await page.locator(firstTableRowLocator).textContent();
  expect(reloadContent).toEqual("杓子ヶ峰(佐賀)杓子ヶ峰佐賀1247 m");
});
