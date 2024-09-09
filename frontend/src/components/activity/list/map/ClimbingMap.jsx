"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useSetRecoilState } from "recoil";
import { climbingFilterState } from "@state/atoms";
import { QUERY_NAME } from "@data/constants";
import { usePathname, useSearchParams } from "next/navigation";
import { getUrlString } from "@utils/control/query";

import "leaflet/dist/leaflet.css";
import styles from "./ClimbingMap.module.css";

const NORMAL_BORDER_COLOR = "#000000";
const SELECT_BORDER_COLOR = "#FF0000";
const NORMAL_BORDER_WEIGHT = 1.0;
const SELECT_BORDER_WEIGHT = 2.0;
const NORMAL_FILL_COLOR = "#DCDCDC";
const NORMAL_FILL_OPACITY = 1.0;

// 登山回数に応じた色を返す関数
const getClimbingLevelColor = (count) => {
  return count >= 50
    ? "#FF6347"
    : count >= 30
      ? "#FFD700"
      : count >= 10
        ? "#3CB371"
        : count >= 1
          ? "#6495ED"
          : NORMAL_FILL_COLOR;
};

// 都道府県毎の登山実績を反映した日本地図を表示するコンポーネント
const ClimbingMap = ({ climbingPrefectures, mapData, tabState }) => {
  const mapRef = useRef(null);
  const legendRef = useRef(null);
  const hasUnmounted = useRef(false);
  const prefectureState = useRef({});
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setFilterPrefectures = useSetRecoilState(climbingFilterState);

  // アンマウントを検知するためのフラグの設定処理
  useEffect(() => {
    return () => {
      hasUnmounted.current = true;
    };
  }, []);

  // 日本地図を描画するための初期化処理
  useEffect(() => {
    if (!mapRef.current && tabState) {
      // 地図の初期化処理
      mapRef.current = L.map("map", {
        zoom: 13,
        center: [35.6762, 139.6503],
        zoomSnap: 0.1,
        zoomDelta: 1.0,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      initializeMap(searchParams);

      // 凡例の追加処理
      legendRef.current = L.control({ position: "bottomright" });

      legendRef.current.onAdd = function () {
        const div = L.DomUtil.create("div", styles.mapLegend);
        const grades = [1, 10, 30, 50];
        const labels = [];

        labels.push(`<p class="${styles.legend__title}">登頂した山の数</p>`);

        labels.push(
          `<div class="${styles.legend__label__container}"> 
          <i style="background:${getClimbingLevelColor(0)}"></i>
          <span class="${styles.legend__label} ${styles.legend__label__font}">0</span>
        </div>`,
        );

        for (let i = 0; i < grades.length; i++) {
          labels.push(
            `<div class="${styles.legend__label__container}"> 
            <i style="background:${getClimbingLevelColor(grades[i])}"></i> 
            <span class="${styles.legend__label} ${styles.legend__label__font}">${grades[i]}</span>
            <span class="${styles.legend__label__tilde} ${styles.legend__label__font}">&#126;</span>
            <span class="${styles.legend__label} ${styles.legend__label__font}">${i + 1 < grades.length ? `${grades[i + 1] - 1}` : ""}</span>
          </div>`,
          );
        }

        div.innerHTML = labels.join("");
        return div;
      };

      legendRef.current.addTo(mapRef.current);
    } else if (mapRef.current && !tabState) {
      resetMap(searchParams);
    }

    // クリーンアップ処理
    return () => {
      if (!hasUnmounted.current) {
        if (legendRef.current) {
          legendRef.current.remove();
          legendRef.current = null;
        }
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      }
    };
  }, [mapData, climbingPrefectures, tabState]);

  // フィルタ―用のクエリパラメータの有無に応じて日本地図の表示内容を変更
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // フィルタ―用のクエリパラメータが存在する場合は、stateにその内容を保存し、
    // 日本地図の該当の都道府県を最前面に表示
    if (params.has(QUERY_NAME.PREFECTURE)) {
      const filteredPrefectures = params.getAll(QUERY_NAME.PREFECTURE);

      setFilterPrefectures(filteredPrefectures);

      filteredPrefectures.forEach((prefectureName) => {
        prefectureState.current[prefectureName]?.layer?.bringToFront();
      });
    }
    // フィルター用のクエリパラメータが存在しない場合は、stateと日本地図をリセット
    else {
      resetMap(searchParams);
    }

    // クリーンアップ処理
    return () => {};
  }, [searchParams]);

  // 日本地図の初期化関数
  const initializeMap = (searchParams) => {
    if (!mapData || !climbingPrefectures || !mapRef.current) return;

    // 日本地図の都道府県の初期状態の設定
    const initialState = {};
    mapData.features.forEach((feature) => {
      const prefectureName = feature.properties.pref_j;
      initialState[prefectureName] = {
        prefectureName,
        isClick: false,
        isClimbing: prefectureName in climbingPrefectures,
        borderColor: NORMAL_BORDER_COLOR,
        borderWeight: NORMAL_BORDER_WEIGHT,
        fillColor: NORMAL_FILL_COLOR,
        fillOpacity: NORMAL_FILL_OPACITY,
      };

      if (initialState[prefectureName].isClimbing) {
        const count = climbingPrefectures[prefectureName];
        initialState[prefectureName].fillColor = getClimbingLevelColor(count);
      }
    });

    // フィルタ―用のクエリパラメータを取得し、そのパラメータに指定されている都道府県の枠線を変更
    const prefectures = searchParams.getAll(QUERY_NAME.PREFECTURE);
    prefectures.forEach((prefectureName) => {
      initialState[prefectureName].isClick = true;
      initialState[prefectureName].borderColor = SELECT_BORDER_COLOR;
      initialState[prefectureName].borderWeight = SELECT_BORDER_WEIGHT;
    });

    prefectureState.current = initialState;

    // GeoJSONレイヤーの初期化
    const geoJsonLayer = L.geoJSON(mapData, {
      onEachFeature: (feature, layer) => onEachFeature(feature, layer, map),
    }).addTo(mapRef.current);

    // 地図の境界を調整
    const bounds = geoJsonLayer.getBounds();

    // 指定したパディングを適用した日本地図を表示画面にフィットさせて表示するように表示範囲を調整
    mapRef.current.fitBounds(bounds, { padding: [10, 10] });
  };

  // 日本地図のリセット関数(再描画関数)
  const resetMap = (searchParams) => {
    if (mapRef.current) {
      setFilterPrefectures([]);
      mapRef.current.eachLayer(function (layer) {
        mapRef.current.removeLayer(layer);
      });

      initializeMap(searchParams);
    }
  };

  // 日本地図の各都道府県のレイヤー初期化関数
  const onEachFeature = (feature, layer) => {
    const prefectureName = feature.properties.pref_j;
    const currentPrefecture = prefectureState.current[prefectureName];

    currentPrefecture.layer = layer;

    // 各都道府県のレイヤーの設定
    layer.setStyle({
      color: currentPrefecture?.borderColor || NORMAL_BORDER_COLOR,
      weight: currentPrefecture?.borderWeight || NORMAL_BORDER_WEIGHT,
      fillColor: currentPrefecture?.fillColor || NORMAL_FILL_COLOR,
      fillOpacity: currentPrefecture?.fillOpacity || NORMAL_FILL_OPACITY,
    });

    // ツールチップの設定
    layer.bindTooltip(prefectureName, {
      className: styles.tooltip,
      direction: "top",
    });

    // レイヤーのmouseoverのイベント登録
    layer.on("mouseover", function () {
      const isClick = currentPrefecture?.isClick;
      // レイヤーの枠線の色と太さを変更
      layer.setStyle({
        color: isClick ? currentPrefecture?.borderColor : NORMAL_BORDER_COLOR,
        weight: SELECT_BORDER_WEIGHT,
      });
      // レイヤーを最前面に表示
      layer.bringToFront();
    });

    // レイヤーのmouseoverのイベント登録
    layer.on("mouseout", function () {
      const isClick = currentPrefecture?.isClick;
      // レイヤーの枠線の色と太さを変更
      layer.setStyle({
        color: isClick ? SELECT_BORDER_COLOR : NORMAL_BORDER_COLOR,
        weight: isClick ? SELECT_BORDER_WEIGHT : NORMAL_BORDER_WEIGHT,
      });
      // レイヤーへのクリックの有無でレイヤーを最前面または最後面に表示
      if (!isClick) {
        layer.bringToBack();
      } else {
        layer.bringToFront();
      }
    });

    // レイヤーのクリックのイベント登録
    layer.on("click", function () {
      // 都道府県に登山実績がある場合は、クリック時の状態やレイヤーの枠線の色や太さなど変更
      if (currentPrefecture.isClimbing) {
        const currentPrefecture = prefectureState.current[prefectureName];
        currentPrefecture.isClick = !currentPrefecture.isClick;

        currentPrefecture.borderColor = currentPrefecture.isClick
          ? SELECT_BORDER_COLOR
          : NORMAL_BORDER_COLOR;
        currentPrefecture.borderWeight = currentPrefecture.isClick
          ? SELECT_BORDER_WEIGHT
          : NORMAL_BORDER_WEIGHT;

        layer.setStyle({
          color: currentPrefecture.borderColor,
          weight: currentPrefecture.borderWeight,
        });

        if (currentPrefecture.isClick) {
          layer.bringToFront();
        } else {
          layer.bringToBack();
        }
      }

      // クリックしたレイヤーの都道府県を値に持つフィルタ―用のクエリパラメータを作成
      const params = new URLSearchParams(window.location.search);
      if (currentPrefecture.isClick) {
        params.append(QUERY_NAME.PREFECTURE, currentPrefecture.prefectureName);
      } else {
        const prefectures = params.getAll(QUERY_NAME.PREFECTURE);

        // すべてのキーを削除
        params.delete(QUERY_NAME.PREFECTURE);

        // 残したい値を再度追加
        prefectures.forEach((prefecture) => {
          if (prefecture !== currentPrefecture.prefectureName) {
            params.append(QUERY_NAME.PREFECTURE, prefecture);
          }
        });
      }
      // クエリパラメータを反映したURLの取得
      const urlString = getUrlString(pathname, params);

      // ブラウザのURLを変更し、履歴に追記
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", urlString);
      }
    });

    // 沖縄県の表示位置の変更と区切り線の追加
    if (feature.properties.pref === "Okinawa") {
      // 沖縄県の表示位置の変更
      const latLngs = layer.getLatLngs();
      const shiftedLatLngs = latLngs.map((latLngArray) =>
        latLngArray.map((latLng) => [latLng.lat + 5.5, latLng.lng + 12]),
      );
      layer.setLatLngs(shiftedLatLngs);

      // 区切り線の追加
      const lineCoords = [
        [31.31512, 137.140803],
        [33.86312, 140.088803],
        [33.86312, 142.260803],
      ];

      L.polyline(lineCoords, {
        color: "black",
        weight: 1,
        dashArray: "4, 4",
      }).addTo(mapRef.current);
    }
  };

  return (
    <div className={styles.mapBox}>
      <div id="map" className={styles.mapContainer}></div>
    </div>
  );
};

export default ClimbingMap;
