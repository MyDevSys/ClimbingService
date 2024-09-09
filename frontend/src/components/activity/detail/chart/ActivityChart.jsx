"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Line } from "react-chartjs-2";
import { shareCoordinateState, isPaceButtonOnState, routeGraphState } from "@state/atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { getColor } from "@utils/style/color";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { DISTANCE_CHART, ACTIVE_TIME_CHART, TIMESTAMP_CHART } from "@data/constants";

import styles from "./ActivityChart.module.css";

// フォントサイズをremからpxに変換する関数
const remToPx = (rem) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

//　タイムスタンプの表示文字列のフォーマット関数
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// ツールチップに紐づける要素のID
const TOOLTIP_ELEMENT_ID = "ElevationChart__Tooltip";

// グラフホバー時に表示する縦線プラグイン
const verticalLinePlugin = (
  isActiveChartRef,
  isPaceButtonOnRef,
  setShareCoordinateRef,
  coordinates,
) => ({
  id: "verticalLine",
  // グラフのデータセットがすべて描画された後に呼び出される処理の設定
  afterDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const xScale = chart.scales.x;
    const yScaleAxis1 = chart.scales["y-axis-1"];
    const yScaleAxis2 = chart.scales["y-axis-2"];
    const mouseX = chart.options.plugins.mouseX;
    const xValue = xScale.getValueForPixel(mouseX);
    const elevation = chart.data.datasets[0]?.data;
    const pace = chart.data.datasets[1]?.data;
    const labels = chart.data.labels;
    const tooltip = document.getElementById(TOOLTIP_ELEMENT_ID);
    const setShareCoordinate = setShareCoordinateRef.current;
    const isPaceButtonOn = isPaceButtonOnRef.current;
    const isActiveChart = isActiveChartRef.current;

    // 吹き出しの非表示設定
    tooltip.style.visibility = "hidden";

    // マウスのX座標が未設定の場合は即リターン
    if (!mouseX) {
      return;
    }

    // カーソル位置と最も近いx座標のインデックスを見つける
    let nearestIndex = 0;
    let minDistance = Infinity;
    labels.forEach((label, index) => {
      const distance = Math.abs(label - xValue);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    // 算出したインデックスのx、y座標の値を取得
    const xValueNearest = labels[nearestIndex];
    const yValueNearest = isPaceButtonOn ? pace[nearestIndex] : elevation[nearestIndex];

    // 算出したインデックスに基づく座標情報を取得
    const coordinateNearest = coordinates[nearestIndex];
    setShareCoordinate(coordinateNearest);

    // 算出したインデックスのx座標のマウス位置を取得
    const mouseXNearest = xScale.getPixelForValue(xValueNearest);

    // y座標の値に対するグラフの表示位置を取得
    const yPixel = isPaceButtonOn
      ? yScaleAxis2.getPixelForValue(yValueNearest)
      : yScaleAxis1.getPixelForValue(yValueNearest);

    // カーソル位置が縦線の表示範囲の場合
    if (mouseXNearest >= chartArea.left && mouseXNearest <= chartArea.right) {
      // 現在の描画状態を保存
      ctx.save();
      // 縦線のパスを開始
      ctx.beginPath();
      // パスの開始点を設定
      ctx.moveTo(mouseXNearest, chartArea.top);
      // パスに縦線のパスを追加
      ctx.lineTo(mouseXNearest, chartArea.bottom);
      // 縦線の太さを設定
      ctx.lineWidth = 2;
      // 縦線の色を設定
      ctx.strokeStyle = "rgb(204, 0, 0)";
      // 縦線を描画
      ctx.stroke();
      // グラフの線と縦線の交点に表示する丸のパスを開始
      ctx.beginPath();
      // 丸の中心座標や半径、円弧の開始角度と終了角度を設定
      ctx.arc(mouseXNearest, yPixel, 10, 0, 2 * Math.PI);
      // 丸の塗りつぶしの色を設定
      ctx.fillStyle = "rgb(204, 0, 0)";
      // 丸の外枠の線の太さと色を設定
      ctx.lineWidth = 2; // マルの外枠の太さを設定
      ctx.strokeStyle = "white"; // マルの外枠の色を白に設定
      // 塗りつぶしを有効化
      ctx.fill();
      // 丸を描画
      ctx.stroke();

      // 吹き出しが移動できるX座標の最小値
      const BALLOON_X_MOVE_MIN_OFFSET = 10;
      // 吹き出しのしっぽ(逆三角形)が吹き出しの幅に対して移動できない両端のパディング(ピクセル)
      const BALLOON_ARROW_PADDING = 5;
      // 吹き出しのしっぽ(逆三角形)の高さ(ピクセル)
      const BALLOON_ARROW_HEIGHT = 12;

      // 吹き出しの幅
      const balloonWidth = tooltip.offsetWidth;
      // 吹き出しの高さ
      const balloonHeight = tooltip.offsetHeight;
      // 吹き出しのX座標の位置を算出
      let balloonX = mouseXNearest - balloonWidth / 2;
      // グラフ領域(canvas要素)の幅を取得
      const canvasWidth = chart.canvas.clientWidth;
      // 吹き出しが移動できるX座標の最大値を設定
      const maxBalloonX = canvasWidth - balloonWidth;
      // 吹き出しが移動できるX座標の最小値を設定
      const minBalloonX = BALLOON_X_MOVE_MIN_OFFSET;

      // 吹き出しのX軸の表示範囲の最小値を下回る場合
      if (balloonX < minBalloonX) {
        balloonX = minBalloonX;
        // 吹き出しのX軸の表示範囲の最大値を上回る場合
      } else if (balloonX > maxBalloonX) {
        balloonX = maxBalloonX;
      }

      // 吹き出しのY座標の位置を設定
      const OFFSET_VALUE = 6;
      const balloonY = -1 * (balloonHeight - OFFSET_VALUE); // グラフの表示領域外で表示

      // 吹き出しの位置の設定
      tooltip.style.left = `${balloonX}px`;
      tooltip.style.top = `${balloonY + 2}px`;

      // 吹き出しに表示する値の単位と小数点数
      const valueUnit = isActiveChart === DISTANCE_CHART ? "km" : "min";
      const decimalPlace =
        isActiveChart === DISTANCE_CHART ? 1 : isActiveChart === ACTIVE_TIME_CHART ? 0 : null;

      // 標高グラフの吹き出しの内容の設定
      var elevationTooltipHTML;
      if (isActiveChart === TIMESTAMP_CHART) {
        elevationTooltipHTML = `
        <div>
          <span class=${styles["Chart__Tooltip__Value"]}>
            ${yValueNearest.toFixed(0)}
          </span>
          <span class=${styles["Chart__Tooltip__Unit"]}>
            m
          </span>
        </div>
        <div>
          <span class=${styles["Chart__Tooltip__Value"]}>
            ${formatTimestamp(xValueNearest)}
          </span>
        </div>`;
      } else {
        elevationTooltipHTML = `
        <div>
          <span class=${styles["Chart__Tooltip__Value"]}>
            ${yValueNearest.toFixed(0)}
          </span>
          <span class=${styles["Chart__Tooltip__Unit"]}>
            m
          </span>
        </div>
        <div>
          <span class=${styles["Chart__Tooltip__Value"]}>
            ${xValueNearest.toFixed(decimalPlace)}
          </span>
          <span class=${styles["Chart__Tooltip__Unit"]}>
            ${valueUnit}
          </span>
        </div>`;
      }

      // 平均ペースの吹き出しに表示するペース値に対するコメントの設定
      const paceComment = (value) => {
        if (value >= 130) {
          return "速い";
        } else if (value >= 110 && value < 130) {
          return "やや速い";
        } else if (value >= 90 && value < 110) {
          return "標準";
        } else if (value >= 70 && value < 90) {
          return "ややゆっくり";
        } else {
          return "ゆっくり";
        }
      };

      // 平均ペースの吹き出しの内容の設定
      const paceTooltipHTML = `
      <div>
        <span class=${styles["Chart__Tooltip__Value"]}>
          ${yValueNearest.toFixed(0)}
        </span>
        <span class=${styles["Chart__Tooltip__Unit"]}>
          %
        </span>
      </div>
      <div>
        <span class="${styles["Chart__Tooltip__Value"]} is_pace">
          ${paceComment(yValueNearest)}
        </span>
      </div>`;

      // 吹き出しの内容の設定
      tooltip.innerHTML = isPaceButtonOn ? paceTooltipHTML : elevationTooltipHTML;

      // 吹きだしの表示設定
      tooltip.style.visibility = "visible";

      // 吹き出しのしっぽ(逆三角形)が縦線を追従するようにしっぽのX軸の座標を設定
      let arrowX = mouseXNearest;
      if (mouseXNearest < balloonX + BALLOON_ARROW_PADDING) {
        arrowX = balloonX + BALLOON_ARROW_PADDING;
      } else if (mouseXNearest > balloonX + balloonWidth - BALLOON_ARROW_PADDING) {
        arrowX = balloonX + balloonWidth - BALLOON_ARROW_PADDING;
      }

      // 吹き出しのしっぽの塗りつぶし色を設定
      ctx.fillStyle = "rgb(0, 0, 0)";
      // 吹き出しのしっぽのパスを開始
      ctx.beginPath();
      // 吹き出しのしっぽの開始点(逆三角形の頂点)に移動
      ctx.moveTo(arrowX, balloonY + balloonHeight + BALLOON_ARROW_HEIGHT); // 三角形の頂点を下に移動
      // 吹き出しのしっぽの逆三角形の左上のラインの設定
      ctx.lineTo(arrowX - BALLOON_ARROW_HEIGHT / 2, balloonY + balloonHeight); // 左下の角
      // 吹き出しのしっぽの逆三角形の右上のラインの設定
      ctx.lineTo(arrowX + BALLOON_ARROW_HEIGHT / 2, balloonY + balloonHeight); // 右下の角
      // 吹き出しのしっぽのパスを終了
      ctx.closePath();
      // 吹き出しのしっぽの塗りつぶしを有効化し、パスの内容を描画
      ctx.fill();

      // 直線の描画設定がsaveした時の設定に復元
      ctx.restore();
    }
  },
});

// Chart.jsに使用するプラグインの登録
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// getChartOptionsとgetChartData関数の第2引数に指定する設定タイプ
const TYPE_ELEVATION = 1;
const TYPE_PACE = 2;

// グラフのオプション設定の取得関数
const getChartOptions = (graphInfo, type, isActiveChart) => {
  // 軸のメモリの文字サイズ
  const TICK_FONT_SIZE_REM = 1.6;
  // 軸のメモリの数
  const X_TICK_COUNT = 5;
  const Y_TICK_COUNT = 4;
  // 軸とメモリ文字列間のパディング
  const TICK_PADDING = 10;

  // x軸の最大/最小値の設定
  const x_value = graphInfo.map((item) =>
    isActiveChart === DISTANCE_CHART
      ? item.total_distance
      : isActiveChart === ACTIVE_TIME_CHART
        ? item.active_time
        : item.timestamp,
  );

  const x_max = x_value[x_value.length - 1];
  const x_min = x_value[0];

  // y軸(1軸目)の最大/最小値の設定
  const elevation = graphInfo.map((item) => item.elevation);
  const y_max_axis1 = Math.ceil(Math.max(...elevation) / 200) * 200;
  const y_min_axis1 = Math.floor(Math.min(...elevation) / 200) * 200;

  // y軸(2軸目)の最大/最小値の設定
  let y_max_axis2;
  let y_min_axis2;
  if (type === TYPE_PACE) {
    const pace = graphInfo.map((item) => item.average_pace);
    // y_max_axis2 = Math.ceil(Math.max(...pace) / 100) * 100;
    y_max_axis2 = 300;
    y_min_axis2 = 0;
  }

  const valueUnit =
    isActiveChart === DISTANCE_CHART ? "km" : isActiveChart === ACTIVE_TIME_CHART ? "min" : null;

  const decimalPlace =
    isActiveChart === DISTANCE_CHART ? 1 : isActiveChart === ACTIVE_TIME_CHART ? 0 : null;

  //グラフオプションの設定
  const options = {
    // アスペクト比を手動で制御
    maintainAspectRatio: false,
    // レスポンシブ設定を有効
    responsive: true,
    // グラフのアニメーションを無効
    animation: false,
    plugins: {
      // グラフの注釈(凡例)を消す
      legend: {
        display: false,
      },
      // ツールチップ（値の表示）を無効
      tooltip: {
        enabled: false,
      },
    },
    // データポイントの丸表示を無効
    elements: {
      point: {
        radius: 0,
      },
    },

    // 軸のスケールを設定
    scales: {
      // X軸の設定
      x: {
        type: "linear",
        position: "bottom",
        // X軸の表示幅
        min: x_min,
        max: x_max,
        ticks: {
          // X軸のメモリ間隔
          stepSize: (x_max - x_min) / X_TICK_COUNT,
          font: {
            size: remToPx(TICK_FONT_SIZE_REM),
          },
          // X軸の最初のメモリのラベルを'km'に設定
          callback: function (value, index) {
            if (isActiveChart === DISTANCE_CHART || isActiveChart === ACTIVE_TIME_CHART) {
              if (index === 0) {
                return valueUnit;
              }
              // X軸のメモリの値は小数点第1位まで表示
              return value.toFixed(decimalPlace);
            }

            if (isActiveChart === TIMESTAMP_CHART) {
              return formatTimestamp(value);
            }
          },
          // メモリの表示名とグラフ間のパディング
          padding: TICK_PADDING,
        },
        grid: {
          // メモリの短い縦線を無効
          drawTicks: false,
        },
      },
      // Y軸(1軸目)の設定(標高グラフ)
      "y-axis-1": {
        type: "linear",
        position: "left",
        // Y軸の表示幅
        max: y_max_axis1,
        min: y_min_axis1,
        ticks: {
          // Y軸の表示幅
          stepSize: (y_max_axis1 - y_min_axis1) / Y_TICK_COUNT,
          // Y軸のフォントサイズ
          font: {
            size: remToPx(TICK_FONT_SIZE_REM),
          },
          // Y軸の最初のメモリのラベルを'm'に設定
          callback: function (value, index) {
            if (index === 0) {
              return "m";
            }
            return value.toString();
          },
          // メモリの表示名とグラフ間のパディング
          padding: TICK_PADDING,
        },
        grid: {
          // メモリ線を非表示
          drawTicks: false,
        },
      },
    },
  };

  // Y軸(2軸目)の設定(平均ペースグラフ)
  if (type === TYPE_PACE) {
    options.scales["y-axis-2"] = {
      type: "linear",
      position: "right",
      // Y軸の表示幅
      max: y_max_axis2,
      min: y_min_axis2,
      ticks: {
        // Y軸の表示幅
        stepSize: 100,
        // Y軸のフォントサイズ
        font: {
          size: remToPx(TICK_FONT_SIZE_REM),
        },
        // Y軸の最初のメモリのラベルを'm'に設定
        callback: function (value, index) {
          if (index === 0) {
            return "%";
          }
          return value.toString();
        },
        // メモリの表示名とグラフ間のパディング
        padding: TICK_PADDING,
      },
      grid: {
        // グリッド線を非表示
        display: false,
        // メモリ線を非表示
        drawTicks: false,
      },
    };
  }
  return options;
};

// グラフで扱うデータの取得関数
const getChartData = (graphInfo, type, isActiveChart) => {
  // 標高グラフの塗りつぶし色
  const CHART_FILL_COLOR_TOP = "rgba(132, 132, 132, 0.5)";
  const CHART_FILL_COLOR_BACK = "rgba(132, 132, 132, 0.2)";

  const x_value = graphInfo.map((item) =>
    isActiveChart === DISTANCE_CHART
      ? item.total_distance
      : isActiveChart === ACTIVE_TIME_CHART
        ? item.active_time
        : item.timestamp,
  );

  // 平均ペース値をもとに算出したグラフ線の配色を取得する関数
  const getPaceColor = (context) => {
    const index = "p0DataIndex" in context ? context.p0DataIndex : context.dataIndex;
    if (index != null) {
      return getColor(graphInfo[index].average_pace);
    }
  };

  // グラフのデータセットの設定
  const data = {
    // X軸のデータの設定
    labels: x_value,
    datasets: [
      {
        label: "Elevation Chart",
        // Y軸のデータ設定
        // data: graphInfo,
        data: graphInfo.map((item) => item.elevation),
        // グラフの塗りつぶし設定の有効化
        fill: true,
        // グラフの塗りつぶし色の設定
        backgroundColor: CHART_FILL_COLOR_TOP,
        // グラフの線の太さの設定
        borderWidth: 0,
        // グラフの表示順(背面)
        order: 2,
        yAxisID: "y-axis-1",
      },
    ],
  };

  // 2軸目に表示する平均ペースグラフのデータセットの設定
  if (type === TYPE_PACE) {
    // 標高グラフの塗りつぶし色の変更
    data.datasets[0].backgroundColor = CHART_FILL_COLOR_BACK;

    // 平均ペースのデータセット
    data.datasets[1] = {
      label: "Pace Chart",
      // Y軸のデータ設定
      data: graphInfo.map((item) => item.average_pace),
      // グラフの塗りつぶし設定の無効化
      fill: false,
      // グラフのデータポイントの色に平均ペース値によって算出した色を指定
      backgroundColor: getPaceColor,
      borderColor: getPaceColor,
      // 線の太さ
      borderWidth: 3,
      // 線の丸みの設定
      lineTension: 0.1,
      // データポイント間の線の色に平均ペース値によって算出した色を指定
      segment: {
        borderColor: getPaceColor,
      },
      // グラフの表示順(前面)
      order: 1,
      yAxisID: "y-axis-2",
    };
  }

  return data;
};

// 登山活動情報をグラフ化するコンポーネント
export const ActivityChart = ({ className }) => {
  const chartRef = useRef(null);
  const mouseXRef = useRef(null);

  const isPaceButtonOn = useRecoilValue(isPaceButtonOnState);
  const isPaceButtonOnRef = useRef(isPaceButtonOn);
  const graphInfo = useRecoilValue(routeGraphState);
  const setShareCoordinate = useSetRecoilState(shareCoordinateState);
  const setShareCoordinateRef = useRef(setShareCoordinate);
  const [isActiveChart, setIsActiveChart] = useState(DISTANCE_CHART);
  const isActiveChartRef = useRef(isActiveChart);
  const [chartOptions, setChartOptions] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isReady, setIsReady] = useState(null);

  // 平均ペースボタンのON/OFFで表示するグラフの内容を切り換え
  useLayoutEffect(() => {
    // グラフデータの取得が完了していない場合は、処理終了
    if (!graphInfo) return;

    // グラフのオプションの設定
    const _chartOptions = isPaceButtonOn
      ? getChartOptions(graphInfo, TYPE_PACE, isActiveChart)
      : getChartOptions(graphInfo, TYPE_ELEVATION, isActiveChart);

    // グラフのデータセットの設定
    const _chartData = isPaceButtonOn
      ? getChartData(graphInfo, TYPE_PACE, isActiveChart)
      : getChartData(graphInfo, TYPE_ELEVATION, isActiveChart);

    // 設定した内容をstateに保存
    setChartOptions(_chartOptions);
    setChartData(_chartData);

    // グラフの準備完了を設定
    setIsReady(true);

    isPaceButtonOnRef.current = isPaceButtonOn;
    isActiveChartRef.current = isActiveChart;

    // クリーンアップ処理
    return () => {};
  }, [graphInfo, isPaceButtonOn, isActiveChart]);

  // カスタムプラグインとグラフ要素(canvas要素)に対するイベントハンドラの設定
  useEffect(() => {
    // グラフ要素がマウントされていないまたは、グラフの準備が未完了の場合は、処理終了
    if (!chartRef.current || !isReady) return;

    // プラグインのインスタンスを作成
    const verticalLinePluginInstance = verticalLinePlugin(
      isActiveChartRef,
      isPaceButtonOnRef,
      setShareCoordinateRef,
      graphInfo.map((item) => item.coordinates),
    );

    // カスタムプラグインの登録
    ChartJS.register(verticalLinePluginInstance);

    // グラフ要素に対するmousemoveのイベントハンドラー関数
    const handleMouseMove = (event) => {
      const chart = chartRef.current;
      const canvas = chart.canvas;

      // グラフ要素の寸法とビューポートに対する位置情報を返すDOMRectオブジェクトを取得
      const rect = canvas.getBoundingClientRect();

      // グラフ要素の左上を座標(0,0)とした場合のマウスの座標情報を取得
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // カーソル位置がグラフ要素内の場合
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        // カーソル位置がグラフの表示領域内の場合
        if (x >= chart.chartArea.left && x <= chart.chartArea.right) {
          mouseXRef.current = x;
        } else {
          // カーソル位置がグラフの表示領域外の左側のグラフ要素内の場合
          if (x < chart.chartArea.left) {
            mouseXRef.current = chart.chartArea.left;
            // カーソル位置がグラフ表示領域外の右側のグラフ要素内の場合
          } else {
            mouseXRef.current = chart.chartArea.right;
          }
        }
        // カーソル位置がグラフ要素外の場合
      } else {
        // グラフ領域内のＸ軸の座標情報をリセット
        mouseXRef.current = null;
      }

      // プラグインオプションを更新
      chart.options.plugins.mouseX = mouseXRef.current;
      // 再レンダリングを抑制して更新
      chart.update("none");
    };

    // グラフ要素に対するmouseleaveのイベントハンドラー関数
    const handleMouseLeave = () => {
      const chart = chartRef.current;

      // グラフ領域内のＸ軸の座標情報をリセット
      mouseXRef.current = null;

      // プラグインオプションを更新
      chart.options.plugins.mouseX = mouseXRef.current;

      // プラグインに連携している座標情報をリセット
      setShareCoordinate(null);

      // 再レンダリングを抑制して更新
      chart.update("none");
    };

    // グラフを表示するcanvas要素のオブジェクトを取得
    const chart = chartRef.current;
    const canvas = chart.canvas;

    // グラフ要素のイベントハンドラを設定
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // クリーンアップ処理
    return () => {
      // グラフ要素のイベントハンドラを削除
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousemove", handleMouseMove);

      // カスタムプラグインの登録解除
      ChartJS.unregister(verticalLinePluginInstance);
    };
  }, [graphInfo, isReady, setShareCoordinate]);

  // グラフの表示切替タブのクリックハンドラ関数
  const handleTabClick = (e, isActiveChart) => {
    e.preventDefault();
    e.stopPropagation();
    setIsActiveChart(isActiveChart);
  };

  return (
    <div className={styles.ElevationChart__Chart}>
      <div className={styles.ElevationChart}>
        <div className={styles.ElevationChart__TabContainer}>
          <button
            aria-label="距離"
            className={styles.ElevationChart__Tab}
            data-active={isActiveChart === DISTANCE_CHART ? "true" : "false"}
            onClick={(e) => handleTabClick(e, DISTANCE_CHART)}
          >
            距離
          </button>
          <button
            aria-label="行動時間"
            className={styles.ElevationChart__Tab}
            data-active={isActiveChart === ACTIVE_TIME_CHART ? "true" : "false"}
            onClick={(e) => handleTabClick(e, ACTIVE_TIME_CHART)}
          >
            行動時間
          </button>
          <button
            aria-label="日時"
            className={styles.ElevationChart__Tab}
            data-active={isActiveChart === TIMESTAMP_CHART ? "true" : "false"}
            onClick={(e) => handleTabClick(e, TIMESTAMP_CHART)}
          >
            日時
          </button>
        </div>
        <div className={`${styles.ElevationChart__Container} ${className}`}>
          <div id={TOOLTIP_ELEMENT_ID} className={styles.ElevationChart__Tooltip}></div>
          {chartOptions && chartData && (
            <Line ref={chartRef} options={chartOptions} data={chartData} />
          )}
        </div>
      </div>
    </div>
  );
};
