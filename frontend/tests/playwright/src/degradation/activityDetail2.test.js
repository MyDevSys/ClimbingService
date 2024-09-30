import { test, expect } from "@playwright/test";
import { calculateChecksum } from "./utils/checksum";
import { deleteFile } from "./utils/file";

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
});

// 各テストの後にクリーンアップ
test.afterAll(async () => {
  await context.close();
});

test("活動詳細：グラフの切り換えとホバー動作", async () => {
  // グラフが描画されていることを確認
  const chart = page.locator('[class*="ElevationChart__Container"]');
  await chart.scrollIntoViewIfNeeded();
  await expect(chart).toBeVisible();

  // チャートのタブラベル
  const chartTabLabel = ["距離", "行動時間", "日時"];

  // ツールチップに表示するテキスト内容
  const expectTooltipText = [
    ["796", "2.7"],
    ["753", "104"],
    ["817", "10:45"],
  ];

  // チャートのタブをクリックした後のチャートのツールチップの内容を確認
  for (let i = 0; i < chartTabLabel.length; i++) {
    const tabElement = page.locator(`button[aria-label="${chartTabLabel[i]}"]`);
    await tabElement.waitFor({ state: "visible" });
    await tabElement.click();

    for (let j = 0; j < 2; j++) {
      await chart.hover();
      const tooltipValueElement = page.locator('[class*="Tooltip__Value"]').nth(j);
      await tooltipValueElement.waitFor({ state: "visible" });
      const tooltipText = (await tooltipValueElement.textContent()).trim();
      expect(tooltipText).toEqual(expectTooltipText[i][j]);
    }
  }
});

test("活動詳細：その他情報の内容", async () => {
  // 確認対象の要素のクラス名
  const targetClassNames = [
    "ActivitiesId__Misc__MountainName",
    "ActivitiesId__Misc__Plan",
    "ActivitiesId__Misc__Tags",
  ];

  // 各要素に表示される内容
  const expectTargetText = ["宝満山", "提出済み", "登山低山"];

  // 各要素の表示内容を確認
  for (let index = 0; index < targetClassNames.length; index++) {
    const targetElement = page.locator(`[class*="${targetClassNames[index]}"]`);
    await targetElement.scrollIntoViewIfNeeded();
    await targetElement.waitFor({ state: "visible" });
    expect(targetElement).toHaveText(expectTargetText[index]);
  }

  // ダウンロードボタンの表示待ち
  const downloadButton = page.locator('[class*="ActivitiesId__Misc__DownloadButton"]');
  await downloadButton.scrollIntoViewIfNeeded();
  await downloadButton.waitFor({ state: "visible" });

  const [download] = await Promise.all([
    // ダウンロードイベントを待機
    page.waitForEvent("download"),

    // ダウンロードをボタンをクリック
    await downloadButton.click(),
  ]);

  // ダウンロードが完了するまで待機し、パスを取得
  const downloadPath = await download.path();

  // ダウンロードが成功したか確認
  expect(downloadPath).not.toBeNull();

  // ダウンロードパスが存在することを確認
  expect(downloadPath).not.toBeNull();

  // ダウンロードされたファイルのチェックサムを計算
  const actualChecksum = await calculateChecksum(downloadPath);

  // チェックサムが一致することを確認
  expect(actualChecksum).toBe("d0f38adc140f9e8e2405c6abd75c53eb17d4c889b46d8932f4a3d2fb76aa3122");

  // 試験後、ファイルを削除
  await deleteFile(downloadPath);
});

test("活動詳細：チェックポイントの内容", async () => {
  // チェックポイントのヘッダーに表示される要素のクラス名
  const headerClassNames = [
    "CourseTimeItem__Total__Time",
    "CourseTimeItem__Total__RestTime",
    "CourseTimeItem__Total__Distance",
    "CourseTimeItem__Total__Cumulative",
  ];

  // 各ヘッダーの要素に表示される内容
  const expectHeaderText = ["5時間3分", "1時間28分", "5.9km", "710/710m"];

  // チェックポイントのヘッダーの表示内容を確認
  for (let index = 0; index < headerClassNames.length; index++) {
    const targetElement = page.locator(`[class*="${headerClassNames[index]}"]`);
    await targetElement.scrollIntoViewIfNeeded();
    await targetElement.waitFor({ state: "visible" });
    const textContent = await targetElement.textContent();
    expect(textContent).toEqual(expectHeaderText[index]);
  }

  // チェックポイントの走行情報の表示内容を確認
  const targetElement = page.locator('[class*="CourseTimeItem__PassedPoints"]');
  await targetElement.scrollIntoViewIfNeeded();
  await targetElement.waitFor({ state: "visible" });
  const textContent = await targetElement.textContent();
  expect(textContent).toEqual(
    "08:1408:141内山08:1608:22竈門神社08:2208:242宝満山登山口10:2410:453宝満山10:4911:30130宝満山楞伽院山荘13:0113:021宝満山登山口13:032竈門神社13:0613:16内山13:16",
  );
});

test("活動詳細：活動詳細の内容", async () => {
  //「すべて見る」リンクの表示待ち
  const readMoreLink = page.locator(`[class*="ActivitiesId__Heading__ReadMore"]`);
  await readMoreLink.scrollIntoViewIfNeeded();
  await readMoreLink.waitFor({ state: "visible" });

  //「すべて見る」リンクをクリック
  await readMoreLink.click();

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  //「すべて見る」リンクのリンク先URLの確認
  await expect(page).toHaveURL("/activities/0027/articles");

  // 前のページに戻る
  await page.goBack();

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // 活動文章の表示待ち
  const activityText = page.locator(`[class*="ActivitiesId__Description__Body"]`);
  await activityText.scrollIntoViewIfNeeded();
  await activityText.waitFor({ state: "visible" });

  // 活動文章の確認
  const textContent = await activityText.textContent();
  expect(textContent).toEqual(
    "宝満山の山中には、数々の史跡が点在し、果てしなく続く100段ガンギ（石段）を登りたどり着いた山頂に竈門神社の上宮がある。頂上からは市街を見下ろす絶景が素晴らしく、また春の新緑、秋の紅葉と四季折々の景色が美しいことから一年を通して多くの登山客が訪れる。",
  );

  // 活動写真に想定した写真ファイルが表示されていることを確認
  const photoImages = [
    "photo_0027_01_1722765280.webp",
    "photo_0027_02_1722765280.webp",
    "photo_0027_03_1722765280.webp",
  ];
  const photoElements = page.locator('[class*="ActivitiesId__Photos"] img');
  const photoCount = await photoElements.count();
  for (let i = 0; i < photoCount; i++) {
    const src = await photoElements.nth(i).getAttribute("src");
    const isExist = src.includes(photoImages[i]);
    expect(isExist).toBe(true);
  }

  // 活動写真のリンク先の確認
  const expectLinkUrl = [
    "/activities/0027/articles#photo_0027_01_1722765280",
    "/activities/0027/articles#photo_0027_02_1722765280",
    "/activities/0027/articles#photo_0027_03_1722765280",
  ];

  for (let index = 0; index < expectLinkUrl.length; index++) {
    // 活動写真をクリック
    await photoElements.nth(index).click();

    // すべてのネットワークリクエストが完了するまで待機
    await page.waitForLoadState("networkidle");

    // 活動写真のリンク先URLの確認
    await expect(page).toHaveURL(expectLinkUrl[index]);

    // 前のページに戻る
    await page.goBack();

    // すべてのネットワークリクエストが完了するまで待機
    await page.waitForLoadState("networkidle");
  }
});

test("活動詳細：メニュー操作", async () => {
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
