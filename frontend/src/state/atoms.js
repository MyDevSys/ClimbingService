import { atom } from "recoil";

// Local Storageに保存しているボタンのON/OFF状態の適用
const TYPE_PACE = 1;
const TYPE_PHOTO = 2;
const TYPE_REST = 3;
const getDefaultButtonState = (type) => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("sharedButtonState");
    if (savedState) {
      const { state, expire } = JSON.parse(savedState);
      const currentTime = Date.now();
      if (currentTime > expire) {
        localStorage.removeItem("sharedButtonState");
      } else {
        if (type === TYPE_PACE) return state.pace;
        if (type === TYPE_PHOTO) return state.photo;
        if (type === TYPE_REST) return state.rest;
      }
    }
  }
  return false;
};

// 地図のコントロールパネル上のボタンのON/OFF状態(ペースボタン)
export const isPaceButtonOnState = atom({
  key: "isPaceButtonOn",
  default: getDefaultButtonState(TYPE_PACE),
});

// 地図のコントロールパネル上のボタンのON/OFF状態(写真ボタン)
export const isPhotoButtonOnState = atom({
  key: "isPhotoButtonOn",
  default: getDefaultButtonState(TYPE_PHOTO),
});

// 地図のコントロールパネル上のボタンのON/OFF状態(休憩ポイント)
export const isRestPointButtonOnState = atom({
  key: "isRestPointButtonOn",
  default: getDefaultButtonState(TYPE_REST),
});

// 地図の走行ルートと共有する座標ポイント情報
export const shareCoordinateState = atom({
  key: "shareCoordinate",
  default: null,
});

// 走行ルートの座標ポイント情報
export const routeCoordinateState = atom({
  key: "routeCoordinate",
  default: null,
});

// 走行ルートの平均ペース情報
export const routeAveragePaceState = atom({
  key: "routeAveragePace",
  default: null,
});

// 走行ルートのスポット情報
export const routeSpotsState = atom({
  key: "routeSpots",
  default: null,
});

// 走行ルートの休憩情報
export const routeRestPointsState = atom({
  key: "routeRestPoints",
  default: null,
});

// 走行ルートの写真情報
export const routePhotosState = atom({
  key: "routePhotos",
  default: null,
});

// 走行ルートのグラフ情報
export const routeGraphState = atom({
  key: "routeGraph",
  default: null,
});

// 走行ルートのチェックポイント情報
export const routeCheckPointState = atom({
  key: "routeCheckPoint",
  default: null,
});

// 活動内容を整理したファイルパス情報
export const activityFilePathState = atom({
  key: "activityFilePath",
  default: null,
});

// ユーザーの活動情報
export const activityState = atom({
  key: "activity",
  default: null,
});

// ユーザーのプロフィール情報
export const userProfileState = atom({
  key: "userProfile",
  default: null,
});

// Httpクライアントエラー画面の表示有無
export const clientErrorPageState = atom({
  key: "clientErrorPage",
  default: null,
});

// 登山実績テーブルのフィルタ―情報
export const climbingFilterState = atom({
  key: "climbingFilter",
  default: [],
});
