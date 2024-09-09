import logging
import time
from django.conf import settings
from django.utils.timezone import now

logger = logging.getLogger(settings.LOGGER["ACCESS"])


class EnsureCharsetForJsonMiddleware:
    """JSONレスポンスにcharset=utf-8を設定するミドルウェア

    JSONレスポンスのContent-Typeにcharset=utf-8が含まれていない場合、
    charset=utf-8を設定する
    """

    def __init__(self, get_response):
        """ミドルウェアの初期化メソッド

        Args:
            get_response (callable): リクエストを処理してレスポンスを返す関数
        """
        self.get_response = get_response

    def __call__(self, request):
        """JSONレスポンスにcharsetを設定するメソッド

        Args:
            request (HttpRequest): リクエストオブジェクト

        Returns:
            HttpResponse: charset=utf-8が適用されたレスポンスオブジェクト
        """
        response = self.get_response(request)
        if (
            response.get("Content-Type", "").startswith("application/json")
            and "charset" not in response["Content-Type"]
        ):
            response["Content-Type"] = "application/json; charset=utf-8"
        return response


class AccessLogMiddleware:
    """アクセスログを記録するミドルウェア

    アクセスログとして、処理時間やクライアントIP、HTTPメソッド、レスポンスサイズなどを記録する
    """

    def __init__(self, get_response):
        """ミドルウェアの初期化メソッド

        Args:
            get_response (callable): リクエストを処理してレスポンスを返す関数
        """
        self.get_response = get_response

    def __call__(self, request):
        """アクセスログを記録するメソッド

        Args:
            request (HttpRequest): リクエストオブジェクト

        Returns:
            HttpResponse: ログが記録されたレスポンスオブジェクト
        """
        # リクエスト処理開始時間
        start_time = time.perf_counter()

        # リクエストの処理
        response = self.get_response(request)

        # リクエスト処理終了後、レスポンスの内容と処理時間をログに記録
        duration = (time.perf_counter() - start_time) * 1000

        # クライアントIPを取得
        client_ip = request.META.get("REMOTE_ADDR", "")

        # HTTPプロトコルのバージョンを取得
        protocol_version = request.META.get("SERVER_PROTOCOL", "")

        # レスポンスボディがない場合の処理
        response_size = len(response.content) if response.content else 0

        # ログデータの作成
        log_data = {
            "method": request.method,
            "path": request.get_full_path(),
            "status_code": response.status_code,
            "remote_addr": client_ip,
            "duration": f"{duration:.3f}",
            "response_size": response_size,  # レスポンスボディのサイズ
            "protocol": protocol_version,  # HTTPプロトコルのバージョン
        }

        # ログの記録
        logger.info(
            f"{log_data['method']} {log_data['path']} {log_data['protocol']} {log_data['status_code']} "
            f"{log_data['remote_addr']} {log_data['response_size']} {log_data['duration']}"
        )

        return response
