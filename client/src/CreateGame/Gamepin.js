import { useNavigate } from 'react-router-dom';
import './gamepinStyle.css';
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
            setPlayerCount(prevCount => prevCount + 1);
        });
        socket.on("delete_user", () => {
            setPlayerCount(prevCount => prevCount - 1);
        })
        return () => {
            socket.off("send_gamepin");
            socket.off("add_user");
        };
    }, []);

    const handleGame = () => {
        socket.emit('start_turn', 'data')
        navigate('/modview');
    };

    const handleHome = () => {
        navigate('/home')
    }

    const handlePlayerCountChange = (event) => {
        setPlayerCount(parseInt(event.target.value));
    };

    const copyGamePin = (event) => {
        event.target.select();
        document.execCommand('copy');
        // alert('copied gamepin');
    };

    return (
        <div className="parent-container">
            <div className="row gamepin">
                <label>Gamepin:</label>
                <input type="text" className='gamepinGenerate' value={gamepin} onClick={copyGamePin} readOnly
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
