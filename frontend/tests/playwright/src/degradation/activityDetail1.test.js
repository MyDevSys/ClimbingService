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

test("活動詳細：ヘッダーの内容", async () => {
  const expectImg = ["icon.webp"];
  const imgCheckClassName = ["UserAvatarImage__Avatar"];
  const iconCheckClassName = ["ActivityDetailTabLayout__UserTypeMark"];
  const textCheckClassName = [
    "ActivityDetailTabLayout__Title",
    "ActivityDetailTabLayout__MapName",
    "ActivityDetailTabLayout__Middle__Date",
    "ActivityDetailTabLayout__Middle__Days",
    "ActivityDetailTabLayout__Middle__Prefecture__Wrapper",
    "ActivityDetailTabLayout__UserName",
  ];
  const expectText = [
    "宝満山",
    "宝満山・三郡山・若杉山",
    "2023.12.29(金)",
    "日帰り",
    "福岡",
    "カズヤ",
  ];
  const expectIcon = [
    "M51.1 26H33.4C32.6 26 32 26.6 32 27.4V68.5C32 69.3 32.6 69.9 33.4 69.9H42.4C43.2 69.9 43.8 69.3 43.8 68.5V55.5H51.1C60.2 55.5 65.8 49.9 65.8 40.8C65.8 31.7 60.3 26 51.1 26ZM48.7 46.5H43.9V35H48.7C52.2 35 54.4 37.2 54.4 40.7C54.4 44.3 52.3 46.5 48.7 46.5Z",
  ];

  // テキスト要素の確認
  for (let index = 0; index < textCheckClassName.length; index++) {
    const target = page.locator(`[class*="${textCheckClassName[index]}"]`);
    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ state: "visible" });

    // テキストの内容を取得して検証
    const textContent = await target.textContent();
    expect(textContent).toEqual(expectText[index]);
  }

  // 画像要素の確認
  for (let index = 0; index < imgCheckClassName.length; index++) {
    const target = page.locator(`[class*="${imgCheckClassName[index]}"]`);
    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ state: "visible" });

    // 画像のsrc属性を取得して検証
    const imgSrc = await target.getAttribute("src");
    expect(imgSrc).toContain(expectImg[index]);
  }

  // アイコン(svg path)要素の確認
  for (let index = 0; index < iconCheckClassName.length; index++) {
    const target = page.locator(`[class*="${iconCheckClassName[index]}"] path`).nth(-1);
    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ state: "visible" });

    // path要素のd属性を取得して検証
    const dAttribute = await target.getAttribute("d");
    expect(dAttribute).toEqual(expectIcon[index]);
  }
});

test("活動詳細：タブの切り替え", async () => {
  const tab_activity = page.locator(`a[class*="ActivityDetail__TabItem"]`).nth(0);
  const tab_diary = page.locator(`a[class*="ActivityDetail__TabItem"]`).nth(1);
  const locator = [tab_activity, tab_diary];
  for (let index = 0; index < locator.length; index++) {
    await locator[index].scrollIntoViewIfNeeded();
    await locator[index].waitFor({ state: "visible" });
  }

  // 活動データのタブがアクティブかどうかを確認
  let classAttribute = await tab_activity.getAttribute("class");
  expect(classAttribute).toContain("is-active");

  // クリックするタグの順番
  const clickTab = [tab_diary, tab_activity];

  // 想定しているタグクリック後のURL
  const expectUrt = ["/activities/0027/articles", "/activities/0027"];

  // タブのクリック確認試験
  for (let index = 0; index < clickTab.length; index++) {
    // タブをクリック
    await clickTab[index].click();

    // すべてのネットワークリクエストが完了するまで待機
    await page.waitForLoadState("networkidle");

    // タブクリック後のURLの確認
    await expect(page).toHaveURL(expectUrt[index]);

    // クリックしたタブがアクティブかどうかを確認
    classAttribute = await clickTab[index].getAttribute("class");
    expect(classAttribute).toContain("is-active");
  }
});

test("活動詳細：活動データの内容", async () => {
  const targetClassName = "ActivityRecord__Score";
  const expectText = ["05:03", "5.9km", "710m", "710m", "1402kcal"];

  for (let index = 0; index < 5; index++) {
    const target = page.locator(`p[class*="${targetClassName}"]`).nth(index);
    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ state: "visible" });

    // テキストの内容を取得して検証
    const textContent = await target.textContent();
    expect(textContent).toEqual(expectText[index]);
  }
});

