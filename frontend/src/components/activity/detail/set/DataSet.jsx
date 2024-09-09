"use client";

import { useEffect, useState } from "react";
import { LoadingIndicator } from "@components/loading";

import {
  routeCoordinateState,
  routeAveragePaceState,
  routeSpotsState,
  routeRestPointsState,
  routePhotosState,
  routeGraphState,
  routeCheckPointState,
  activityFilePathState,
  activityState,
} from "@state/atoms";
import { useResetRecoilState, useSetRecoilState } from "recoil";

// 取得した登山の活動情報をrecoilのstateに保存するコンポーネント
export const DataSet = ({ children, data }) => {
  const setCoordinates = useSetRecoilState(routeCoordinateState);
  const setAveragePace = useSetRecoilState(routeAveragePaceState);
  const setSpots = useSetRecoilState(routeSpotsState);
  const setRestPoints = useSetRecoilState(routeRestPointsState);
  const setPhotos = useSetRecoilState(routePhotosState);
  const setGraphInfo = useSetRecoilState(routeGraphState);
  const setCheckPoints = useSetRecoilState(routeCheckPointState);
  const setActivity = useSetRecoilState(activityState);
  const setFilePath = useSetRecoilState(activityFilePathState);

  const resetCoordinates = useResetRecoilState(routeCoordinateState);
  const resetAveragePace = useResetRecoilState(routeAveragePaceState);
  const resetSpots = useResetRecoilState(routeSpotsState);
  const resetRestPoints = useResetRecoilState(routeRestPointsState);
  const resetPhotos = useResetRecoilState(routeSpotsState);
  const resetGraphInfo = useResetRecoilState(routeGraphState);
  const resetCheckPoints = useResetRecoilState(routeCheckPointState);
  const resetActivity = useResetRecoilState(activityState);
  const resetFilePath = useResetRecoilState(activityFilePathState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 取得したデータを各stateに保存
    data?.coordinates && setCoordinates(data.coordinates);
    data?.averagePace && setAveragePace(data.averagePace);
    data?.spots && setSpots(data.spots);
    data?.graphs && setGraphInfo(data.graphs);
    data?.restPoints && setRestPoints(data.restPoints);
    data?.photos && setPhotos(data.photos);
    data?.checkPoints && setCheckPoints(data.checkPoints);
    data?.activity && setActivity(data.activity);
    data?.files && setFilePath(data.files);

    setIsLoading(false);

    // クリーンアップ処理
    return () => {
      // Recoilで管理するstateの初期化
      resetCoordinates();
      resetAveragePace();
      resetSpots();
      resetRestPoints();
      resetPhotos();
      resetGraphInfo();
      resetCheckPoints();
      resetActivity();
      resetFilePath();
    };
  }, [data]);

  // ローディング画面の表示
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <>{children}</>;
};
