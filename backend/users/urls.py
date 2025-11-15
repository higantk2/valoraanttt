from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import (
    RegisterView, 
    MyTokenObtainPairView, 
    ProfileView, 
    ChangePasswordView,
    ProfileUpdateView,  # <-- NEW
    FollowUserView,     # <-- NEW
    UnfollowUserView,   # <-- NEW
    FollowingListView   # <-- NEW
)

urlpatterns = [
    # Registration endpoint
    path("register/", RegisterView.as_view(), name="register"),

    # Login & JWT tokens
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Profile endpoints
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("profile/update/", ProfileUpdateView.as_view(), name="user-profile-update"), # <-- NEW
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),

    # --- NEW FOLLOW URLS ---
    path("follow/", FollowUserView.as_view(), name="follow-user"),
    path("unfollow/", UnfollowUserView.as_view(), name="unfollow-user"),
    path("following/", FollowingListView.as_view(), name="following-list"),
]