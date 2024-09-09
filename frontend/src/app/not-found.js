import { ClientError } from "@components/activity/failure";
import { StatusCodes } from "http-status-codes";

// 404のエラーページを表示するコンポーネント
export default function NotFound() {
  return <ClientError status={StatusCodes.NOT_FOUND} isFullScreen={true} />;
}
