from rest_framework import serializers
from .models import Favorite, FavoriteWeapon  # <-- Updated import

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "agent_uuid", "agent_name"]

# --- NEW SERIALIZER ---
class FavoriteWeaponSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteWeapon
        fields = ["id", "weapon_uuid", "weapon_name"]