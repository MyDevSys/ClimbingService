"use client";

import L from "leaflet";
import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import Link from "next/link";
import { useRecoilValue, useRecoilState } from "recoil";
import { createPortal } from "react-dom";
import { getColor } from "@utils/style/color";
import { ICON_IDS, FILE_URL_PATH, GSI_TILE_URL, URL_PATH, FILE_NAME } from "@data/constants";
import {
  isPaceButtonOnState,
  isPhotoButtonOnState,
  isRestPointButtonOnState,
  shareCoordinateState,
  routeCoordinateState,
  routeAveragePaceState,
  routeSpotsState,
  routeRestPointsState,
  routePhotosState,
  activityState,
} from "@state/atoms";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { PaceIcon, CameraPopup, RestPopup } from "@components/icons";
import { getIcon, getPopupIcon } from "./utils/icon";

import "leaflet/dist/leaflet.css";
import styles from "./ActivityMap.module.css";

// 地図のコントロールパネル用コンポーネント
const ControlPanel = ({ isEnlargedMap, activity_id }) => {
  const map = useMap();
  const [controlPanel, setControlPanel] = useState(false);
  //コントロールパネルの初期設定
  useEffect(() => {
    // 処理終了条件
    if (!map) return;

    // コントロールパネルの要素を作成
    const element = L.DomUtil.create("div", styles.controlPanel__Container);

    // 地図上に表示するボタンのカスタムコントロールクラスを定義
    const CustomButton = L.Control.extend({
      onAdd: function () {
        return element;
      },
    });

    // ボタンのカスタムコントロールのインスタンスを作成
    const customButton = new CustomButton({ position: "topleft" }).addTo(map);

    // stateの変更
    setControlPanel(element);

    // クリーンアップ処理
    return () => {
      if (map && customButton) {
        // 地図からカスタムコントロールを削除
        map.removeControl(customButton);
      }
    };
  }, [map]);

  return (
    <>
      {map &&
        controlPanel &&
        createPortal(
          <ButtonPanel
            linkDetailURL={URL_PATH.TRACK.set(activity_id)}
            isEnlargedMap={isEnlargedMap}
          />,
          controlPanel,
        )}
    </>
  );
};

