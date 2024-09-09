import { scaleLinear } from "d3-scale";

// 引数に指定した値をもとに色のグラデーション値を取得する関数
export function getColor(value) {
  const scale = scaleLinear()
    .domain([50, 100, 150, 200])
    .range(["#022bbf", "#00c2f7", "#f7c600", "#f70000"]);

  return scale(value);
}
