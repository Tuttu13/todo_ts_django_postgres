from django.db import models


class Task(models.Model):
    STATUS_CHOICES = [
        (0, "未実施"),
        (1, "実施中"),
        (2, "完了"),
    ]
    PRIORITY_CHOICES = [
        (0, "低"),
        (1, "中"),
        (2, "高"),
    ]

    title = models.CharField(max_length=255, verbose_name="タスク名")
    description = models.TextField(blank=True, null=True, verbose_name="詳細")
    status = models.IntegerField(choices=STATUS_CHOICES, default=0, verbose_name="状況")
    priority = models.IntegerField(
        choices=PRIORITY_CHOICES, default=0, verbose_name="優先度"
    )
    due_date = models.DateTimeField(blank=True, null=True, verbose_name="期限")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="登録日")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日")

    def __str__(self):
        return self.title
