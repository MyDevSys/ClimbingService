import { test, expect } from "@playwright/test";

test("活動リスト：リストフィルターの基本機能)", async ({ page }) => {
  // 認証情報
  const EMAIL = process.env.TEST_EMAIL;
  const PASSWORD = process.env.TEST_PASSWORD;

  // 検索の入力フィールドに設定する文字列
  const SEARCH_STR = "佐賀";

  // ログインページにアクセス
  await page.goto("/login");

  // Emailとパスワードを入力
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);

  //「ログイン」ボタンをクリック
  await page.click('button[type="submit"]');

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // フィルタ―前のアイテム件数の確認
  const itemCounterLocator = page.locator('[class*="Pagination__text"]');
  let preContent = await itemCounterLocator.textContent();
  expect(preContent).toEqual("総計27件");

  // 検索の入力フィールドをクリック
  const searchField = page.locator('input[name="search"]');
  await searchField.click();

  // 検索キーワードをリストから選択
  await page.waitForSelector(`text="${SEARCH_STR}"`, { state: "visible" });
  const targetSearchItem = page.getByText(SEARCH_STR, { exact: true });
  await targetSearchItem.scrollIntoViewIfNeeded();
  await targetSearchItem.waitFor({ state: "visible" });
  await targetSearchItem.click();

  // 選択した検索キーワードの確認
  const keywordContent = await page.locator('[class*="Autocomplete__Keyword__Text"]').textContent();
  expect(keywordContent).toEqual(SEARCH_STR);

  // フィルタ―後のアイテム件数の確認
  let filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計10件");

  // カレンダーとカレンダーの前年、前月ボタンの要素を取得
  const calendarLocator = page.locator('div[aria-label="Choose Date"]');
  const previousYearLocator = page.locator('button[aria-label="前年"] svg');
  const previousMonthLocator = page.locator('button[aria-label="前月"] svg');

  // 現在の年と月を取得
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 開始/終了カレンダーのターゲットの年と月を設定
  const startAt_targetYear = 2022;
  const startAt_targetMonth = 1;
  const endAt_targetYear = 2023;
  const endAt_targetMonth = 1;

  // ターゲットとの年と月の差を計算
  const startAt_yearDifference = currentYear - startAt_targetYear;
  const startAt_monthDifference = currentMonth - startAt_targetMonth;
  const endAt_yearDifference = currentYear - endAt_targetYear;
  const endAt_monthDifference = currentMonth - endAt_targetMonth;

  // 開始カレンダーの入力フィールドをクリック
  const startCalendarField = page.locator('input[name="startAt"]');
  await startCalendarField.scrollIntoViewIfNeeded();
  await startCalendarField.waitFor({ state: "visible" });
  await startCalendarField.click();
  await calendarLocator.waitFor({ state: "visible" });

  // 年調整ボタンをクリック
  await previousYearLocator.click({
    clickCount: startAt_yearDifference,
  });

  // 月調整ボタンをクリック
  await previousMonthLocator.click({
    clickCount: startAt_monthDifference,
  });

  // 開始カレンダーの日付をクリック
  await page.waitForSelector('div[aria-label="Choose 2022年1月1日土曜日"]', { state: "visible" });
  await page.getByLabel("Choose 2022年1月1日土曜日").click();

  // 開始カレンダーの入力フィールドの内容を確認
  await expect(startCalendarField).toHaveValue("2022/01/01");

  // 終了カレンダーの入力フィールドをクリック
  const endCalendarField = page.locator('input[name="endAt"]');
  await endCalendarField.scrollIntoViewIfNeeded();
  await endCalendarField.waitFor({ state: "visible" });
  await endCalendarField.click();
  await calendarLocator.waitFor({ state: "visible" });

  // 年調整ボタンをクリック
  await previousYearLocator.click({
    clickCount: endAt_yearDifference,
  });

  // 月調整ボタンをクリック
  await previousMonthLocator.click({
    clickCount: endAt_monthDifference,
  });

  // 終了カレンダーの日付をクリック
  await page.waitForSelector('div[aria-label="Choose 2023年1月1日日曜日"]', { state: "visible" });
  await page.getByLabel("Choose 2023年1月1日日曜日").click();

  // 終了カレンダーの入力フィールドの内容を確認
  await expect(endCalendarField).toHaveValue("2023/01/01");

  // フィルタ―後のアイテム件数の確認
  filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計9件");

  // 活動月のチェックボックスのロケータ
  const monthCheckboxLocator = [
    page.locator("#Month_checkbox_1"),
    page.locator("#Month_checkbox_2"),
    page.locator("#Month_checkbox_4"),
  ];

  // 活動月のチェックボックスをクリック
  for (let index = 0; index < monthCheckboxLocator.length; index++) {
    await monthCheckboxLocator[index].scrollIntoViewIfNeeded();
    await monthCheckboxLocator[index].waitFor({ state: "visible" });
    await monthCheckboxLocator[index].click();
  }

  // フィルタ―後のアイテム件数の確認
  filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計5件");

  // 活動タイプのチェックボックスをクリック
  const typeCheckboxLocator = page.locator("#Type_checkbox_12");
  await typeCheckboxLocator.scrollIntoViewIfNeeded();
  await typeCheckboxLocator.waitFor({ state: "visible" });
  await typeCheckboxLocator.click();

  // フィルタ―後のアイテム件数の確認
  filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計0件");

  // 検索結果がゼロ件のメッセージ確認
  await expect(page.locator('[class*="UserActivityList__FilterMessage"]')).toHaveText(
    "該当する活動日記はありません。",
  );

  // フィルタ―後のクエリ文字列の確認
  await expect(page).toHaveURL(
    "/users/0002?type=12&month=1%2C2%2C4&end_at=1672498800000&start_at=1640962800000&prefecture_names=%E4%BD%90%E8%B3%80#tabs",
  );
});
