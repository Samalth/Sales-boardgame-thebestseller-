import { useNavigate } from 'react-router-dom';
import '../CSS/gamepinStyle.css';

import React, { useEffect, useState } from "react"

export function Gamepin() {
    const [gamepin, setGamepin] = useState("#07063");
    const [username, setUsername] = useState("Username");

    const navigate = useNavigate();

    const handleGame = () => {
        navigate('/game');
    };
    const handleHome = () => {
        navigate('/home')
    }


    const [playerCount, setPlayerCount] = useState(0);

    const handlePlayerCountChange = (event) => {
        setPlayerCount(parseInt(event.target.value));
    };
    const copygamepin = (event) => {
        event.target.select();
        // Copy the selected text
        document.execCommand('copy');
        alert('copied gamepin');
    };

    return (
        <div className="parent-container">
            <div className="row gamepin">
                <label>Gamepin:</label>
                <input type="text" className='gamepinGenerate' value={gamepin} onClick={copygamepin} readOnly
                       onChange={event => setGamepin(event.target.value)}/>
            </div>

            <div className="row">
                <label>Players:</label>
                <div className="row gamepin"></div>
                <input id="playerCount" name="playerCount" className="joinedPlayers" value={playerCount} readOnly
                       onChange={handlePlayerCountChange}/>
            </div>

            <div className="row">
            <input type="submit" className="gamePinButton" value="Start!" onClick={handleGame}/>
                <input type="submit" className="gamePinButton" value="Home" onClick={handleHome}/>
            </div>
        </div>
    );
}