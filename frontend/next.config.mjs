import axios from "axios";
import axiosRetry from "axios-retry";
import fs from "fs";
import path from "path";

// リトライ設定
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

// Vaultの設定
const VAULT_ADDR = process.env.VAULT_ADDR || "https://vault.climbing-service.com:8200";
const VAULT_TOKEN_PATH = "/etc/vault.d/token.txt";

// トークンをファイルから読み込む関数
function getVaultToken() {
  try {
    const token = fs.readFileSync(path.resolve(VAULT_TOKEN_PATH), "utf8");
    return token.trim(); // 改行や余計な空白を削除
  } catch (error) {
    console.error(`Error reading Vault token from ${VAULT_TOKEN_PATH}:`, error);
    return null;
  }
}

// Vaultからシークレットを取得する関数
async function getVaultSecret(path) {
  const token = getVaultToken();
  if (!token) {
    console.error("Vault token is missing");
    return null;
  }

  const url = `${VAULT_ADDR}/v1/${path}`;
  const headers = {
    "X-Vault-Token": token,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching secret from Vault:", error);
    return null;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  const vaultData = await getVaultSecret("secret/data/climbing-service/frontend");

  return {
    // セキュリティの観点から、next.jsからのX-Powered-Byヘッダーを無効化
    poweredByHeader: false,

    // Vaultから取得したデータをenvプロパティに設定
    env: {
      NEXT_PUBLIC_GSI_TILE_URL: vaultData.GSI_TILE_URL,
      NEXT_PUBLIC_FRONTEND_BASE_URL: vaultData.FRONTEND_BASE_URL,
      NEXT_PUBLIC_BACKEND_BASE_URL: vaultData.BACKEND_BASE_URL,
      NEXT_PUBLIC_COOKIE_DOMAIN: vaultData.COOKIE_DOMAIN,
    },
  };
};

export default nextConfig;
