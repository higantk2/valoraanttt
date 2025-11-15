import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function AgentDetail() {
  const { agentUuid } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const from = location.state?.from || '/home';

  useEffect(() => {
    async function fetchAgentDetail() {
      try {
        const url = `https://valorant-api.com/v1/agents/${agentUuid}`;
        const res = await axios.get(url);
        setAgent(res.data.data); 
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch agent details:", err);
        setError("Failed to load agent details. Please try again.");
        setLoading(false);
      }
    }
    fetchAgentDetail();
  }, [agentUuid]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  
  // --- Style for dynamic background ---
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "white",
    padding: "20px",
    backgroundImage: `linear-gradient(rgba(13, 13, 13, 0.85), rgba(13, 13, 13, 0.85)), url(${agent?.background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed"
  };
  // ----------------

  if (loading) {
    return <div style={{...containerStyle, backgroundImage: 'none'}}>
      <h1>Loading agent details...</h1>
    </div>;
  }

  if (error || !agent) {
    return <div style={{...containerStyle, color: "red", backgroundImage: 'none' }}>
      <h1>{error}</h1>
      <Link to={from} className="val-button">
        &lt; Back
      </Link>
    </div>;
  }

  return (
    <div style={containerStyle}>
      <header className="val-header" style={{marginBottom: 0}}>
        <Link to={from} className="val-button" style={{marginLeft: 0}}>
          &lt; Back
        </Link>
        <div className="val-header-nav">
            <button onClick={handleLogout} className="val-button">
                Logout
            </button>
        </div>
      </header>
      
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", gap: "30px", flexWrap: "wrap" }}>
        <img
          src={agent.fullPortrait}
          alt={agent.displayName}
          style={{ width: "300px", height: "auto", borderRadius: "8px" }}
        />
        <div className="val-detail-content" style={{maxWidth: '600px', margin: 0}}>
            <h1 style={{color: "#e63946"}}>{agent.displayName}</h1>
            <h3 style={{fontStyle: "italic"}}>{agent.role.displayName}</h3>
            <p>{agent.description}</p>
        </div>
      </div>
      
      <div className="val-detail-content" style={{marginTop: "30px"}}>
          <h2>Abilities</h2>
          {agent.abilities.map(ability => (
              <div key={ability.slot} className="val-ability-card">
                  {ability.displayIcon && (
                    <img src={ability.displayIcon} alt={ability.displayName} className="val-ability-icon" />
                  )}
                  <div>
                      <h4>{ability.displayName}</h4>
                      <p style={{fontSize: '14px', color: '#ccc'}}>{ability.description}</p>
                  </div>
              </div>
          ))}
      </div>

    </div>
  );
}