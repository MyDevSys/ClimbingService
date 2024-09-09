"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { toRomaji } from "wanakana";
import { initTokenizer, toHiragana } from "@utils/convert";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LandscapeIcon from "@mui/icons-material/Landscape";
import ClearIcon from "@mui/icons-material/Clear";
import { setKeywordsQueryParams, getKeywordsQueryParams } from "@utils/control/query";
import { KEYWORD_TYPE } from "@data/constants";
import { log } from "@utils/logger/client";

import styles from "./AutocompleteTextField.module.css";

// オートコンプリート機能付きのテキストフィールドを提供するコンポーネント
export const AutocompleteTextField = ({
  activityData,
  selectedValues,
  setSelectedValues,
  setPage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isTokenizerReady, setIsTokenizerReady] = useState(false);
  const [keywordValues, setKeywordValues] = useState([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // kuromojiの初期化処理
  useEffect(() => {
    initTokenizer()
      .then(() => {
        setIsTokenizerReady(true);
      })
      .catch((error) => {
        log.error(
          `${AutocompleteTextField.displayName} Tokenizer initialization failed (${error.message})`,
        );
      });

    // 検索キーワードのクエリパラメータの読み込み処理
    const keywordValues = getKeywordsQueryParams(searchParams);

    //　検索キーワードをソートして設定
    if (keywordValues.length > 0) {
      setSelectedValues(keywordValues.sort(sortByTypeDesc));
    }

    // クリーンアップ処理
    return () => {};
  }, []);

  // クエリパラメータの読み込み
  useEffect(() => {
    // 検索キーワードのクエリパラメータの読み込み処理
    const keywordValues = getKeywordsQueryParams(searchParams);

    //　検索キーワードをソートして設定
    if (keywordValues.length > 0) {
      setSelectedValues(keywordValues.sort(sortByTypeDesc));
    } else {
      setSelectedValues([]);
    }

    // クリーンアップ処理
    return () => {};
  }, [searchParams]);

  // 活動情報から検索キーワード候補の抽出処理
  useEffect(() => {
    // 活動情報が未設定の場合は、処理終了
    if (activityData === null) return;

    // 活動情報から都道府県情報を抽出
    const prefectures = activityData.map((activity) => activity.prefectures);
    const uniquePrefectures = [...new Set(prefectures.flat())];

    // 活動情報から活動エリア情報を抽出
    const areas = activityData.map((activity) => activity.areas);
    const uniqueAreas = [...new Set(areas.flat())];

    // 検索キーワード候補の作成
    const keywords = [
      ...uniquePrefectures.map((item) => ({ name: item, type: KEYWORD_TYPE.LOCATION })),
      ...uniqueAreas.map((item) => ({ name: item, type: KEYWORD_TYPE.AREA })),
    ];

    // 検索キーワード候補の設定
    setKeywordValues(keywords);

    // クリーンアップ処理
    return () => {};
  }, [activityData]);

  // テキストフィールドの値が変化した際のハンドラ処理
  const handleChange = (_, newInputValue) => {
    setInputValue(newInputValue);
  };

  // 検索キーワードの種別で降順ソートするための比較関数
  const sortByTypeDesc = (a, b) => b.type - a.type;

  // 検索キーワード候補を選択した際のハンドラ処理
  const handleSelect = (event, newValue, reason) => {
    // DeleteとBackspaceキーを押下した際に、選択キーワードが削除さないように対処
    if (
      reason === "removeOption" &&
      event &&
      (event.key === "Backspace" || event.key === "Delete")
    ) {
      return;
    }

    // 変更後の検索キーワード候補を選択キーワードを種別でソート
    const updateKeywords = newValue.sort(sortByTypeDesc);

    // 選択キーワードをstateに保存
    setSelectedValues(updateKeywords);

    // 検索キーワードのクエリパラメータの設定
    setKeywordsQueryParams(pathname, searchParams, updateKeywords);

    // １ページから表示するようにページを設定
    setPage(1);
  };

  // ローマ字かどうかを判定する関数
  const isRomaji = (input) => {
    return /^[a-zA-Z]+$/.test(input);
  };

  // 先頭と末尾の記号を除去する関数
  String.prototype.trimSymbols = function () {
    return this.replace(
      /^[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+|[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/g,
      "",
    );
  };

  // 漢字かどうかを判定する関数
  function isKanji(char) {
    const kanjiRegex = /^[\u4e00-\u9faf\u3400-\u4dbf]+$/;
    return kanjiRegex.test(char);
  }

  // 検索キーワードのフィルタ―関数
  const filterOptions = (options, state) => {
    let optionList;

    // テキストフィールドに何も入力していない場合は、検索キーワード候補を全て設定
    if (state.inputValue.length === 0) {
      optionList = options;
    } else {
      // テキストフィールドの入力値の補正処理
      const input = state.inputValue.trim().trimSymbols().toLowerCase();

      // 入力値を補正した結果、空文字の場合は、検索キーワード候補をゼロで返す
      if (input.length === 0) return [];

      // 入力値が漢字の場合、部分一致する検索キーワード候補の結果を返す
      if (isKanji(input)) {
        const resultList = options.filter((option) => {
          return option.name.includes(input);
        });
        return resultList;
      }

      // 入力値がローマ字以外の場合、平仮名に変換した後、ローマ字に変換
      let romajiInput = "";
      if (!isRomaji(input)) {
        const hiraganaInput = toHiragana(input);
        romajiInput = toRomaji(hiraganaInput);
      } else {
        romajiInput = input;
      }

      // ローマ字に変換できない特殊文字の場合は、検索キーワード候補をゼロで返す
      if (romajiInput.length === 0) return [];

      // 変換した入力値のローマ字と検索キーワード候補のローマ字を比較し、部分一致する
      // 検索キーワード候補を検索
      optionList = options.filter((option) => {
        const romajiOption = toRomaji(toHiragana(option.name));
        return romajiOption.toLowerCase().includes(romajiInput);
      });
    }

    // 検索キーワード候補からすでに選択済みの候補を除外
    const resultList = optionList.filter(
      (option) => !selectedValues.some((selectValue) => selectValue.name === option.name),
    );

    // 検索キーワード候補を返す
    return resultList;
  };

  // 検索キーワードのレンダー関数
  const renderOption = (props, option) => (
    <ListItem {...props} key={option.name} className={styles.Autocomplete__List}>
      <ListItemText primary={option.name} className={styles.Autocomplete__List__Text} />
      <ListItemIcon>
        {option.type === KEYWORD_TYPE.LOCATION && (
          <LocationOnIcon className={styles.Autocomplete__List__Icon} />
        )}
        {option.type === KEYWORD_TYPE.AREA && (
          <LandscapeIcon className={styles.Autocomplete__List__Icon} />
        )}
      </ListItemIcon>
    </ListItem>
  );

  // 選択した検索キーワードの削除関数
  const removeKeyword = (targetIndex) => {
    const updateKeywords = selectedValues
      .filter((_, index) => index !== targetIndex)
      .sort(sortByTypeDesc);

    // 削除した検索キーワードをstateに保存
    setSelectedValues(updateKeywords);

    // 検索キーワードのクエリパラメータの設定
    setKeywordsQueryParams(pathname, searchParams, updateKeywords);

    // １ページから表示するようにページを設定
    setPage(1);
  };

  return (
    <div>
      <Autocomplete
        id="filter"
        disabled={!isTokenizerReady}
        multiple
        options={keywordValues}
        openOnFocus
        getOptionLabel={(option) => option?.name}
        onInputChange={handleChange}
        inputValue={inputValue}
        value={selectedValues}
        onChange={handleSelect}
        disableClearable
        isOptionEqualToValue={(option, value) => option.name === value.name}
        filterOptions={filterOptions}
        noOptionsText="該当データなし"
        renderTags={() => null}
        classes={{
          noOptions: styles.Autocomplete__No__Options,
          listbox: styles.Autocomplete__scrollbar,
        }}
        renderOption={renderOption}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              placeholder="例.福岡県"
              variant="outlined"
              fullWidth
              slotProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end" className={styles.Autocomplete__Input__Icon}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              className={styles.Autocomplete__Input}
            />
          );
        }}
      />
      <div className={styles.Autocomplete__Keyword__Container}>
        {selectedValues?.map((keyword, index) => (
          <div key={index} className={styles.Autocomplete__Keyword__Item}>
            <span className={styles.Autocomplete__Keyword__Text}>{keyword.name}</span>
            <button
              aria-label="フィルタ―キーワード削除"
              onClick={() => removeKeyword(index)}
              className={styles.Autocomplete__Keyword__Button}
            >
              <ClearIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

AutocompleteTextField.displayName = "AutocompleteTextField";
