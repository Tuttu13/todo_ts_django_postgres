import os
from datetime import datetime

import django
import pytest
import pytz
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory
from todo.models import Task
from todo.views import DetailView, ListView, task_summary

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.backend.settings")
django.setup()


@pytest.mark.django_db
class TestAPIListViewTests:
    @classmethod
    def setup_class(cls):
        cls.tz = pytz.timezone("Asia/Tokyo")

    def setup_method(self):
        self.factory = APIRequestFactory()
        self.view = ListView.as_view()
        self.url = "/api/todo/"
        Task.objects.all().delete()

    def test_todo_get(self):
        request = self.factory.get(self.url)
        response = self.view(request)
        assert response.status_code == status.HTTP_200_OK

    def test_multiple_tasks_get(self):
        """複数のタスクを取得できることを確認"""
        task1 = Task.objects.create(
            title="Task 1",
            description="Description 1",
            status=0,
            priority=1,
            due_date=self.tz.localize(datetime(2024, 7, 1, 0, 0, 0)),
        )
        task2 = Task.objects.create(
            title="Task 2",
            description="Description 2",
            status=0,
            priority=1,
            due_date=self.tz.localize(datetime(2024, 7, 2, 0, 0, 0)),
        )

        request = self.factory.get(self.url)
        response = self.view(request)

        assert response.status_code == status.HTTP_200_OK

        def convert_to_isoformat(date):
            return date.astimezone(self.tz).isoformat()

        expected_data = [
            {
                "id": task1.id,
                "title": "Task 1",
                "description": "Description 1",
                "status": 0,
                "priority": 1,
                "due_date": convert_to_isoformat(task1.due_date),
                "created_at": convert_to_isoformat(task1.created_at),
                "updated_at": convert_to_isoformat(task1.updated_at),
            },
            {
                "id": task2.id,
                "title": "Task 2",
                "description": "Description 2",
                "status": 0,
                "priority": 1,
                "due_date": convert_to_isoformat(task2.due_date),
                "created_at": convert_to_isoformat(task2.created_at),
                "updated_at": convert_to_isoformat(task2.updated_at),
            },
        ]
        assert response.data["results"] == expected_data
        assert len(response.data["results"]) == len(expected_data)

    def test_todo_post(self):
        """POSTリクエストで新しいタスクを登録できることを確認"""
        data = {
            "title": "新規登録タスク",
            "description": "テストデータ用の新規タスク",
            "status": 0,
            "priority": 0,
            "due_date": None,
        }
        request = self.factory.post(self.url, data, format="json")
        response = self.view(request)
        assert response.status_code == status.HTTP_201_CREATED

        created_task = Task.objects.get()
        expected_data = {
            "id": created_task.id,
            "title": "新規登録タスク",
            "description": "テストデータ用の新規タスク",
            "status": 0,
            "priority": 0,
            "due_date": None,
            "created_at": created_task.created_at.astimezone(self.tz).isoformat(),
            "updated_at": created_task.updated_at.astimezone(self.tz).isoformat(),
        }
        assert response.data == expected_data

    def test_paginated_tasks_get(self):
        """ページネーションされたタスクを取得できることを確認"""
        tasks = [
            Task.objects.create(
                title=f"Task {i}",
                description=f"Description {i}",
                status=i % 3,
                priority=i % 3,
                due_date=self.tz.localize(datetime(2024, 7, 1 + i, 0, 0, 0)),
            )
            for i in range(1, 15)
        ]

        request = self.factory.get(self.url + "?page=1")
        response = self.view(request)

        assert response.status_code == status.HTTP_200_OK

        def convert_to_isoformat(date):
            return date.astimezone(self.tz).isoformat()

        expected_data = [
            {
                "id": tasks[i].id,
                "title": tasks[i].title,
                "description": tasks[i].description,
                "status": tasks[i].status,
                "priority": tasks[i].priority,
                "due_date": convert_to_isoformat(tasks[i].due_date),
                "created_at": convert_to_isoformat(tasks[i].created_at),
                "updated_at": convert_to_isoformat(tasks[i].updated_at),
            }
            for i in range(0, 3)
        ]

        assert response.data["results"] == expected_data
        assert len(response.data["results"]) == 3
        assert response.data["count"] == 14
        assert response.data["page_size"] == 3
        assert response.data["links"]["next"] == "http://testserver/api/todo/?page=2"
        assert response.data["links"]["previous"] is None


