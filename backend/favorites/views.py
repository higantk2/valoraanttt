from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from django.contrib.auth.models import User
from .models import Favorite, FavoriteWeapon # <-- Updated import
from .serializers import FavoriteSerializer, FavoriteWeaponSerializer # <-- Updated import

class FavoriteListCreate(generics.ListCreateAPIView):
    # ... (existing code) ...
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteDelete(generics.DestroyAPIView):
    # ... (existing code) ...
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

# --- NEW: WEAPON FAVORITE VIEWS ---

class FavoriteWeaponListCreate(generics.ListCreateAPIView):
    serializer_class = FavoriteWeaponSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteWeapon.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteWeaponDelete(generics.DestroyAPIView):
    serializer_class = FavoriteWeaponSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteWeapon.objects.filter(user=self.request.user)

# --- (existing views below) ---

class MostFavoritedAgentsView(APIView):
    # ... (existing code) ...
    permission_classes = [permissions.AllowAny] 

    def get(self, request, format=None):
        top_agents = Favorite.objects.values(
            'agent_name', 
            'agent_uuid'
        ).annotate(
            count=Count('agent_name')
        ).order_by('-count')[:10]

        return Response(top_agents, status=status.HTTP_200_OK)

class UserFavoritesSearchView(APIView):
    permission_classes = [permissions.AllowAny] # Publicly searchable

    def get(self, request, format=None):
        username = request.query_params.get('username', None)
        if not username:
            return Response(
                {"error": "A 'username' query parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find the user (case-insensitive search)
        user = User.objects.filter(username__iexact=username).first()
        
        if not user:
            return Response(
                {"error": "User not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Get that user's favorites
        favorites = Favorite.objects.filter(user=user)
        serializer = FavoriteSerializer(favorites, many=True)
        
        # Return the username and their favorites list
        return Response(
            {'username': user.username, 'favorites': serializer.data}, 
            status=status.HTTP_200_OK
        )