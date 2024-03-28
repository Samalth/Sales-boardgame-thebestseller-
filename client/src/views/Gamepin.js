import { useNavigate } from 'react-router-dom';
import '../CSS/gamepinStyle.css';
import {socket} from '../client'
import React, { useEffect, useState } from "react"

export function Gamepin() {
    const [gamepin, setGamepin] = useState('');
    const navigate = useNavigate();
    const [playerCount, setPlayerCount] = useState(0);

    useEffect(() => {
        socket.on("send_gamepin", (data) => {
            setGamepin(data);
        });
    
        socket.on('add_user', () => {
            setPlayerCount(prevCount => prevCount + 1); // Update playerCount based on previous state
        });
        socket.on("delete_user", () => {
            setPlayerCount(prevCount => prevCount - 1); //Delete the player based on previous state
        })
    
        return () => {
            socket.off("send_gamepin");
            socket.off("add_user");
        };
    }, []);

    const handleGame = () => {
        navigate('/game');
    };
    const handleHome = () => {
        navigate('/home')
    }

    

    const handlePlayerCountChange = (event) => {
        setPlayerCount(parseInt(event.target.value));
    };
    const copygamepin = (event) => {
        event.target.select();
        document.execCommand('copy');
        // alert('copied gamepin');
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
