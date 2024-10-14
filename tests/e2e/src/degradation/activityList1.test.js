import { test, expect } from "@playwright/test";

let context;
let page;

// 初期化処理：すべてのテストの前に認証を行う
test.beforeAll(async ({ browser }) => {
  const EMAIL = process.env.TEST_EMAIL;
  const PASSWORD = process.env.TEST_PASSWORD;

  // 新しいコンテキストを作成してログイン状態を保持
  context = await browser.newContext();
  page = await context.newPage();

  // ログインページにアクセス
  await page.goto("/login");

  // Emailとパスワードを入力してログイン
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // 活動リストのURLの確認
  await expect(page).toHaveURL("/users/0002");
});

// 各テストの後にクリーンアップ
test.afterAll(async () => {
  await context.close();
});

test("活動リスト：プロフィール内容", async () => {
  // 契約プランの確認
  const plan = await page.locator('[class*="UserType__Name"]').textContent();
  expect(plan).toEqual("プレミアムユーザー");

  // ユーザーIDの確認
  const userId = await page.locator('[class*="UserType__Id"] p').textContent();
  expect(userId).toEqual("ユーザーID:0002");

  // 活動地域の確認
  const activityPrefecture = await page
    .locator('[class*="UsersId__BasicInfo__Item"]:nth-child(1)')
    .textContent();
  expect(activityPrefecture).toBe("福岡、佐賀、大分で活動");

  // 生まれ年の確認
  const birthYear = await page
    .locator('[class*="UsersId__BasicInfo__Item"]:nth-child(2)')
    .textContent();
  expect(birthYear).toBe("2024年生まれ");

  // 性別の確認
  const gender = await page
    .locator('[class*="UsersId__BasicInfo__Item"]:nth-child(3)')
    .textContent();
  expect(gender).toBe("男性");
});

test("活動リスト：リスト内容", async () => {
  // 1ページ目のアイテム件数の確認
  const page1_ItemCount = await page.locator('[class*="UserActivityList__Item"]').count();
  expect(page1_ItemCount).toBe(15);

  // １ページ目の最初のアイテムの表示内容の確認
  const page1_firstItem = await page
    .locator('[class*="UserActivityList__Item"]:nth-child(1)')
    .textContent();
  expect(page1_firstItem).toEqual(
    "31105:035.9 km710 m宝満山宝満山・三郡山・若杉山(福岡)2023.12.29(金)日帰りゲスト",
  );

  // １ページ目の最後のアイテムの表示内容の確認
  const page1_lastItem = await page
    .locator('[class*="UserActivityList__Item"]:nth-child(15)')
    .textContent();
  expect(page1_lastItem).toEqual("51307:4422 km1189 m天山天山(佐賀)2022.05.07(土)日帰りゲスト");

  // 2ページ目に移動できることの確認
  const page1to2Locator = page.locator('button[aria-label="Go to page 2"]');
  await page1to2Locator.scrollIntoViewIfNeeded();
  await page1to2Locator.waitFor({ state: "visible" });
  await page1to2Locator.click();
  await expect(page).toHaveURL("/users/0002?page=2#tabs");

  // 2ページ目のアイテム件数の確認
  const page2_ItemCount = await page.locator('[class*="UserActivityList__Item"]').count();
  expect(page2_ItemCount).toBe(12);

  // 2ページ目の最初のアイテムの表示内容の確認
  const page2_firstItem = await page
    .locator('[class*="UserActivityList__Item"]:nth-child(1)')
    .textContent();
  expect(page2_firstItem).toEqual(
    "3908:0211.8 km1112 m頭巾山・三郡山宝満山・三郡山・若杉山(福岡)2022.04.22(金)日帰りゲスト",
  );

  // 2ページ目の最後のアイテムの表示内容の確認
  const page2_lastItem = await page
    .locator('[class*="UserActivityList__Item"]:nth-child(12)')
    .textContent();
  expect(page2_lastItem).toEqual(
    "41107:3118.4 km890 m天拝山・奥天拝天拝山・基山(福岡, 佐賀)2022.02.25(金)日帰りゲスト",
  );

  // 1ページ目に移動できることの確認
  const page2to2Locator = page.locator('button[aria-label="Go to page 1"]');
  await page2to2Locator.scrollIntoViewIfNeeded();
  await page2to2Locator.waitFor({ state: "visible" });
  await page2to2Locator.click();
  await expect(page).toHaveURL("/users/0002?page=1#tabs");
});

test("活動リスト：タブ切り換え", async () => {
  // 活動日記タブの表示内容の確認
  const diary = await page
    .locator('[class*="UsersId__Tab__Item"]')
    .nth(0)
    .locator('[class*="UsersId__Tab__Count"]')
    .textContent();
  expect(diary).toEqual("27 件");

  // 登山記録タブの表示内容の確認
  const achievement = await page
    .locator('[class*="UsersId__Tab__Item"]')
    .nth(1)
    .locator('[class*="UsersId__Tab__Count"]')
    .textContent();
  expect(achievement).toEqual("71 座");

  // 活動日記タブの遷移先のURL確認
  await page.locator('[class*="UsersId__Tab__Link"]').nth(0).click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL("/users/0002?tab=activities#tabs");

  // 登山記録タブの遷移先のURL確認
  await page.locator('[class*="UsersId__Tab__Link"]').nth(1).click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL("/users/0002?tab=achievements#tabs");
});

test("活動リスト：メニュー操作", async () => {
  // メニューボタンをクリック
  await page.locator('button[aria-label="アカウント_desktop"]').click();

  // マイアカウントボタンの遷移先のURL確認
  await page.locator('[class*="AccountMenu__item"][tabindex="0"]').click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL("/users/0002");

  // メニューボタンをクリック
  await page.locator('button[aria-label="アカウント_desktop"]').click();

  // ログアウトボタンの遷移先のURL確認
  await page.locator('[class*="AccountMenu__item"][tabindex="-1"]').click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL("/login");
});
