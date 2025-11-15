import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [allAgents, setAllAgents] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const agentsRes = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
        );
        const agentsMap = agentsRes.data.data.reduce((map, agent) => {
          map[agent.uuid] = agent;
          return map;
        }, {});
        setAllAgents(agentsMap);

        const favoritesRes = await axios.get("http://127.0.0.1:8000/api/favorites/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error("Failed to load favorites", err);
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
      await axios.delete(`http://127.0.0.1:8000/api/favorites/${favId}/`, {
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
        <h1>Loading Favorites...</h1>
      </div>
    );
  }

  return (
    <div className="val-container">
      <header className="val-header">
        <h1>My Favorite Agents</h1>
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
            const agentData = allAgents[fav.agent_uuid];
            return agentData ? (
              <div key={fav.id} className="val-card">
                <Link to={`/agent/${fav.agent_uuid}`} state={{ from: '/favorites' }} style={{textDecoration: 'none'}}>
                  <div className="val-card-image-container">
                    <img
                      src={agentData.displayIcon}
                      alt={agentData.displayName}
                      className="val-card-image"
                    />
                  </div>
                  <h3>{agentData.displayName}</h3>
                </Link>
                <button
                  onClick={() => removeFavorite(fav.id)}
                  className="val-button-fav remove"
                  style={{marginTop: "10px"}}
                >
                  Remove
                </button>
              </div>
            ) : null;
          })
        ) : (
          <p>You haven't favorited any agents yet!</p>
        )}
      </div>
    </div>
  );
}