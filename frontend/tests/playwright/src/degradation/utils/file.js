import fs from "fs/promises";

// ファイルを削除する関数
export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file: ${error}`);
  }
}
