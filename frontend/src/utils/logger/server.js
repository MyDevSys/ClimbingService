import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// プロジェクトルートの取得
const projectRoot = process.cwd();

// logsディレクトリのパス
const logDirectory = path.join(projectRoot, "logs");

// logsディレクトリが存在しなければ作成
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// APIルート用のロガー設定
const apiLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    // ログに出力するタイムスタンプの設定
    winston.format.timestamp({
      format: () => {
        const now = new Date();
        const jstTime = now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
        return `${jstTime}.${milliseconds}`;
      },
    }),
    // ログに出力する内容の設定
    winston.format.printf(({ timestamp, message }) => {
      return `[${timestamp}] ${message}`;
    }),
  ),
  // ログファイルの出力先やローテーションの設定
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/frontend_api_%DATE%.log",
      datePattern: "YYYYMMDD",
      maxFiles: "14d",
    }),
  ],
});

// コンポーネント用のロガー設定
const appLogger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    // ログに出力するタイムスタンプの設定
    winston.format.timestamp({
      format: () => {
        const now = new Date();
        const jstTime = now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
        return `${jstTime}.${milliseconds}`;
      },
    }),
    // ログに出力する内容の設定
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}][${level}] ${message}`;
    }),
  ),
  // ログファイルの出力先やローテーションの設定
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/frontend_app_%DATE%.log",
      datePattern: "YYYYMMDD",
      maxFiles: "14d",
    }),
  ],
});

export { apiLogger, appLogger };
