from django.core.management.base import BaseCommand
from django.db.models import Sum
from climbing.models import Contract, ActivityPhotos


class Command(BaseCommand):
    """ユーザーの登山活動データに基づいてDomoポイントの総和を計算し、契約情報を更新するコマンドクラス

    特定のユーザーに関連するActivityPhotosテーブルからDomoポイントの合計を算出し、
    その結果をContractテーブルの対象フィールドに反映する

    Attributes:
        help (str): コマンドの説明
    """

    help = "Update a specific record with the sum of existing data"

    def handle(self, *args, **kwargs):
        """コマンド実行時に呼び出されるメソッド

        ユーザーIDが2のユーザーに対して、ActivityPhotosテーブルからDomoポイントの合計を取得し、
        Contractテーブルのdomo_pointsフィールドを更新する

        Args:
            *args: 任意の引数リスト
            **kwargs: 任意のキーワード引数辞書

        Raises:
            Contract.DoesNotExist: 指定したユーザーIDに対応するレコードが存在しない場合
        """

        # ユーザーIDが0002のユーザの登山活動データからDomoポイントを抽出し、ポイントの総和を計算
        total_sum = ActivityPhotos.objects.filter(user=2).aggregate(total_sum=Sum("domo_points"))["total_sum"]

        # 更新する契約情報テーブルのフィールドを取得
        try:
            update_target = Contract.objects.get(user=2)
        except ActivityPhotos.DoesNotExist:
            self.stdout.write(self.style.ERROR("Record does not exist"))
            return

        # 算出したDomoポイントの総和で更新
        update_target.domo_points = total_sum
        update_target.save()

        self.stdout.write(
            self.style.SUCCESS(f"Successfully updated record with total sum: {update_target.domo_points}")
        )
