import kuromoji from "kuromoji";
import { DIR_PATH } from "@data/constants";

let tokenizer = null;

// 検索キーワードの候補の絞り込みの際に使用するkuromojiの初期化処理関数
export const initTokenizer = () => {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: DIR_PATH.DICT }).build((error, _tokenizer) => {
      if (error) {
        reject(error);
      } else {
        tokenizer = _tokenizer;
        resolve();
      }
    });
  });
};

// kuromojiを使用して漢字を平仮名に変換する関数;
export const toHiragana = (input) => {
  if (!tokenizer) {
    throw new Error("Tokenizer has not been initialized. Please call initTokenizer() first.");
  }
  const tokens = tokenizer.tokenize(input);
  return tokens.map((token) => token.reading).join("");
};
