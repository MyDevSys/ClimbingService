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

  // 宝満山の活動詳細の1番目のサムネイル画像をクリック
  const activityItem = page.locator('img[alt="宝満山"]').first();
  await activityItem.scrollIntoViewIfNeeded();
  await activityItem.waitFor({ state: "visible" });
  await activityItem.click();

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // 活動詳細のURLの確認
  await expect(page).toHaveURL("/activities/0027");

  // 日記タブをクリック
  const tab_diary = page.locator(`a[class*="ActivityDetail__TabItem"]`).nth(1);
  await tab_diary.scrollIntoViewIfNeeded();
  await tab_diary.waitFor({ state: "visible" });
  await tab_diary.click();

  // 日記タブのURLの確認
  await expect(page).toHaveURL("/activities/0027/articles");
});

// 各テストの後にクリーンアップ
test.afterAll(async () => {
  await context.close();
});

test("活動日記：活動日記の内容", async () => {
  // 日記の文章内容を確認
  const diaryText = page.locator('p[class*="Article__Description"]');
  await diaryText.scrollIntoViewIfNeeded();
  await diaryText.waitFor({ state: "visible" });
  const textContent = await diaryText.textContent();
  expect(textContent).toEqual(
    "宝満山の山中には、数々の史跡が点在し、果てしなく続く100段ガンギ（石段）を登りたどり着いた山頂に竈門神社の上宮がある。頂上からは市街を見下ろす絶景が素晴らしく、また春の新緑、秋の紅葉と四季折々の景色が美しいことから一年を通して多くの登山客が訪れる。",
  );

  // 日記に想定した写真ファイルが表示されていることを確認
  const photoImages = [
    "photo_0027_01_1728047971.webp",
    "photo_0027_02_1728047971.webp",
    "photo_0027_03_1728047971.webp",
  ];
  const photoElements = page.locator('[class*="Article__Photos"] img');
  const photoCount = await photoElements.count();
  for (let i = 0; i < photoCount; i++) {
    const src = await photoElements.nth(i).getAttribute("src");
    const isExist = src.includes(photoImages[i]);
    expect(isExist).toBe(true);
  }

  // 写真のインデックスの確認
  const photoIndex = ["1/3", "2/3", "3/3"];
  for (let i = 0; i < photoIndex.length; i++) {
    const photoIndexElement = page
      .locator('[class*="ImagesGalleryList__Caption__OnList__Count"]')
      .nth(i);
    await photoIndexElement.scrollIntoViewIfNeeded();
    await photoIndexElement.waitFor({ state: "visible" });
    const textContent = await photoIndexElement.textContent();
    expect(textContent).toEqual(photoIndex[i]);
  }

  // 写真のタイムスタンプの確認
  const photoTimestamp = ["2023.12.29(金) 10:06", "2023.12.29(金) 10:51", "2023.12.29(金) 10:52"];
  for (let i = 0; i < photoTimestamp.length; i++) {
    const photoTimestampElement = page
      .locator('[class*="ImagesGalleryList__Caption__OnList__Date"]')
      .nth(i);
    await photoTimestampElement.scrollIntoViewIfNeeded();
    await photoTimestampElement.waitFor({ state: "visible" });
    const textContent = await photoTimestampElement.textContent();
    expect(textContent).toEqual(photoTimestamp[i]);
  }

  // 写真のDomoポイントを送信したユーザ人数の確認
  const domoSendUser = ["0人", "0人", "0人"];
  for (let i = 0; i < domoSendUser.length; i++) {
    const domoContainerElement = page
      .locator('[class*="ImagesGalleryList__Caption__OnList__Domo"]')
      .nth(i);
    const domoIconElement = domoContainerElement.locator(
      'span[class*="DomoActionContainer__DomoIcon"]',
    );
    await expect(domoIconElement).toBeVisible();

    const domoUserElement = page.locator('[class*="ImagesGalleryList__DomoUser"]').nth(i);
    await domoUserElement.scrollIntoViewIfNeeded();
    await domoUserElement.waitFor({ state: "visible" });
    const textContent = await domoUserElement.textContent();
    expect(textContent).toEqual(domoSendUser[i]);
  }

  // 写真のテキストの確認
  const photoText = ["百段ガンギ", "宝満山頂上", "宝満山の頂上の景観"];
  for (let i = 0; i < photoText.length; i++) {
    const photoTextElement = page
      .locator('[class*="ImagesGalleryList__Caption__OnList__Caption"]')
      .nth(i);
    await photoTextElement.scrollIntoViewIfNeeded();
    await photoTextElement.waitFor({ state: "visible" });
    const textContent = await photoTextElement.textContent();
    expect(textContent).toEqual(photoText[i]);
  }
});