// 地図上にボタンパネルを表示するコンポーネント
const ButtonPanel = ({ linkDetailURL, isEnlargedMap }) => {
  const map = useMap();
  const [isPaceButtonOn, setIsPaceButtonOn] = useRecoilState(isPaceButtonOnState);
  const [isPhotoButtonOn, setIsPhotoButtonOn] = useRecoilState(isPhotoButtonOnState);
  const [isRestPointButtonOn, setIsRestPointButtonOn] = useRecoilState(isRestPointButtonOnState);

  // ローカルストレージに保存するデータの有効期間(単位：月)
  const EXPIRE_MONTH = 3;

  // ローカルストレージにボタンのON/OFF状態とその有効期限を保存する関数
  const setButtonState = (isPaceButtonOn, isPhotoButtonOn, isRestPointButtonOn, expire_month) => {
    // ローカルストレージに保存するデータの有効期限(通算ミリ秒)を算出
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + expire_month);
    const expire_ms = currentDate.getTime();

    // 保存するデータを作成
    const buttonState = {
      state: {
        pace: isPaceButtonOn,
        photo: isPhotoButtonOn,
        rest: isRestPointButtonOn,
      },
      expire: expire_ms,
    };

    // ローカルストレージに保存
    localStorage.setItem("sharedButtonState", JSON.stringify(buttonState));
    return;
  };

  // ボタンの構成要素の定義
  const button_item_list = [
    {
      name: "全画面表示",
      icon: <OpenInNewIcon fontSize="large" />,
      state: null,
      isEnlargedMapDisplay: false,
      isSmallScreenDisplay: false,
      click_func: () => {
        window.open(linkDetailURL, "_blank", "noopener,noreferrer");
      },
    },
    {
      name: "走行ペース",
      icon: <PaceIcon />,
      state: isPaceButtonOn,
      isEnlargedMapDisplay: true,
      isSmallScreenDisplay: true,
      click_func: () => {
        setButtonState(!isPaceButtonOn, isPhotoButtonOn, isRestPointButtonOn, EXPIRE_MONTH);
        setIsPaceButtonOn(!isPaceButtonOn);
      },
    },
    {
      name: "撮影ポイント",
      icon: <CameraPopup />,
      state: isPhotoButtonOn,
      isEnlargedMapDisplay: true,
      isSmallScreenDisplay: false,
      click_func: () => {
        setButtonState(isPaceButtonOn, !isPhotoButtonOn, isRestPointButtonOn, EXPIRE_MONTH);
        setIsPhotoButtonOn(!isPhotoButtonOn);
      },
    },
    {
      name: "休憩ポイント",
      icon: <RestPopup />,
      state: isRestPointButtonOn,
      isEnlargedMapDisplay: true,
      isSmallScreenDisplay: false,
      click_func: () => {
        setButtonState(isPaceButtonOn, isPhotoButtonOn, !isRestPointButtonOn, EXPIRE_MONTH);
        setIsRestPointButtonOn(!isRestPointButtonOn);
      },
    },
    {
      name: "拡大",
      icon: <AddIcon fontSize="large" />,
      state: null,
      isEnlargedMapDisplay: true,
      isSmallScreenDisplay: false,
      click_func: () => {
        map.zoomIn();
      },
    },
    {
      name: "縮小",
      icon: <RemoveIcon fontSize="large" />,
      state: null,
      isEnlargedMapDisplay: true,
      isSmallScreenDisplay: false,
      click_func: () => {
        map.zoomOut();
      },
    },
  ];

  // コンポーネントパネルの初期化処理
  useEffect(() => {
    // コントロールパネルのボタンのイベント伝播を停止
    // (ボタンをダブルクリックしたときの地図ズームイベントを抑止するための施策)
    document.querySelectorAll(`.${styles.controlPanel__Button}`).forEach((button) => {
      L.DomEvent.disableClickPropagation(button);
    });

    // クリーンアップ処理
    return () => {};
  }, [map]);

  return (
    <>
      {map &&
        button_item_list.map((item, index) => (
          <button
            key={index}
            className={`${styles.controlPanel__Button} 
          ${item.icon == null ? "" : styles.controlPanel__Button__Icon} 
          ${
            item.state == null
              ? ""
              : item.state
                ? styles["button--on"] + " " + styles["button--clicked"]
                : styles["button--off"]
          }
          ${isEnlargedMap ? "" : item.isSmallScreenDisplay ? "" : styles["button--none"]}`}
            onClick={(e) => {
              e.preventDefault();
              item.click_func();
            }}
            aria-label={item.name}
            style={{
              display: isEnlargedMap ? (item.isEnlargedMapDisplay ? "" : "none") : "",
            }}
          >
            {item.icon}
            <span className={styles.tooltip__text}>{item.name}</span>
          </button>
        ))}
    </>
  );
};

// 地図上にスケールバーを表示するコンポーネント
const ScaleBar = () => {
  const map = useMap();

  // スケールバーの設定と追加処理
  useEffect(() => {
    // 処理終了条件
    if (!map) return;

    // スケールバーの追加
    const scaleControl = L.control
      .scale({
        position: "bottomleft",
        metric: true,
        imperial: false,
        maxWidth: 100,
      })
      .addTo(map);

    // クリーンアップ処理
    return () => {
      // スケールバーの削除
      scaleControl.remove();
    };
  }, [map]);

  return null;
};

