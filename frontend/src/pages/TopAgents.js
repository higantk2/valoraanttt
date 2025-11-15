import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TopAgents() {
  const [topAgents, setTopAgents] = useState([]);
  const [allAgents, setAllAgents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopAgents() {
      try {
        const agentsRes = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
        );
        const agentsMap = agentsRes.data.data.reduce((map, agent) => {
          map[agent.uuid] = agent;
          return map;
        }, {});
        setAllAgents(agentsMap);

        const topRes = await axios.get("http://127.0.0.1:8000/api/favorites/top/");
        setTopAgents(topRes.data);
      } catch (err) {
        console.error("Failed to load top agents", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopAgents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="val-container">
        <h1>Loading Top Agents...</h1>
      </div>
    );
  }

  return (
    <div className="val-container">
      <header className="val-header">
        <h1>Top Favorited Agents</h1>
        <div className="val-header-nav">
          <button onClick={handleLogout} className="val-button">
            Logout
          </button>
          <Link to="/home" className="val-button">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="val-grid">
        {topAgents.length > 0 ? (
          topAgents.map((agent, index) => {
            const agentData = allAgents[agent.agent_uuid];
            return agentData ? (
              <div key={agent.agent_uuid} className="val-card">
                <Link to={`/agent/${agent.agent_uuid}`} state={{ from: '/top-agents' }} style={{textDecoration: 'none'}}>
                  <h2 style={{ color: "#ff4655" }}>#{index + 1}</h2>
                  <div className="val-card-image-container">
                    <img
                      src={agentData.displayIcon}
                      alt={agentData.displayName}
                      className="val-card-image"
                    />
                  </div>
                  <h3>{agentData.displayName}</h3>
                </Link>
                <p className="val-card-leaderboard-count">{agent.count} Favorites</p>
              </div>
            ) : null;
          })
        ) : (
          <p>No agents have been favorited yet!</p>
        )}
      </div>
    </div>
  );
}