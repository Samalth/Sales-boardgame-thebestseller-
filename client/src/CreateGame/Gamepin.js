import { useNavigate } from 'react-router-dom';
import './gamepinStyle.css';
import {socket} from '../client'
import React, { useEffect, useState } from "react"
import back from "../Assets/back-button.png";

export function Gamepin() {
    const [gamepin, setGamepin] = useState('');
    const navigate = useNavigate();
    const [playerCount, setPlayerCount] = useState(0);
    const [playerNeeded, setPlayerNeeded] = useState(0);
    const [errorCode, setErrorCode] = useState('');

    useEffect(() => {
        socket.on("send_gamepin", (data) => {
            setGamepin(data.room);
            setPlayerNeeded(data.playerTotal);
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
        if (playerCount === playerNeeded) {
            socket.emit('start_turn', 'data')
            navigate('/modview');
        } else if (playerCount < playerNeeded) {
            setErrorCode('Not enough players')
        } else {
            setErrorCode('Too many players')
        }

    };

    const handleHome = () => {
        navigate('/home')
    }

    const handleBack = () => {
        navigate('/configuration')
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
            <button className='Home' type="button" onClick={handleBack}>
                <img src={back} alt='Home' className='home-image'/>
            </button>
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
                <div className="row">{errorCode}</div>
        </div>
);
}