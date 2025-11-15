import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Weapons() {
  const [allWeapons, setAllWeapons] = useState([]); 
  const [filteredWeapons, setFilteredWeapons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  // This useEffect fetches the data just once
  useEffect(() => {
    axios
      .get("https://valorant-api.com/v1/weapons")
      .then((res) => {
        setAllWeapons(res.data.data);
        setFilteredWeapons(res.data.data); 
      });

    axios
      .get("http://127.0.0.1:8000/api/favorites/weapons/", { // <-- Use weapon endpoint
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavorites(res.data));
  }, [token]);

  // This useEffect runs every time the filters or the master list change
  useEffect(() => {
    let tempWeapons = [...allWeapons];

    // Filter by Search Term
    if (searchTerm) {
      tempWeapons = tempWeapons.filter((weapon) =>
        weapon.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredWeapons(tempWeapons);
  }, [searchTerm, allWeapons]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleFavorite = async (weapon) => {
    const exists = favorites.find((f) => f.weapon_uuid === weapon.uuid);
    
    if (exists) {
      await axios.delete(
        `http://127.0.0.1:8000/api/favorites/weapons/${exists.id}/`, // <-- Use weapon endpoint
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(favorites.filter((f) => f.weapon_uuid !== weapon.uuid));
    } else {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/favorites/weapons/", // <-- Use weapon endpoint
        { weapon_uuid: weapon.uuid, weapon_name: weapon.displayName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites([...favorites, res.data]);
    }
  };

  // --- Styles ---
  const cardStyle = {
    margin: "10px",
    border: "2px solid #06d6a0", // Changed color for variety
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    width: "140px",
    backgroundColor: "#1a1a1a",
    color: "white",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const cardHover = {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #06d6a0",
  };
  
  const searchInputStyle = {
    width: "100%",
    maxWidth: "400px",
    padding: "12px",
    borderRadius: "5px",
    border: "2px solid #06d6a0",
    background: "#1a1a1d",
    color: "white",
    fontSize: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        backgroundImage:
          "url('https://images4.alphacoders.com/126/thumb-1920-1264065.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        color: "white",
        padding: "20px",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Valorant Weapons</h1>
        <div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e63946",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
                    
          <Link to="/home">
            <button
              style={{
                backgroundColor: "#e63946",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Back to Home
            </button>
          </Link>
          
          <Link to="/profile">
            <button
              style={{
                backgroundColor: "#06d6a0",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Profile
            </button>
          </Link>
        </div>
      </header>
      
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search weapons..."
          style={searchInputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 style={{ marginTop: "20px" }}>All Weapons</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        
        {filteredWeapons.length > 0 ? (
          filteredWeapons.map((weapon) => {
            const isFav = favorites.some((f) => f.weapon_uuid === weapon.uuid);
            return (
              <div
                key={weapon.uuid}
                style={cardStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, cardHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, cardStyle)
                }
              >
                  <img
                    src={weapon.displayIcon}
                    alt={weapon.displayName}
                    width="100"
                    height="100"
                    style={{ borderRadius: "5px", filter: 'invert(1)', height: '50px' }}
                  />
                  <p style={{ fontWeight: "bold" }}>{weapon.displayName}</p>

                <button
                  onClick={() => toggleFavorite(weapon)}
                  style={{
                    backgroundColor: isFav ? "#f1faee" : "#06d6a0",
                    color: isFav ? "#06d6a0" : "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  {isFav ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            );
          })
        ) : (
          <p>No weapons match your criteria.</p>
        )}
      </div>
    </div>
  );
}