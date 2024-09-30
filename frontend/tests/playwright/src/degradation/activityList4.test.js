import { test, expect } from "@playwright/test";

test("活動リスト：リストフィルターのリロード機能", async ({ page }) => {
  // 認証情報
  const EMAIL = process.env.TEST_EMAIL;
  const PASSWORD = process.env.TEST_PASSWORD;

  // 検索の入力フィールドに設定する文字列
  const SEARCH_STR = "高良山・発心山・鷹取山";

  // 開始/終了カレンダーの入力フィールドに設定する日付
  const START_DATE = "2023/01/01";
  const END_DATE = "2024/01/01";

  // ログインページにアクセス
  await page.goto("/login");

  // Emailとパスワードを入力
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);

  //「ログイン」ボタンをクリック
  await page.click('button[type="submit"]');

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // 検索の入力フィールドをクリック
  const searchField = page.locator('input[name="search"]');
  await searchField.click();

  // 検索キーワードの入力
  await searchField.fill(SEARCH_STR);

  // 検索キーワードをリストから選択
  await page.waitForSelector(`text="${SEARCH_STR}"`, { state: "visible" });
  const targetSearchItem = page.getByText(SEARCH_STR, { exact: true });
  await targetSearchItem.scrollIntoViewIfNeeded();
  await targetSearchItem.waitFor({ state: "visible" });
  await targetSearchItem.click();

  // 選択した検索キーワードの確認
  let keywordContent = await page.locator('[class*="Autocomplete__Keyword__Text"]').textContent();
  expect(keywordContent).toEqual(SEARCH_STR);

  // フィルタ―後のアイテム件数の確認
  const itemCounterLocator = page.locator('[class*="Pagination__text"]');
  let filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計2件");

  // 開始カレンダーの入力フィールドに日付を入力
  const startCalendarField = page.locator('input[name="startAt"]');
  await startCalendarField.scrollIntoViewIfNeeded();
  await startCalendarField.waitFor({ state: "visible" });
  await startCalendarField.click();
  await startCalendarField.fill(START_DATE);

  // 開始カレンダーの日付をクリック
  await page.waitForSelector('div[aria-label="Choose 2023年1月1日日曜日"]', { state: "visible" });
  await page.getByLabel("Choose 2023年1月1日日曜日").click();

  // 終了カレンダーの入力フィールドに日付を入力
  const endCalendarField = page.locator('input[name="endAt"]');
  await endCalendarField.scrollIntoViewIfNeeded();
  await endCalendarField.waitFor({ state: "visible" });
  await endCalendarField.click();
  await endCalendarField.fill(END_DATE);

  // 終了カレンダーの日付をクリック
  await page.waitForSelector('div[aria-label="Choose 2024年1月1日月曜日"]', { state: "visible" });
  await page.getByLabel("Choose 2024年1月1日月曜日").click();

  // 活動月のチェックボックスをクリック
  const monthCheckBox = page.locator("#Month_checkbox_3");
  await monthCheckBox.scrollIntoViewIfNeeded();
  await monthCheckBox.waitFor({ state: "visible" });
  await monthCheckBox.click();

  // 活動タイプのチェックボックスをクリック
  const typeCheckBox = page.locator("#Type_checkbox_0");
  await typeCheckBox.scrollIntoViewIfNeeded();
  await typeCheckBox.waitFor({ state: "visible" });
  await typeCheckBox.click();

  // フィルタ―後のアイテム件数の確認
  filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計1件");

  // ページリロード
  await page.reload();

  // リロード後の検索キーワードの確認
  keywordContent = await page.locator('[class*="Autocomplete__Keyword__Text"]').textContent();
  expect(keywordContent).toEqual(SEARCH_STR);

  // リロード後の開始カレンダーの入力フィールドの確認
  await expect(startCalendarField).toHaveValue(START_DATE);

  // リロード後の終了カレンダーの入力フィールドの確認
  await expect(endCalendarField).toHaveValue(END_DATE);

  // リロード後の活動月チェックボックスのチェック項目の確認
  await expect(monthCheckBox).toBeChecked();

  // リロード後の活動タイプチェックボックスのチェック項目の確認
  await expect(typeCheckBox).toBeChecked();

  // リロード後のアイテム件数の確認
  filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計1件");

  // 検索フィールドのキーワードの削除ボタンで削除されることを確認
  const searchItemRemoveButton = page.locator('button[aria-label="フィルタ―キーワード削除"]');
  await searchItemRemoveButton.scrollIntoViewIfNeeded();
  await searchItemRemoveButton.waitFor({ state: "visible" });
  await searchItemRemoveButton.click();
  await expect(searchItemRemoveButton).toHaveCount(0);

  // 開始カレンダーのクリアボタンでクリアされることを確認
  const startCalendarRemoveButton = page.locator("input#startAt + button");
  await startCalendarRemoveButton.scrollIntoViewIfNeeded();
  await startCalendarRemoveButton.waitFor({ state: "visible" });
  await startCalendarRemoveButton.click();
  await expect(startCalendarField).toHaveValue("");

  // 終了カレンダーのクリアボタンでクリアされることを確認
  const endCalendarRemoveButton = page.locator("input#endAt + button");
  await endCalendarRemoveButton.scrollIntoViewIfNeeded();
  await endCalendarRemoveButton.waitFor({ state: "visible" });
  await endCalendarRemoveButton.click();
  await expect(endCalendarField).toHaveValue("");

  // 活動月のチェックボックスを再クリックしてチェックが消えることを確認
  await monthCheckBox.scrollIntoViewIfNeeded();
  await monthCheckBox.waitFor({ state: "visible" });
  await monthCheckBox.click();
  await expect(monthCheckBox).not.toBeChecked();

  // 活動タイプのチェックボックスを再クリックしてチェックが消えることを確認
  await typeCheckBox.scrollIntoViewIfNeeded();
  await typeCheckBox.waitFor({ state: "visible" });
  await typeCheckBox.click();
  await expect(typeCheckBox).not.toBeChecked();

  // フィルタ―解除後のクエリ文字列の確認
  await expect(page).toHaveURL("/users/0002#tabs");

  // フィルタ―解除後のアイテム件数の確認
  filteredContent = await itemCounterLocator.textContent();
  expect(filteredContent).toEqual("総計27件");
});
