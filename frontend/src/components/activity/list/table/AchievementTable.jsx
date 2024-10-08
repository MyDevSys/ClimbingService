"use client";

import { forwardRef, useEffect, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { useRecoilValue } from "recoil";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableSortLabel from "@mui/material/TableSortLabel";
import { climbingFilterState } from "@state/atoms";
import { usePathname, useSearchParams } from "next/navigation";
import { QUERY_NAME } from "@data/constants";
import { getUrlString } from "@utils/control/query";
import styles from "./AchievementTable.module.css";

const VirtuosoTableComponents = {
  Scroller: forwardRef((props, ref) => (
    <TableContainer {...props} ref={ref} className={styles.TableContainer} />
  )),
  Table: (props) => (
    <Table
      {...props}
      aria-label="sticky table"
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

VirtuosoTableComponents.Scroller.displayName = "Scroller";
VirtuosoTableComponents.Table.displayName = "Table";
VirtuosoTableComponents.TableHead.displayName = "TableHead";
VirtuosoTableComponents.TableBody.displayName = "TableBody";

export function AchievementTable({ achievementList }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [filteredAchievementList, setFilteredAchievementList] = useState([]);
  const filterPrefectures = useRecoilValue(climbingFilterState);
  const climbingCount = filteredAchievementList.reduce((accumulator, currentObject) => {
    return accumulator + currentObject.climbCount;
  }, 0);

  // 各都道府県の登山回数のカウント処理
  const prefectureCount = { 都: 0, 道: 0, 府: 0, 県: 0 };
  const prefectureFlatData = [
    ...new Set(filteredAchievementList.flatMap((item) => item.prefecture_name)),
  ];
  prefectureFlatData.forEach((prefectureName) => {
    switch (prefectureName) {
      case "東京":
        prefectureCount["都"] += 1;
        break;
      case "北海道":
        prefectureCount["道"] += 1;
        break;
      case "京都":
      case "大阪":
        prefectureCount["府"] += 1;
        break;
      default:
        prefectureCount["県"] += 1;
        break;
    }
  });

  // テーブルのヘッダーのカラム定義
  const tableColumnInfo = [
    {
      dataFieldName: "mountain_name",
      sortFieldName: "mountain_name_ruby",
      columnName: "山名",
      count: `${filteredAchievementList.length} 座`,
      className: "column__mountain",
    },
    {
      dataFieldName: "prefecture_name",
      sortFieldName: "prefecture_name_ruby",
      columnName: "都道府県",
      count: Object.entries(prefectureCount)
        .filter(([_, value]) => value !== 0)
        .map(([key, value]) => `${value} ${key}`)
        .join(""),
      className: "column__prefecture",
    },
    {
      dataFieldName: "climbCount",
      sortFieldName: "climbCount",
      columnName: "登頂回数",
      count: `${climbingCount} 回`,
      className: "column__climbCount",
    },
    {
      dataFieldName: "elevation",
      sortFieldName: "elevation",
      columnName: "標高",
      count: "",
      className: "column__elevation",
    },
  ];

  // テーブルカラムソートのハンドラ関数
  const handleSort = (field) => {
    let direction;

    // ソート対象のフィールドとソート順をstateに設定
    if (field === sortedField) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    } else {
      direction = "desc";
      setSortedField(field);
    }
    setSortDirection(direction);

    // ソート対象のフィールドとソート順をクエリパラメータに設定
    const params = new URLSearchParams(searchParams);
    params.set(QUERY_NAME.FIELD, field);
    params.set(QUERY_NAME.DIRECTION, direction);
    // クエリパラメータを反映したURLの取得
    const urlString = getUrlString(pathname, params);
    // ブラウザのURLを変更し、履歴に追記
    window.history.pushState({}, "", urlString);
  };

  function fixedHeaderContent() {
    return (
      <TableRow>
        {tableColumnInfo.map((item, index) => (
          <TableCell key={index} className={`${styles.tableHeaderCell} ${styles[item.className]}`}>
            <TableSortLabel
              active={sortedField === item.sortFieldName}
              direction={sortDirection}
              onClick={() => handleSort(item.sortFieldName)}
            >
              <div className={styles.label__Counter}>
                <span>{item.columnName}</span>
                {item.count !== "" && <span className={styles.countValue}>{item.count}</span>}
              </div>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function rowContent(_, row) {
    return (
      <>
        <TableCell className={`${styles.tableRow} ${styles.mountain__prefecture__value}`}>
          <p className={styles.mountain__textColor}>{row.mountain_name}</p>
          <p>{`(${row.prefecture_name.join("、")})`}</p>
        </TableCell>
        <TableCell
          className={`${styles.tableRow} ${styles.mountain__value} ${styles.mountain__textColor}`}
        >
          {row.mountain_name}
        </TableCell>
        <TableCell className={`${styles.tableRow} ${styles.prefecture__value}`}>
          {row.prefecture_name.join("、")}
        </TableCell>
        <TableCell className={styles.tableRow}>{row.climbCount.toLocaleString("ja-JP")}</TableCell>
        <TableCell className={styles.tableRow}>{row.elevation.toLocaleString("ja-JP")} m</TableCell>
      </>
    );
  }

  // クエリパラメーターからソート対象のフィールドとソート順を取得
  // (ページリロードしても、リロード前のソート対象とソート順を維持するための処理)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has(QUERY_NAME.FIELD)) {
      setSortedField(params.get(QUERY_NAME.FIELD));
    } else {
      setSortedField(null);
    }
    if (params.has(QUERY_NAME.DIRECTION)) {
      setSortDirection(params.get(QUERY_NAME.DIRECTION));
    } else {
      setSortDirection("desc");
    }
    // クリーンナップ処理
    return () => {};
  }, [searchParams]);

  // テーブルのフィルタ―とソート処理
  useEffect(() => {
    // 日本地図で選択した都道府県で登山実績をフィルタリング
    let matchingElements;
    if (filterPrefectures.length === 0) {
      matchingElements = achievementList;
    } else {
      matchingElements = achievementList.filter((item) =>
        item.prefecture_name.some((prefecture) => filterPrefectures.includes(prefecture)),
      );
    }

    // フィルタリングした結果をもとにソート対象のフィールドとソート順にしたがってソーティング
    let sortedAchievementList;
    if (!sortedField) {
      sortedAchievementList = matchingElements;
    } else {
      sortedAchievementList = [...matchingElements].sort((a, b) => {
        const aValue = a[sortedField];
        const bValue = b[sortedField];

        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    // フィルタ―とソートの結果をstateに保存
    setFilteredAchievementList(sortedAchievementList);

    // クリーンアップ処理
    return () => {};
  }, [filterPrefectures, achievementList, sortDirection, sortedField, setFilteredAchievementList]);

  return (
    <div className={styles.TableOverlay}>
      <TableVirtuoso
        data={filteredAchievementList}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </div>
  );
}
