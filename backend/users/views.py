from rest_framework import generics, permissions, status
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

# Import from the favorites app to get the count
from favorites.models import Favorite 
# Import our new models and serializers
from .models import Profile, UserFollow
from .serializers import UserSerializer, ChangePasswordSerializer, ProfileSerializer 

# ------------------------------
# User Serializer (Note: This is also in serializers.py, but your original file had it here. Keeping your structure.)
# ------------------------------
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# ------------------------------
# Register View
# ------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# ------------------------------
# JWT Login View (using SimpleJWT)
# ------------------------------
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ------------------------------
# UPDATED: Get User Profile View
# ------------------------------
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        favorites_count = Favorite.objects.filter(user=user).count()
        
        # Get profile data (guaranteed to exist by the signal)
        profile_data = ProfileSerializer(user.profile).data 
        
        # Get follow counts
        followers_count = UserFollow.objects.filter(following=user).count()
        following_count = UserFollow.objects.filter(user=user).count()

        data = {
            'username': user.username,
            'favorites_count': favorites_count,
            'profile': profile_data,  # <-- NESTED profile data
            'followers_count': followers_count, # <-- NEW
            'following_count': following_count  # <-- NEW
        }
        return Response(data, status=status.HTTP_200_OK)

# --- NEW: Update User Profile View ---
class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile # Get the profile of the logged-in user

# ------------------------------
# Change Password View
# ------------------------------
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- NEW: Follow/Unfollow Views ---

class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        username_to_follow = request.data.get('username')
        if not username_to_follow:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_to_follow = User.objects.get(username=username_to_follow)
            if user_to_follow == request.user:
                return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create the follow relationship
            UserFollow.objects.get_or_create(user=request.user, following=user_to_follow)
            return Response({"status": "followed"}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class UnfollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        username_to_unfollow = request.data.get('username')
        if not username_to_unfollow:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_unfollow = User.objects.get(username=username_to_unfollow)
            # Find and delete the relationship
            follow_instance = UserFollow.objects.filter(user=request.user, following=user_to_unfollow)
            if follow_instance.exists():
                follow_instance.delete()
                return Response({"status": "unfollowed"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "You are not following this user"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# NEW VIEW TO GET LIST OF WHO THE USER FOLLOWS
class FollowingListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        following_list = UserFollow.objects.filter(user=request.user).values_list('following__username', flat=True)
        return Response(list(following_list), status=status.HTTP_200_OK)