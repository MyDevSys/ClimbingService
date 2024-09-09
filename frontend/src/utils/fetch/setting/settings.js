export const RETRY_OPTIONS = {
  retries: 3, // リトライ回数
  factor: 2, // リトライ間隔を指数関数的に増加させる因数
  minTimeout: 500, // 最初のリトライまでの間隔を0.5秒に設定
  maxTimeout: 2000, // 最大リトライ間隔を2秒に設定
  randomize: false, // リトライ間隔をランダム化しない
};
