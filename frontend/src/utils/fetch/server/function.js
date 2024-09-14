import { API_URL_PATH, FILE_PATTERNS } from "@data/constants";
import { FetchError } from "@exceptions/fetch";
import serverFetch from "@utils/fetch/server";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";

// 指定した検索パターンにヒットするファイルパスを検索し、該当ファイル名を返却する関数
const getFileName = (fileDir, pattern) => {
  const regex = new RegExp(pattern);

  const filesAndDirs = fs.readdirSync(fileDir);
  for (const fileOrDir of filesAndDirs) {
    const fullPath = path.join(fileDir, fileOrDir);
    const stat = fs.statSync(fullPath);
    if (stat.isFile() && regex.test(fileOrDir)) {
      return fullPath.replace(/\\/g, "/").replace(/^public/, "");
    }
  }

  return null;
};

// 指定したurlリストに対し並列でデータフェッチする関数
const fetchAll = async (urlList) => {
  // APIリクエストのPromiseオブジェクトのリストを作成
  const fetchFunctionList = urlList.map((item) => {
    return () => serverFetch.get(item[1]);
  });

  // 並列データフェッチ処理
  const response = await serverFetch.fetchWithTokenRetry(fetchFunctionList);

  // フェッチの応答結果の格納
  let result = {};
  urlList.forEach(([key, _], index) => {
    result[key] = response.data[index];
  });

  return { data: result, setCookies: response.setCookies };
};

// 登山の活動詳細に必要なデータをフェッチする関数
export const fetchActivity = async (activity_id) => {
  const fileList = {};
  const resultData = {};
  let fileDir;

  try {
    // 登山の活動詳細に必要なファイルパスを取得
    Object.keys(FILE_PATTERNS).forEach((key) => {
      const filePattern = FILE_PATTERNS[key];
      fileDir = path.join("public", "data", "activity", activity_id);
      const fileName = getFileName(fileDir, filePattern);

      // 条件に一致するファイルが存在しない場合
      if (fileName === null) {
        // エラー処理
      }

      fileList[key] = fileName;
    });
  } catch (error) {
    const response = {};
    if (error.code === "ENOENT") {
      response.status = StatusCodes.NOT_FOUND;
      throw new FetchError(
        `Data Fetch Error (${fileDir} - Not Found(${response.status}))`,
        response,
      );
    } else {
      throw new FetchError(`Data Fetch Error (${fileDir} - ${error.message})`, response);
    }
  }

  // 登山の活動詳細に必要なAPIリストの設定
  const api = { activity: API_URL_PATH.ACTIVITY.set(activity_id) };

  // 登山の活動詳細に必要なファイルリストの作成
  const fetchFileList = Object.entries(fileList).filter(([key, _]) => key !== "gpx");
  const fetchApiList = Object.entries(api);

  // データフェッチするリストの結合
  const targetList = [...fetchFileList, ...fetchApiList];

  // 並列してデータをフェッチ
  const response = await fetchAll(targetList);
  const fetchData = response.data;
  const setCookies = response.setCookies;

  // フェッチした結果の加工と整理
  for (const key in fileList) {
    if (key === "routes") {
      // ルート情報から座標情報を設定
      resultData["coordinates"] = fetchData[key].features.map((item) => [
        item.geometry.coordinates[1],
        item.geometry.coordinates[0],
      ]);

      // ルート情報から平均ペース情報を設定
      resultData["averagePace"] = fetchData[key].features.map(
        (item) => item.properties.average_pace,
      );
    } else if (key === "spots") {
      // 加工したスポット情報を設定
      resultData[key] = fetchData[key].features.map((item) => ({
        name: item.properties.name,
        type: item.properties.type,
        stay_times: item.properties.stay_times.map((stay_time) => {
          const time_options = { hour: "2-digit", minute: "2-digit", hour12: false };
          const stay_start = new Date(stay_time.start).toLocaleTimeString("ja-JP", time_options);
          const stay_end = new Date(stay_time.end).toLocaleTimeString("ja-JP", time_options);

          return {
            start: stay_start,
            end: stay_end,
          };
        }),
        coordinates: [item.geometry.coordinates[1], item.geometry.coordinates[0]],
      }));
    } else if (key === "graphs") {
      // 加工したグラフ情報を設定
      resultData[key] = fetchData[key].features.map((item) => {
        return {
          coordinates: [item.geometry.coordinates[1], item.geometry.coordinates[0]],
          average_pace: item.properties.average_pace,
          elevation: item.properties.elevation,
          total_distance: item.properties.total_distance,
          active_time: item.properties.active_time,
          timestamp: new Date(item.properties.timestamp).getTime(),
        };
      });
    } else {
      // 残りのファイル情報を設定
      resultData[key] = fetchData[key];
    }
  }
  // ファイルパス情報を設定
  resultData["files"] = fileList;

  // APIの実行結果を設定
  for (const key in api) {
    resultData[key] = fetchData[key];
  }

  return { data: resultData, setCookies };
};
