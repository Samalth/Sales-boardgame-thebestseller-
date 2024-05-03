import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/settings.css';
import {socket} from '../client'

export function ModSettings() {
  const [playerCount, setPlayerCount] = useState(2);
  const [roundsCount, setRoundsCount] = useState(5);
  const navigate = useNavigate();

  const createRoom = () => {
    socket.emit("create_room", { playerCount, roundsCount });
  }
  const handleGame = () => {
      navigate('/Gamepin');
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handlePlayerCountChange = (event) => {
    setPlayerCount(parseInt(event.target.value));
  };

  const handleRoundsCountChange = (event) => {
    setRoundsCount(parseInt(event.target.value));
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

  const decrementRoundsCount = () => {
    if (roundsCount > 3) {
      setRoundsCount(roundsCount - 1);
    }
  };

  const incrementRoundsCount = () => {
    if (roundsCount < 30) {
        setRoundsCount(roundsCount + 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    createRoom()
    handleGame()
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="settings text">Players</div>
        <div className="player minus" onClick={decrementPlayerCount}>-</div>
        <input id="playerCount" name="playerCount" className="player count" value={playerCount} onChange={handlePlayerCountChange} />
        <div className="player plus" onClick={incrementPlayerCount}>+</div>
      </div>
      <div className="row">
        <div className="settings text">Rounds</div>
        <div className="rounds minus" onClick={decrementRoundsCount}>-</div>
        <input id="roundsCount" name="roundsCount" className="rounds count" value={roundsCount} onChange={handleRoundsCountChange} />
        <div className="rounds plus" onClick={incrementRoundsCount}>+</div>
      </div>
      <div className="row">
        <input type="submit" className="button continue" value="Continue"/>
        <button type="button" className="button continue" onClick={handleHome}>Home</button>
      </div>
    </form>
  );
};