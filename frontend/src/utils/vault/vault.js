import vault from "node-vault";
import fs from "fs";
import path from "path";
import retry from "retry";
import { RETRY_OPTIONS } from "@utils/fetch/setting/settings";
import { appLogger } from "@utils/logger/server";

// トークンをファイルから読み込む関数
function getVaultToken() {
  const VAULT_TOKEN_PATH = process.env.VAULT_TOKEN_PATH;

  try {
    const token = fs.readFileSync(path.resolve(VAULT_TOKEN_PATH), "utf8");
    return token.trim();
  } catch (error) {
    appLogger.error(`Error reading Vault token from ${VAULT_TOKEN_PATH}:`, error);
    return null;
  }
}

// Vaultからシークレットを取得する関数
export async function getVaultSecret(path) {
  const operation = retry.operation(RETRY_OPTIONS);
  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        // Vaultのエンドポイントとトークンを環境変数から取得
        const vaultClient = vault({
          endpoint: process.env.VAULT_ADDR, // VaultサーバーURL
          token: getVaultToken(), // Vaultトークン
        });

        const result = await vaultClient.read(path);

        resolve(result.data.data);
      } catch (error) {
        appLogger.error(`Vault Secret Read Error (${path}) : ${error}`);
        if (operation.retry(error)) {
          return; // リトライ回数が上限に達していなければリトライ
        } else {
          appLogger.error(`Vault Secret Read Retry Over`);
        }
        reject(error); // リトライ上限に達した場合はエラーを返す
      }
    });
  });
}