// 地図上に登山の活動情報をマッピングするコンポーネント
const ActivityMapper = ({ activity_id, isEnlargedMap }) => {
  const coordinates = useRecoilValue(routeCoordinateState);
  const averagePace = useRecoilValue(routeAveragePaceState);
  const spots = useRecoilValue(routeSpotsState);
  const restPoints = useRecoilValue(routeRestPointsState);
  const photos = useRecoilValue(routePhotosState);

  // 登山の活動データを地図にマッピング
  return (
    <>
      {coordinates && <Routes coordinates={coordinates} />}
      {coordinates && averagePace && (
        <Pace coordinates={coordinates} averagePace={averagePace} isEnlargedMap={isEnlargedMap} />
      )}
      {spots && <Spots spots={spots} />}
      {restPoints && <RestPoints restPoints={restPoints.rest_info} />}
      {photos && <Photos photos={photos} activity_id={activity_id} />}
      <ActivePoint />
    </>
  );
};

// 地図上に登山の走行ルート情報を表示するコンポーネント
const Routes = ({ coordinates }) => {
  const map = useMap();
  const polylineRef = useRef();

  // 走行ルート全体が見えるように地図の表示領域を調整
  useLayoutEffect(() => {
    if (coordinates.length > 0 && polylineRef.current) {
      map.fitBounds(polylineRef.current.getBounds(), {
        padding: [60, 60], // 上下左右に余白を追加
        animate: false,
      });
    }

    // クリーンアップ処理
    return () => {};
  }, [coordinates.length, map]);

  return (
    <>
      <Polyline positions={coordinates} color="#185ca4" weight={7} opacity={1} ref={polylineRef} />
      <Polyline positions={coordinates} color="#2e98ea" weight={4} opacity={1} />
      <Marker position={coordinates[0]} icon={getIcon(ICON_IDS.START, true)} zIndexOffset={101} />
      <Marker position={coordinates.at(-1)} icon={getIcon(ICON_IDS.END, true)} zIndexOffset={100} />
    </>
  );
};

