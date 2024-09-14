"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCheckBoxQueryParams, setCheckBoxQueryParams } from "@utils/control/query";

import styles from "./CheckBox.module.css";

// 活動月・活動タイプのチェックボックスを表示するコンポーネント
export const CheckBox = ({
  monthCheckboxState = null,
  typeCheckboxState = null,
  setState,
  labelList,
  handleChange = () => {},
  labelClassName = "",
  boxClassName = "",
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMonth = monthCheckboxState !== null;
  const checkboxState = isMonth ? monthCheckboxState : typeCheckboxState;
  const typeStr = isMonth ? "Month" : "Type";

  // クエリパラメータの読み込み
  useEffect(() => {
    // 活動月/活動タイプのクエリパラメータから日時情報を読み込み
    const checkBoxValues = getCheckBoxQueryParams(searchParams, labelList.length, isMonth);

    // 活動月/活動タイプをstateに設定
    if (checkBoxValues !== null) {
      setState(checkBoxValues);
    } else {
      setState(Array(labelList.length).fill(false));
    }

    // クリーンアップ処理
    return () => {};
  }, [isMonth, labelList.length, searchParams, setState]);

  // チェックボックスの変更用ハンドラ関数
  const handleCheckboxChange = (index) => {
    // 指定されたハンドル処理
    handleChange();

    // チェックボックスの更新処理
    const newState = [...checkboxState];
    newState[index] = !newState[index];

    // チェックが入っているチェックボックスのindexを抽出
    const trueMonth = newState
      .map((isCheck, index) => (isCheck ? index : -1))
      .filter((value) => value !== -1);

    // クエリパラメータの作成/更新
    setCheckBoxQueryParams(pathname, searchParams, trueMonth, isMonth);

    // stateの更新
    setState(newState);
  };

  return (
    <>
      {checkboxState.map((checked, index) => (
        <label
          key={index}
          className={`${labelClassName} ${checked ? styles["CheckBox--Checked"] : ""}`}
        >
          <input
            name={`checkbox_${index}`}
            id={`${typeStr}_checkbox_${index}`}
            type="checkbox"
            checked={checked}
            onChange={() => handleCheckboxChange(index)}
            className={`${styles.CheckBox__Input} ${boxClassName}`}
          />
          {labelList[index]}
        </label>
      ))}
    </>
  );
};
