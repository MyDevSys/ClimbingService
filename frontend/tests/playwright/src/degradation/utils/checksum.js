import { createHash } from "crypto";
import { readFile } from "fs/promises";

// ファイルのSHA256チェックサムを取得する関数
export async function calculateChecksum(filePath) {
  // ファイルを非同期で読み込み
  const fileBuffer = await readFile(filePath);

  // cryptoを使ってSHA256ハッシュを計算
  const hash = createHash("sha256");
  hash.update(fileBuffer);
  return hash.digest("hex");
}
