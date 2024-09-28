"use client";

import { useRef, useEffect, forwardRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import DatePicker, { registerLocale } from "react-datepicker";
import { DoubleLeftArrow, LeftArrow, DoubleRightArrow, RightArrow } from "@components/icons";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ja from "date-fns/locale/ja";
import dayjs from "dayjs";
import { isSameDay, isSameMonth } from "date-fns";
import { getDateQueryParams, setDateQueryParams } from "@utils/control/query";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Calendar.module.css";

// 日本語ロケールを登録
registerLocale("ja", ja);

const CustomInput = forwardRef(({ value, onClick, onKeyDown }, ref) => (
  <input
    ref={ref}
    value={value}
    onClick={onClick} // クリック時にカレンダーを開く
    onKeyDown={onKeyDown} // キーボードの入力を防ぐ
    placeholder="日付を選択"
    className="custom-input"
  />
));

CustomInput.displayName = "CustomInput";

// カレンダーを表示するコンポーネント
export const Calendar = ({
  setState,
  setPage,
  className,
  startAt,
  endAt,
  minDate = null,
  maxDate = null,
}) => {
  const minDateValue = minDate === null ? new Date(1970, 0, 1) : minDate;
  const maxDateValue = maxDate === null ? new Date() : maxDate;
  const isStartAt = startAt !== undefined;
  const dateState = isStartAt ? startAt : endAt;
  const typeStr = isStartAt ? "startAt" : "endAt";

  const calendarDate = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // クエリパラメータの読み込み
  useEffect(() => {
    // 開始日時/終了日時のクエリパラメータから日時情報を読み込み
    const dateValues = getDateQueryParams(searchParams, isStartAt);

    // 開始日時/終了日時をstateに設定
    setState(dateValues);

    // クリーンアップ処理
    return () => {};
  }, [isStartAt, searchParams, setState]);

  // カレンダーのヘッダー情報を表示するコンポーネント
  const renderHeader = ({ date, decreaseYear, increaseYear, decreaseMonth, increaseMonth }) => {
    calendarDate.current = date;

    return (
      <div className={styles.datepicker__header}>
        <div>
          <button
            aria-label="前年"
            className={styles.datepicker__button}
            onClick={() => {
              decreaseYear();
            }}
          >
            <DoubleLeftArrow className={styles.datepicker__icon} />
          </button>

          <button
            aria-label="前月"
            className={styles.datepicker__button}
            onClick={() => {
              decreaseMonth();
            }}
          >
            <LeftArrow className={styles.datepicker__icon} />
          </button>
        </div>
        <div className={styles["datepicker__header-date"]}>
          <div className={styles["datepicker__header-date__year"]}>{dayjs(date).year()}年</div>
          <div className={styles["datepicker__header-date__month"]}>
            {dayjs(date).month() + 1}月
          </div>
        </div>
        <div>
          <button
            aria-label="翌年"
            className={styles.datepicker__button}
            onClick={() => {
              increaseMonth();
            }}
          >
            <RightArrow className={styles.datepicker__icon} />
          </button>
          <button
            aria-label="翌月"
            className={styles.datepicker__button}
            onClick={() => {
              increaseYear();
            }}
          >
            <DoubleRightArrow className={styles.datepicker__icon} />
          </button>
        </div>
      </div>
    );
  };

  // カレンダーの日付のスタイルクラスの設定
  const dayClassName = (date) => {
    const today = new Date();

    const style =
      date > maxDateValue || date < minDateValue
        ? styles["datepicker--not-selectable"]
        : !isSameMonth(date, calendarDate.current)
          ? styles["datepicker--not-current-month"]
          : !isSameDay(date, today)
            ? styles["datepicker--current-month"]
            : `${styles["datepicker--current-month"]} ${styles["datepicker--today"]}`;

    return style;
  };

  // 日付情報が変更した際のハンドラ関数
  const handleDateChange = (date) => {
    if (date <= maxDateValue && date >= minDateValue) {
      // 開始日時/終了日時をstateに設定
      setState(date);

      // 開始日時/終了日時のクエリパラメータの設定
      setDateQueryParams(pathname, searchParams, date, isStartAt);

      // １ページから表示するようにページを設定
      setPage(1);
    }
  };

  return (
    <div className={styles.datepicker__container}>
      <DatePicker
        renderCustomHeader={renderHeader}
        showPopperArrow={false}
        showIcon
        fixedHeight
        isClearable
        popperPlacement="bottom"
        className={className}
        calendarClassName={styles.datepicker__calendar}
        selected={dateState}
        dayClassName={dayClassName}
        placeholderText="指定なし"
        calendarStartDay={0}
        onChange={handleDateChange}
        locale="ja"
        dateFormat="yyyy/MM/dd"
        showDisabledMonthNavigation
        dropdownMode="select"
        icon={<CalendarMonthIcon className={styles.datepicker__input__icon} />}
        id={typeStr}
        name={typeStr}
      />
    </div>
  );
};