// 地図上に登山のスポット情報を表示するコンポーネント
const Spots = ({ spots }) => {
  return (
    <>
      {spots?.map((spot_item, index) => (
        <Marker
          key={index}
          position={spot_item.coordinates}
          icon={getIcon(spot_item.type, false)}
          zIndexOffset={1}
        >
          <Popup className={`${styles.landmarkPopup} ${styles.landmarkPopup__spot}`}>
            <div className={styles["landmarkPopup--center"]}>
              <span className={styles.landmarkPopup__title}>{spot_item.name}</span>
              {spot_item.stay_times?.map((stay_time, index) => (
                <time key={index}>
                  {stay_time.start} - {stay_time.end}
                </time>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

// 平均ペース値をもとに登山の走行ルートを着色するコンポーネント
const Pace = ({ coordinates, averagePace, isEnlargedMap }) => {
  const polylineRef = useRef([]);
  const isPaceButtonOn = useRecoilValue(isPaceButtonOnState);
  // 平均ペース表示ボタンのON/OFFによるコンポーネントの表示/非表示設定
  useEffect(() => {
    // 着色したポリラインの表示/非表示設定
    polylineRef.current.forEach((polyline) => {
      const polylineElement = polyline.getElement();

      if (polylineElement) {
        polylineElement.style.visibility = isPaceButtonOn ? "visible" : "hidden";
      }
    });

    // クリーンアップ処理
    return () => {};
  }, [isPaceButtonOn]);

  return (
    <>
      {Array.from({ length: coordinates.length - 1 }).map((_, index) => (
        <Polyline
          key={index}
          positions={[coordinates[index], coordinates[index + 1]]}
          color={getColor(averagePace[index])}
          weight={7}
          opacity={1}
          ref={(el) => (polylineRef.current[index] = el)}
          eventHandlers={{
            click: (e) => {
              e.preventDefault();
              e.stopPropagation();
            },
          }}
        />
      ))}
      <PaceColorBar isButtonOn={isPaceButtonOn} isEnlargedMap={isEnlargedMap} />
    </>
  );
};

// 平均ペースの配色の凡例(カラーバー)を表示するコンポーネント
const PaceColorBar = ({ isButtonOn, isEnlargedMap }) => {
  const map = useMap();
  const barContainerRef = useRef(null);

  // カラーバーの作成処理
  useEffect(() => {
    // 処理終了条件
    if (!map) return;

    // カラーバーのカスタムコントロールクラスを作成
    const ColorBar = L.Control.extend({
      onAdd: function () {
        // カラーバーのイメージ図の要素作成と設定
        const img = L.DomUtil.create("img");
        img.src = `${FILE_URL_PATH.IMAGE}/${FILE_NAME.PACE_BAR}`;
        img.className = `${styles.PaceColorBar__img} ${isEnlargedMap ? "is_large" : ""}`;
        img.alt = "Pace Color Bar";

        // カラーバーのテキストの要素作成と設定
        const topText = L.DomUtil.create("span");
        const middleText = L.DomUtil.create("span");
        const bottomText = L.DomUtil.create("span");
        topText.className = styles.PaceColorBar__topText;
        middleText.className = styles.PaceColorBar__middleText;
        bottomText.className = styles.PaceColorBar__bottomText;
        topText.textContent = "速い";
        middleText.textContent = "標準";
        bottomText.textContent = "遅い";

        // カラーバーのテキストコンテナの要素作成とノード追加
        const textContainer = L.DomUtil.create("div");
        textContainer.className = `${styles.PaceColorBar__textContainer} ${isEnlargedMap ? "is_large" : ""}`;
        textContainer.appendChild(topText);
        textContainer.appendChild(middleText);
        textContainer.appendChild(bottomText);

        // カラーバー全体のコンテナの要素作成とノード追加
        const barContainer = L.DomUtil.create("div");
        barContainer.className = styles.PaceColorBar__barContainer;
        barContainer.appendChild(img);
        barContainer.appendChild(textContainer);
        barContainer.style.visibility = isButtonOn ? "visible" : "hidden";
        barContainerRef.current = barContainer;

        return barContainer;
      },

      onRemove: function () {},
    });

    // カラーバーのインスタンスを作成
    const customBar = new ColorBar({ position: "topright" }).addTo(map);

    // クリーンアップ処理
    return () => {
      if (map && customBar) {
        // カスタムコントロールを削除
        map.removeControl(customBar);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // カラーバーの表示/非表示を切り替え
  useEffect(() => {
    if (!map) return;

    // カラーバーの要素を取得し、ボタンのON/OFFで表示/非表示を設定。
    if (barContainerRef.current) {
      barContainerRef.current.style.visibility = isButtonOn ? "visible" : "hidden";
    }
  }, [isButtonOn, map]);

  return null;
};

// 写真のポップアップを表示するコンポーネント
const PhotoPopup = ({
  index,
  activity_id,
  photo_path,
  photo_item,
  photo_marker,
  photos_length,
}) => {
  const isPhotoButtonOn = useRecoilValue(isPhotoButtonOnState);

  // ポップアップに表示するリンクの設定
  const isHiddenArrowBack = index === 0 ? true : false;
  const isHiddenArrowForward = index === photos_length - 1 ? true : false;
  const currentMarker = photo_marker[index];
  const previousMarker = index === 0 ? null : photo_marker[index - 1];
  const nextMarker = index === photos_length - 1 ? null : photo_marker[index + 1];

  return (
    <div className={styles["landmarkPopup--center"]}>
      <div className={styles["landmarkPopup__photo__index"]}>
        {index + 1}/{photos_length}
      </div>
      <div className={styles["landmarkPopup__photo__container"]}>
        <button
          className={styles.landmarkPopup__photo__button}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            currentMarker.closePopup();
            previousMarker.openPopup();
          }}
          aria-label="前の写真"
          style={{
            visibility: isPhotoButtonOn ? (isHiddenArrowBack ? "hidden" : "visible") : "hidden",
          }}
        >
          <ArrowBackIosNewIcon />
        </button>
        <Link
          className={styles["landmarkPopup__photo__image"]}
          style={{ backgroundImage: `url(${photo_path})` }}
          href={`${URL_PATH.ARTICLE.set(activity_id)}#${photo_item.photo_name.split(".")[0]}`}
          rel="noopener noreferrer"
          target="_blank"
        ></Link>
        <button
          className={styles.landmarkPopup__photo__button}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            currentMarker.closePopup();
            nextMarker.openPopup();
          }}
          aria-label="次の写真"
          style={{
            visibility: isPhotoButtonOn ? (isHiddenArrowForward ? "hidden" : "visible") : "hidden",
          }}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
      <div className={styles["landmarkPopup__photo__caption"]}>
        <span>{photo_item.date_time.match(/\d{2}:\d{2}/)[0]}&nbsp;</span>
        <span>{photo_item.photo_comment}</span>
      </div>
    </div>
  );
};

// 地図上に写真のポップアップを表示するコンポーネント
const Photos = ({ photos, activity_id }) => {
  const isPhotoButtonOn = useRecoilValue(isPhotoButtonOnState);
  const markerRefs = useRef([]);

  // マーカーとポップアップの表示/非表示設定
  useEffect(() => {
    markerRefs.current.forEach((polyline) => {
      const markerElement = polyline.getElement();
      const popupElement = polyline.getPopup();

      if (markerElement) {
        markerElement.style.visibility = isPhotoButtonOn ? "visible" : "hidden";
      }

      if (popupElement) {
        if (popupElement.isOpen()) {
          polyline.closePopup();
        }
      }
    });

    // クリーンアップ処理
    return () => {};
  }, [isPhotoButtonOn]);

  return (
    <>
      {photos?.map((photo_item, index) => (
        <Marker
          key={index}
          position={photo_item.coordinates}
          icon={getPopupIcon(ICON_IDS.CAMERA)}
          zIndexOffset={50}
          ref={(el) => (markerRefs.current[index] = el)}
        >
          <Popup className={`${styles.landmarkPopup} ${styles.landmarkPopup__photo}`}>
            <PhotoPopup
              index={index}
              activity_id={activity_id}
              photo_path={`${FILE_URL_PATH.ACTIVITY.set(activity_id)}/${photo_item.photo_name}`}
              photo_item={photo_item}
              photo_marker={markerRefs.current}
              photos_length={photos.length}
            />
          </Popup>
        </Marker>
      ))}
    </>
  );
};

// 地図上に休憩ポイントを表示するコンポーネント
const RestPoints = ({ restPoints }) => {
  const markerRefs = useRef([]);
  const isRestPointButtonOn = useRecoilValue(isRestPointButtonOnState);

  // 地図上に休憩ポイントを表示
  useEffect(() => {
    // 休憩ポイントボタンがONの場合
    if (isRestPointButtonOn) {
      markerRefs.current.forEach((polyline) => {
        const markerElement = polyline.getElement();
        if (markerElement) {
          markerElement.style.visibility = "visible";
        }
      });
    } else {
      markerRefs.current.forEach((polyline) => {
        // マーカーに紐づくポップアップが開いていた場合、非表示に設定
        const popupElement = polyline.getPopup();
        if (popupElement && popupElement.isOpen()) {
          polyline.closePopup();
        }

        // マーカーが表示設定の場合、非表示に設定
        const markerElement = polyline.getElement();
        if (markerElement) {
          markerElement.style.visibility = "hidden";
        }
      });
    }
    // クリーンアップ処理
    return () => {};
  }, [isRestPointButtonOn]);

  return (
    <>
      {restPoints?.map((rest_item, index) => (
        <Marker
          key={index}
          position={rest_item.coordinates}
          icon={getPopupIcon(ICON_IDS.REST)}
          zIndexOffset={10}
          ref={(el) => (markerRefs.current[index] = el)}
        >
          <Popup className={`${styles.landmarkPopup} ${styles.landmarkPopup__rest}`}>
            <div className={styles["landmarkPopup--left"]}>
              <div className={styles.landmarkPopup__title}>休憩時間 : {rest_item.rest_time}分</div>
              <div>{rest_item.date_time}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

// グラフ上の座標情報を地図にマッピングするコンポーネント
const ActivePoint = () => {
  const shareCoordinate = useRecoilValue(shareCoordinateState);

  // 連携された座標位置に円のマーカーを表示
  return (
    <>
      {shareCoordinate && (
        <CircleMarker
          center={shareCoordinate}
          radius={11}
          pathOptions={{ color: "white", fillColor: "#2e98ea", fillOpacity: 1 }}
        />
      )}
    </>
  );
};

// イベント登録コンポーネント
const Event = ({ activity_id, isEnlargedMap }) => {
  const map = useMap();

  // 全画面で走行ルート情報を表示する画面を開くクリックイベントハンドラ関数
  const onMapClick = useCallback(() => {
    const linkDetailURL = URL_PATH.TRACK.set(activity_id);

    window.open(linkDetailURL, "_blank", "noopener,noreferrer");
  }, [activity_id]);

  // メディアクエリのイベントハンドラ関数
  const handleMediaQueryChange = useCallback(
    (e) => {
      // ブラウザの幅が条件にマッチした場合
      if (e.matches) {
        // 地図のページリンクのイベント登録
        map?.on("click", onMapClick);
      } else {
        // 地図のページリンクのイベント削除
        map?.off("click", onMapClick);
      }
    },
    [map, onMapClick],
  );

  // イベント伝播停止のイベントハンドラ関数
  const stopPropagationHandler = (e) => {
    e.stopPropagation();
  };

  // イベントの登録処理
  useEffect(() => {
    // メディアクエリを作成
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    if (!isEnlargedMap) {
      // 画面サイズに伴う地図のクリック時の動作設定
      handleMediaQueryChange(mediaQuery);

      // メディアクエリにイベントリスナーを追加
      mediaQuery?.addEventListener("change", handleMediaQueryChange);
    }

    // 全てのオーバーレイ（ポリライン、ポリゴン、画像オーバーレイなど）の要素を取得
    const overlayPaneElement = document.querySelector(".leaflet-overlay-pane");

    // オーバーレイ（ポリライン、ポリゴン、画像オーバーレイなど）のクリックイベントの伝播を停止する
    // イベントリスナーを追加
    overlayPaneElement?.addEventListener("click", stopPropagationHandler);

    // クリーンアップ処理
    return () => {
      if (!isEnlargedMap) {
        // メディアクエリのイベントリスナー削除
        mediaQuery?.removeEventListener("change", handleMediaQueryChange);

        // 地図のページリンクのイベント削除
        map?.off("click", onMapClick);
      }

      // オーバーレイのイベントリスナー削除
      overlayPaneElement?.removeEventListener("click", stopPropagationHandler);
    };
  }, [handleMediaQueryChange, isEnlargedMap, map, onMapClick]);

  return null;
};

// 地図上に登山の活動情報を表示する各コンポーネントを呼び出すメインコンポーネント
const ActivityMap = React.memo(
  ({ activity_id, className, hasWheelZoom = true, isEnlargedMap = true }) => {
    const activity = useRecoilValue(activityState);

    useEffect(() => {
      if (activity && isEnlargedMap) {
        document.title = `詳細ルート（${activity.title}）`;
        document
          .querySelector('meta[name="description"]')
          .setAttribute("content", `${activity.title}の詳細ルートを表示するページ`);
      }
      // クリーンアップ処理
      return () => {};
    }, [activity, isEnlargedMap]);

    return (
      <>
        <div className={styles.ActivityMap__Container}>
          <MapContainer
            center={[33.529, 130.55]}
            zoom={10}
            zoomSnap={0.1}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={hasWheelZoom}
            className={`${className} ${styles.ActivityMap}`}
          >
            <TileLayer url={GSI_TILE_URL} maxZoom={18} minZoom={5} />
            <ControlPanel activity_id={activity_id} isEnlargedMap={isEnlargedMap} />
            <ScaleBar />
            <ActivityMapper activity_id={activity_id} isEnlargedMap={isEnlargedMap} />
            <Event activity_id={activity_id} isEnlargedMap={isEnlargedMap} />
          </MapContainer>
        </div>
      </>
    );
  },
);

ActivityMap.displayName = "ActivityMap";

export default ActivityMap;
