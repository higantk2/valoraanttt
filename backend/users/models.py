from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# --- Profile Model ---
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    main_agent_uuid = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

# --- UserFollow Model ---
class UserFollow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures a user can't follow the same person twice
        unique_together = ('user', 'following')

    def __str__(self):
        return f"{self.user.username} follows {self.following.username}"


# --- UPDATED, ROBUST SIGNAL ---
# This one signal replaces the two separate ones from before.
@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    if created:
        # If a new user is created, make a profile
        Profile.objects.create(user=instance)
    else:
        # If an existing user is saved (like admin login)
        # try to save their profile.
        try:
            instance.profile.save()
        except Profile.DoesNotExist:
            # If they don't have one (like your admin user!), create it.
            Profile.objects.create(user=instance)