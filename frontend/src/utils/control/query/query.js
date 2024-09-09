import { KEYWORD_TYPE, QUERY_NAME, URL_PATH } from "@data/constants";

// クエリパラメータを追記する関数
export const appendQueryParams = (targetParams, newParams) => {
  Object.entries(newParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => targetParams.append(key, val));
    } else {
      targetParams.append(key, value);
    }
  });
};

// 現在のクエリパラメータを取得する関数
export const getCurrentQueryParams = (searchParams) => {
  const currentParams = {};
  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);
    currentParams[key] = values.length > 1 ? values : values[0];
  }

  return currentParams;
};

// 指定したクエリパラメータを設定したURLの文字列を取得する関数
export const getUrlString = (pathname, targetParams) => {
  if (typeof window !== "undefined") {
    const baseUrl = new URL(window.location.origin + pathname);
    baseUrl.search = targetParams.toString();
    baseUrl.hash = QUERY_NAME.TAB;
    return baseUrl.toString();
  }
};

// 検索キーワードのクエリ文字列を設定する関数
export const setKeywordsQueryParams = (pathname, searchParams, keywordsValue) => {
  // 現在のクエリパラメータを取得
  const currentParams = getCurrentQueryParams(searchParams);

  // 現在のクエリパラメータから検索キーワードとページ以外のパラメータを取得
  const otherParams = { ...currentParams };
  delete otherParams[QUERY_NAME.PREFECTURE];
  delete otherParams[QUERY_NAME.AREA];

  delete otherParams[QUERY_NAME.PAGE];

  // 検索キーワードのクエリパラメータを追加
  const targetParams = new URLSearchParams();
  for (const keyword of keywordsValue) {
    if (keyword.type === KEYWORD_TYPE.LOCATION) {
      targetParams.append(QUERY_NAME.PREFECTURE, keyword.name);
    } else {
      targetParams.append(QUERY_NAME.AREA, keyword.name);
    }
  }

  // 検索キーワード以外に設定されていたその他のパラメータを追加
  appendQueryParams(targetParams, otherParams);

  // クエリパラメータを反映したURLの取得
  const urlString = getUrlString(pathname, targetParams);

  // ブラウザのURLを変更し、履歴に追記
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", urlString);
  }
};

// 検索キーワードのクエリ文字列を取得する関数
export const getKeywordsQueryParams = (searchParams) => {
  let keywordValues = [];
  const query_list = [QUERY_NAME.PREFECTURE, QUERY_NAME.AREA];
  for (const keywordParam of query_list) {
    // 検索キーワードのクエリパラメータの取得処理
    const queryParams = searchParams.getAll(keywordParam);

    // 検索キーワードのクエリパラメータが存在する場合、検索キーワードにパラメータの値を設定
    if (queryParams.length > 0) {
      keywordValues = keywordValues.concat(
        queryParams.map((value) => ({
          name: value,
          type: keywordParam === QUERY_NAME.PREFECTURE ? KEYWORD_TYPE.LOCATION : KEYWORD_TYPE.AREA,
        })),
      );
    }
  }

  return keywordValues;
};

// 活動開始日/終了日のクエリ文字列を設定する関数
export const setDateQueryParams = (pathname, searchParams, dateValue, type) => {
  const QueryParamsName = type === true ? QUERY_NAME.START_AT : QUERY_NAME.END_AT;

  // 現在のクエリパラメータを取得
  const currentParams = getCurrentQueryParams(searchParams);

  // 現在のクエリパラメータから活動開始日/終了日とページ以外のパラメータを取得
  const otherParams = { ...currentParams };
  delete otherParams[QueryParamsName];
  delete otherParams[QUERY_NAME.PAGE];

  // 活動開始日/終了日のクエリパラメータを追加
  const targetParams = new URLSearchParams();
  if (dateValue !== null) {
    targetParams.append(QueryParamsName, dateValue.getTime());
  }

  // 活動開始日/終了日以外に設定されていたその他のパラメータを追加
  appendQueryParams(targetParams, otherParams);

  // クエリパラメータを反映したURLの取得
  const urlString = getUrlString(pathname, targetParams);

  // ブラウザのURLを変更し、履歴に追記
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", urlString);
  }
};

