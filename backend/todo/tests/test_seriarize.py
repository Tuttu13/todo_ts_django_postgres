from datetime import datetime

import pytest
import pytz

from todo.models import Task
from todo.serializers import TaskSerializer


@pytest.mark.django_db
class TestTaskSerializer:
    @classmethod
    def setup_class(cls):
        cls.tz = pytz.timezone("Asia/Tokyo")

    def test_valid_data(self):
        """シリアライザが正しくデータをシリアライズできることを確認"""
        task = Task.objects.create(
            title="Test Task",
            description="Test Description",
            status=0,
            priority=0,
            due_date=self.tz.localize(datetime(2024, 7, 1, 0, 0, 0)),
        )
        serializer = TaskSerializer(task)
        expected_data = {
            "id": task.id,
            "title": "Test Task",
            "description": "Test Description",
            "status": 0,
            "priority": 0,
            "due_date": task.due_date.isoformat(),
            "created_at": task.created_at.astimezone(self.tz).isoformat(),
            "updated_at": task.updated_at.astimezone(self.tz).isoformat(),
        }
        assert serializer.data == expected_data

    def test_invalid_data(self):
        """シリアライザが無効なデータを検出することを確認"""
        invalid_data = {
            "title": "",  # タイトルは空ではいけない
            "description": "Test Description",
            "status": 0,
            "priority": 0,
            "due_date": self.tz.localize(datetime(2024, 7, 1, 0, 0, 0)).isoformat(),
        }
        serializer = TaskSerializer(data=invalid_data)
        assert not serializer.is_valid()
        assert "title" in serializer.errors
