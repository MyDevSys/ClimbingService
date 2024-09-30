import { test, expect } from "@playwright/test";

let context;
let page;

// 初期化処理：すべてのテストの前に認証を行う
test.beforeAll(async ({ browser }) => {
  const EMAIL = "user1@example.com";
  const PASSWORD = "qnusxt2q";

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
});

// 各テストの後にクリーンアップ
test.afterAll(async () => {
  await context.close();
});

test("活動リストの確認", async () => {
  // 活動リストのURLの確認
  await expect(page).toHaveURL("/users/0002");

  // プロフィール表示の確認（ユーザーID）
  const userId = await page.locator('[class*="UserType__Id"] p').textContent();
  expect(userId).toEqual("ユーザーID:0002");

  // 1ページ目の活動アイテム件数の確認
  const page1_ItemCount = await page.locator('[class*="UserActivityList__Item"]').count();
  expect(page1_ItemCount).toBe(15);

  // １ページ目の最初のアイテムの表示内容の確認
  const page1_firstItem = await page
    .locator('[class*="UserActivityList__Item"]:nth-child(1)')
    .textContent();
  expect(page1_firstItem).toEqual(
    "31105:035.9 km710 m宝満山宝満山・三郡山・若杉山(福岡)2023.12.29(金)日帰りカズヤ",
  );

  // 登山記録タブクリック後のURLの確認
  await page.locator('[class*="UsersId__Tab__Link"]').nth(1).click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL("/users/0002?tab=achievements#tabs");

  // 1行目のテーブルの内容の確認
  const firstTableRowLocator = 'tr[data-item-index="0"]';
  const firstRow = await page.locator(firstTableRowLocator).textContent();
  expect(firstRow).toEqual("宝満山(福岡)宝満山福岡5829 m");

  // 日本地図の佐賀をクリックした後の1行目のテーブルの内容の確認
  const sagLocator = "path#saga";
  await page.locator(sagLocator).click();
  const filteredFirstRow = await page.locator(firstTableRowLocator).textContent();
  expect(filteredFirstRow).toEqual("九千部山(福岡、佐賀)九千部山福岡、佐賀2847 m");

  // 活動日記タブの遷移先のURL確認
  await page.locator('[class*="UsersId__Tab__Link"]').nth(0).click();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL("/users/0002?tab=activities#tabs");
});

test("活動詳細の確認", async () => {
  // 活動詳細の1番目のサムネイル画像をクリック
  const activityItem = page.locator('img[alt="宝満山"]').first();
  await activityItem.scrollIntoViewIfNeeded();
  await activityItem.waitFor({ state: "visible" });
  await activityItem.click();

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // 活動詳細のURLの確認
  await expect(page).toHaveURL("/activities/0027");

  // ヘッダーのテキスト要素の確認
  const headerClassName = [
    "ActivityDetailTabLayout__Title",
    "ActivityDetailTabLayout__MapName",
    "ActivityDetailTabLayout__Middle__Date",
    "ActivityDetailTabLayout__Middle__Days",
    "ActivityDetailTabLayout__Middle__Prefecture__Wrapper",
    "ActivityDetailTabLayout__UserName",
  ];
  const expectHeaderText = [
    "宝満山",
    "宝満山・三郡山・若杉山",
    "2023.12.29(金)",
    "日帰り",
    "福岡",
    "カズヤ",
  ];
  for (let index = 0; index < headerClassName.length; index++) {
    const target = page.locator(`[class*="${headerClassName[index]}"]`);
    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ state: "visible" });
    const textContent = await target.textContent();
    expect(textContent).toEqual(expectHeaderText[index]);
  }

  // 地図が表示されていることを確認
  const map = page.locator('[class*="ActivitiesId__Map__Outer"]');
  await map.scrollIntoViewIfNeeded();
  await expect(map).toBeVisible();

  // グラフが描画されていることを確認
  const chart = page.locator('[class*="ElevationChart__Container"]');
  await chart.scrollIntoViewIfNeeded();
  await expect(chart).toBeVisible();

  // 活動写真が表示されていることを確認
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
});

