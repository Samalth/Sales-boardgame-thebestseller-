import { useNavigate } from 'react-router-dom';
import '../CSS/gamepinStyle.css';
import React, { useEffect, useState } from "react"


export function Gamepin() {
    const [gamepin, setGamepin] = useState("#07063");
    const [username, setUsername] = useState("MarketMogul");

    const navigate = useNavigate();

    const handleGame = () => {
        // Navigate to the '/game' route
        navigate('/game');
    };
    const handleHome = () => {
        navigate('/home')
    }
    const emptyPin = () => {
        setGamepin("")
    }
    const emptyUsername = () => {
        setUsername("")
    }

    const [playerCount, setPlayerCount] = useState(0);

    const handlePlayerCountChange = (event) => {
        setPlayerCount(parseInt(event.target.value));
    };

    const decrementPlayerCount = () => {
        if (playerCount > 2) {
            setPlayerCount(playerCount - 1);
        }
    };

    const incrementPlayerCount = () => {
        if (playerCount < 6) {
            setPlayerCount(playerCount + 1);
        }
    };

    return (
        <div className="parent-container">
            <div className="row gamepin">
                <label>Gamepin:</label>
                <input type="text" className='gamepinGenerate' value={gamepin} onClick={emptyPin}
                       onChange={event => setGamepin(event.target.value)}/>
            </div>

            <div className="row">
                <label>Players:</label>
                <div className="row gamepin"></div>
                <input id="playerCount" name="playerCount" className="joinedPlayers" value={playerCount}
                       onChange={handlePlayerCountChange}/>
            </div>

            <div className="row">
            <input type="submit" className="gamePinButton" value="Start!" onClick={handleGame}/>
                <input type="submit" className="gamePinButton" value="Home" onClick={handleHome}/>
            </div>
        </div>
    );
}