@pytest.mark.django_db
class TestAPIDetailViewTests:
    """APIのDetailViewに対するテストクラス"""

    def setup_method(self):
        self.factory = APIRequestFactory()
        self.view = DetailView.as_view()
        Task.objects.all().delete()
        self.task = Task.objects.create(title="Task 1", description="Description 1")
        self.tz = pytz.timezone("Asia/Tokyo")
        self.url = f"http://127.0.0.1:8000/api/todo/{self.task.pk}/"

    def test_todo_get(self):
        """対象データが取得できることの確認"""
        request = self.factory.get(self.url)
        response = self.view(request, pk=self.task.pk)
        # ステータスコードを確認
        assert response.status_code == status.HTTP_200_OK

        # JSONデータを確認
        expected_data = {
            "id": self.task.id,
            "title": self.task.title,
            "description": self.task.description,
            "status": self.task.status,
            "priority": self.task.priority,
            "due_date": self.task.due_date.isoformat() if self.task.due_date else None,
            "created_at": self.task.created_at.astimezone(self.tz).isoformat(),
            "updated_at": self.task.updated_at.astimezone(self.tz).isoformat(),
        }
        assert response.data == expected_data

    def test_todo_put(self):
        """対象データが編集できることの確認(複数)"""
        data = {"title": "Updated Task", "description": "Updated Description"}
        request = self.factory.put(self.url, data, format="json")
        response = self.view(request, pk=self.task.pk)
        # ステータスコードを確認
        assert response.status_code == status.HTTP_200_OK

        # JSONデータを確認
        self.task.refresh_from_db()
        expected_data = {
            "id": self.task.id,
            "title": "Updated Task",
            "description": "Updated Description",
            "status": self.task.status,
            "priority": self.task.priority,
            "due_date": self.task.due_date.isoformat() if self.task.due_date else None,
            "created_at": self.task.created_at.astimezone(self.tz).isoformat(),
            "updated_at": self.task.updated_at.astimezone(self.tz).isoformat(),
        }
        assert response.data == expected_data

    def test_todo_patch(self):
        """対象データを部分的に編集できることの確認"""
        # 初期データをセットアップ
        self.task.title = "PATCHタスク 処理前"
        self.task.description = "テストデータ用のPATCHタスク"
        self.task.status = 1
        self.task.priority = 1
        self.task.due_date = None
        self.task.save()

        # 部分更新データを定義
        data = {"title": "PATCHタスク 処理後"}

        # PATCHリクエストを作成
        request = self.factory.patch(self.url, data, format="json")
        response = self.view(request, pk=self.task.pk)

        # ステータスコードを確認
        assert response.status_code == status.HTTP_200_OK

        # データベースのタスクを更新後の状態にリフレッシュ
        self.task.refresh_from_db()

        # 期待されるJSONデータを定義
        expected_data = {
            "id": self.task.id,
            "title": "PATCHタスク 処理後",  # 更新されたフィールド
            "description": self.task.description,  # 変更なし
            "status": self.task.status,  # 変更なし
            "priority": self.task.priority,  # 変更なし
            "due_date": (
                self.task.due_date.isoformat() if self.task.due_date else None
            ),  # 変更なし
            "created_at": self.task.created_at.astimezone(self.tz).isoformat(),
            "updated_at": self.task.updated_at.astimezone(self.tz).isoformat(),
        }

        # レスポンスデータが期待されるデータと一致することを確認
        assert response.data == expected_data

    def test_todo_delete(self):
        """対象データを削除できることの確認"""
        request = self.factory.delete(self.url)
        response = self.view(request, pk=self.task.pk)
        # ステータスコードを確認
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # JSONデータを確認（DELETEリクエストにはボディがないため、確認は不要）
        assert Task.objects.count() == 0


@pytest.mark.django_db
class TestAPI_Task_SummaryTests:
    """APIのTask_Summaryに対するテストクラス"""

    def setup_method(self):
        Task.objects.all().delete()
        self.tz = pytz.timezone("Asia/Tokyo")

    def test_task_summary(self):
        client = APIClient()
        tz = pytz.timezone("Asia/Tokyo")

        # データをセットアップ
        Task.objects.create(
            title="Task 1",
            description="Description 1",
            status=2,
            priority=1,
            due_date=tz.localize(datetime(2024, 7, 1, 0, 0, 0)),
        )
        Task.objects.create(
            title="Task 2",
            description="Description 2",
            status=0,
            priority=2,
            due_date=tz.localize(datetime(2024, 7, 2, 0, 0, 0)),
        )

        # GETリクエストを作成
        response = client.get("/api/todo/summary/")

        # ステータスコードを確認
        assert response.status_code == 200

        # レスポンスデータを確認
        expected_data = {"total_tasks": 2, "completed_tasks": 1}
        assert response.data == expected_data
