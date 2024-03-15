import { useNavigate } from 'react-router-dom';
import '../CSS/gamepinStyle.css';

import React, { useEffect, useState } from "react"

function generateGamepin() {
    const characters = '01234A5S6789M';
    const length = 5; // Lengte gamepin
    let pin = '#';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        pin += characters[randomIndex];
    }
    return pin;
}

export function Gamepin() {
    const [gamepin, setGamepin] = useState(generateGamepin());

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