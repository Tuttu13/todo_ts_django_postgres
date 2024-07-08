from django.urls import path

from . import views

urlpatterns = [
    path("todo/", views.ListView.as_view(), name="task-list"),
    path("todo/<int:pk>/", views.DetailView.as_view(), name="task-detail"),
    path('todo/summary/', views.task_summary, name='task-summary'),
]