test("活動詳細：活動スコアの内容", async () => {
  const targetClassName = [
    "CourseConstant__CalculateBy",
    "CourseConstant__DifficultyLevel",
    "CourseConstant__Value",
    "ActivityPace__Status",
    "ActivityPace__Rate",
  ];

  const expectText = ["標準タイム 03:50で算出", "ふつう", "14", "やや速い", "110~130%"];

  for (let index = 0; index < targetClassName.length; index++) {
    const target = page.locator(`p[class*="${targetClassName[index]}"]`);
    await target.scrollIntoViewIfNeeded();
    await target.waitFor({ state: "visible" });

    // テキストの内容を取得して検証
    const textContent = await target.textContent();
    expect(textContent).toEqual(expectText[index]);
  }
});

test("活動詳細：地図への表示内容とボタン操作", async () => {
  const map = page.locator('[class*="ActivitiesId__Map__Outer"]');
  await map.scrollIntoViewIfNeeded();
  await map.waitFor({ state: "visible" });

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
  for (let index = 0; index < defaultIcon.length; index++) {
    const imgElement = map.locator(`img[src*="${defaultIcon[index]}"]`);
    await imgElement.scrollIntoViewIfNeeded();
    await expect(imgElement).toBeVisible();
  }

  // デフォルトアイコン(神社)のポップアップを開く
  const clickIcon = map.locator(`img[src*="${defaultIcon[3]}"]`);
  await clickIcon.scrollIntoViewIfNeeded();
  await clickIcon.waitFor({ state: "visible" });
  await clickIcon.click();

  // ポップアップの表示を待つ
  const popup = map.locator('div[class*="landmarkPopup--center"]');
  await popup.scrollIntoViewIfNeeded();
  await popup.waitFor({ state: "visible" });

  // ポップアップのタイトルの確認
  const popupTitle = map.locator('span[class*="landmarkPopup__title"]');
  const textContent = await popupTitle.textContent();
  expect(textContent).toEqual("竈門神社");

  // ポップアップのテキスト内容の確認
  const popupTimeText = ["08:16 - 08:22", "13:03 - 13:04"];
  for (let index = 0; index < popupTimeText.length; index++) {
    const popupTime = map.locator('div[class*="landmarkPopup--center"] time').nth(index);
    const textContent = await popupTime.textContent();
    expect(textContent).toEqual(popupTimeText[index]);
  }

  // ポップアップを閉じる
  await clickIcon.click();

  // 地図に表示されるボタンのロケーター
  const paceButton = map.locator(`button[aria-label="走行ペース"]`);
  const photoButton = map.locator(`button[aria-label="撮影ポイント"]`);
  const restButton = map.locator(`button[aria-label="休憩ポイント"]`);
  const zoomInButton = map.locator(`button[aria-label="拡大"]`);
  const zoomOutButton = map.locator(`button[aria-label="縮小"]`);

  // アクティブ表示するボタン
  const activeButtons = [paceButton, photoButton, restButton];

  // ボタンを全てONにした場合にアクティブ表示になることを確認
  for (const buttonElement of activeButtons) {
    await buttonElement.waitFor({ state: "visible" });
    await buttonElement.click();
    const className = await buttonElement.getAttribute("class");
    expect(className).toContain("button--on");
  }

  // ページリロードした後もアクティブ表示が維持することを確認
  await page.reload();
  for (const buttonElement of activeButtons) {
    await buttonElement.waitFor({ state: "visible" });
    const className = await buttonElement.getAttribute("class");
    expect(className).toContain("button--on");
  }

  // ボタンを全てOFFにした場合にアクティブ表示にならないことを確認
  for (const buttonElement of activeButtons) {
    await buttonElement.click();
    const className = await buttonElement.getAttribute("class");
    expect(className).toContain("button--off");
  }

  // 走行ペースボタンをON
  await paceButton.click();

  // 走行ペースボタンをONした時にペースバーが表示されることを確認
  const paceBar = map.locator('div[class*="PaceColorBar__barContainer"]');
  await expect(paceBar).toBeVisible();

  // 走行ペースボタンをONした時に走行ペース値で着色したルートが表示されることを確認
  const pathElements = page.locator('path[class*="leaflet-interactive"]');
  const pathCount = await pathElements.count();
  for (let index = 2; index < pathCount; index++) {
    const pathElement = pathElements.nth(index);
    const visibility = await pathElement.evaluate((el) => {
      return window.getComputedStyle(el).visibility;
    });
    expect(visibility).toBe("visible");
  }

  // 走行ペースボタンをOFF
  await paceButton.click();

  // 走行ペースボタンをOFFした時にペースバーが表示されないことを確認
  await expect(paceBar).not.toBeVisible();

  // 走行ペースボタンをOFFした時に走行ペース値で着色したルートが表示されないことを確認
  for (let index = 2; index < pathCount; index++) {
    const pathElement = pathElements.nth(index);
    const visibility = await pathElement.evaluate((el) => {
      return window.getComputedStyle(el).visibility;
    });
    expect(visibility).toBe("hidden");
  }

  // 試験対象のボタン
  const targetButton = [photoButton, restButton];
  // ボタンON時に表示されれるアイコンファイル名
  const activityIcon = ["icon_camera.png", "icon_rest.svg"];
  // 各試験対象ボタンのON/OFF時のアイコンの数
  const iconNum = [
    [3, 0], // photoButton
    [7, 0], // restButton
  ];

  // 撮影ポイント/休憩ポイントボタンをON/OFFした際のアイコンの数を確認
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

    // 撮影ポイントボタンをONにした際に表示される1番目のアイコンのポップアップの確認試験
    if (i === 0) {
      // 撮影ポイントのボタンをON
      await panelButton.click();

      // １番目のアイコンをクリック
      const photoIconElements = map.locator(`img[src*="${activityIcon[i]}"]`);
      const photoElementFirst = photoIconElements.first();
      await photoElementFirst.click();

      // ポップアップの表示待ち
      const photPopupElement = map.locator('div.leaflet-popup[class*="landmarkPopup__photo"]');
      await photPopupElement.waitFor({ state: "visible" });

      // ポップアップのインデックス値を確認
      const photoPopupIndex = await photPopupElement.locator(
        'div[class*="landmarkPopup__photo__index"]',
      );
      const indexContent = await photoPopupIndex.textContent();
      expect(indexContent).toEqual("1/3");

      // ボップアップに想定した画像ファイルが表示されることを確認
      const photoImgElement = map.locator('a[style*="photo_0027_01_1722765280.webp"]');
      await photoImgElement.scrollIntoViewIfNeeded();
      await expect(photoImgElement).toBeVisible();

      // ボップアップのキャプション内容を確認
      const photoPopupCaption = await photPopupElement.locator(
        'div[class*="landmarkPopup__photo__caption"]',
      );
      const textContent = await photoPopupCaption.textContent();
      expect(textContent).toEqual("10:06百段ガンギ");

      // 撮影ポイントのボタンをOFF
      await panelButton.click();
    }
    // 休憩ポイントボタンをONにした際に表示される1番目のアイコンのポップアップの確認試験
    else if (i === 1) {
      // 休憩ポイントのボタンをON
      await panelButton.click();

      // １番目のアイコンをクリック
      const restIconElements = map.locator(`img[src*="${activityIcon[i]}"]`);
      const restIconElementFirst = restIconElements.first();
      await restIconElementFirst.click();

      // ポップアップの表示待ち
      const restPopupElement = map.locator('div.leaflet-popup[class*="landmarkPopup__rest"]');
      await restPopupElement.waitFor({ state: "visible" });

      // ポップアップのタイトルを確認
      const restPopupTitle = await restPopupElement
        .locator('div[class*="ActivityMap_landmarkPopup--left"] div')
        .nth(0);
      const restContent = await restPopupTitle.textContent();
      expect(restContent).toEqual("休憩時間 : 6分");

      // ポップアップの文章を確認
      const restPopupText = await restPopupElement
        .locator('div[class*="ActivityMap_landmarkPopup--left"] div')
        .nth(1);
      const textContent = await restPopupText.textContent();
      expect(textContent).toEqual("2023.12.29(金) 08:41");

      // 休憩ポイントのボタンをOFF
      await panelButton.click();
    }
  }

  // ズームする前の地図のズーム値を取得
  const initialZoomValue = await page.evaluate(() => {
    return window.activityMap.getZoom();
  });

  // 試験でzoomボタンをONする順番
  const zoomButton = [zoomInButton, zoomOutButton];

  // 各zoomボタンをONにした際の初期値ズーム値との差分値
  const zoomValueDiff = [1.0, 0.0];

  // zoomボタンを押した際の地図のズーム値が想定通りに変化していることを確認
  for (let index = 0; index < zoomButton.length; index++) {
    // zoomボタンをクリック
    await zoomButton[index].click();

    // ズームが完了するまで待機
    await page.evaluate(() => {
      return new Promise((resolve) => {
        window.activityMap.once("zoomend", resolve);
      });
    });

    // ズーム後のズーム値を取得
    const zoomValue = await page.evaluate(() => {
      return window.activityMap.getZoom();
    });

    // ズーム後のズーム値が想定通りか確認
    expect(zoomValue).toEqual(initialZoomValue + zoomValueDiff[index]);
  }
});

test("活動詳細：パンくずリストのページ遷移", async () => {
  const breadcrumbsLink = page.locator('a[class*="Breadcrumbs__Link"]');
  await breadcrumbsLink.scrollIntoViewIfNeeded();
  await breadcrumbsLink.waitFor({ state: "visible" });
  await breadcrumbsLink.click();

  // すべてのネットワークリクエストが完了するまで待機
  await page.waitForLoadState("networkidle");

  // 活動リストのURLの確認
  await expect(page).toHaveURL("/users/0002");
});
