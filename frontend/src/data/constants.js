// 検索キーワードの種別の定義
export const KEYWORD_TYPE = {
  // 都道府県情報
  LOCATION: 1,
  // 活動エリア
  AREA: 2,
};

// クエリパラメータのキー名
export const QUERY_NAME = {
  TAB: "tabs",
  REDIRECT: "redirect",
  PAGE: "page",
  MONTH: "month",
  TYPE: "type",
  START_AT: "start_at",
  END_AT: "end_at",
  PREFECTURE: "prefecture_names",
  AREA: "area_names",
  FIELD: "field",
  DIRECTION: "direction",
  ZOOM: "zoom",
  CENTER: "center",
};

// 地理院地図の標準地図タイルを取得するURL
export const GSI_TILE_URL = process.env.NEXT_PUBLIC_GSI_TILE_URL;
// フロントエンドのURL
export const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;
// バックエンドのURL
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// 定数の@パラメータの置換関数
const setParam = function (value) {
  return this.target.replace("@", value);
};

// ファイルURLパス
export const FILE_URL_PATH = {
  ICON: `/icon`,
  IMAGE: `/img`,
  USER: {
    target: `/data/user/@`,
    set: setParam,
  },
  ACTIVITY: {
    target: `/data/activity/@`,
    set: setParam,
  },
  MAP: `/data/sys/map`,
};

// APIのURLパス
export const API_URL_PATH = {
  LOGOUT: `${FRONTEND_BASE_URL}/api/logout`,
  COOKIE: `${FRONTEND_BASE_URL}/api/auth/set-cookie`,
  TOKEN_REFRESH_FRONTEND: `${FRONTEND_BASE_URL}/api/auth/token/refresh`,
  TOKEN_REFRESH_BACKEND: `${BACKEND_BASE_URL}/api/auth/token/refresh/`,
  CSRF: `${BACKEND_BASE_URL}/api/auth/csrf/`,
  TOKEN: `${BACKEND_BASE_URL}/api/auth/token/`,
  ACTIVITY: {
    target: `${BACKEND_BASE_URL}/api/activities/@/`,
    set: setParam,
  },
  USER: {
    target: `${BACKEND_BASE_URL}/api/users/@/`,
    set: setParam,
  },
  PROFILE: {
    target: `${BACKEND_BASE_URL}/api/users/profile/@/`,
    set: setParam,
  },
  ACHIEVEMENT: {
    target: `${BACKEND_BASE_URL}/api/achievements/@/`,
    set: setParam,
  },
};

// ディレクトリパス
export const DIR_PATH = {
  DICT: "/data/dict",
  USER: "/users",
  ACTIVITY: "/activities",
};

// ページのURLパス
export const URL_PATH = {
  LOGIN: "/login",
  SERVER_ERROR: "/error",
  USER: {
    target: `${DIR_PATH.USER}/@`,
    set: setParam,
  },
  ACTIVITY: {
    target: `${DIR_PATH.ACTIVITY}/@`,
    set: setParam,
  },
  ARTICLE: {
    target: `${DIR_PATH.ACTIVITY}/@/articles`,
    set: setParam,
  },
  TRACK: {
    target: `${DIR_PATH.ACTIVITY}/@/tracks`,
    set: setParam,
  },
};

// システム共通のファイル名
export const FILE_NAME = {
  ICON: "icon.webp?v1.0.0",
  BACKGROUND_IMG: "background_img.webp?v1.0.0",
  PACE_BAR: "pace_bar.png?v1.0.0",
  MAP: "japan.geojson?v1.0.0",
};

// アイコンID
export const ICON_IDS = {
  CAMERA: 0,
  START: 1,
  END: 2,
  REST: 3,
  SUMMIT: 4,
  NO_ROUTE_SUMMIT: 5,
  TRIANGULATION_POINT: 6,
  TRAILHEAD: 7,
  PASS: 8,
  SIGNPOST: 9,
  JUNCTION: 10,
  POINT: 11,
  MOUNTAIN_HUT: 12,
  SHELTER: 13,
  TENT_SITE: 14,
  GAZEBO: 15,
  TOILET: 16,
  WATER_SOURCE: 17,
  FLOWER_FIELD: 18,
  ROCK: 19,
  WATERFALL: 20,
  VIEWPOINT: 21,
  OBSERVATORY: 22,
  CASTLE_RUINS: 23,
  PARKING: 24,
  CABLE_CAR: 25,
  BUS_STOP: 26,
  STATION: 27,
  PORT: 28,
  SHRINE: 29,
  TEMPLE: 30,
  PARK: 31,
  INFORMATION_CENTER: 32,
  MUSEUM: 33,
  HOT_SPRING: 34,
  ACCOMMODATION: 35,
  RESTAURANT: 36,
  ROADSIDE_STATION: 37,
  OTHERS: 38,
  NO_ENTRY: 39,
  CAUTION_AREA: 40,
  DANGER_AREA: 41,
  BEWARE_OF_BEARS: 42,
  TAP_POINT: 43,
  STAMP_POINT: 44,
  PREMIUM: 45,
};

// 活動詳細ページのグラフのタブを表す定数
export const DISTANCE_CHART = 1;
export const ACTIVE_TIME_CHART = 2;
export const TIMESTAMP_CHART = 3;

// 登山の活動情報を記載したファイルのフォーマット
export const FILE_PATTERNS = {
  routes: "^route_.*\\.geojson$",
  spots: "^spot_.*\\.geojson$",
  photos: "^photo_.*\\.json$",
  restPoints: "^rest_.*\\.json$",
  gpx: "^yamap_.*\\.gpx$",
  graphs: "^graph_.*\\.geojson$",
  checkPoints: "^check_point_.*\\.json$",
};