// 活動開始日/終了日のクエリ文字列から日時情報を取得する関数
export const getDateQueryParams = (searchParams, type) => {
  const QueryParamsName = type ? QUERY_NAME.START_AT : QUERY_NAME.END_AT;

  //活動開始日/終了日のクエリパラメータの読み込み処理
  const timestamp_str = searchParams.get(QueryParamsName);

  // 活動開始日/終了日のクエリパラメータからDateオブジェクトを作成
  let activityDate = null;
  if (timestamp_str !== null) {
    activityDate = new Date(Number(timestamp_str));
  }

  return activityDate;
};

// 活動月/活動タイプ(チェックボックス)のクエリ文字列を設定する関数
export const setCheckBoxQueryParams = (pathname, searchParams, checkValue, type) => {
  const QueryParamsName = type === true ? QUERY_NAME.MONTH : QUERY_NAME.TYPE;

  // 現在のクエリパラメータを取得
  const currentParams = getCurrentQueryParams(searchParams);

  // 現在のクエリパラメータから活動月/活動タイプとページのパラメータを取得
  const otherParams = { ...currentParams };
  delete otherParams[QueryParamsName];
  delete otherParams[QUERY_NAME.PAGE];

  // 活動月/活動タイプのクエリパラメータを追加
  const targetParams = new URLSearchParams();
  if (checkValue.length > 0) {
    targetParams.append(QueryParamsName, checkValue);
  }

  // 活動月/活動タイプ以外に設定されていたその他のパラメータを追加
  appendQueryParams(targetParams, otherParams);

  // クエリパラメータを反映したURLの取得
  const urlString = getUrlString(pathname, targetParams);

  // ブラウザのURLを変更し、履歴に追記
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", urlString);
  }
};

// 活動月/活動タイプ(チェックボックス)のクエリ文字列から日時情報を取得する関数
export const getCheckBoxQueryParams = (searchParams, boxLength, type) => {
  const QueryParamsName = type ? QUERY_NAME.MONTH : QUERY_NAME.TYPE;

  //活動月/活動タイプのクエリパラメータの読み込み処理
  const queryValues = searchParams.get(QueryParamsName);

  // 活動月/活動タイプのクエリパラメータからチェックボックスのデータを作成
  let checkboxValues = null;
  if (queryValues !== null) {
    const trueValue = queryValues.split(",").map(Number);
    checkboxValues = Array.from({ length: boxLength }, (_, index) =>
      trueValue.some((value) => index === value),
    );
  }

  return checkboxValues;
};

// ページのクエリ文字列を設定する関数
export const setPageQueryParams = (pathname, searchParams, pageValue) => {
  // 現在のクエリパラメータを取得
  const currentParams = getCurrentQueryParams(searchParams);

  // 現在のクエリパラメータからページ以外のパラメータを取得
  const otherParams = { ...currentParams };
  delete otherParams[QUERY_NAME.PAGE];

  // ページのクエリパラメータを追加
  const targetParams = new URLSearchParams();
  targetParams.append(QUERY_NAME.PAGE, pageValue);

  // ページ以外に設定されていたその他のパラメータを追加
  appendQueryParams(targetParams, otherParams);

  // クエリパラメータを反映したURLの取得
  const urlString = getUrlString(pathname, targetParams);

  // ブラウザのURLを変更し、履歴に追記
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", urlString);
  }
};

// ページのクエリ文字列を取得する関数
export const getPageQueryParams = (searchParams) => {
  // ページのクエリパラメータの読み込み処理
  const queryValues = searchParams.get(QUERY_NAME.PAGE);

  // ページのクエリパラメータが存在していた場合は、その数値を返す
  if (queryValues !== null) {
    return Number(queryValues);
  } else {
    return queryValues;
  }
};

// リダイレクトのクエリ文字列を取得する関数
export const getRedirectQueryParams = (searchParams) => {
  // リダイレクトのクエリパラメータの読み込み処理
  const queryValues = searchParams.get(QUERY_NAME.REDIRECT);

  return queryValues;
};
