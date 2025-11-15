import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../api"; // <-- ADDED

export default function FavoriteWeapons() {
  const [favorites, setFavorites] = useState([]);
  const [allWeapons, setAllWeapons] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchFavorites() {
      try {
        // External API
        const weaponsRes = await axios.get("https://valorant-api.com/v1/weapons");
        const weaponsMap = weaponsRes.data.data.reduce((map, weapon) => {
          map[weapon.uuid] = weapon;
          return map;
        }, {});
        setAllWeapons(weaponsMap);

        // Your backend
        const favoritesRes = await api.get("/api/favorites/weapons/", { // <-- CHANGED
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Failed to load favorite weapons", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchFavorites();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const removeFavorite = async (favId) => {
    try {
      await api.delete(`/api/favorites/weapons/${favId}/`, { // <-- CHANGED
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((fav) => fav.id !== favId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  if (loading) {
    return (
      <div className="val-container">
        <h1>Loading Favorite Weapons...</h1>
      </div>
    );
  }

  return (
    <div className="val-container">
      <header className="val-header" style={{borderColor: '#06d6a0'}}>
        <h1 style={{color: '#06d6a0'}}>My Favorite Weapons</h1>
        <div className="val-header-nav">
          <button onClick={handleLogout} className="val-button">
            Logout
          </button>
          <Link to="/home" className="val-button">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="val-grid" style={{marginTop: "30px"}}>
        {favorites.length > 0 ? (
          favorites.map((fav) => {
            const weaponData = allWeapons[fav.weapon_uuid];
            return weaponData ? (
              <div key={fav.id} className="val-card val-card-green">
                <Link to={`/weapon/${fav.weapon_uuid}`} state={{ from: '/favorite-weapons' }} style={{textDecoration: 'none'}}>
                  <div className="val-card-image-container" style={{height: '80px'}}>
                    <img
                      src={weaponData.displayIcon}
                      alt={weaponData.displayName}
                      className="val-card-weapon-image"
                    />
                  </div>
                  <h3>{weaponData.displayName}</h3>
                </Link>
                <button
                  onClick={() => removeFavorite(fav.id)}
                  className="val-button-fav remove-green"
                  style={{marginTop: "10px"}}
                >
                  Remove
                </button>
              </div>
            ) : null;
          })
        ) : (
          <p>You haven't favorited any weapons yet!</p>
        )}
      </div>
    </div>
  );
}