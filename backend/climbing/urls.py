from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import (
    CsrfTokenView,
    AuthTokenObtainPairView,
    AuthTokenRefreshView,
    ActivityList,
    ActivityDetail,
    UserProfile,
    ClimbingAchievements,
)

urlpatterns = [
    path("api/auth/csrf/", CsrfTokenView.as_view(), name="csrf_token"),
    path("api/auth/token/", AuthTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", AuthTokenRefreshView.as_view(), name="token_refresh"),
    path("api/users/<int:user_id>/", ActivityList.as_view(), name="activity-list"),
    path("api/activities/<int:activity_id>/", ActivityDetail.as_view(), name="activity-detail"),
    path("api/achievements/<int:user_id>/", ClimbingAchievements.as_view(), name="activity_achievement"),
    path("api/users/profile/<int:user_id>/", UserProfile.as_view(), name="user_profile"),
]
