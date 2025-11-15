from django.urls import path
from .views import (
    FavoriteListCreate, 
    FavoriteDelete, 
    MostFavoritedAgentsView, 
    UserFavoritesSearchView,
    FavoriteWeaponListCreate, # <-- NEW
    FavoriteWeaponDelete      # <-- NEW
)

urlpatterns = [
    path("top/", MostFavoritedAgentsView.as_view(), name="most-favorited-agents"), 
    path("search/", UserFavoritesSearchView.as_view(), name="search-favorites"),

    # Agent Favorites
    path("", FavoriteListCreate.as_view(), name="favorite-list-create"),
    path("<int:pk>/", FavoriteDelete.as_view(), name="favorite-delete"),
    
    # NEW: Weapon Favorites
    path("weapons/", FavoriteWeaponListCreate.as_view(), name="favorite-weapon-list-create"),
    path("weapons/<int:pk>/", FavoriteWeaponDelete.as_view(), name="favorite-weapon-delete"),
]