test("活動日記の確認", async () => {
  // 日記タブをクリック
  const tab_diary = page.locator(`a[class*="ActivityDetail__TabItem"]`).nth(1);
  await tab_diary.scrollIntoViewIfNeeded();
  await tab_diary.waitFor({ state: "visible" });
  await tab_diary.click();

  // 日記タブクリック後のURLの確認
  await expect(page).toHaveURL("/activities/0027/articles");

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
    "photo_0027_01_1722765280.webp",
    "photo_0027_02_1722765280.webp",
    "photo_0027_03_1722765280.webp",
  ];
  const photoElements = page.locator('[class*="Article__Photos"] img');
  const photoCount = await photoElements.count();
  for (let i = 0; i < photoCount; i++) {
    const src = await photoElements.nth(i).getAttribute("src");
    const isExist = src.includes(photoImages[i]);
    expect(isExist).toBe(true);
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

  // 活動データタブをクリック
  const tab_activity = page.locator(`a[class*="ActivityDetail__TabItem"]`).nth(0);
  await tab_activity.scrollIntoViewIfNeeded();
  await tab_activity.waitFor({ state: "visible" });
  await tab_activity.click();

  // 日記データタブクリック後のURLの確認
  await expect(page).toHaveURL("/activities/0027");
});

test("活動トラックの確認", async () => {
  // 地図の全面表示ボタンのクリックによって新しいタブが開くのを待つ
  const [newPage] = await Promise.all([
    page.waitForEvent("popup"),
    page.click('button[aria-label="全画面表示"]'), // ボタンをクリック
  ]);

  // すべてのネットワークリクエストが完了するまで待機
  await newPage.waitForLoadState("networkidle");

  // 活動詳細トラックのURLの確認
  await expect(newPage).toHaveURL("/activities/0027/tracks");

  // 地図に表示されるデフォルトアイコン
  const defaultIcon = [
    "icon_start.png",
    "icon_end.png",
    "icon_bus_stop.png",
    "icon_shrine.png",
    "icon_trailhead.png",
    "icon_summit.png",
    "icon_mountain_hut.png",
  ];

  // 地図内にデフォルトアイコンが表示されていることを確認
  const map = newPage.locator('div[class*="Activity__Map"]');
  for (let index = 0; index < defaultIcon.length; index++) {
    const imgElement = map.locator(`img[src*="${defaultIcon[index]}"]`);
    await imgElement.scrollIntoViewIfNeeded();
    await expect(imgElement).toBeVisible();
  }

  // 走行ペースボタンをON
  const paceButton = map.locator(`button[aria-label="走行ペース"]`);
  await paceButton.click();

  // 走行ペースボタンをONした時にペースバーが表示されることを確認
  const paceBar = map.locator('div[class*="PaceColorBar__barContainer"]');
  await expect(paceBar).toBeVisible();

  // 撮影ポイント/休憩ポイントボタンをON/OFFした際のアイコンの数を確認
  const photoButton = map.locator(`button[aria-label="撮影ポイント"]`);
  const restButton = map.locator(`button[aria-label="休憩ポイント"]`);
  const targetButton = [photoButton, restButton];
  const activityIcon = ["icon_camera.png", "icon_rest.svg"];
  const iconNum = [
    [3, 0], // photoButton
    [7, 0], // restButton
  ];
  for (let i = 0; i < targetButton.length; i++) {
    const panelButton = targetButton[i];
    await panelButton.scrollIntoViewIfNeeded();
    await panelButton.waitFor({ state: "visible" });
    // ボタンのON/OFFループ
    for (let j = 0; j < 2; j++) {
      await panelButton.click();
      // 表示されているアイコンの数をカウント
      const iconElements = map.locator(`img[src*="${activityIcon[i]}"]`);
      const imgCount = await iconElements.evaluateAll((elements) => {
        return elements.filter((el) => window.getComputedStyle(el).visibility !== "hidden").length;
      });
      // 表示されているアイコンの数を評価
      expect(imgCount).toEqual(iconNum[i][j]);
    }
  }

  // ズームする前の地図のズーム値を取得
  const initialZoomValue = await newPage.evaluate(() => {
    return window.activityMap.getZoom();
  });

  // zoomボタンを押した際の地図のズーム値が想定通りに変化していることを確認
  const zoomInButton = map.locator(`button[aria-label="拡大"]`);
  const zoomOutButton = map.locator(`button[aria-label="縮小"]`);
  const zoomButton = [zoomInButton, zoomOutButton];
  const zoomValueDiff = [1.0, 0.0]; // 各zoomボタンをONにした際の初期値ズーム値との差分値
  for (let index = 0; index < zoomButton.length; index++) {
    // zoomボタンをクリック
    await zoomButton[index].click();
    // ズームが完了するまで待機
    await newPage.evaluate(() => {
      return new Promise((resolve) => {
        window.activityMap.once("zoomend", resolve);
      });
    });
    // ズーム後のズーム値を取得
    const zoomValue = await newPage.evaluate(() => {
      return window.activityMap.getZoom();
    });
    // ズーム後のズーム値が想定通りか確認
    expect(zoomValue).toEqual(initialZoomValue + zoomValueDiff[index]);
  }
});
